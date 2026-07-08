"use client";

import { useMemo, useState } from "react";
import { scoreTrust, explain } from "@/lib/trust-engine";
import { FeatureShell } from "@/components/FeatureShell";
import { VERDICT_STYLE } from "@/components/verdict-style";

const EMAILS = [
  { from: "no-reply@cra-refund-gov.xyz", subject: "You have a $740.50 refund pending", body: "The Canada Revenue Agency owes you a refund. Confirm your banking details to receive it: http://cra-refund-gov.xyz/claim" },
  { from: "team@figma.com", subject: "Your weekly project digest", body: "Here's what changed in your team's files this week. Have a great weekend!" },
  { from: "security@rbc-secure-alert.top", subject: "Unusual sign-in detected", body: "We detected a suspicious sign-in. Verify your identity now or your account will be locked: http://rbc-secure-alert.top/verify" },
  { from: "receipts@ride-share.com", subject: "Your trip receipt", body: "Thanks for riding. Your fare was $18.40. View the receipt in the app." },
  { from: "hr@globaltalent-careers.top", subject: "Job offer — work from home $600/day", body: "Congratulations! No experience needed. We'll send a cheque — deposit it and buy your equipment to start." },
];

export default function EmailGuardPage() {
  const [connected, setConnected] = useState(false);
  const scored = useMemo(
    () => EMAILS.map((e) => {
      const r = scoreTrust({ text: `${e.subject}. ${e.body}`, channel: "email" });
      return { ...e, result: r, rendered: explain(r) };
    }),
    [],
  );
  const flagged = scored.filter((e) => e.result.trustScore < 45).length;

  return (
    <FeatureShell slug="email-guard">
      <p className="max-w-2xl text-ice-dim">
        Phishing and fraud scanning for the inbox: a read-only, revocable OAuth connection to
        Gmail/Outlook, scanning for impersonation (CRA, banks, employers), lookalike senders and
        malicious links — with verdicts <b>explained</b>, not just spam-foldered. Bodies are never
        retained after the verdict.
      </p>

      {!connected ? (
        <div className="card mx-auto max-w-md p-6 text-center">
          <p className="text-5xl">✉️</p>
          <p className="mt-2 text-ice">Connect an inbox to scan it (read-only, revocable).</p>
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => setConnected(true)} className="btn btn-primary px-5 py-2.5">Connect Gmail</button>
            <button onClick={() => setConnected(true)} className="btn btn-ghost px-5 py-2.5">Connect Outlook</button>
          </div>
          <p className="mt-2 text-xs text-ice-dim">Demo: connects a sample inbox.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-ice-dim">
            Scanned {scored.length} recent emails · <b className="text-threat">{flagged} flagged</b>. In-region processing; bodies discarded after scan.
          </p>
          <div className="space-y-2">
            {scored.map((e, i) => {
              const style = VERDICT_STYLE[e.result.verdict];
              return (
                <details key={i} className="card overflow-hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums" style={{ background: style.soft, color: style.color }}>
                      {e.result.trustScore}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ice">{e.subject}</p>
                      <p className="truncate text-xs text-ice-dim">{e.from}</p>
                    </div>
                    <span className="text-lg">{style.emoji}</span>
                  </summary>
                  <div className="border-t border-[rgba(141,163,207,0.14)] p-3 text-sm">
                    <p className="mb-2 text-ice-dim">{e.body}</p>
                    <p className="font-semibold" style={{ color: style.color }}>{e.rendered.verdictLabel} · {e.rendered.actionLabel}</p>
                    <ul className="mt-1 space-y-1 text-ice-dim">
                      {e.rendered.reasons.map((r, j) => <li key={j}>› {r}</li>)}
                      {e.rendered.reasons.length === 0 && <li>No fraud signals — looks legitimate.</li>}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        </>
      )}
    </FeatureShell>
  );
}
