"use client";

import { useState } from "react";
import { checkTrust, reportArtifact, type CheckResponse } from "@/lib/client";
import { extractUrls } from "@/lib/trust-engine/util";
import type { Channel, Language } from "@/lib/trust-engine";
import { VerdictCard } from "./VerdictCard";
import { useVraiShield } from "@/lib/store";

const EXAMPLES: { label: string; text: string; channel: Channel }[] = [
  {
    label: "CRA arrest call",
    channel: "call_transcript",
    text: "This is the CRA. Your social insurance number has been suspended for tax fraud and an arrest warrant has been issued. Do not hang up. Pay immediately with gift cards or press 1 to speak to an officer.",
  },
  {
    label: "Interac e-transfer text",
    channel: "sms",
    text: "INTERAC: Your transfer of $250 is pending. Click to accept within 24 hours: http://interac-secure-deposit.xyz/login",
  },
  {
    label: "Canada Post fee",
    channel: "sms",
    text: "Canada Post: your parcel could not be delivered. A small customs fee is required. Reschedule: https://canadapost.delivery-fee.top/pay",
  },
  {
    label: "Pig-butchering (long con)",
    channel: "investment",
    text: "Good morning my dear ❤️ thinking of you. My mentor shared new trading signals on this exclusive platform — we can double your money. You already withdrew a profit, now just pay the small tax to withdraw the rest.",
  },
  {
    label: "A normal text",
    channel: "sms",
    text: "Hey! Are we still on for dinner at 7 tonight? Let me know 🙂",
  },
];

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "tl", label: "Tagalog" },
  { code: "ar", label: "العربية" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ko", label: "한국어" },
  { code: "pt", label: "Português" },
  { code: "hi", label: "हिन्दी" },
];

export function AskVraiShield({ senior = false }: { senior?: boolean }) {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState<Channel>("unknown");
  const [language, setLanguage] = useState<Language | "">("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reported, setReported] = useState(false);
  const { addScan } = useVraiShield();

  async function run(t = text, ch = channel) {
    if (!t.trim()) return;
    setLoading(true);
    setError(null);
    setReported(false);
    try {
      const res = await checkTrust({
        text: t,
        channel: ch,
        language: language || undefined,
      });
      setData(res);
      addScan({
        channel: ch,
        score: res.result.trustScore,
        verdict: res.result.verdict,
        snippet: t.slice(0, 80),
        scriptLabel: res.result.detectedScript?.label,
      });
      if (senior && typeof window !== "undefined" && "speechSynthesis" in window) {
        speak(res);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleReport() {
    if (!data) return;
    const urls = extractUrls(text);
    const phones = text.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) ?? [];
    const artifact = urls[0] ?? phones[0] ?? text.slice(0, 40);
    await reportArtifact({
      artifact,
      category: data.result.detectedScript?.label ?? "scam",
    });
    setReported(true);
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 sm:p-5">
        <label className={`mb-2 block font-semibold text-ice ${senior ? "text-2xl" : "text-sm"}`}>
          Paste anything — a text, email, ad, job offer, or what a caller said:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={senior ? 4 : 5}
          placeholder="e.g. “This is the CRA, your SIN is suspended…”"
          className={`w-full resize-y rounded-xl border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] p-3 text-ice outline-none placeholder:text-ice-dim focus:border-safe ${
            senior ? "text-xl" : "text-base"
          }`}
        />

        {!senior && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
              className="rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-2 py-1.5 text-sm text-ice"
            >
              <option value="unknown">Channel: auto</option>
              <option value="sms">Text / SMS</option>
              <option value="email">Email</option>
              <option value="call_transcript">Phone call</option>
              <option value="investment">Investment offer</option>
              <option value="job_offer">Job offer</option>
              <option value="link">A link</option>
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language | "")}
              className="rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-2 py-1.5 text-sm text-ice"
            >
              <option value="">Reply: auto-detect</option>
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  Reply in {l.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => run()}
            disabled={loading || !text.trim()}
            className={`btn btn-primary ${senior ? "senior-btn flex-1 text-2xl" : "px-5 py-2.5"} disabled:opacity-50`}
          >
            {loading ? "Checking…" : senior ? "Check this" : "Check it"}
          </button>
          {text && !senior && (
            <button onClick={() => { setText(""); setData(null); }} className="btn btn-ghost px-4 py-2.5 text-sm">
              Clear
            </button>
          )}
        </div>

        {!senior && (
          <div className="mt-4">
            <span className="pill text-ice-dim">Try a real example</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => { setText(ex.text); setChannel(ex.channel); run(ex.text, ex.channel); }}
                  className="rounded-full border border-[rgba(141,163,207,0.22)] bg-[rgba(141,163,207,0.06)] px-3 py-1.5 text-xs text-ice transition hover:border-safe hover:text-safe"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-threat">⚠️ {error}</p>}

      {data && (
        <>
          <VerdictCard data={data} onReport={handleReport} onIncident={() => (window.location.href = "/incident")} />
          {reported && (
            <p className="text-sm text-safe">
              ✓ Reported to the Community Threat Network. Within minutes this protects other
              Canadians from the same attacker.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function speak(res: CheckResponse) {
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const localeMap: Record<string, string> = {
      en: "en-CA", fr: "fr-CA", pa: "pa-IN", zh: "zh-CN", es: "es-ES", tl: "fil-PH",
      ar: "ar-SA", vi: "vi-VN", ko: "ko-KR", pt: "pt-BR", hi: "hi-IN",
    };
    const u = new SpeechSynthesisUtterance(
      `${res.rendered.verdictLabel}. Trust score ${res.result.trustScore} out of 100. ${res.rendered.actionLabel}. ${res.rendered.reasons[0] ?? ""}`,
    );
    u.lang = localeMap[res.result.language] ?? "en-CA";
    u.rate = 0.95;
    synth.speak(u);
  } catch {
    /* speech is best-effort */
  }
}
