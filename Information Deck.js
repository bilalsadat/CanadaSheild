javascript

// ============================================================
// SCAMSHIELD CANADA — PRODUCT CONCEPT DECK V3
// 24 slides. Universal audience. Every feature explained.
// ============================================================
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";  // 13.333 x 7.5 inches
pres.title = "ScamShield Canada — Product Concept v3";
pres.author = "ScamShield Canada";

// ===== DESIGN SYSTEM =====
const C = {
  navy:      "0E1B36",
  navy2:     "1A2952",
  navy3:     "243766",
  navySoft:  "2E4B85",
  red:       "D81E3F",
  redDeep:   "9F1428",
  redLight:  "F2D0D8",
  cream:     "F7F3EE",
  cream2:    "EFEAE2",
  gold:      "E8B83A",
  goldDeep:  "B8901F",
  slate:     "374151",
  slateDim:  "6B7280",
  slateFnt:  "9CA3AF",
  border:    "E5E0D8",
  borderDk:  "D9D2C5",
  success:   "0F7D4D",
  danger:    "991B1B",
  white:     "FFFFFF",
};
const F = {
  serif: "Georgia",
  sans:  "Calibri",
  mono:  "Consolas",
};

// ===== HELPERS =====
function bg(slide, color = C.cream) {
  slide.background = { color };
}
function bgNavy(slide) {
  slide.background = { color: C.navy };
}

// Section pill — small uppercase label top-left
function sectionPill(slide, num, label, opts = {}) {
  const onDark = opts.onDark || false;
  slide.addText([
    { text: num + "  ", options: { color: C.red, bold: true, fontFace: F.mono } },
    { text: label.toUpperCase(), options: { color: onDark ? C.white : C.navy, fontFace: F.mono, charSpacing: 4 } },
  ], {
    x: 0.5, y: 0.4, w: 8, h: 0.3,
    fontSize: 9, valign: "middle",
  });
}

// Footer with page number
function footer(slide, n, total, opts = {}) {
  const onDark = opts.onDark || false;
  const txt = onDark ? C.slateFnt : C.slateDim;
  slide.addText("SCAMSHIELD CANADA", {
    x: 0.5, y: 7.15, w: 4, h: 0.25,
    fontSize: 8, fontFace: F.mono, color: txt, charSpacing: 3,
  });
  slide.addText(`${n} / ${total}`, {
    x: 11.8, y: 7.15, w: 1.0, h: 0.25,
    fontSize: 8, fontFace: F.mono, color: txt, charSpacing: 2, align: "right",
  });
}

