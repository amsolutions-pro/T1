import { FadeIn } from "@/components/FadeIn";
import { SectionHeader } from "@/components/SectionHeader";
import { ProfessorCard } from "@/components/ProfessorCard";
import { PROFESSORS } from "@/data/professors";

export function Professors() {
  return (
    <section
      id="professeurs"
      aria-labelledby="profs-title"
      className="bg-slate-50 py-20 sm:py-24"
    >
      <div className="container">
        <SectionHeader
          eyebrow="Une sélection rigoureuse"
          title="Nos professeurs"
          description="Tous sont actifs dans le coaching d'olympiades ou enseignent dans les écoles d'élite arméniennes. Sélectionnés à la main, vérifiés (CV, références, entretien)."
        />

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROFESSORS.map((professor, idx) => (
            <FadeIn as="li" delay={idx * 0.05} key={professor.slug}>
              <ProfessorCard professor={professor} />
            </FadeIn>
          ))}
        </ul>

        <h2 id="profs-title" className="sr-only">
          Nos professeurs
        </h2>
      </div>
    </section>
  );
}
