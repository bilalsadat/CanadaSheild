import type {
  SignalResult,
  SignalBreakdown,
  Verdict,
  RecommendedAction,
  ReasonCode,
} from "./types";
import { clamp01 } from "./util";

/**
 * The combiner — the orchestrator doctrine in code. Detection on any single
 * channel is a commodity; fusing five signal families into one judged score is
 * the product. This is a transparent, monotonic, calibration-friendly combiner
 * (the legible stand-in for the gradient-boosted production model): every input
 * can only raise or lower the score in an explainable direction, which is what
 * lets us publish accuracy with receipts.
 */

const FAMILY_WEIGHT: Record<SignalResult["family"], number> = {
  content: 1.0,
  network: 0.95, // a consented community flag is strong corroboration
  artifact: 0.9,
  authenticity: 0.7, // capped — detectors generalize poorly to unseen synthesis
  anomaly: 0.55, // a nudge, never a condemnation on its own
};

/** Evidence mass at which we consider ourselves "fully informed" (uncertainty→min). */
const FULL_EVIDENCE = 2.2;
const MAX_UNCERTAINTY = 28;

export interface CombinerOutput {
  trustScore: number;
  combinedRisk: number;
  verdict: Verdict;
  action: RecommendedAction;
  uncertainty: number;
  ledger: SignalBreakdown[];
  topReasons: ReasonCode[];
}

export function combine(signals: SignalResult[]): CombinerOutput {
  let weightedRiskSum = 0;
  let evidenceMass = 0;
  const contributions: { family: SignalResult["family"]; c: number }[] = [];

  for (const s of signals) {
    const w = FAMILY_WEIGHT[s.family];
    const c = s.risk * s.confidence * w;
    contributions.push({ family: s.family, c });
    weightedRiskSum += c;
    evidenceMass += s.confidence * w;
  }

  // Confidence-weighted mean risk.
  const baseRisk = evidenceMass > 0 ? weightedRiskSum / evidenceMass : 0;

  // Corroboration boost: independent families agreeing is the whole thesis.
  const corroborating = signals.filter((s) => s.risk >= 0.5 && s.confidence >= 0.4).length;
  const corroborationBoost = corroborating >= 2 ? 0.15 * (corroborating - 1) : 0;

  const combinedRisk = clamp01(baseRisk + corroborationBoost);
  const trustScore = Math.round((1 - combinedRisk) * 99) + 1; // 1..100

  // Uncertainty shrinks as evidence accumulates — calibrated honesty in the UI.
  const uncertainty = Math.round(
    (1 - clamp01(evidenceMass / FULL_EVIDENCE)) * MAX_UNCERTAINTY,
  );

  const verdict = toVerdict(trustScore);
  const action = toAction(verdict, signals);

  // Ledger: normalized contribution per family for the explainability bars.
  const totalC = contributions.reduce((a, b) => a + b.c, 0);
  const ledger: SignalBreakdown[] = signals.map((s, i) => ({
    family: s.family,
    risk: round2(s.risk),
    confidence: round2(s.confidence),
    contribution: totalC > 0 ? round2(contributions[i].c / totalC) : 0,
    reasons: s.reasons,
  }));

  // Top reasons across all signals, by weight.
  const topReasons = signals
    .flatMap((s) => s.reasons)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return { trustScore, combinedRisk, verdict, action, uncertainty, ledger, topReasons };
}

function toVerdict(score: number): Verdict {
  if (score >= 70) return "safe";
  if (score >= 45) return "caution";
  if (score >= 25) return "likely_scam";
  return "dangerous";
}

function toAction(verdict: Verdict, signals: SignalResult[]): RecommendedAction {
  const networkFlagged = signals.some((s) => s.family === "network" && s.risk >= 0.6);
  switch (verdict) {
    case "safe":
      return "allow";
    case "caution":
      return "verify";
    case "likely_scam":
      return networkFlagged ? "block_and_report" : "do_not_engage";
    case "dangerous":
      return "block_and_report";
  }
}

const round2 = (x: number): number => Math.round(x * 100) / 100;
