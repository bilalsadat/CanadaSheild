import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { Card, Title, Small, Kicker, Button, Chip, Row, H3 } from "../../components/ui";
import { VerdictView } from "../../components/VerdictView";
import { scoreTrust, explain } from "../../lib/trust-engine";
import { networkLookup } from "../../lib/data";
import { useKinShield } from "../../lib/store";
import { colors, space, font } from "../../lib/theme";

const EXAMPLES: { label: string; text: string; channel: any }[] = [
  { label: "CRA arrest call", channel: "call_transcript", text: "This is the CRA. Your social insurance number has been suspended for tax fraud and an arrest warrant has been issued. Do not hang up. Pay immediately with gift cards or press 1." },
  { label: "Interac text", channel: "sms", text: "INTERAC: Your transfer of $250 is pending. Accept within 24 hours: http://interac-secure-deposit.xyz/login" },
  { label: "Pig-butchering", channel: "investment", text: "Good morning my dear, thinking of you. My mentor shared trading signals on this exclusive platform — we can double your money. Just pay the tax to withdraw your profit." },
  { label: "Normal text", channel: "sms", text: "Hey! Are we still on for dinner at 7 tonight? Let me know." },
];

export default function Protect() {
  const ks = useKinShield();
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof scoreTrust> | null>(null);
  const [rendered, setRendered] = useState<ReturnType<typeof explain> | null>(null);

  function run(t = text, channel: any = "unknown") {
    if (!t.trim()) return;
    Keyboard.dismiss();
    const r = scoreTrust({ text: t, channel, language: ks.settings.language, network: networkLookup });
    const e = explain(r);
    setResult(r);
    setRendered(e);
    ks.addScan({ channel, score: r.trustScore, verdict: r.verdict, snippet: t.slice(0, 80), scriptLabel: r.detectedScript?.label });
    Haptics.notificationAsync(r.trustScore < 45 ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (ks.settings.speakVerdicts) {
      Speech.stop();
      const locale: Record<string, string> = { en: "en-CA", fr: "fr-CA", es: "es-ES", zh: "zh-CN", pt: "pt-BR", ko: "ko-KR", ar: "ar-SA", hi: "hi-IN", vi: "vi-VN" };
      Speech.speak(`${e.verdictLabel}. Trust score ${r.trustScore}. ${e.actionLabel}.`, { language: locale[r.language] ?? "en-CA", rate: 0.96 });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 130 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Kicker>The front door</Kicker>
        <Title style={{ marginTop: 4 }}>Ask KinShield</Title>
        <Small style={{ marginTop: 4, marginBottom: space.lg }}>Paste a text, email, ad, job offer, or what a caller said. The Trust Engine runs entirely on your device.</Small>

        <Card>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Paste anything suspicious…"
            placeholderTextColor={colors.textMute}
            multiline
            style={{ color: colors.text, fontSize: font.body, minHeight: 96, textAlignVertical: "top", lineHeight: 22 }}
          />
          <Row style={{ marginTop: 12, gap: 10 }}>
            <Button label="Check it" icon="shield-checkmark" onPress={() => run()} style={{ flex: 1 }} />
            {text.length > 0 && (
              <Pressable onPress={() => { setText(""); setResult(null); }} style={{ padding: 12 }}>
                <Ionicons name="close-circle" size={22} color={colors.textMute} />
              </Pressable>
            )}
          </Row>
        </Card>

        <Kicker color={colors.textDim} >Try a real example</Kicker>
        <Row style={{ flexWrap: "wrap", gap: 8, marginTop: 10, marginBottom: space.lg }}>
          {EXAMPLES.map((ex) => (
            <Chip key={ex.label} label={ex.label} onPress={() => { setText(ex.text); run(ex.text, ex.channel); }} />
          ))}
        </Row>

        {result && rendered && (
          <View style={{ gap: space.md }}>
            <VerdictView result={result} rendered={rendered} />
            {result.trustScore < 45 && (
              <Button label="Report to Community Network" icon="flag" variant="ghost" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