// Big stat callout block
function statBlock(slide, x, y, w, h, opts) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: opts.fill || C.white },
    line: { color: opts.borderColor || C.borderDk, width: 0.75 },
    rectRadius: 0.05,
  });
  if (opts.accent) {
    slide.addShape("rect", {
      x, y, w: 0.08, h,
      fill: { color: opts.accent },
      line: { type: "none" },
    });
  }
  slide.addText(opts.value, {
    x: x + 0.25, y: y + 0.15, w: w - 0.4, h: 0.7,
    fontSize: opts.valueSize || 36, bold: true,
    color: opts.valueColor || C.red,
    fontFace: F.serif, valign: "top",
  });
  if (opts.label) {
    slide.addText(opts.label, {
      x: x + 0.25, y: y + 0.85, w: w - 0.4, h: 0.25,
      fontSize: 8.5, fontFace: F.mono, color: C.slateDim,
      charSpacing: 2,
    });
  }
  if (opts.desc) {
    slide.addText(opts.desc, {
      x: x + 0.25, y: y + 1.1, w: w - 0.4, h: h - 1.15,
      fontSize: 10.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
  }
}

const TOTAL = 24;

// ============================================================
// SLIDE 1 — COVER
// ============================================================
{
  const s = pres.addSlide();
  bgNavy(s);

  // Subtle grid
  for (let i = 1; i < 13; i++) {
    s.addShape("line", {
      x: i, y: 0, w: 0, h: 7.5,
      line: { color: C.navy2, width: 0.4 },
    });
  }
  for (let i = 1; i < 7; i++) {
    s.addShape("line", {
      x: 0, y: i, w: 13.33, h: 0,
      line: { color: C.navy2, width: 0.4 },
    });
  }

  // Top brand row
  s.addShape("rect", {
    x: 0.6, y: 0.55, w: 0.18, h: 0.32,
    fill: { color: C.red }, line: { type: "none" },
  });
  s.addText("SCAMSHIELD CANADA", {
    x: 0.92, y: 0.5, w: 6, h: 0.4,
    fontSize: 11, bold: true, color: C.red, fontFace: F.mono,
    charSpacing: 6, valign: "middle",
  });

  // Status row top right — like a system header
  s.addText("• SYSTEM ONLINE", {
    x: 9.5, y: 0.5, w: 3.3, h: 0.4,
    fontSize: 9, fontFace: F.mono, color: C.gold, charSpacing: 2,
    align: "right", valign: "middle",
  });

  // Big title block
  s.addText("Canada's", {
    x: 0.6, y: 1.6, w: 12, h: 1.0,
    fontSize: 60, fontFace: F.serif, color: C.white, bold: true,
    valign: "bottom",
  });
  s.addText("Verification Layer.", {
    x: 0.6, y: 2.55, w: 12, h: 1.1,
    fontSize: 60, fontFace: F.serif, color: C.gold, italic: true,
    valign: "bottom",
  });

  // Sub
  s.addText(
    "An AI fraud-prevention app purpose-built for Canadian institutions, languages, and lives — the only one of its kind.",
    {
      x: 0.6, y: 3.85, w: 11.0, h: 0.7,
      fontSize: 17, fontFace: F.serif, italic: true, color: "C8D6F0",
      valign: "top",
    }
  );

  // Three-stat row at the bottom
  const statY = 5.0;
  const stats = [
    { val: "$704M+", lbl: "FRAUD LOSSES — CANADA, 2025" },
    { val: "5–10%", lbl: "OF FRAUD ACTUALLY REPORTED" },
    { val: "+1,300%", lbl: "AI VOICE DEEPFAKE SURGE" },
  ];
  stats.forEach((stat, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape("rect", {
      x, y: statY, w: 3.95, h: 1.7,
      fill: { color: C.navy2 }, line: { color: C.navySoft, width: 0.75 },
      rectRadius: 0.05,
    });
    s.addShape("rect", {
      x, y: statY, w: 3.95, h: 0.05,
      fill: { color: i === 0 ? C.red : i === 1 ? C.gold : C.red },
      line: { type: "none" },
    });
    s.addText(stat.val, {
      x: x + 0.2, y: statY + 0.15, w: 3.6, h: 0.85,
      fontSize: 36, bold: true, color: C.gold, fontFace: F.serif,
    });
    s.addText(stat.lbl, {
      x: x + 0.2, y: statY + 1.0, w: 3.6, h: 0.6,
      fontSize: 9, fontFace: F.mono, color: "C8D6F0", charSpacing: 2,
    });
  });

  // Bottom tag
  s.addText("PRODUCT CONCEPT  •  V3  •  APRIL 2026", {
    x: 0.6, y: 7.05, w: 12, h: 0.3,
    fontSize: 8, fontFace: F.mono, color: C.slateFnt, charSpacing: 4,
  });
}

// ============================================================
// SLIDE 2 — THE WINDOW (Why now)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "01", "The window");

  s.addText("Three forces are colliding in Canada — right now.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "Each one alone is a market. All three converging in the same 18 months has only happened once. We were already building.",
    {
      x: 0.5, y: 1.5, w: 12.0, h: 0.5,
      fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  // Three cards
  const forces = [
    {
      head: "REGULATION",
      title: "Bill C-15 just rewrote the Bank Act.",
      body: "Royal Assent March 26, 2026. Every Canadian bank must now build fraud-prevention systems. Government's National Anti-Fraud Strategy consultation closed yesterday.",
      foot: "Department of Finance Canada · Mar 26, 2026",
      color: C.red,
    },
    {
      head: "TECHNOLOGY",
      title: "AI cloned a voice in three seconds.",
      body: "+1,300% deepfake fraud in 2024. 27% of Canadians received a deepfake call. Humans miss 27% of voice deepfakes — even when warned.",
      foot: "Pindrop 2025 VISR · Hiya Q4 2024 · PLOS ONE 2023",
      color: C.gold,
    },
    {
      head: "DISTRIBUTION",
      title: "Every leader is somewhere else.",
      body: "Norton's deepfake detector is English-only. Hiya AI Phone is US Android. Truecaller's iOS scanner isn't shipped. McAfee's Scam Detector isn't in Canada at all.",
      foot: "Public product documentation · Apr 2026",
      color: C.navySoft,
    },
  ];

  forces.forEach((f, i) => {
    const x = 0.5 + i * 4.2;
    const y = 2.3;
    const w = 4.0;
    const h = 4.4;

    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
      rectRadius: 0.05,
    });
    s.addShape("rect", {
      x, y, w, h: 0.08,
      fill: { color: f.color }, line: { type: "none" },
    });

    s.addText(f.head, {
      x: x + 0.3, y: y + 0.3, w: w - 0.6, h: 0.3,
      fontSize: 9, fontFace: F.mono, color: f.color, bold: true, charSpacing: 4,
    });
    s.addText(f.title, {
      x: x + 0.3, y: y + 0.7, w: w - 0.6, h: 1.4,
      fontSize: 21, fontFace: F.serif, color: C.navy, bold: true, valign: "top",
    });
    s.addText(f.body, {
      x: x + 0.3, y: y + 2.2, w: w - 0.6, h: 1.6,
      fontSize: 12.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
    s.addText(f.foot, {
      x: x + 0.3, y: y + 3.95, w: w - 0.6, h: 0.3,
      fontSize: 8, fontFace: F.mono, color: C.slateDim, italic: true,
    });
  });

  footer(s, 2, TOTAL);
}

// ============================================================
// SLIDE 3 — THE PROBLEM (the lived experience)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "02", "The problem");

  s.addText("The fraud crisis isn't statistics. It's people.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "Real Canadians, real losses, in the last six months. Every story below was reported by Canadian media between October 2025 and April 2026.",
    {
      x: 0.5, y: 1.5, w: 12.0, h: 0.5,
      fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  const cases = [
    { name: "Ray Anholt, 89", loc: "Victoria, BC", loss: "$1.7M", desc: "Drained at RBC + CIBC over six months. Gold-bar courier withdrawals. Banks watched.", src: "CBC Go Public · Oct 2025" },
    { name: "Lynn Phaneuf, 70", loc: "Prince Albert, SK", loss: "$2,800", desc: "Lost to a deepfake AI Carney + Rosemary Barton crypto video she saw on Facebook.", src: "CBC News · Dec 2025" },
    { name: "Markham woman, 51", loc: "Markham, ON", loss: "$1.7M", desc: "Lost to a deepfake of Elon Musk on a fake investment platform.", src: "CTV W5 · 2025" },
    { name: "Mira Burgess", loc: "Vancouver, BC", loss: "$37K", desc: "Fraudulent TD charges — international student scam. Bank blamed her for 5 months.", src: "CBC Marketplace · Mar 2026" },
    { name: "PEI man (anon)", loc: "Charlottetown, PE", loss: "$600K", desc: "Deepfake \"Dragon's Den\" cast endorsing a fake crypto product on Facebook.", src: "CTV W5 · 2025" },
    { name: "Saskatoon seniors (5)", loc: "Saskatoon, SK", loss: "$45K", desc: "AI-cloned grandchild voices in coordinated grandparent-scam cluster.", src: "CBC News · Nov 2025" },
  ];

  cases.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.2;
    const y = 2.25 + row * 2.3;
    const w = 4.0;
    const h = 2.05;

    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white }, line: { color: C.borderDk, width: 0.5 },
      rectRadius: 0.05,
    });
    // Loss highlight
    s.addText(c.loss, {
      x: x + 0.25, y: y + 0.15, w: w - 0.5, h: 0.55,
      fontSize: 26, fontFace: F.serif, color: C.red, bold: true, italic: true,
    });
    s.addText(`${c.name}  ·  ${c.loc}`, {
      x: x + 0.25, y: y + 0.7, w: w - 0.5, h: 0.3,
      fontSize: 11, fontFace: F.sans, color: C.navy, bold: true,
    });
    s.addText(c.desc, {
      x: x + 0.25, y: y + 1.0, w: w - 0.5, h: 0.7,
      fontSize: 10.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
    s.addText(c.src, {
      x: x + 0.25, y: y + 1.7, w: w - 0.5, h: 0.25,
      fontSize: 8, fontFace: F.mono, color: C.slateDim, italic: true,
    });
  });

  footer(s, 3, TOTAL);
}

