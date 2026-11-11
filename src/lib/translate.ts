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

// Parses Google clients5 Chrome extension translate response
function parseClients5(d: any): string {
  if (!d) return "";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) {
    if (d.length > 0 && Array.isArray(d[0])) {
      return d.map((item) => (Array.isArray(item) ? item[0] : item) || "").join("");
    }
    if (typeof d[0] === "string") {
      return d.join("");
    }
  }
  return "";
}

// Parses Google Android translate response
function parseAt(d: any): string {
  if (Array.isArray(d) && Array.isArray(d[0])) {
    return d[0].map((part) => (Array.isArray(part) ? part[0] : part) || "").join("");
  }
  return "";
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// Concurrency limiter so we don't fire 100 simultaneous requests and get rate limited
async function mapConcurrent<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// Free multi-tier translation engine (works for all 45 languages without any API key)
export async function freeTranslate(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return text;
  const langCode = targetLang === "zh" ? "zh-CN" : targetLang === "nb" ? "no" : targetLang;

  // Tier 1: Google Chrome Extension API
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(langCode)}&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const parsed = parseClients5(data);
      if (parsed && parsed.trim()) return parsed;
    }
  } catch {}

  // Tier 2: Google Android Translate API
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=at&sl=auto&tl=${encodeURIComponent(langCode)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "GoogleTranslate/6.28.0.05.357902403 (Linux; U; Android 11; Pixel 5)",
      },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const parsed = parseAt(data);
      if (parsed && parsed.trim()) return parsed;
    }
  } catch {}

  // Tier 3: MyMemory API
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${encodeURIComponent(langCode)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && typeof translated === "string" && translated.trim() && !translated.startsWith("'AUTO' IS AN INVALID")) {
        return decodeHtmlEntities(translated);
      }
    }
  } catch {}

  return text;
}

async function translateItemsFree(items: ListItem[], langCode: string): Promise<ListItem[]> {
  const code = langCode === "zh" ? "zh-CN" : langCode === "nb" ? "no" : langCode;
  return mapConcurrent(items, 5, async (item) => {
    try {
      const [subject, snippet] = await Promise.all([
        freeTranslate(item.subject, code).catch(() => item.subject),
        freeTranslate(item.snippet, code).catch(() => item.snippet),
      ]);
      return { id: item.id, subject: subject || item.subject, snippet: snippet || item.snippet };
    } catch {
      return item;
    }
  });
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

// Splits long bodies on paragraph/sentence breaks so each request stays well within limits.
function chunks(text: string, size = 1200): string[] {
  if (!text) return [];
  if (text.length <= size) return [text];

  const out: string[] = [];
  const paragraphs = text.split(/\n+/);
  let current = "";

  for (const para of paragraphs) {
    if (para.length > size) {
      if (current) {
        out.push(current);
        current = "";
      }
      const sentences = para.match(/[^.!?]+[.!?]+|\S+/g) || [para];
      let subCurrent = "";
      for (const s of sentences) {
        if (subCurrent && subCurrent.length + s.length > size) {
          out.push(subCurrent);
          subCurrent = "";
        }
        if (s.length > size) {
          for (let i = 0; i < s.length; i += size) {
            out.push(s.slice(i, i + size));
          }
        } else {
          subCurrent += (subCurrent ? " " : "") + s;
        }
      }
      if (subCurrent) out.push(subCurrent);
    } else {
      if (current && current.length + para.length + 1 > size) {
        out.push(current);
        current = "";
      }
      current += (current ? "\n" : "") + para;
    }
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
        ...chunks(body, 5000).map(translateText),
      ]);
      return { subject: translatedSubject, body: parts.join("\n\n") };
    } catch (e) {
      console.warn("Claude body translation failed, falling back to free translation", e);
    }
  }

  // Free translation fallback
  const bodyChunks = chunks(body, 1200);
  const translatedSubject = await freeTranslate(subject, code).catch(() => subject);
  const parts = await mapConcurrent(bodyChunks, 3, (chunk) => freeTranslate(chunk, code).catch(() => chunk));
  return { subject: translatedSubject, body: parts.join("\n\n") };
}
