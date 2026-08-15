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
  anfang: {
    bg1: "#1b160f",
    bg2: "#0c0a07",
    accent: "#c9a26b",
    fg: "#f2e9da",
    fgDim: "#a89a83",
    particle: "dust",
    particleColor: "200, 170, 120",
    vignette: "warm",
  },
  silvester: {
    bg1: "#0a1226",
    bg2: "#050814",
    accent: "#f2c14e",
    accent2: "#ff9d5c",
    fg: "#f5efe0",
    fgDim: "#a9a8c0",
    particle: "sparks",
    particleColor: "247, 200, 110",
    vignette: "cold",
  },
  schule: {
    bg1: "#1a1710",
    bg2: "#0d0b07",
    accent: "#e0b954",
    fg: "#f1ecdd",
    fgDim: "#a49c88",
    particle: "dust",
    particleColor: "220, 200, 150",
    vignette: "warm",
  },
  phasen: {
    bg1: "#1a0d24",
    bg2: "#0a0512",
    accent: "#c084fc",
    accent2: "#ff6fa5",
    fg: "#f1e9f7",
    fgDim: "#a595b8",
    particle: "bokeh",
    particleColor: "192, 132, 252",
    vignette: "cold",
  },
  winter: {
    bg1: "#0b1a26",
    bg2: "#050c14",
    accent: "#9fd8ff",
    accent2: "#e7f4ff",
    fg: "#eef6fb",
    fgDim: "#93a9b8",
    particle: "snow",
    particleColor: "220, 240, 255",
    vignette: "cold",
  },
  sommer: {
    bg1: "#241505",
    bg2: "#130b03",
    accent: "#ffb454",
    accent2: "#ff7d54",
    fg: "#fbf1e2",
    fgDim: "#c2a586",
    particle: "bokeh",
    particleColor: "255, 190, 110",
    vignette: "warm",
  },
  sidequest: {
    bg1: "#140810",
    bg2: "#070308",
    accent: "#ff3b6e",
    accent2: "#5be3ff",
    fg: "#f4e9f0",
    fgDim: "#a68f9c",
    particle: "none",
    particleColor: "255, 59, 110",
    scanlines: true,
    vignette: "cold",
  },
  paris: {
    bg1: "#17130b",
    bg2: "#0b0906",
    accent: "#e8c88a",
    fg: "#f5efe2",
    fgDim: "#b0a48d",
    particle: "dust",
    particleColor: "230, 210, 170",
    vignette: "warm",
    displayWeight: 500,
  },
  italien: {
    bg1: "#061a24",
    bg2: "#020a10",
    accent: "#6fd8cd",
    accent2: "#ff9d5c",
    fg: "#eef8f6",
    fgDim: "#8fb0ac",
    particle: "bokeh",
    particleColor: "111, 216, 205",
    vignette: "cold",
  },
};
