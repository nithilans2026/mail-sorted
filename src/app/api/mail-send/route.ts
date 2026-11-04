import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sendMail, ScopeError } from "@/lib/gmail";

export const dynamic = "force-dynamic";

// POST { to, subject, body, cc?, bcc? } -> { id } or { error }
export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (session.error === "RefreshFailed") return NextResponse.json({ error: "Please sign in again" }, { status: 401 });

  const { to, subject, body, cc, bcc } = (await req.json().catch(() => ({}))) as {
    to?: string;
    subject?: string;
    body?: string;
    cc?: string;
    bcc?: string;
  };

  if (!to?.trim()) return NextResponse.json({ error: "Recipient (to) is required" }, { status: 400 });
  if (!subject?.trim() && !body?.trim()) return NextResponse.json({ error: "Subject or body is required" }, { status: 400 });

  try {
    const id = await sendMail(session.accessToken, to.trim(), subject ?? "", body ?? "", cc?.trim(), bcc?.trim());
    return NextResponse.json({ id });
  } catch (err: any) {
    if (err instanceof ScopeError) return NextResponse.json({ error: "SCOPE" }, { status: 403 });
    console.error("Send mail failed", err);
    return NextResponse.json({ error: err.message ?? "Failed to send" }, { status: 500 });
  }
}
