"use client";

/**
 * VraiShield app state — a persistent client store (localStorage).
 *
 * This is the "personal plane" in the demo: it lives only on the user's device.
 * In production this is the E2EE vault; here it is localStorage, but the shape
 * and the privacy posture are the same — the server never sees this data.
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Language, Verdict, Channel } from "@/lib/trust-engine";

export type MemberRole = "guardian" | "member" | "senior";

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  language: Language;
  device: string;
}

export interface ScanRecord {
  id: string;
  ts: number;
  channel: Channel;
  score: number;
  verdict: Verdict;
  snippet: string;
  scriptLabel?: string;
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
  largeTransferPing: boolean;
}

export interface KSState {
  hydrated: boolean;
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
  hydrated: false,
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
    largeTransferPing: true,
  },
};

const KEY = "vraishield.state.v1";

interface KSContext extends KSState {
  completeOnboarding: (p: { name: string; role: KSState["profile"]["role"]; language: Language; household: string; members: Member[]; seniorMode: boolean; tier: KSState["profile"]["tier"] }) => void;
  addScan: (r: Omit<ScanRecord, "id" | "ts">) => void;
  addAlert: (a: Omit<AlertItem, "id" | "ts">) => void;
  markAlertsRead: () => void;
  addMember: (m: Omit<Member, "id">) => void;
  removeMember: (id: string) => void;
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  setHardening: (n: number) => void;
  setDrillBest: (n: number) => void;
  setTier: (t: KSState["profile"]["tier"]) => void;
  reset: () => void;
}

const Ctx = createContext<KSContext | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function VraiShieldProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KSState>(DEFAULT);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) ?? localStorage.getItem("kinshield.state.v1");
      if (raw) {
        const parsed = JSON.parse(raw) as KSState;
        setState({ ...DEFAULT, ...parsed, hydrated: true });
      } else {
        setState((s) => ({ ...s, hydrated: true }));
      }
    } catch {
      setState((s) => ({ ...s, hydrated: true }));
    }
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { hydrated: _h, ...persist } = state;
      void _h;
      localStorage.setItem(KEY, JSON.stringify(persist));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [state]);

  const completeOnboarding = useCallback<KSContext["completeOnboarding"]>((p) => {
    setState((s) => ({
      ...s,
      onboarded: true,
      profile: { name: p.name, role: p.role, tier: p.tier },
      household: { name: p.household, members: p.members },
      settings: { ...s.settings, language: p.language, seniorMode: p.seniorMode },
      alerts: [
        { id: uid(), ts: Date.now(), severity: "info", title: "Welcome to VraiShield", body: `${p.household} is now protected. Add a suspicious message anytime with Ask VraiShield.` },
        ...s.alerts,
      ],
    }));
  }, []);

  const addScan = useCallback<KSContext["addScan"]>((r) => {
    setState((s) => {
      const rec: ScanRecord = { ...r, id: uid(), ts: Date.now() };
      const alerts = [...s.alerts];
      if (r.verdict === "dangerous" || r.verdict === "likely_scam") {
        alerts.unshift({
          id: uid(), ts: Date.now(), severity: r.verdict === "dangerous" ? "danger" : "warn",
          title: r.verdict === "dangerous" ? "Threat blocked" : "Suspicious message flagged",
          body: `${r.scriptLabel ?? "A risky message"} — Trust Score ${r.score}/100.`,
        });
      }
      return { ...s, history: [rec, ...s.history].slice(0, 200), alerts: alerts.slice(0, 100) };
    });
  }, []);

  const addAlert = useCallback<KSContext["addAlert"]>((a) => {
    setState((s) => ({ ...s, alerts: [{ ...a, id: uid(), ts: Date.now() }, ...s.alerts].slice(0, 100) }));
  }, []);

  const markAlertsRead = useCallback(() => {
    setState((s) => ({ ...s, alerts: s.alerts.map((a) => ({ ...a, read: true })) }));
  }, []);

  const addMember = useCallback<KSContext["addMember"]>((m) => {
    setState((s) => ({ ...s, household: { ...s.household, members: [...s.household.members, { ...m, id: uid() }] } }));
  }, []);

  const removeMember = useCallback((id: string) => {
    setState((s) => ({ ...s, household: { ...s.household, members: s.household.members.filter((m) => m.id !== id) } }));
  }, []);

  const setSetting = useCallback<KSContext["setSetting"]>((k, v) => {
    setState((s) => ({ ...s, settings: { ...s.settings, [k]: v } }));
  }, []);

  const setHardening = useCallback((n: number) => setState((s) => ({ ...s, hardeningScore: n })), []);
  const setDrillBest = useCallback((n: number) => setState((s) => ({ ...s, drillBest: Math.max(s.drillBest, n) })), []);
  const setTier = useCallback((t: KSState["profile"]["tier"]) => setState((s) => ({ ...s, profile: { ...s.profile, tier: t } })), []);
  const reset = useCallback(() => { setState({ ...DEFAULT, hydrated: true }); }, []);

  return (
    <Ctx.Provider value={{ ...state, completeOnboarding, addScan, addAlert, markAlertsRead, addMember, removeMember, setSetting, setHardening, setDrillBest, setTier, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useVraiShield(): KSContext {
  const c = useContext(Ctx);
  if (!c) throw new Error("useVraiShield must be used within VraiShieldProvider");
  return c;
}
