"use client";

import { useState } from "react";
import { scoreTrust } from "@/lib/trust-engine";
import { FeatureShell } from "@/components/FeatureShell";

type Caller = { label: string; from: string; said: string; legit?: boolean };
const CALLERS: Caller[] = [
  { label: "“CRA officer”", from: "+1 604-555-0147", said: "This is the CRA, your SIN is suspended, an arrest warrant is issued, pay immediately with gift cards." },
  { label: "Your pharmacy", from: "+1 416-555-0182", said: "Hi, this is Shoppers Drug Mart, your prescription is ready for pickup.", legit: true },
  { label: "“Bank fraud dept”", from: "Unknown", said: "We detected fraud on your account, read me the one-time passcode to move your money to a safe account." },
];

export default function CallLinePage() {
  const [caller, setCaller] = useState<Caller | null>(null);
  const [stage, setStage] = useState<"ring" | "screening" | "done">("ring");

  function pick(c: Caller) { setCaller(c); setStage("ring"); }
  function screen() {
    setStage("screening");
    setTimeout(() => setStage("done"), 1800);
  }

  const result = caller ? scoreTrust({ text: caller.said, channel: "call_transcript" }) : null;
  const block = result ? result.trustScore < 45 : false;

  return (
    <FeatureShell slug="call-line">
      <p className="max-w-2xl text-ice-dim">
        Unknown callers are forwarded to KinShield&apos;s cloud voice layer, where an AI persona asks
        who&apos;s calling and why, runs script + synthesis analysis on its own leg of the call, then
        patches through with a green badge, warns, or blocks — per your family policy. Works on every
        handset because it lives at the network layer.
      </p>

      <div className="flex flex-wrap gap-2">
        {CALLERS.map((c) => (
          <button key={c.label} onClick={() => pick(c)} className="rounded-full border border-[rgba(141,163,207,0.22)] px-3 py-1.5 text-sm text-ice hover:border-safe hover:text-safe">
            📲 Simulate: {c.label}
          </button>
        ))}
      </div>

      {caller && (
        <div className="card mx-auto max-w-md p-6 text-center">
          {stage === "ring" && (
            <>
              <p className="text-5xl">📞</p>
              <p className="mt-2 text-lg font-bold text-ice">Incoming: {caller.from}</p>
              <p className="text-sm text-ice-dim">Unknown caller — KinShield Line is set to screen.</p>
              <button onClick={screen} className="btn btn-primary mt-4 px-6 py-2.5">Let KinShield answer</button>
            </>
          )}
          {stage === "screening" && (
            <>
              <p className="text-5xl">🤖</p>
              <p className="mt-2 font-semibold text-ice">Receptionist is screening…</p>
              <p className="mt-1 text-sm italic text-ice-dim">“May I ask who&apos;s calling and what it&apos;s regarding?”</p>
              <div className="mx-auto mt-3 h-2 w-40 overflow-hidden rounded-full bg-[rgba(141,163,207,0.14)]">
                <div className="h-full w-full origin-left animate-pulse rounded-full bg-safe" />
              </div>
            </>
          )}
          {stage === "done" && result && (
            <>
              <p className="text-5xl">{block ? "⛔" : "✅"}</p>
              <p className="mt-2 text-lg font-bold" style={{ color: block ? "#ff4d6a" : "#2bd9a6" }}>
                {block ? "Blocked before it rang you" : "Patched through — green badge"}
              </p>
              <p className="mt-1 text-sm text-ice-dim">Trust Score {result.trustScore}/100</p>
              <div className="mt-3 rounded-lg p-3 text-left text-sm" style={{ background: block ? "rgba(255,77,106,0.1)" : "rgba(43,217,166,0.1)" }}>
                <p className="text-ice">{caller.said}</p>
                {result.detectedScript && <p className="mt-2 text-xs text-ice-dim">Script: {result.detectedScript.label}</p>}
              </div>
              <p className="mt-3 text-xs text-ice-dim">
                {block
                  ? "Your phone never rang. The number is reported to the Community Network and (if enabled) handed to the Honeypot."
                  : "A whisper announcement told you who it is before you picked up."}
              </p>
              <button onClick={() => setCaller(null)} className="btn btn-ghost mt-3 px-4 py-2 text-sm">Done</button>
            </>
          )}
        </div>
      )}
    </FeatureShell>
  );
}
