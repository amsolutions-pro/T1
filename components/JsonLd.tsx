import { FAQ_ITEMS } from "@/data/faq";
import { PROFESSORS } from "@/data/professors";

interface Props {
  siteUrl: string;
}

interface CourseSpec {
  slug: string;
  name: string;
  description: string;
  audience: string;
  about: string[];
}

const COURSES: CourseSpec[] = [
  {
    slug: "maths-lycee",
    name: "Mathématiques — Lycée",
    description:
      "Cours particuliers de mathématiques pour les élèves de Seconde, Première et Terminale, avec un accent sur la rigueur du raisonnement et la préparation au baccalauréat scientifique.",
    audience: "Lycéens (Seconde, Première, Terminale spécialité mathématiques)",
    about: ["Mathématiques", "Lycée", "Baccalauréat", "Olympiades de mathématiques"],
  },
  {
    slug: "maths-prepa",
    name: "Mathématiques — Classes préparatoires",
    description:
      "Cours particuliers de mathématiques pour les classes préparatoires scientifiques (MPSI, PCSI, PTSI, MP, PC, PSI). Préparation aux concours X, ENS, Mines-Ponts, Centrale.",
    audience: "Préparationnaires (MPSI, PCSI, PTSI, MP, PC, PSI)",
    about: ["Mathématiques", "Classe préparatoire", "Concours scientifiques", "Algèbre", "Analyse"],
  },
  {
    slug: "physique-lycee",
    name: "Physique-Chimie — Lycée",
    description:
      "Cours particuliers de physique-chimie pour les lycéens, avec mise en pratique sur exercices type concours et préparation au bac.",
    audience: "Lycéens (Première, Terminale spécialité physique-chimie)",
    about: ["Physique", "Chimie", "Lycée", "Baccalauréat"],
  },
  {
    slug: "physique-prepa",
    name: "Physique — Classes préparatoires",
    description:
      "Cours particuliers de physique pour les classes préparatoires scientifiques. Mécanique, électromagnétisme, thermodynamique, optique, mécanique quantique.",
    audience: "Préparationnaires (MPSI, PCSI, PTSI, MP, PC, PSI)",
    about: ["Physique", "Classe préparatoire", "Concours scientifiques"],
  },
  {
    slug: "informatique",
    name: "Informatique (NSI / prépa)",
    description:
      "Cours particuliers d'informatique : algorithmique, structures de données, programmation Python et C++, programmation compétitive (Codeforces, IOI).",
    audience: "Lycéens NSI et préparationnaires",
    about: ["Informatique", "Algorithmique", "Python", "C++", "Programmation compétitive"],
  },
  {
    slug: "echecs",
    name: "Échecs",
    description:
      "Cours particuliers d'échecs avec un Grand Maître International ou un coach FIDE certifié. Ouvertures, finales, stratégie, préparation tournoi.",
    audience: "Tous niveaux, classement Elo conseillé",
    about: ["Échecs", "Ouvertures", "Finales", "Stratégie échiquéenne", "FIDE"],
  },
];

/**
 * All public-facing JSON-LD blocks.
 *
 * Validate after deploy with https://validator.schema.org/ and the
 * Google Rich Results Test. Each block is emitted as its own
 * <script type="application/ld+json"> tag (recommended pattern,
 * easier for crawlers to parse than a single @graph aggregate).
 */
export function JsonLd({ siteUrl }: Props) {
  // ----- Re-usable references --------------------------------------
  const orgRef = { "@type": "EducationalOrganization", name: "ArmenSTEM", url: siteUrl };

  const educationalOrganization = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    name: "ArmenSTEM",
    description:
      "Marketplace de cours particuliers en visio par des professeurs arméniens d'élite en mathématiques, physique, informatique et échecs. À destination des lycéens et préparationnaires en France.",
    url: siteUrl,
    logo: `${siteUrl}/og-image.png`,
    image: `${siteUrl}/og-image.png`,
    inLanguage: ["fr", "en"],
    sameAs: [
      "https://www.linkedin.com/company/armenstem",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hello@armenstem.fr",
        contactType: "customer support",
        availableLanguage: ["French", "English"],
        areaServed: "FR",
      },
    ],
    areaServed: { "@type": "Country", name: "France" },
  };

  // ----- Service ----------------------------------------------------
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#service`,
    serviceType: "Cours particulier en visio",
    name: "Cours particuliers en visio par des professeurs arméniens d'élite",
    description:
      "Cours particuliers en visioconférence avec des professeurs arméniens spécialistes des STEM (mathématiques, physique, informatique) et des échecs, à destination des lycéens et préparationnaires français.",
    provider: orgRef,
    areaServed: { "@type": "Country", name: "France" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: siteUrl,
      availableLanguage: ["French", "English"],
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "Lycéens et préparationnaires scientifiques en France",
    },
    offers: {
      "@type": "Offer",
      price: "25.00",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "25.00",
        priceCurrency: "EUR",
        unitCode: "HUR",
        unitText: "heure",
      },
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/#reserver`,
    },
  };

  // ----- Offer (cours d'essai 10€) ---------------------------------
  // Valid for one year from the current build date — keep the offer
  // live without a manual update for at least the first marketing
  // cycle.
  const validFrom = new Date().toISOString().slice(0, 10);
  const validThrough = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const trialOffer = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "@id": `${siteUrl}/#offer-trial`,
    name: "Cours d'essai ArmenSTEM",
    description:
      "Cours particulier d'essai d'1 heure en visio avec un professeur arménien d'élite, remboursé intégralement si insatisfait dans les 7 jours.",
    price: "10.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    validFrom,
    priceValidUntil: validThrough,
    url: `${siteUrl}/#reserver`,
    seller: orgRef,
    eligibleRegion: { "@type": "Country", name: "France" },
    category: "Education",
  };

  // ----- Courses ----------------------------------------------------
  const courses = COURSES.map((course) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${siteUrl}/#course-${course.slug}`,
    name: course.name,
    description: course.description,
    provider: orgRef,
    inLanguage: ["fr", "en"],
    educationalLevel: course.audience,
    about: course.about,
    courseMode: "online",
    isAccessibleForFree: false,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT1H",
      inLanguage: ["fr", "en"],
    },
    offers: {
      "@type": "Offer",
      price: "25.00",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/#reserver`,
      category: "Education",
    },
  }));

  // ----- Persons (one per professor) -------------------------------
  const persons = PROFESSORS.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#prof-${p.slug}`,
    name: p.nom,
    jobTitle: p.jobTitle,
    image: p.photo,
    description: p.parcours,
    knowsLanguage:
      p.langue === "Français + Anglais"
        ? ["fr", "en"]
        : p.langue === "Français"
        ? ["fr"]
        : ["en"],
    knowsAbout: p.knowsAbout,
    award: p.medailles,
    alumniOf: p.alumniOf.map((name) => ({
      "@type": "EducationalOrganization",
      name,
    })),
    worksFor: orgRef,
  }));

  // ----- FAQ --------------------------------------------------------
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const blocks: Array<Record<string, unknown>> = [
    educationalOrganization,
    service,
    trialOffer,
    ...courses,
    ...persons,
    faqPage,
  ];

  return (
    <>
      {blocks.map((block, idx) => (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          key={`ld-${idx}`}
          type="application/ld+json"
        />
      ))}
    </>
  );
}
