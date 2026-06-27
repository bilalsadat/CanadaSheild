import type { Language } from "./types";

/** Lowercase + strip diacritics so "arrêté" matches "arrete". Leaves CJK/Gurmukhi intact. */
export function normalize(text: string): string {
  let t = text.toLowerCase();
  // String.normalize may be limited on some JS engines (Hermes); degrade gracefully.
  try {
    t = t.normalize("NFD").replace(/[̀-ͯ]/g, ""); // combining marks only — preserves 税务/ਟੈਕਸ
  } catch {
    /* keep accented form — base-corpus matching still works */
  }
  return t.replace(/\s+/g, " ").trim();
}

/**
 * Cheap, dependency-free language hint. Production swaps in a proper language-ID
 * model; this is enough to pick an output-explanation language and to choose the
 * right multilingual trigger set when the caller didn't specify one.
 */
export function detectLanguage(text: string): Language {
  // Script-based detection first (unambiguous).
  if (/[가-힣]/.test(text)) return "ko"; // Hangul
  if (/[؀-ۿ]/.test(text)) return "ar"; // Arabic
  if (/[ऀ-ॿ]/.test(text)) return "hi"; // Devanagari
  if (/[਀-੿]/.test(text)) return "pa"; // Gurmukhi
  if (/[一-鿿]/.test(text)) return "zh"; // CJK Han
  if (/[À-ỹ]/.test(text) && /\b(không|bạn|của|tài khoản|ngân hàng|chuyển)\b/i.test(text)) return "vi";

  // Latin-script languages by function words.
  const fr = /\b(vous|votre|compte|veuillez|merci|cliquez|virement|argent|s'il|impôt)\b/i;
  const es = /\b(usted|su cuenta|por favor|haga clic|dinero|banco|gracias|tarjeta)\b/i;
  const pt = /\b(você|sua conta|por favor|clique|dinheiro|banco|obrigado|cartão)\b/i;
  const tl = /\b(ang|mga|iyong|account|pakiusap|salamat|pera|bangko|padala)\b/i;
  if (fr.test(text)) return "fr";
  if (es.test(text)) return "es";
  if (pt.test(text)) return "pt";
  if (tl.test(text)) return "tl";
  return "en";
}

const URL_RE =
  /\b((?:https?:\/\/)?(?:[a-z0-9¡-￿-]+\.)+[a-z¡-￿]{2,}(?:\/[^\s]*)?)/gi;

/** Pull candidate URLs out of free text (smishing bodies, emails, ad copy). */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_RE) ?? [];
  return Array.from(new Set(matches.map((m) => m.replace(/[).,]+$/, ""))));
}

export interface ParsedUrl {
  raw: string;
  host: string;
  /** eTLD+1 style registrable domain (best-effort, no PSL dependency). */
  registrable: string;
  path: string;
  tld: string;
  hasCredentials: boolean;
  isIpLiteral: boolean;
  subdomainDepth: number;
}

export function parseUrl(raw: string): ParsedUrl | null {
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = "http://" + u;
  let url: URL;
  try {
    url = new URL(u);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  const labels = host.split(".");
  const tld = labels[labels.length - 1] ?? "";
  // Best-effort registrable domain: handle common 2-part ccTLDs (.co.uk, .gc.ca).
  const twoPart = new Set(["co", "com", "gc", "gov", "org", "net", "ac"]);
  let registrable = host;
  if (labels.length >= 3 && twoPart.has(labels[labels.length - 2])) {
    registrable = labels.slice(-3).join(".");
  } else if (labels.length >= 2) {
    registrable = labels.slice(-2).join(".");
  }
  return {
    raw,
    host,
    registrable,
    path: url.pathname + url.search,
    tld,
    hasCredentials: url.username !== "" || url.password !== "",
    isIpLiteral: /^\d{1,3}(\.\d{1,3}){3}$/.test(host),
    subdomainDepth: Math.max(0, labels.length - 2),
  };
}

/** Detect crypto wallet addresses (BTC / ETH) — strong signal in money contexts. */
export function looksLikeCryptoWallet(s: string): boolean {
  const t = s.trim();
  return (
    /^(bc1|[13])[a-km-zA-HJ-NP-Z0-9]{25,62}$/.test(t) || // BTC
    /^0x[a-fA-F0-9]{40}$/.test(t) // ETH
  );
}

/** Count how many phrases from a list appear in normalized text. */
export function countHits(haystack: string, needles: string[]): { count: number; hits: string[] } {
  const hits: string[] = [];
  for (const n of needles) {
    if (!n) continue;
    if (haystack.includes(normalize(n))) hits.push(n);
  }
  return { count: hits.length, hits };
}

/** Clamp to [0,1]. */
export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

/** Deterministic short id for decision logging (no crypto dependency needed). */
export function decisionId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}
