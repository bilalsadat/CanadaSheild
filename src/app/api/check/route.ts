import { NextResponse } from "next/server";
import { scoreTrust, explain, type CheckInput, type Language } from "@/lib/trust-engine";
import { networkPlane } from "@/lib/network-plane";

/**
 * POST /api/check — the single scoring endpoint behind every surface and the
 * public shape of the licensed Trust Engine API (the Bill C-15 product). The
 * network plane is injected here; the engine itself stays pure.
 */
export async function POST(req: Request) {
  let body: Partial<CheckInput> & { language?: Language };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const input: CheckInput = {
    text: typeof body.text === "string" ? body.text.slice(0, 8000) : undefined,
    url: typeof body.url === "string" ? body.url.slice(0, 2048) : undefined,
    recipient: typeof body.recipient === "string" ? body.recipient.slice(0, 256) : undefined,
    channel: body.channel,
    language: body.language,
    context: body.context,
    network: networkPlane,
  };

  if (!input.text && !input.url && !input.recipient) {
    return NextResponse.json({ error: "empty_input" }, { status: 400 });
  }

  const result = scoreTrust(input);
  const rendered = explain(result);

  return NextResponse.json({ result, rendered }, { headers: { "cache-control": "no-store" } });
}
