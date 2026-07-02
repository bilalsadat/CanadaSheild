const REQUEST = `POST /api/check
content-type: application/json

{
  "text": "URGENT: move your balance to a safe account, read me the code",
  "channel": "call_transcript",
  "recipient": "6045550147",
  "language": "en",
  "context": { "userInitiated": false, "amountCAD": 4200 }
}`;

const RESPONSE = `{
  "result": {
    "trustScore": 7,
    "verdict": "dangerous",
    "action": "block_and_report",
    "uncertainty": 6,
    "detectedScript": {
      "id": "bank_security",
      "label": "Bank fraud-department impersonation",
      "extraction": "the one-time passcode, or a transfer to a 'safe account'"
    },
    "ledger": [
      { "family": "content",  "risk": 0.92, "contribution": 0.41 },
      { "family": "network",  "risk": 0.86, "contribution": 0.33 },
      { "family": "anomaly",  "risk": 0.45, "contribution": 0.14 }
    ],
    "engineVersion": "trust-engine/0.1.0+corpus-2026.06"
  }
}`;

const C15 = [
  { t: "Express-consent screens", d: "Drop-in cool-off and consent UX mapping directly to Bill C-15's requirement to obtain express consent before enabling risky capabilities." },
  { t: "Capability toggles", d: "Let customers disable transfers/payments and adjust transaction limits — the exact controls the Act now mandates, white-labelled." },
  { t: "FCAC reporting pipeline", d: "Produces the fraud data banks must file, formatted and residency-clean." },
  { t: "Threat-intel feed", d: "The consented network plane — numbers, domains, scripts — with Canadian data residency and SLAs." },
];

const COMPLIANCE = ["SOC 2 Type I → II", "OSFI B-13 mapping", "Law 25 / PIPEDA PIAs", "ca-central-1 residency attestation", "External cryptography audit", "Annual penetration test"];

export default function SdkPage() {
  return (
    <div className="space-y-12 py-4">
      <header className="max-w-2xl">
        <span className="pill text-gold">The institutional revenue engine</span>
        <h1 className="mt-2 text-3xl font-bold text-ice sm:text-4xl">VraiShield SDK — the Bill C-15 product</h1>
        <p className="mt-2 text-ice-dim">
          The same brain, licensed. Pindrop&apos;s enterprise position, attacked from below with
          consumer-proven detection, Canadian compliance fluency, and price points credit unions can
          sign. Score any transaction, recipient, message or session through one API.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <CodeBlock title="Request" code={REQUEST} />
        <CodeBlock title="Response" code={RESPONSE} accent />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-ice">The C-15 control kit</h2>
        <p className="mt-1 max-w-2xl text-ice-dim">
          Compliance turned into an SDK incumbents would need years of Canadian legal work to match.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {C15.map((c) => (
            <div key={c.t} className="card p-5">
              <h3 className="font-bold text-ice">{c.t}</h3>
              <p className="mt-1 text-sm text-ice-dim">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-ice">Compliance artifacts (which double as sales collateral)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {COMPLIANCE.map((c) => (
            <span key={c} className="rounded-full border border-[rgba(43,217,166,0.3)] bg-[rgba(43,217,166,0.07)] px-3 py-1.5 text-sm text-safe">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-ice-dim">
          Go-to-market: credit unions and digital banks first (6–12-month cycles), Big-5
          conversations opened on the back of SOC 2 Type II + live references. Pricing:
          <span className="text-ice"> $50K–$250K/yr + per-check usage</span>.
        </p>
      </section>
    </div>
  );
}

function CodeBlock({ title, code, accent }: { title: string; code: string; accent?: boolean }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-[rgba(141,163,207,0.14)] px-4 py-2">
        <span className="pill" style={{ color: accent ? "#2bd9a6" : "#8da3cf" }}>{title}</span>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-ice">
        <code>{code}</code>
      </pre>
    </div>
  );
}
