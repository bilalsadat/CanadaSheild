import type { TrustResult } from "./trust-engine";
import type { ScanDetail } from "./store";

interface RenderedLike {
  verdictLabel: string;
  actionLabel: string;
  reasons: string[];
}

/** Freeze a verdict into a storable detail so any past check can be reopened. */
export function toScanDetail(result: TrustResult, rendered: RenderedLike, fullText?: string): ScanDetail {
  return {
    verdictLabel: rendered.verdictLabel,
    actionLabel: rendered.actionLabel,
    uncertainty: result.uncertainty,
    reasons: rendered.reasons,
    ledger: result.ledger.map((l) => ({ family: l.family, risk: l.risk })),
    scriptLabel: result.detectedScript?.label,
    scriptStage: result.detectedScript?.stage,
    fullText: fullText?.slice(0, 1000),
  };
}
