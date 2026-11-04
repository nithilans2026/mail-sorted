import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { langInfo } from "@/lib/i18n";
import { translateList, type ListItem } from "@/lib/translate";

// POST { lang, items: [{ id, subject, snippet }] } -> { items }
export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { lang = "en", items = [] } = (await req.json().catch(() => ({}))) as { lang?: string; items?: ListItem[] };
  try {
    const translated = await translateList(items.slice(0, 100), lang, langInfo(lang).english);
    return NextResponse.json({ items: translated });
  } catch (err: any) {
    console.error("List translation failed", err);
    return NextResponse.json({ error: "FAILED" }, { status: 500 });
  }
}
