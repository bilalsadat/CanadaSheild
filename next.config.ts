import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Trust Engine is pure TS and ships in the server bundle; the SDK
  // surface (src/lib/trust-engine) is intentionally framework-agnostic.
};

export default nextConfig;
