export type Mail = {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  date: string;
  link: string;
};

const API = "https://gmail.googleapis.com/gmail/v1/users/me";

async function gmail(path: string, accessToken: string) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Gmail API ${res.status}: ${await res.text()}`);
  return res.json();
}

function header(headers: { name: string; value: string }[], name: string) {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

const INBOX_QUERY = (days: number) => encodeURIComponent(`in:inbox newer_than:${days}d -category:promotions`);

// Cheap check used every minute: just the ids of the newest inbox messages, no content.
export async function latestMailIds(accessToken: string, max = 15): Promise<string[]> {
  const list = await gmail(`/messages?maxResults=${max}&q=${INBOX_QUERY(14)}`, accessToken);
  return (list.messages ?? []).map((m: { id: string }) => m.id);
}

// Fetches recent inbox mail (subject, sender, snippet only — never full bodies).
export async function fetchRecentMail(accessToken: string, days = 14, max = 60): Promise<Mail[]> {
  const list = await gmail(`/messages?maxResults=${max}&q=${INBOX_QUERY(days)}`, accessToken);
  const ids: string[] = (list.messages ?? []).map((m: { id: string }) => m.id);

  return Promise.all(
    ids.map(async (id) => {
      const m = await gmail(
        `/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
        accessToken,
      );
      const h = m.payload?.headers ?? [];
      const from = header(h, "From");
      const fromEmail = (from.match(/<([^>]+)>/)?.[1] ?? from).toLowerCase().trim();
      return {
        id,
        from: from.replace(/<[^>]+>/, "").replace(/"/g, "").trim() || fromEmail,
        fromEmail,
        subject: header(h, "Subject") || "(no subject)",
        snippet: decodeEntities(m.snippet ?? ""),
        date: new Date(Number(m.internalDate)).toISOString(),
        link: `https://mail.google.com/mail/u/0/#inbox/${id}`,
      };
    }),
  );
}

export class ScopeError extends Error {}

// Moves messages to Gmail Trash (recoverable for 30 days). Returns the ids that succeeded.
export async function trashMessages(accessToken: string, ids: string[]) {
  const results = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${API}/messages/${id}/trash`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 403 && (await res.text()).includes("insufficient")) throw new ScopeError("Missing gmail.modify scope");
      return res.ok ? id : null;
    }),
  );
  const trashed = results.filter((id): id is string => id !== null);
  return { trashed, failed: ids.filter((id) => !trashed.includes(id)) };
}

type Part ={ mimeType?: string; body?: { data?: string }; parts?: Part[] };

function findPart(part: Part, mime: string): string | null {
  if (part.mimeType === mime && part.body?.data) return Buffer.from(part.body.data, "base64url").toString("utf8");
  for (const p of part.parts ?? []) {
    const found = findPart(p, mime);
    if (found) return found;
  }
  return null;
}

function htmlToText(html: string) {
  return decodeEntities(
    html
      .replace(/<(style|script)[\s\S]*?<\/\1>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " "),
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Full plain-text body of one message (falls back to stripped HTML).
export async function fetchMailBody(accessToken: string, id: string): Promise<string> {
  const m = await gmail(`/messages/${id}?format=full`, accessToken);
  const plain = findPart(m.payload, "text/plain");
  if (plain?.trim()) return plain.replace(/\r\n/g, "\n").trim();
  const html = findPart(m.payload, "text/html");
  return html ? htmlToText(html) : decodeEntities(m.snippet ?? "");
}

// Sends an email via Gmail. Returns the message id on success.
export async function sendMail(
  accessToken: string,
  to: string,
  subject: string,
  body: string,
  cc?: string,
  bcc?: string,
): Promise<string> {
  const lines = [
    `To: ${to}`,
    cc ? `Cc: ${cc}` : "",
    bcc ? `Bcc: ${bcc}` : "",
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ]
    .filter(Boolean)
    .join("\r\n");

  const raw = Buffer.from(lines).toString("base64url");
  const res = await fetch(`${API}/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (res.status === 403 && (await res.clone().text()).includes("insufficient")) {
    throw new ScopeError("Missing gmail.send scope");
  }
  if (!res.ok) throw new Error(`Gmail API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.id;
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
