import type { NetworkLookup, NetworkReport } from "./trust-engine";

/** City-level threat clusters for the native map + dashboard (consented network plane). */
export interface ThreatCity {
  city: string;
  region: string;
  lat: number;
  lng: number;
  reports: number;
  topCategory: string;
  language: string;
}

export const THREAT_CITIES: ThreatCity[] = [
  { city: "Toronto", region: "ON", lat: 43.6532, lng: -79.3832, reports: 94, topCategory: "CRA refund phishing", language: "EN/ZH" },
  { city: "Surrey", region: "BC", lat: 49.1913, lng: -122.849, reports: 41, topCategory: "Interac phishing", language: "PA/EN" },
  { city: "Brampton", region: "ON", lat: 43.7315, lng: -79.7624, reports: 33, topCategory: "Canada Post smishing", language: "PA" },
  { city: "Mississauga", region: "ON", lat: 43.589, lng: -79.6441, reports: 27, topCategory: "Pig-butchering", language: "ZH" },
  { city: "Vancouver", region: "BC", lat: 49.2827, lng: -123.1207, reports: 22, topCategory: "CRA arrest robocall", language: "EN" },
  { city: "Ottawa", region: "ON", lat: 45.4215, lng: -75.6972, reports: 24, topCategory: "Service Canada phishing", language: "FR/EN" },
  { city: "Québec City", region: "QC", lat: 46.8139, lng: -71.208, reports: 21, topCategory: "Revenu Québec phishing", language: "FR" },
  { city: "Montréal", region: "QC", lat: 45.5019, lng: -73.5674, reports: 19, topCategory: "IRCC status threat", language: "FR/AR" },
  { city: "Calgary", region: "AB", lat: 51.0447, lng: -114.0719, reports: 15, topCategory: "Grandparent scam", language: "EN" },
  { city: "Edmonton", region: "AB", lat: 53.5461, lng: -113.4938, reports: 12, topCategory: "Tech-support scam", language: "EN" },
  { city: "Winnipeg", region: "MB", lat: 49.8951, lng: -97.1384, reports: 9, topCategory: "Grandparent scam", language: "EN/TL" },
  { city: "Halifax", region: "NS", lat: 44.6488, lng: -63.5752, reports: 7, topCategory: "Unpaid-toll smishing", language: "EN" },
  { city: "Saskatoon", region: "SK", lat: 52.1332, lng: -106.67, reports: 14, topCategory: "Investment / pig-butchering", language: "EN" },
];

export const NATIONAL_STATS = {
  totalReports: THREAT_CITIES.reduce((a, c) => a + c.reports, 0),
  cities: THREAT_CITIES.length,
  reportedLosses2024: "$638M+",
};

/** Seeded attacker artifacts so the engine's network signal corroborates on-device. */
const FLAGGED: Record<string, { reports: number; category: string }> = {
  "interac-secure-deposit.xyz": { reports: 41, category: "Interac phishing" },
  "canadapost.delivery-fee.top": { reports: 33, category: "Canada Post smish" },
  "cra-refund-gov.xyz": { reports: 58, category: "CRA refund phish" },
  "rbc-secure-alert.top": { reports: 36, category: "Bank impersonation" },
  "407-toll-pay.top": { reports: 17, category: "Unpaid toll smish" },
  "maple-yield-capital.top": { reports: 27, category: "Pig-butchering" },
  "6045550147": { reports: 22, category: "CRA arrest robocall" },
  "4035550199": { reports: 15, category: "Grandparent scam" },
};

export const networkLookup: NetworkLookup = {
  lookup(artifact: string): NetworkReport | null {
    const key = artifact.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const hit = FLAGGED[key];
    if (!hit) return null;
    return { artifact: key, reports: hit.reports, confidence: Math.min(0.95, 0.5 + 0.09 * Math.min(hit.reports, 6)), category: hit.category };
  },
};
