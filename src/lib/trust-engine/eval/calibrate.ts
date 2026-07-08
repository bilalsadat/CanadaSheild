import { scoreTrust } from "../index";
import { LABELED_SET, type LabeledCase } from "./labeled-set";

/**
 * Live calibration over the labeled set. We treat "flagged" as trustScore < 45
 * (caution or worse). This produces a real confusion matrix at runtime — the
 * calibration page shows actual numbers, misses included, not a marketing "96%".
 */

export const FLAG_THRESHOLD = 45;

export interface CalibrationResult {
  total: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  precision: number;
  recall: number;
  f1: number;
  accuracy: number;
  falsePositives: { case: LabeledCase; score: number }[];
  falseNegatives: { case: LabeledCase; score: number }[];
  scored: { id: string; fraud: boolean; score: number; flagged: boolean }[];
}

export function runCalibration(): CalibrationResult {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  const falsePositives: CalibrationResult["falsePositives"] = [];
  const falseNegatives: CalibrationResult["falseNegatives"] = [];
  const scored: CalibrationResult["scored"] = [];

  for (const c of LABELED_SET) {
    const r = scoreTrust({ text: c.text, channel: c.channel, language: c.language });
    const flagged = r.trustScore < FLAG_THRESHOLD;
    scored.push({ id: c.id, fraud: c.fraud, score: r.trustScore, flagged });
    if (c.fraud && flagged) tp++;
    else if (c.fraud && !flagged) { fn++; falseNegatives.push({ case: c, score: r.trustScore }); }
    else if (!c.fraud && flagged) { fp++; falsePositives.push({ case: c, score: r.trustScore }); }
    else tn++;
  }

  const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 1 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const accuracy = (tp + tn) / LABELED_SET.length;

  return {
    total: LABELED_SET.length,
    tp, fp, tn, fn,
    precision, recall, f1, accuracy,
    falsePositives, falseNegatives, scored,
  };
}
