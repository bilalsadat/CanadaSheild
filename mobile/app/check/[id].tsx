import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card, Small, Body, Kicker, Row, Pill } from "../../components/ui";
import { ScoreRing } from "../../components/ScoreRing";
import { Enter } from "../../components/Motion";
import { useKinShield } from "../../lib/store";
import { useT } from "../../lib/i18n";
import { colors, font, space, verdictColor } from "../../lib/theme";

const FAMILY_LABEL: Record<string, string> = {
  content: "Content / script",
  artifact: "Links & artifacts",
  authenticity: "Voice/video",
  network: "Community network",
  anomaly: "Out-of-pattern",
};

export default function CheckDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ks = useKinShield();
  const t = useT();
  const rec = ks.history.find((h) => h.id === id);

  if (!rec) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ title: t("check.title") }} />
        <Body>{t("check.notFound")}</Body>
      </View>
    );
  }

  const color = verdictColor(rec.verdict);
  const d = rec.detail;
  const icon = rec.verdict === "safe" ? "shield-checkmark" : rec.verdict === "caution" ? "alert" : "warning";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.lg, paddingBottom: 60 }}>
      <Stack.Screen options={{ title: t("check.title") }} />

      <Enter>
        <Card style={{ alignItems: "center", paddingVertical: space.xl, borderColor: color + "44" }}>
          <ScoreRing score={rec.score} size={150} uncertainty={d?.uncertainty} />
          <Row style={{ gap: 6, marginTop: space.md }}>
            <Ionicons name={icon} size={18} color={color} />
            <Text style={{ color, fontSize: font.h3, fontWeight: font.bold }}>{d?.verdictLabel ?? rec.verdict}</Text>
          </Row>
          {d?.actionLabel && (
            <Small style={{ marginTop: 4 }}>
              {t("check.recommended")}: <Text style={{ color: colors.text, fontWeight: font.semibold }}>{d.actionLabel}</Text>
            </Small>
          )}
          <Row style={{ gap: 6, marginTop: space.md }}>
            <Pill label={rec.channel.replace("_", " ")} />
            <Pill label={new Date(rec.ts).toLocaleString()} />
          </Row>
        </Card>
      </Enter>

      {(d?.fullText || rec.snippet) && (
        <Enter delay={60}>
          <Card style={{ marginTop: space.md }}>
            <Kicker color={colors.textMute}>{t("check.whatWasChecked")}</Kicker>
            <Body style={{ color: colors.text, marginTop: 6 }}>{d?.fullText ?? rec.snippet}</Body>
          </Card>
        </Enter>
      )}

      {d?.scriptLabel && (
        <Enter delay={100}>
          <Card style={{ marginTop: space.md, backgroundColor: color + "12", borderColor: color + "44" }}>
            <Kicker color={color}>{t("check.scriptIdentified")}</Kicker>
            <Text style={{ color: colors.text, fontWeight: font.bold, fontSize: font.body, marginTop: 4 }}>{d.scriptLabel}</Text>
            {d.scriptStage ? <Small style={{ marginTop: 2 }}>{t("check.stage", { n: d.scriptStage })}</Small> : null}
          </Card>
        </Enter>
      )}

      {d && d.reasons.length > 0 && (
        <Enter delay={140}>
          <Card style={{ marginTop: space.md }}>
            <Kicker color={colors.textMute}>{t("check.why")}</Kicker>
            <View style={{ marginTop: 8, gap: 8 }}>
              {d.reasons.map((r, i) => (
                <Row key={i} style={{ alignItems: "flex-start", gap: 8 }}>
                  <Ionicons name="ellipse" size={6} color={color} style={{ marginTop: 7 }} />
                  <Text style={{ color: colors.text, fontSize: font.body, flex: 1, lineHeight: 21 }}>{r}</Text>
                </Row>
              ))}
            </View>
          </Card>
        </Enter>
      )}

      {d && d.ledger.length > 0 && (
        <Enter delay={180}>
          <Card style={{ marginTop: space.md }}>
            <Row style={{ justifyContent: "space-between" }}>
              <Kicker color={colors.textMute}>{t("check.ledger")}</Kicker>
              <Small>±{d.uncertainty}</Small>
            </Row>
            <View style={{ marginTop: 10, gap: 8 }}>
              {d.ledger.map((l) => (
                <Row key={l.family} style={{ gap: 10 }}>
                  <Text style={{ color: colors.textDim, fontSize: font.tiny, width: 96 }}>{FAMILY_LABEL[l.family] ?? l.family}</Text>
                  <View style={{ flex: 1, height: 7, borderRadius: 4, backgroundColor: "rgba(148,163,184,0.12)", overflow: "hidden" }}>
                    <View style={{ height: 7, width: `${Math.round(l.risk * 100)}%`, backgroundColor: l.risk >= 0.5 ? color : "rgba(148,163,184,0.5)", borderRadius: 4 }} />
                  </View>
                  <Text style={{ color: colors.textMute, fontSize: font.tiny, width: 32, textAlign: "right", fontVariant: ["tabular-nums"] }}>
                    {Math.round(l.risk * 100)}%
                  </Text>
                </Row>
              ))}
            </View>
            <Small style={{ marginTop: 8 }}>{t("check.ledgerNote")}</Small>
          </Card>
        </Enter>
      )}

      {!d && (
        <Card style={{ marginTop: space.md }}>
          <Small>{t("check.noDetail")}</Small>
        </Card>
      )}
    </ScrollView>
  );
}
