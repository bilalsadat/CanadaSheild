"use client";

import { useEffect, useRef, useState } from "react";
import type { HeatPoint } from "@/lib/geo";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Briefing & Heat Map (B1). A Google-Maps-style slippy map (Leaflet + CARTO
 * Voyager basemap) showing where threats are surging across Canada, fed by the
 * consented network plane — city-level only, k-anonymity thresholds, never PII.
 */

const CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).L) return resolve((window as any).L);
    if (!document.querySelector(`link[href="${CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS;
      document.head.appendChild(link);
    }
    const existing = document.querySelector(`script[src="${JS}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).L));
      return;
    }
    const s = document.createElement("script");
    s.src = JS;
    s.async = true;
    s.onload = () => resolve((window as any).L);
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

export default function MapPage() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [points, setPoints] = useState<HeatPoint[]>([]);
  const [stats, setStats] = useState({ artifacts: 0, totalReports: 0 });
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(false);
  const [cat, setCat] = useState<string>("All");

  // Load data.
  useEffect(() => {
    fetch("/api/heatmap")
      .then((r) => r.json())
      .then((d) => { setPoints(d.points); setStats(d.stats); })
      .catch(() => setErr(true));
  }, []);

  // Init map once.
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapEl.current || mapRef.current) return;
        const map = L.map(mapEl.current, { scrollWheelZoom: false, attributionControl: true }).setView([56.13, -96.0], 3);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
        }).addTo(map);
        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        setReady(true);
      })
      .catch(() => setErr(true));
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Category list for the filter.
  const categories = ["All", ...Array.from(new Set(points.map((p) => p.topCategory)))];
  const shown = cat === "All" ? points : points.filter((p) => p.topCategory === cat);

  // Draw markers when map + data + filter change.
  useEffect(() => {
    const L = (window as any).L;
    if (!ready || !L || !layerRef.current) return;
    layerRef.current.clearLayers();
    if (shown.length === 0) return;
    const max = Math.max(...shown.map((p) => p.reports), 1);

    for (const p of shown) {
      const intensity = p.reports / max;
      const radius = 14 + intensity * 30;
      // soft heat halo
      L.circleMarker([p.lat, p.lng], {
        radius,
        color: "transparent",
        fillColor: "#ff3b5c",
        fillOpacity: 0.12 + intensity * 0.25,
      }).addTo(layerRef.current);
      // count pin
      const pin = L.divIcon({
        className: "",
        html: `<div style="display:grid;place-items:center;width:34px;height:34px;border-radius:50%;
          background:#d81e3f;color:#fff;font:700 12px ui-sans-serif,system-ui;border:2px solid #fff;
          box-shadow:0 4px 10px rgba(0,0,0,.35)">${p.reports}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      const cats = Object.entries(p.categories).sort((a, b) => b[1] - a[1])
        .map(([c, n]) => `<div style="display:flex;justify-content:space-between;gap:12px"><span>${c}</span><b>${n}</b></div>`).join("");
      L.marker([p.lat, p.lng], { icon: pin })
        .bindPopup(
          `<div style="font:13px ui-sans-serif,system-ui;min-width:180px">
             <div style="font-weight:700;font-size:14px;margin-bottom:2px">${p.city}</div>
             <div style="color:#666;margin-bottom:6px">${p.reports} reports · ${p.artifacts} active threats</div>
             ${cats}
           </div>`,
        )
        .addTo(layerRef.current);
    }
  }, [ready, points, cat]); // eslint-disable-line react-hooks/exhaustive-deps

  const briefs = buildBriefs(shown);

  return (
    <div className="space-y-6 py-4">
      <header className="max-w-2xl">
        <span className="pill text-safe">B1 · Briefing & Heat Map</span>
        <h1 className="mt-2 text-3xl font-bold text-ice sm:text-4xl">Live threat map of Canada</h1>
        <p className="mt-2 text-ice-dim">
          Where fraud is surging right now, fed by the consented community network — city-level
          only, k-anonymity thresholds, never personal data. Tap a marker for the local breakdown.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat big={points.length.toString()} small="cities with active threat clusters" />
        <Stat big={stats.totalReports.toLocaleString()} small="community reports mapped" />
        <Stat big={stats.artifacts.toLocaleString()} small="distinct attacker artifacts" />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="rounded-full border px-3 py-1.5 text-xs transition"
            style={{
              borderColor: cat === c ? "#2bd9a6" : "rgba(141,163,207,0.22)",
              background: cat === c ? "rgba(43,217,166,0.12)" : "transparent",
              color: cat === c ? "#2bd9a6" : "#8da3cf",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden p-1.5">
        <div ref={mapEl} className="h-[58vh] min-h-[360px] w-full rounded-xl bg-[#0b1830]" />
        {err && (
          <p className="p-3 text-sm text-caution">
            Map tiles need internet access. The data below still works offline.
          </p>
        )}
      </div>

      <section>
        <h2 className="text-xl font-bold text-ice">This week&apos;s briefing</h2>
        <p className="text-sm text-ice-dim">Localized, shareable — the cards that double as organic marketing.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {briefs.map((b, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[rgba(255,77,106,0.14)] text-sm font-bold text-threat">
                  {b.reports}
                </span>
                <div>
                  <p className="font-semibold text-ice">{b.city}</p>
                  <p className="text-xs text-ice-dim">{b.lang}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-ice-dim">{b.text}</p>
            </div>
          ))}
          {briefs.length === 0 && <p className="text-sm text-ice-dim">Loading the briefing…</p>}
        </div>
      </section>
    </div>
  );
}

function buildBriefs(points: HeatPoint[]) {
  return points.slice(0, 6).map((p) => ({
    city: p.city,
    reports: p.reports,
    lang: "Surging this week",
    text: `“${p.topCategory}” is the top threat in ${p.city.split(",")[0]} this week — ${p.reports} reports across ${p.artifacts} active numbers/links. KinShield is screening it before it reaches your family.`,
  }));
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-bold text-safe">{big}</p>
      <p className="mt-0.5 text-sm text-ice-dim">{small}</p>
    </div>
  );
}
