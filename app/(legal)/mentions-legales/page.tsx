import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <h1>Mentions légales</h1>
      <p>
        <strong>Placeholder — à compléter avant la mise en ligne.</strong>
      </p>

      <h2>Éditeur du site</h2>
      <p>
        ArmenSTEM — [forme juridique], [capital social], immatriculée au RCS de [Ville] sous le
        numéro [SIREN]. Siège social : [Adresse]. Numéro de TVA intracommunautaire : [FR XX XXX
        XXX XXX].
      </p>

      <h2>Directeur de la publication</h2>
      <p>[Nom du directeur de la publication], joignable à hello@armenstem.fr.</p>

      <h2>Hébergeur</h2>
      <p>
        Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Site :
        https://vercel.com
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus (textes, images, logos, graphismes) présents sur le site est
        la propriété d&apos;ArmenSTEM ou de ses partenaires. Toute reproduction est interdite sans
        autorisation préalable.
      </p>
    </>
  );
}
