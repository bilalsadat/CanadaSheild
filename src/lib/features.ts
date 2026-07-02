/**
 * The full A-to-Z catalogue — all 30 features from the master document.
 *
 * `status`:
 *   "live"  — wired to the real Trust Engine / interactive logic in this build
 *   "demo"  — a faithful interactive mock with sample data (clearly labelled),
 *             standing in for capabilities that need native OS hooks, telephony,
 *             or partner integrations in production
 *
 * Every feature is reachable. `href` points to a bespoke page when one exists,
 * otherwise to the data-driven /features/[slug] page.
 */

export type FeatureStatus = "live" | "demo";
export type Phase = "P0" | "P1" | "P2";

export interface Feature {
  id: string;
  slug: string;
  name: string;
  icon: string;
  phase: Phase;
  pillar: string;
  star?: boolean; // no consumer competitor offers it today
  status: FeatureStatus;
  tagline: string;
  what: string;
  how: string[];
  beats: string;
  /** For demo pages: a short scripted "screen" to render in a phone frame. */
  mock?: { kind: "transcript" | "list" | "stat"; lines: string[] };
  /** If true, the dynamic page embeds the real Ask-style engine checker. */
  engineDemo?: boolean;
  href?: string;
}

export const PILLARS: string[] = [
  "Detect & Decide",
  "Calls & Voice",
  "Family & Seniors",
  "Money & Business",
  "Privacy & Exposure",
  "When It Goes Wrong",
  "Community & Intel",
];

