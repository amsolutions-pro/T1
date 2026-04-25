import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/FadeIn";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="container relative pt-20 pb-16 sm:pt-28 sm:pb-24">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-orange">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Cours particuliers d'élite — visio
          </span>

          <h1
            id="hero-title"
            className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            Votre enfant prépare un concours scientifique.{" "}
            <span className="text-brand-blue">
              Et si son prof particulier était celui qui forme les médaillés olympiades ?
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            ArmenSTEM connecte les lycéens et préparationnaires français aux meilleurs profs
            arméniens de maths, physique et informatique. En visio. À{" "}
            <strong className="text-slate-900">25 €/heure</strong>.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="accent" size="xl" data-event="hero_cta_primary">
              <Link href="#reserver" prefetch={false}>
                Réserver un cours d&apos;essai à 10 €
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" data-event="hero_cta_secondary">
              <Link href="#comment-ca-marche" prefetch={false}>
                Voir comment ça marche
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Sans abonnement. Remboursement intégral si le premier cours ne vous convient pas.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
