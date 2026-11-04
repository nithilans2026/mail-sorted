import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { fetchRecentMail } from "@/lib/gmail";
import { categorize } from "@/lib/categorize";

export const dynamic = "force-dynamic";

// POST { blocked: string[] } -> { mails: SortedMail[] }
export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (session.error === "RefreshFailed") return NextResponse.json({ error: "Please sign in again" }, { status: 401 });

  const { blocked = [] } = await req.json().catch(() => ({}));
  try {
    const mails = await fetchRecentMail(session.accessToken);
    const sorted = await categorize(mails, new Set((blocked as string[]).map((s) => s.toLowerCase())));
    return NextResponse.json({ mails: sorted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to load mail" }, { status: 500 });
  }
}
