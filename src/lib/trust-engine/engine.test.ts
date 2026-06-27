import { describe, it, expect } from "vitest";
import { scoreTrust, explain } from "./index";
import type { NetworkLookup } from "./types";

/**
 * These tests are the start of the calibration corpus. They assert behaviour on
 * canonical Canadian scams AND on legitimate messages — because the most
 * important honesty test is the false-positive rate on real life.
 */

describe("Trust Engine — known scams score dangerous/likely", () => {
  it("flags the CRA arrest script", () => {
    const r = scoreTrust({
      text: "This is the CRA. Your social insurance number has been suspended due to tax fraud. An arrest warrant is issued. Pay immediately with gift cards or press 1.",
      channel: "call_transcript",
    });
    expect(r.trustScore).toBeLessThan(25);
    expect(r.verdict).toBe("dangerous");
    expect(r.detectedScript?.id).toBe("cra_arrest");
    expect(r.action).toBe("block_and_report");
  });

  it("flags an Interac e-transfer phish with a lookalike domain", () => {
    const r = scoreTrust({
      text: "INTERAC: your transfer is pending. Click to accept: http://interac-secure-deposit.xyz/login",
      channel: "sms",
    });
    expect(r.trustScore).toBeLessThan(45);
    const ledger = Object.fromEntries(r.ledger.map((l) => [l.family, l]));
    expect(ledger.artifact.risk).toBeGreaterThan(0.5);
    expect(ledger.content.risk).toBeGreaterThan(0.3);
  });

  it("flags the Canada Post duty smish", () => {
    const r = scoreTrust({
      text: "Canada Post: your parcel could not be delivered. Pay a small customs fee to schedule redelivery: https://canadapost.delivery-fee.top/pay",
      channel: "sms",
    });
    expect(r.trustScore).toBeLessThan(45);
    expect(r.detectedScript?.id).toBe("canada_post_duty");
  });

  it("detects pig-butchering stage and treats it as a long con", () => {
    const r = scoreTrust({
      text: "Good morning my dear, thinking of you. My mentor shared new trading signals — this exclusive platform can double your money. Just pay the tax to withdraw your profit.",
      channel: "investment",
    });
    expect(r.detectedScript?.id).toBe("pig_butchering");
    expect(r.detectedScript?.stage).toBeGreaterThanOrEqual(3);
    expect(r.trustScore).toBeLessThan(35);
  });

  it("flags gift-card extraction regardless of pretext", () => {
    const r = scoreTrust({
      text: "Hi it's your boss, I'm in a meeting. Please buy 5 Apple gift cards and send me the codes urgently.",
      channel: "sms",
    });
    expect(r.trustScore).toBeLessThan(40);
  });
});

describe("Trust Engine — real-world phishing (not just the named corpus)", () => {
  it("flags a brand-lookalike phishing link as dangerous, not merely caution", () => {
    const r = scoreTrust({ text: "Your PayPal account has been locked. Verify now: http://account-verify-paypal.com/login" });
    expect(r.trustScore).toBeLessThan(35);
    expect(["likely_scam", "dangerous"]).toContain(r.verdict);
  });

  it("does not score an IP-literal phishing URL as safe", () => {
    const r = scoreTrust({ text: "Account alert, log in here: http://192.168.10.5/secure/bank" });
    expect(r.trustScore).toBeLessThan(60);
    expect(r.ledger.find((l) => l.family === "artifact")!.risk).toBeGreaterThan(0.5);
  });

  it("flags generic phishing grammar even with an unknown brand", () => {
    const r = scoreTrust({ text: "We noticed unusual sign-in activity. Verify your account immediately at http://secure-login-update.top to avoid suspension." });
    expect(r.trustScore).toBeLessThan(35);
  });

  it("flags a homoglyph/punycode domain", () => {
    const r = scoreTrust({ text: "Update your details: https://xn--paypl-9wa.com/login" });
    expect(r.trustScore).toBeLessThan(45);
  });

  it("one strong signal is decisive — a known-bad domain isn't diluted by calm prose", () => {
    const r = scoreTrust({ text: "Hello, please see the document at http://interac-secure-deposit.xyz/file" });
    expect(r.trustScore).toBeLessThan(40);
  });
});

describe("Trust Engine — legitimate messages are NOT punished", () => {
  it("treats a normal friendly text as safe", () => {
    const r = scoreTrust({
      text: "Hey, are we still on for dinner at 7 tonight? Let me know!",
      channel: "sms",
    });
    expect(r.trustScore).toBeGreaterThanOrEqual(70);
    expect(r.verdict).toBe("safe");
  });

  it("does not flag a real canada.ca link", () => {
    const r = scoreTrust({
      text: "You can find the form on the official site: https://www.canada.ca/en/revenue-agency.html",
      channel: "link",
    });
    expect(r.trustScore).toBeGreaterThanOrEqual(60);
  });
});

