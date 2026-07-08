import React, { useMemo } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, Title, H3, Body, Small, Kicker, Row } from "../../components/ui";
import { ScoreRing } from "../../components/ScoreRing";
import { BarChart } from "../../components/BarChart";
import { Enter, PressableScale } from "../../components/Motion";
import { LogoMark } from "../../components/Logo";
import { useVraiShield } from "../../lib/store";
import { useT } from "../../lib/i18n";
import { THREAT_CITIES, NATIONAL_STATS } from "../../lib/data";
import { colors, font, space, radius, verdictColor } from "../../lib/theme";

const COL = (Dimensions.get("window").width - space.lg * 2 - space.md) / 2;

export default function Dashboard() {
  const ks = useVraiShield();
  const router = useRouter();
  const t = useT();

  const checks = ks.history.length;
  const threats = ks.history.filter((h) => h.verdict === "dangerous" || h.verdict === "likely_scam").length;
  const posture = useMemo(() => computePosture(ks.hardeningScore, threats, checks), [ks.hardeningScore, threats, checks]);
  const week = useMemo(() => last7(ks.history), [ks.history]);
  const topCity = THREAT_CITIES[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? t("dash.morning") : hour < 18 ? t("dash.afternoon") : t("dash.evening");

  return (
    <Screen>
      {/* Header */}
      <Enter>
        <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: space.xl }}>
          <View style={{ flex: 1 }}>
            <Row style={{ gap: 6, marginBottom: 6 }}>
              <LogoMark size={18} />
              <Kicker color={colors.textMute}>{greet}</Kicker>
            </Row>
            <Title>{ks.profile.name || t("dash.welcome")}</Title>
          </View>
          <PressableScale haptic onPress={() => router.push("/alerts")}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="notifications-outline" size={21} color={colors.text} />
              {ks.unreadAlerts > 0 && (
                <View style={{ position: "absolute", top: 8, right: 9, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center", paddingHorizontal: 4, borderWidth: 2, borderColor: colors.bg }}>
                  <Text style={{ color: "#fff", fontSize: 9, fontWeight: "800" }}>{ks.unreadAlerts > 9 ? "9+" : ks.unreadAlerts}</Text>
                </View>
              )}
            </View>
          </PressableScale>
        </Row>
      </Enter>

      {!ks.onboarded && (
        <Enter delay={40}>
          <PressableScale haptic onPress={() => router.push("/welcome")} style={{ marginBottom: space.md }}>
            <Card style={{ borderColor: colors.primary + "55", backgroundColor: colors.primaryDim }}>
              <Row>
                <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primary + "22", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <H3>{t("dash.finishSetup")}</H3>
                  <Small>{t("dash.finishSetupSub")}</Small>
                </View>
                <Ionicons name="arrow-forward" size={20} color={colors.primary} />
              </Row>
            </Card>
          </PressableScale>
        </Enter>
      )}

      {/* Hero — protection posture (the one meter this view leads with) */}
      <Enter delay={80}>
        <Card style={{ marginBottom: space.md, paddingVertical: space.xl }}>
          <Row style={{ gap: space.xl }}>
            <ScoreRing score={posture.score} size={130} label="" />
            <View style={{ flex: 1 }}>
              <Kicker color={colors.textMute}>{t("dash.householdProtection")}</Kicker>
              <Text style={{ color: posture.color, fontSize: 21, fontWeight: font.bold, marginTop: 4 }}>{t(posture.labelKey)}</Text>
              <Small style={{ marginTop: 6 }}>{t(posture.hintKey)}</Small>
              <Pressable onPress={() => router.push("/feature/passkey-coach")} style={{ marginTop: 12, flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ color: colors.primary, fontSize: font.small, fontWeight: font.semibold }}>{t("common.improveScore")}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </Pressable>
            </View>
          </Row>
        </Card>
      </Enter>

      {/* KPI strip */}
      <Enter delay={120}>
        <Row style={{ gap: space.sm, marginBottom: space.xl }}>
          <StatTile icon="shield-checkmark" value={String(checks)} label={t("dash.checks")} tint={colors.primary} />
          <StatTile icon="warning" value={String(threats)} label={t("dash.threatsCaught")} tint={colors.threat} />
          <StatTile icon="key" value={`${ks.hardeningScore}`} label={t("dash.hardening")} tint={colors.info} onPress={() => router.push("/feature/passkey-coach")} />
        </Row>
      </Enter>

      {/* Activity */}
      <Enter delay={160}>
        <Section title={t("dash.activity")} right={t("dash.last7")} />
        <Card style={{ marginBottom: space.xl }}>
          <BarChart data={week} />
        </Card>
      </Enter>

      {/* Threats near you */}
      <Enter delay={200}>
        <Section title={t("dash.threatsNear")} right={t("common.openMap")} onRight={() => router.push("/map")} />
        <PressableScale haptic onPress={() => router.push("/map")} style={{ marginBottom: space.xl }}>
          <Card>
            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Row style={{ gap: space.md, flex: 1 }}>
                <View style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.dangerDim, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="location" size={22} color={colors.threat} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: font.body, fontWeight: font.semibold }}>{topCity.city}, {topCity.region}</Text>
                  <Small>{topCity.topCategory}</Small>
                </View>
              </Row>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: colors.threat, fontSize: font.h2, fontWeight: font.bold }}>{topCity.reports}</Text>
                <Small>{t("dash.reports")}</Small>
              </View>
            </Row>
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: space.md }} />
            <Small>{t("dash.reportsTracked", { n: NATIONAL_STATS.totalReports, c: NATIONAL_STATS.cities })}</Small>
          </Card>
        </PressableScale>
      </Enter>

      {/* Recent checks — every row reopens its full verdict */}
      <Enter delay={240}>
        <Section title={t("dash.recentChecks")} right={ks.history.length > 0 ? t("dash.viewAll") : t("common.checkNow")} onRight={() => router.push(ks.history.length > 0 ? "/history" : "/protect")} />
        {ks.history.length === 0 ? (
          <Card style={{ marginBottom: space.xl, alignItems: "center", paddingVertical: space.xl }}>
            <Ionicons name="scan-outline" size={28} color={colors.textMute} />
            <Body style={{ textAlign: "center", marginTop: 10 }}>{t("dash.noChecks")}</Body>
            <Small style={{ textAlign: "center", marginTop: 2 }}>{t("dash.noChecksSub")}</Small>
          </Card>
        ) : (
          <View style={{ gap: space.sm, marginBottom: space.xl }}>
            {ks.history.slice(0, 4).map((h) => (
              <PressableScale key={h.id} onPress={() => router.push(`/check/${h.id}`)}>
                <Card style={{ paddingVertical: 12 }}>
                  <Row>
                    <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: verdictColor(h.verdict) + "22" }}>
                      <Text style={{ color: verdictColor(h.verdict), fontWeight: font.bold, fontSize: 15 }}>{h.score}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={{ color: colors.text, fontSize: font.body }}>{h.snippet || h.scriptLabel || "—"}</Text>
                      <Small style={{ textTransform: "capitalize" }}>{h.channel.replace("_", " ")} · {timeAgo(h.ts)}</Small>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textMute} />
                  </Row>
                </Card>
              </PressableScale>
            ))}
          </View>
        )}
      </Enter>

      {/* Quick actions */}
      <Enter delay={280}>
        <Section title={t("dash.quickActions")} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: space.md }}>
          <ActionTile icon="card" label={t("qa.beforeSend")} onPress={() => router.push("/feature/check-before-you-send")} />
          <ActionTile icon="alert-circle" label={t("qa.incident")} tint={colors.danger} onPress={() => router.push("/incident")} />
          <ActionTile icon="chatbox-ellipses" label={t("qa.sms")} onPress={() => router.push("/feature/sms-shield")} />
          <ActionTile icon="time" label={t("qa.longcon")} onPress={() => router.push("/feature/long-con-radar")} />
        </View>
      </Enter>
    </Screen>
  );
}

