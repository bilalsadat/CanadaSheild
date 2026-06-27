"use client";

import Link from "next/link";
import { useKinShield } from "@/lib/store";
import { TrustDial } from "@/components/TrustDial";
import { VERDICT_STYLE } from "@/components/verdict-style";

export default function DashboardPage() {
  const ks = useKinShield();

  if (!ks.hydrated) {
    return <div className="grid min-h-[50vh] place-items-center text-ice-dim">Loading your protection center…</div>;
  }

  if (!ks.onboarded) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div className="card max-w-md p-8">
          <p className="text-5xl">🛡️</p>
          <h1 className="mt-3 text-2xl font-bold text-ice">Set up your protection</h1>
          <p className="mt-2 text-ice-dim">Create your Family Circle and personalize KinShield. About 60 seconds — everything stays on your device.</p>
          <Link href="/welcome" className="btn btn-primary mt-5 px-6 py-3">Get protected →</Link>
        </div>
      </div>
    );
  }

  const checks = ks.history.length;
  const threats = ks.history.filter((h) => h.verdict === "dangerous" || h.verdict === "likely_scam").length;
  const posture = computePosture(ks.hardeningScore, threats, checks);
  const unread = ks.alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6 py-2">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ice sm:text-3xl">Hello, {ks.profile.name} 👋</h1>
          <p className="text-ice-dim">{ks.household.name} · {ks.profile.tier} plan · {ks.household.members.length} protected</p>
        </div>
        <Link href="/" className="btn btn-primary px-5 py-2.5 text-sm">+ Check a message</Link>
      </header>

      {/* Protection posture */}
      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="card flex flex-col items-center p-5">
          <TrustDial score={posture.score} size={150} />
          <p className="mt-2 font-bold" style={{ color: posture.color }}>{posture.label}</p>
          <p className="text-center text-xs text-ice-dim">Household protection posture</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <Stat big={checks.toString()} small="messages checked" />
          <Stat big={threats.toString()} small="threats caught" color="#ff8aa0" />
          <Stat big={`${ks.hardeningScore}`} small="hardening score" link="/features/passkey-coach" />
          <Stat big={ks.drillBest ? `${ks.drillBest}/6` : "—"} small="best scam-drill score" link="/features/scam-drill" />
        </div>
      </section>

      {/* Activity sparkline */}
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <span className="pill text-ice-dim">Last 7 days</span>
          <Link href="/alerts" className="text-xs text-safe">
            {unread > 0 ? `🔔 ${unread} new alerts` : "View alerts"} →
          </Link>
        </div>
        <Spark history={ks.history} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div>
          <h2 className="text-lg font-bold text-ice">Recent checks</h2>
          <div className="mt-3 space-y-2">
            {ks.history.slice(0, 6).map((h) => {
              const st = VERDICT_STYLE[h.verdict];
              return (
                <div key={h.id} className="card flex items-center gap-3 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums" style={{ background: st.soft, color: st.color }}>{h.score}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ice">{h.snippet || h.scriptLabel || "Checked message"}</p>
                    <p className="text-xs text-ice-dim">{h.channel} · {timeAgo(h.ts)}</p>
                  </div>
                  <span>{st.emoji}</span>
                </div>
              );
            })}
            {ks.history.length === 0 && (
              <div className="card p-5 text-center text-sm text-ice-dim">
                No checks yet. <Link href="/" className="text-safe">Paste a suspicious message →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Household + quick actions */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ice">Your Family Circle</h2>
              <Link href="/family" className="text-xs text-safe">Manage →</Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ks.household.members.map((m) => (
                <span key={m.id} className="rounded-full border border-[rgba(141,163,207,0.2)] px-3 py-1.5 text-xs text-ice">
                  {m.role === "senior" ? "🧓" : m.role === "guardian" ? "🛡️" : "👤"} {m.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-ice">Quick actions</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { href: "/features/check-before-you-send", label: "Check before you send", icon: "💸" },
                { href: "/features/sms-shield", label: "Review filtered texts", icon: "📨" },
                { href: "/map", label: "Local threat map", icon: "🗺️" },
                { href: "/incident", label: "Incident Mode", icon: "🆘" },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="card card-hover flex items-center gap-2 p-3 text-sm text-ice">
                  <span className="text-lg">{a.icon}</span>{a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function computePosture(hardening: number, threats: number, checks: number) {
  // Posture rewards hardening and active use; lightly informed by threats seen.
  let score = 40 + Math.round(hardening * 0.45) + Math.min(15, checks * 2);
  if (checks > 0 && threats / Math.max(checks, 1) > 0.5) score -= 6;
  score = Math.max(10, Math.min(100, score));
  const color = score >= 70 ? "#2bd9a6" : score >= 45 ? "#f2b441" : "#ff8aa0";
  const label = score >= 80 ? "Strongly protected" : score >= 60 ? "Well protected" : score >= 40 ? "Getting set up" : "Needs attention";
  return { score, color, label };
}

function Stat({ big, small, color = "#2bd9a6", link }: { big: string; small: string; color?: string; link?: string }) {
  const inner = (
    <div className="card card-hover h-full p-4">
      <p className="text-3xl font-bold" style={{ color }}>{big}</p>
      <p className="mt-0.5 text-sm text-ice-dim">{small}</p>
    </div>
  );
  return link ? <Link href={link}>{inner}</Link> : inner;
}

function Spark({ history }: { history: { ts: number }[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const next = d.getTime() + 86400000;
    return { day: d.toLocaleDateString(undefined, { weekday: "short" }), count: history.filter((h) => h.ts >= d.getTime() && h.ts < next).length };
  });
  const max = Math.max(...days.map((d) => d.count), 1);
  return (
    <div className="mt-3 flex items-end gap-2" style={{ height: 90 }}>
      {days.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
          <div className="w-full rounded-t-md bg-safe/70" style={{ height: `${(d.count / max) * 70 + 4}px`, background: "linear-gradient(180deg,#2bd9a6,#11a87d)" }} />
          <span className="text-[10px] text-ice-dim">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
