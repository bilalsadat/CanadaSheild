/**
 * The network plane (demo store).
 *
 * In production this is a graph DB of consented, pseudonymized, human-reviewed
 * attacker artifacts in ca-central-1 — never personal data. Here it is an
 * in-memory store seeded with a few flagged artifacts so the Community Threat
 * Network and the engine's network signal are live in the demo. Reputation
 * decays over time, exactly as the spec requires (stale intel expires).
 */

import type { NetworkLookup, NetworkReport } from "@/lib/trust-engine";
import { CITY_COORDS, type HeatPoint } from "@/lib/geo";

export interface CommunityReport extends NetworkReport {
  category: string;
  city?: string;
  language?: string;
  lastSeen: string;
}

const HALF_LIFE_DAYS = 30;

class NetworkPlane implements NetworkLookup {
  private store = new Map<string, CommunityReport>();

  constructor(seed: Omit<CommunityReport, "confidence">[]) {
    for (const s of seed) {
      this.store.set(this.key(s.artifact), {
        ...s,
        confidence: this.decayedConfidence(s.reports, s.lastSeen),
      });
    }
  }

  private key(artifact: string): string {
    return artifact.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }

  private decayedConfidence(reports: number, lastSeen: string): number {
    const ageDays = (Date.now() - new Date(lastSeen).getTime()) / 86_400_000;
    const decay = Math.pow(0.5, Math.max(0, ageDays) / HALF_LIFE_DAYS);
    // More reports => higher base confidence, capped; then decayed by age.
    const base = Math.min(0.95, 0.5 + 0.09 * Math.min(reports, 6));
    return Math.round(base * decay * 100) / 100;
  }

  lookup(artifact: string): NetworkReport | null {
    const r = this.store.get(this.key(artifact));
    if (!r) return null;
    return { ...r, confidence: this.decayedConfidence(r.reports, r.lastSeen) };
  }

  report(artifact: string, category: string, opts: { city?: string; language?: string } = {}): CommunityReport {
    const k = this.key(artifact);
    const existing = this.store.get(k);
    const now = new Date().toISOString();
    if (existing) {
      existing.reports += 1;
      existing.lastSeen = now;
      existing.confidence = this.decayedConfidence(existing.reports, now);
      return existing;
    }
    const created: CommunityReport = {
      artifact: k,
      reports: 1,
      category,
      city: opts.city,
      language: opts.language,
      firstSeen: now,
      lastSeen: now,
      confidence: this.decayedConfidence(1, now),
    };
    this.store.set(k, created);
    return created;
  }

  recent(limit = 12): CommunityReport[] {
    return [...this.store.values()]
      .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
      .slice(0, limit)
      .map((r) => ({ ...r, confidence: this.decayedConfidence(r.reports, r.lastSeen) }));
  }

  stats() {
    const all = [...this.store.values()];
    const totalReports = all.reduce((a, b) => a + b.reports, 0);
    return { artifacts: all.length, totalReports };
  }

  /** Geo-bucketed heat points for the threat map (city-level only). */
  geoBuckets(): HeatPoint[] {
    const byCity = new Map<string, HeatPoint>();
    for (const r of this.store.values()) {
      if (!r.city) continue;
      const coords = CITY_COORDS[r.city];
      if (!coords) continue;
      let pt = byCity.get(r.city);
      if (!pt) {
        pt = { city: r.city, lat: coords[0], lng: coords[1], reports: 0, artifacts: 0, topCategory: r.category, categories: {} };
        byCity.set(r.city, pt);
      }
      pt.reports += r.reports;
      pt.artifacts += 1;
      pt.categories[r.category] = (pt.categories[r.category] ?? 0) + r.reports;
    }
    for (const pt of byCity.values()) {
      pt.topCategory = Object.entries(pt.categories).sort((a, b) => b[1] - a[1])[0]?.[0] ?? pt.topCategory;
    }
    return [...byCity.values()].sort((a, b) => b.reports - a.reports);
  }
}

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

// Seeded so the network signal and Community page are alive on first load.
const SEED: Omit<CommunityReport, "confidence">[] = [
  { artifact: "interac-secure-deposit.xyz", reports: 41, category: "Interac phishing", city: "Surrey, BC", language: "en", firstSeen: daysAgo(9), lastSeen: daysAgo(0) },
  { artifact: "canadapost.delivery-fee.top", reports: 33, category: "Canada Post smish", city: "Brampton, ON", language: "pa", firstSeen: daysAgo(6), lastSeen: daysAgo(0) },
  { artifact: "cra-refund-gov.xyz", reports: 58, category: "CRA refund phish", city: "Toronto, ON", language: "zh", firstSeen: daysAgo(12), lastSeen: daysAgo(1) },
  { artifact: "6045550147", reports: 22, category: "CRA arrest robocall", city: "Vancouver, BC", language: "en", firstSeen: daysAgo(4), lastSeen: daysAgo(0) },
  { artifact: "4035550199", reports: 15, category: "Grandparent scam", city: "Calgary, AB", language: "en", firstSeen: daysAgo(3), lastSeen: daysAgo(0) },
  { artifact: "maple-yield-capital.top", reports: 27, category: "Pig-butchering platform", city: "Mississauga, ON", language: "zh", firstSeen: daysAgo(18), lastSeen: daysAgo(2) },
  { artifact: "ircc-status-update.click", reports: 19, category: "IRCC status threat", city: "Montréal, QC", language: "fr", firstSeen: daysAgo(7), lastSeen: daysAgo(1) },
  { artifact: "rbc-secure-alert.top", reports: 36, category: "Bank impersonation", city: "Toronto, ON", language: "en", firstSeen: daysAgo(5), lastSeen: daysAgo(0) },
  { artifact: "7805550133", reports: 12, category: "Tech-support scam", city: "Edmonton, AB", language: "en", firstSeen: daysAgo(8), lastSeen: daysAgo(1) },
  { artifact: "service-canada-benefits.click", reports: 24, category: "Service Canada phish", city: "Ottawa, ON", language: "fr", firstSeen: daysAgo(6), lastSeen: daysAgo(0) },
  { artifact: "2045550178", reports: 9, category: "Grandparent scam", city: "Winnipeg, MB", language: "en", firstSeen: daysAgo(4), lastSeen: daysAgo(1) },
  { artifact: "amaz0n-ca-refund.top", reports: 17, category: "Refund / gift-card scam", city: "Burnaby, BC", language: "zh", firstSeen: daysAgo(10), lastSeen: daysAgo(2) },
  { artifact: "9025550190", reports: 7, category: "Canada Post smish", city: "Halifax, NS", language: "en", firstSeen: daysAgo(3), lastSeen: daysAgo(0) },
  { artifact: "quebec-impots-remboursement.xyz", reports: 21, category: "Revenu Québec phish", city: "Québec City, QC", language: "fr", firstSeen: daysAgo(9), lastSeen: daysAgo(1) },
  { artifact: "elite-fx-traders.top", reports: 14, category: "Pig-butchering platform", city: "Saskatoon, SK", language: "en", firstSeen: daysAgo(15), lastSeen: daysAgo(3) },
];

// Module-level singleton — persists for the life of the server process.
declare global {
  // eslint-disable-next-line no-var
  var __kinshield_network__: NetworkPlane | undefined;
}

export const networkPlane: NetworkPlane =
  globalThis.__kinshield_network__ ?? (globalThis.__kinshield_network__ = new NetworkPlane(SEED));
