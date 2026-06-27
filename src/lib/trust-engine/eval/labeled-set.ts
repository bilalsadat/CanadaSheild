import type { Channel, Language } from "../types";

/**
 * A small labeled calibration set. This is the seed of the published quarterly
 * calibration report — including the misses. It is deliberately balanced with
 * legitimate messages, because the metric that matters most for a trust product
 * is the false-positive rate on real life.
 *
 * `fraud: true` means the message IS a scam (we want a LOW trust score).
 */
export interface LabeledCase {
  id: string;
  text: string;
  channel?: Channel;
  language?: Language;
  fraud: boolean;
  note?: string;
}

export const LABELED_SET: LabeledCase[] = [
  // ---- Fraud cases (should score low) ----
  { id: "cra-1", fraud: true, channel: "call_transcript", text: "This is the CRA. Your SIN has been suspended for tax fraud and an arrest warrant is issued. Pay immediately with gift cards or press 1." },
  { id: "interac-1", fraud: true, channel: "sms", text: "INTERAC: your transfer is pending, click to accept: http://interac-secure-deposit.xyz/login" },
  { id: "post-1", fraud: true, channel: "sms", text: "Canada Post: parcel held, pay customs fee to reschedule delivery https://canadapost.delivery-fee.top/pay" },
  { id: "ircc-1", fraud: true, channel: "sms", text: "IRCC notice: your study permit will be cancelled, deportation pending. Pay the biometrics fee now at ircc-status-update.click" },
  { id: "grand-1", fraud: true, channel: "call_transcript", text: "Grandma it's me, I had an accident and I was arrested. I need bail money urgently, please don't tell mom, send an e-transfer." },
  { id: "pig-1", fraud: true, channel: "investment", text: "Good morning love, my mentor's exclusive platform can double your money. You withdrew a profit already, now just pay the tax to withdraw the rest." },
  { id: "bank-1", fraud: true, channel: "call_transcript", text: "This is your bank fraud department. We detected a suspicious transaction. Read me the one-time passcode so we can move your money to a safe account." },
  { id: "tech-1", fraud: true, channel: "call_transcript", text: "Microsoft support: your computer is infected with a virus. Install AnyDesk so we can get remote access and fix it." },
  { id: "giftcard-1", fraud: true, channel: "sms", text: "Hi it's your boss, I'm in a meeting, urgently buy 5 Apple gift cards and send me the codes." },
  { id: "lottery-1", fraud: true, channel: "sms", text: "Congratulations you won the lottery! To claim your prize, pay a small processing fee with a Google Play card." },
  { id: "job-1", fraud: true, channel: "job_offer", text: "Work from home, earn $500 a day, no experience needed. We'll send you a cheque — just deposit it and buy equipment upfront." },
  { id: "sext-1", fraud: true, channel: "sms", text: "I recorded you through your camera. Pay 0.05 bitcoin within 24 hours or I send the video to all your contacts." },
  { id: "zh-1", fraud: true, language: "zh", text: "税务局通知：您的社会保险号已冻结，请立即用比特币付款，否则将被逮捕。" },
  { id: "fr-1", fraud: true, language: "fr", text: "Agence du revenu: votre numéro d'assurance sociale est suspendu. Mandat d'arrêt. Payez immédiatement avec une carte cadeau." },

  // ---- Legitimate cases (should score high) ----
  { id: "legit-1", fraud: false, channel: "sms", text: "Hey, are we still on for dinner at 7 tonight? Let me know!" },
  { id: "legit-2", fraud: false, channel: "sms", text: "Your appointment with Dr. Lee is confirmed for Tuesday at 2pm. Reply C to cancel." },
  { id: "legit-3", fraud: false, channel: "link", text: "Here's the official CRA page about the climate action incentive: https://www.canada.ca/en/revenue-agency.html" },
  { id: "legit-4", fraud: false, channel: "email", text: "Thanks for your order! Your package shipped and will arrive Thursday. Track it in your account." },
  { id: "legit-5", fraud: false, channel: "sms", text: "Mom, can you pick up milk on the way home? Love you." },
  { id: "legit-6", fraud: false, channel: "sms", text: "Your verification code is 488213. It expires in 10 minutes. We will never call to ask for it." },
  { id: "legit-7", fraud: false, channel: "email", text: "Reminder: your library books are due next week. Renew online anytime." },
  { id: "legit-fr-1", fraud: false, language: "fr", text: "Bonjour, votre colis sera livré demain entre 9h et 12h. Merci de votre commande." },
];
