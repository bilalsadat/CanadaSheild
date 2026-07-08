"use client";

import { useEffect, useState, useCallback } from "react";
import { reportArtifact } from "@/lib/client";
import type { CommunityReport } from "@/lib/network-plane";

export default function CommunityPage() {
  const [recent, setRecent] = useState<CommunityReport[]>([]);
  const [stats, setStats] = useState<{ artifacts: number; totalReports: number }>({ artifacts: 0, totalReports: 0 });
  const [artifact, setArtifact] = useState("");
  const [category, setCategory] = useState("Phishing link");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/report");
    const data = await res.json();
    setRecent(data.recent);
    setStats(data.stats);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function submit() {
    if (!artifact.trim()) return;
    setBusy(true);
    await reportArtifact({ artifact, category });
    setArtifact("");
    await load();
    setBusy(false);
  }

  return (
    <div className="space-y-8 py-4">
      <header className="max-w-2xl">
        <span className="pill text-safe">Consent-clean network effect</span>
        <h1 className="mt-2 text-3xl font-bold text-ice sm:text-4xl">Community Threat Network</h1>
        <p className="mt-2 text-ice-dim">
          Every report protects every other Canadian within minutes. Only attacker artifacts —
          numbers, domains, handles — are shared, pseudonymized and human-reviewed. Never your
          personal data. This is the version of crowd-sourcing that survives PIPEDA and Law 25.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat big={stats.artifacts.toLocaleString()} small="attacker artifacts tracked" />
        <Stat big={stats.totalReports.toLocaleString()} small="community reports" />
        <Stat big="< 5 min" small="propagation to every user's cache" />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="text-xl font-bold text-ice">Live threat feed</h2>
          <p className="text-sm text-ice-dim">City-level only · k-anonymity thresholds · forwarded in aggregate to the CAFC.</p>
          <div className="mt-3 space-y-2">
            {recent.map((r) => (
              <div key={r.artifact} className="card flex items-center gap-3 p-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-bold tabular-nums"
                  style={{ background: "rgba(255,77,106,0.14)", color: "#ff4d6a" }}
                  title="reports"
                >
                  {r.reports}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm text-ice">{r.artifact}</p>
                  <p className="text-xs text-ice-dim">
                    {r.category}{r.city ? ` · ${r.city}` : ""}{r.language ? ` · ${r.language}` : ""}
                  </p>
                </div>
                <span className="pill text-ice-dim" title="reputation-decayed confidence">
                  {Math.round(r.confidence * 100)}%
                </span>
              </div>
            ))}
            {recent.length === 0 && <p className="text-sm text-ice-dim">Loading the feed…</p>}
          </div>
        </div>

        <div className="card h-fit p-5">
          <h2 className="font-bold text-ice">Report an attacker</h2>
          <p className="mt-1 text-sm text-ice-dim">
            Paste the scam number, link or handle. You&apos;re consenting to share only this
            artifact.
          </p>
          <input
            value={artifact}
            onChange={(e) => setArtifact(e.target.value)}
            placeholder="e.g. 604-555-0147 or fake-cra.xyz"
            className="mt-3 w-full rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-sm text-ice outline-none focus:border-safe"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-sm text-ice"
          >
            {["Phishing link", "Scam call", "Smishing text", "Investment / pig-butchering", "Job-offer scam", "Other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button onClick={submit} disabled={busy || !artifact.trim()} className="btn btn-primary mt-3 w-full py-2.5 disabled:opacity-50">
            {busy ? "Submitting…" : "⚑ Contribute to the network"}
          </button>
          <p className="mt-2 text-xs text-ice-dim">
            Contributor karma resists poisoning; reputation decays so stale intel expires.
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div className="card p-5">
      <p className="text-3xl font-bold text-safe">{big}</p>
      <p className="mt-1 text-sm text-ice-dim">{small}</p>
    </div>
  );
}
