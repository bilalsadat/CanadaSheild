import type { Verdict } from "@/lib/trust-engine";

export interface VerdictStyle {
  color: string;
  soft: string;
  glow: string;
  emoji: string;
}

export const VERDICT_STYLE: Record<Verdict, VerdictStyle> = {
  safe: { color: "#2bd9a6", soft: "rgba(43,217,166,0.14)", glow: "rgba(43,217,166,0.5)", emoji: "🛡️" },
  caution: { color: "#f2b441", soft: "rgba(242,180,65,0.14)", glow: "rgba(242,180,65,0.45)", emoji: "⚠️" },
  likely_scam: { color: "#ff7a45", soft: "rgba(255,122,69,0.15)", glow: "rgba(255,122,69,0.45)", emoji: "🚫" },
  dangerous: { color: "#ff4d6a", soft: "rgba(255,77,106,0.16)", glow: "rgba(255,77,106,0.55)", emoji: "⛔" },
};

export function scoreToVerdict(score: number): Verdict {
  if (score >= 70) return "safe";
  if (score >= 45) return "caution";
  if (score >= 25) return "likely_scam";
  return "dangerous";
}

export const FAMILY_LABEL: Record<string, string> = {
  content: "Content / script",
  artifact: "Links & artifacts",
  authenticity: "Voice/video authenticity",
  network: "Community network",
  anomaly: "Out-of-pattern",
};
