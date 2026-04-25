import { NextResponse } from "next/server";
import { PROFESSORS } from "@/data/professors";

export const runtime = "nodejs";
// Re-render the manifest at most once a day; the underlying data is static
// but env-derived URLs are evaluated at request time on Vercel.
export const revalidate = 86_400;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * GET /.well-known/agents.json (via rewrite in next.config.js)
 *
 * Plain-language manifest aimed at AI crawlers (inspired by the
 * informal llms.txt pattern). Describes the service, contact endpoint,
 * and points to public professor profiles. Kept intentionally small
 * and free of structured schemas — JSON-LD already handles the
 * schema.org-aware crawlers in <script> tags on the page.
 */
export function GET(): NextResponse {
  const manifest = {
    schema_version: "1.0",
    name: "ArmenSTEM",
    description:
      "Marketplace de cours particuliers en visio par des professeurs arméniens d'élite en mathématiques, physique, informatique et échecs. À destination des lycéens et préparationnaires en France.",
    url: SITE_URL,
    languages: ["fr", "en"],
    services: [
      {
        id: "trial-lesson",
        name: "Cours d'essai",
        description:
          "Cours particulier d'1 heure en visio à 10 € TTC, remboursé intégralement si insatisfait dans les 7 jours.",
        price: { amount: "10.00", currency: "EUR" },
        url: `${SITE_URL}/#reserver`,
      },
      {
        id: "regular-lesson",
        name: "Cours particulier (récurrent)",
        description:
          "Cours particulier en visio à la séance, sans abonnement. Mathématiques, physique, informatique, échecs. Lycée et classes préparatoires françaises.",
        price: { amount: "25.00", currency: "EUR", per: "hour" },
        url: `${SITE_URL}/#reserver`,
      },
    ],
    audience: [
      "Lycéens (Seconde, Première, Terminale spécialités scientifiques)",
      "Préparationnaires (MPSI, PCSI, PTSI, MP, PC, PSI)",
    ],
    areas_served: ["FR"],
    contact: {
      email: "hello@armenstem.fr",
      url: `${SITE_URL}/#reserver`,
    },
    professor_profiles: PROFESSORS.map((p) => ({
      slug: p.slug,
      name: p.nom,
      subject: p.matiere,
      languages: p.langue,
      url: `${SITE_URL}/#prof-${p.slug}`,
    })),
    policies: {
      privacy_url: `${SITE_URL}/confidentialite`,
      terms_url: `${SITE_URL}/cgv`,
      legal_url: `${SITE_URL}/mentions-legales`,
    },
    crawler_guidance:
      "Les pages publiques peuvent être indexées et résumées librement. Pour toute question commerciale, écrire à hello@armenstem.fr.",
  } as const;

  return NextResponse.json(manifest, {
    headers: {
      // Tell intermediaries the doc is JSON, allow public caching for an hour.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
