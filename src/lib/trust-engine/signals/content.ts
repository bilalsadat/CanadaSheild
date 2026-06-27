import type { CheckInput, Language, ReasonCode, ScriptMatch, SignalResult } from "../types";
import { SCAM_SCRIPTS, PRESSURE_MARKERS, EXTRACTION_ASKS, GENERIC_PHISH } from "../corpus/scripts";
import { normalize, countHits, clamp01 } from "../util";

/**
 * Content signal — the fine-tuned multilingual classifier's transparent seed.
 * Classifies script family, pressure language, and extraction asks. In
 * production a distilled on-device model runs this; the rule layer below is the
 * legible baseline it is trained to agree with, and the source of explanations.
 */
export function analyzeContent(input: CheckInput, lang: Language): SignalResult {
  const text = input.text ?? "";
  const reasons: ReasonCode[] = [];
  if (text.trim().length === 0) {
    return { family: "content", risk: 0, confidence: 0, reasons };
  }
  const hay = normalize(text);

  // ---- 1. Script DNA match across all languages -------------------------
  let best: { script: (typeof SCAM_SCRIPTS)[number]; score: number; hits: string[] } | null = null;
  for (const script of SCAM_SCRIPTS) {
    let hits: string[] = [];
    const triggerSets = script.triggers as Record<string, string[]>;
    for (const langKey of Object.keys(triggerSets)) {
      const res = countHits(hay, triggerSets[langKey] ?? []);
      hits = hits.concat(res.hits);
    }
    if (hits.length === 0) continue;
    // More distinct triggers => higher confidence it's this script.
    const score = clamp01(0.45 + 0.18 * (hits.length - 1)) * script.severity;
    if (!best || score > best.score) best = { script, score, hits };
  }

  let detectedScript: ScriptMatch | undefined;
  let scriptRisk = 0;
  if (best) {
    scriptRisk = best.score;
    const stage = detectStage(best.script, hay);
    detectedScript = {
      id: best.script.id,
      label: best.script.label,
      stage,
      extraction: best.script.extraction,
      confidence: clamp01(0.5 + 0.15 * (best.hits.length - 1)),
    };
    reasons.push({
      code: "content.script_match",
      params: { id: best.script.id, label: best.script.label, extraction: best.script.extraction },
      weight: scriptRisk,
    });
    if (stage) {
      reasons.push({
        code: "content.long_con_stage",
        params: { stage, name: best.script.stages?.find((s) => s.stage === stage)?.name ?? "" },
        weight: 0.2,
      });
    }
  }

  // ---- 2. Pressure language (the grammar of fraud) ----------------------
  const pressure = scorePressure(hay);
  if (pressure.categories.length >= 1) {
    reasons.push({
      code: "content.pressure",
      params: { categories: pressure.categories.join(", ") },
      weight: pressure.risk,
    });
  }

  // ---- 3. Direct extraction ask (strongest single cue) ------------------
  const extraction = countHits(
    hay,
    Object.values(EXTRACTION_ASKS).flat() as string[],
  );
  let extractionRisk = 0;
  if (extraction.count > 0) {
    extractionRisk = clamp01(0.55 + 0.12 * (extraction.count - 1));
    reasons.push({
      code: "content.extraction_ask",
      params: { example: extraction.hits[0] },
      weight: extractionRisk,
    });
  }

  // ---- 3b. Generic phishing grammar (brand-agnostic) -------------------
  const genericPhish = countHits(hay, Object.values(GENERIC_PHISH).flat() as string[]);
  let genericRisk = 0;
  if (genericPhish.count > 0) {
    genericRisk = clamp01(0.42 + 0.12 * (genericPhish.count - 1));
    reasons.push({
      code: "content.generic_phish",
      params: { example: genericPhish.hits[0] },
      weight: genericRisk,
    });
  }

  // ---- 4. The classic triad — authority + urgency/threat + extraction ---
  // This combination is what makes a scam a scam; weight it super-additively.
  const triad =
    (pressure.set.has("authority") ? 1 : 0) +
    (pressure.set.has("urgency") || pressure.set.has("threat") ? 1 : 0) +
    (extraction.count > 0 ? 1 : 0);
  let triadBoost = 0;
  if (triad === 3) {
    triadBoost = 0.25;
    reasons.push({ code: "content.triad", weight: triadBoost });
  }

  const risk = clamp01(
    Math.max(scriptRisk, extractionRisk, pressure.risk, genericRisk) +
      0.35 * Math.min(scriptRisk, pressure.risk) +
      triadBoost,
  );

  // Confidence grows with how much textual evidence we actually saw.
  const evidenceUnits =
    (best ? best.hits.length : 0) + pressure.categories.length + extraction.count + genericPhish.count;
  const confidence = clamp01(0.3 + 0.14 * evidenceUnits + Math.min(0.2, text.length / 1200));

  return {
    family: "content",
    risk,
    confidence,
    reasons,
    detectedScript,
    evidence: {
      script: best?.script.id,
      scriptHits: best?.hits,
      pressure: pressure.categories,
      extractionHits: extraction.hits,
      triad,
    },
  };
}

function scorePressure(hay: string) {
  const set = new Set<string>();
  let total = 0;
  for (const [cat, langs] of Object.entries(PRESSURE_MARKERS)) {
    const all = Object.values(langs).flat() as string[];
    const { count } = countHits(hay, all);
    if (count > 0) {
      set.add(cat);
      total += count;
    }
  }
  const categories = [...set];
  // Multiple categories present => coordinated pressure => higher risk.
  const risk = clamp01(0.2 * categories.length + 0.05 * Math.min(total, 6));
  return { categories, set, risk };
}

function detectStage(script: (typeof SCAM_SCRIPTS)[number], hay: string): number | undefined {
  if (!script.stages) return undefined;
  let stage: number | undefined;
  for (const s of script.stages) {
    if (countHits(hay, s.markers).count > 0) stage = s.stage; // latest matched stage wins
  }
  return stage;
}
