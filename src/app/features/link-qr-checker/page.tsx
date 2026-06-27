"use client";

import { useState } from "react";
import { checkTrust, type CheckResponse } from "@/lib/client";
import { FeatureShell } from "@/components/FeatureShell";
import { VerdictCard } from "@/components/VerdictCard";

const SAMPLE_QRS = [
  { label: "Parking-meter sticker", url: "https://pay-parking-on.top/city/checkout?amt=3.50" },
  { label: "Restaurant menu QR", url: "https://maple-bistro.ca/menu" },
  { label: "“CRA refund” poster", url: "http://cra-refund-gov.xyz/claim" },
];

export default function LinkQrPage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<CheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedFrom, setScannedFrom] = useState<string | null>(null);

  async function check(u = url, from: string | null = null) {
    if (!u.trim()) return;
    setLoading(true);
    setScannedFrom(from);
    const res = await checkTrust({ url: u, text: u, channel: "link" });
    setData(res);
    setLoading(false);
  }

  function simulateScan() {
    setScanning(true);
    const pick = SAMPLE_QRS[Math.floor(Math.random() * SAMPLE_QRS.length)];
    setTimeout(() => {
      setScanning(false);
      setUrl(pick.url);
      check(pick.url, pick.label);
    }, 1100);
  }

  return (
    <FeatureShell slug="link-qr-checker">
      <p className="max-w-2xl text-ice-dim">
        Paste a link or scan a QR; verdict in two seconds. Lookalike domains, homoglyphs, risky TLDs
        and brand-off-domain phishing — tuned for Canadian bank, CRA, Canada Post and marketplace
        impersonations.
      </p>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="card p-5">
          <label className="mb-1 block text-sm font-medium text-ice">Paste a link</label>
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="https://…"
              className="flex-1 rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-ice outline-none focus:border-safe"
            />
            <button onClick={() => check()} disabled={loading || !url.trim()} className="btn btn-primary px-5 disabled:opacity-50">
              {loading ? "…" : "Check"}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["https://cra-arc.gc.ca/refund", "http://interac-secure-deposit.xyz/login", "https://amaz0n-ca-refund.top/gift"].map((u) => (
              <button key={u} onClick={() => { setUrl(u); check(u); }} className="rounded-full border border-[rgba(141,163,207,0.22)] px-3 py-1 text-xs text-ice-dim hover:border-safe hover:text-safe">
                {u.length > 34 ? u.slice(0, 34) + "…" : u}
              </button>
            ))}
          </div>
        </div>

        <div className="card grid place-items-center p-5 text-center">
          <div
            className="grid h-32 w-32 place-items-center rounded-xl border-2 border-dashed"
            style={{ borderColor: scanning ? "#2bd9a6" : "rgba(141,163,207,0.3)" }}
          >
            <span className="text-4xl">{scanning ? "🟩" : "🔳"}</span>
          </div>
          <button onClick={simulateScan} disabled={scanning} className="btn btn-ghost mt-3 px-4 py-2 text-sm">
            {scanning ? "Scanning…" : "📷 Scan a QR code"}
          </button>
          <p className="mt-1 text-[11px] text-ice-dim">Simulates scanning a real-world QR poster.</p>
        </div>
      </div>

      {scannedFrom && (
        <p className="text-sm text-ice-dim">
          📷 Scanned <b className="text-ice">{scannedFrom}</b> → decoded a link and checked it:
        </p>
      )}
      {data && <VerdictCard data={data} />}
    </FeatureShell>
  );
}
