import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Language, Verdict, Channel } from "./trust-engine";

export type MemberRole = "guardian" | "member" | "senior";

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  language: Language;
  device: string;
}

/** Full stored verdict so any past check can be reopened in detail. Personal plane: on-device only. */
export interface ScanDetail {
  verdictLabel: string;
  actionLabel: string;
  uncertainty: number;
  reasons: string[];
  ledger: { family: string; risk: number }[];
  scriptLabel?: string;
  scriptStage?: number;
  fullText?: string;
}

export interface ScanRecord {
  id: string;
  ts: number;
  channel: Channel;
  score: number;
  verdict: Verdict;
  snippet: string;
  scriptLabel?: string;
  detail?: ScanDetail;
}

export interface AlertItem {
  id: string;
  ts: number;
  severity: "info" | "warn" | "danger";
  title: string;
  body: string;
  read?: boolean;
}

export interface Settings {
  language: Language;
  seniorMode: boolean;
  notifications: boolean;
  screenUnknownCallers: boolean;
  speakVerdicts: boolean;
  haptics: boolean;
}

export interface KSState {
  onboarded: boolean;
  profile: { name: string; role: "self" | "parent" | "business" | ""; tier: "Free" | "Family" | "Premium" };
  household: { name: string; members: Member[] };
  history: ScanRecord[];
  alerts: AlertItem[];
  hardeningScore: number;
  drillBest: number;
  settings: Settings;
}

const DEFAULT: KSState = {
  onboarded: false,
  profile: { name: "", role: "", tier: "Free" },
  household: { name: "", members: [] },
  history: [],
  alerts: [],
  hardeningScore: 0,
  drillBest: 0,
  settings: {
    language: "en",
    seniorMode: false,
    notifications: true,
    screenUnknownCallers: true,
    speakVerdicts: true,
    haptics: true,
  },
};

const KEY = "kinshield.state.v2";
const LEGACY_KEY = "kinshield.state.v1";
const uid = () => Math.random().toString(36).slice(2, 10);

interface Ctx extends KSState {
  hydrated: boolean;
  unreadAlerts: number;
  completeOnboarding: (p: { name: string; role: KSState["profile"]["role"]; language: Language; household: string; members: Member[]; tier: KSState["profile"]["tier"]; seniorMode: boolean }) => void;
  addScan: (r: Omit<ScanRecord, "id" | "ts">) => void;
  markAlertsRead: () => void;
  addMember: (m: Omit<Member, "id">) => void;
  removeMember: (id: string) => void;
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  setHardening: (n: number) => void;
  setDrillBest: (n: number) => void;
  setTier: (t: KSState["profile"]["tier"]) => void;
  reset: () => void;
}

const C = createContext<Ctx | null>(null);

export function KinShieldProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KSState>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = (await AsyncStorage.getItem(KEY)) ?? (await AsyncStorage.getItem(LEGACY_KEY));
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<KSState>;
          setState({ ...DEFAULT, ...parsed, settings: { ...DEFAULT.settings, ...(parsed.settings ?? {}) } });
        }
      } catch {
        /* fresh start */
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const completeOnboarding = useCallback<Ctx["completeOnboarding"]>((p) => {
    setState((s) => ({
      ...s,
      onboarded: true,
      profile: { name: p.name, role: p.role, tier: p.tier },
      household: { name: p.household, members: p.members },
      settings: { ...s.settings, language: p.language, seniorMode: p.seniorMode },
      alerts: [
        { id: uid(), ts: Date.now(), severity: "info", title: "Welcome to KinShield", body: `${p.household} is now protected.` },
        ...s.alerts,
      ],
    }));
  }, []);

  const addScan = useCallback<Ctx["addScan"]>((r) => {
    setState((s) => {
      const rec: ScanRecord = { ...r, id: uid(), ts: Date.now() };
      const alerts = [...s.alerts];
      if (r.verdict === "dangerous" || r.verdict === "likely_scam") {
        alerts.unshift({
          id: uid(),
          ts: Date.now(),
          severity: r.verdict === "dangerous" ? "danger" : "warn",
          title: r.verdict === "dangerous" ? "Threat blocked" : "Suspicious message flagged",
          body: `${r.scriptLabel ?? "A risky message"} — Trust Score ${r.score}/100.`,
        });
      }
      return { ...s, history: [rec, ...s.history].slice(0, 200), alerts: alerts.slice(0, 100) };
    });
  }, []);

  const markAlertsRead = useCallback(() => {
    setState((s) => (s.alerts.some((a) => !a.read) ? { ...s, alerts: s.alerts.map((a) => ({ ...a, read: true })) } : s));
  }, []);

  const addMember = useCallback<Ctx["addMember"]>((m) => setState((s) => ({ ...s, household: { ...s.household, members: [...s.household.members, { ...m, id: uid() }] } })), []);
  const removeMember = useCallback((id: string) => setState((s) => ({ ...s, household: { ...s.household, members: s.household.members.filter((m) => m.id !== id) } })), []);
  const setSetting = useCallback<Ctx["setSetting"]>((k, v) => setState((s) => ({ ...s, settings: { ...s.settings, [k]: v } })), []);
  const setHardening = useCallback((n: number) => setState((s) => ({ ...s, hardeningScore: n })), []);
  const setDrillBest = useCallback((n: number) => setState((s) => ({ ...s, drillBest: Math.max(s.drillBest, n) })), []);
  const setTier = useCallback((t: KSState["profile"]["tier"]) => setState((s) => ({ ...s, profile: { ...s.profile, tier: t } })), []);
  const reset = useCallback(() => setState(DEFAULT), []);

  const unreadAlerts = state.alerts.filter((a) => !a.read).length;

  return (
    <C.Provider value={{ ...state, hydrated, unreadAlerts, completeOnboarding, addScan, markAlertsRead, addMember, removeMember, setSetting, setHardening, setDrillBest, setTier, reset }}>
      {children}
    </C.Provider>
  );
}

export function useKinShield(): Ctx {
  const c = useContext(C);
  if (!c) throw new Error("useKinShield must be used within KinShieldProvider");
  return c;
}
