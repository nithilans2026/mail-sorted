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

// Subjects and previews for the inbox list, all in one request.
export async function translateList(items: ListItem[], language: string): Promise<ListItem[]> {
  if (items.length === 0) return [];
  const response = await client().messages.parse({
    model: MODEL(),
    max_tokens: 16000,
    system: `${rules(language)}\nYou receive a JSON list of emails. Translate each subject and snippet, keeping every id.`,
    output_config: { effort: "low", format: zodOutputFormat(ListResult) },
    messages: [{ role: "user", content: JSON.stringify(items) }],
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) throw new Error("Translation failed");
  return response.parsed_output.items;
}

// Splits long bodies on paragraph breaks so each request stays well within output limits.
function chunks(text: string, size = 6000) {
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
export async function translateBody(subject: string, body: string, language: string) {
  const anthropic = client();
  const translateText = async (text: string) => {
    const response = await anthropic.messages.create({
      model: MODEL(),
      max_tokens: 16000,
      system: `${rules(language)}\nReply with the translation only.`,
      output_config: { effort: "low" },
      messages: [{ role: "user", content: text }],
    });
    if (response.stop_reason === "refusal") throw new Error("Translation failed");
    return response.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  };

  const [translatedSubject, ...parts] = await Promise.all([translateText(subject), ...chunks(body).map(translateText)]);
  return { subject: translatedSubject, body: parts.join("\n\n") };
}