export const FEATURES: Feature[] = [
  // ---------------- Detect & Decide ----------------
  {
    id: "T1", slug: "trust-engine", name: "Trust Engine & Trust Score", icon: "🧠", phase: "P0", pillar: "Detect & Decide", star: true, status: "live",
    tagline: "One 1–100 score behind every surface.",
    what: "The brain. Every check on every channel returns one Trust Score with the top three reasons, localized — the product's vocabulary and the SDK's API contract.",
    how: ["Five signal families: content, artifact, authenticity, network, anomaly", "Transparent monotonic combiner with multi-signal corroboration", "Per-language calibration; full decision logging for the public report"],
    beats: "McAfee's “96%” and the whole industry's accuracy theatre — by publishing calibration with receipts.",
    href: "/transparency",
  },
  {
    id: "A1", slug: "ask-vraishield", name: "Ask VraiShield", icon: "💬", phase: "P0", pillar: "Detect & Decide", star: true, status: "live",
    tagline: "Paste anything → verdict in seconds.",
    what: "The universal verdict box: paste, share, forward, photograph or dictate anything and get a Trust Score, the top three reasons, and a recommended action in your language.",
    how: ["Multimodal: OCR → language ID → Trust Engine → localized action buttons", "Proactive — offers a check when any shield sees something odd", "Conversation memory per thread"],
    beats: "Norton Genie and Bitdefender Scamio — their best feature, made proactive, multilingual, Canadian, wired to actions.",
    engineDemo: true, href: "/",
  },
  {
    id: "S2", slug: "sms-shield", name: "SMS / RCS Shield", icon: "📨", phase: "P0", pillar: "Detect & Decide", status: "live",
    tagline: "Scam texts filtered before the inbox.",
    what: "The wedge. Smishing is the highest-volume scam channel in Canada and the one the OS fully permits a third party to defend. It headlines the MVP.",
    how: ["On-device multilingual classifier (privacy + iOS extension sandbox)", "URL extraction into the Link Checker", "One-tap report into the community network"],
    beats: "Google Messages / Apple filtering — beaten on Canadian patterns, twelve languages, and the report-to-protect-everyone loop.",
  },
  {
    id: "L1", slug: "link-qr-checker", name: "Link & QR Checker", icon: "🔗", phase: "P0", pillar: "Detect & Decide", status: "live",
    tagline: "Paste or scan; verdict in two seconds.",
    what: "Share-sheet on both platforms, an in-app QR scanner with verdict overlay, and a browser extension tuned for Canadian bank, CRA, IRCC, Canada Post and marketplace impersonations.",
    how: ["Domain age/WHOIS + certificate-transparency + homoglyph detection", "Canadian brand whitelist; sandboxed render preview", "Confidence-scored verdicts"],
    beats: "Norton Safe Web / McAfee WebAdvisor — matched, plus Canadian tuning and QR-native UX.",
  },
  {
    id: "V1", slug: "verifyca", name: "VerifyCA", icon: "🏛️", phase: "P1", pillar: "Detect & Decide", star: true, status: "demo",
    tagline: "Check offers against Canadian registries.",
    what: "Two-second verification against the institutions scammers impersonate: investments checked against the CSA registration search and provincial regulators; job offers against corporate registries.",
    how: ["Registry API/scraper layer with freshness monitoring", "Entity resolution across registries (the hard part)", "Newcomer-language explanations of exactly what's wrong"],
    beats: "Nobody — no global product will integrate thirteen Canadian provincial regulators. Newcomer's Day-1 install.",
  },
  {
    id: "M2", slug: "multilingual-defense", name: "Multilingual Defense", icon: "🌐", phase: "P0", pillar: "Detect & Decide", star: true, status: "live",
    tagline: "Twelve languages where losses concentrate.",
    what: "Detection, explanations, UI, screening personas and Senior Mode voice in the twelve languages where Canadian losses actually concentrate — each shipped only when paid native speakers validate it.",
    how: ["Whisper-class multilingual ASR", "Per-language scam-script corpora with settlement-agency partners", "Localization pipeline with human QA gates"],
    beats: "Every single competitor — all are English-first. This is where the market is undefended.",
    href: "/transparency",
  },
  {
    id: "Z1", slug: "zero-day-signals", name: "Zero-Day Anomaly Signals", icon: "📡", phase: "P1", pillar: "Detect & Decide", status: "demo",
    tagline: "The net under the nets.",
    what: "Per-user baselines — typical callers, transfer patterns, message rhythms — so a brand-new scam nobody has labelled still trips an alarm by being abnormal for this user.",
    how: ["Per-user isolation-forest baselines (on-device where possible)", "Anomaly score feeds the Trust Engine", "Weekly self-supervised recalibration"],
    beats: "Pattern-matching incumbents' structural blind spot — the documented failure of detectors on unseen attacks.",
    mock: { kind: "list", lines: ["Baseline: you usually transact < $400, daytime, to 6 saved payees", "⚠ New: $4,200 to an unsaved recipient at 11:47pm", "Anomaly score 0.71 → folded into Trust Score", "Result: flagged for a second look even with no known script"] },
  },

  // ---------------- Calls & Voice ----------------
  {
    id: "C1", slug: "call-line", name: "The VraiShield Line", icon: "📞", phase: "P1", pillar: "Calls & Voice", star: true, status: "demo",
    tagline: "An AI receptionist that judges, not just answers.",
    what: "Unknown callers are conditionally forwarded to VraiShield's cloud voice layer, where a selectable AI persona answers, runs synthesis + script analysis, then patches through with a green badge, warns, or blocks — per family policy. Works on every handset.",
    how: ["CPaaS media streams → streaming ASR → Trust Engine → policy engine", "Warm-transfer with whisper announcement", "Dual-CPaaS failover; per-account minute budgets"],
    beats: "Apple/Google native screening (judgment vs reception), Hiya (consumer-owned vs carrier-locked), Robokiller/YouMail.",
  },
  {
    id: "C2", slug: "caller-intelligence", name: "Caller Intelligence", icon: "🆔", phase: "P0", pillar: "Calls & Voice", status: "demo",
    tagline: "Before the phone even rings.",
    what: "VraiShield's iOS Live Caller-ID extension and Android call-screening role label, silence or block flagged numbers using the network plane — with private lookups.",
    how: ["Sanctioned OS extension APIs on both platforms", "Bloom-filter local cache + private lookup service", "STIR/SHAKEN attestation surfaced as a visible badge"],
    beats: "Truecaller's core caller-ID value, through privacy-preserving OS channels with consent-clean data.",
    mock: { kind: "list", lines: ["📵 +1 604-555-0147  →  ⛔ Likely scam (22 community reports)", "Attestation: ❌ failed — likely spoofed", "Action taken: silenced before ring", "✅ +1 416-555-0199  →  Verified by carrier"] },
  },
  {
    id: "A2", slug: "assist-mode", name: "Assist Mode", icon: "🎧", phase: "P0", pillar: "Calls & Voice", star: true, status: "live",
    tagline: "Live, on-device coaching during a call.",
    what: "Tap Assist and put the call on speaker; the app analyses the audible audio entirely on-device and coaches in real time — “This matches the CRA-arrest script. Do not give the code.”",
    how: ["On-device streaming transcription → distilled script classifier", "Guidance overlay + spoken prompts for Senior Mode", "Zero network dependency in the hot path (one-party consent lawful)"],
    beats: "Google's mid-call scam alerts — matched, beaten on languages, on every handset, and on what happens after the warning.",
  },
  {
    id: "V2", slug: "voice-lock", name: "Voice Lock", icon: "🔐", phase: "P1", pillar: "Calls & Voice", status: "demo",
    tagline: "Family voiceprints, used where the OS allows.",
    what: "When a “family member” makes a request through the app, VraiShield verifies the voice against an enrolled, encrypted embedding — never raw audio; quarterly re-enrollment; Quebec CAI biometric declaration before Quebec launch.",
    how: ["ECAPA-TDNN-class speaker embeddings on-device", "Liveness challenge (prompted phrase) + anti-replay", "Enrollment UX designed for seniors"],
    beats: "Pindrop's voice authentication — brought to families at consumer price, with biometric compliance built in.",
  },
  {
    id: "H1", slug: "honeypot", name: "Honeypot Decoy Line", icon: "🍯", phase: "P2", pillar: "Calls & Voice", star: true, status: "demo",
    tagline: "The app that fights back.",
    what: "Numbers reported by multiple users get engaged by decoy AI personas — confused, slow, endlessly polite — wasting scammer hours and harvesting scripts into the network plane. Never uses a user's cloned voice; launches only behind counsel review.",
    how: ["CPaaS decoy DIDs → conversational agent with persona library", "Forensic recording on our own consent footing", "Extraction pipeline into the corpus — the legal data flywheel"],
    beats: "Robokiller's answer-bots, modernized — and a brand story no incumbent's legal team will approve.",
  },

  // ---------------- Family & Seniors ----------------
  {
    id: "F1", slug: "family-circle", name: "Family Circle", icon: "👪", phase: "P0", pillar: "Family & Seniors", star: true, status: "live",
    tagline: "The household is the unit of protection.",
    what: "Paired accounts: adult children see flagged events on a parent's line, set screening policies, get alerts on low scores and large transfers, across provinces and platforms. Up to 12 members; the senior never manages a password.",
    how: ["Household graph + role/permission model", "Policy engine consumed by the Line and all shields", "Audited approval log on the personal plane"],
    beats: "Every competitor — none has a multi-generational protection graph. The moat that compounds.",
    href: "/family",
  },
  {
    id: "SM", slug: "senior-mode", name: "Senior Mode", icon: "🧓", phase: "P0", pillar: "Family & Seniors", star: true, status: "live",
    tagline: "Four buttons, 36pt, voice-first.",
    what: "Not a feature — a complete alternate presentation layer that every feature renders into: four buttons, big type, verdicts spoken aloud, in twelve languages. If it doesn't work for a 78-year-old in Punjabi, it isn't done.",
    how: ["Four-button home: Help · Family · Check Call · Check Message", "Spoken verdicts via the device speech engine", "Co-designed with a seniors' organization"],
    beats: "Every competitor's one-size UI. Accessibility as a wedge, not an afterthought.",
    href: "/senior",
  },
  {
    id: "S1", slug: "scam-drill", name: "Scam Drill", icon: "🎯", phase: "P1", pillar: "Family & Seniors", star: true, status: "live",
    tagline: "Inoculation, built for families.",
    what: "Opt-in monthly simulations: a realistic (revealed-after) scam text or test call; whoever spots it gets the points. Builds the reflex no warning banner can — scam literacy as a household habit.",
    how: ["Template library mirroring the live corpus (sanitized)", "Immediate reveal-and-teach screens", "Household scoreboard; strict ethics rails — never real fear hooks"],
    beats: "Nobody — consumer scam inoculation does not exist. Cheap, sticky, viral.",
  },
  {
    id: "B1", slug: "briefing-heatmap", name: "Briefing & Heat Map", icon: "🗺️", phase: "P1", pillar: "Family & Seniors", status: "live",
    tagline: "Where threats are surging, near you.",
    what: "A weekly localized threat briefing and a live community heat map: “Three deepfake-CRA waves hit Surrey this week; the Canada-Post-duty text is surging in Quebec French.”",
    how: ["Aggregation over the network plane → geo-bucketed (city-level, k-anonymity)", "Templated multilingual briefs → push + in-app + email", "Shareable cards that double as organic marketing"],
    beats: "Truecaller's community data — with consent-clean sourcing and Canadian locality theirs can't match.",
    href: "/map",
  },

  // ---------------- Money & Business ----------------
  {
    id: "C3", slug: "check-before-you-send", name: "Check Before You Send", icon: "💸", phase: "P1", pillar: "Money & Business", star: true, status: "live",
    tagline: "The 10-second habit before money moves.",
    what: "Run the recipient (email, phone, Interac handle, wallet) and the story through VraiShield: recipient risk + the three pressure questions + a cooling-off nudge.",
    how: ["Recipient lookup across community reports, CAFC alerts, crypto-intel", "Structured questionnaire → verdict", "Optional family ping for large amounts"],
    beats: "Nobody — no consumer product checks an Interac recipient today. Category-creating.",
  },
  {
    id: "W1", slug: "wire-guard", name: "Wire Guard (SMB)", icon: "🏦", phase: "P2", pillar: "Money & Business", star: true, status: "demo",
    tagline: "The Arup-killer for small business.",
    what: "Any wire or payment-instruction change above a threshold requires out-of-band release: a 5-second video selfie + spoken rotating codeword + voice match. The deepfake on the Zoom call can be perfect; it still can't pass the channel it doesn't control.",
    how: ["Multi-factor release ceremony (Voice Lock + face liveness + codeword)", "Policy engine per org → webhook listeners", "Signed, audited approval log; finance-team admin console"],
    beats: "Pindrop (bank-only) and every deepfake detector — procedure beats detection when detection can be fooled.",
  },
  {
    id: "M1", slug: "meeting-assist", name: "Meeting Assist", icon: "🎥", phase: "P2", pillar: "Money & Business", star: true, status: "demo",
    tagline: "A second opinion on high-stakes video calls.",
    what: "With explicit consent it watches the meeting window and flags visual-artifact anomalies, lip-sync inconsistency, and the procedural guardrail that actually stops the attack: new payee + urgency on a video call → out-of-band Wire Guard required.",
    how: ["Sanctioned screen-capture APIs with visible consent", "Frame sampling → detection ensemble → unobtrusive flags", "Advisory flags, never verdicts — honest about detector limits"],
    beats: "Pindrop's meeting product — at consumer/SMB price, cross-platform, and honest where they sell certainty.",
    mock: { kind: "list", lines: ["🎥 Live meeting · screen-capture consent ON", "⚠ Lip-sync inconsistency: 0.62 (advisory)", "⚠ Visual artifact near jawline (advisory)", "🛑 New payee + urgency detected on call", "→ Out-of-band Wire Guard verification required"] },
  },
  {
    id: "K1", slug: "sdk", name: "VraiShield SDK", icon: "🧩", phase: "P1", pillar: "Money & Business", star: true, status: "live",
    tagline: "The same brain, licensed — the Bill C-15 product.",
    what: "Trust Engine API, a customer-facing control kit mapping to Bill C-15's express-consent and limit requirements, the threat-intel feed with Canadian residency, and an FCAC reporting pipeline.",
    how: ["GraphQL/REST gateway + tenant isolation", "Embeddable white-label UI kit; per-check metering + SLAs", "Compliance artifact pack (B-13, SOC 2, residency)"],
    beats: "Pindrop's enterprise position — attacked from below with consumer-proven detection and prices credit unions can sign.",
    href: "/sdk",
  },
  {
    id: "I2", slug: "insurance", name: "Insurance Benefit", icon: "🛡️", phase: "P2", pillar: "Money & Business", status: "demo",
    tagline: "Pre-evidenced claims, designed to be fast.",
    what: "A fraud-reimbursement benefit on paid tiers with an established Canadian insurer: realistic caps, claims pre-evidenced by Incident Mode's captured record. Never marketed as “instant” or “no proof of loss”.",
    how: ["Underwriter/MGA partnership (the long pole)", "Claims API integrated with Incident Mode evidence", "Actuarial reporting from detection telemetry lowers premiums over time"],
    beats: "Aura's insurance — rebuilt for Canada with pre-evidenced claims they can't replicate without our detection layer.",
    mock: { kind: "list", lines: ["Family tier benefit: up to $10,000 CAD", "Claim #KS-4471 — pre-filled from Incident Mode evidence", "Status: under review · designed to be fast", "Evidence: 7 timestamped, hashed artifacts attached"] },
  },

  // ---------------- Privacy & Exposure ----------------
  {
    id: "Z2", slug: "zk-vault", name: "Zero-Knowledge Vault", icon: "🗝️", phase: "P0", pillar: "Privacy & Exposure", star: true, status: "demo",
    tagline: "We hold ciphertext we cannot read.",
    what: "Voiceprints, transcripts, evidence and the family graph are encrypted on the device before storage — VraiShield's servers hold ciphertext, verified by a published external audit. Even a subpoena yields nothing readable.",
    how: ["libsodium client-side crypto → Argon2id key derivation", "Shamir-style family recovery shares (Grandma is never locked out)", "Nitro Enclave compute for rare server-side ops"],
    beats: "Truecaller, Norton, McAfee, Aura — every data-hungry incumbent, beaten by an architecture their business models forbid.",
    mock: { kind: "list", lines: ["🔒 Voiceprints · transcripts · evidence · family graph", "Encrypted on-device (XChaCha20) before upload", "Server holds: ▒▒▒▒ ciphertext — unreadable", "Recovery: 3-of-5 family key shares · Grandma never locked out", "External crypto audit: published ✓"] },
  },
  {
    id: "E2", slug: "exposure-sweep", name: "Exposure Sweep", icon: "🧹", phase: "P1", pillar: "Privacy & Exposure", status: "demo",
    tagline: "What scammers know about you, shut down.",
    what: "Breached-credential checks, Canadian data-broker scans with statutory deletion demands filed under PIPEDA and Law 25 (not polite opt-outs), a social-oversharing audit, and Shadow Contacts that burn in one tap.",
    how: ["Breach-intel feeds → broker scrapers + legal-demand templating", "Findings feed the Trust Engine (“this phish knows your bank because of the 2023 breach”)", "Monthly re-sweep scheduling"],
    beats: "Incogni/DeleteMe (legal teeth + closed loop into detection) and Cloaked (masking where it works).",
  },
  {
    id: "P1", slug: "passkey-coach", name: "Passkey & Hardening Coach", icon: "🦾", phase: "P1", pillar: "Privacy & Exposure", status: "live",
    tagline: "Prevention's unglamorous half, gamified.",
    what: "A guided hardening program — passkeys, 2FA upgrades, bank alerts, SIM-swap protections, recovery-contact hygiene — with a household “hardening score” the Family Circle can see.",
    how: ["Curated playbooks per institution/carrier → progress tracking", "Deep links into settings flows", "Ties into Exposure Sweep findings"],
    beats: "Norton/McAfee's “security score” gimmicks — made actionable, Canadian, and family-visible.",
  },

  // ---------------- When It Goes Wrong ----------------
  {
    id: "I1", slug: "incident-mode", name: "Incident Mode", icon: "🆘", phase: "P0", pillar: "When It Goes Wrong", star: true, status: "live",
    tagline: "The panic button competitors forgot.",
    what: "A guided flow that compresses the catastrophic first hours: triage without blame, evidence capture, pre-filled CAFC and police reports, scripted bank calls, fraud-alert walkthroughs, and a recovery-scam warning.",
    how: ["Flow engine + institution playbook library", "Evidence vault (personal plane) → deep links + pre-filled forms", "Scheduled follow-ups; family alert integration"],
    beats: "Aura's restoration support — localized to Canadian institutions and triggered in seconds.",
    href: "/incident",
  },
  {
    id: "C5", slug: "crisis-vault", name: "Crisis Vault", icon: "🚨", phase: "P1", pillar: "When It Goes Wrong", star: true, status: "demo",
    tagline: "Sextortion: the four hours that decide everything.",
    what: "One tap: evidence-based de-escalation (“they almost never leak; do not pay”), evidence preservation, NCMEC Take-It-Down / StopNCII hash-based removal, guided platform reporting, silent trusted-contact alert, and follow-up check-ins.",
    how: ["Crisis flow engine → encrypted evidence capture (chain-of-custody)", "TakeItDown/StopNCII API integrations", "Scripts vetted with mental-health partners; safeguarding review gates"],
    beats: "Nobody addresses the first hours of sextortion. Parents buy the Family tier for this alone.",
  },
  {
    id: "R1", slug: "recovery-line", name: "Recovery Line (human)", icon: "🫂", phase: "P1", pillar: "When It Goes Wrong", star: true, status: "demo",
    tagline: "A trained human, in your language.",
    what: "When the worst happens, a trauma-informed Canadian walks the family through the steps, joins three-way calls with bank fraud departments so the victim never repeats the story, and runs weekly check-ins for three months.",
    how: ["Hiring/training pipeline; QA'd multilingual scripts", "Scheduling + case management integrated with Incident Mode", "Strict access controls — agents see only what the user shares"],
    beats: "Aura/Norton's call-centre restoration — with languages, Canadian institutions, and a relationship instead of a ticket.",
    mock: { kind: "list", lines: ["Your advocate: Mei — speaks English, Cantonese, Mandarin", "Next 3-way call with TD Fraud: today 4:30pm", "Case #KS-2231 · week 1 of 12", "Weekly check-in scheduled · you never repeat the story"] },
  },
  {
    id: "L2", slug: "long-con-radar", name: "Long-Con Radar", icon: "🕰️", phase: "P1", pillar: "When It Goes Wrong", star: true, status: "live",
    tagline: "For the scams that take weeks.",
    what: "Romance fraud and pig-butchering. Share a conversation as it evolves; VraiShield tracks it over time and recognizes the script's progression — and intervenes at the stage where intervention still works.",
    how: ["Per-thread encrypted conversation state", "Stage-classification model over message sequences", "Staged-intervention UX co-designed with victim-support orgs"],
    beats: "Everyone — no product models scam progression over time. The single most differentiated feature.",
  },

  // ---------------- Community & Intel ----------------
  {
    id: "C4", slug: "community-network", name: "Community Threat Network", icon: "🌐", phase: "P0", pillar: "Community & Intel", status: "live",
    tagline: "One report protects everyone, in minutes.",
    what: "Numbers, senders, URLs and scripts flagged by one Canadian propagate to all — consented, pseudonymized, human-reviewed at ingestion, and forwarded in aggregate to the CAFC.",
    how: ["Report flows on every surface → ingestion review queue", "Graph DB propagation → push to local caches", "Reputation decay; contributor karma resists poisoning"],
    beats: "Truecaller's network effect, rebuilt on consent — the only version that compounds in Canada without legal risk.",
    href: "/community",
  },
  {
    id: "E1", slug: "email-guard", name: "Email Guard", icon: "✉️", phase: "P1", pillar: "Community & Intel", status: "demo",
    tagline: "Phishing scanning for the inbox.",
    what: "OAuth connection to Gmail/Outlook (read-scope, revocable), scanning for impersonation (CRA, banks, employers), lookalike senders, malicious links and attachment lures — verdicts explained, not just spam-foldered.",
    how: ["OAuth + incremental sync → SPF/DKIM/DMARC forensics + content model", "Link Checker on every URL", "Bodies never retained post-verdict; in-region processing"],
    beats: "McAfee/Norton email scanning — matched, plus Canadian institutional context and explanations in twelve languages.",
  },
];

export const FEATURES_BY_SLUG: Record<string, Feature> = Object.fromEntries(
  FEATURES.map((f) => [f.slug, f]),
);

export const featureHref = (f: Feature): string => f.href ?? `/features/${f.slug}`;

export function featuresByPillar(): { pillar: string; items: Feature[] }[] {
  return PILLARS.map((pillar) => ({
    pillar,
    items: FEATURES.filter((f) => f.pillar === pillar),
  }));
}
