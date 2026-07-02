"use client";

import { useEffect, useState } from "react";
import { scoreTrust, explain } from "@/lib/trust-engine";
import { FeatureShell } from "@/components/FeatureShell";
import { useVraiShield } from "@/lib/store";

const DRILLS: { text: string; from: string; isScam: boolean }[] = [
  { from: "INTERAC", text: "Your transfer is pending. Accept within 24h: http://interac-secure-deposit.xyz/login", isScam: true },
  { from: "Dr. Lee's office", text: "Reminder: your appointment is Tuesday at 2pm. Reply C to cancel.", isScam: false },
  { from: "+1 604-555-0147", text: "CRA: your SIN is suspended, arrest warrant issued. Pay with gift cards now.", isScam: true },
  { from: "Telus", text: "Your monthly bill is ready to view in the My Telus app.", isScam: false },
  { from: "Recruiter", text: "Work from home, $500/day, no experience. We'll mail you a cheque — just deposit it and buy equipment.", isScam: true },
  { from: "Bank of Friend", text: "Sent you $40 for dinner over e-transfer, should auto-deposit 🙂", isScam: false },
];

export default function ScamDrillPage() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const { setDrillBest } = useVraiShield();

  useEffect(() => { if (done) setDrillBest(score); }, [done, score, setDrillBest]);

  const d = DRILLS[i];
  const engine = scoreTrust({ text: d.text, channel: "sms" });

  function answer(guessScam: boolean) {
    if (answered !== null) return;
    const correct = guessScam === d.isScam;
    if (correct) setScore((s) => s + 1);
    setAnswered(correct);
  }
  function next() {
    if (i + 1 >= DRILLS.length) { setDone(true); return; }
    setI((x) => x + 1);
    setAnswered(null);
  }
  function restart() { setI(0); setScore(0); setAnswered(null); setDone(false); }

  return (
    <FeatureShell slug="scam-drill">
      <p className="max-w-2xl text-ice-dim">
        Inoculation, the way enterprises phish-test employees — built for families, with warmth.
        Spot the scam. Whoever scores highest wins bragging rights at dinner.
      </p>

      {!done ? (
        <div className="card mx-auto max-w-lg p-6">
          <div className="flex items-center justify-between text-xs text-ice-dim">
            <span>Question {i + 1} of {DRILLS.length}</span>
            <span>Score: {score}</span>
          </div>

          <div className="mt-3 rounded-xl border border-[rgba(141,163,207,0.16)] bg-[rgba(10,20,48,0.5)] p-4">
            <p className="text-xs text-ice-dim">From: {d.from}</p>
            <p className="mt-1 text-ice">{d.text}</p>
          </div>

          {answered === null ? (
            <div className="mt-4 flex gap-3">
              <button onClick={() => answer(true)} className="btn flex-1 py-3" style={{ background: "rgba(255,77,106,0.18)", color: "#ff8aa0" }}>
                🚫 Scam
              </button>
              <button onClick={() => answer(false)} className="btn flex-1 py-3" style={{ background: "rgba(43,217,166,0.18)", color: "#2bd9a6" }}>
                ✅ Safe
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-lg font-bold" style={{ color: answered ? "#2bd9a6" : "#ff4d6a" }}>
                {answered ? "✓ Correct!" : "✗ Not quite —"} this was {d.isScam ? "a scam" : "legitimate"}.
              </p>
              <p className="mt-1 text-sm text-ice-dim">
                VraiShield scored it <b style={{ color: engine.trustScore < 45 ? "#ff4d6a" : "#2bd9a6" }}>{engine.trustScore}/100</b>.{" "}
                {explain(engine).reasons[0] ?? "No fraud signals — a normal message."}
              </p>
              <button onClick={next} className="btn btn-primary mt-4 w-full py-2.5">
                {i + 1 >= DRILLS.length ? "See results" : "Next"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card mx-auto max-w-lg p-8 text-center">
          <p className="text-5xl">{score >= 5 ? "🏆" : score >= 3 ? "👏" : "📚"}</p>
          <h2 className="mt-2 text-2xl font-bold text-ice">{score} / {DRILLS.length}</h2>
          <p className="mt-1 text-ice-dim">
            {score >= 5 ? "Scam-spotting black belt. Teach the rest of the family!" :
             score >= 3 ? "Solid instincts — a little practice and you're unshakeable." :
             "That's exactly why we drill. The reflex is learnable, and you just started building it."}
          </p>
          <button onClick={restart} className="btn btn-primary mt-5 px-6 py-2.5">↺ Play again</button>
        </div>
      )}
    </FeatureShell>
  );
}
