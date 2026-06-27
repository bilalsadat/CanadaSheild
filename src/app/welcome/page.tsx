"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKinShield, type Member, type MemberRole } from "@/lib/store";
import type { Language } from "@/lib/trust-engine";
import { Wordmark } from "@/components/Brand";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "English" }, { code: "fr", label: "Français" }, { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "zh", label: "中文" }, { code: "es", label: "Español" }, { code: "tl", label: "Tagalog" },
  { code: "ar", label: "العربية" }, { code: "vi", label: "Tiếng Việt" }, { code: "ko", label: "한국어" },
  { code: "pt", label: "Português" }, { code: "hi", label: "हिन्दी" },
];

type Role = "self" | "parent" | "business";

export default function WelcomePage() {
  const router = useRouter();
  const { completeOnboarding } = useKinShield();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [language, setLanguage] = useState<Language>("en");
  const [household, setHousehold] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [tier, setTier] = useState<"Free" | "Family" | "Premium">("Family");

  const [mName, setMName] = useState("");
  const [mRole, setMRole] = useState<MemberRole>("senior");
  const [mDevice, setMDevice] = useState("iPhone");

  function addMember() {
    if (!mName.trim()) return;
    setMembers((m) => [...m, { id: Math.random().toString(36).slice(2, 9), name: mName, role: mRole, device: mDevice, language }]);
    setMName("");
  }

  function finish() {
    const all: Member[] = [
      { id: "you", name: name || "You", role: "guardian", device: "This device", language },
      ...members,
    ];
    completeOnboarding({ name: name || "You", role: (role || "self"), language, household: household || `${name || "My"} household`, members: all, seniorMode: false, tier });
    router.push("/dashboard");
  }

  const seniorMode = role === "parent";

  return (
    <div className="mx-auto max-w-xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <Wordmark />
        <span className="pill text-ice-dim">Step {step + 1} of 4</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-[rgba(141,163,207,0.14)]">
        <div className="h-full rounded-full bg-safe transition-all" style={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>

      {step === 0 && (
        <Card title="Welcome — let's get you protected" sub="Takes about 60 seconds. Everything stays on your device.">
          <Label>What should we call you?</Label>
          <Input value={name} onChange={setName} placeholder="Your first name" />
          <Label className="mt-4">Who are you protecting?</Label>
          <div className="mt-1 grid gap-2 sm:grid-cols-3">
            {([["self", "Myself", "🙋"], ["parent", "A parent / senior", "🧓"], ["business", "My business", "🏢"]] as const).map(([v, l, ic]) => (
              <button key={v} onClick={() => setRole(v)} className="rounded-xl border p-3 text-center text-sm transition"
                style={{ borderColor: role === v ? "#2bd9a6" : "rgba(141,163,207,0.2)", background: role === v ? "rgba(43,217,166,0.1)" : "transparent", color: role === v ? "#2bd9a6" : "#c6d4f0" }}>
                <span className="block text-2xl">{ic}</span>{l}
              </button>
            ))}
          </div>
          <Next onClick={() => setStep(1)} disabled={!name.trim() || !role} />
        </Card>
      )}

      {step === 1 && (
        <Card title="Your language" sub="Detection, explanations and spoken verdicts adapt to it.">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setLanguage(l.code)} className="rounded-xl border px-3 py-2.5 text-sm transition"
                style={{ borderColor: language === l.code ? "#2bd9a6" : "rgba(141,163,207,0.2)", background: language === l.code ? "rgba(43,217,166,0.1)" : "transparent", color: language === l.code ? "#2bd9a6" : "#c6d4f0" }}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Back onClick={() => setStep(0)} />
            <Next onClick={() => setStep(2)} />
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card title="Build your Family Circle" sub="Add the people you want under one shield. You can change this later.">
          <Label>Household name</Label>
          <Input value={household} onChange={setHousehold} placeholder="e.g. The Singh family" />

          <div className="mt-4 rounded-xl border border-[rgba(141,163,207,0.16)] bg-[rgba(10,20,48,0.4)] p-3">
            <Label>Add a member</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              <Input value={mName} onChange={setMName} placeholder="Name" />
              <select value={mRole} onChange={(e) => setMRole(e.target.value as MemberRole)} className="rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-sm text-ice">
                <option value="senior">Protected senior</option>
                <option value="member">Member</option>
                <option value="guardian">Guardian</option>
              </select>
              <select value={mDevice} onChange={(e) => setMDevice(e.target.value)} className="rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-sm text-ice">
                {["iPhone", "Android", "Pixel", "Galaxy", "Desktop"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button onClick={addMember} disabled={!mName.trim()} className="btn btn-ghost mt-2 px-3 py-1.5 text-sm disabled:opacity-50">+ Add member</button>
          </div>

          {members.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-lg bg-[rgba(43,217,166,0.08)] px-3 py-2 text-sm text-ice">
                  <span>{m.name} · <span className="text-ice-dim">{m.role} · {m.device}</span></span>
                  <button onClick={() => setMembers((x) => x.filter((y) => y.id !== m.id))} className="text-ice-dim hover:text-threat">✕</button>
                </li>
              ))}
            </ul>
          )}
          {seniorMode && <p className="mt-3 text-xs text-gold">Senior Mode (big buttons, spoken verdicts) will be on by default for protected seniors.</p>}

          <div className="mt-5 flex gap-2">
            <Back onClick={() => setStep(1)} />
            <Next onClick={() => setStep(3)} disabled={!household.trim()} />
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card title="Choose a plan" sub="Start free. You can change anytime — this demo unlocks everything regardless.">
          <div className="grid gap-2">
            {([["Free", "$0", "SMS Shield, basic checks, Incident Mode"], ["Family", "$9.99/mo", "The Line, Family Circle, Crisis Vault, Long-Con Radar"], ["Premium", "$19.99/mo", "Human Recovery Line, Wire Guard, Voice Lock, Insurance"]] as const).map(([t, p, d]) => (
              <button key={t} onClick={() => setTier(t)} className="flex items-center gap-3 rounded-xl border p-3 text-left transition"
                style={{ borderColor: tier === t ? "#2bd9a6" : "rgba(141,163,207,0.2)", background: tier === t ? "rgba(43,217,166,0.08)" : "transparent" }}>
                <span className="grid h-6 w-6 place-items-center rounded-full border-2" style={{ borderColor: tier === t ? "#2bd9a6" : "rgba(141,163,207,0.4)", background: tier === t ? "#2bd9a6" : "transparent", color: "#022017", fontSize: 12 }}>{tier === t ? "✓" : ""}</span>
                <span className="flex-1">
                  <span className="font-bold text-ice">{t}</span> <span className="text-safe">{p}</span>
                  <span className="block text-xs text-ice-dim">{d}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Back onClick={() => setStep(2)} />
            <button onClick={finish} className="btn btn-primary flex-1 py-2.5">Enter KinShield →</button>
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold text-ice">{title}</h1>
      <p className="mt-1 text-sm text-ice-dim">{sub}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`mb-1 block text-sm font-medium text-ice ${className}`}>{children}</span>;
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-ice outline-none focus:border-safe" />;
}
function Next({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="btn btn-primary mt-5 flex-1 py-2.5 disabled:opacity-50">Continue →</button>;
}
function Back({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="btn btn-ghost px-5 py-2.5">← Back</button>;
}
