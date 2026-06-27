"use client";

import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";

/** Mock registry — in production this is the CSA National Registration Search,
 *  provincial regulators, and corporate registries with entity resolution. */
const REGISTRY: Record<string, { registered: boolean; detail: string; source: string }> = {
  "rbc dominion securities": { registered: true, detail: "Registered investment dealer · IIROC member in good standing", source: "CSA National Registration Search" },
  "questrade": { registered: true, detail: "Registered investment dealer", source: "CSA National Registration Search" },
  "maple yield capital": { registered: false, detail: "No registration found. Matches a known fraud-alert pattern.", source: "CSA + provincial fraud alerts" },
  "elite fx traders": { registered: false, detail: "Not registered to trade or advise in any province. Flagged.", source: "OSC Investor Warnings" },
  "maplewealth capital inc": { registered: false, detail: "No registrant by this name. Common impersonation shell.", source: "CSA National Registration Search" },
};

export default function VerifyCaPage() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<null | { name: string; registered: boolean; detail: string; source: string }>(null);

  function lookup(name = q) {
    const key = name.trim().toLowerCase();
    const hit = REGISTRY[key];
    if (hit) setRes({ name, ...hit });
    else setRes({ name, registered: false, detail: "No registration found in Canadian regulator databases. Unregistered firms offering investments are a major red flag.", source: "CSA National Registration Search" });
  }

  return (
    <FeatureShell slug="verifyca">
      <p className="max-w-2xl text-ice-dim">
        Two-second verification against the institutions scammers impersonate. Investment offers are
        checked against the CSA National Registration Search and provincial regulators; job offers
        against corporate registries — with newcomer-language explanations of exactly what&apos;s wrong.
      </p>

      <div className="card p-5">
        <label className="mb-1 block text-sm font-medium text-ice">Company or “advisor” name</label>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="e.g. Maple Yield Capital"
            className="flex-1 rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-ice outline-none focus:border-safe"
          />
          <button onClick={() => lookup()} disabled={!q.trim()} className="btn btn-primary px-5 disabled:opacity-50">Verify</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Maple Yield Capital", "RBC Dominion Securities", "Elite FX Traders"].map((s) => (
            <button key={s} onClick={() => { setQ(s); lookup(s); }} className="rounded-full border border-[rgba(141,163,207,0.22)] px-3 py-1 text-xs text-ice-dim hover:border-safe hover:text-safe">
              {s}
            </button>
          ))}
        </div>
      </div>

      {res && (
        <div className="card p-5" style={{ borderColor: res.registered ? "#2bd9a655" : "#ff4d6a55" }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{res.registered ? "✅" : "⛔"}</span>
            <div>
              <p className="font-bold" style={{ color: res.registered ? "#2bd9a6" : "#ff4d6a" }}>
                {res.registered ? "Registered & in good standing" : "Not registered — high risk"}
              </p>
              <p className="text-sm text-ice">{res.name}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-ice-dim">{res.detail}</p>
          <p className="mt-2 text-xs text-ice-dim">Source: {res.source}</p>
          {!res.registered && (
            <p className="mt-3 rounded-lg bg-[rgba(255,77,106,0.1)] p-2 text-xs text-threat">
              Anyone in Canada offering investments must be registered. If they&apos;re not, do not send
              money — no matter how good the returns sound.
            </p>
          )}
        </div>
      )}
    </FeatureShell>
  );
}
