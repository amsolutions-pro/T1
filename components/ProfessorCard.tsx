import Link from "next/link";
import Image from "next/image";
import { Award, Languages, Clock } from "lucide-react";
import type { Professor } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfessorCardProps {
  professor: Professor;
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={professor.photo}
          alt={`Portrait du professeur ${professor.nom}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-blue shadow-sm">
          {professor.matiere}
        </span>
      </div>
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-slate-900">{professor.nom}</h3>
          <p className="mt-1 text-sm text-slate-600">{professor.parcours}</p>
        </div>

        <ul className="space-y-2 text-sm">
          {professor.medailles.map((medal) => (
            <li key={medal} className="flex items-start gap-2 text-slate-700">
              <Award
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange"
              />
              <span>{medal}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-auto grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <dt className="sr-only">Créneaux</dt>
            <dd>{professor.creneaux}</dd>
          </div>
          <div className="flex items-start gap-2">
            <Languages aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <dt className="sr-only">Langue</dt>
            <dd>{professor.langue}</dd>
          </div>
        </dl>

        <Button asChild variant="accent" className="w-full">
          <Link
            href={`#reserver?prof=${encodeURIComponent(professor.slug)}`}
            prefetch={false}
            aria-label={`Réserver un cours d'essai avec ${professor.nom}`}
            data-event="prof_card_reserve"
            data-prof={professor.slug}
          >
            Réserver
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
