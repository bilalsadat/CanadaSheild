import React, { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card, H3, Body, Small, Kicker, Pill, Row, Button, IconBadge } from "../../components/ui";
import { VerdictView } from "../../components/VerdictView";
import { ScoreRing } from "../../components/ScoreRing";
import { FEATURES_BY_SLUG } from "../../lib/features";
import { scoreTrust, explain } from "../../lib/trust-engine";
import { networkLookup } from "../../lib/data";
import { useVraiShield } from "../../lib/store";
import { toScanDetail } from "../../lib/verdict";
import { colors, font, space, scoreColor } from "../../lib/theme";

export default function FeatureDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const f = FEATURES_BY_SLUG[slug ?? ""];

  if (!f) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <Body>Feature not found.</Body>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.lg, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: f.name }} />

      <Row style={{ marginBottom: space.md }}>
        <IconBadge name={f.icon} size={24} />
        <View style={{ flex: 1 }}>
          <Row style={{ gap: 6, flexWrap: "wrap" }}>
            <Text style={{ color: colors.text, fontSize: font.h2, fontWeight: font.bold }}>{f.name}</Text>
            {f.star && <Ionicons name="sparkles" size={14} color={colors.gold} />}
          </Row>
          <Row style={{ gap: 6, marginTop: 4 }}>
            <Pill label={f.phase} />
            <Pill label={f.status === "live" ? "live engine" : "interactive demo"} color={f.status === "live" ? colors.primary : colors.warn} bg={f.status === "live" ? colors.primaryDim : colors.warnDim} />
          </Row>
        </View>
      </Row>
      <Small style={{ marginBottom: space.lg }}>{f.tagline}</Small>

      {/* Interactive demo area */}
      <View style={{ marginBottom: space.lg }}>
        {(f.slug === "ask-vraishield" || f.slug === "link-qr-checker" || f.slug === "check-before-you-send") && <InlineAsk slug={f.slug} />}
        {f.slug === "sms-shield" && <SmsDemo />}
        {f.slug === "long-con-radar" && <LongConDemo />}
        {f.slug === "caller-intelligence" && <CallerCheck />}
        {!["ask-vraishield", "link-qr-checker", "check-before-you-send", "sms-shield", "long-con-radar", "caller-intelligence"].includes(f.slug) && f.demoLines && <Preview lines={f.demoLines} live={f.status === "live"} />}
      </View>

      <Card style={{ marginBottom: space.md }}>
        <Kicker>What it is</Kicker>
        <Body style={{ marginTop: 8, color: colors.text }}>{f.what}</Body>
      </Card>
      <Card style={{ marginBottom: space.md }}>
        <Kicker color={colors.textDim}>How it works</Kicker>
        <View style={{ marginTop: 8, gap: 8 }}>
          {f.how.map((h, i) => (
            <Row key={i} style={{ alignItems: "flex-start", gap: 8 }}>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} style={{ marginTop: 3 }} />
              <Text style={{ color: colors.text, flex: 1, fontSize: font.body, lineHeight: 21 }}>{h}</Text>
            </Row>
          ))}
        </View>
      </Card>
      <Card style={{ borderColor: "rgba(232,184,74,0.3)" }}>
        <Kicker color={colors.gold}>Beats</Kicker>
        <Body style={{ marginTop: 8 }}>{f.beats}</Body>
      </Card>
    </ScrollView>
  );
}

