import { Globe2, BadgeCheck, ShieldCheck, Wallet } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const ITEMS = [
  {
    icon: Globe2,
    title: "Profs francophones ou anglophones",
    description: "Vous choisissez la langue du cours.",
  },
  {
    icon: BadgeCheck,
    title: "Premier cours 10 €",
    description: "Remboursé intégralement si insatisfait.",
  },
  {
    icon: ShieldCheck,
    title: "Paiement sécurisé Stripe",
    description: "Cartes 3-D Secure, aucune donnée bancaire stockée.",
  },
  {
    icon: Wallet,
    title: "Sans abonnement",
    description: "Vous payez à la séance, à la carte.",
  },
] as const;

export function Reassurance() {
  return (
    <section
      aria-label="Garanties ArmenSTEM"
      className="border-y border-slate-200 bg-white"
    >
      <div className="container py-10">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, idx) => (
            <FadeIn as="li" delay={idx * 0.05} key={item.title}>
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue"
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
