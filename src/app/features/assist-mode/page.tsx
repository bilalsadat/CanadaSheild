"use client";

import { useEffect, useRef, useState } from "react";
import { scoreTrust, explain } from "@/lib/trust-engine";
import { FeatureShell } from "@/components/FeatureShell";

const CALL_LINES = [
  "Hello, this is Officer Davies calling from the Canada Revenue Agency.",
  "We have detected fraud associated with your social insurance number.",
  "There is an arrest warrant issued in your name as we speak.",
  "Do not hang up the phone or local police will be dispatched to your address.",
  "To resolve this immediately, you must pay the outstanding balance today.",
  "You can do this by purchasing gift cards and reading me the codes over the phone.",
];

export default function AssistModePage() {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (idx >= CALL_LINES.length) { setPlaying(false); return; }
    timer.current = setTimeout(() => setIdx((i) => i + 1), 1600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, idx]);

  const heard = CALL_LINES.slice(0, idx);
  const transcript = heard.join(" ");
  const result = transcript ? scoreTrust({ text: transcript, channel: "call_transcript" }) : null;
  const rendered = result ? explain(result) : null;

  function start() { setIdx(0); setPlaying(true); }

  return (
    <FeatureShell slug="assist-mode">
      <p className="max-w-2xl text-ice-dim">
        Put a suspicious call on speaker and tap Assist. VraiShield transcribes and analyses the audio
        entirely <b>on-device</b> (lawful under Canada&apos;s one-party-consent rule — nothing leaves
        your phone) and coaches you in real time.
      </p>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`grid h-10 w-10 place-items-center rounded-full ${playing ? "pulse-threat" : ""}`} style={{ background: "rgba(255,77,106,0.16)" }}>📞</span>
              <div>
                <p className="text-sm font-semibold text-ice">Unknown caller</p>
                <p className="text-xs text-ice-dim">{playing ? "On call · listening on-device" : idx > 0 ? "Call ended" : "Ready"}</p>
              </div>
            </div>
            <button onClick={start} className="btn btn-primary px-4 py-2 text-sm">
              {idx > 0 && !playing ? "↺ Replay call" : "▶ Start demo call"}
            </button>
          </div>

          <div className="mt-4 min-h-[180px] space-y-2">
            {heard.map((line, i) => (
              <div key={i} className="max-w-[85%] rounded-2xl bg-[rgba(141,163,207,0.1)] px-3 py-2 text-sm text-ice">
                {line}
              </div>
            ))}
            {playing && <div className="text-xs text-ice-dim">● transcribing…</div>}
            {idx === 0 && <p className="text-sm text-ice-dim">Tap “Start demo call” to hear a classic CRA-arrest script play out.</p>}
          </div>
        </div>

        <div className="card flex flex-col p-5">
          <span className="pill text-safe">Live coaching</span>
          {result && rendered ? (
            <div className="mt-3">
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: result.trustScore < 25 ? "rgba(255,77,106,0.14)" : "rgba(242,180,65,0.12)" }}
              >
                <p className="text-3xl font-bold" style={{ color: result.trustScore < 25 ? "#ff4d6a" : "#f2b441" }}>
                  {result.trustScore < 25 ? "⛔ HANG UP" : "⚠️ Be careful"}
                </p>
                <p className="mt-1 text-xs text-ice-dim">Trust Score {result.trustScore}/100</p>
              </div>
              {result.detectedScript && (
                <p className="mt-3 text-sm font-semibold text-ice">{result.detectedScript.label}</p>
              )}
              <ul className="mt-2 space-y-1.5 text-sm text-ice-dim">
                {rendered.reasons.map((r, i) => <li key={i}>› {r}</li>)}
              </ul>
              {result.trustScore < 25 && (
                <p className="mt-3 rounded-lg bg-[rgba(255,77,106,0.1)] p-2 text-xs text-threat">
                  The CRA never threatens arrest or asks for gift cards. Hang up, then report the
                  number to the Community Network.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-ice-dim">Coaching appears here as the call is analysed.</p>
          )}
        </div>
      </div>
    </FeatureShell>
  );
}
