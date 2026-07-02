import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Keyboard, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { Card, Title, Small, Kicker, Button, Chip, Row } from "../../components/ui";
import { VerdictView } from "../../components/VerdictView";
import { Enter, PressableScale } from "../../components/Motion";
import { scoreTrust, explain } from "../../lib/trust-engine";
import { networkLookup } from "../../lib/data";
import { useVraiShield } from "../../lib/store";
import { toScanDetail } from "../../lib/verdict";
import { useT } from "../../lib/i18n";
import { colors, space, font, radius } from "../../lib/theme";

const EXAMPLES: { label: string; text: string; channel: any }[] = [
  { label: "CRA arrest call", channel: "call_transcript", text: "This is the CRA. Your social insurance number has been suspended for tax fraud and an arrest warrant has been issued. Do not hang up. Pay immediately with gift cards or press 1." },
  { label: "Interac text", channel: "sms", text: "INTERAC: Your transfer of $250 is pending. Accept within 24 hours: http://interac-secure-deposit.xyz/login" },
  { label: "Pig-butchering", channel: "investment", text: "Good morning my dear, thinking of you. My mentor shared trading signals on this exclusive platform — we can double your money. Just pay the tax to withdraw your profit." },
  { label: "Normal text", channel: "sms", text: "Hey! Are we still on for dinner at 7 tonight? Let me know." },
];

const captureStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  gap: 8,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.md,
  paddingVertical: 14,
};

