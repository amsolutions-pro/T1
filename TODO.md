# TODO — manual steps before launch

This checklist covers everything that cannot be done from the codebase alone.

## Accounts & infrastructure

- [ ] Create a **Supabase** project and run `supabase/schema.sql` in the SQL editor.
- [ ] Create a **Stripe** account, switch to test mode, create the `Cours d'essai` product (10,00 €, EUR), copy the price ID.
- [ ] Install the Stripe CLI locally, run `stripe listen --forward-to localhost:3000/api/webhook/stripe` for development.
- [ ] Create a **Resend** account, generate an API key, add and verify the sending domain (DKIM + SPF DNS records).
- [ ] (Optional) Provision a **self-hosted Plausible** instance and set the two `NEXT_PUBLIC_PLAUSIBLE_*` env vars.
- [ ] Create a **Vercel** project, link the GitHub repo, paste every env var from `.env.example` into the project settings.

## Domain & email

- [ ] Buy the domain (`armenstem.fr` or fallback).
- [ ] Configure DNS at the registrar:
  - [ ] `A` / `CNAME` records pointing to Vercel.
  - [ ] DKIM, SPF and return-path records for Resend.
  - [ ] (Optional) DMARC policy.
- [ ] Set up a real mailbox for `hello@armenstem.fr` (forwarding or full mailbox).

## Content

- [ ] Replace the 5 mocked professor profiles in `data/professors.ts` with real ones (full name, real bio, verified medals, real availability).
- [ ] Replace the placeholder `https://i.pravatar.cc/...` portraits with actual photos uploaded under `public/professors/<slug>.jpg`.
- [ ] Provide a final **Open Graph image** at `public/og-image.png` (1200 × 630).
- [ ] Provide a real **favicon** set under `app/icon.png` (Next-recommended path) or `public/favicon.ico`.
- [ ] Have a juriste validate **CGV** (`app/(legal)/cgv/page.tsx`), **mentions légales** (`app/(legal)/mentions-legales/page.tsx`) and **politique de confidentialité** (`app/(legal)/confidentialite/page.tsx`).
- [ ] Confirm that the comparative claims in the *Pricing* table (Acadomia / Superprof) are accurate at launch and add a footnote with the verification date.

## Stripe — going live

- [ ] In production, create a webhook endpoint in the Stripe dashboard pointing at `https://armenstem.fr/api/webhook/stripe`, subscribed to:
  - `checkout.session.completed`
  - `checkout.session.expired`
  - `checkout.session.async_payment_failed`
- [ ] Replace test keys with live keys in Vercel env vars.
- [ ] Activate the live account (KYC, bank account, etc.).

## Marketing & analytics

- [ ] Create the Plausible goals (`hero_cta_primary`, `hero_cta_secondary`, `prof_card_reserve`, `lead_submit`, `trial_checkout_start`).
- [ ] Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- [ ] Verify Open Graph rendering with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and the LinkedIn Post Inspector.
- [ ] Run a Rich Results Test on the production URL.

## Legacy files

- [ ] Decide whether to delete the historical `index.html`, `script.js`, and `style.css` at the repo root (left in place by this commit because they're unrelated to the Next.js app and removing them was out of scope).

## Nice-to-have (post-launch)

- [ ] Hook up a CRM (e.g., Notion or HubSpot) to mirror new `leads` rows.
- [ ] Add a Slack webhook on the `/api/webhook/stripe` confirmed branch to alert ops in real time.
- [ ] Build a simple admin page for the team to view recent leads and bookings (Supabase Studio is enough for v1).