function Section({ title, right, onRight }: { title: string; right?: string; onRight?: () => void }) {
  return (
    <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: space.md }}>
      <H3>{title}</H3>
      {right && (
        <Pressable onPress={onRight} disabled={!onRight} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Text style={{ color: onRight ? colors.primary : colors.textMute, fontSize: font.small, fontWeight: font.medium }}>{right}</Text>
          {onRight && <Ionicons name="chevron-forward" size={13} color={colors.primary} />}
        </Pressable>
      )}
    </Row>
  );
}

function StatTile({ icon, value, label, tint, onPress }: { icon: any; value: string; label: string; tint: string; onPress?: () => void }) {
  const body = (
    <Card style={{ flex: 1, paddingVertical: space.lg, paddingHorizontal: space.md }}>
      <Ionicons name={icon} size={18} color={tint} />
      <Text style={{ color: colors.text, fontSize: 26, fontWeight: font.bold, marginTop: 10 }}>{value}</Text>
      <Small numberOfLines={1}>{label}</Small>
    </Card>
  );
  return onPress ? <PressableScale onPress={onPress} style={{ flex: 1 }}>{body}</PressableScale> : body;
}

function ActionTile({ icon, label, onPress, tint = colors.primary }: { icon: any; label: string; onPress: () => void; tint?: string }) {
  return (
    <PressableScale haptic onPress={onPress} style={{ width: COL }}>
      <Card style={{ minHeight: 112, justifyContent: "space-between" }}>
        <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: tint + "1A", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name={icon} size={20} color={tint} />
        </View>
        <Text numberOfLines={2} style={{ color: colors.text, fontSize: font.body, fontWeight: font.semibold, marginTop: 14 }}>{label}</Text>
      </Card>
    </PressableScale>
  );
}

function computePosture(hardening: number, threats: number, checks: number) {
  let score = 40 + Math.round(hardening * 0.45) + Math.min(15, checks * 2);
  if (checks > 0 && threats / Math.max(checks, 1) > 0.5) score -= 6;
  score = Math.max(10, Math.min(100, score));
  const color = score >= 70 ? colors.safe : score >= 45 ? colors.caution : colors.threat;
  const labelKey = score >= 80 ? "posture.strong" : score >= 60 ? "posture.well" : score >= 40 ? "posture.setup" : "posture.attention";
  const hintKey = hardening < 50 ? "posture.hintHarden" : checks === 0 ? "posture.hintFirst" : "posture.hintActive";
  return { score, color, labelKey, hintKey };
}

function last7(history: { ts: number }[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const next = d.getTime() + 86400000;
    return { label: d.toLocaleDateString(undefined, { weekday: "narrow" }), value: history.filter((h) => h.ts >= d.getTime() && h.ts < next).length };
  });
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
