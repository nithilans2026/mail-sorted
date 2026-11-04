import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { Mail } from "./gmail";

export const CATEGORIES = ["transport", "timetable", "exams", "assignments", "opportunities", "campus", "review", "other"] as const;
export type Category = (typeof CATEGORIES)[number];

export type SortedMail = Mail & {
  category: Category;
  deadline: string | null;
  source: "rule" | "ai" | "none";
};

// Keyword rules: cheap, instant, and cover most university mail. Order matters — first match wins.
const RULES: { category: Category; pattern: RegExp }[] = [
  { category: "transport", pattern: /\b(bus|buses|route|transport|shuttle|pickup|drop|boarding|bus pass)\b/i },
  { category: "exams", pattern: /\b(exams?|examinations?|cat-?(i|ii|1|2)\b|fat\b|hall ?tickets?|seating (arrangement|plan)|mid-?terms?|end-?sem(ester)?|re-?exams?|arrears?|quiz(zes)?|viva)\b/i },
  { category: "timetable", pattern: /\b(time ?table|slot|class(es)? (cancel|resched)|reschedul|academic calendar|ffcs|registration of courses)\b/i },
  { category: "opportunities", pattern: /\b(hackathon|webinar|workshop|internship|coding contest|ideathon|bootcamp|call for papers|unstop|devfolio)\b/i },
  { category: "assignments", pattern: /\b(assignments?|digital assignment|da-?[1-3]|homework|submission|submit (your|the)|lab (record|report|manual)|mini[- ]project|project (review|report|submission)|term paper|case study|due (date|by|on))\b/i },
  { category: "campus", pattern: /\b(techno ?vit|vibrance|club|expo|open day|guest lecture|fest|symposium|orientation|cultural|chapter|seminar)\b/i },
];

function ruleCategory(mail: Mail): Category | null {
  const text = `${mail.subject} ${mail.snippet}`;
  return RULES.find((r) => r.pattern.test(text))?.category ?? null;
}

const AiResult = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      category: z.enum(CATEGORIES),
      deadline: z.string().nullable(),
    }),
  ),
});

const SYSTEM = `You sort emails for a college or university student. For each email give one category:
- transport: college bus routes, timings, transport fees, shuttle changes
- timetable: class slots, cancellations, academic calendar, course registration
- exams: exam schedules and timetables (CAT, FAT, quizzes, labs, viva), hall tickets, seating plans, re-exams, results
- assignments: class assignments and coursework: digital assignments (DA), homework, lab records, project reviews and reports, submission reminders
- opportunities: hackathons, webinars, workshops, internships, competitions (on or off campus)
- campus: student events, club expos, open days, tech/cultural fests, guest lectures
- review: looks important to a student but fits none of the above (fees, hostel, official notices)
- other: newsletters, marketing, social notifications, anything a student can safely skip
deadline: the registration deadline, submission due date, event date or first exam date as YYYY-MM-DD if the email states one, else null.`;

async function aiCategorize(mails: Mail[]) {
  if (!process.env.ANTHROPIC_API_KEY || mails.length === 0) return new Map();
  const client = new Anthropic();
  const payload = mails.map((m) => ({ id: m.id, from: m.from, subject: m.subject, snippet: m.snippet, received: m.date }));

  const response = await client.messages.parse({
    model: process.env.CLAUDE_MODEL || "claude-haiku-5-5",
    max_tokens: 16000,
    system: SYSTEM,
    output_config: { effort: "low", format: zodOutputFormat(AiResult) },
    messages: [{ role: "user", content: JSON.stringify(payload) }],
  });

  // A refusal or parse failure just leaves those mails in "review".
  if (response.stop_reason === "refusal" || !response.parsed_output) return new Map();
  return new Map(response.parsed_output.results.map((r) => [r.id, r]));
}

export async function categorize(mails: Mail[], blockedSenders: Set<string>): Promise<SortedMail[]> {
  const visible = mails.filter((m) => !blockedSenders.has(m.fromEmail));
  const sorted: SortedMail[] = visible.map((m) => {
    const cat = ruleCategory(m);
    return { ...m, category: cat ?? "review", deadline: null, source: cat ? "rule" : "none" };
  });

  // Send unmatched mails, plus exam/opportunity/campus mails (for dates), to Claude in one call.
  const withDates: Category[] = ["exams", "assignments", "opportunities", "campus"];
  const forAi = sorted.filter((m) => m.source === "none" || withDates.includes(m.category));
  try {
    const ai = await aiCategorize(forAi);
    for (const m of sorted) {
      const r = ai.get(m.id);
      if (!r) continue;
      if (m.source === "none") {
        m.category = r.category;
        m.source = "ai";
      }
      m.deadline = r.deadline;
    }
  } catch (err) {
    console.error("AI categorization failed; using rules only", err);
  }
  return sorted;
}
