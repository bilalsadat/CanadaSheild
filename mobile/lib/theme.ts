/**
 * KinShield design system — a restrained, professional dark theme.
 * Deep ink background, layered surfaces, a single confident emerald accent,
 * danger reserved strictly for threats. No emoji-as-UI; iconography only.
 */

export const colors = {
  bg: "#0A0E17",
  bgElevated: "#0E1320",
  surface: "#141B2B",
  surface2: "#1B2436",
  surfaceHi: "#222D43",
  border: "rgba(148,163,184,0.12)",
  borderStrong: "rgba(148,163,184,0.22)",

  text: "#EAEEF6",
  textDim: "#9AA7BD",
  textMute: "#5C6880",

  primary: "#2FD39B",
  primaryDeep: "#12A87C",
  primaryDim: "rgba(47,211,155,0.14)",

  danger: "#FB5571",
  dangerDim: "rgba(251,85,113,0.14)",
  warn: "#F5B544",
  warnDim: "rgba(245,181,68,0.14)",
  info: "#5C8DF0",
  infoDim: "rgba(92,141,240,0.14)",
  gold: "#E8B84A",

  // Trust score bands
  safe: "#2FD39B",
  caution: "#F5B544",
  scam: "#FB8C4B",
  threat: "#FB5571",
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 } as const;

export const font = {
  // Sizes
  h1: 30,
  h2: 22,
  h3: 17,
  body: 15,
  small: 13,
  tiny: 11,
  // Weights
  bold: "700" as const,
  semibold: "600" as const,
  medium: "500" as const,
  regular: "400" as const,
};

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

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};
