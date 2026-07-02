import Link from "next/link";
import { notFound } from "next/navigation";
import { FEATURES, FEATURES_BY_SLUG } from "@/lib/features";
import { AskVraiShield } from "@/components/AskVraiShield";
import { PhoneMock } from "@/components/PhoneMock";

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = FEATURES_BY_SLUG[slug];
  return { title: f ? `VraiShield — ${f.name}` : "VraiShield" };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = FEATURES_BY_SLUG[slug];
  if (!f) notFound();

  return (
    <div className="space-y-8 py-4">
      <Link href="/features" className="text-sm text-ice-dim hover:text-ice">← All features</Link>

      <header className="flex flex-wrap items-start gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[rgba(43,217,166,0.1)] text-3xl">
          {f.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-ice sm:text-3xl">{f.name}</h1>
            {f.star && <span className="pill text-gold">★ unique</span>}
            <span className="pill rounded-full bg-[rgba(141,163,207,0.12)] px-2 py-1 text-ice-dim">{f.phase}</span>
            <StatusChip live={f.status === "live"} />
          </div>
          <p className="mt-1 text-ice-dim">{f.tagline}</p>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="card p-5">
            <span className="pill text-safe">What it is</span>
            <p className="mt-2 text-ice">{f.what}</p>
          </div>

          <div className="card p-5">
            <span className="pill text-ice-dim">How it works</span>
            <ul className="mt-2 space-y-2">
              {f.how.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-ice">
                  <span className="text-safe">›</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5" style={{ borderColor: "rgba(232,184,58,0.3)" }}>
            <span className="pill text-gold">Beats</span>
            <p className="mt-2 text-sm text-ice-dim">{f.beats}</p>
          </div>

          {f.href && (
            <Link href={f.href} className="btn btn-primary px-6 py-3">
              Open the live {f.name} experience →
            </Link>
          )}
        </div>

        {/* Demo column */}
        <aside className="space-y-3">
          <span className="pill text-ice-dim">
            {f.engineDemo ? "Live engine" : "Sample screen"}
          </span>
          {f.engineDemo ? (
            <AskVraiShield />
          ) : (
            <PhoneMock
              title={f.name}
              accent={f.status === "live" ? "#2bd9a6" : "#f2b441"}
              lines={
                f.mock?.lines ?? [
                  `${f.icon}  ${f.name}`,
                  f.tagline,
                  "Interactive demo — sample data.",
                  "Production needs native OS hooks / partner APIs.",
                ]
              }
            />
          )}
          <p className="text-center text-[11px] text-ice-dim">
            {f.status === "live"
              ? "Wired to the real Trust Engine."
              : "Faithful mock with sample data."}
          </p>
        </aside>
      </section>
    </div>
  );
}

function StatusChip({ live }: { live: boolean }) {
  return (
    <span
      className="pill rounded-full px-2 py-1"
      style={{
        background: live ? "rgba(43,217,166,0.14)" : "rgba(242,180,65,0.14)",
        color: live ? "#2bd9a6" : "#f2b441",
      }}
    >
      {live ? "live engine" : "interactive demo"}
    </span>
  );
}
