import Link from "next/link";
import { FEATURES_BY_SLUG } from "@/lib/features";

/** Consistent header + back link for bespoke feature pages. */
export function FeatureShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const f = FEATURES_BY_SLUG[slug];
  return (
    <div className="space-y-6 py-4">
      <Link href="/features" className="text-sm text-ice-dim hover:text-ice">← All features</Link>
      {f && (
        <header className="flex flex-wrap items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[rgba(43,217,166,0.1)] text-2xl">
            {f.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ice sm:text-3xl">{f.name}</h1>
              {f.star && <span className="pill text-gold">★ unique</span>}
              <span className="pill rounded-full bg-[rgba(141,163,207,0.12)] px-2 py-1 text-ice-dim">{f.phase}</span>
              <span
                className="pill rounded-full px-2 py-1"
                style={{
                  background: f.status === "live" ? "rgba(43,217,166,0.14)" : "rgba(242,180,65,0.14)",
                  color: f.status === "live" ? "#2bd9a6" : "#f2b441",
                }}
              >
                {f.status === "live" ? "live engine" : "interactive demo"}
              </span>
            </div>
            <p className="mt-1 text-ice-dim">{f.tagline}</p>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
