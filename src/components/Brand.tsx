/**
 * The VraiShield mark — a shield whose core is a checkmark that doubles as a
 * "V" for Vrai (true). One idea, drawn once: real, verified, protected.
 */
export function ShieldMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="vs-grad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3BE3AC" />
          <stop offset="1" stopColor="#12A87C" />
        </linearGradient>
      </defs>
      <path
        d="M24 3.5 L40.5 10 V21.5 C40.5 32.8 33.6 41.4 24 44.8 C14.4 41.4 7.5 32.8 7.5 21.5 V10 Z"
        fill="rgba(47,211,155,0.09)"
        stroke="url(#vs-grad)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M15.4 23.2 L21.6 30.4 L33 15.8"
        stroke="url(#vs-grad)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        Vrai<span className="text-safe">Shield</span>
      </span>
    </span>
  );
}