export default function Protect() {
  const ks = useVraiShield();
  const router = useRouter();
  const t = useT();
  const seniorScale = ks.settings.seniorMode ? 1.25 : 1;
  const [text, setText] = useState("");
  const [channel, setChannel] = useState<string>("unknown");
  const [warned, setWarned] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreTrust> | null>(null);
  const [rendered, setRendered] = useState<ReturnType<typeof explain> | null>(null);

  async function pasteAndCheck() {
    try {
      const clip = await Clipboard.getStringAsync();
      if (clip && clip.trim()) {
        setText(clip);
        run(clip, "unknown");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      }
    } catch {
      /* clipboard unavailable */
    }
  }

  function run(t = text, ch: any = channel) {
    if (!t.trim()) return;
    Keyboard.dismiss();
    setWarned(false);
    const r = scoreTrust({ text: t, channel: ch, language: ks.settings.language, network: networkLookup });
    const e = explain(r);
    setResult(r);
    setRendered(e);
    ks.addScan({
      channel: ch,
      score: r.trustScore,
      verdict: r.verdict,
      snippet: t.slice(0, 80),
      scriptLabel: r.detectedScript?.label,
      detail: toScanDetail(r, e, t),
    });
    if (ks.settings.haptics) {
      Haptics.notificationAsync(r.trustScore < 45 ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    if (ks.settings.speakVerdicts) {
      Speech.stop();
      const locale: Record<string, string> = { en: "en-CA", fr: "fr-CA", es: "es-ES", zh: "zh-CN", pt: "pt-BR", ko: "ko-KR", ar: "ar-SA", hi: "hi-IN", vi: "vi-VN" };
      Speech.speak(`${e.verdictLabel}. Trust score ${r.trustScore}. ${e.actionLabel}.`, { language: locale[r.language] ?? "en-CA", rate: 0.96 });
    }
  }

  async function warnSomeone() {
    if (!result || !rendered) return;
    try {
      await Share.share({
        message: t("share.body", {
          score: result.trustScore,
          verdict: rendered.verdictLabel,
          snippet: text.slice(0, 120),
          reason: rendered.reasons[0] ?? "",
        }),
      });
      setWarned(true);
    } catch { /* user cancelled */ }
  }

  const CHANNELS: { key: string; label: string; icon: any }[] = [
    { key: "unknown", label: t("ch.auto"), icon: "sparkles-outline" },
    { key: "sms", label: t("ch.sms"), icon: "chatbox-outline" },
    { key: "email", label: t("ch.email"), icon: "mail-outline" },
    { key: "call_transcript", label: t("ch.call"), icon: "call-outline" },
    { key: "investment", label: t("ch.money"), icon: "cash-outline" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 130 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Kicker>{t("protect.kicker")}</Kicker>
        <Title style={{ marginTop: 4, fontSize: font.h1 * seniorScale }}>{t("protect.title")}</Title>
        <Small style={{ marginTop: 4, marginBottom: space.lg, fontSize: font.small * seniorScale, lineHeight: 19 * seniorScale }}>{t("protect.sub")}</Small>

        <Card>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t("protect.placeholder")}
            placeholderTextColor={colors.textMute}
            multiline
            style={{ color: colors.text, fontSize: font.body * seniorScale, minHeight: 96 * seniorScale, textAlignVertical: "top", lineHeight: 22 * seniorScale }}
          />
          <Row style={{ marginTop: 12, gap: 10 }}>
            <Button label={t("protect.check")} icon="shield-checkmark" onPress={() => run()} style={{ flex: 1 }} />
            {text.length > 0 && (
              <Pressable onPress={() => { setText(""); setResult(null); }} style={{ padding: 12 }}>
                <Ionicons name="close-circle" size={22} color={colors.textMute} />
              </Pressable>
            )}
          </Row>
        </Card>

        {/* Channel picker — tells the engine what it's judging */}
        <Small style={{ marginBottom: 8 }}>{t("ch.label")}</Small>
        <Row style={{ gap: 8, marginBottom: space.md, flexWrap: "wrap" }}>
          {CHANNELS.map((c) => (
            <Pressable key={c.key} onPress={() => setChannel(c.key)} style={{ flexDirection: "row", alignItems: "center", gap: 5, borderRadius: radius.pill, borderWidth: 1, borderColor: channel === c.key ? colors.primary : colors.border, backgroundColor: channel === c.key ? colors.primaryDim : "transparent", paddingHorizontal: 12, paddingVertical: 7 }}>
              <Ionicons name={c.icon} size={13} color={channel === c.key ? colors.primary : colors.textMute} />
              <Text style={{ color: channel === c.key ? colors.primary : colors.textDim, fontSize: font.small, fontWeight: font.medium }}>{c.label}</Text>
            </Pressable>
          ))}
        </Row>

        {/* Real on-device capture actions */}
        <Row style={{ gap: space.md, marginBottom: space.lg }}>
          <PressableScale haptic onPress={pasteAndCheck} style={{ flex: 1 }}>
            <View style={captureStyle}>
              <Ionicons name="clipboard-outline" size={20} color={colors.primary} />
              <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: font.small * seniorScale }}>{t("protect.paste")}</Text>
            </View>
          </PressableScale>
          <PressableScale haptic onPress={() => router.push("/scan")} style={{ flex: 1 }}>
            <View style={captureStyle}>
              <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
              <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: font.small * seniorScale }}>{t("protect.scan")}</Text>
            </View>
          </PressableScale>
        </Row>

        <Kicker color={colors.textDim} >{t("protect.tryExample")}</Kicker>
        <Row style={{ flexWrap: "wrap", gap: 8, marginTop: 10, marginBottom: space.lg }}>
          {EXAMPLES.map((ex) => (
            <Chip key={ex.label} label={ex.label} onPress={() => { setText(ex.text); setChannel(ex.channel); run(ex.text, ex.channel); }} />
          ))}
        </Row>

        {result && rendered && (
          <Enter>
            <View style={{ gap: space.md }}>
              <VerdictView result={result} rendered={rendered} />
              {result.trustScore < 45 && (
                <Row style={{ gap: 10 }}>
                  <Button label={warned ? t("share.warned") : t("share.warn")} icon={warned ? "checkmark-circle" : "share-outline"} onPress={warnSomeone} style={{ flex: 1 }} />
                  <Button label={t("protect.report")} icon="flag" variant="ghost" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} style={{ flex: 1 }} />
                </Row>
              )}
            </View>
          </Enter>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
