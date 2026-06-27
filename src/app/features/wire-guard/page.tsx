"use client";

import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";

const STEPS = [
  { id: "trigger", title: "Payment change detected", body: "A wire instruction for $48,000 to a NEW payee was submitted during a video call. Above your $10,000 threshold → out-of-band release required." },
  { id: "selfie", title: "Live video selfie", body: "The authorizer's own phone captures a 5-second liveness selfie — the channel the deepfake on the Zoom call doesn't control." },
  { id: "codeword", title: "Spoken rotating codeword", body: "Speak today's rotating codeword. Stored zero-knowledge; it changes every release." },
  { id: "voice", title: "Voice match", body: "Voice compared against the enrolled, encrypted embedding (Voice Lock)." },
  { id: "release", title: "Signed release", body: "All factors passed on the out-of-band channel. The payment is released and the approval is signed and audited." },
];

export default function WireGuardPage() {
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);

  const done = step >= STEPS.length;

  return (
    <FeatureShell slug="wire-guard">
      <p className="max-w-2xl text-ice-dim">
        The Arup-killer for small business. The deepfake on the Zoom call can be perfect — it still
        can&apos;t pass the channel it doesn&apos;t control. Walk the release ceremony.
      </p>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="card p-5">
          <ol className="space-y-3">
            {STEPS.map((s, i) => {
              const state = i < step ? "done" : i === step ? "active" : "todo";
              return (
                <li key={s.id} className="flex gap-3">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold"
                    style={{
                      borderColor: state === "done" ? "#2bd9a6" : state === "active" ? "#f2b441" : "rgba(141,163,207,0.3)",
                      background: state === "done" ? "#2bd9a6" : "transparent",
                      color: state === "done" ? "#022017" : state === "active" ? "#f2b441" : "#8da3cf",
                    }}
                  >
                    {state === "done" ? "✓" : i + 1}
                  </span>
                  <div className={state === "todo" ? "opacity-50" : ""}>
                    <p className="font-semibold text-ice">{s.title}</p>
                    <p className="text-sm text-ice-dim">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {!done ? (
            <div className="mt-5 flex gap-2">
              <button onClick={() => setStep((s) => s + 1)} className="btn btn-primary px-5 py-2.5">
                {step === 0 ? "Begin release ceremony" : "Pass this factor ✓"}
              </button>
              {step > 0 && (
                <button onClick={() => { setFailed(true); setStep(STEPS.length); }} className="btn btn-ghost px-4 py-2.5 text-sm">
                  Simulate a failed factor
                </button>
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-xl p-4" style={{ background: failed ? "rgba(255,77,106,0.12)" : "rgba(43,217,166,0.12)" }}>
              <p className="font-bold" style={{ color: failed ? "#ff4d6a" : "#2bd9a6" }}>
                {failed ? "⛔ Release BLOCKED" : "✓ Payment released & audited"}
              </p>
              <p className="mt-1 text-sm text-ice-dim">
                {failed
                  ? "A factor failed on the out-of-band channel — exactly what happens when a deepfaked executive can't pass the live selfie + voice match. The $48,000 stays put."
                  : "All factors verified out-of-band. A signed, timestamped approval is written to the audit log."}
              </p>
              <button onClick={() => { setStep(0); setFailed(false); }} className="btn btn-ghost mt-3 px-4 py-2 text-sm">↺ Run again</button>
            </div>
          )}
        </div>

        <div className="card p-5">
          <span className="pill text-ice-dim">Why this beats detection</span>
          <p className="mt-2 text-sm text-ice-dim">
            Pindrop and every deepfake detector try to spot a fake on the call itself — and the
            research community admits detectors generalize poorly to unseen synthesis. Wire Guard
            doesn&apos;t try to detect. It moves the decision to a channel the attacker can&apos;t reach.
            <b className="text-ice"> Procedure beats detection when detection can be fooled.</b>
          </p>
        </div>
      </div>
    </FeatureShell>
  );
}
