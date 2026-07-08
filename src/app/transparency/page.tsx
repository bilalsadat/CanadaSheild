"use client";

import { useMemo } from "react";
import { runCalibration, FLAG_THRESHOLD } from "@/lib/trust-engine/eval/calibrate";
import { ENGINE_VERSION } from "@/lib/trust-engine";

const LANG_COVERAGE = [
  { lang: "English", code: "en", status: "validated" },
  { lang: "Quebec French", code: "fr", status: "validated" },
  { lang: "Punjabi", code: "pa", status: "seed" },
  { lang: "Mandarin / Cantonese", code: "zh", status: "seed" },
  { lang: "Spanish", code: "es", status: "seed" },
  { lang: "Tagalog", code: "tl", status: "seed" },
  { lang: "Arabic", code: "ar", status: "seed" },
  { lang: "Vietnamese", code: "vi", status: "seed" },
  { lang: "Korean", code: "ko", status: "seed" },
  { lang: "Portuguese", code: "pt", status: "seed" },
  { lang: "Hindi", code: "hi", status: "seed" },
];

const NEVER_SAY = [
  "Never publish an accuracy number without the benchmark, the date and the failure cases beside it.",
  "Never imply protection on a channel the OS does not permit us to defend.",
  "Never attribute a breach or failure to a competitor without primary-source verification.",
  "Never promise insurance outcomes — “designed to be fast”, never “instant” or “no proof of loss”.",
  "Never use invented pilot data — every published number traces to a real, named study.",
  "Never collect what the personal plane cannot protect.",
  "Never ship a feature in a language whose detection quality hasn't been validated by paid native speakers.",
];

export default function TransparencyPage() {
  const cal = useMemo(() => runCalibration(), []);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-10 py-4">
      <header className="max-w-2xl">
        <span className="pill text-gold">The moat that costs nothing</span>
        <h1 className="mt-2 text-3xl font-bold text-ice sm:text-4xl">Calibration & claims discipline</h1>
        <p className="mt-2 text-ice-dim">
          In a market built on “96%” and “99.2%”, the company that publishes its calibration curves
          — misses included — becomes the one journalists cite and regulators trust. The numbers
          below are computed <span className="text-safe">live, in your browser</span>, by running
          this exact engine over an open labeled set. Receipts, not slogans.
        </p>
      </header>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xl font-bold text-ice">Confusion matrix — computed just now</h2>
          <p className="text-xs text-ice-dim">
            {ENGINE_VERSION} · benchmark: open labeled set (n={cal.total}) · flag threshold &lt; {FLAG_THRESHOLD} · {today}
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Metric label="Precision" value={pct(cal.precision)} sub="of flagged, how many were real" />
          <Metric label="Recall" value={pct(cal.recall)} sub="of real scams, how many we caught" />
          <Metric label="F1" value={cal.f1.toFixed(2)} sub="balance of the two" />
          <Metric label="Accuracy" value={pct(cal.accuracy)} sub={`${cal.tp + cal.tn}/${cal.total} correct`} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="card p-4">
            <h3 className="font-bold text-ice">The misses we&apos;re publishing</h3>
            {cal.falseNegatives.length === 0 && cal.falsePositives.length === 0 ? (
              <p className="mt-2 text-sm text-ice-dim">No errors on this set today. (That is itself a claim we date and keep honest as the set grows.)</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {cal.falseNegatives.map((m) => (
                  <li key={m.case.id} className="text-ice-dim">
                    <span className="pill text-threat">missed scam</span>{" "}
                    scored {m.score} — “{truncate(m.case.text)}”
                  </li>
                ))}
                {cal.falsePositives.map((m) => (
                  <li key={m.case.id} className="text-ice-dim">
                    <span className="pill text-caution">false alarm</span>{" "}
                    scored {m.score} — “{truncate(m.case.text)}”
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card p-4">
            <h3 className="font-bold text-ice">Score distribution</h3>
            <div className="mt-3 space-y-1.5">
              {cal.scored
                .slice()
                .sort((a, b) => a.score - b.score)
                .map((s) => (
                  <div key={s.id} className="grid grid-cols-[64px_1fr_32px] items-center gap-2">
                    <span className="truncate text-[11px] text-ice-dim">{s.id}</span>
                    <div className="h-2 rounded-full bg-[rgba(141,163,207,0.12)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.score}%`,
                          background: s.fraud ? "#ff4d6a" : "#2bd9a6",
                        }}
                      />
                    </div>
                    <span className="text-right text-[11px] tabular-nums text-ice-dim">{s.score}</span>
                  </div>
                ))}
            </div>
            <p className="mt-2 text-[11px] text-ice-dim">
              <span className="text-threat">red = labeled scam</span> ·{" "}
              <span className="text-safe">green = legitimate</span>. Good separation is the goal.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-ice">Language coverage — what we&apos;ll actually claim</h2>
        <p className="text-sm text-ice-dim">A language ships only when paid native speakers validate it. Seed = wired, not yet certified.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LANG_COVERAGE.map((l) => (
            <div key={l.code} className="card flex items-center justify-between p-3">
              <span className="text-sm text-ice">{l.lang}</span>
              <span
                className="pill rounded-full px-2 py-1"
                style={{
                  background:
                    l.status === "validated" ? "rgba(43,217,166,0.16)" :
                    l.status === "seed" ? "rgba(242,180,65,0.16)" : "rgba(141,163,207,0.12)",
                  color:
                    l.status === "validated" ? "#2bd9a6" :
                    l.status === "seed" ? "#f2b441" : "#8da3cf",
                }}
              >
                {l.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-ice">What VraiShield will never say</h2>
        <ul className="mt-3 space-y-2">
          {NEVER_SAY.map((n, i) => (
            <li key={i} className="flex gap-2 text-sm text-ice-dim">
              <span className="text-gold">—</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-3xl font-bold text-safe">{value}</p>
      <p className="mt-0.5 text-sm font-semibold text-ice">{label}</p>
      <p className="text-xs text-ice-dim">{sub}</p>
    </div>
  );
}

const pct = (x: number) => `${Math.round(x * 100)}%`;
const truncate = (s: string) => (s.length > 70 ? s.slice(0, 70) + "…" : s);
