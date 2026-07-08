"use client";

import { useState } from "react";
import { checkTrust, type CheckResponse } from "@/lib/client";
import { FeatureShell } from "@/components/FeatureShell";
import { VerdictCard } from "@/components/VerdictCard";

export default function CheckBeforeYouSendPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [story, setStory] = useState("");
  const [q1, setQ1] = useState<boolean | null>(null); // did YOU initiate contact
  const [q2, setQ2] = useState<boolean | null>(null); // have you met them
  const [q3, setQ3] = useState<boolean | null>(null); // are they rushing you
  const [data, setData] = useState<CheckResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const rushNote = q3 ? " They are rushing me and pressuring me to act now." : "";
    const metNote = q2 === false ? " I have never met this person in real life." : "";
    const res = await checkTrust({
      recipient: recipient || undefined,
      text: (story + rushNote + metNote) || "Sending money to a recipient.",
      channel: "recipient",
      context: {
        userInitiated: q1 ?? undefined,
        knownContact: q2 ?? undefined,
        amountCAD: amount ? Number(amount) : undefined,
      },
    });
    setData(res);
    setLoading(false);
  }

  const answered = q1 !== null && q2 !== null && q3 !== null && (recipient || story);

  return (
    <FeatureShell slug="check-before-you-send">
      <p className="max-w-2xl text-ice-dim">
        The 10-second habit before money moves. Run the recipient and the three pressure questions —
        the consumer half of e-Transfer defence.
      </p>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="card space-y-4 p-5">
          <Field label="Who are you sending to? (Interac handle, email, phone, or wallet)">
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. quickrefund@gmail.com or bc1qxy…"
              className="w-full rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-ice outline-none focus:border-safe"
            />
          </Field>
          <Field label="How much? (CAD)">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-ice outline-none focus:border-safe"
            />
          </Field>
          <Field label="What's the story? (optional)">
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={2}
              placeholder="e.g. My advisor says I need to pay a tax to withdraw my crypto profit"
              className="w-full resize-y rounded-lg border border-[rgba(141,163,207,0.2)] bg-[rgba(10,20,48,0.6)] px-3 py-2 text-ice outline-none focus:border-safe"
            />
          </Field>
        </div>

        <div className="card space-y-4 p-5">
          <p className="pill text-safe">The three pressure questions</p>
          <Question label="Did YOU start this contact?" value={q1} onChange={setQ1} riskyAnswer={false} />
          <Question label="Have you met this person in real life?" value={q2} onChange={setQ2} riskyAnswer={false} />
          <Question label="Are they rushing or pressuring you?" value={q3} onChange={setQ3} riskyAnswer={true} />
          <button onClick={run} disabled={!answered || loading} className="btn btn-primary w-full py-2.5 disabled:opacity-50">
            {loading ? "Checking…" : "Check before you send"}
          </button>
        </div>
      </div>

      {data && (
        <>
          {data.result.trustScore < 70 && (
            <div className="card p-4" style={{ borderColor: "#f2b44155" }}>
              <p className="text-sm text-caution">
                ⏳ <b>Cooling-off nudge:</b> take 10 minutes before sending. Real opportunities survive a
                short pause; scams are the ones that can&apos;t wait.
              </p>
            </div>
          )}
          <VerdictCard data={data} />
        </>
      )}
    </FeatureShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ice">{label}</span>
      {children}
    </label>
  );
}

function Question({
  label, value, onChange, riskyAnswer,
}: { label: string; value: boolean | null; onChange: (v: boolean) => void; riskyAnswer: boolean }) {
  return (
    <div>
      <p className="mb-1.5 text-sm text-ice">{label}</p>
      <div className="flex gap-2">
        {[true, false].map((opt) => {
          const selected = value === opt;
          const risky = selected && opt === riskyAnswer;
          return (
            <button
              key={String(opt)}
              onClick={() => onChange(opt)}
              className="flex-1 rounded-lg border px-3 py-1.5 text-sm transition"
              style={{
                borderColor: selected ? (risky ? "#ff4d6a" : "#2bd9a6") : "rgba(141,163,207,0.2)",
                background: selected ? (risky ? "rgba(255,77,106,0.12)" : "rgba(43,217,166,0.12)") : "transparent",
                color: selected ? (risky ? "#ff4d6a" : "#2bd9a6") : "#8da3cf",
              }}
            >
              {opt ? "Yes" : "No"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
