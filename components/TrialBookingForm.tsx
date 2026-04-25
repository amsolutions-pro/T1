"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLASSE_OPTIONS,
  MATIERE_OPTIONS,
  trialBookingSchema,
  type TrialBookingInput,
} from "@/lib/validators";
import { PROFESSORS } from "@/data/professors";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string };

export function TrialBookingForm() {
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  // Pre-fill the prof from a query param like #reserver?prof=slug
  const initialProf = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash;
    const qIdx = hash.indexOf("?");
    if (qIdx === -1) return null;
    const params = new URLSearchParams(hash.slice(qIdx + 1));
    return params.get("prof");
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TrialBookingInput>({
    resolver: zodResolver(trialBookingSchema),
    defaultValues: {
      nom: "",
      email: "",
      classe: undefined,
      matiere: undefined,
      prof_souhaite: initialProf,
      creneau_souhaite: "",
    },
  });

  const classeValue = watch("classe");
  const matiereValue = watch("matiere");
  const profValue = watch("prof_souhaite") ?? "";

  async function onSubmit(values: TrialBookingInput) {
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        throw new Error(body.error ?? "Impossible de créer la session de paiement");
      }
      window.location.assign(body.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setStatus({ kind: "error", message });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="trial-nom">Nom complet</Label>
          <Input
            id="trial-nom"
            autoComplete="name"
            aria-invalid={Boolean(errors.nom)}
            {...register("nom")}
          />
          {errors.nom ? <p className="text-sm text-red-600">{errors.nom.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="trial-email">Email</Label>
          <Input
            id="trial-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="trial-classe">Classe</Label>
          <Select
            value={classeValue}
            onValueChange={(v) =>
              setValue("classe", v as TrialBookingInput["classe"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="trial-classe" aria-invalid={Boolean(errors.classe)}>
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              {CLASSE_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.classe ? <p className="text-sm text-red-600">{errors.classe.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="trial-matiere">Matière</Label>
          <Select
            value={matiereValue}
            onValueChange={(v) =>
              setValue("matiere", v as TrialBookingInput["matiere"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="trial-matiere" aria-invalid={Boolean(errors.matiere)}>
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              {MATIERE_OPTIONS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.matiere ? <p className="text-sm text-red-600">{errors.matiere.message}</p> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="trial-prof">Professeur souhaité (optionnel)</Label>
        <Select
          value={profValue}
          onValueChange={(v) => setValue("prof_souhaite", v, { shouldValidate: true })}
        >
          <SelectTrigger id="trial-prof">
            <SelectValue placeholder="Aucune préférence" />
          </SelectTrigger>
          <SelectContent>
            {PROFESSORS.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.nom} — {p.matiere}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="trial-creneau">Créneau préféré (optionnel)</Label>
        <Input
          id="trial-creneau"
          placeholder="Ex. mardi 18h ou samedi matin"
          {...register("creneau_souhaite")}
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={status.kind === "submitting"}
        data-event="trial_checkout_start"
      >
        {status.kind === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            <span>Redirection vers le paiement…</span>
          </>
        ) : (
          "Payer 10 € et réserver"
        )}
      </Button>

      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-red-600">
          {status.message}
        </p>
      ) : null}

      <p className="text-xs text-slate-500">
        Vous êtes redirigé·e vers Stripe pour le paiement. Aucune donnée bancaire ne transite par
        ArmenSTEM. Remboursement intégral garanti pendant 7 jours.
      </p>
    </form>
  );
}
