import { FadeIn } from "@/components/FadeIn";
import { TrialBookingForm } from "@/components/TrialBookingForm";
import { LeadForm } from "@/components/LeadForm";

export function FinalCTA() {
  return (
    <section
      id="reserver"
      aria-labelledby="final-cta-title"
      className="bg-gradient-to-b from-white to-slate-50 py-20 sm:py-24"
    >
      <div className="container">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2
            id="final-cta-title"
            className="font-display text-3xl font-bold leading-tight text-slate-900 sm:text-4xl"
          >
            Prêt·e à essayer ? Premier cours à 10 €.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Réservez votre cours d&apos;essai en moins de 2 minutes. Garantie remboursé si insatisfait.
          </p>
        </FadeIn>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-2xl border-2 border-brand-orange/40 bg-white p-6 shadow-md sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                Recommandé
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-slate-900">
                Réserver le cours d&apos;essai à 10 €
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Paiement sécurisé Stripe. Remboursement intégral si le cours ne vous convient pas.
              </p>
              <div className="mt-6">
                <TrialBookingForm />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pas encore prêt·e ?
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-slate-900">
                Rejoindre la liste d&apos;attente
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Recevez un email dès qu&apos;un créneau s&apos;ouvre dans votre matière.
                Aucune carte bancaire demandée.
              </p>
              <div className="mt-6">
                <LeadForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
