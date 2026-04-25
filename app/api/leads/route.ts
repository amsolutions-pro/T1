import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendEmail, leadConfirmationEmail } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const supabase = getSupabaseAdmin();
  const { error: insertError } = await supabase.from("leads").insert({
    nom: parsed.data.nom,
    email: parsed.data.email,
    classe: parsed.data.classe,
    matiere: parsed.data.matiere ?? null,
    source_utm: parsed.data.source_utm ?? null,
  });

  if (insertError) {
    console.error("[leads] Supabase insert failed", insertError);
    return NextResponse.json(
      { error: "Erreur serveur. Réessayez plus tard." },
      { status: 500 },
    );
  }

  // Email is best-effort; don't fail the request if Resend is down.
  try {
    const tpl = leadConfirmationEmail(parsed.data.nom);
    await sendEmail({ to: parsed.data.email, ...tpl });
  } catch (err) {
    console.error("[leads] Resend send failed", err);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
