# Trust Engine

The single scoring service behind every KinShield surface — and the licensable
SDK (the Bill C-15 product). Pure TypeScript, **zero framework or network
imports**: the host injects the community-intel lookup.

```ts
import { scoreTrust, explain } from "@/lib/trust-engine";

const result = scoreTrust({
  text: "INTERAC: transfer pending, accept at http://interac-secure-deposit.xyz/login",
  channel: "sms",
  language: "en",
  network,            // optional NetworkLookup (community plane)
});

explain(result); // { score, verdictLabel, actionLabel, reasons[], script }
```

## The five signal families

| Family | What it reads | Key techniques (this build) |
| --- | --- | --- |
| **content** | the message/transcript itself | multilingual scam-script DNA, pressure-language grammar (urgency/threat/secrecy/authority), extraction asks, the authority+urgency+extraction triad, long-con staging |
| **artifact** | links, domains, QR targets, recipients | lookalike & homoglyph detection vs a Canadian brand whitelist, risky TLDs, shorteners, IP-literals, credentials-in-URL, brand-off-domain, crypto-wallet recipients |
| **authenticity** | synthetic voice/video | host-supplied synthesis likelihood, folded in at **capped** confidence (detectors generalize poorly to unseen synthesis) |
| **network** | the consented community plane | reputation-decayed lookups of reported numbers / domains / handles |
| **anomaly** | per-user baseline | the three pressure questions encoded, amount spikes, large transfers to unknown recipients |

## The combiner

A transparent, **monotonic** combiner (`combiner.ts`) — the legible stand-in for
the production gradient-boosted model:

1. confidence-weighted mean risk across families (each family has a fixed,
   documented weight; authenticity and anomaly are deliberately capped);
2. a **corroboration boost** when ≥2 independent families agree — multi-signal
   fusion is the whole orchestrator thesis;
3. score = `(1 − risk) × 99 + 1` → **1 (certain fraud) … 100 (high-confidence safe)**;
4. an **uncertainty band** that widens when evidence is thin — calibrated honesty
   you can see in the dial.

Output: `trustScore`, `verdict`, recommended `action`, `uncertainty`, the top
three localized `topReasons`, the full per-signal `ledger`, and the detected
`script`.

## Why this design

- **No single detector decides.** A perfect deepfake passes the authenticity
  check but still trips content + anomaly + the procedural guardrails — the Arup
  attack's escape hatch is closed by fusion, not by a better detector.
- **Explanations are codes, not prose.** The engine emits stable reason codes +
  params; `i18n/` renders them into any language. A reason that can't be cleanly
  translated is one we shouldn't show.
- **Honesty is a property, not a slogan.** `eval/` runs the real engine over a
  labeled set to produce a live confusion matrix — misses included.

## Files

```
index.ts            scoreTrust() + explain() — the public entry
types.ts            the API contract (CheckInput / TrustResult)
combiner.ts         multi-signal fusion
signals/            the five analyzers
corpus/             scripts.ts (scam DNA) · brands.ts (whitelist + lookalike)
i18n/               explanations.ts · scripts-i18n.ts
eval/               labeled-set.ts · calibrate.ts
util.ts             normalization, URL parsing, language detection
engine.test.ts      14 tests: known scams, legit messages, network, honesty, i18n
```

Run the tests: `npm test`.
