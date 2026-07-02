"use client";

import { useEffect, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";

type Phase = "idle" | "enrolling" | "enrolled" | "verifying" | "match" | "nomatch";

export default function VoiceLockPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== "enrolling" && phase !== "verifying") return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setPhase((ph) => (ph === "enrolling" ? "enrolled" : Math.random() > 0.15 ? "match" : "nomatch"));
          return 100;
        }
        return p + 8;
      });
    }, 90);
    return () => clearInterval(id);
  }, [phase]);

  const recording = phase === "enrolling" || phase === "verifying";

  return (
    <FeatureShell slug="voice-lock">
      <p className="max-w-2xl text-ice-dim">
        Family voiceprints, used where the OS allows. VraiShield stores an encrypted voice
        embedding — <b>never raw audio</b> — and verifies a request against it. Honestly scoped: it
        can&apos;t verify a native phone call you answer yourself (that&apos;s Assist Mode).
      </p>

      <div className="card mx-auto max-w-md p-6 text-center">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full" style={{ background: recording ? "rgba(43,217,166,0.16)" : "rgba(141,163,207,0.1)" }}>
          <Waveform active={recording} />
        </div>

        {recording && (
          <>
            <p className="mt-4 text-sm text-ice-dim">
              {phase === "enrolling" ? "Say: “My family keeps me safe”" : "Speak the prompted phrase…"}
            </p>
            <div className="mx-auto mt-2 h-2 w-48 overflow-hidden rounded-full bg-[rgba(141,163,207,0.14)]">
              <div className="h-full rounded-full bg-safe transition-all" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}

        {phase === "idle" && (
          <div className="mt-4">
            <p className="text-ice">No voiceprint enrolled yet.</p>
            <button onClick={() => setPhase("enrolling")} className="btn btn-primary mt-3 px-6 py-2.5">Enroll my voice</button>
          </div>
        )}
        {phase === "enrolled" && (
          <div className="mt-4">
            <p className="font-bold text-safe">✓ Voiceprint enrolled & encrypted</p>
            <p className="text-xs text-ice-dim">Stored as an embedding on your device. Quarterly re-enrollment.</p>
            <button onClick={() => setPhase("verifying")} className="btn btn-primary mt-3 px-6 py-2.5">Simulate a verification</button>
          </div>
        )}
        {phase === "match" && <Result ok title="✓ Voice verified" body="The request matches the enrolled family member. Anti-replay passed." onReset={() => setPhase("enrolled")} />}
        {phase === "nomatch" && <Result title="⛔ Voice did not match" body="The caller claims to be family, but the voice doesn't match the enrolled embedding. Treat with extreme caution." onReset={() => setPhase("enrolled")} />}
      </div>

      <p className="mx-auto max-w-md text-center text-xs text-ice-dim">
        Quebec note: a CAI biometric declaration is filed before Voice Lock ships in Quebec.
      </p>
    </FeatureShell>
  );
}

function Result({ ok, title, body, onReset }: { ok?: boolean; title: string; body: string; onReset: () => void }) {
  return (
    <div className="mt-4">
      <p className="text-lg font-bold" style={{ color: ok ? "#2bd9a6" : "#ff4d6a" }}>{title}</p>
      <p className="mt-1 text-sm text-ice-dim">{body}</p>
      <button onClick={onReset} className="btn btn-ghost mt-3 px-4 py-2 text-sm">↺ Again</button>
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-1" style={{ height: 40 }}>
      {[12, 22, 34, 18, 28, 14, 24].map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full"
          style={{
            height: active ? undefined : h / 2,
            background: active ? "#2bd9a6" : "#8da3cf",
            animation: active ? `vl 0.8s ease-in-out ${i * 0.08}s infinite alternate` : undefined,
            ["--h" as string]: `${h}px`,
          }}
        />
      ))}
      <style>{`@keyframes vl { from { height: 6px } to { height: var(--h) } }`}</style>
    </div>
  );
}
