export type ThemeKey =
  | "silvester"
  | "winter"
  | "sommer"
  | "sidequest"
  | "paris"
  | "italien"
  | "schule";

export interface ChapterContent {
  slug: ThemeKey;
  order: number;
  era: string;
  kicker: string;
  title: string;
  subtitle?: string;
  note?: string;
  /** Explicit rows of asset ids. A row with two ids renders side by side.
   *  Omit to let the chapter lay itself out from the asset roles. */
  layout?: string[][];
  captions: Record<string, string>;
}

export const chapters: ChapterContent[] = [
  {
    slug: "silvester",
    order: 1,
    era: "Silvester 2019/20",
    kicker: "Kapitel I",
    title: "Der Anfang",
    captions: {
      "silvester-01": "Das erste Bild zusammen.",
      "silvester-02": "„Frohes neues, Mika Diggah.“",
    },
  },
  {
    slug: "winter",
    order: 2,
    era: "Winter",
    kicker: "Kapitel II",
    title: "Die geilsten Winter",
    subtitle: "Eis „laufen“. Tee mit Schuss. Snowboard fahren.",
    captions: {
      "winter-04": "Tee mit Schuss.",
      "winter-08": "Snowboard fahren — eigentlich ein Skateboard ohne Rollen.",
      "winter-15": "„Soll er oder nicht?“",
    },
  },
  {
    slug: "sommer",
    order: 3,
    era: "Sommer",
    kicker: "Kapitel III",
    title: "Die schönsten Sommer",
    subtitle: "Unser Platz auf den Feldern. Unser See.",
    captions: {
      "sommer-08": "Unser See.",
      "sommer-09": "American Football. 🏈",
      "sommer-10": "Grillen. Unser Platz.",
    },
  },
  {
    slug: "sidequest",
    order: 4,
    era: "Random",
    kicker: "Kapitel IV",
    title: "Random Sidequests",
    subtitle: "Roller. Graffiti. Vodka Orange. Und was sonst noch so ging.",
    captions: {
      "sidequest-02": "Vodka Orange. Irgendeine Nachttour.",
      "sidequest-06": "Graffiti. Wie und warum auch immer wir das gemacht haben.",
      "phasen-04": "Boxen. Auch mal eine Phase.",
      "sidequest-04": "Felix und sein Motorrad. Der Inbegriff von random.",
      "sidequest-05": "Die geilste Nachttour.",
      "schule-04": "Die Brownies. Haben uns, vor allem mir, die Augen geöffnet.",
      "sidequest-03": "Amsterdam. Leider zu viel Anton.",
      "sidequest-07": "Déjà-vu.",
    },
  },
  {
    slug: "paris",
    order: 5,
    era: "Paris",
    kicker: "Kapitel V",
    title: "Zusammen in Paris",
    subtitle: "Eiffelturm. Panthéon. Versailles.",
    // Same spot, one of each of us — those belong next to each other.
    layout: [
      ["paris-01", "winter-10"],
      ["paris-02", "paris-03"],
      ["paris-04", "paris-05"],
      ["paris-06", "paris-08"],
      ["paris-09"],
      ["paris-10", "paris-11"],
      ["paris-12", "paris-13"],
      ["paris-14"],
    ],
    captions: {
      "paris-02": "Panthéon.",
      "paris-06": "Eiffelturm.",
      "paris-10": "Versailles.",
      "paris-14": "Pizza. Immer.",
    },
  },
  {
    slug: "italien",
    order: 6,
    era: "Italien",
    kicker: "Kapitel VI",
    title: "Sorrento. Taormina. Stromboli.",
    subtitle: "Viel Wein. Noch mehr Momente.",
    captions: {
      "italien-05": "Unser Jacuzzi. Sorrento.",
    },
  },
  {
    slug: "schule",
    order: 7,
    era: "Schule & Abitur",
    kicker: "Kapitel VII",
    title: "Schule und unser Abitur",
    note: "Nicht ohne Grund: zweiter Platz. Mehr nicht.",
    captions: {
      "schule-03": "Mottowoche.",
      "schule-01": "Best Bromance. Offiziell.",
    },
  },
];

export const finaleContent = {
  lines: ["Schon ziemlich viel passiert.", "Und irgendwie sind wir immer noch hier."],
  promise: "Hier ist noch ganz schön viel Platz.",
  loading: "NEXT MEMORY LOADING…",
  name: "Dominik",
  personal: "Du bist ein toller Mensch und ein noch besserer Freund. Ich liebe dich.",
  outro: "Auf den nächsten Urlaub — und alles, was da noch dazukommt.",
  rewind: "Nochmal zurückspulen",
};

export const introContent = {
  lines: ["Ein paar Jahre.", "Ziemlich viele gute Erinnerungen."],
  name: "Dominik",
  subtitle: "Eine kleine Reise durch die Zeit.",
  cta: "Zeitreise starten",
};
