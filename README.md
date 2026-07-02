# VraiShield (formerly KinShield)

**The orchestration layer for fraud defence in Canada.** One Trust Score behind
every channel, built for the household, fluent in the languages where Canadian
losses concentrate — and honest, by engineering discipline, about exactly what
it can and can't do.

> Detection is becoming a commodity. Judgment, family context, Canadian context,
> and recovery are not. VraiShield wins the race nobody is running: the
> orchestration layer above Apple, Google, Norton, McAfee and the enterprise
> labs.

## Two apps, one brain

| | Where | Run it |
| --- | --- | --- |
| **📱 Native iPhone app** (`mobile/`) | Expo SDK 54 · React Native · runs in **Expo Go** on your iPhone | [`mobile/HOW-TO-RUN-IPHONE.md`](mobile/HOW-TO-RUN-IPHONE.md) |
| **🖥️ Web app / PWA** (repo root) | Next.js · also installable to a phone home screen | [`HOW-TO-RUN.md`](HOW-TO-RUN.md) |

Both share the same pure-TypeScript **Trust Engine** (`src/lib/trust-engine`,
copied into `mobile/lib/trust-engine`) — five signal families, the Canadian
scam-script corpus, twelve languages, the transparent combiner. In the native
app it runs **fully on-device**.

The native app is the flagship: a professional dark design system (vector icons,
restrained palette, real typography), a bottom **tab bar** (Dashboard · Protect ·
Map · Family · Features), a **main Dashboard** that summarises everything, and a
native **Apple-Maps** threat map. Verified to bundle cleanly for iOS.

This repository is a **working reference build** of that thesis: a real,
runnable Trust Engine (the licensable "brain") wired into the consumer surfaces
that make up the MVP wedge.

---

## What's actually in here (and working)

| Piece | What it is | Status |
| --- | --- | --- |
| **Trust Engine** (`src/lib/trust-engine`) | The scoring brain. Five signal families fused into a 1–100 Trust Score + top-3 reasons + the full reasoning ledger. Pure TypeScript, framework-agnostic — it *is* the SDK. | ✅ live, unit-tested |
| **Ask VraiShield** (`/`) | Paste anything → verdict, in your language, in milliseconds. The real engine runs in the browser/server. | ✅ |
| **SMS / Link forensics** | Lookalike domains, homoglyphs, risky TLDs, brand-off-domain phishing, crypto-recipient detection. | ✅ |
| **Family Circle** (`/family`) | The household graph, shared policies, cross-platform alert feed — the retention moat. | ✅ |
| **Senior Mode** (`/senior`) | The four-button, 36pt+, voice-first alternate presentation layer. Verdicts spoken aloud (Web Speech API). | ✅ |
| **Incident Mode** (`/incident`) | The guided "first hours" recovery checklist with scripted bank calls and the recovery-scam pre-arm. | ✅ |
| **Community Threat Network** (`/community`) | Consented, pseudonymized artifact reporting with reputation decay — a live network effect feeding the engine. | ✅ |
| **Calibration** (`/transparency`) | Precision/recall/F1 **computed live in your browser** over an open labeled set, misses included. The honesty moat, made real. | ✅ |
| **SDK** (`/sdk`) | The Bill C-15 institutional product: API contract, control kit, compliance artifacts. | ✅ (docs surface) |
| **Feature catalogue** (`/features`) | All **30** features from the master doc — engine-backed where possible, faithful interactive demos otherwise. Each is reachable and labelled live/demo. | ✅ |
| **Live Threat Map** (`/map`) | A Google-Maps-style heat map of Canada (Leaflet + CARTO), fed by the consented network plane, with category filters and the weekly Briefing. | ✅ |
| **Onboarding + Dashboard** (`/welcome`, `/dashboard`) | A real account/household setup wizard and a personalized protection center: posture score, 7-day activity, recent checks, alerts — all persisted on-device. | ✅ |
| **Settings & Privacy** (`/settings`) | The split-plane privacy dashboard, language/Senior-Mode toggles, plan, and one-tap data export/delete. | ✅ |
| **Installable PWA** | manifest + service worker + offline page — add VraiShield to your phone's home screen and it runs like a native app. | ✅ |
| **12 languages** | Detection + verdict/action labels across English, Quebec French, Punjabi, Mandarin/Cantonese, Spanish, Tagalog, Arabic, Vietnamese, Korean, Portuguese, Hindi (EN/FR/PA/ZH validated; rest seed — see `/transparency`). | ✅ |

