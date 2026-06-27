"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const TABS = [
  { href: "/", label: "Protect", icon: "🛡️" },
  { href: "/features", label: "Features", icon: "🧩" },
  { href: "/map", label: "Map", icon: "🗺️" },
  { href: "/dashboard", label: "Me", icon: "📊" },
];

const MORE = [
  { href: "/family", label: "Family Circle", icon: "👪" },
  { href: "/senior", label: "Senior Mode", icon: "🧓" },
  { href: "/incident", label: "Incident Mode", icon: "🆘" },
  { href: "/community", label: "Threat Network", icon: "🌐" },
  { href: "/alerts", label: "Alerts", icon: "🔔" },
  { href: "/transparency", label: "Calibration", icon: "📈" },
  { href: "/sdk", label: "For Business (SDK)", icon: "🏦" },
  { href: "/settings", label: "Settings & Privacy", icon: "⚙️" },
];

export function MobileTabBar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-[rgba(141,163,207,0.2)] bg-navy-2 p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[rgba(141,163,207,0.4)]" />
            <div className="grid grid-cols-2 gap-2">
              {MORE.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-[rgba(141,163,207,0.16)] bg-[rgba(10,20,48,0.5)] p-3 text-sm text-ice"
                >
                  <span className="text-lg">{m.icon}</span>
                  {m.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(141,163,207,0.16)] bg-[rgba(10,20,48,0.92)] backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-md items-stretch">
          {TABS.map((t) => {
            const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
            return (
              <Link key={t.href} href={t.href} className="flex flex-1 flex-col items-center gap-0.5 py-2.5">
                <span className="text-lg" style={{ opacity: active ? 1 : 0.6 }}>{t.icon}</span>
                <span className="text-[10px]" style={{ color: active ? "#2bd9a6" : "#8da3cf" }}>{t.label}</span>
              </Link>
            );
          })}
          <button onClick={() => setOpen(true)} className="flex flex-1 flex-col items-center gap-0.5 py-2.5">
            <span className="text-lg opacity-60">☰</span>
            <span className="text-[10px] text-ice-dim">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
