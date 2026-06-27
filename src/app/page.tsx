import Link from "next/link";
import { AskKinShield } from "@/components/AskKinShield";

const STATS = [
  { big: "$638M+", small: "reported to the CAFC in 2024 — and only 5–10% is ever reported" },
  { big: "12", small: "languages where Canadian losses actually concentrate" },
  { big: "1 score", small: "behind every channel: texts, links, calls, money, meetings" },
];

const PILLARS = [
  { icon: "💬", title: "Ask KinShield", href: "#try", body: "Paste, forward or photograph anything and get a Trust Score, the top reasons, and a recommended action — in your language, in seconds.", phase: "P0" },
  { icon: "📨", title: "SMS / RCS Shield", href: "/features/sms-shield", body: "Scam texts filtered before they reach the inbox, with Canadian patterns the OS filters miss, and one-tap report-to-protect-everyone.", phase: "P0" },
  { icon: "🔗", title: "Link & QR Checker", href: "/features/link-qr-checker", body: "Lookalike domains, homoglyphs, risky TLDs and brand-off-domain phishing caught before you tap — tuned for CRA, Interac, Canada Post.", phase: "P0" },
  { icon: "👪", title: "Family Circle", href: "/family", body: "The household is the unit of protection. Adult children see flagged events, set policies, and get alerts across every platform.", phase: "P0" },
  { icon: "📞", title: "The KinShield Line", href: "/features/call-line", body: "An AI receptionist screens unknown callers at the network layer — judging the conversation, not just the caller ID — on every handset.", phase: "P1" },
  { icon: "🕰️", title: "Long-Con Radar", href: "/features/long-con-radar", body: "Romance fraud and pig-butchering unfold over weeks. KinShield reads the script's progression and intervenes while it still works.", phase: "P1" },
  { icon: "🆘", title: "Incident Mode", href: "/incident", body: "The panic button competitors forgot. Triage, evidence capture, pre-filled CAFC/police reports, scripted bank calls — sequenced.", phase: "P0" },
  { icon: "🏦", title: "KinShield SDK", href: "/sdk", body: "The same brain, licensed: a Bill C-15 control kit, Trust Engine API, residency, and an FCAC reporting pipeline for banks and credit unions.", phase: "P1→P2" },
];

const MOATS = [
  { n: "01", t: "The Canadian corpus", d: "Labelled scam scripts in twelve languages, refreshed by the community network and honeypot. Data nobody can buy, in languages nobody else collects." },
  { n: "02", t: "The family graph", d: "Once a household enrols four members, policies, voiceprints and history make switching costs enormous — and every protected senior recruits more families." },
  { n: "03", t: "Regulatory fluency as product", d: "Bill C-15 control kits, FCAC pipelines, Law 25 filings, CRTC/STIR-SHAKEN — compliance turned into an SDK incumbents would need years to match." },
  { n: "04", t: "Split-plane privacy", d: "End-to-end encrypted personal data, externally audited; consented network intel. Data-monetizing incumbents can't retrofit this." },
  { n: "05", t: "The recovery operation", d: "Human, trauma-informed, multilingual incident support — an operations moat that's impossible to fake and the source of the brand's stories." },
  { n: "06", t: "Calibrated honesty", d: "Published accuracy reports, failures included, in a market of “96%” claims. Trust compounds; overclaiming detonates. Costs nothing; uncopyable." },
];

const TIERS = [
  { name: "Free", price: "$0", role: "Distribution + network data", items: ["SMS Shield", "5 link/QR checks a day", "Basic Trust Score", "Community reporting", "Incident Mode (self-serve)"] },
  { name: "Family", price: "$9.99/mo", role: "The wedge — bought by adult children", featured: true, items: ["Everything in Free", "Family Circle + Senior Mode", "The KinShield Line", "Unlimited Ask KinShield", "Crisis Vault · Long-Con Radar", "Exposure Sweep · Zero-Knowledge Vault"] },
  { name: "Premium", price: "$19.99/mo", role: "SMBs + high-exposure users", items: ["Everything in Family", "Human Recovery Line", "Email Guard · Wire Guard", "Meeting Assist · Voice Lock", "Insurance benefit (Year 2+)"] },
  { name: "Enterprise SDK", price: "$50–250K/yr", role: "The institutional revenue engine", items: ["Trust Engine API", "Bill C-15 control kit", "Threat-intel feed (CA residency)", "FCAC reporting pipeline", "SLAs + SOC 2"] },
];

