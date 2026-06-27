/** The KinShield mark: a shield holding a family (kin) at its heart. */
export function ShieldMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ks-grad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#2bd9a6" />
          <stop offset="1" stopColor="#11a87d" />
        </linearGradient>
      </defs>
      <path
        d="M24 3 6 10v13c0 11 7.7 18.6 18 22 10.3-3.4 18-11 18-22V10L24 3Z"
        fill="rgba(43,217,166,0.10)"
        stroke="url(#ks-grad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* kin: two figures sheltered inside */}
      <circle cx="19" cy="20" r="3.1" fill="url(#ks-grad)" />
      <circle cx="29" cy="20" r="3.1" fill="url(#ks-grad)" />
      <path
        d="M13.5 31c0-3.6 2.7-6 5.5-6s5.5 2.4 5.5 6M24 31c0-3.6 2.7-6 5.5-6s5.5 2.4 5.5 6"
        stroke="url(#ks-grad)"
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <ShieldMark size={size} />
      <span className="text-lg font-bold tracking-tight text-ice">
        Kin<span className="text-safe">Shield</span>
      </span>
    </span>
  );
}
