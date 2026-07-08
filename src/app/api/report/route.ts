import { NextResponse } from "next/server";
import { networkPlane } from "@/lib/network-plane";

/**
 * POST /api/report — consented contribution to the network plane. Only attacker
 * artifacts (numbers, domains, handles), never personal data. In production this
 * enters a human-reviewed ingestion queue before propagation; here it lands
 * directly so the demo's network effect is visible immediately.
 */
export async function POST(req: Request) {
  let body: { artifact?: string; category?: string; city?: string; language?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const artifact = (body.artifact ?? "").trim();
  if (!artifact) return NextResponse.json({ error: "missing_artifact" }, { status: 400 });

  const rec = networkPlane.report(artifact, body.category || "scam", {
    city: body.city,
    language: body.language,
  });
  return NextResponse.json({ ok: true, report: rec, stats: networkPlane.stats() });
}

export async function GET() {
  return NextResponse.json({ recent: networkPlane.recent(), stats: networkPlane.stats() });
}
