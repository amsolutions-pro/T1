import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false, follow: true },
};

export default function CgvPage() {
  return (
    <>
      <h1>Conditions générales de vente</h1>
      <p>
        <strong>Placeholder — à compléter par un juriste avant la mise en ligne.</strong>
      </p>

      <h2>1. Objet</h2>
      <p>
        Les présentes CGV régissent l&apos;achat de cours particuliers en visio sur la plateforme
        ArmenSTEM, mettant en relation des élèves avec des professeurs indépendants situés en
        Arménie.
      </p>

      <h2>2. Tarifs</h2>
      <p>
        Le prix d&apos;un cours d&apos;essai est de <strong>10 € TTC</strong>. Le prix du cours
        standard est de <strong>25 € TTC par heure</strong>. Les paiements sont effectués via
        Stripe en mode sécurisé 3-D Secure.
      </p>

      <h2>3. Garantie de remboursement</h2>
      <p>
        Si le cours d&apos;essai ne satisfait pas l&apos;élève (ou son représentant légal), un
        remboursement intégral est accordé sur simple demande adressée à hello@armenstem.fr
        dans un délai de 7 jours suivant la séance.
      </p>

      <h2>4. Annulation et report</h2>
      <p>
        Toute annulation doit intervenir au moins 24 heures avant le créneau. Au-delà, la séance
        est due. Un report unique sans frais est possible si la demande est faite plus de 24 h
        avant le créneau.
      </p>

      <h2>5. Droit de rétractation</h2>
      <p>
        Conformément au Code de la consommation, l&apos;élève dispose d&apos;un délai de
        rétractation de 14 jours à compter du paiement, sauf si la prestation a déjà été
        intégralement exécutée à sa demande expresse.
      </p>
    </>
  );
}
