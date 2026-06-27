import { VERDICT_STYLE, scoreToVerdict } from "./verdict-style";

/**
 * The Trust Score dial — the product's vocabulary, made visual. A 1–100 ring
 * with the score, plus a thin uncertainty arc that literally shows how sure we
 * are (calibrated honesty you can see). Higher score = safer.
 */
export function TrustDial({
  score,
  uncertainty = 0,
  size = 176,
}: {
  score: number;
  uncertainty?: number;
  size?: number;
}) {
  const stroke = 12;
  const r = (size - stroke) / 2 - 6;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const style = VERDICT_STYLE[scoreToVerdict(score)];
  const frac = Math.max(0, Math.min(1, score / 100));
  const dash = c * frac;

  // Uncertainty band drawn as a faint arc straddling the score position.
  const bandFrac = Math.min(1, Math.max(0, uncertainty / 100));

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={cx} cy={cx} r={r} stroke="rgba(141,163,207,0.16)" strokeWidth={stroke} fill="none" />
        {/* uncertainty band (drawn under the score arc) */}
        {uncertainty > 0 && (
          <circle
            cx={cx}
            cy={cx}
            r={r}
            stroke={style.color}
            strokeOpacity={0.18}
            strokeWidth={stroke + 8}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${c * bandFrac} ${c}`}
            strokeDashoffset={-Math.max(0, dash - (c * bandFrac) / 2)}
          />
        )}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke={style.color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ filter: `drop-shadow(0 0 10px ${style.glow})`, transition: "stroke-dasharray 0.7s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute grid place-items-center text-center">
        <span className="text-5xl font-bold tabular-nums" style={{ color: style.color }}>
          {score}
        </span>
        <span className="pill mt-0.5 text-ice-dim">Trust Score</span>
        {uncertainty > 0 && (
          <span className="mt-1 text-xs text-ice-dim">± {uncertainty}</span>
        )}
      </div>
    </div>
  );
}
