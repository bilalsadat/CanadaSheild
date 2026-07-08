import type { CheckInput, ReasonCode, SignalResult } from "../types";
import { extractUrls, parseUrl, clamp01 } from "../util";

/**
 * Network signal — the consented community plane: numbers, senders, URLs and
 * scripts one Canadian flagged, protecting the next within minutes. The lookup
 * is injected by the host so the engine never owns or imports the data store.
 */
export function analyzeNetwork(input: CheckInput): SignalResult {
  const reasons: ReasonCode[] = [];
  const lookup = input.network;
  if (!lookup) {
    return { family: "network", risk: 0, confidence: 0, reasons };
  }

  const artifacts = new Set<string>();
  if (input.recipient) artifacts.add(input.recipient.trim().toLowerCase());
  if (input.url) {
    const p = parseUrl(input.url);
    if (p) artifacts.add(p.registrable);
  }
  if (input.text) {
    for (const u of extractUrls(input.text)) {
      const p = parseUrl(u);
      if (p) artifacts.add(p.registrable);
    }
    // Bare phone numbers in the text.
    const phones = input.text.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) ?? [];
    phones.forEach((ph) => artifacts.add(ph.replace(/\D/g, "")));
  }

  let risk = 0;
  let confidence = 0;
  let totalReports = 0;
  for (const a of artifacts) {
    const rep = lookup.lookup(a);
    if (rep && rep.reports > 0) {
      totalReports += rep.reports;
      risk = Math.max(risk, rep.confidence);
      confidence = Math.max(confidence, clamp01(0.4 + 0.1 * Math.min(rep.reports, 5)));
      reasons.push({
        code: "network.community_flag",
        params: { artifact: a, reports: rep.reports, category: rep.category ?? "scam" },
        weight: rep.confidence,
      });
    }
  }

  return { family: "network", risk: clamp01(risk), confidence, reasons, evidence: { totalReports } };
}
