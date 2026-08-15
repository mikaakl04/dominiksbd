export type ThemeKey =
  | "silvester"
  | "anfang"
  | "schule"
  | "phasen"
  | "winter"
  | "sommer"
  | "sidequest"
  | "paris"
  | "italien";

export interface ChapterContent {
  slug: ThemeKey;
  order: number;
  era: string;
  kicker: string;
  title: string;
  subtitle?: string;
  note?: string;
  captions: Record<string, string>;
}

export const chapters: ChapterContent[] = [
  {
    slug: "silvester",
    order: 1,
    era: "Silvester 2019/20",
    kicker: "Kapitel I",
    title: "Der Anfang",
    subtitle: "Wir drei. Mit Calle.",
    note: "„Frohes neues, Mika Diggah.“ — seitdem Insider.",
    captions: {
      "silvester-01": "Das erste Bild zusammen.",
      "silvester-02": "Das Video. Der Insider.",
    },
  },
  {
    slug: "anfang",
    order: 2,
    era: "Die Zeit danach",
    kicker: "Kapitel II",
    title: "Aus der Zeit",
    captions: {},
  },
  {
    slug: "schule",
    order: 3,
    era: "Schule & Abitur",
    kicker: "Kapitel III",
    title: "Schule und unser Abitur",
    note: "Nicht ohne Grund sind wir Best Moments geworden.",
    captions: {
      "schule-01": "Bromance — offizielles Ranking.",
      "schule-03": "Mottowoche.",
      "schule-04": "Die Brownies.",
    },
  },
  {
    slug: "phasen",
    order: 4,
    era: "Zwischendurch",
    kicker: "Kapitel IV",
    title: "Viele Phasen",
    subtitle: "Paulina. Emilio. Deven. Calle: keine Phase.",
    captions: {},
  },
  {
    slug: "winter",
    order: 5,
    era: "Winter",
    kicker: "Kapitel V",
    title: "Die geilsten Winter",
    subtitle: "Eis „laufen“. Tee mit Schuss. Snowboard ohne Rollen.",
    captions: {
      "winter-13": "Tee mit Schuss. Moorkaten.",
      "winter-15": "„Soll er oder nicht?“",
    },
  },
  {
    slug: "sommer",
    order: 6,
    era: "Sommer",
    kicker: "Kapitel VI",
    title: "Die schönsten Sommer",
    subtitle: "Unser Platz auf den Feldern. Unser See.",
    captions: {
      "sommer-08": "Baden am See.",
      "sommer-10": "Grillen an unserem Platz.",
    },
  },
  {
    slug: "sidequest",
    order: 7,
    era: "Random",
    kicker: "Kapitel VII",
    title: "Random Sidequest",
    subtitle: "Roller-Touren. Felix' Motorrad. Graffiti. Vodka Orange.",
    captions: {
      "sidequest-03": "Amsterdam. Leider zu viel Anton.",
    },
  },
  {
    slug: "paris",
    order: 8,
    era: "Paris",
    kicker: "Kapitel VIII",
    title: "Zusammen in Paris",
    subtitle: "Eiffelturm. Panthéon. Versailles.",
    captions: {},
  },
  {
    slug: "italien",
    order: 9,
    era: "Italien",
    kicker: "Kapitel IX",
    title: "Sorrento. Taormina. Stromboli.",
    subtitle: "Viel Wein. Noch mehr Momente.",
    captions: {
      "italien-05": "Unser Jacuzzi in Sorrento.",
    },
  },
];

export const finaleContent = {
  lines: ["Schon ziemlich viel passiert.", "Und irgendwie sind wir immer noch hier."],
  promise: "Hier ist noch ganz schön viel Platz.",
  loading: "NEXT MEMORY LOADING…",
  name: "Dominik",
  personal: "Auf den nächsten Urlaub — und alles, was da noch dazukommt.",
  rewind: "Nochmal zurückspulen",
};

export const introContent = {
  lines: ["Ein paar Jahre.", "Ziemlich viele gute Erinnerungen."],
  name: "Dominik",
  subtitle: "Eine kleine Reise durch die Zeit.",
  cta: "Zeitreise starten",
};
