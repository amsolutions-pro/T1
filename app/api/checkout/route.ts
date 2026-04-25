import { NextResponse } from "next/server";
import { trialBookingSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { getServerEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = trialBookingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const data = parsed.data;
  const env = getServerEnv();

  // Insert pending booking first so we have an id to attach to Stripe metadata.
  const supabase = getSupabaseAdmin();
  const { data: booking, error: insertError } = await supabase
    .from("trial_bookings")
    .insert({
      nom: data.nom,
      email: data.email,
      classe: data.classe,
      matiere: data.matiere,
      prof_souhaite: data.prof_souhaite ?? null,
      creneau_souhaite: data.creneau_souhaite ?? null,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !booking) {
    console.error("[checkout] Supabase insert failed", insertError);
    return NextResponse.json(
      { error: "Erreur serveur. Réessayez plus tard." },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: env.STRIPE_PRICE_TRIAL, quantity: 1 }],
      customer_email: data.email,
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/?status=success&booking=${booking.id}`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/#reserver?status=cancelled`,
      metadata: {
        booking_id: booking.id,
        nom: data.nom,
        classe: data.classe,
        matiere: data.matiere,
        prof_souhaite: data.prof_souhaite ?? "",
      },
      locale: "fr",
    });
  } catch (err) {
    console.error("[checkout] Stripe session creation failed", err);
    // Roll back the pending booking so we don't keep stale rows.
    await supabase.from("trial_bookings").delete().eq("id", booking.id);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 502 },
    );
  }

  // Attach the session id to the booking for webhook reconciliation.
  const { error: updateError } = await supabase
    .from("trial_bookings")
    .update({ stripe_session_id: session.id })
    .eq("id", booking.id);
  if (updateError) {
    console.error("[checkout] Failed to persist session id", updateError);
  }

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe n'a pas renvoyé d'URL de paiement." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
