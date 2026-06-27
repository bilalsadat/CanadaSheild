"use client";

import { useEffect, useRef, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";

const SCRIPT: { who: "scammer" | "decoy"; text: string; harvest?: string }[] = [
  { who: "scammer", text: "This is the CRA. You owe $4,200 in back taxes and must pay today." },
  { who: "decoy", text: "Oh dear, the CRA? Let me find my glasses… now who did you say is calling?" },
  { who: "scammer", text: "Officer Davies, badge 4471. Pay now with gift cards or face arrest.", harvest: "Alias: “Officer Davies”, badge 4471" },
  { who: "decoy", text: "Gift cards? My grandson mentioned those. Which store… Canadian Tire? Or the other one?" },
  { who: "scammer", text: "Any store! Buy Apple cards and call me back at 604-555-0147.", harvest: "Callback number: 604-555-0147" },
  { who: "decoy", text: "Six… oh… four… you're going too fast, dear. Let me write it on this envelope…" },
  { who: "scammer", text: "Hurry! Send the codes to recovery-cra@gmail.com once you have them.", harvest: "Drop email: recovery-cra@gmail.com" },
  { who: "decoy", text: "My printer is out of ink. Can you hold while I find a pen? It'll just be a minute…" },
];

export default function HoneypotPage() {
  const [n, setN] = useState(0);
  const [running, setRunning] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!running) return;
    if (n >= SCRIPT.length) { setRunning(false); return; }
    t.current = setTimeout(() => setN((x) => x + 1), 1700);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [running, n]);

  const shown = SCRIPT.slice(0, n);
  const harvested = shown.filter((s) => s.harvest).map((s) => s.harvest!);
  const wastedSec = shown.length * 47;

  return (
    <FeatureShell slug="honeypot">
      <p className="max-w-2xl text-ice-dim">
        Numbers reported by multiple users get engaged by a decoy AI persona — confused, slow,
        endlessly polite — wasting scammer hours and harvesting scripts, numbers and accounts into
        the network plane. Precedented (O2&apos;s “Daisy”, Apate.ai). Never uses a user&apos;s voice;
        launches only behind counsel review.
      </p>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="pill text-gold">🍯 Decoy line — “Margaret”</span>
            <button onClick={() => { setN(0); setRunning(true); }} className="btn btn-primary px-4 py-1.5 text-sm">
              {n > 0 && !running ? "↺ Replay" : "▶ Engage scammer"}
            </button>
          </div>
          <div className="mt-4 min-h-[220px] space-y-2">
            {shown.map((m, i) => (
              <div key={i} className={`flex ${m.who === "decoy" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-3 py-2 text-sm"
                  style={{
                    background: m.who === "decoy" ? "rgba(232,184,58,0.16)" : "rgba(255,77,106,0.12)",
                    color: "#e7eefc",
                  }}
                >
                  <p className="mb-0.5 text-[10px] text-ice-dim">{m.who === "decoy" ? "Decoy persona" : "Scammer"}</p>
                  {m.text}
                </div>
              </div>
            ))}
            {running && <p className="text-xs text-ice-dim">● live…</p>}
          </div>
        </div>

        <div className="card h-fit p-5">
          <span className="pill text-safe">Harvested intel → corpus</span>
          <p className="mt-1 text-2xl font-bold text-gold">{Math.floor(wastedSec / 60)}m {wastedSec % 60}s</p>
          <p className="text-xs text-ice-dim">of scammer time wasted</p>
          <ul className="mt-3 space-y-2">
            {harvested.map((h, i) => (
              <li key={i} className="rounded-lg bg-[rgba(43,217,166,0.08)] px-2.5 py-1.5 text-xs text-ice">✓ {h}</li>
            ))}
            {harvested.length === 0 && <li className="text-xs text-ice-dim">Intel appears as the call plays.</li>}
          </ul>
          {harvested.length > 0 && (
            <p className="mt-3 text-[11px] text-ice-dim">
              Every harvested artifact measurably improves detection for everyone — the legally-clean
              data flywheel.
            </p>
          )}
        </div>
      </div>
    </FeatureShell>
  );
}
