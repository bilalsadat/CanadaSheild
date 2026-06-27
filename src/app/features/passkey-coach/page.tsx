"use client";

import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { TrustDial } from "@/components/TrustDial";

const TASKS = [
  { id: "passkey", label: "Add a passkey to your email", sub: "Face/fingerprint — nothing to phish", pts: 22 },
  { id: "2fa", label: "Move bank 2FA from SMS to an app/key", sub: "SMS codes can be SIM-swapped", pts: 20 },
  { id: "sim", label: "Set a SIM-swap PIN with your carrier", sub: "Rogers / Bell / Telus port-out lock", pts: 16 },
  { id: "alerts", label: "Turn on bank transaction alerts", sub: "Catch fraud in seconds, not days", pts: 12 },
  { id: "recovery", label: "Review account recovery contacts", sub: "Remove stale emails/numbers", pts: 12 },
  { id: "password", label: "Rotate the password flagged in Exposure Sweep", sub: "The reused one from a breach", pts: 18 },
];

export default function PasskeyCoachPage() {
  const [done, setDone] = useState<string[]>([]);
  const score = TASKS.filter((t) => done.includes(t.id)).reduce((a, t) => a + t.pts, 0);
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <FeatureShell slug="passkey-coach">
      <p className="max-w-2xl text-ice-dim">
        Prevention&apos;s unglamorous half, gamified gently for families. Complete the hardening steps
        to raise your household&apos;s score — which your Family Circle can see.
      </p>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="card flex flex-col items-center p-5">
          <TrustDial score={score} size={150} />
          <p className="mt-2 text-center text-sm text-ice-dim">Household hardening score</p>
          <p className="text-center text-xs" style={{ color: score >= 70 ? "#2bd9a6" : score >= 40 ? "#f2b441" : "#ff8aa0" }}>
            {score >= 90 ? "Fortress." : score >= 70 ? "Strong." : score >= 40 ? "Getting there." : "Let's harden up."}
          </p>
        </div>

        <div className="card divide-y divide-[rgba(141,163,207,0.12)] p-2">
          {TASKS.map((t) => {
            const isDone = done.includes(t.id);
            return (
              <button key={t.id} onClick={() => toggle(t.id)} className="flex w-full items-center gap-3 p-3 text-left">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs"
                  style={{ borderColor: isDone ? "#2bd9a6" : "rgba(141,163,207,0.4)", background: isDone ? "#2bd9a6" : "transparent", color: "#022017" }}
                >
                  {isDone ? "✓" : ""}
                </span>
                <span className="flex-1">
                  <span className={`block text-sm font-semibold ${isDone ? "text-ice-dim line-through" : "text-ice"}`}>{t.label}</span>
                  <span className="block text-xs text-ice-dim">{t.sub}</span>
                </span>
                <span className="pill text-safe">+{t.pts}</span>
              </button>
            );
          })}
        </div>
      </div>
    </FeatureShell>
  );
}
