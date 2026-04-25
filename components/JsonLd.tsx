import { FAQ_ITEMS } from "@/components/sections/FAQ";

interface Props {
  siteUrl: string;
}

/**
 * Renders Organization, Product (cours d'essai) and FAQPage JSON-LD.
 * Inlined as <script> for crawler-friendliness — Next sanitizes the JSON.
 */
export function JsonLd({ siteUrl }: Props) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ArmenSTEM",
    url: siteUrl,
    logo: `${siteUrl}/og-image.png`,
    sameAs: ["https://www.linkedin.com/company/armenstem"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hello@armenstem.fr",
        contactType: "customer support",
        availableLanguage: ["French", "English"],
      },
    ],
  };

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Cours d'essai ArmenSTEM",
    description:
      "Cours particulier d'essai d'1h en visio avec un professeur arménien d'élite en maths, physique, informatique ou échecs. Remboursé intégralement si insatisfait.",
    brand: { "@type": "Brand", name: "ArmenSTEM" },
    offers: {
      "@type": "Offer",
      price: "10.00",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/#reserver`,
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
