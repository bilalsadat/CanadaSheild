"use client";

import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";

const STEPS = [
  { t: "Breathe. They almost never follow through.", b: "This is a scripted extortion racket. In the overwhelming majority of cases, paying is what escalates it — and not paying is what ends it. You are not in trouble, and this is not your fault." },
  { t: "Do NOT pay, and do NOT keep replying.", b: "Payment marks you as a target and invites more demands. Stop responding now — silence is your strongest move." },
  { t: "Preserve the evidence (one tap).", b: "Screenshots, usernames and the threats are saved to your encrypted vault with a timestamp and hash — for reporting, without you having to look at them again." },
  { t: "Hash-based image takedown.", b: "If an intimate image is involved, we submit it to StopNCII / Take It Down — a hash (not the image) is shared so platforms can block it from being uploaded." },
  { t: "Report on the platform (guided).", b: "We open the exact reporting flow for the platform it happened on, pre-filled." },
  { t: "Tell one trusted person.", b: "With your consent we can silently alert a trusted contact in your Family Circle. You don't have to carry this alone." },
];

export default function CrisisVaultPage() {
  const [done, setDone] = useState<number[]>([]);
  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  return (
    <FeatureShell slug="crisis-vault">
      <div className="card p-5" style={{ borderColor: "#ff4d6a55" }}>
        <p className="text-lg font-bold text-threat">If you&apos;re being threatened over intimate images — you&apos;re in the right place.</p>
        <p className="mt-1 text-sm text-ice-dim">
          The first four hours decide everything. Go one step at a time. Nothing here is shared
          without your explicit choice.
        </p>
      </div>

      <ol className="space-y-3">
        {STEPS.map((s, i) => {
          const isDone = done.includes(i);
          return (
            <li key={i} className="card p-4">
              <button onClick={() => toggle(i)} className="flex w-full items-start gap-3 text-left">
                <span
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs"
                  style={{ borderColor: isDone ? "#2bd9a6" : "rgba(141,163,207,0.4)", background: isDone ? "#2bd9a6" : "transparent", color: "#022017" }}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <div>
                  <p className={`font-bold ${isDone ? "text-ice-dim line-through" : "text-ice"}`}>{s.t}</p>
                  <p className="mt-1 text-sm text-ice-dim">{s.b}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="card p-4 text-sm text-ice-dim">
        Scripts here are vetted with mental-health partners. On paid tiers, the human Recovery Line
        can stay with you and check in over the following weeks. If you are in immediate danger, call
        your local emergency number.
      </div>
    </FeatureShell>
  );
}
