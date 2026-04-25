import { FadeIn } from "@/components/FadeIn";
import { SectionHeader } from "@/components/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CalendarCheck, Video } from "lucide-react";

const STEPS = [
  {
    step: "1",
    icon: Search,
    title: "Vous choisissez un professeur",
    description:
      "Parcourez les profils, comparez parcours, médailles et créneaux, sélectionnez la matière et la langue.",
  },
  {
    step: "2",
    icon: CalendarCheck,
    title: "Vous réservez un cours d'essai à 10 €",
    description:
      "Paiement sécurisé Stripe. Notre équipe confirme un créneau visio sous 24 h ouvrées.",
  },
  {
    step: "3",
    icon: Video,
    title: "Le cours a lieu en visio",
    description:
      "Lien Zoom envoyé par email. Si le cours ne vous convient pas, les 10 € sont remboursés.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      aria-labelledby="how-title"
      className="bg-white py-20 sm:py-24"
    >
      <div className="container">
        <SectionHeader
          eyebrow="3 étapes, 10 minutes"
          title="Comment ça marche"
          description="De la sélection du professeur à la première séance, le parcours est conçu pour être limpide."
        />
        <h2 id="how-title" className="sr-only">
          Comment ça marche
        </h2>

        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, idx) => (
            <FadeIn as="li" delay={idx * 0.08} key={step.step}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-white font-display text-lg font-bold"
                    >
                      {step.step}
                    </span>
                    <step.icon className="h-6 w-6 text-brand-blue" aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
