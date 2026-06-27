"use client";

import { useMemo, useState } from "react";
import { scoreTrust, explain } from "@/lib/trust-engine";
import { FeatureShell } from "@/components/FeatureShell";
import { VERDICT_STYLE } from "@/components/verdict-style";

const INBOX: { from: string; text: string }[] = [
  { from: "+1 604-555-0147", text: "CRA FINAL NOTICE: your SIN is suspended for tax fraud. Arrest warrant issued. Call now or pay with gift cards." },
  { from: "Mom", text: "Can you pick up milk on the way home? love you ❤️" },
  { from: "INTERAC", text: "Your e-transfer of $250 is pending. Accept within 24h: http://interac-secure-deposit.xyz/login" },
  { from: "+1 416-555-0199", text: "Your appointment with Dr. Lee is confirmed for Tuesday at 2pm. Reply C to cancel." },
  { from: "CanadaPost", text: "Your parcel is held. Pay a $1.45 customs fee to reschedule: https://canadapost.delivery-fee.top/pay" },
  { from: "Telus", text: "Your bill is ready. View it anytime in the My Telus app. Thanks!" },
  { from: "+1 587-555-0190", text: "Hi it's your boss, I'm in a meeting — urgently buy 5 Apple gift cards and send me the codes." },
  { from: "Bank of Friend", text: "Hey, sent you the $40 for dinner over e-transfer, auto-deposit should land shortly 🙂" },
];

export default function SmsShieldPage() {
  const scored = useMemo(
    () =>
      INBOX.map((m) => {
        const r = scoreTrust({ text: m.text, channel: "sms" });
        return { ...m, result: r, rendered: explain(r) };
      }),
    [],
  );
  const [folder, setFolder] = useState<"inbox" | "junk">("inbox");

  const inbox = scored.filter((m) => m.result.trustScore >= 45);
  const junk = scored.filter((m) => m.result.trustScore < 45);
  const list = folder === "inbox" ? inbox : junk;

  return (
    <FeatureShell slug="sms-shield">
      <p className="max-w-2xl text-ice-dim">
        Every message is scored on-device by the Trust Engine the instant it arrives. Scam texts are
        filtered into <b className="text-threat">Junk</b> before they reach your inbox — the rest
        flow through untouched. Tap any message to see exactly why.
      </p>

      <div className="flex gap-2">
        <Tab active={folder === "inbox"} onClick={() => setFolder("inbox")} label={`Inbox (${inbox.length})`} />
        <Tab active={folder === "junk"} onClick={() => setFolder("junk")} label={`🛑 Junk — filtered (${junk.length})`} />
      </div>

      <div className="space-y-2">
        {list.map((m, i) => {
          const style = VERDICT_STYLE[m.result.verdict];
          return (
            <details key={i} className="card overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums"
                  style={{ background: style.soft, color: style.color }}
                >
                  {m.result.trustScore}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ice">{m.from}</p>
                  <p className="truncate text-sm text-ice-dim">{m.text}</p>
                </div>
                <span className="text-lg">{style.emoji}</span>
              </summary>
              <div className="border-t border-[rgba(141,163,207,0.14)] p-3 text-sm">
                <p className="mb-2 text-ice">{m.text}</p>
                <p className="font-semibold" style={{ color: style.color }}>
                  {m.rendered.verdictLabel} · {m.rendered.actionLabel}
                </p>
                <ul className="mt-1 space-y-1 text-ice-dim">
                  {m.rendered.reasons.map((r, j) => (
                    <li key={j}>› {r}</li>
                  ))}
                  {m.rendered.reasons.length === 0 && <li>No fraud signals detected.</li>}
                </ul>
                {m.result.trustScore < 45 && (
                  <button className="btn btn-ghost mt-3 px-3 py-1.5 text-xs">⚑ Report to Community Network</button>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </FeatureShell>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm transition ${
        active ? "bg-[rgba(43,217,166,0.14)] text-safe" : "bg-[rgba(141,163,207,0.08)] text-ice-dim hover:text-ice"
      }`}
    >
      {label}
    </button>
  );
}
