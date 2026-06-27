"use client";

import { useState } from "react";

/**
 * Incident Mode — the feature every competitor forgot. It compresses the
 * catastrophic first hours into a sequenced, pre-filled, nagging checklist.
 * Honest framing: no public API freezes a bank account or files a police report
 * for you — KinShield makes every step findable, pre-filled and in the right
 * order, and automation deepens as bank SDK relationships land.
 */

interface Step {
  id: string;
  title: string;
  detail: string;
  script?: string;
  urgent?: boolean;
}

const STEPS: Step[] = [
  {
    id: "breathe",
    title: "Breathe — you are not to blame",
    detail: "Scammers are professionals running tested scripts. Acting in the next hour matters far more than how this started. We'll go one step at a time.",
    urgent: true,
  },
  {
    id: "bank",
    title: "Call your bank's fraud line — use these exact words",
    detail: "The right phrases get a recall started fast. KinShield can join the call so you never have to repeat the story.",
    script: "“I am a fraud victim. I need to open a fraud investigation and request a recall on a transaction I authorized under deception. Please flag my account for suspicious activity and stop any pending transfers.”",
    urgent: true,
  },
  {
    id: "evidence",
    title: "Capture the evidence (timestamped, hashed)",
    detail: "Screenshots of the messages, numbers, receipts and any transfer confirmations are saved to your encrypted vault with a chain-of-custody record — this pre-evidences any insurance claim.",
  },
  {
    id: "cafc",
    title: "File the CAFC report (pre-filled)",
    detail: "We pre-fill the Canadian Anti-Fraud Centre report from your captured evidence. You review and submit.",
  },
  {
    id: "credit",
    title: "Place fraud alerts with Equifax & TransUnion Canada",
    detail: "A guided walkthrough for both bureaus, so new credit can't be opened in your name.",
  },
  {
    id: "police",
    title: "Get a police file number",
    detail: "Your local non-emergency line, pre-filled with a summary. The file number unlocks bank and insurance steps.",
  },
  {
    id: "rearm",
    title: "Guard against the recovery scam",
    detail: "Victims are re-targeted within weeks by fake 'fund recovery' agents. Anyone who contacts you promising to get your money back — for a fee — is the same network. We'll warn you when it happens.",
    urgent: true,
  },
];

export default function IncidentPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [familyAlerted, setFamilyAlerted] = useState(false);
  const completed = Object.values(done).filter(Boolean).length;
  const pct = Math.round((completed / STEPS.length) * 100);

  return (
    <div className="space-y-6 py-4">
      <header className="card p-6" style={{ borderColor: "#ff4d6a55" }}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-4xl">🆘</span>
          <div>
            <h1 className="text-2xl font-bold text-threat sm:text-3xl">Incident Mode</h1>
            <p className="text-ice-dim">The first hours decide everything. Work top to bottom.</p>
          </div>
          <button
            onClick={() => setFamilyAlerted(true)}
            disabled={familyAlerted}
            className="btn btn-ghost ml-auto px-4 py-2 text-sm disabled:opacity-60"
          >
            {familyAlerted ? "✓ Family circle alerted" : "Silently alert my family circle"}
          </button>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-ice-dim">
            <span>{completed} of {STEPS.length} steps</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-[rgba(141,163,207,0.14)]">
            <div className="h-full rounded-full bg-safe transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </header>

      <ol className="space-y-3">
        {STEPS.map((s, i) => {
          const isDone = !!done[s.id];
          return (
            <li
              key={s.id}
              className="card p-4"
              style={s.urgent && !isDone ? { borderColor: "#ff4d6a55" } : undefined}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setDone((d) => ({ ...d, [s.id]: !d[s.id] }))}
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition"
                  style={{
                    borderColor: isDone ? "#2bd9a6" : "rgba(141,163,207,0.4)",
                    background: isDone ? "#2bd9a6" : "transparent",
                    color: "#022017",
                  }}
                  aria-label={isDone ? "Mark not done" : "Mark done"}
                >
                  {isDone ? "✓" : <span className="text-ice-dim text-xs">{i + 1}</span>}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold ${isDone ? "text-ice-dim line-through" : "text-ice"}`}>
                      {s.title}
                    </h3>
                    {s.urgent && !isDone && <span className="pill text-threat">urgent</span>}
                  </div>
                  <p className="mt-1 text-sm text-ice-dim">{s.detail}</p>
                  {s.script && (
                    <p className="mt-2 rounded-lg border-l-2 border-safe bg-[rgba(43,217,166,0.07)] p-3 text-sm italic text-ice">
                      {s.script}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="card p-5 text-sm text-ice-dim">
        <span className="text-gold">On Premium</span>, a trained, trauma-informed human in your
        language joins these calls and checks in weekly for three months — a ticket number replaced
        by a relationship.
      </div>
    </div>
  );
}
