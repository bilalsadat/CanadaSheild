import type { CheckInput, ReasonCode, SignalResult } from "../types";
import {
  LEGIT_DOMAINS,
  BRAND_TOKENS,
  HIGH_RISK_TLDS,
  URL_SHORTENERS,
  hasHomoglyphs,
  levenshtein,
} from "../corpus/brands";
import { extractUrls, parseUrl, looksLikeCryptoWallet, normalize, clamp01 } from "../util";

/**
 * Artifact signal — forensics on the *things* in a message: URLs, domains, QR
 * targets, recipient handles. Domain age/WHOIS/CT live here in production; this
 * build does the lexical forensics that need no network and catch most spoofs.
 */
export function analyzeArtifact(input: CheckInput): SignalResult {
  const reasons: ReasonCode[] = [];
  const evidence: Record<string, unknown> = {};
  let risk = 0;
  let confidence = 0;

  // Gather URLs: explicit + extracted from text.
  const urls = new Set<string>();
  if (input.url) urls.add(input.url);
  if (input.text) extractUrls(input.text).forEach((u) => urls.add(u));

  let worstUrlRisk = 0;
  const urlFindings: unknown[] = [];
  for (const raw of urls) {
    const p = parseUrl(raw);
    if (!p) continue;
    confidence = Math.max(confidence, 0.6);
    let r = 0;
    const flags: string[] = [];

    if (LEGIT_DOMAINS.has(p.registrable)) {
      // Known-good registrable domain. Path can still be phishy but domain is real.
      flags.push("known_legit_domain");
    } else {
      // Lookalike of a brand token?
      const lookalike = findLookalike(p.registrable, p.host);
      if (lookalike) {
        r = Math.max(r, 0.85);
        flags.push("brand_lookalike");
        reasons.push({
          code: "artifact.lookalike",
          params: { host: p.host, brand: lookalike },
          weight: 0.85,
        });
      }
      if (hasHomoglyphs(p.host)) {
        r = Math.max(r, 0.8);
        flags.push("homoglyph");
        reasons.push({ code: "artifact.homoglyph", params: { host: p.host }, weight: 0.8 });
      }
      if (HIGH_RISK_TLDS.has(p.tld)) {
        r = Math.max(r, 0.55);
        flags.push("risky_tld");
        reasons.push({ code: "artifact.risky_tld", params: { tld: p.tld }, weight: 0.45 });
      }
      if (URL_SHORTENERS.has(p.registrable)) {
        r = Math.max(r, 0.5);
        flags.push("shortener");
        reasons.push({ code: "artifact.shortener", params: { host: p.host }, weight: 0.4 });
      }
    }

    if (p.isIpLiteral) {
      r = Math.max(r, 0.7);
      flags.push("ip_literal");
      reasons.push({ code: "artifact.ip_literal", params: { host: p.host }, weight: 0.6 });
    }
    if (p.hasCredentials) {
      r = Math.max(r, 0.75);
      flags.push("credentials_in_url");
      reasons.push({ code: "artifact.credentials_in_url", params: { host: p.host }, weight: 0.6 });
    }
    if (p.subdomainDepth >= 3) {
      r = Math.max(r, 0.5);
      flags.push("deep_subdomains");
      reasons.push({ code: "artifact.deep_subdomains", params: { host: p.host }, weight: 0.35 });
    }
    // Brand token in subdomain/path but not the registrable domain — classic phish.
    const fullLower = normalize(p.host + p.path);
    const brandToken = BRAND_TOKENS.find((t) => fullLower.includes(t));
    if (brandToken && !LEGIT_DOMAINS.has(p.registrable) && r < 0.6) {
      r = Math.max(r, 0.65);
      flags.push("brand_token_off_domain");
      reasons.push({
        code: "artifact.brand_offdomain",
        params: { host: p.host, brand: brandToken },
        weight: 0.55,
      });
    }

    urlFindings.push({ host: p.host, registrable: p.registrable, flags, risk: r });
    worstUrlRisk = Math.max(worstUrlRisk, r);
  }
  if (urlFindings.length) evidence.urls = urlFindings;
  risk = Math.max(risk, worstUrlRisk);

  // Recipient forensics (Check Before You Send territory).
  if (input.recipient) {
    confidence = Math.max(confidence, 0.55);
    const rcpt = input.recipient.trim();
    if (looksLikeCryptoWallet(rcpt)) {
      // A crypto wallet as the destination of a "refund"/"investment" is high risk.
      const moneyContext = /invest|refund|return|profit|deposit|tax|withdraw/i.test(input.text ?? "");
      const r = moneyContext ? 0.8 : 0.55;
      risk = Math.max(risk, r);
      reasons.push({ code: "artifact.crypto_recipient", params: { wallet: shorten(rcpt) }, weight: r });
      evidence.recipientType = "crypto_wallet";
    } else if (/@/.test(rcpt) && /bank|cra|gov|interac|secure|support|refund/i.test(rcpt.split("@")[0])) {
      // Free-mail address wearing an institutional handle.
      const domain = rcpt.split("@")[1]?.toLowerCase() ?? "";
      if (/(gmail|outlook|hotmail|yahoo|proton|icloud)\./.test(domain)) {
        risk = Math.max(risk, 0.7);
        reasons.push({ code: "artifact.freemail_institution", params: { recipient: rcpt }, weight: 0.6 });
        evidence.recipientType = "freemail_institution";
      }
    }
  }

  // A definitive artifact flag (lookalike, homoglyph, IP, credentials, crypto
  // recipient) is high-confidence — we are sure about what we SEE, even if we
  // can't see the prose. This lets a spoofed domain drive the verdict.
  if (risk >= 0.6) confidence = Math.max(confidence, 0.92);

  return { family: "artifact", risk: clamp01(risk), confidence, reasons, evidence };
}

function findLookalike(registrable: string, host: string): string | null {
  const core = registrable.split(".")[0];
  for (const token of BRAND_TOKENS) {
    if (core === token) continue; // exact token alone isn't necessarily the brand's real domain
    // Contains a brand token but isn't a legit domain, OR is 1–2 edits away.
    if (core.includes(token) && core !== token) return token;
    if (token.length >= 4 && levenshtein(core, token) > 0 && levenshtein(core, token) <= 2) {
      return token;
    }
  }
  // Hyphenated impersonation like "interac-secure" / "cra-refund".
  if (/(interac|cra|canadapost|rbc|scotia|cibc|bmo|ircc)[-.]/.test(host)) {
    return host.match(/(interac|cra|canadapost|rbc|scotia|cibc|bmo|ircc)/)?.[0] ?? null;
  }
  return null;
}

function shorten(s: string): string {
  return s.length > 14 ? s.slice(0, 6) + "…" + s.slice(-4) : s;
}