describe("Trust Engine — network plane corroboration", () => {
  const network: NetworkLookup = {
    lookup(artifact) {
      if (artifact.includes("scam-pay.top") || artifact === "6045551234") {
        return { artifact, reports: 7, confidence: 0.9, category: "phishing" };
      }
      return null;
    },
  };

  it("raises risk when the community has flagged the artifact", () => {
    const withNet = scoreTrust({
      text: "Verify your account here: https://scam-pay.top/login",
      channel: "link",
      network,
    });
    const without = scoreTrust({
      text: "Verify your account here: https://scam-pay.top/login",
      channel: "link",
    });
    expect(withNet.trustScore).toBeLessThanOrEqual(without.trustScore);
    expect(withNet.ledger.find((l) => l.family === "network")!.risk).toBeGreaterThan(0.5);
  });
});

describe("Trust Engine — calibrated honesty", () => {
  it("reports high uncertainty when evidence is thin", () => {
    const r = scoreTrust({ text: "ok" });
    expect(r.uncertainty).toBeGreaterThan(10);
  });

  it("reports low uncertainty when evidence is rich", () => {
    const r = scoreTrust({
      text: "CRA arrest warrant: your SIN is suspended, pay with bitcoin immediately or police will arrest you. Officer badge 4471, case number 9921. http://cra-refund-gov.xyz",
      channel: "call_transcript",
    });
    // Rich evidence => a tight confidence band (we are sure), independent of
    // how dangerous the verdict itself is.
    expect(r.uncertainty).toBeLessThan(20);
  });

  it("always returns exactly the top three reasons or fewer, never more", () => {
    const r = scoreTrust({
      text: "CRA arrest warrant pay with gift cards immediately officer government urgent http://cra-fake.xyz",
    });
    expect(r.topReasons.length).toBeLessThanOrEqual(3);
  });

  it("produces a 1..100 score and a stable decision id", () => {
    const r = scoreTrust({ text: "hello world" });
    expect(r.trustScore).toBeGreaterThanOrEqual(1);
    expect(r.trustScore).toBeLessThanOrEqual(100);
    expect(r.decisionId).toMatch(/^[A-Z0-9]+$/);
  });
});

describe("Trust Engine — expanded corpus", () => {
  it("flags a utility-disconnection threat", () => {
    const r = scoreTrust({ text: "BC Hydro: your power will be disconnected in 30 minutes for an overdue bill. Pay the reconnection fee now or a technician is on the way.", channel: "call_transcript" });
    expect(r.detectedScript?.id).toBe("utility_disconnect");
    expect(r.trustScore).toBeLessThan(45);
  });

  it("flags an unpaid-toll smish", () => {
    const r = scoreTrust({ text: "Final notice: you have an unpaid toll charge of $4.80. Pay your toll now to avoid penalties: http://407-toll-pay.top/pay", channel: "sms" });
    expect(r.detectedScript?.id).toBe("toll_unpaid");
    expect(r.trustScore).toBeLessThan(45);
  });

  it("flags an 'is this you' account-takeover OTP scam", () => {
    const r = scoreTrust({ text: "Amazon security: did you try to log in? We sent you a code — reply YES to verify and read us the one-time code to confirm it's you.", channel: "sms" });
    expect(r.detectedScript?.id).toBe("account_takeover_otp");
    expect(r.trustScore).toBeLessThan(45);
  });

  it("flags a sight-unseen rental deposit scam", () => {
    const r = scoreTrust({ text: "I'm currently abroad and can't show it in person, but if you e-transfer the deposit to hold it, the keys will be couriered to you.", channel: "unknown" });
    expect(r.detectedScript?.id).toBe("rental_deposit");
  });
});

describe("Trust Engine — twelve-language labels", () => {
  it("renders verdict + action labels in Spanish, Korean, Arabic", () => {
    for (const language of ["es", "ko", "ar"] as const) {
      const e = explain(scoreTrust({ text: "hello", language }));
      expect(e.verdictLabel.length).toBeGreaterThan(0);
      expect(e.actionLabel.length).toBeGreaterThan(0);
    }
  });

  it("auto-detects Korean and Arabic scripts", () => {
    expect(scoreTrust({ text: "국세청입니다. 즉시 비트코인으로 지불하지 않으면 체포됩니다." }).language).toBe("ko");
    expect(scoreTrust({ text: "هذه وكالة الإيرادات. ادفع فورًا أو سيتم اعتقالك." }).language).toBe("ar");
  });
});

describe("Trust Engine — localization", () => {
  it("renders reasons in French when asked", () => {
    const r = scoreTrust({
      text: "Agence du revenu: votre numéro d'assurance sociale est suspendu. Mandat d'arrêt. Payez immédiatement.",
      language: "fr",
    });
    const e = explain(r);
    expect(e.verdictLabel).toMatch(/[Dd]angereux|prudent|arnaque/);
    expect(e.reasons.join(" ")).toMatch(/arnaque|pression|immédiatement|fraudeurs/i);
  });

  it("auto-detects Chinese input", () => {
    const r = scoreTrust({
      text: "税务局通知：您的社会保险号已冻结，请立即用比特币付款，否则将被逮捕。",
    });
    expect(r.language).toBe("zh");
    expect(r.trustScore).toBeLessThan(45);
  });
});
