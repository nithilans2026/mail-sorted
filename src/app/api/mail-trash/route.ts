import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ScopeError, trashMessages } from "@/lib/gmail";

// POST { ids: string[] } -> { trashed: string[], failed: string[] }
// 403 { error: "SCOPE" } when the user signed in before the Trash permission was added.
export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { ids } = (await req.json().catch(() => ({}))) as { ids?: unknown };
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 200 || !ids.every((id) => typeof id === "string" && /^[a-zA-Z0-9]+$/.test(id))) {
    return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
  }
  try {
    return NextResponse.json(await trashMessages(session.accessToken, ids as string[]));
  } catch (err: any) {
    if (err instanceof ScopeError) return NextResponse.json({ error: "SCOPE" }, { status: 403 });
    return NextResponse.json({ error: err.message ?? "Trash failed" }, { status: 500 });
  }
}
