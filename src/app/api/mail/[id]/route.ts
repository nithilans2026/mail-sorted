import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { fetchMailBody } from "@/lib/gmail";
import { langInfo } from "@/lib/i18n";
import { NoKeyError, translateBody } from "@/lib/translate";

export const dynamic = "force-dynamic";

// GET /api/mail/<id>?lang=ta&subject=... -> { body, translation?: { subject, body }, translateError? }
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const url = new URL(req.url);
  const lang = url.searchParams.get("lang") ?? "en";
  const subject = url.searchParams.get("subject") ?? "";

  let body: string;
  try {
    body = await fetchMailBody(session.accessToken, params.id);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to load mail" }, { status: 500 });
  }
  if (lang === "en") return NextResponse.json({ body });

  try {
    const translation = await translateBody(subject, body, langInfo(lang).english);
    return NextResponse.json({ body, translation });
  } catch (err: any) {
    console.error("Body translation failed", err);
    return NextResponse.json({ body, translateError: err instanceof NoKeyError ? "NO_KEY" : "FAILED" });
  }
}
