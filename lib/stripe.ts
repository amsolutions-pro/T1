import Stripe from "stripe";
import { getServerEnv } from "@/lib/env";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const env = getServerEnv();
  cached = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-09-30.acacia",
    typescript: true,
  });
  return cached;
}
