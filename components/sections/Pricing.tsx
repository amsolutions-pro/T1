import { FadeIn } from "@/components/FadeIn";
import { SectionHeader } from "@/components/SectionHeader";
import { Check, X } from "lucide-react";

interface Row {
  label: string;
  armenstem: string | true | false;
  acadomia: string | true | false;
  superprof: string | true | false;
}

const ROWS: Row[] = [
  { label: "Tarif horaire moyen (lycée/prépa)", armenstem: "25 €", acadomia: "45–55 €", superprof: "25–60 €" },
  { label: "Premier cours à 10 € remboursable", armenstem: true, acadomia: false, superprof: false },
  { label: "Profs ayant entraîné des médaillés olympiades", armenstem: true, acadomia: false, superprof: "Aléatoire" },
  { label: "Sans abonnement ni engagement", armenstem: true, acadomia: false, superprof: true },
  { label: "Cours en visio (Zoom HD)", armenstem: true, acadomia: true, superprof: "Variable" },
  { label: "Vérification systématique du profil prof", armenstem: true, acadomia: true, superprof: false },
];

function Cell({ value }: { value: string | true | false }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600" aria-label="Oui">
        <Check className="h-5 w-5" aria-hidden />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1 text-slate-400" aria-label="Non">
        <X className="h-5 w-5" aria-hidden />
      </span>
    );
  }
  return <span className="text-sm font-medium text-slate-700">{value}</span>;
}

export function Pricing() {
  return (
    <section
      id="tarifs"
      aria-labelledby="pricing-title"
      className="bg-white py-20 sm:py-24"
    >
      <div className="container">
        <SectionHeader
          eyebrow="Transparence totale"
          title="Tarifs et garanties"
          description="Le même cours, en visio, par un prof d'élite : pourquoi payer le double ?"
        />
        <h2 id="pricing-title" className="sr-only">
          Tarifs et garanties
        </h2>

        <FadeIn className="mt-10">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                Comparatif tarifaire et garanties entre ArmenSTEM, Acadomia et Superprof
              </caption>
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Critère
                  </th>
                  <th scope="col" className="px-4 py-3 text-brand-blue">
                    ArmenSTEM
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Acadomia
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Superprof
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-slate-900"
                    >
                      {row.label}
                    </th>
                    <td className="px-4 py-3 bg-brand-blue/5">
                      <Cell value={row.armenstem} />
                    </td>
                    <td className="px-4 py-3">
                      <Cell value={row.acadomia} />
                    </td>
                    <td className="px-4 py-3">
                      <Cell value={row.superprof} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            <strong>Transparence — crédit d&apos;impôt&nbsp;:</strong> ArmenSTEM ne donne pas droit
            au crédit d&apos;impôt de 50 % pour services à la personne. Nos professeurs étant
            indépendants et établis en Arménie, ils n&apos;entrent pas dans le dispositif. Nos
            tarifs sont en revanche déjà inférieurs au prix net (après crédit d&apos;impôt) des
            acteurs français pour ce niveau d&apos;exigence.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
