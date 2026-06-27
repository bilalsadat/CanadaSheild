/** A small phone-frame used to give every demo feature a tangible screen. */
export function PhoneMock({
  title,
  lines,
  accent = "#2bd9a6",
}: {
  title: string;
  lines: string[];
  accent?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className="rounded-[34px] border-[6px] border-[#1c2c52] bg-[#070f24] p-3 shadow-2xl">
        <div className="mb-2 flex items-center justify-between px-2 text-[10px] text-ice-dim">
          <span>9:41</span>
          <span>KinShield</span>
          <span>▮▮▮</span>
        </div>
        <div className="rounded-2xl bg-[rgba(33,53,96,0.35)] p-3">
          <p className="mb-2 text-xs font-bold" style={{ color: accent }}>
            {title}
          </p>
          <div className="space-y-2">
            {lines.map((l, i) => (
              <div
                key={i}
                className="rounded-lg border border-[rgba(141,163,207,0.14)] bg-[rgba(10,20,48,0.6)] px-2.5 py-2 text-[11px] leading-snug text-ice"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
