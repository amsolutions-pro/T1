import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p>
        <strong>Placeholder — à compléter par un juriste avant la mise en ligne.</strong>
      </p>

      <h2>Données collectées</h2>
      <p>
        ArmenSTEM collecte uniquement les données strictement nécessaires à la fourniture du
        service : nom, email, classe scolaire, matière souhaitée, et données de paiement
        traitées par Stripe. Aucun cookie publicitaire ni traceur tiers n&apos;est déposé sur
        votre navigateur.
      </p>

      <h2>Mesure d&apos;audience</h2>
      <p>
        Nous utilisons Plausible Analytics, hébergé en Europe et conforme RGPD, qui ne dépose
        aucun cookie et ne collecte aucune donnée personnelle identifiable.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données des prospects (liste d&apos;attente) sont conservées 24 mois maximum. Les
        données liées à un cours réservé sont conservées 5 ans pour répondre aux obligations
        comptables.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, de portabilité et d&apos;opposition. Pour les exercer, écrivez à
        hello@armenstem.fr en justifiant de votre identité.
      </p>

      <h2>Sous-traitants</h2>
      <p>
        Supabase (base de données, UE), Resend (envoi d&apos;emails, UE), Stripe (paiement,
        certifié RGPD), Vercel (hébergement, certifié RGPD).
      </p>
    </>
  );
}
