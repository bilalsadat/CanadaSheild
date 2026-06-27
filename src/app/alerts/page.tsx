"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useKinShield } from "@/lib/store";

const SEV: Record<string, { color: string; bg: string; icon: string }> = {
  info: { color: "#7aa2ff", bg: "rgba(122,162,255,0.12)", icon: "ℹ️" },
  warn: { color: "#f2b441", bg: "rgba(242,180,65,0.12)", icon: "⚠️" },
  danger: { color: "#ff4d6a", bg: "rgba(255,77,106,0.12)", icon: "⛔" },
};

export default function AlertsPage() {
  const ks = useKinShield();
  useEffect(() => { ks.markAlertsRead(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5 py-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ice">Alerts</h1>
          <p className="text-ice-dim">Flagged events across your household, newest first.</p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost px-4 py-2 text-sm">← Dashboard</Link>
      </header>

      {ks.alerts.length === 0 ? (
        <div className="card p-8 text-center text-ice-dim">
          <p className="text-4xl">🔔</p>
          <p className="mt-2">No alerts yet. As you check messages and protect your family, important events show up here.</p>
          <Link href="/" className="btn btn-primary mt-4 px-5 py-2.5">Check a message →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {ks.alerts.map((a) => {
            const s = SEV[a.severity];
            return (
              <div key={a.id} className="card flex items-start gap-3 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg" style={{ background: s.bg }}>{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold" style={{ color: s.color }}>{a.title}</p>
                  <p className="text-sm text-ice-dim">{a.body}</p>
                  <p className="mt-0.5 text-xs text-ice-dim">{timeAgo(a.ts)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