export default function Home() {
  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="pt-8">
        <span className="pill rounded-full border border-[rgba(232,184,58,0.4)] bg-[rgba(232,184,58,0.08)] px-3 py-1.5 text-gold">
          Bill C-15 · the window is measured in quarters, not years
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ice sm:text-6xl">
          The bodyguard for the way{" "}
          <span className="text-safe">fraud actually targets families.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ice-dim">
          Apple and Google commoditized detection. KinShield is the orchestration layer above all
          of them — one Trust Score behind every channel, built for the household, fluent in the
          twelve languages where Canadian losses concentrate, and honest about exactly what it can
          and can&apos;t do.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="#try" className="btn btn-primary px-6 py-3 text-base">
            Try the Trust Engine
          </Link>
          <Link href="/features" className="btn btn-ghost px-6 py-3 text-base">
            Explore all 30 features →
          </Link>
          <Link href="/map" className="btn btn-ghost px-6 py-3 text-base">
            🗺️ Live threat map
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.big} className="card card-hover p-5">
              <p className="text-3xl font-bold text-safe">{s.big}</p>
              <p className="mt-1 text-sm text-ice-dim">{s.small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="try" className="scroll-mt-20">
        <SectionHead
          kicker="The brain, live"
          title="Ask KinShield"
          sub="This is the real Trust Engine running in your browser — five signal families fused into one score, with the full reasoning ledger shown. Try an example or paste your own."
        />
        <div className="mt-6">
          <AskKinShield />
        </div>
      </section>

      {/* PILLARS */}
      <section>
        <SectionHead
          kicker="One system, not one feature"
          title="Beat a feature with a system"
          sub="Thirty features across three phases. The wedge ships first; the catalogue compounds. Every one renders into Senior Mode and twelve languages."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <Link key={p.title} href={p.href} className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{p.icon}</span>
                <span className="pill rounded-full bg-[rgba(141,163,207,0.1)] px-2 py-1 text-ice-dim">{p.phase}</span>
              </div>
              <h3 className="mt-3 font-bold text-ice">{p.title}</h3>
              <p className="mt-1.5 text-sm text-ice-dim">{p.body}</p>
              <span className="mt-3 inline-block text-xs text-safe">Open →</span>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/features" className="btn btn-ghost px-5 py-2.5 text-sm">See the full 30-feature catalogue →</Link>
        </div>
      </section>

      {/* MOATS */}
      <section>
        <SectionHead
          kicker="Why incumbents can't cheaply copy it"
          title="The six moats"
          sub="Detection is becoming a commodity. Judgment, family context, Canadian context, and recovery are not."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOATS.map((m) => (
            <div key={m.n} className="card p-5">
              <span className="font-mono text-sm text-gold">{m.n}</span>
              <h3 className="mt-1 font-bold text-ice">{m.t}</h3>
              <p className="mt-1.5 text-sm text-ice-dim">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section>
        <SectionHead
          kicker="Pricing"
          title="Free distribution → family wedge → institutional engine"
          sub="Gross margins of 75–85% at scale are realistic when the human recovery line is gated to paid tiers and telephony abuse is controlled."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`card p-5 ${t.featured ? "ring-1 ring-safe" : ""}`}
              style={t.featured ? { borderColor: "rgba(43,217,166,0.5)" } : undefined}
            >
              {t.featured && <span className="pill text-safe">Most popular</span>}
              <h3 className="mt-1 text-lg font-bold text-ice">{t.name}</h3>
              <p className="text-2xl font-bold text-safe">{t.price}</p>
              <p className="mt-1 text-xs text-ice-dim">{t.role}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-ice-dim">
                {t.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-safe">✓</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card overflow-hidden p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold text-ice sm:text-3xl">
          Build the P0 wedge. Earn the evidence. Let the catalogue compound.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-ice-dim">
          A name a grandmother can repeat, every mechanism buildable under today&apos;s OS rules and
          Canadian law, and claims that survive an expert&apos;s cross-examination.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/family" className="btn btn-primary px-6 py-3">See Family Circle</Link>
          <Link href="/transparency" className="btn btn-ghost px-6 py-3">Read the calibration discipline</Link>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div className="max-w-2xl">
      <span className="pill text-safe">{kicker}</span>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-ice sm:text-3xl">{title}</h2>
      <p className="mt-2 text-ice-dim">{sub}</p>
    </div>
  );
}