> **Just want to run it (incl. installing on your phone)?** See [`HOW-TO-RUN.md`](HOW-TO-RUN.md).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Trust Engine unit + calibration tests (vitest)
npm run build      # production build
```

Try the live demo at `/`, or hit the API directly:

```bash
curl -s localhost:3000/api/check -H 'content-type: application/json' -d '{
  "text": "This is the CRA, your SIN is suspended, pay with gift cards immediately",
  "channel": "call_transcript"
}' | jq .result
# => trustScore: 1, verdict: "dangerous", detectedScript: "cra_arrest"
```

---

## Architecture — the split data-plane

VraiShield's core promise: *"What's yours, we cannot read. What's the scammer's,
we share to protect everyone."*

- **Personal plane** — everything that is the user's (transcripts, evidence,
  family graph). In production: client-side E2EE (libsodium / XChaCha20), keys
  from Argon2id, social recovery via family key-shares, server-side compute only
  in Nitro Enclaves. *In this build the engine never persists user content; only
  attacker artifacts enter the network store.*
- **Network plane** (`src/lib/network-plane.ts`) — only attacker artifacts
  (numbers, domains, scripts), consented and reputation-decayed. This trains the
  models and powers the SDK feed.

### The Trust Engine

```
CheckInput ──► [ content ] ─┐
               [ artifact ] ─┤
               [ authenticity ]─┼──► combiner ──► TrustResult
               [ network ] ─┤        (multi-signal fusion,      (1–100 score,
               [ anomaly ] ─┘         corroboration boost,       verdict, action,
                                      uncertainty band)          ledger, reasons)
```

Five signal families, one transparent monotonic combiner (the legible stand-in
for the production gradient-boosted model), localized explanations in EN / FR /
PA / ZH. No single detector decides the verdict — which is why a *perfect*
deepfake still can't win alone (the Arup failure mode their architecture can't
escape). See [`src/lib/trust-engine/README.md`](src/lib/trust-engine/README.md).

---

## Claims discipline (the moat that costs nothing)

Everything here follows the integrity standard from the master document:

- The Trust Engine is a **transparent rule corpus** that *seeds* the production
  multilingual model — kept legible on purpose so calibration can be published
  with receipts. The `/transparency` page computes real precision/recall live,
  failures included.
- Languages are marked **validated** vs **seed**. A language is only *claimed*
  when paid native speakers certify it. Punjabi/Mandarin here are seed quality.
- Authenticity is always a probability with stated uncertainty, capped in
  weight, never a bare verdict.
- No invented accuracy numbers, no "we stop every scam call," no insurance
  promises.

## Production migration notes

This reference build is TypeScript end-to-end so it runs anywhere in one
command. The master spec's production stack adds: native Swift/Kotlin for the
OS message/call hooks, Go services, Postgres+pgvector / graph DB, a CPaaS
telephony layer for the VraiShield Line, and PyTorch-trained on-device models
that the rule corpus here seeds and supervises.

---

## Repository layout

```
src/
  app/                     Next.js App Router — every surface
    api/check  api/report  the scoring + reporting endpoints (= the SDK shape)
  components/              TrustDial, VerdictCard, AskVraiShield, …
  lib/
    trust-engine/          THE BRAIN (pure TS, the SDK)
      signals/             content · artifact · authenticity · network · anomaly
      corpus/              Canadian scam-script DNA + brand whitelist
      i18n/                localized explanations (EN/FR/PA/ZH)
      eval/                labeled set + live calibration harness
    network-plane.ts       consented community-intel store (demo)
"Information Deck.js"       the original pptxgen pitch deck (preserved)
```

Built in Canada. Data resident in `ca-central-1`.
