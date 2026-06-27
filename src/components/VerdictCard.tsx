"use client";

import type { CheckResponse } from "@/lib/client";
import { TrustDial } from "./TrustDial";
import { VERDICT_STYLE, FAMILY_LABEL } from "./verdict-style";

/**
 * The verdict surface, shared by Ask KinShield, SMS Shield, Link Checker and
 * the Line. Shows the score, the localized verdict + recommended action, the
 * detected scam "script DNA", the top three reasons, and — the honesty moat
 * made tangible — the full per-signal ledger that produced the score.
 */
export function VerdictCard({
  data,
  onReport,
  onIncident,
  compact = false,
}: {
  data: CheckResponse;
  onReport?: () => void;
  onIncident?: () => void;
  compact?: boolean;
}) {
  const { result, rendered } = data;
  const style = VERDICT_STYLE[result.verdict];

  return (
    <div
      className="card p-5 sm:p-6"
      style={{ borderColor: style.color + "55", boxShadow: `0 24px 60px -40px ${style.glow}` }}
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <TrustDial score={result.trustScore} uncertainty={result.uncertainty} size={compact ? 140 : 176} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{style.emoji}</span>
            <h3 className="text-xl font-bold" style={{ color: style.color }}>
              {rendered.verdictLabel}
            </h3>
          </div>
          <p className="mt-1 text-sm text-ice-dim">
            Recommended action:{" "}
            <span className="font-semibold text-ice">{rendered.actionLabel}</span>
          </p>

          {result.detectedScript && (
            <div
              className="mt-3 rounded-xl px-3 py-2 text-sm"
              style={{ background: style.soft }}
            >
              <span className="pill" style={{ color: style.color }}>
                Scam script identified
              </span>
              <p className="mt-1 font-semibold text-ice">{result.detectedScript.label}</p>
              {result.detectedScript.stage && (
                <p className="text-xs text-ice-dim">
                  Long-con stage {result.detectedScript.stage} — intervention still works.
                </p>
              )}
              {result.detectedScript.extraction && (
                <p className="text-xs text-ice-dim">
                  Goal: {result.detectedScript.extraction}
                </p>
              )}
            </div>
          )}

          <ul className="mt-3 space-y-2">
            {rendered.reasons.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-ice">
                <span style={{ color: style.color }}>›</span>
                <span>{r}</span>
              </li>
            ))}
            {rendered.reasons.length === 0 && (
              <li className="text-sm text-ice-dim">
                No fraud signals detected. Stay alert — and if anything feels off, you can still report it.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* The explainability ledger — every signal that moved the score. */}
      <div className="mt-5 border-t border-[rgba(141,163,207,0.14)] pt-4">
        <div className="flex items-center justify-between">
          <span className="pill text-ice-dim">Why — the signal ledger</span>
          <span className="text-xs text-ice-dim">
            engine {result.engineVersion.split("+")[0]} · {result.latencyMs}ms · ±{result.uncertainty} band
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {result.ledger.map((l) => (
            <div key={l.family} className="grid grid-cols-[140px_1fr_44px] items-center gap-3">
              <span className="truncate text-xs text-ice-dim">{FAMILY_LABEL[l.family] ?? l.family}</span>
              <div className="h-2 overflow-hidden rounded-full bg-[rgba(141,163,207,0.12)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round(l.risk * 100)}%`,
                    background: l.risk >= 0.5 ? style.color : "rgba(141,163,207,0.5)",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <span className="text-right text-xs tabular-nums text-ice-dim">
                {Math.round(l.risk * 100)}%
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-ice-dim">
          Bars show each signal family&apos;s risk reading. The score fuses them — no single
          detector decides, which is why a perfect deepfake still can&apos;t win alone.
        </p>
      </div>

      {(onReport || onIncident) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onReport && (
            <button onClick={onReport} className="btn btn-ghost px-4 py-2 text-sm">
              ⚑ Report to protect everyone
            </button>
          )}
          {onIncident && (result.verdict === "dangerous" || result.verdict === "likely_scam") && (
            <button
              onClick={onIncident}
              className="btn px-4 py-2 text-sm"
              style={{ background: VERDICT_STYLE.dangerous.color, color: "#2a0410", fontWeight: 700 }}
            >
              🆘 I already responded — open Incident Mode
            </button>
          )}
        </div>
      )}
    </div>
  );
}