// ============================================================
// SLIDE 4 — THE INVERTED MARKET (why nothing stops it today)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "03", "Why nothing stops it");

  s.addText("Canada's fraud market is upside down.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "Banks pay millions to detect fraud against themselves. Nobody pays to detect fraud against you.",
    {
      x: 0.5, y: 1.5, w: 12, h: 0.45,
      fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  // Two-column comparison
  const colW = 5.85;
  const colY = 2.2;
  const colH = 3.9;

  // Left — what exists
  const leftX = 0.5;
  s.addShape("rect", {
    x: leftX, y: colY, w: colW, h: colH,
    fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
    rectRadius: 0.05,
  });
  s.addShape("rect", {
    x: leftX, y: colY, w: colW, h: 0.5,
    fill: { color: C.navy3 }, line: { type: "none" },
  });
  s.addText("WHAT EXISTS  •  $US BILLIONS DEPLOYED", {
    x: leftX + 0.3, y: colY, w: colW - 0.5, h: 0.5,
    fontSize: 10, fontFace: F.mono, color: C.gold, bold: true, charSpacing: 3,
    valign: "middle",
  });

  const exists = [
    { who: "Pindrop", what: "Protects banks' contact centers from impersonators-of-customers.", note: "7 of top 10 US banks. Zero Canadian deployments announced." },
    { who: "Nuance Gatekeeper / Microsoft", what: "Voice biometrics for bank call centers.", note: "Microsoft is exiting voice biometrics — Sep 30 retirement." },
    { who: "Daon, ThreatMark", what: "Behavioral + biometric fraud for FIs.", note: "Enterprise B2B only." },
  ];
  exists.forEach((e, i) => {
    const y = colY + 0.7 + i * 1.05;
    s.addText(e.who, {
      x: leftX + 0.3, y: y, w: colW - 0.5, h: 0.3,
      fontSize: 13, fontFace: F.sans, color: C.navy, bold: true,
    });
    s.addText(e.what, {
      x: leftX + 0.3, y: y + 0.3, w: colW - 0.5, h: 0.35,
      fontSize: 11, fontFace: F.sans, color: C.slate,
    });
    s.addText(e.note, {
      x: leftX + 0.3, y: y + 0.65, w: colW - 0.5, h: 0.25,
      fontSize: 9.5, fontFace: F.mono, color: C.slateDim, italic: true,
    });
  });

  // Right — what's missing
  const rightX = 0.5 + colW + 0.6;
  s.addShape("rect", {
    x: rightX, y: colY, w: colW, h: colH,
    fill: { color: C.white }, line: { color: C.red, width: 1.2 },
    rectRadius: 0.05,
  });
  s.addShape("rect", {
    x: rightX, y: colY, w: colW, h: 0.5,
    fill: { color: C.red }, line: { type: "none" },
  });
  s.addText("WHAT'S MISSING  •  THE INVERSION", {
    x: rightX + 0.3, y: colY, w: colW - 0.5, h: 0.5,
    fontSize: 10, fontFace: F.mono, color: C.white, bold: true, charSpacing: 3,
    valign: "middle",
  });

  const missing = [
    { who: "For You — the customer", what: "Real-time detection that the caller pretending to be your bank is fake.", note: "Exists in B2B. Does not exist for consumers in Canada." },
    { who: "For Canadian context", what: "Trained on CRA, IRCC, Service Canada, Interac scam scripts.", note: "Every existing app trained on US patterns." },
    { who: "For your language", what: "Detection in Punjabi, Mandarin, Cantonese, Tagalog, Arabic, Quebec French.", note: "Top apps support English-only or English + a handful of European languages." },
  ];
  missing.forEach((e, i) => {
    const y = colY + 0.7 + i * 1.05;
    s.addText(e.who, {
      x: rightX + 0.3, y: y, w: colW - 0.5, h: 0.3,
      fontSize: 13, fontFace: F.sans, color: C.navy, bold: true,
    });
    s.addText(e.what, {
      x: rightX + 0.3, y: y + 0.3, w: colW - 0.5, h: 0.35,
      fontSize: 11, fontFace: F.sans, color: C.slate,
    });
    s.addText(e.note, {
      x: rightX + 0.3, y: y + 0.65, w: colW - 0.5, h: 0.25,
      fontSize: 9.5, fontFace: F.mono, color: C.red, italic: true,
    });
  });

  // Bottom note
  s.addText(
    "We are building the consumer-side mirror to enterprise-grade voice fraud detection — for the country with no deployments.",
    {
      x: 0.5, y: 6.4, w: 12.3, h: 0.5,
      fontSize: 13, fontFace: F.serif, italic: true, color: C.navy,
      align: "center",
    }
  );

  footer(s, 4, TOTAL);
}

// ============================================================
// SLIDE 5 — WHAT WE BUILD (the one-line product)
// ============================================================
{
  const s = pres.addSlide();
  bgNavy(s);

  // Vertical accent
  s.addShape("rect", {
    x: 0, y: 0, w: 0.15, h: 7.5,
    fill: { color: C.red }, line: { type: "none" },
  });

  sectionPill(s, "04", "What we build", { onDark: true });

  s.addText("ScamShield Canada is the verification layer", {
    x: 0.5, y: 1.4, w: 12.3, h: 0.85,
    fontSize: 36, fontFace: F.serif, color: C.white, bold: true,
  });
  s.addText("between every Canadian and every scammer.", {
    x: 0.5, y: 2.25, w: 12.3, h: 0.85,
    fontSize: 36, fontFace: F.serif, color: C.gold, italic: true, bold: true,
  });

  s.addText(
    "A multi-channel AI app that intercepts suspicious calls, texts, links, transfers, and emails — analyzes them against Canada-specific fraud patterns — and gives you a clear answer in under two seconds, in the language you actually think in.",
    {
      x: 0.5, y: 3.45, w: 12.3, h: 1.4,
      fontSize: 16, fontFace: F.serif, color: "C8D6F0", italic: true,
      valign: "top",
    }
  );

  // Five pillar tags
  const pillars = ["DETECT", "BLOCK", "RECOVER", "TEACH", "NETWORK"];
  pillars.forEach((p, i) => {
    const x = 0.5 + i * 2.5;
    s.addShape("rect", {
      x, y: 5.5, w: 2.3, h: 0.65,
      fill: { color: C.navy2 }, line: { color: C.gold, width: 0.75 },
      rectRadius: 0.05,
    });
    s.addText(p, {
      x, y: 5.5, w: 2.3, h: 0.65,
      fontSize: 13, fontFace: F.mono, color: C.gold, bold: true, charSpacing: 5,
      align: "center", valign: "middle",
    });
  });

  s.addText(
    "Five pillars. One app. Every Canadian protected.",
    {
      x: 0.5, y: 6.4, w: 12.3, h: 0.4,
      fontSize: 13, fontFace: F.mono, color: C.slateFnt, charSpacing: 3,
      align: "center",
    }
  );

  footer(s, 5, TOTAL, { onDark: true });
}

// ============================================================
// SLIDE 6 — PILLAR 1: DETECT (overview)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "05", "Pillar 1 — DETECT");

  s.addText("DETECT — the always-on second opinion.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "Five detection surfaces. Every channel a scammer uses to reach you, ScamShield is checking it first.",
    {
      x: 0.5, y: 1.5, w: 12.3, h: 0.45,
      fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  const detectFeatures = [
    { icon: "📞", title: "LIVE CALL ANALYSIS", desc: "Listens to incoming calls in real time. Detects voice deepfakes + scam scripts in <2 seconds." },
    { icon: "💬", title: "SMS + iMESSAGE", desc: "Scans every incoming text for scam patterns: fake CRA, fake banks, fake parcel notices." },
    { icon: "🔗", title: "LINK + QR CHECKER", desc: "Paste any URL or scan any QR code. Get a verdict before you click. Browser extension included." },
    { icon: "📧", title: "EMAIL TRIAGE", desc: "Forward any suspicious email. Get a verdict back in 30 seconds with red flags called out." },
    { icon: "💰", title: "E-TRANSFER COOL-OFF", desc: "Hooks into Interac flows. Pauses high-risk transfers for 30 seconds. Asks one question." },
  ];

  detectFeatures.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.2;
    const y = 2.25 + row * 2.3;
    const w = 4.0;
    const h = 2.05;

    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
      rectRadius: 0.05,
    });
    s.addShape("rect", {
      x, y, w: 0.08, h,
      fill: { color: C.red }, line: { type: "none" },
    });

    // Icon circle
    s.addShape("ellipse", {
      x: x + 0.3, y: y + 0.25, w: 0.7, h: 0.7,
      fill: { color: C.cream2 }, line: { color: C.borderDk, width: 0.5 },
    });
    s.addText(f.icon, {
      x: x + 0.3, y: y + 0.25, w: 0.7, h: 0.7,
      fontSize: 22, align: "center", valign: "middle",
    });

    s.addText(f.title, {
      x: x + 1.15, y: y + 0.3, w: w - 1.4, h: 0.35,
      fontSize: 11, fontFace: F.mono, color: C.red, bold: true, charSpacing: 2,
    });
    s.addText(f.desc, {
      x: x + 1.15, y: y + 0.7, w: w - 1.4, h: 1.2,
      fontSize: 11.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
  });

  // Bottom — pinned phrase
  s.addShape("rect", {
    x: 9.5, y: 4.55, w: 3.3, h: 2.05,
    fill: { color: C.navy }, line: { type: "none" },
    rectRadius: 0.05,
  });
  s.addText("Five surfaces.", {
    x: 9.7, y: 4.7, w: 3.0, h: 0.5,
    fontSize: 22, fontFace: F.serif, color: C.white, bold: true,
  });
  s.addText("One verdict.", {
    x: 9.7, y: 5.15, w: 3.0, h: 0.5,
    fontSize: 22, fontFace: F.serif, color: C.gold, bold: true, italic: true,
  });
  s.addText("Under two seconds.", {
    x: 9.7, y: 5.7, w: 3.0, h: 0.4,
    fontSize: 12, fontFace: F.mono, color: "C8D6F0", charSpacing: 2,
  });
  s.addText("Same accuracy benchmark as enterprise-grade Pindrop Pulse.", {
    x: 9.7, y: 6.05, w: 3.0, h: 0.5,
    fontSize: 10, fontFace: F.sans, color: C.slateFnt, italic: true,
  });

  footer(s, 6, TOTAL);
}

