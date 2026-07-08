import type { CheckInput, ReasonCode, SignalResult } from "../types";
import { normalize, clamp01 } from "../util";

/**
 * Authenticity signal — synthetic-media likelihood.
 *
 * Claims discipline: VraiShield NEVER rests a verdict on a single detector, and
 * always expresses authenticity as a probability with stated uncertainty. When
 * the host supplies an audio/video synthesis likelihood (from the AASIST/RawNet-
 * class ensemble), we fold it in at deliberately bounded confidence. With no
 * media present we return neutral — never a false certainty.
 */
export function analyzeAuthenticity(input: CheckInput): SignalResult {
  const reasons: ReasonCode[] = [];
  const synth = input.context?.synthLikelihood;

  if (typeof synth === "number") {
    const risk = clamp01(synth);
    if (risk >= 0.5) {
      reasons.push({
        code: "authenticity.synthetic_voice",
        params: { pct: Math.round(risk * 100) },
        weight: risk,
      });
    }
    // Confidence is intentionally capped: detectors generalize poorly to unseen
    // synthesis methods, so authenticity never dominates the score alone.
    return { family: "authenticity", risk, confidence: 0.5, reasons, evidence: { synthLikelihood: synth } };
  }

  // Textual tell only available for call transcripts: scripted "read me the code"
  // cadence is handled by content; here we look for explicit deepfake context.
  if (input.channel === "call_transcript" && input.text) {
    const hay = normalize(input.text);
    if (/new payee|change the wire|change the account|update the banking|video call/.test(hay)) {
      reasons.push({ code: "authenticity.wire_change_on_call", weight: 0.4 });
      return { family: "authenticity", risk: 0.4, confidence: 0.35, reasons };
    }
  }

  return { family: "authenticity", risk: 0, confidence: 0, reasons };
}
