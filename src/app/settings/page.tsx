"use client";

import { useKinShield } from "@/lib/store";
import type { Language } from "@/lib/trust-engine";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "English" }, { code: "fr", label: "Français" }, { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "zh", label: "中文" }, { code: "es", label: "Español" }, { code: "tl", label: "Tagalog" },
  { code: "ar", label: "العربية" }, { code: "vi", label: "Tiếng Việt" }, { code: "ko", label: "한국어" },
  { code: "pt", label: "Português" }, { code: "hi", label: "हिन्दी" },
];

export default function SettingsPage() {
  const ks = useKinShield();

  return (
    <div className="space-y-8 py-4">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-ice sm:text-4xl">Settings &amp; Privacy</h1>
        <p className="mt-2 text-ice-dim">Your data lives on this device. Change anything, export it, or wipe it — instantly.</p>
      </header>

      {/* Split-plane privacy dashboard */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5" style={{ borderColor: "rgba(43,217,166,0.3)" }}>
          <span className="pill text-safe">🔒 Personal plane — what&apos;s yours</span>
          <p className="mt-2 text-sm font-semibold text-ice">We cannot read this.</p>
          <ul className="mt-2 space-y-1 text-sm text-ice-dim">
            <li>› Your messages, transcripts &amp; evidence</li>
            <li>› Your family graph &amp; voiceprints</li>
            <li>› Your scan history ({ks.history.length} items, on this device)</li>
          </ul>
          <p className="mt-2 text-xs text-ice-dim">Encrypted client-side. Server holds only ciphertext. Even a subpoena yields nothing readable.</p>
        </div>
        <div className="card p-5">
          <span className="pill text-ice-dim">🌐 Network plane — the scammer&apos;s</span>
          <p className="mt-2 text-sm font-semibold text-ice">We share this to protect everyone.</p>
          <ul className="mt-2 space-y-1 text-sm text-ice-dim">
            <li>› Attacker numbers, domains &amp; scripts</li>
            <li>› Only when you explicitly report</li>
            <li>› Pseudonymized, human-reviewed, aggregate to the CAFC</li>
          </ul>
          <p className="mt-2 text-xs text-ice-dim">“What&apos;s yours, we cannot read. What&apos;s the scammer&apos;s, we share.”</p>
        </div>
      </section>

      {/* Preferences */}
      <section className="card p-5">
        <h2 className="text-lg font-bold text-ice">Preferences</h2>
        <div className="mt-3 space-y-1">
          <Row label="Language" sub="Detection, explanations and spoken verdicts">
            <select value={ks.settings.language} onChange={(e) => ks.setSetting("language", e.target.value as Language)} className="rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-1.5 text-sm text-ice">
              {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </Row>
          <Toggle label="Senior Mode" sub="Big buttons, 36pt type, verdicts read aloud" on={ks.settings.seniorMode} onClick={() => ks.setSetting("seniorMode", !ks.settings.seniorMode)} />
          <Toggle label="Push notifications" sub="Alerts on flagged events and family activity" on={ks.settings.notifications} onClick={() => ks.setSetting("notifications", !ks.settings.notifications)} />
          <Toggle label="Screen unknown callers" sub="Route to the KinShield Line" on={ks.settings.screenUnknownCallers} onClick={() => ks.setSetting("screenUnknownCallers", !ks.settings.screenUnknownCallers)} />
          <Toggle label="Ping guardian on large transfers" sub="Over $500 (policy-set, not surveillance)" on={ks.settings.largeTransferPing} onClick={() => ks.setSetting("largeTransferPing", !ks.settings.largeTransferPing)} />
        </div>
      </section>

      {/* Plan */}
      <section className="card p-5">
        <h2 className="text-lg font-bold text-ice">Plan</h2>
        <p className="text-sm text-ice-dim">Current: <b className="text-safe">{ks.profile.tier}</b></p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["Free", "Family", "Premium"] as const).map((t) => (
            <button key={t} onClick={() => ks.setTier(t)} className="rounded-lg border px-4 py-2 text-sm"
              style={{ borderColor: ks.profile.tier === t ? "#2bd9a6" : "rgba(141,163,207,0.2)", color: ks.profile.tier === t ? "#2bd9a6" : "#c6d4f0" }}>
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Data controls */}
      <section className="card p-5">
        <h2 className="text-lg font-bold text-ice">Your data</h2>
        <p className="text-sm text-ice-dim">Full control, no questions asked.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => exportData(ks)} className="btn btn-ghost px-4 py-2 text-sm">⬇ Export my data (JSON)</button>
          <button
            onClick={() => { if (confirm("This erases your household, history and settings from this device. Continue?")) ks.reset(); }}
            className="btn px-4 py-2 text-sm" style={{ background: "rgba(255,77,106,0.16)", color: "#ff8aa0" }}
          >
            🗑 Delete everything
          </button>
        </div>
      </section>
    </div>
  );
}

function Row({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[rgba(141,163,207,0.1)] py-3 last:border-0">
      <div>
        <p className="text-sm font-semibold text-ice">{label}</p>
        <p className="text-xs text-ice-dim">{sub}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, sub, on, onClick }: { label: string; sub: string; on: boolean; onClick: () => void }) {
  return (
    <Row label={label} sub={sub}>
      <button onClick={onClick} className="relative inline-block h-6 w-11 shrink-0 rounded-full transition" style={{ background: on ? "#2bd9a6" : "rgba(141,163,207,0.3)" }}>
        <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all" style={{ left: on ? "22px" : "2px" }} />
      </button>
    </Row>
  );
}

function exportData(ks: ReturnType<typeof useKinShield>) {
  const { hydrated, completeOnboarding, addScan, addAlert, markAlertsRead, addMember, removeMember, setSetting, setHardening, setDrillBest, setTier, reset, ...data } = ks;
  void hydrated; void completeOnboarding; void addScan; void addAlert; void markAlertsRead; void addMember; void removeMember; void setSetting; void setHardening; void setDrillBest; void setTier; void reset;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "kinshield-my-data.json"; a.click();
  URL.revokeObjectURL(url);
}
