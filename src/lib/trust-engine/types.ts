/**
 * KinShield Trust Engine — public type contract.
 *
 * This is the API contract for the whole product: every surface (Ask KinShield,
 * SMS Shield, Link Checker, the Line, Check Before You Send) and the licensed
 * SDK all speak in {@link CheckInput} / {@link TrustResult}.
 *
 * Design rule (from the Claims Discipline): the engine NEVER returns a bare
 * boolean. It returns a calibrated 1–100 score, a confidence/uncertainty band,
 * the top reasons, AND the full per-signal ledger — so every verdict can be
 * cross-examined. Honesty is an engineering property here, not a slogan.
 */

/**
 * The twelve target languages, chosen by where Canadian losses concentrate.
 * (Mandarin & Cantonese share the "zh" written form.) EN/FR/PA/ZH are the
 * validated P0 set; the rest are seed quality — see the calibration page, which
 * states honestly which languages are certified vs seeded.
 */
export type Language =
  | "en" // English
  | "fr" // Quebec French
  | "pa" // Punjabi
  | "zh" // Mandarin / Cantonese
  | "es" // Spanish
  | "tl" // Tagalog
  | "ar" // Arabic
  | "vi" // Vietnamese
  | "ko" // Korean
  | "pt" // Portuguese
  | "hi"; // Hindi

/** Which surface produced the input — tunes weighting and explanations. */
export type Channel =
  | "sms"
  | "email"
  | "link"
  | "qr"
  | "call_transcript"
  | "recipient"
  | "job_offer"
  | "investment"
  | "ad"
  | "unknown";

export type SignalFamily =
  | "content"
  | "artifact"
  | "authenticity"
  | "network"
  | "anomaly";

/** Verdict bands derived from the Trust Score. Red is reserved for threats. */
export type Verdict = "safe" | "caution" | "likely_scam" | "dangerous";

export type RecommendedAction =
  | "allow"
  | "verify"
  | "do_not_engage"
  | "block_and_report"
  | "incident_mode";

/**
 * A localizable reason. We never store rendered prose in the engine; we emit a
 * stable `code` plus interpolation `params`, and the i18n layer renders it into
 * any of the twelve languages. This is what keeps explanations honest and
 * translatable without re-running detection.
 */
export interface ReasonCode {
  code: string;
  params?: Record<string, string | number>;
  /** Relative contribution to the final risk (0..1), for the ledger UI. */
  weight: number;
}

/** A matched scam "script DNA" entry — powers Long-Con Radar staging. */
export interface ScriptMatch {
  id: string;
  /** Human label, e.g. "CRA / SIN-suspension arrest script". */
  label: string;
  /** Stage in a multi-step con, 1-indexed; undefined for single-shot scams. */
  stage?: number;
  /** What the script is ultimately trying to extract. */
  extraction?: string;
  confidence: number;
}

export interface SignalResult {
  family: SignalFamily;
  /** 0..1 where 1 = maximally fraudulent/risky. */
  risk: number;
  /** 0..1 — how much this signal should be trusted for THIS input. */
  confidence: number;
  reasons: ReasonCode[];
  /** Structured evidence for the explainability ledger. */
  evidence?: Record<string, unknown>;
  detectedScript?: ScriptMatch;
}

export interface CheckContext {
  /** Pressure question: did the user initiate contact? */
  userInitiated?: boolean;
  /** Is the counterparty a known, saved contact? */
  knownContact?: boolean;
  /** Amount of money in play, CAD — drives Check-Before-You-Send + anomaly. */
  amountCAD?: number;
  /** Thread id for conversation memory / Long-Con Radar. */
  threadId?: string;
  /** Optional externally-supplied synthetic-voice likelihood (0..1). */
  synthLikelihood?: number;
  /** Optional per-user behavioural baseline summary for the anomaly net. */
  baseline?: UserBaseline;
}

export interface UserBaseline {
  knownRecipients?: string[];
  typicalMaxAmountCAD?: number;
  typicalContactHours?: [number, number]; // [startHour, endHour] local
}

export interface CheckInput {
  /** Message body, transcript text, ad copy, job offer, etc. */
  text?: string;
  /** A single URL, or the most suspicious URL extracted from `text`. */
  url?: string;
  /** Interac handle, phone number, email, or crypto wallet address. */
  recipient?: string;
  channel?: Channel;
  /** Preferred output language; auto-detected from text when omitted. */
  language?: Language;
  context?: CheckContext;
  /** Live network-plane lookup (community reports). Injected by the host. */
  network?: NetworkLookup;
}

/**
 * The network plane is injected, never imported — the engine stays pure and the
 * host (web app, SDK tenant) owns where consented community intel lives.
 */
export interface NetworkLookup {
  /** Returns a report record if this artifact has been flagged, else null. */
  lookup(artifact: string): NetworkReport | null;
}

export interface NetworkReport {
  artifact: string;
  reports: number;
  /** 0..1 reputation-decayed confidence that this is malicious. */
  confidence: number;
  firstSeen?: string;
  category?: string;
}

export interface SignalBreakdown {
  family: SignalFamily;
  risk: number;
  confidence: number;
  /** Weighted contribution to the final score, 0..1. */
  contribution: number;
  reasons: ReasonCode[];
}

export interface TrustResult {
  /** 1 (certain fraud) … 100 (high confidence safe). Higher = safer. */
  trustScore: number;
  verdict: Verdict;
  action: RecommendedAction;
  language: Language;
  /**
   * ± band on the score reflecting how much evidence we actually had.
   * Calibrated honesty: a thin-evidence check says so out loud.
   */
  uncertainty: number;
  /** Top three localized reasons, highest-contribution first. */
  topReasons: ReasonCode[];
  /** The full per-signal ledger — the calibrated-honesty moat, in product. */
  ledger: SignalBreakdown[];
  detectedScript?: ScriptMatch;
  /** Stable id for audit logging on the network plane. */
  decisionId: string;
  /** Engine + corpus version, for the quarterly calibration report. */
  engineVersion: string;
  /** Wall-clock ms the scoring took (latency budget telemetry). */
  latencyMs: number;
}