// ============================================================
// SLIDE 7 — DEEP DIVE: LIVE CALL ANALYSIS (the signature feature)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "06", "Feature deep dive · 1 of 5");

  s.addText("Live Call Analysis — how it actually works.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 28, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText("Three steps. Two seconds. No surveillance.", {
    x: 0.5, y: 1.45, w: 12, h: 0.4,
    fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
  });

  // Three-step horizontal flow
  const steps = [
    {
      n: "01",
      title: "INTERCEPT",
      heading: "Phone rings. ScamShield is already listening.",
      detail: "Android: native CallScreeningService. iOS: VoIP-routed via CallKit. Audio is processed in 200–300ms streaming chunks. Nothing leaves your device unless you opt in to cloud analysis.",
      tech: "Whisper-Large-v3-Turbo · Moonshine v2 (on-device)",
    },
    {
      n: "02",
      title: "ANALYZE",
      heading: "Two AI models compare the voice — and the script.",
      detail: "Voice authenticity: AASIST3 + RawNet2 ensemble (sub-1% EER on the public ASVspoof 2019 benchmark). Scam-script: Canada-specific LLM trained on 12 known scam patterns + caller ID + Telco STIR/SHAKEN signal.",
      tech: "AASIST3 deepfake detector · Canadian-context LLM",
    },
    {
      n: "03",
      title: "WARN",
      heading: "Banner appears in <2 seconds. Three buttons.",
      detail: "On the screen: \"This caller may be a scam.\" Three options: \"It's fine\", \"Hang up\", or \"Stay on, I'm getting help\" (which alerts a family member or community responder, see Pillar 4).",
      tech: "Match: Pindrop Pulse <2s decision · enterprise grade",
    },
  ];

  steps.forEach((step, i) => {
    const x = 0.5 + i * 4.2;
    const y = 2.0;
    const w = 4.0;
    const h = 4.7;

    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
      rectRadius: 0.05,
    });

    // Step number badge
    s.addShape("ellipse", {
      x: x + 0.3, y: y + 0.3, w: 0.65, h: 0.65,
      fill: { color: C.navy }, line: { type: "none" },
    });
    s.addText(step.n, {
      x: x + 0.3, y: y + 0.3, w: 0.65, h: 0.65,
      fontSize: 14, fontFace: F.mono, color: C.gold, bold: true,
      align: "center", valign: "middle",
    });

    s.addText(step.title, {
      x: x + 1.1, y: y + 0.35, w: w - 1.3, h: 0.35,
      fontSize: 11, fontFace: F.mono, color: C.red, bold: true, charSpacing: 3,
    });

    s.addText(step.heading, {
      x: x + 0.3, y: y + 1.1, w: w - 0.6, h: 1.0,
      fontSize: 16, fontFace: F.serif, color: C.navy, bold: true, valign: "top",
    });

    s.addText(step.detail, {
      x: x + 0.3, y: y + 2.3, w: w - 0.6, h: 1.7,
      fontSize: 11, fontFace: F.sans, color: C.slate, valign: "top",
    });

    // Tech stack pill at bottom
    s.addShape("rect", {
      x: x + 0.3, y: y + h - 0.55, w: w - 0.6, h: 0.4,
      fill: { color: C.cream2 }, line: { color: C.borderDk, width: 0.5 },
      rectRadius: 0.05,
    });
    s.addText(step.tech, {
      x: x + 0.4, y: y + h - 0.55, w: w - 0.8, h: 0.4,
      fontSize: 9, fontFace: F.mono, color: C.navy, valign: "middle",
    });

    // Connector arrow between steps
    if (i < 2) {
      s.addShape("rightTriangle", {
        x: x + w + 0.05, y: y + h/2 - 0.07, w: 0.1, h: 0.14,
        fill: { color: C.red }, line: { type: "none" }, rotate: 90,
      });
    }
  });

  footer(s, 7, TOTAL);
}

