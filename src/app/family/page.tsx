"use client";

import { useState } from "react";

interface Member {
  name: string;
  role: string;
  device: string;
  lang: string;
  senior?: boolean;
  guardian?: boolean;
}

const MEMBERS: Member[] = [
  { name: "Priya", role: "Guardian", device: "iPhone", lang: "EN/PA", guardian: true },
  { name: "Arjun", role: "Member", device: "Pixel", lang: "EN" },
  { name: "Dadi (Grandma)", role: "Protected", device: "Galaxy", lang: "ਪੰਜਾਬੀ", senior: true },
  { name: "Nanu (Grandpa)", role: "Protected", device: "iPhone SE", lang: "ਪੰਜਾਬੀ", senior: true },
  { name: "Simran", role: "Member", device: "iPhone", lang: "EN" },
];

const ALERTS = [
  { who: "Dadi", what: "Screened an unknown caller — matched CRA-arrest script. Blocked.", score: 6, when: "2h ago", lang: "ਪੰਜਾਬੀ" },
  { who: "Nanu", what: "Got a Canada Post fee text. KinShield filtered it before the inbox.", score: 14, when: "Yesterday", lang: "ਪੰਜਾਬੀ" },
  { who: "Arjun", what: "Checked an investment DM — flagged as pig-butchering stage 3.", score: 11, when: "2d ago", lang: "EN" },
];

export default function FamilyPage() {
  const [policies, setPolicies] = useState({
    screenUnknown: true,
    largeTransferPing: true,
    seniorSlowPersona: true,
    incidentBroadcast: true,
  });

  return (
    <div className="space-y-10 py-4">
      <header className="max-w-2xl">
        <span className="pill text-safe">The retention machine</span>
        <h1 className="mt-2 text-3xl font-bold text-ice sm:text-4xl">Family Circle</h1>
        <p className="mt-2 text-ice-dim">
          The household is the unit of protection. Once four members enrol, policies, voiceprints
          and shared history make switching costs enormous — and every protected senior recruits
          their siblings&apos; families. The moat that compounds.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <span className="pill text-ice-dim">Your household — 5 members, 3 platforms</span>
          <Constellation members={MEMBERS} />
          <p className="mt-2 text-center text-xs text-ice-dim">
            The only layer covering the iPhone parent, the Android senior and the desktop owner —
            together. A family is never all-Pixel.
          </p>
        </div>

        <div className="card p-6">
          <span className="pill text-ice-dim">Shared policies</span>
          <div className="mt-3 space-y-3">
            {[
              { key: "screenUnknown", label: "Screen unknown callers for grandparents", sub: "Routes to the KinShield Line" },
              { key: "largeTransferPing", label: "Ping guardian on transfers over $500", sub: "Policy-set, not surveillance" },
              { key: "seniorSlowPersona", label: "Use the slow, patient screening persona", sub: "Senior Mode households" },
              { key: "incidentBroadcast", label: "Alert the circle if Incident Mode opens", sub: "Silent, instant" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPolicies((s) => ({ ...s, [p.key]: !s[p.key as keyof typeof s] }))}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-[rgba(141,163,207,0.16)] bg-[rgba(10,20,48,0.4)] p-3 text-left"
              >
                <span>
                  <span className="block text-sm font-semibold text-ice">{p.label}</span>
                  <span className="block text-xs text-ice-dim">{p.sub}</span>
                </span>
                <Toggle on={policies[p.key as keyof typeof policies]} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <span className="pill text-safe">Live across the household</span>
        <h2 className="mt-2 text-2xl font-bold text-ice">What the circle saw this week</h2>
        <div className="mt-4 space-y-3">
          {ALERTS.map((a, i) => (
            <div key={i} className="card flex items-center gap-4 p-4">
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold"
                style={{ background: "rgba(255,77,106,0.14)", color: "#ff4d6a" }}
              >
                {a.score}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ice">
                  <b>{a.who}</b> · <span className="text-ice-dim">{a.what}</span>
                </p>
                <p className="text-xs text-ice-dim">{a.when} · handled in {a.lang}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Constellation({ members }: { members: Member[] }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const R = 110;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto mt-4 w-full max-w-sm">
      {members.map((_, i) => {
        const a = (i / members.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={`l${i}`}
            x1={cx}
            y1={cy}
            x2={cx + R * Math.cos(a)}
            y2={cy + R * Math.sin(a)}
            stroke="rgba(43,217,166,0.25)"
            strokeWidth="1.5"
          />
        );
      })}
      <circle cx={cx} cy={cy} r="30" fill="rgba(43,217,166,0.16)" stroke="#2bd9a6" strokeWidth="2" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="11" fill="#c6d4f0" fontWeight="700">Kin</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill="#8da3cf">household</text>
      {members.map((m, i) => {
        const a = (i / members.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        const col = m.senior ? "#f2b441" : m.guardian ? "#2bd9a6" : "#7aa2ff";
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="22" fill="rgba(10,20,48,0.9)" stroke={col} strokeWidth="2" />
            <text x={x} y={y - 1} textAnchor="middle" fontSize="9" fill="#c6d4f0" fontWeight="700">
              {m.name.split(" ")[0]}
            </text>
            <text x={x} y={y + 10} textAnchor="middle" fontSize="7" fill="#8da3cf">{m.device}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className="relative inline-block h-6 w-11 shrink-0 rounded-full transition"
      style={{ background: on ? "#2bd9a6" : "rgba(141,163,207,0.3)" }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
        style={{ left: on ? "22px" : "2px" }}
      />
    </span>
  );
}
