import type { ThemeKey } from "./content";

export type ParticleType = "dust" | "sparks" | "snow" | "bokeh" | "none";

export interface Theme {
  bg1: string;
  bg2: string;
  accent: string;
  accent2?: string;
  fg: string;
  fgDim: string;
  particle: ParticleType;
  particleColor: string;
  scanlines?: boolean;
  vignette?: "warm" | "cold" | "none";
  displayWeight?: number;
}

export const themes: Record<ThemeKey, Theme> = {
  silvester: {
    bg1: "#0d1733",
    bg2: "#050814",
    accent: "#f7c948",
    accent2: "#ff9d5c",
    fg: "#f7f1e3",
    fgDim: "#b0aec7",
    particle: "sparks",
    particleColor: "247, 200, 110",
    vignette: "cold",
  },
  winter: {
    bg1: "#0c2033",
    bg2: "#040b14",
    accent: "#9fd8ff",
    accent2: "#e7f4ff",
    fg: "#eef6fb",
    fgDim: "#96acbc",
    particle: "snow",
    particleColor: "220, 240, 255",
    vignette: "cold",
  },
  sommer: {
    bg1: "#2e1806",
    bg2: "#120a03",
    accent: "#ffb454",
    accent2: "#ff7d54",
    fg: "#fdf3e4",
    fgDim: "#c8a888",
    particle: "bokeh",
    particleColor: "255, 190, 110",
    vignette: "warm",
  },
  sidequest: {
    bg1: "#1a0817",
    bg2: "#070308",
    accent: "#ff3b6e",
    accent2: "#5be3ff",
    fg: "#f6eaf2",
    fgDim: "#ab93a2",
    particle: "none",
    particleColor: "255, 59, 110",
    scanlines: true,
    vignette: "cold",
  },
  paris: {
    bg1: "#1c1509",
    bg2: "#0a0806",
    accent: "#efcf8d",
    accent2: "#6f8fd6",
    fg: "#f7f1e4",
    fgDim: "#b6a98f",
    particle: "dust",
    particleColor: "235, 214, 172",
    vignette: "warm",
    displayWeight: 500,
  },
  italien: {
    bg1: "#04202b",
    bg2: "#020a10",
    accent: "#7fe3d6",
    accent2: "#f5c542",
    fg: "#eff9f7",
    fgDim: "#93b5b1",
    particle: "bokeh",
    particleColor: "111, 216, 205",
    vignette: "cold",
  },
  schule: {
    bg1: "#1f1a10",
    bg2: "#0c0a07",
    accent: "#e8c25c",
    fg: "#f2eddf",
    fgDim: "#a9a08b",
    particle: "dust",
    particleColor: "220, 200, 150",
    vignette: "warm",
  },
};
