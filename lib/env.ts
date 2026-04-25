import { z } from "zod";

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  STRIPE_PRICE_TRIAL: z.string().startsWith("price_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1).optional(),
  NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL: z.string().url().optional(),
});

const clientSchema = serverSchema.pick({
  NEXT_PUBLIC_SITE_URL: true,
  NEXT_PUBLIC_SUPABASE_URL: true,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: true,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: true,
  NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL: true,
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

let cachedServerEnv: ServerEnv | null = null;

/**
 * Validate and return server-side env vars. Throws on first call if invalid.
 * Lazy so client bundles never trigger validation of server-only keys.
 */
export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    throw new Error(
      `Invalid server environment variables: ${JSON.stringify(flat, null, 2)}`,
    );
  }
  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

export function getClientEnv(): ClientEnv {
  return {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL: process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL,
  };
}
