"use client";

import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";

const BREACHES = [
  { name: "LinkedIn (2021)", data: "Email, phone, job title", fix: "Phone number leaked — enable SIM-swap protection" },
  { name: "A retail loyalty program (2023)", data: "Email, password, address", fix: "Reused password — rotate it & add a passkey", urgent: true },
  { name: "A telecom breach (2022)", data: "Name, account number", fix: "Watch for ‘account verification’ smishing" },
];
const BROKERS = ["WhitePages-style aggregator", "A people-search site", "A marketing data broker"];

export default function ExposureSweepPage() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [removed, setRemoved] = useState<number[]>([]);

  function scan() {
    if (!email.trim()) return;
    setPhase("scanning");
    setTimeout(() => setPhase("done"), 1600);
  }

  return (
    <FeatureShell slug="exposure-sweep">
      <p className="max-w-2xl text-ice-dim">
        What scammers know about you, found and shut down. Breached-credential checks plus Canadian
        data-broker scans with <b>statutory deletion demands filed under PIPEDA and Law 25</b> — not
        polite opt-outs. Findings feed the Trust Engine, so a phishing text that “knows your bank”
        gets explained.
      </p>

      <div className="card p-5">
        <label className="mb-1 block text-sm font-medium text-ice">Your email (we check, we don&apos;t store it)</label>
        <div className="flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scan()}
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-ice outline-none focus:border-safe"
          />
          <button onClick={scan} disabled={!email.trim() || phase === "scanning"} className="btn btn-primary px-5 disabled:opacity-50">
            {phase === "scanning" ? "Sweeping…" : "Run sweep"}
          </button>
        </div>
      </div>

      {phase === "done" && (
        <>
          <section>
            <h2 className="text-lg font-bold text-ice">🔓 Breached credentials ({BREACHES.length})</h2>
            <div className="mt-3 space-y-2">
              {BREACHES.map((b, i) => (
                <div key={i} className="card flex items-start gap-3 p-4" style={b.urgent ? { borderColor: "#ff4d6a55" } : undefined}>
                  <span className="text-xl">{b.urgent ? "🔴" : "🟠"}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ice">{b.name}</p>
                    <p className="text-xs text-ice-dim">Exposed: {b.data}</p>
                    <p className="mt-1 text-sm" style={{ color: b.urgent ? "#ff8aa0" : "#f2b441" }}>→ {b.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ice">🧹 Data-broker exposure ({BROKERS.length})</h2>
            <div className="mt-3 space-y-2">
              {BROKERS.map((b, i) => (
                <div key={i} className="card flex items-center gap-3 p-4">
                  <span className="flex-1 text-sm text-ice">{b}</span>
                  {removed.includes(i) ? (
                    <span className="pill text-safe">✓ Law 25 deletion demand filed</span>
                  ) : (
                    <button onClick={() => setRemoved((r) => [...r, i])} className="btn btn-ghost px-3 py-1.5 text-xs">
                      File deletion demand
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-ice-dim">
              These carry statutory penalties behind them — KinShield files the legal demand, not a polite opt-out.
            </p>
          </section>

          <div className="card p-4">
            <span className="pill text-safe">Shadow Contacts</span>
            <p className="mt-1 text-sm text-ice-dim">
              For marketplaces and dating, generate a disposable email/number that burns in one tap —
              so your real coordinates never enter circulation.
            </p>
            <button className="btn btn-ghost mt-2 px-3 py-1.5 text-xs">+ Generate a Shadow Contact</button>
          </div>
        </>
      )}
    </FeatureShell>
  );
}
