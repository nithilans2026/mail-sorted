import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

// Sonnet gives noticeably better translations than Haiku, especially for Tamil, Hindi, Telugu and Malayalam.
const MODEL = () => process.env.CLAUDE_TRANSLATE_MODEL || "claude-sonnet-5-5";

export class NoKeyError extends Error {}

function client() {
  if (!process.env.ANTHROPIC_API_KEY) throw new NoKeyError("ANTHROPIC_API_KEY is not set");
  return new Anthropic();
}

const rules = (language: string) => `Translate the email text you are given into ${language}.
- Translate faithfully and completely: do not summarize, shorten, explain or add anything.
- Keep unchanged: people's names, email addresses, URLs, phone numbers, course codes (e.g. BCSE301L),
  slot codes (e.g. A1+TA1), room and block numbers, registration numbers, and product or event names.
- Keep dates and times exactly as written, but translate month and weekday words.
- Keep the original line breaks and list structure.
- If the text is already in ${language}, return it unchanged.`;

const ListResult = z.object({
  items: z.array(z.object({ id: z.string(), subject: z.string(), snippet: z.string() })),
});

export type ListItem = z.infer<typeof ListResult>["items"][number];

// Free Google Translate endpoint (works for all 45 languages without an API key)
async function freeTranslate(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return text;
  const langCode = targetLang === "zh" ? "zh-CN" : targetLang === "nb" ? "no" : targetLang;
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(langCode)}&dt=t&q=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" }
    );
    if (!res.ok) throw new Error(`Translate API returned ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((part: any) => part[0] || "").join("");
    }
  } catch (err) {
    console.warn("Free translation request failed:", err);
  }
  return text;
}

async function translateItemsFree(items: ListItem[], langCode: string): Promise<ListItem[]> {
  const code = langCode === "zh" ? "zh-CN" : langCode === "nb" ? "no" : langCode;
  return Promise.all(
    items.map(async (item) => {
      try {
        const [subject, snippet] = await Promise.all([
          freeTranslate(item.subject, code).catch(() => item.subject),
          freeTranslate(item.snippet, code).catch(() => item.snippet),
        ]);
        return { id: item.id, subject: subject || item.subject, snippet: snippet || item.snippet };
      } catch {
        return item;
      }
    })
  );
}

// Subjects and previews for the inbox list. Tries Claude first if key is present, falls back to free translation.
export async function translateList(items: ListItem[], langCode: string, languageName?: string): Promise<ListItem[]> {
  if (items.length === 0) return [];
  const code = langCode === "zh" ? "zh-CN" : langCode === "nb" ? "no" : langCode;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await client().messages.parse({
        model: MODEL(),
        max_tokens: 16000,
        system: `${rules(languageName || langCode)}\nYou receive a JSON list of emails. Translate each subject and snippet, keeping every id.`,
        output_config: { effort: "low", format: zodOutputFormat(ListResult) },
        messages: [{ role: "user", content: JSON.stringify(items) }],
      });
      if (response.stop_reason !== "refusal" && response.parsed_output) {
        return response.parsed_output.items;
      }
    } catch (e) {
      console.warn("Claude translation failed, falling back to free translation", e);
    }
  }

  return translateItemsFree(items, code);
}

// Splits long bodies on paragraph breaks so each request stays well within output limits.
function chunks(text: string, size = 3000) {
  const out: string[] = [];
  let current = "";
  for (const para of text.split(/\n{2,}/)) {
    if (current && current.length + para.length > size) {
      out.push(current);
      current = "";
    }
    current += (current ? "\n\n" : "") + para;
  }
  if (current) out.push(current);
  return out;
}

// Full email body, translated piece by piece and joined back together.
export async function translateBody(subject: string, body: string, langCode: string, languageName?: string) {
  const code = langCode === "zh" ? "zh-CN" : langCode === "nb" ? "no" : langCode;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const anthropic = client();
      const translateText = async (text: string) => {
        const response = await anthropic.messages.create({
          model: MODEL(),
          max_tokens: 16000,
          system: `${rules(languageName || langCode)}\nReply with the translation only.`,
          output_config: { effort: "low" },
          messages: [{ role: "user", content: text }],
        });
        if (response.stop_reason === "refusal") throw new Error("Translation failed");
        return response.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
      };

      const [translatedSubject, ...parts] = await Promise.all([
        translateText(subject),
        ...chunks(body, 6000).map(translateText),
      ]);
      return { subject: translatedSubject, body: parts.join("\n\n") };
    } catch (e) {
      console.warn("Claude body translation failed, falling back to free translation", e);
    }
  }

  // Free translation fallback
  const bodyChunks = chunks(body, 2000);
  const [translatedSubject, ...parts] = await Promise.all([
    freeTranslate(subject, code).catch(() => subject),
    ...bodyChunks.map((chunk) => freeTranslate(chunk, code).catch(() => chunk)),
  ]);
  return { subject: translatedSubject, body: parts.join("\n\n") };
}
