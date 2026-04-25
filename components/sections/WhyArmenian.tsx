import { FadeIn } from "@/components/FadeIn";
import { SectionHeader } from "@/components/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Medal, GraduationCap, Crown } from "lucide-react";

const STATS = [
  {
    icon: Medal,
    value: "17",
    label: "médailles aux Olympiades Zhautykov 2025",
    sub: "L'Arménie sur le podium des nations en mathématiques.",
  },
  {
    icon: GraduationCap,
    value: "4",
    label: "écoles d'élite à Erevan",
    sub: "PhysMath, TUMO, ARMath et le programme YSU pour les médaillés.",
  },
  {
    icon: Crown,
    value: "n°1",
    label: "historique mondial aux échecs par habitant",
    sub: "Une discipline scolaire obligatoire au primaire depuis 2011.",
  },
] as const;

export function WhyArmenian() {
  return (
    <section
      id="pourquoi"
      aria-labelledby="pourquoi-title"
      className="bg-slate-50 py-20 sm:py-24"
    >
      <div className="container">
        <SectionHeader
          eyebrow="Une école unique au monde"
          title="Pourquoi des profs arméniens ?"
        />

        <div className="mx-auto mt-10 max-w-3xl space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
          <p>
            L'Arménie, trois millions d'habitants, se classe régulièrement parmi les dix premières
            nations mondiales aux Olympiades internationales de mathématiques, de physique et
            d'informatique. Ce n'est pas un hasard : depuis l'époque soviétique, le pays a bâti une
            tradition pédagogique exigeante, transmise de génération en génération dans une poignée
            d'écoles d'élite à Erevan.
          </p>
          <p>
            Les professeurs qui forment ces médaillés ne se limitent pas à enseigner le programme :
            ils apprennent à <strong>raisonner, démontrer et résister à un problème difficile</strong>.
            C'est exactement la compétence dont un lycéen ou un préparationnaire français a besoin
            pour aborder sereinement les concours scientifiques (X, ENS, Mines-Ponts, Centrale).
          </p>
          <p>
            Avec le décalage de pouvoir d'achat, ces enseignants — souvent inaccessibles localement —
            deviennent abordables pour une famille française : <strong>25 €/heure</strong>, contre
            45 à 80 € pour un cours équivalent en France.
          </p>
        </div>

        <h3 id="pourquoi-title" className="sr-only">
          Trois chiffres qui résument l'écosystème STEM arménien
        </h3>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STATS.map((stat, idx) => (
            <FadeIn as="li" delay={idx * 0.08} key={stat.label}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange"
                  >
                    <stat.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display text-4xl font-bold text-brand-blue">{stat.value}</p>
                    <p className="mt-1 font-semibold text-slate-900">{stat.label}</p>
                  </div>
                  <p className="text-sm text-slate-600">{stat.sub}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
