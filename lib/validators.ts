import { z } from "zod";

export const CLASSE_OPTIONS = [
  "Seconde",
  "Première",
  "Terminale",
  "MPSI",
  "PCSI",
  "PTSI",
  "MP",
  "PC",
  "PSI",
  "Autre",
] as const;

export const MATIERE_OPTIONS = [
  "Mathématiques",
  "Physique",
  "Informatique",
  "Échecs",
] as const;

const trimmedString = (max: number) =>
  z.string().trim().min(1, "Champ requis").max(max, `Maximum ${max} caractères`);

export const leadSchema = z.object({
  nom: trimmedString(120),
  email: z.string().trim().toLowerCase().email("Email invalide"),
  classe: z.enum(CLASSE_OPTIONS, { errorMap: () => ({ message: "Sélectionnez une classe" }) }),
  matiere: z.enum(MATIERE_OPTIONS).optional(),
  source_utm: z.string().max(255).optional().nullable(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const trialBookingSchema = z.object({
  nom: trimmedString(120),
  email: z.string().trim().toLowerCase().email("Email invalide"),
  classe: z.enum(CLASSE_OPTIONS, { errorMap: () => ({ message: "Sélectionnez une classe" }) }),
  matiere: z.enum(MATIERE_OPTIONS, { errorMap: () => ({ message: "Sélectionnez une matière" }) }),
  prof_souhaite: z.string().trim().max(120).optional().nullable(),
  creneau_souhaite: z.string().trim().max(255).optional().nullable(),
});
export type TrialBookingInput = z.infer<typeof trialBookingSchema>;
