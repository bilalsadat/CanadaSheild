"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Brand";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Protect" },
  { href: "/family", label: "Family Circle" },
  { href: "/senior", label: "Senior Mode" },
  { href: "/incident", label: "Incident Mode" },
  { href: "/community", label: "Threat Network" },
  { href: "/transparency", label: "Calibration" },
  { href: "/sdk", label: "SDK" },
];

export function SiteNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(141,163,207,0.12)] bg-[rgba(10,20,48,0.78)] backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>
        <div className="ml-auto flex items-center gap-1 overflow-x-auto">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-[rgba(43,217,166,0.14)] text-safe"
                    : "text-ice-dim hover:bg-[rgba(141,163,207,0.08)] hover:text-ice"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
