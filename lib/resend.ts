import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";

let cached: Resend | null = null;

function getResend(): Resend {
  if (cached) return cached;
  const env = getServerEnv();
  cached = new Resend(env.RESEND_API_KEY);
  return cached;
}

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail(args: SendArgs): Promise<void> {
  const env = getServerEnv();
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
  });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

export function leadConfirmationEmail(nom: string): { subject: string; html: string; text: string } {
  const subject = "Bienvenue sur ArmenSTEM — vous êtes bien sur la liste";
  const text = [
    `Bonjour ${nom},`,
    "",
    "Merci pour votre intérêt pour ArmenSTEM. Vous êtes bien inscrit·e sur notre liste d'attente.",
    "Nous reviendrons vers vous dès qu'un créneau correspondant à votre classe et à votre matière se libère.",
    "",
    "Si vous souhaitez tester un cours dès maintenant, réservez un cours d'essai à 10 € (remboursable) :",
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/#reserver`,
    "",
    "À bientôt,",
    "L'équipe ArmenSTEM",
  ].join("\n");
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;">
      <h1 style="color:#1e3a8a;">Bienvenue sur ArmenSTEM</h1>
      <p>Bonjour <strong>${escapeHtml(nom)}</strong>,</p>
      <p>Merci pour votre intérêt pour ArmenSTEM. Vous êtes bien inscrit·e sur notre liste d'attente.</p>
      <p>Nous reviendrons vers vous dès qu'un créneau correspondant à votre classe et à votre matière se libère.</p>
      <p style="margin-top:24px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "#"}/#reserver"
           style="background:#f97316;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
          Réserver un cours d'essai à 10 €
        </a>
      </p>
      <p style="color:#64748b;font-size:14px;margin-top:32px;">
        À bientôt,<br/>L'équipe ArmenSTEM
      </p>
    </div>`;
  return { subject, html, text };
}

export function trialConfirmationEmail(nom: string, matiere: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Votre cours d'essai ArmenSTEM est confirmé";
  const text = [
    `Bonjour ${nom},`,
    "",
    `Votre cours d'essai en ${matiere} est bien confirmé. Notre équipe vous contactera sous 24 h ouvrées`,
    "pour fixer le créneau définitif avec le professeur.",
    "",
    "Pour rappel : si le cours ne vous convient pas, nous vous remboursons intégralement les 10 €.",
    "",
    "À très vite,",
    "L'équipe ArmenSTEM",
  ].join("\n");
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;">
      <h1 style="color:#1e3a8a;">Cours d'essai confirmé ✓</h1>
      <p>Bonjour <strong>${escapeHtml(nom)}</strong>,</p>
      <p>Votre cours d'essai en <strong>${escapeHtml(matiere)}</strong> est bien confirmé.</p>
      <p>Notre équipe vous contactera sous <strong>24 h ouvrées</strong> pour fixer le créneau définitif avec le professeur.</p>
      <p style="background:#f1f5f9;padding:12px 16px;border-radius:8px;">
        <strong>Garantie :</strong> si le cours ne vous convient pas, nous vous remboursons intégralement les 10 €.
      </p>
      <p style="color:#64748b;font-size:14px;margin-top:32px;">
        À très vite,<br/>L'équipe ArmenSTEM
      </p>
    </div>`;
  return { subject, html, text };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
