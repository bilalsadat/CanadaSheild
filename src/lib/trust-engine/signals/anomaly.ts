import type { CheckInput, ReasonCode, SignalResult } from "../types";
import { clamp01 } from "../util";

/**
 * Anomaly signal — the net under the nets. Per-user baselines flag events that
 * are abnormal *for this user*, so a brand-new scam nobody has labelled still
 * trips an alarm by being out of pattern. Framed honestly as a signal, not a
 * guarantee — it nudges confidence, it does not by itself condemn a message.
 */
export function analyzeAnomaly(input: CheckInput): SignalResult {
  const reasons: ReasonCode[] = [];
  const ctx = input.context;
  if (!ctx) return { family: "anomaly", risk: 0, confidence: 0, reasons };

  let risk = 0;
  let confidence = 0;
  const baseline = ctx.baseline;

  // The three pressure questions, encoded. Unsolicited contact about money is
  // the single most reliable consumer-level anomaly.
  if (ctx.userInitiated === false) {
    risk = Math.max(risk, 0.35);
    confidence = Math.max(confidence, 0.5);
    reasons.push({ code: "anomaly.unsolicited", weight: 0.35 });
  }

  if (typeof ctx.amountCAD === "number" && ctx.amountCAD > 0) {
    confidence = Math.max(confidence, 0.5);
    const typicalMax = baseline?.typicalMaxAmountCAD;
    if (typeof typicalMax === "number" && ctx.amountCAD > typicalMax * 2) {
      risk = Math.max(risk, 0.5);
      reasons.push({
        code: "anomaly.amount_spike",
        params: { amount: ctx.amountCAD, typical: typicalMax },
        weight: 0.45,
      });
    }
    // Large transfer to an unknown recipient, regardless of baseline.
    const known =
      ctx.knownContact === true ||
      (input.recipient &&
        baseline?.knownRecipients?.includes(input.recipient.trim().toLowerCase()));
    if (ctx.amountCAD >= 1000 && !known) {
      risk = Math.max(risk, 0.45);
      reasons.push({
        code: "anomaly.large_to_unknown",
        params: { amount: ctx.amountCAD },
        weight: 0.4,
      });
    }
  }

  return { family: "anomaly", risk: clamp01(risk), confidence, reasons };
}
