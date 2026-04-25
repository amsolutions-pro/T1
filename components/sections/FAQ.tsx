import { FadeIn } from "@/components/FadeIn";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Mon enfant ne parle pas anglais — comment ça se passe ?",
    a: "Plusieurs de nos professeurs parlent français couramment (souvent diplômés d'universités francophones ou ayant séjourné en France). Vous filtrez par langue avant de réserver. Si vous choisissez un prof anglophone, nous proposons un mode mixte avec support écrit en français pour les notions clés.",
  },
  {
    q: "Quel est le profil des professeurs ?",
    a: "Tous nos professeurs ont au minimum un master scientifique d'une université arménienne (YSU, AUA, RAU) et une expérience documentée d'enseignement en olympiades, en classe préparatoire ou en école d'élite (PhysMath, TUMO). Nous vérifions diplômes, références professionnelles et conduisons un entretien pédagogique avant intégration.",
  },
  {
    q: "Comment se déroule un cours ?",
    a: "Le cours dure 60 ou 90 minutes selon ce que vous réservez. Il a lieu en visio sur Zoom (lien envoyé 24 h avant). Le prof utilise un tableau blanc numérique partagé pour les exercices. Un compte rendu écrit est transmis après chaque séance, avec la liste des notions vues et des exercices pour la fois suivante.",
  },
  {
    q: "Que se passe-t-il si le premier cours ne nous convient pas ?",
    a: "Vous nous envoyez un email dans les 7 jours suivant le cours d'essai et nous vous remboursons intégralement les 10 €, sans aucune justification à fournir. Vous pouvez aussi demander à essayer un autre professeur — la garantie de remboursement reste valable.",
  },
  {
    q: "Quel rythme recommandez-vous pour préparer un concours ?",
    a: "Pour un lycéen en Terminale ou en première année de prépa, le rythme efficace est généralement d'une à deux séances de 90 minutes par semaine, sur une matière prioritaire. Inutile de surcharger : la régularité et le travail entre les séances comptent davantage que le volume horaire brut.",
  },
  {
    q: "Comment payez-vous les professeurs ?",
    a: "Nous reversons en moyenne 60 % du tarif horaire au professeur (15 €/h sur les 25 € facturés), un revenu très significatif au regard du marché local arménien. Le reste finance le sourcing, la vérification des profils, le support et la plateforme. Aucun engagement de volume n'est imposé aux professeurs.",
  },
];

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-slate-50 py-20 sm:py-24">
      <div className="container">
        <SectionHeader eyebrow="On vous répond" title="Questions fréquentes" />
        <h2 id="faq-title" className="sr-only">
          Questions fréquentes
        </h2>

        <FadeIn className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="rounded-xl border border-slate-200 bg-white px-4 sm:px-6">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem value={`item-${idx}`} key={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
