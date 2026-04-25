import type { Professor } from "@/types";

/**
 * Mocked roster used until real professor profiles are imported.
 * Photos point to deterministic Pravatar placeholders — replace with real
 * portraits in /public/professors before launch.
 */
export const PROFESSORS: Professor[] = [
  {
    slug: "ararat-petrosyan",
    nom: "Ararat Petrosyan",
    matiere: "Mathématiques",
    parcours: "Diplômé de l'Université d'État d'Erevan (YSU), 8 ans de prépa olympiades.",
    medailles: [
      "Médaille d'or — Olympiades Zhautykov 2022",
      "Coach de l'équipe arménienne IMO 2024",
    ],
    creneaux: "Lun–Jeu 17h–22h (Paris)",
    langue: "Français + Anglais",
    photo: "https://i.pravatar.cc/400?img=12",
    jobTitle: "Professeur de mathématiques",
    alumniOf: ["Université d'État d'Erevan (YSU)"],
    knowsAbout: [
      "Mathématiques",
      "Olympiades de mathématiques",
      "Algèbre",
      "Théorie des nombres",
      "Combinatoire",
    ],
  },
  {
    slug: "lilit-grigoryan",
    nom: "Lilit Grigoryan",
    matiere: "Physique",
    parcours: "Doctorante en physique théorique, Institut de physique d'Erevan (YerPhI).",
    medailles: [
      "Médaille d'argent — IPhO 2019",
      "Lauréate de la bourse présidentielle 2021",
    ],
    creneaux: "Mar–Ven 18h–22h, Sam matin",
    langue: "Anglais",
    photo: "https://i.pravatar.cc/400?img=47",
    jobTitle: "Professeur de physique",
    alumniOf: [
      "Université d'État d'Erevan (YSU)",
      "Institut de physique d'Erevan (YerPhI)",
    ],
    knowsAbout: [
      "Physique",
      "Mécanique",
      "Électromagnétisme",
      "Thermodynamique",
      "Olympiades de physique",
    ],
  },
  {
    slug: "tigran-hovhannisyan",
    nom: "Tigran Hovhannisyan",
    matiere: "Informatique",
    parcours: "Ingénieur ML, ex-Synopsys Armenia, diplômé du programme TUMO.",
    medailles: [
      "Médaille de bronze — IOI 2018",
      "Top 50 mondial Codeforces (peak)",
    ],
    creneaux: "Lun–Ven 19h–23h",
    langue: "Anglais",
    photo: "https://i.pravatar.cc/400?img=33",
    jobTitle: "Professeur d'informatique",
    alumniOf: [
      "Université américaine d'Arménie (AUA)",
      "TUMO Centre for Creative Technologies",
    ],
    knowsAbout: [
      "Informatique",
      "Algorithmique",
      "Programmation compétitive",
      "Python",
      "C++",
      "Apprentissage automatique",
    ],
  },
  {
    slug: "anahit-sargsyan",
    nom: "Anahit Sargsyan",
    matiere: "Mathématiques",
    parcours: "Agrégée de mathématiques (équivalent), 12 ans en classe préparatoire à Erevan.",
    medailles: [
      "Médaille d'or — Olympiades Zhautykov 2025 (élève coachée)",
      "Membre du jury des Olympiades arméniennes",
    ],
    creneaux: "Lun, Mer, Ven 16h–21h",
    langue: "Français + Anglais",
    photo: "https://i.pravatar.cc/400?img=49",
    jobTitle: "Professeur de mathématiques (classes préparatoires)",
    alumniOf: ["Université d'État d'Erevan (YSU)"],
    knowsAbout: [
      "Mathématiques",
      "Analyse",
      "Algèbre linéaire",
      "Concours scientifiques français",
      "Préparation MPSI/MP",
    ],
  },
  {
    slug: "samvel-aronian",
    nom: "Samvel Aronian",
    matiere: "Échecs",
    parcours: "Grand Maître International, Elo FIDE 2520, ancien champion universitaire.",
    medailles: [
      "Champion d'Arménie U20",
      "Coach FIDE certifié, 6 ans d'enseignement en ligne",
    ],
    creneaux: "Tous les jours 18h–22h",
    langue: "Anglais",
    photo: "https://i.pravatar.cc/400?img=68",
    jobTitle: "Grand Maître International d'échecs (coach FIDE)",
    alumniOf: ["Académie d'échecs Tigran Petrossian, Erevan"],
    knowsAbout: [
      "Échecs",
      "Ouvertures",
      "Finales",
      "Stratégie échiquéenne",
      "Préparation tournoi FIDE",
    ],
  },
];
