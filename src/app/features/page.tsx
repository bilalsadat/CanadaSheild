import Link from "next/link";
import { featuresByPillar, featureHref, FEATURES } from "@/lib/features";

export const metadata = { title: "KinShield — the full feature catalogue" };

export default function FeaturesHub() {
  const groups = featuresByPillar();
  const live = FEATURES.filter((f) => f.status === "live").length;

  return (
    <div className="space-y-10 py-4">
      <header className="max-w-2xl">
        <span className="pill text-safe">The A-to-Z catalogue</span>
        <h1 className="mt-2 text-3xl font-bold text-ice sm:text-4xl">All 30 features</h1>
        <p className="mt-2 text-ice-dim">
          The whole system, not one feature. {live} are wired to the live Trust Engine in this
          build; the rest are faithful interactive demos standing in for capabilities that need
          native OS hooks, telephony or partner integrations in production. Every one is reachable —
          tap any card.
        </p>
        <div className="mt-3 flex gap-3 text-xs text-ice-dim">
          <span className="inline-flex items-center gap-1.5"><Dot c="#2bd9a6" /> Live engine</span>
          <span className="inline-flex items-center gap-1.5"><Dot c="#f2b441" /> Interactive demo</span>
        </div>
      </header>

      {groups.map((g) => (
        <section key={g.pillar}>
          <h2 className="text-xl font-bold text-ice">{g.pillar}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((f) => (
              <Link key={f.id} href={featureHref(f)} className="card card-hover flex flex-col p-5">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{f.icon}</span>
                  <div className="flex items-center gap-1.5">
                    {f.star && <span className="pill text-gold" title="No consumer competitor offers this">★</span>}
                    <span className="pill rounded-full bg-[rgba(141,163,207,0.1)] px-2 py-0.5 text-ice-dim">{f.phase}</span>
                  </div>
                </div>
                <h3 className="mt-3 font-bold text-ice">{f.name}</h3>
                <p className="mt-1 text-sm text-ice-dim">{f.tagline}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <Dot c={f.status === "live" ? "#2bd9a6" : "#f2b441"} />
                  <span className="text-xs" style={{ color: f.status === "live" ? "#2bd9a6" : "#f2b441" }}>
                    {f.status === "live" ? "Live engine" : "Interactive demo"}
                  </span>
                  <span className="ml-auto text-xs text-ice-dim">Open →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Dot({ c }: { c: string }) {
  return <span className="inline-block h-2 w-2 rounded-full" style={{ background: c }} />;
}
