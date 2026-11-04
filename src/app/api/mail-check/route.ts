import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { latestMailIds } from "@/lib/gmail";

export const dynamic = "force-dynamic";

// GET -> { ids: string[] } newest inbox message ids; the page compares them to spot new mail.
export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    return NextResponse.json({ ids: await latestMailIds(session.accessToken) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Check failed" }, { status: 500 });
  }
}
