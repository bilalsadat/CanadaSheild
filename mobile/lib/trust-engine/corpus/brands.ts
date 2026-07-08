/**
 * Canadian institution whitelist + lookalike detection data for the artifact
 * signal. Scammers burn thousands of fresh domains daily, so identifying the
 * *number* matters less than spotting a domain pretending to be one of these.
 */

/** Legitimate domains scammers most often impersonate in Canada. */
export const CANADIAN_BRAND_DOMAINS: { brand: string; domains: string[] }[] = [
  { brand: "Canada Revenue Agency", domains: ["canada.ca", "cra-arc.gc.ca"] },
  { brand: "Service Canada", domains: ["canada.ca", "servicecanada.gc.ca"] },
  { brand: "IRCC", domains: ["canada.ca", "cic.gc.ca", "ircc.canada.ca"] },
  { brand: "Canada Post", domains: ["canadapost-postescanada.ca", "canadapost.ca"] },
  { brand: "Interac", domains: ["interac.ca"] },
  { brand: "RBC", domains: ["rbcroyalbank.com", "rbc.com"] },
  { brand: "TD", domains: ["td.com", "tdcanadatrust.com"] },
  { brand: "Scotiabank", domains: ["scotiabank.com", "scotiaonline.scotiabank.com"] },
  { brand: "BMO", domains: ["bmo.com"] },
  { brand: "CIBC", domains: ["cibc.com"] },
  { brand: "Tangerine", domains: ["tangerine.ca"] },
  { brand: "Desjardins", domains: ["desjardins.com"] },
  { brand: "Service Ontario", domains: ["ontario.ca"] },
  { brand: "ICBC / provincial", domains: ["icbc.com"] },
  { brand: "Amazon", domains: ["amazon.ca", "amazon.com"] },
];

/** Flat list of every legitimate registrable domain, for fast membership. */
export const LEGIT_DOMAINS: ReadonlySet<string> = new Set(
  CANADIAN_BRAND_DOMAINS.flatMap((b) => b.domains),
);

/** Brand name tokens that, when they appear in a non-legit domain, smell of impersonation. */
export const BRAND_TOKENS: string[] = [
  "cra", "revenue", "canadapost", "postescanada", "interac", "rbc", "royalbank",
  "scotiabank", "scotia", "cibc", "bmo", "tdbank", "tangerine", "desjardins",
  "service-canada", "servicecanada", "ircc", "immigration", "gov-ca", "canada-gov",
  "amazon", "netflix", "paypal", "apple", "microsoft",
];

/** TLDs and shorteners disproportionately abused for fraud. */
export const HIGH_RISK_TLDS: ReadonlySet<string> = new Set([
  "zip", "mov", "xyz", "top", "click", "link", "live", "rest", "country",
  "gq", "cf", "tk", "ml", "work", "cam", "loan", "monster", "quest",
]);

export const URL_SHORTENERS: ReadonlySet<string> = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly",
  "cutt.ly", "rb.gy", "shorturl.at", "rebrand.ly", "tiny.cc",
]);

/**
 * Cyrillic / Greek homoglyphs commonly swapped into Latin domains
 * (е, а, о, р, с, …) — presence of any non-ASCII letter in a host that
 * imitates a known brand is a strong spoof signal.
 */
export function hasHomoglyphs(host: string): boolean {
  // Any letter outside basic Latin in a hostname label is suspicious.
  return /[^\x00-\x7f]/.test(host) || host.startsWith("xn--") || host.includes(".xn--");
}

/** Levenshtein distance, capped, for lookalike scoring. */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 4) return 5; // early out — too far to be a lookalike
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(
        dp[i] + 1,
        dp[i - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }
  return dp[m];
}