// ============================================================
// SLIDE 8 — DEEP DIVE: SMS / EMAIL TRIAGE
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "07", "Feature deep dive · 2 of 5");

  s.addText("SMS scanner + email triage.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText("Two of the five biggest scam channels — both pre-screened before you read.", {
    x: 0.5, y: 1.45, w: 12.3, h: 0.45,
    fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
  });

  // Left side: SMS feature
  const lx = 0.5;
  const cy = 2.15;
  const cw = 5.85;
  const ch = 4.7;

  s.addShape("rect", {
    x: lx, y: cy, w: cw, h: ch,
    fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
    rectRadius: 0.05,
  });
  s.addShape("rect", {
    x: lx, y: cy, w: cw, h: 0.08,
    fill: { color: C.red }, line: { type: "none" },
  });

  s.addText("SMS + iMESSAGE SCANNER", {
    x: lx + 0.3, y: cy + 0.3, w: cw - 0.6, h: 0.35,
    fontSize: 11, fontFace: F.mono, color: C.red, bold: true, charSpacing: 3,
  });
  s.addText("Every text scanned. Scams flagged before you tap.", {
    x: lx + 0.3, y: cy + 0.7, w: cw - 0.6, h: 0.85,
    fontSize: 19, fontFace: F.serif, color: C.navy, bold: true, valign: "top",
  });

  // Mock SMS bubble
  s.addShape("roundRect", {
    x: lx + 0.3, y: cy + 1.7, w: cw - 0.6, h: 1.1,
    fill: { color: C.cream2 }, line: { color: C.borderDk, width: 0.5 },
    rectRadius: 0.1,
  });
  s.addText("\"CRA: You have a $1,840 refund. Click here to claim within 24h.\"", {
    x: lx + 0.5, y: cy + 1.8, w: cw - 1.0, h: 0.5,
    fontSize: 11, fontFace: F.sans, color: C.slate, italic: true, valign: "top",
  });
  s.addShape("rect", {
    x: lx + 0.5, y: cy + 2.35, w: cw - 1.0, h: 0.35,
    fill: { color: C.danger }, line: { type: "none" }, rectRadius: 0.05,
  });
  s.addText("⚠ SCAM DETECTED — Risk score: 94/100 — DO NOT REPLY", {
    x: lx + 0.5, y: cy + 2.35, w: cw - 1.0, h: 0.35,
    fontSize: 10, fontFace: F.mono, color: C.white, bold: true, charSpacing: 2,
    align: "center", valign: "middle",
  });

  // Three signals
  const sigs = [
    "✓  Sender domain not on CRA whitelist",
    "✓  Urgency language ('within 24h')",
    "✓  Typo pattern matches 4,200+ reported scams",
  ];
  sigs.forEach((sig, i) => {
    s.addText(sig, {
      x: lx + 0.3, y: cy + 2.95 + i * 0.35, w: cw - 0.6, h: 0.3,
      fontSize: 11, fontFace: F.sans, color: C.success, valign: "middle",
    });
  });

  s.addText(
    "Powered by 12-language Canadian-context LLM. Punjabi, Mandarin, Tagalog, Arabic, Quebec French — not just English.",
    {
      x: lx + 0.3, y: cy + 4.05, w: cw - 0.6, h: 0.55,
      fontSize: 10, fontFace: F.mono, color: C.slateDim, italic: true, valign: "top",
    }
  );

  // Right side: Email feature
  const rx = 0.5 + cw + 0.6;
  s.addShape("rect", {
    x: rx, y: cy, w: cw, h: ch,
    fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
    rectRadius: 0.05,
  });
  s.addShape("rect", {
    x: rx, y: cy, w: cw, h: 0.08,
    fill: { color: C.gold }, line: { type: "none" },
  });

  s.addText("EMAIL TRIAGE", {
    x: rx + 0.3, y: cy + 0.3, w: cw - 0.6, h: 0.35,
    fontSize: 11, fontFace: F.mono, color: C.goldDeep, bold: true, charSpacing: 3,
  });
  s.addText("Forward suspicious email. Get verdict in 30 seconds.", {
    x: rx + 0.3, y: cy + 0.7, w: cw - 0.6, h: 0.85,
    fontSize: 19, fontFace: F.serif, color: C.navy, bold: true, valign: "top",
  });

  // 3-step flow
  const eSteps = [
    { n: "1", t: "Forward to check@scamshield.ca", d: "From any email — Gmail, Outlook, iCloud. Or use the in-app paste box." },
    { n: "2", t: "AI parses sender, links, attachments", d: "Checks domain, SSL cert, link redirects, attachment hashes against threat intel." },
    { n: "3", t: "Reply email arrives in 30 seconds", d: "Three red flags called out. Recommendation. \"Forward to one person who needs this.\"" },
  ];
  eSteps.forEach((step, i) => {
    const y = cy + 1.7 + i * 0.95;
    s.addShape("ellipse", {
      x: rx + 0.3, y: y + 0.05, w: 0.4, h: 0.4,
      fill: { color: C.gold }, line: { type: "none" },
    });
    s.addText(step.n, {
      x: rx + 0.3, y: y + 0.05, w: 0.4, h: 0.4,
      fontSize: 13, fontFace: F.mono, color: C.navy, bold: true,
      align: "center", valign: "middle",
    });
    s.addText(step.t, {
      x: rx + 0.85, y: y, w: cw - 1.05, h: 0.35,
      fontSize: 12, fontFace: F.sans, color: C.navy, bold: true,
    });
    s.addText(step.d, {
      x: rx + 0.85, y: y + 0.35, w: cw - 1.05, h: 0.5,
      fontSize: 10.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
  });

  s.addText(
    "Same backend powers business invoice-fraud detection — SMB tier feature.",
    {
      x: rx + 0.3, y: cy + 4.4, w: cw - 0.6, h: 0.3,
      fontSize: 10, fontFace: F.mono, color: C.slateDim, italic: true,
    }
  );

  footer(s, 8, TOTAL);
}

// ============================================================
// SLIDE 9 — DEEP DIVE: LINK + QR CHECKER
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "08", "Feature deep dive · 3 of 5");

  s.addText("Link + QR checker.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText("Paste any URL. Scan any QR. Get a verdict before you click.", {
    x: 0.5, y: 1.45, w: 12.3, h: 0.45,
    fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
  });

  // Left: Big quote callout
  s.addShape("rect", {
    x: 0.5, y: 2.15, w: 5.85, h: 4.7,
    fill: { color: C.navy }, line: { type: "none" },
    rectRadius: 0.05,
  });

  s.addText("Why it matters", {
    x: 0.8, y: 2.4, w: 5.3, h: 0.4,
    fontSize: 10, fontFace: F.mono, color: C.gold, bold: true, charSpacing: 3,
  });

  s.addText(
    "QR-code scams now outpace traditional phishing in growth.",
    {
      x: 0.8, y: 2.85, w: 5.25, h: 1.5,
      fontSize: 22, fontFace: F.serif, color: C.white, italic: true, bold: true,
      valign: "top",
    }
  );

  s.addText(
    "Stickers on parking meters. Fake Hydro QC bills. Fake Service Canada notices. The user can't tell — but the URL underneath is forensically obvious.",
    {
      x: 0.8, y: 4.85, w: 5.25, h: 1.7,
      fontSize: 13, fontFace: F.serif, color: "C8D6F0", italic: true, valign: "top",
    }
  );

  // Right: Three checks
  const rx = 6.55;
  const ry = 2.15;
  const rw = 6.3;

  const checks = [
    {
      h: "DOMAIN AGE + SSL",
      d: "Sites under 30 days old that mimic Canadian institutions (cra-canada.com, hydroqc-rebate.com) are flagged red.",
      ex: "Detected: 'cra-tax-refund.ca' — registered 9 days ago",
    },
    {
      h: "REDIRECT CHAIN",
      d: "We follow every shortener (bit.ly, t.co, lnk.to). If the final destination is a known scam host, you never visit it.",
      ex: "Detected: bit.ly/3xj2k → final = phishing kit",
    },
    {
      h: "BRAND IMPERSONATION",
      d: "Pixel-level visual diff vs. real sites: RBC, TD, BMO, Scotia, CIBC, Desjardins, Service Canada, IRCC, CRA, Hydro Québec.",
      ex: "Detected: 99.4% visual match to scotiabank.ca",
    },
  ];

  checks.forEach((c, i) => {
    const y = ry + i * 1.6;
    s.addShape("rect", {
      x: rx, y, w: rw, h: 1.45,
      fill: { color: C.white }, line: { color: C.borderDk, width: 0.5 },
      rectRadius: 0.05,
    });
    s.addText(c.h, {
      x: rx + 0.25, y: y + 0.15, w: rw - 0.5, h: 0.3,
      fontSize: 10, fontFace: F.mono, color: C.red, bold: true, charSpacing: 2,
    });
    s.addText(c.d, {
      x: rx + 0.25, y: y + 0.5, w: rw - 0.5, h: 0.55,
      fontSize: 11.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
    s.addShape("rect", {
      x: rx + 0.25, y: y + 1.07, w: rw - 0.5, h: 0.32,
      fill: { color: C.cream2 }, line: { type: "none" },
      rectRadius: 0.04,
    });
    s.addText(c.ex, {
      x: rx + 0.35, y: y + 1.07, w: rw - 0.7, h: 0.32,
      fontSize: 9.5, fontFace: F.mono, color: C.navy, italic: true, valign: "middle",
    });
  });

  footer(s, 9, TOTAL);
}

// ============================================================
// SLIDE 10 — DEEP DIVE: E-TRANSFER COOL-OFF
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "09", "Feature deep dive · 4 of 5");

  s.addText("e-Transfer cool-off — 30 seconds that save $10,000.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 26, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "Why this exists: in May 2024 banks raised the daily Interac cap to $10K. e-Transfer fraud rose 26.1% YoY. Once accepted, a transfer is irreversible.",
    {
      x: 0.5, y: 1.5, w: 12.3, h: 0.55,
      fontSize: 13, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  // Left side — the trigger
  const lx = 0.5;
  const ly = 2.3;
  const lw = 5.85;
  const lh = 4.5;

  s.addShape("rect", {
    x: lx, y: ly, w: lw, h: lh,
    fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
    rectRadius: 0.05,
  });
  s.addShape("rect", {
    x: lx, y: ly, w: lw, h: 0.08,
    fill: { color: C.red }, line: { type: "none" },
  });

  s.addText("WHEN COOL-OFF TRIGGERS", {
    x: lx + 0.3, y: ly + 0.3, w: lw - 0.6, h: 0.35,
    fontSize: 11, fontFace: F.mono, color: C.red, bold: true, charSpacing: 3,
  });
  s.addText("Five signals — any one fires the pause.", {
    x: lx + 0.3, y: ly + 0.65, w: lw - 0.6, h: 0.5,
    fontSize: 17, fontFace: F.serif, color: C.navy, bold: true,
  });

  const triggers = [
    "1. Recipient address never used by you before",
    "2. Recipient has been reported to ScamShield by 3+ Canadians",
    "3. Amount > $5,000 + recipient under 30 days old",
    "4. Transfer initiated within 60min of an unknown call ending",
    "5. Memo line contains urgency words ('emergency', 'arrest', 'urgent')",
  ];
  triggers.forEach((t, i) => {
    s.addText(t, {
      x: lx + 0.3, y: ly + 1.4 + i * 0.55, w: lw - 0.6, h: 0.5,
      fontSize: 12.5, fontFace: F.sans, color: C.slate, valign: "middle",
    });
  });

  // Right side — what happens
  const rx = 0.5 + lw + 0.6;
  const rw = lw;

  s.addShape("rect", {
    x: rx, y: ly, w: rw, h: lh,
    fill: { color: C.navy }, line: { type: "none" },
    rectRadius: 0.05,
  });

  s.addText("WHAT HAPPENS NEXT", {
    x: rx + 0.3, y: ly + 0.3, w: rw - 0.6, h: 0.35,
    fontSize: 11, fontFace: F.mono, color: C.gold, bold: true, charSpacing: 3,
  });

  s.addText("\"Take a breath. Are you sure?\"", {
    x: rx + 0.3, y: ly + 0.7, w: rw - 0.6, h: 0.6,
    fontSize: 19, fontFace: F.serif, color: C.white, bold: true, italic: true,
  });

  // Big timer
  s.addShape("rect", {
    x: rx + 0.6, y: ly + 1.5, w: 4.5, h: 1.0,
    fill: { color: C.navy2 }, line: { color: C.gold, width: 1 },
    rectRadius: 0.05,
  });
  s.addText("00:30", {
    x: rx + 0.6, y: ly + 1.5, w: 4.5, h: 1.0,
    fontSize: 44, fontFace: F.mono, color: C.gold, bold: true,
    align: "center", valign: "middle",
  });

  s.addText("3 questions you can answer in your head.", {
    x: rx + 0.3, y: ly + 2.6, w: rw - 0.6, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: "C8D6F0", charSpacing: 1,
  });

  const qs = [
    "→ Have you met them in person?",
    "→ Did they create urgency?",
    "→ Want a second opinion from your family?",
  ];
  qs.forEach((q, i) => {
    s.addText(q, {
      x: rx + 0.4, y: ly + 3.0 + i * 0.4, w: rw - 0.7, h: 0.35,
      fontSize: 13, fontFace: F.sans, color: C.white,
    });
  });

  s.addText("Cancel anytime. Or let it go through. Your money, your call.", {
    x: rx + 0.3, y: ly + 4.05, w: rw - 0.6, h: 0.35,
    fontSize: 11, fontFace: F.serif, italic: true, color: C.slateFnt,
  });

  footer(s, 10, TOTAL);
}

// ============================================================
// SLIDE 11 — PILLAR 2: BLOCK
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "10", "Pillar 2 — BLOCK");

  s.addText("BLOCK — when detection isn't enough.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "Detection tells you. Blocking stops the harm. Three features that stop fraud in motion.",
    {
      x: 0.5, y: 1.45, w: 12, h: 0.45,
      fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  const blockFeatures = [
    {
      title: "FAMILY GUARDIAN MODE",
      tagline: "Two phones. One safety net.",
      desc: "When ScamShield detects a high-risk call on a parent's phone, it pauses the call and pings their adult child. Two taps to approve or stop. Solves the senior-installs-app problem: install on your parent's phone once, manage it from yours forever.",
      stat: "60+ Canadians lose ~$259M/year — half because they live alone",
      color: C.red,
    },
    {
      title: "VOICE LOCK",
      tagline: "Your voiceprint = your password.",
      desc: "When ScamShield is on a call, it recognizes if the voice claiming to be your daughter, your bank manager, or your boss matches the registered voiceprint. If not, the screen turns red. Built on AASIST3 — the same model bank contact-center systems use.",
      stat: "27% of voice deepfakes go undetected by humans (PLOS ONE, 2023)",
      color: C.gold,
    },
    {
      title: "BANK-LINE VERIFY",
      tagline: "Real bank, real number.",
      desc: "When you receive a call \"from RBC\", you tap a button — ScamShield calls RBC back on the verified institutional line and confirms whether the call was real. No more \"call them back at this number\" social engineering.",
      stat: "Bank Investigator Fraud reports +16.5% YoY in 2024",
      color: C.navySoft,
    },
  ];

  blockFeatures.forEach((f, i) => {
    const x = 0.5 + i * 4.2;
    const y = 2.25;
    const w = 4.0;
    const h = 4.5;

    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
      rectRadius: 0.05,
    });
    s.addShape("rect", {
      x, y, w, h: 0.08,
      fill: { color: f.color }, line: { type: "none" },
    });

    s.addText(f.title, {
      x: x + 0.3, y: y + 0.3, w: w - 0.6, h: 0.35,
      fontSize: 11, fontFace: F.mono, color: f.color, bold: true, charSpacing: 3,
    });
    s.addText(f.tagline, {
      x: x + 0.3, y: y + 0.7, w: w - 0.6, h: 0.85,
      fontSize: 19, fontFace: F.serif, color: C.navy, bold: true, valign: "top",
    });
    s.addText(f.desc, {
      x: x + 0.3, y: y + 1.65, w: w - 0.6, h: 2.2,
      fontSize: 11.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
    // Stat footer
    s.addShape("rect", {
      x: x + 0.3, y: y + h - 0.7, w: w - 0.6, h: 0.55,
      fill: { color: C.cream2 }, line: { type: "none" },
      rectRadius: 0.04,
    });
    s.addText(f.stat, {
      x: x + 0.4, y: y + h - 0.7, w: w - 0.8, h: 0.55,
      fontSize: 9.5, fontFace: F.mono, color: C.navy, italic: true, valign: "middle",
    });
  });

  footer(s, 11, TOTAL);
}

// ============================================================
// SLIDE 12 — PILLAR 3: RECOVER
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "11", "Pillar 3 — RECOVER");

  s.addText("RECOVER — for the worst day.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "When prevention fails. The 6-step concierge that turns 16 hours of panic into 90 minutes of action.",
    {
      x: 0.5, y: 1.45, w: 12.3, h: 0.45,
      fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  // 6-step horizontal flow
  const steps = [
    { n: "1", title: "TRIAGE", desc: "Tap \"I've been scammed.\" App asks 4 questions. Time to first action: 30 seconds." },
    { n: "2", title: "BANK", desc: "Auto-dials your bank's verified fraud line. Pre-fills your file reference. No hold music — direct route." },
    { n: "3", title: "LOCK", desc: "Auto-locks: cards, e-transfer, online banking, mobile wallet, 2FA." },
    { n: "4", title: "REPORT", desc: "Pre-fills CAFC report. Files RCMP report if loss > threshold. Equifax + TransUnion fraud alerts triggered." },
    { n: "5", title: "RECOVER", desc: "Concierge agent (real human, Canada-staffed) takes over for crypto/wire trace, social-account recovery, evidence preservation." },
    { n: "6", title: "HEAL", desc: "Connects you to local mental health support if you want it. Fraud trauma is real — the average victim experiences depression for 6+ months." },
  ];

  steps.forEach((step, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.2;
    const y = 2.3 + row * 2.25;
    const w = 4.0;
    const h = 1.95;

    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
      rectRadius: 0.05,
    });

    // Big number
    s.addShape("ellipse", {
      x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55,
      fill: { color: C.red }, line: { type: "none" },
    });
    s.addText(step.n, {
      x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55,
      fontSize: 16, fontFace: F.mono, color: C.white, bold: true,
      align: "center", valign: "middle",
    });

    s.addText(step.title, {
      x: x + 0.95, y: y + 0.3, w: w - 1.15, h: 0.4,
      fontSize: 14, fontFace: F.mono, color: C.red, bold: true, charSpacing: 3,
    });
    s.addText(step.desc, {
      x: x + 0.3, y: y + 0.95, w: w - 0.6, h: 0.95,
      fontSize: 11.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
  });

  // Bottom comparison
  s.addText(
    "Average victim spends 16 hours navigating banks, telcos, RCMP, credit bureaus. With ScamShield: 90 minutes.",
    {
      x: 0.5, y: 6.85, w: 12.3, h: 0.4,
      fontSize: 13, fontFace: F.serif, italic: true, color: C.navy,
      align: "center",
    }
  );

  footer(s, 12, TOTAL);
}

// ============================================================
// SLIDE 13 — PILLARS 4 & 5: TEACH + NETWORK
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "12", "Pillars 4 & 5 — TEACH + NETWORK");

  s.addText("Building immunity. Building intelligence.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 28, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "Every Canadian using ScamShield makes the system smarter for everyone else. Network effects native to fraud prevention.",
    {
      x: 0.5, y: 1.5, w: 12.3, h: 0.5,
      fontSize: 13, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  // Left side — TEACH
  const lx = 0.5;
  const ly = 2.25;
  const lw = 5.85;
  const lh = 4.55;

  s.addShape("rect", {
    x: lx, y: ly, w: lw, h: lh,
    fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
    rectRadius: 0.05,
  });
  s.addShape("rect", {
    x: lx, y: ly, w: lw, h: 0.08,
    fill: { color: C.gold }, line: { type: "none" },
  });

  s.addText("PILLAR 4 — TEACH", {
    x: lx + 0.3, y: ly + 0.3, w: lw - 0.6, h: 0.35,
    fontSize: 11, fontFace: F.mono, color: C.goldDeep, bold: true, charSpacing: 3,
  });
  s.addText("Build immunity, not anxiety.", {
    x: lx + 0.3, y: ly + 0.7, w: lw - 0.6, h: 0.7,
    fontSize: 21, fontFace: F.serif, color: C.navy, bold: true,
  });

  const teachItems = [
    { h: "Weekly Scam Vaccine", d: "One \"realistic-but-fake\" scam attempt sent to your phone every Sunday. If you spot it, +1 streak. If you fall, you're coached gently." },
    { h: "Geo Scam Alerts", d: "When 3+ scams of the same pattern hit your postal code in 24 hours, everyone nearby gets warned. Like Waze for fraud." },
    { h: "Family Threat Briefings", d: "Every Sunday morning, adult children get \"3 scams targeting your parents this week\" with conversation starters for next family dinner." },
  ];

  teachItems.forEach((item, i) => {
    const y = ly + 1.5 + i * 1.0;
    s.addText(item.h, {
      x: lx + 0.3, y, w: lw - 0.6, h: 0.35,
      fontSize: 13, fontFace: F.sans, color: C.navy, bold: true,
    });
    s.addText(item.d, {
      x: lx + 0.3, y: y + 0.35, w: lw - 0.6, h: 0.65,
      fontSize: 11, fontFace: F.sans, color: C.slate, valign: "top",
    });
  });

  // Right side — NETWORK
  const rx = 0.5 + lw + 0.6;
  s.addShape("rect", {
    x: rx, y: ly, w: lw, h: lh,
    fill: { color: C.navy }, line: { type: "none" },
    rectRadius: 0.05,
  });

  s.addText("PILLAR 5 — NETWORK", {
    x: rx + 0.3, y: ly + 0.3, w: lw - 0.6, h: 0.35,
    fontSize: 11, fontFace: F.mono, color: C.gold, bold: true, charSpacing: 3,
  });
  s.addText("Stronger together than alone.", {
    x: rx + 0.3, y: ly + 0.7, w: lw - 0.6, h: 0.7,
    fontSize: 21, fontFace: F.serif, color: C.white, bold: true,
  });

  const networkItems = [
    { h: "Community Reporting", d: "Every scam reported by one Canadian protects every other Canadian within minutes — federated threat intel updated continuously." },
    { h: "12-Language Support", d: "EN, FR (Quebec + standard), Punjabi, Mandarin, Cantonese, Tagalog, Arabic, Spanish, Hindi, Ukrainian, Tigrinya, Cree (P3)." },
    { h: "Bank + Telco SDK", d: "B2B layer: banks embed our deepfake detection in their app. Telcos add to caller ID. Banks satisfy Bill C-15 compliance with our infrastructure." },
  ];

  networkItems.forEach((item, i) => {
    const y = ly + 1.5 + i * 1.0;
    s.addText(item.h, {
      x: rx + 0.3, y, w: lw - 0.6, h: 0.35,
      fontSize: 13, fontFace: F.sans, color: C.gold, bold: true,
    });
    s.addText(item.d, {
      x: rx + 0.3, y: y + 0.35, w: lw - 0.6, h: 0.65,
      fontSize: 11, fontFace: F.sans, color: "C8D6F0", valign: "top",
    });
  });

  footer(s, 13, TOTAL);
}

// ============================================================
// SLIDE 14 — ARCHETYPES (who we serve)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "13", "Who we serve");

  s.addText("Four Canadians. One app. Same mission.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "Designed for the demographics that fraudsters target most — and that no existing app actually serves.",
    {
      x: 0.5, y: 1.5, w: 12.3, h: 0.5,
      fontSize: 14, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  const archetypes = [
    { title: "ROBERT, 74", sub: "Retired teacher · Calgary AB", desc: "Lives alone since wife's stroke. Banks online with help from his daughter Sara, 38, in Toronto. Worried after his neighbour lost $40K last year.", feat: "Family Guardian Mode" },
    { title: "PRIYA, 27", sub: "International student · UWaterloo", desc: "First year studying engineering. Just sent $3,200 for an apartment that didn't exist. Second \"landlord\" now asks for $8K LMIA fee.", feat: "Multilingual SMS scanner" },
    { title: "MICHEL, 45", sub: "SMB owner · Sherbrooke QC", desc: "Runs an HVAC company, 9 employees. Almost wired $42K to a deepfake \"CEO\" of his own supplier. Quebec French, unprotected by US-trained tools.", feat: "Voice Lock + Email Triage" },
    { title: "AMARA, 32", sub: "Marketing manager · Toronto", desc: "Working mom of two. Manages her parents' iPad in Lagos. Wants to protect them remotely without micromanaging.", feat: "Family Threat Briefings" },
  ];

  archetypes.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 6.4;
    const y = 2.3 + row * 2.3;
    const w = 6.2;
    const h = 2.05;

    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white }, line: { color: C.borderDk, width: 0.75 },
      rectRadius: 0.05,
    });
    s.addShape("rect", {
      x, y, w: 0.08, h,
      fill: { color: C.red }, line: { type: "none" },
    });

    s.addText(a.title, {
      x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.45,
      fontSize: 22, fontFace: F.serif, color: C.navy, bold: true,
    });
    s.addText(a.sub, {
      x: x + 0.3, y: y + 0.65, w: w - 0.6, h: 0.3,
      fontSize: 11, fontFace: F.mono, color: C.red, charSpacing: 2,
    });
    s.addText(a.desc, {
      x: x + 0.3, y: y + 1.0, w: w - 0.6, h: 0.7,
      fontSize: 11.5, fontFace: F.sans, color: C.slate, valign: "top",
    });
    s.addShape("rect", {
      x: x + 0.3, y: y + 1.7, w: w - 0.6, h: 0.3,
      fill: { color: C.cream2 }, line: { type: "none" }, rectRadius: 0.03,
    });
    s.addText("KEY FEATURE  →  " + a.feat, {
      x: x + 0.4, y: y + 1.7, w: w - 0.8, h: 0.3,
      fontSize: 10, fontFace: F.mono, color: C.navy, valign: "middle",
    });
  });

  footer(s, 14, TOTAL);
}

