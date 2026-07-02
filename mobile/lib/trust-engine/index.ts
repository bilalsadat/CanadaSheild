/**
 * VraiShield Trust Engine — single scoring service behind every surface.
 *
 *   import { scoreTrust } from "@/lib/trust-engine";
 *   const result = scoreTrust({ text, channel: "sms", language: "en", network });
 *
 * The same entry point powers the consumer app and the licensed SDK (the Bill
 * C-15 product). It is pure TypeScript with zero framework or network imports —
 * the host injects the community-intel lookup. Latency budgets (from the spec):
 * <2s text/links. This synchronous rule core runs in well under a millisecond;
 * the budget exists for the production model-backed path.
 */

import type { CheckInput, TrustResult, Language } from "./types";
import { analyzeContent } from "./signals/content";
import { analyzeArtifact } from "./signals/artifact";
import { analyzeAuthenticity } from "./signals/authenticity";
import { analyzeNetwork } from "./signals/network";
import { analyzeAnomaly } from "./signals/anomaly";
import { combine } from "./combiner";
import { detectLanguage, decisionId } from "./util";
import {
  renderReason,
  verdictLabel,
  actionLabel,
} from "./i18n/explanations";

export const ENGINE_VERSION = "trust-engine/0.1.0+corpus-2026.06";

export function scoreTrust(input: CheckInput): TrustResult {
  const start = nowMs();
  const language: Language =
    input.language ?? detectLanguage(input.text ?? "");

  const signals = [
    analyzeContent(input, language),
    analyzeArtifact(input),
    analyzeAuthenticity(input),
    analyzeNetwork(input),
    analyzeAnomaly(input),
  ];

  const out = combine(signals);
  const detectedScript = signals.find((s) => s.detectedScript)?.detectedScript;

  return {
    trustScore: out.trustScore,
    verdict: out.verdict,
    action: out.action,
    language,
    uncertainty: out.uncertainty,
    topReasons: out.topReasons,
    ledger: out.ledger,
    detectedScript,
    decisionId: decisionId(),
    engineVersion: ENGINE_VERSION,
    latencyMs: Math.max(0, Math.round((nowMs() - start) * 100) / 100),
  };
}

/**
 * Convenience: a fully-rendered, localized view of a result — labels and
 * reason prose in the user's language. The app and SDK both use this so the
 * "what's yours we render once" rule holds everywhere.
 */
export function explain(result: TrustResult) {
  return {
    score: result.trustScore,
    verdict: result.verdict,
    verdictLabel: verdictLabel(result.verdict, result.language),
    action: result.action,
    actionLabel: actionLabel(result.action, result.language),
    uncertainty: result.uncertainty,
    reasons: result.topReasons.map((r) => renderReason(r, result.language)),
    script: result.detectedScript,
  };
}

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

export type {
  CheckInput,
  TrustResult,
  Language,
  Channel,
  Verdict,
  RecommendedAction,
  SignalBreakdown,
  SignalResult,
  NetworkLookup,
  NetworkReport,
  ScriptMatch,
} from "./types";
export { renderReason, verdictLabel, actionLabel } from "./i18n/explanations";
export { SCAM_SCRIPTS } from "./corpus/scripts";
