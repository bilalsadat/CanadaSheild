import { NextResponse } from "next/server";
import { networkPlane } from "@/lib/network-plane";

/** GET /api/heatmap — city-level geo-bucketed threat intensity for the map. */
export async function GET() {
  return NextResponse.json(
    { points: networkPlane.geoBuckets(), stats: networkPlane.stats() },
    { headers: { "cache-control": "no-store" } },
  );
}
