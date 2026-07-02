"use client";

import Link from "next/link";
import { useVraiShield } from "@/lib/store";

/** Adapts the top of the landing page to the user's state. */
export function HomeBanner() {
  const ks = useVraiShield();
  if (!ks.hydrated) return null;

  if (ks.onboarded) {
    return (
      <Link
        href="/dashboard"
        className="card card-hover flex flex-wrap items-center gap-3 px-4 py-3"
        style={{ borderColor: "rgba(43,217,166,0.35)" }}
      >
        <span className="text-xl">👋</span>
        <span className="text-sm text-ice">
          Welcome back, <b>{ks.profile.name}</b> — {ks.history.length} checks ·{" "}
          {ks.household.members.length} protected.
        </span>
        <span className="ml-auto text-sm font-semibold text-safe">Open dashboard →</span>
      </Link>
    );
  }

  return (
    <Link
      href="/welcome"
      className="card card-hover flex flex-wrap items-center gap-3 px-4 py-3"
      style={{ borderColor: "rgba(43,217,166,0.35)" }}
    >
      <span className="text-xl">🛡️</span>
      <span className="text-sm text-ice">New here? Set up your Family Circle in 60 seconds — free, on-device.</span>
      <span className="ml-auto text-sm font-semibold text-safe">Get protected →</span>
    </Link>
  );
}
