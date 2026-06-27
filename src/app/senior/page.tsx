"use client";

import { useState } from "react";
import Link from "next/link";
import { AskKinShield } from "@/components/AskKinShield";

/**
 * Senior Mode — not a feature, a complete alternate presentation layer: four
 * buttons, 36pt+ type, voice-first, verdicts spoken aloud. Acceptance criterion
 * for the whole product: if it doesn't work for a 78-year-old in Punjabi, it
 * isn't done.
 */
type View = "home" | "check" | "family" | "help";

const BUTTONS: { id: View; emoji: string; label: string; sub: string; color: string }[] = [
  { id: "help", emoji: "🆘", label: "I need help", sub: "Something happened", color: "#ff4d6a" },
  { id: "family", emoji: "👪", label: "Call my family", sub: "Reach a trusted person", color: "#2bd9a6" },
  { id: "check", emoji: "📞", label: "Check a call", sub: "Was that caller real?", color: "#7aa2ff" },
  { id: "check", emoji: "✉️", label: "Check a message", sub: "Is this text a scam?", color: "#f2b441" },
];

export default function SeniorPage() {
  const [view, setView] = useState<View>("home");

  return (
    <div className="senior mx-auto max-w-2xl py-4">
      {view === "home" ? (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-ice">Hello 👋</h1>
            <p className="mt-2 text-2xl text-ice-dim">What do you need? Tap a big button.</p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BUTTONS.map((b, i) => (
              <button
                key={i}
                onClick={() => setView(b.id)}
                className="senior-btn card card-hover flex items-center gap-4 p-5 text-left"
                style={{ borderColor: b.color + "66" }}
              >
                <span className="text-5xl">{b.emoji}</span>
                <span>
                  <span className="block font-bold text-ice" style={{ color: b.color }}>
                    {b.label}
                  </span>
                  <span className="block text-lg text-ice-dim">{b.sub}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-6 text-center text-lg text-ice-dim">
            KinShield reads every answer out loud. You never need a password — your family keeps a
            spare key for you.
          </p>
        </>
      ) : (
        <div>
          <button onClick={() => setView("home")} className="btn btn-ghost mb-5 px-5 py-3 text-xl">
            ← Back
          </button>

          {view === "check" && (
            <>
              <h2 className="mb-3 text-3xl font-bold text-ice">Let&apos;s check it together</h2>
              <p className="mb-4 text-xl text-ice-dim">
                Read me the message, or type what the caller said. I&apos;ll tell you out loud if
                it&apos;s safe.
              </p>
              <AskKinShield senior />
            </>
          )}

          {view === "family" && (
            <div className="card p-6 text-center">
              <p className="text-6xl">👪</p>
              <h2 className="mt-3 text-3xl font-bold text-ice">Your family circle</h2>
              <p className="mt-2 text-xl text-ice-dim">
                These trusted people can help you right now.
              </p>
              <div className="mt-5 space-y-3">
                {[
                  { name: "Priya (daughter)", tag: "Primary guardian" },
                  { name: "Arjun (son)", tag: "Gets your alerts" },
                ].map((p) => (
                  <div key={p.name} className="senior-btn card flex items-center justify-between p-5">
                    <span>
                      <span className="block text-2xl font-bold text-ice">{p.name}</span>
                      <span className="text-lg text-ice-dim">{p.tag}</span>
                    </span>
                    <span className="btn btn-primary px-6 py-3 text-2xl">Call</span>
                  </div>
                ))}
              </div>
              <Link href="/family" className="mt-5 inline-block text-xl text-safe underline">
                Manage family circle
              </Link>
            </div>
          )}

          {view === "help" && (
            <div className="card p-6" style={{ borderColor: "#ff4d6a88" }}>
              <p className="text-6xl">🆘</p>
              <h2 className="mt-3 text-3xl font-bold text-threat">Take a breath. You&apos;re not alone.</h2>
              <p className="mt-2 text-xl text-ice-dim">
                If you sent money, gift cards, or codes, we&apos;ll walk through this one step at a
                time — and we&apos;ll tell your family if you want.
              </p>
              <Link
                href="/incident"
                className="senior-btn btn mt-5 flex w-full items-center justify-center text-2xl"
                style={{ background: "#ff4d6a", color: "#2a0410", fontWeight: 700 }}
              >
                Start the recovery steps
              </Link>
              <p className="mt-4 text-lg text-ice-dim">
                You can also tap <b>Call my family</b> to reach someone you trust.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
