/**
 * VraiShield design system v2 — a restrained, professional dark theme.
 *
 * Principles (aligned with the dataviz discipline):
 *  - Deep ink background with layered surfaces; one confident emerald accent.
 *  - Red/amber/orange are STATUS colors (severity), never decorative, and never
 *    appear without an icon + label beside them.
 *  - Text wears text tokens, never data color. Marks carry color; ink carries words.
 *  - Meters/tracks use a step of the same ramp, not a generic gray.
 */

export const colors = {
  // Surfaces (elevation ladder)
  bg: "#0A0E17",
  bgElevated: "#0E1320",
  surface: "#141B2B",
  surface2: "#1B2436",
  surfaceHi: "#222D43",

  // Hairlines
  border: "rgba(148,163,184,0.12)",
  borderStrong: "rgba(148,163,184,0.22)",

  // Ink (text tokens — words never wear data color)
  text: "#EAEEF6",
  textDim: "#9AA7BD",
  textMute: "#5C6880",

  // The accent (identity + "safe")
  primary: "#2FD39B",
  primaryDeep: "#12A87C",
  primaryDim: "rgba(47,211,155,0.14)",
  /** Track step of the accent ramp — for unfilled meter/ring tracks. */
  primaryTrack: "rgba(47,211,155,0.16)",

  // Status palette (severity — always icon + label, never color alone)
  danger: "#FB5571",
  dangerDim: "rgba(251,85,113,0.14)",
  dangerTrack: "rgba(251,85,113,0.16)",
  warn: "#F5B544",
  warnDim: "rgba(245,181,68,0.14)",
  warnTrack: "rgba(245,181,68,0.16)",
  info: "#5C8DF0",
  infoDim: "rgba(92,141,240,0.14)",
  gold: "#E8B84A",

  // Trust-score severity bands
  safe: "#2FD39B",
  caution: "#F5B544",
  scam: "#FB8C4B",
  threat: "#FB5571",
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 } as const;

export const font = {
  h1: 30,
  h2: 22,
  h3: 17,
  body: 15,
  small: 13,
  tiny: 11,
  bold: "700" as const,
  heavy: "800" as const,
  semibold: "600" as const,
  medium: "500" as const,
  regular: "400" as const,
};

/** Motion tokens — one timing language across the app. */
export const motion = {
  fast: 160,
  base: 260,
  slow: 480,
  ring: 900,
} as const;

export type Verdict = "safe" | "caution" | "likely_scam" | "dangerous";

export function verdictColor(v: Verdict): string {
  return v === "safe" ? colors.safe : v === "caution" ? colors.caution : v === "likely_scam" ? colors.scam : colors.threat;
}

export function scoreColor(score: number): string {
  if (score >= 70) return colors.safe;
  if (score >= 45) return colors.caution;
  if (score >= 25) return colors.scam;
  return colors.threat;
}

/** Track color from the SAME ramp as the score's severity (meter spec). */
export function scoreTrack(score: number): string {
  if (score >= 70) return colors.primaryTrack;
  if (score >= 45) return colors.warnTrack;
  return colors.dangerTrack;
}

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  float: {
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
};
