import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { langInfo } from "@/lib/i18n";
import { NoKeyError, translateList, type ListItem } from "@/lib/translate";

// POST { lang, items: [{ id, subject, snippet }] } -> { items }
export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { lang, items = [] } = (await req.json().catch(() => ({}))) as { lang?: string; items?: ListItem[] };
  try {
    const translated = await translateList(items.slice(0, 100), langInfo(lang ?? "en").english);
    return NextResponse.json({ items: translated });
  } catch (err: any) {
    if (err instanceof NoKeyError) return NextResponse.json({ error: "NO_KEY" }, { status: 503 });
    console.error("List translation failed", err);
    return NextResponse.json({ error: "FAILED" }, { status: 500 });
  }
}
