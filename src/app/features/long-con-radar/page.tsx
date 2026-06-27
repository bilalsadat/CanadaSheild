"use client";

import { useState } from "react";
import { scoreTrust } from "@/lib/trust-engine";
import { FeatureShell } from "@/components/FeatureShell";
import { TrustDial } from "@/components/TrustDial";

/** A scripted pig-butchering conversation that unfolds over weeks. */
const THREAD: { day: string; from: "them" | "you"; text: string }[] = [
  { day: "Week 1", from: "them", text: "Good morning ☀️ I hope you slept well. Thinking of you." },
  { day: "Week 1", from: "you", text: "Aw, good morning! That's sweet." },
  { day: "Week 2", from: "them", text: "I feel like we can build a future together. You're so special to me. Let's move to WhatsApp, it's easier to talk privately." },
  { day: "Week 3", from: "them", text: "My mentor shared some trading signals — this exclusive platform is how I built my wealth. I can teach you." },
  { day: "Week 4", from: "them", text: "See? You already made a profit and could withdraw it. It works! Let's invest a little more." },
  { day: "Week 5", from: "them", text: "Your account is frozen for verification. Just pay the small tax to withdraw your profit and it unlocks." },
];

export default function LongConPage() {
  const [step, setStep] = useState(1);
  const visible = THREAD.slice(0, step);
  const cumulative = visible.filter((m) => m.from === "them").map((m) => m.text).join(" ");
  const result = scoreTrust({ text: cumulative, channel: "investment" });
  const stage = result.detectedScript?.stage;

  return (
    <FeatureShell slug="long-con-radar">
      <p className="max-w-2xl text-ice-dim">
        One-shot checkers can&apos;t see a long con; memory can. Step through the conversation as it
        evolves — KinShield tracks the script&apos;s progression and intervenes at the stage where
        intervention still works.
      </p>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="card space-y-3 p-5">
          {visible.map((m, i) => (
            <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[80%]">
                <p className="mb-0.5 text-[10px] text-ice-dim">{m.day}</p>
                <div
                  className="rounded-2xl px-3 py-2 text-sm"
                  style={{
                    background: m.from === "you" ? "rgba(43,217,166,0.16)" : "rgba(141,163,207,0.1)",
                    color: "#e7eefc",
                  }}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {step < THREAD.length ? (
            <button onClick={() => setStep((s) => s + 1)} className="btn btn-ghost mt-2 w-full py-2 text-sm">
              ▶ Next message (advance time)
            </button>
          ) : (
            <button onClick={() => setStep(1)} className="btn btn-ghost mt-2 w-full py-2 text-sm">↺ Restart</button>
          )}
        </div>

        <div className="card flex flex-col items-center p-5">
          <TrustDial score={result.trustScore} uncertainty={result.uncertainty} size={150} />
          {result.detectedScript ? (
            <div className="mt-3 text-center">
              <p className="pill text-threat">Long con detected</p>
              <p className="mt-1 font-bold text-ice">{result.detectedScript.label}</p>
              {stage && (
                <StageBar stage={stage} />
              )}
            </div>
          ) : (
            <p className="mt-3 text-center text-sm text-ice-dim">
              No con detected yet. KinShield keeps watching the thread over time.
            </p>
          )}
        </div>
      </div>

      {stage && stage >= 3 && (
        <div className="card p-5" style={{ borderColor: "#ff4d6a55" }}>
          <h3 className="font-bold text-threat">🛑 Intervention — while it still works</h3>
          <p className="mt-1 text-sm text-ice-dim">
            This conversation is following the pig-butchering script. The “investment platform” is
            fake; the “tax to withdraw” is the final extraction and the money is already gone. <b>Do
            not send anything.</b> Here is your exit plan:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-ice">
            <li>› Stop all payments — no legitimate platform charges a fee to release your own money.</li>
            <li>› Screenshot everything (evidence is preserved to your encrypted vault).</li>
            <li>› Tell one trusted person today — we can alert your Family Circle with your consent.</li>
            <li>› Run the platform through VerifyCA against the CSA registration search.</li>
          </ul>
        </div>
      )}
    </FeatureShell>
  );
}

function StageBar({ stage }: { stage: number }) {
  const names = ["Rapport", "Off-platform", "The pitch", "Fake profit", "The big ask"];
  return (
    <div className="mt-3 w-full">
      <div className="flex gap-1">
        {names.map((n, i) => (
          <div key={i} className="flex-1">
            <div
              className="h-1.5 rounded-full"
              style={{ background: i < stage ? "#ff4d6a" : "rgba(141,163,207,0.2)" }}
            />
            <p className="mt-1 text-[9px] text-ice-dim">{n}</p>
          </div>
        ))}
      </div>
      <p className="mt-1 text-xs text-threat">Stage {stage} of 5</p>
    </div>
  );
}