// ============================================================
// SLIDE 15 — COMPETITIVE MATRIX
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  sectionPill(s, "14", "Competitive matrix");

  s.addText("No competitor checks every box.", {
    x: 0.5, y: 0.85, w: 12.3, h: 0.7,
    fontSize: 30, fontFace: F.serif, color: C.navy, bold: true,
  });
  s.addText(
    "We checked every public product spec as of April 2026. The Canadian + multilingual + live-deepfake combination is open territory.",
    {
      x: 0.5, y: 1.5, w: 12.3, h: 0.5,
      fontSize: 13, fontFace: F.serif, italic: true, color: C.slate,
    }
  );

  // Table
  const tx = 0.5;
  const ty = 2.25;
  const colWidths = [2.3, 1.55, 1.55, 1.55, 1.55, 1.55, 2.25];
  const colTitles = ["", "Norton\nGenie", "Hiya\nAI Phone", "Truecaller\nScanner", "McAfee\nScam Det.", "Pindrop", "ScamShield\nCanada"];

  // Header row
  let cx = tx;
  colTitles.forEach((c, i) => {
    s.addShape("rect", {
      x: cx, y: ty, w: colWidths[i], h: 0.55,
      fill: { color: i === 6 ? C.red : C.navy }, line: { color: C.white, width: 1 },
    });
    s.addText(c, {
      x: cx, y: ty, w: colWidths[i], h: 0.55,
      fontSize: 10, fontFace: F.mono, color: C.white, bold: true, charSpacing: 2,
      align: "center", valign: "middle",
    });
    cx += colWidths[i];
  });

  // Rows
  const rows = [
    ["Live call deepfake detection",   "—",  "✓",  "tap",  "—",  "B2B", "✓"],
    ["Available in Canada (consumer)", "