function Preview({ lines, live }: { lines: string[]; live: boolean }) {
  return (
    <Card style={{ borderColor: (live ? colors.primary : colors.warn) + "44" }}>
      <Kicker color={live ? colors.primary : colors.warn}>{live ? "Live preview" : "Sample screen"}</Kicker>
      <View style={{ marginTop: 10, gap: 8 }}>
        {lines.map((l, i) => (
          <View key={i} style={{ backgroundColor: colors.bgElevated, borderRadius: 10, padding: 11, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text, fontSize: font.small }}>{l}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

function InlineAsk({ slug }: { slug: string }) {
  const ks = useVraiShield();
  const router = useRouter();
  const placeholder = slug === "link-qr-checker" ? "Paste a link, e.g. http://interac-secure-deposit.xyz/login" : slug === "check-before-you-send" ? "Who/what are you about to pay? Add the story…" : "Paste anything suspicious…";
  const channel = slug === "link-qr-checker" ? "link" : slug === "check-before-you-send" ? "recipient" : "unknown";
  const [text, setText] = useState("");
  const [res, setRes] = useState<ReturnType<typeof scoreTrust> | null>(null);
  const [rend, setRend] = useState<ReturnType<typeof explain> | null>(null);

  function run() {
    if (!text.trim()) return;
    const r = scoreTrust({ text, url: channel === "link" ? text : undefined, channel: channel as any, language: ks.settings.language, network: networkLookup });
    const e = explain(r);
    setRes(r); setRend(e);
    ks.addScan({ channel: channel as any, score: r.trustScore, verdict: r.verdict, snippet: text.slice(0, 80), scriptLabel: r.detectedScript?.label, detail: toScanDetail(r, e, text) });
  }

  return (
    <View style={{ gap: space.md }}>
      {slug === "link-qr-checker" && (
        <Button label="Scan a real QR code" icon="qr-code" onPress={() => router.push("/scan")} />
      )}
      <Card>
        <TextInput value={text} onChangeText={setText} placeholder={placeholder} placeholderTextColor={colors.textMute} multiline style={{ color: colors.text, fontSize: font.body, minHeight: 70, textAlignVertical: "top" }} />
        <Button label="Check it" icon="shield-checkmark" onPress={run} style={{ marginTop: 10 }} />
      </Card>
      {res && rend && <VerdictView result={res} rendered={rend} />}
    </View>
  );
}

function CallerCheck() {
  const ks = useVraiShield();
  const [num, setNum] = useState("");
  const [res, setRes] = useState<ReturnType<typeof scoreTrust> | null>(null);
  const [rend, setRend] = useState<ReturnType<typeof explain> | null>(null);

  function run() {
    const digits = num.replace(/\D/g, "");
    if (!digits) return;
    const r = scoreTrust({ text: num, recipient: digits, channel: "call_transcript", network: networkLookup });
    const e = explain(r);
    setRes(r); setRend(e);
    ks.addScan({ channel: "call_transcript", score: r.trustScore, verdict: r.verdict, snippet: `Caller ${num}`, scriptLabel: r.detectedScript?.label, detail: toScanDetail(r, e, num) });
  }

  return (
    <View style={{ gap: space.md }}>
      <Card>
        <Small>Check a phone number against the community network before you answer or call back.</Small>
        <TextInput value={num} onChangeText={setNum} placeholder="e.g. 604-555-0147" placeholderTextColor={colors.textMute} keyboardType="phone-pad" style={{ color: colors.text, fontSize: font.body, marginTop: 10, backgroundColor: colors.bgElevated, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 10 }} />
        <Button label="Check this number" icon="search" onPress={run} style={{ marginTop: 10 }} />
        <Small style={{ marginTop: 8 }}>Try 604-555-0147 (flagged) or any other number.</Small>
      </Card>
      {res && rend && <VerdictView result={res} rendered={rend} />}
    </View>
  );
}

const SMS = [
  { from: "+1 604-555-0147", text: "CRA FINAL NOTICE: your SIN is suspended for tax fraud. Arrest warrant issued. Pay with gift cards." },
  { from: "Mom", text: "Can you pick up milk on the way home? love you" },
  { from: "INTERAC", text: "Your e-transfer of $250 is pending. Accept within 24h: http://interac-secure-deposit.xyz/login" },
  { from: "CanadaPost", text: "Parcel held. Pay a $1.45 customs fee to reschedule: https://canadapost.delivery-fee.top/pay" },
  { from: "+1 416-555-0199", text: "Your appointment with Dr. Lee is confirmed for Tuesday at 2pm." },
];

function SmsDemo() {
  const scored = useMemo(() => SMS.map((m) => { const r = scoreTrust({ text: m.text, channel: "sms", network: networkLookup }); return { ...m, r, e: explain(r) }; }), []);
  const [open, setOpen] = useState<number | null>(null);
  return (
    <View style={{ gap: 8 }}>
      <Small style={{ marginBottom: 2 }}>Every message is scored on-device the instant it arrives. Scam texts are filtered before the inbox. Tap to see why.</Small>
      {scored.map((m, i) => (
        <Card key={i} onPress={() => setOpen(open === i ? null : i)} style={{ paddingVertical: 12 }}>
          <Row>
            <View style={{ width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: scoreColor(m.r.trustScore) + "22" }}>
              <Text style={{ color: scoreColor(m.r.trustScore), fontWeight: font.bold }}>{m.r.trustScore}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: font.small }}>{m.from}</Text>
              <Text numberOfLines={open === i ? undefined : 1} style={{ color: colors.textDim, fontSize: font.small }}>{m.text}</Text>
            </View>
          </Row>
          {open === i && (
            <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, gap: 4 }}>
              <Text style={{ color: scoreColor(m.r.trustScore), fontWeight: font.semibold }}>{m.e.verdictLabel} · {m.e.actionLabel}</Text>
              {m.e.reasons.map((r, j) => <Small key={j}>› {r}</Small>)}
              {m.e.reasons.length === 0 && <Small>No fraud signals — a normal message.</Small>}
            </View>
          )}
        </Card>
      ))}
    </View>
  );
}

const THREAD = [
  { from: "them", day: "Wk 1", text: "Good morning, thinking of you. You're so special to me." },
  { from: "them", day: "Wk 2", text: "I feel we can build a future together. Let's move to WhatsApp to talk privately." },
  { from: "them", day: "Wk 3", text: "My mentor shared trading signals — this exclusive platform is how I built my wealth." },
  { from: "them", day: "Wk 4", text: "See? You already made a profit and could withdraw it. Let's invest a little more." },
  { from: "them", day: "Wk 5", text: "Your account is frozen for verification. Just pay the small tax to withdraw your profit." },
];

function LongConDemo() {
  const [step, setStep] = useState(1);
  const cumulative = THREAD.slice(0, step).map((m) => m.text).join(" ");
  const r = scoreTrust({ text: cumulative, channel: "investment", network: networkLookup });
  const stage = r.detectedScript?.stage;
  return (
    <Card>
      <Kicker color={colors.textDim}>Watch it unfold over weeks</Kicker>
      <View style={{ gap: 8, marginVertical: 12 }}>
        {THREAD.slice(0, step).map((m, i) => (
          <View key={i} style={{ backgroundColor: "rgba(148,163,184,0.10)", borderRadius: 12, padding: 10 }}>
            <Text style={{ color: colors.textMute, fontSize: 10 }}>{m.day}</Text>
            <Text style={{ color: colors.text, fontSize: font.small }}>{m.text}</Text>
          </View>
        ))}
      </View>
      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
        <ScoreRing score={r.trustScore} size={88} label="" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          {r.detectedScript ? (
            <>
              <Text style={{ color: colors.threat, fontWeight: font.bold }}>Long con detected</Text>
              <Small>{r.detectedScript.label}{stage ? ` · stage ${stage}/5` : ""}</Small>
            </>
          ) : <Small>No con detected yet — VraiShield keeps watching.</Small>}
        </View>
      </Row>
      <Button label={step < THREAD.length ? "Next message ▶" : "Restart ↺"} variant="ghost" onPress={() => setStep(step < THREAD.length ? step + 1 : 1)} style={{ marginTop: 12 }} />
      {stage && stage >= 3 && (
        <View style={{ marginTop: 12, backgroundColor: colors.dangerDim, borderRadius: 12, padding: 12 }}>
          <Text style={{ color: colors.threat, fontWeight: font.bold }}>Intervention — while it still works</Text>
          <Small style={{ marginTop: 4 }}>The “investment platform” is fake; the “tax to withdraw” is the final extraction. Do not send anything. Screenshot everything and tell one trusted person today.</Small>
        </View>
      )}
    </Card>
  );
}
