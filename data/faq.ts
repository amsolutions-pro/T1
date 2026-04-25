export interface FaqEntry {
  q: string;
  a: string;
}

/**
 * Single source of truth for FAQ content. Consumed by both the visible
 * accordion section and the JSON-LD FAQPage block, so they cannot drift.
 */
export const FAQ_ITEMS: FaqEntry[] = [
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
