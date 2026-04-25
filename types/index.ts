export type Language = "Français" | "Anglais" | "Français + Anglais";

export type Subject = "Mathématiques" | "Physique" | "Informatique" | "Échecs";

export interface Professor {
  /** Stable slug used as React key and analytics event property. */
  slug: string;
  nom: string;
  matiere: Subject;
  /** One-line academic background. */
  parcours: string;
  /** Major distinctions (olympiad medals, titles, etc.). */
  medailles: string[];
  /** Free-form availability hint shown on the card. */
  creneaux: string;
  langue: Language;
  /** Path to a square photo under /public. Placeholder is fine. */
  photo: string;
}
