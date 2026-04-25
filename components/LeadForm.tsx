"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";

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
import { CLASSE_OPTIONS, leadSchema, type LeadInput } from "@/lib/validators";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "error"; message: string };

export function LeadForm() {
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { nom: "", email: "", classe: undefined, source_utm: null },
  });

  const classeValue = watch("classe");

  async function onSubmit(values: LeadInput) {
    setStatus({ kind: "submitting" });
    try {
      const utm = typeof window !== "undefined" ? window.location.search : "";
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source_utm: utm || null }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Erreur lors de l'inscription");
      }
      setStatus({ kind: "success" });
      reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setStatus({ kind: "error", message });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">Vous êtes bien inscrit·e.</p>
          <p>Un email de confirmation vous a été envoyé.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="lead-nom">Nom complet</Label>
        <Input
          id="lead-nom"
          autoComplete="name"
          aria-invalid={Boolean(errors.nom)}
          aria-describedby={errors.nom ? "lead-nom-error" : undefined}
          {...register("nom")}
        />
        {errors.nom ? (
          <p id="lead-nom-error" className="text-sm text-red-600">
            {errors.nom.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-email">Email</Label>
        <Input
          id="lead-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "lead-email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="lead-email-error" className="text-sm text-red-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-classe">Classe</Label>
        <Select
          value={classeValue}
          onValueChange={(v) => setValue("classe", v as LeadInput["classe"], { shouldValidate: true })}
        >
          <SelectTrigger id="lead-classe" aria-invalid={Boolean(errors.classe)}>
            <SelectValue placeholder="Sélectionnez une classe" />
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

      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={status.kind === "submitting"}
        data-event="lead_submit"
      >
        {status.kind === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span>Inscription…</span>
          </>
        ) : (
          "Rejoindre la liste"
        )}
      </Button>

      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-red-600">
          {status.message}
        </p>
      ) : null}

      <p className="text-xs text-slate-500">
        Vos données sont utilisées uniquement pour vous recontacter au sujet d&apos;ArmenSTEM.
        Aucun cookie publicitaire.
      </p>
    </form>
  );
}
