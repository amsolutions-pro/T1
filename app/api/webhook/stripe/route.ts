import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getServerEnv } from "@/lib/env";
import { sendEmail, trialConfirmationEmail } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const env = getServerEnv();
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  // Stripe requires the raw body to verify the signature.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      if (!bookingId) {
        console.warn("[stripe/webhook] checkout.session.completed without booking_id", session.id);
        break;
      }
      const { data: booking, error: updateError } = await supabase
        .from("trial_bookings")
        .update({ status: "confirmed", stripe_session_id: session.id })
        .eq("id", bookingId)
        .select("nom, email, matiere")
        .single();

      if (updateError || !booking) {
        console.error("[stripe/webhook] Failed to confirm booking", bookingId, updateError);
        // Returning 500 makes Stripe retry — preferred over silent loss.
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }

      try {
        const tpl = trialConfirmationEmail(booking.nom, booking.matiere);
        await sendEmail({ to: booking.email, ...tpl });
      } catch (err) {
        console.error("[stripe/webhook] Resend send failed", err);
      }
      break;
    }

    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      if (bookingId) {
        await supabase
          .from("trial_bookings")
          .update({ status: "cancelled" })
          .eq("id", bookingId);
      }
      break;
    }

    default:
      // Other events are intentionally ignored.
      break;
  }

  return NextResponse.json({ received: true });
}
