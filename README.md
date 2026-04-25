# ArmenSTEM — Landing page

Production-ready Next.js 14 (App Router) landing page for ArmenSTEM, a marketplace of online private tutoring with elite Armenian teachers in STEM and chess, targeting French high-school and prep-school students.

## Tech stack

- **Framework**: Next.js 14 (App Router) + TypeScript (strict, no `any`)
- **Styling**: Tailwind CSS + shadcn/ui (handcrafted, in `components/ui/`)
- **Forms**: React Hook Form + Zod
- **Database**: Supabase (Postgres) — tables `leads` and `trial_bookings`
- **Payments**: Stripe Checkout (test mode)
- **Email**: Resend
- **Analytics**: Plausible (self-hosted, env-driven)
- **Animations**: Framer Motion (respects `prefers-reduced-motion`)

## Prerequisites

- Node.js ≥ 18.18 (Next 14 requirement)
- npm ≥ 9 (or pnpm / yarn — adapt the commands)
- A free Supabase project, a Stripe account in test mode, a Resend account, and (optionally) a self-hosted Plausible instance

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env.local
# then edit .env.local with the real values
```

All variables are validated at runtime by `lib/env.ts` — the server will refuse to boot if any required key is missing or malformed.

## 3. Set up Supabase

1. Create a new project on [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose)
3. Open the **SQL editor**, paste the contents of `supabase/schema.sql`, and run it. The script creates the `leads` and `trial_bookings` tables, enables RLS, and indexes the common access paths. It is idempotent.
4. (Optional) Verify in **Table editor** that both tables exist and contain no rows.

## 4. Set up Stripe (test mode)

1. Sign in at [dashboard.stripe.com](https://dashboard.stripe.com) and toggle **Test mode** (top right).
2. **Developers → API keys** → copy the **Secret key** (`sk_test_…`) into `STRIPE_SECRET_KEY` and the **Publishable key** (`pk_test_…`) into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. **Products → Add product**:
   - Name: `Cours d'essai ArmenSTEM`
   - Pricing: One-off, **10,00 €** EUR
   - Save → copy the **Price ID** (`price_…`) into `STRIPE_PRICE_TRIAL`.
4. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward webhooks locally:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
   The CLI prints a `whsec_…` signing secret — paste it into `STRIPE_WEBHOOK_SECRET`.
5. To trigger a test event from another terminal:
   ```bash
   stripe trigger checkout.session.completed
   ```

In production, create the webhook from the **Developers → Webhooks** dashboard pointing at `https://your-domain.com/api/webhook/stripe` and listen at minimum to:
- `checkout.session.completed`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`

Use the production signing secret returned by the dashboard.

## 5. Set up Resend

1. Create an account on [resend.com](https://resend.com).
2. **API keys → Create** → copy into `RESEND_API_KEY`.
3. **Domains → Add domain** → add `armenstem.fr` (or your domain), then add the DKIM, SPF and return-path DNS records at your registrar. Wait for verification.
4. Set `RESEND_FROM_EMAIL` to a verified address, e.g. `"ArmenSTEM <hello@armenstem.fr>"`.

For local testing without a verified domain, Resend offers `onboarding@resend.dev` — but emails will only deliver to your own verified address.

## 6. (Optional) Set up Plausible

If you don't have a Plausible instance, leave `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` empty — the script tag is skipped automatically.

If you do:
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: the domain you registered in Plausible (`armenstem.fr`).
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL`: the full URL of `script.js` from your self-hosted instance, e.g. `https://plausible.example.com/js/script.js`.

CTAs already carry `data-event` attributes that Plausible's [tagged events plugin](https://plausible.io/docs/custom-event-goals) can pick up.

## 7. Run locally

```bash
npm run dev
# open http://localhost:3000
```

In a second terminal, keep the Stripe CLI listening:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

End-to-end happy path:
1. Fill the **Réserver un cours d'essai** form → click *Payer 10 € et réserver*.
2. Use Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.
3. The webhook flips the booking to `confirmed` and Resend sends a confirmation email.

## 8. Build and quality checks

```bash
npm run typecheck   # strict TS, fails on any error
npm run lint        # next + eslint
npm run build       # production build
npm start           # serve the production build locally
```

## 9. Deploy to Vercel

1. Push the repo to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo. Framework preset is auto-detected as **Next.js**.
3. In **Project Settings → Environment Variables**, add every variable from `.env.example` with the corresponding production values:
   - Use Stripe **live** keys (`sk_live_…`, `pk_live_…`) and create a production webhook in the Stripe dashboard.
   - Set `NEXT_PUBLIC_SITE_URL` to the final domain (e.g. `https://armenstem.fr`).
4. Deploy. Vercel runs `npm run build` automatically.
5. Add your custom domain in **Domains** and configure DNS at your registrar.

## Project structure

```
app/
  (legal)/                 # Grouped legal pages with shared layout
    cgv/page.tsx
    confidentialite/page.tsx
    mentions-legales/page.tsx
    layout.tsx
  api/
    checkout/route.ts      # POST → Stripe Checkout session + pending booking
    leads/route.ts         # POST → Supabase insert + Resend confirmation
    webhook/stripe/route.ts# POST → verify signature, confirm booking, email
  globals.css
  layout.tsx               # RootLayout: fonts, metadata, Plausible
  page.tsx                 # Single-page composition of all sections
  robots.ts
  sitemap.ts
components/
  sections/                # One file per page section
  ui/                      # Handcrafted shadcn primitives
  FadeIn.tsx               # Scroll-triggered reveal (a11y-aware)
  JsonLd.tsx               # Organization + Product + FAQ JSON-LD
  LeadForm.tsx
  PlausibleScript.tsx
  ProfessorCard.tsx
  SectionHeader.tsx
  TrialBookingForm.tsx
data/
  professors.ts            # Mocked roster — replace before launch
lib/
  env.ts                   # Zod-validated env loader
  resend.ts                # Mailer + email templates
  stripe.ts                # Cached Stripe client
  supabase.ts              # Typed admin client + Database types
  utils.ts                 # cn()
  validators.ts            # Zod schemas + select options
supabase/
  schema.sql               # Idempotent DDL for both tables
types/
  index.ts                 # Domain types (Professor, Subject, Language)
```

## Conventions

- **No `any`**: ESLint blocks it.
- **Server-only modules** (`lib/supabase`, `lib/stripe`, `lib/resend`, `lib/env`'s server schema) must never be imported from a client component. Forms post JSON to `/api/*` instead.
- **Forms** use Zod schemas duplicated nowhere — the same `lib/validators` is consumed by both the client and the API.
- **A11y**: every form input has a `<Label htmlFor>`, every section has an `aria-labelledby`, focus rings are visible, the page exposes a skip link, and all motion respects `prefers-reduced-motion`.

## Useful npm scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server with HMR |
| `npm run build` | Production build |
| `npm start` | Serve the built app |
| `npm run lint` | ESLint |
| `npm run typecheck` | Strict TypeScript check |
