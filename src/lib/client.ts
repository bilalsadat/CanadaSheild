import type { TrustResult, Language, Channel } from "@/lib/trust-engine";

export interface RenderedResult {
  score: number;
  verdict: TrustResult["verdict"];
  verdictLabel: string;
  action: TrustResult["action"];
  actionLabel: string;
  uncertainty: number;
  reasons: string[];
  script?: TrustResult["detectedScript"];
}

export interface CheckResponse {
  result: TrustResult;
  rendered: RenderedResult;
}

export interface CheckArgs {
  text?: string;
  url?: string;
  recipient?: string;
  channel?: Channel;
  language?: Language;
  context?: {
    userInitiated?: boolean;
    knownContact?: boolean;
    amountCAD?: number;
  };
}

export async function checkTrust(args: CheckArgs): Promise<CheckResponse> {
  const res = await fetch("/api/check", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error ?? `check_failed_${res.status}`);
  }
  return res.json();
}

export async function reportArtifact(args: {
  artifact: string;
  category?: string;
  city?: string;
  language?: string;
}) {
  const res = await fetch("/api/report", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(args),
  });
  return res.json();
}
