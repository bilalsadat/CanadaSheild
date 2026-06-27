import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, Title, H3, Body, Small, Kicker, Row } from "../../components/ui";
import { ScoreRing } from "../../components/ScoreRing";
import { BarChart } from "../../components/BarChart";
import { useKinShield } from "../../lib/store";
import { THREAT_CITIES, NATIONAL_STATS } from "../../lib/data";
import { colors, font, space, radius, verdictColor } from "../../lib/theme";

export default function Dashboard() {
  const ks = useKinShield();
  const router = useRouter();

  const checks = ks.history.length;
  const threats = ks.history.filter((h) => h.verdict === "dangerous" || h.verdict === "likely_scam").length;
  const unread = ks.alerts.length;
  const posture = useMemo(() => computePosture(ks.hardeningScore, threats, checks), [ks.hardeningScore, threats, checks]);
  const week = useMemo(() => last7(ks.history), [ks.history]);
  const topCity = THREAT_CITIES[0];
  const hour = new Date().getHours();
  const partOfDay = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Screen>
      {/* Header */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: space.xl }}>
        <View style={{ flex: 1 }}>
          <Kicker color={colors.textMute}>{partOfDay}</Kicker>
          <Title style={{ marginTop: 3 }}>{ks.profile.name || "Welcome"}</Title>
        </View>
        <Pressable onPress={() => router.push("/alerts")} hitSlop={12} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="notifications-outline" size={21} color={colors.text} />
          {unread > 0 && <View style={{ position: "absolute", top: 8, right: 9, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center", paddingHorizontal: 4, borderWidth: 2, borderColor: colors.bg }}><Text style={{ color: "#fff", fontSize: 9, fontWeight: "800" }}>{unread > 9 ? "9+" : unread}</Text></View>}
        </Pressable>
      </Row>

      {!ks.onboarded && (
        <Card onPress={() => router.push("/welcome")} style={{ marginBottom: space.md, borderColor: colors.primary + "55", backgroundColor: colors.primaryDim }}>
          <Row>
            <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primary + "22", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <H3>Finish setting up</H3>
              <Small>Create your Family Circle — 60 seconds.</Small>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </Row>
        </Card>
      )}

      {/* Hero — protection status */}
      <Card style={{ marginBottom: space.md, paddingVertical: space.xl }}>
        <Row style={{ gap: space.xl }}>
          <ScoreRing score={posture.score} size={130} label="Posture" />
          <View style={{ flex: 1 }}>
            <Kicker color={colors.textMute}>Household protection</Kicker>
            <Text style={{ color: posture.color, fontSize: 21, fontWeight: font.bold, marginTop: 4 }}>{posture.label}</Text>
            <Small style={{ marginTop: 6 }}>{posture.hint}</Small>
            <Pressable onPress={() => router.push("/feature/passkey-coach")} style={{ marginTop: 12, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ color: colors.primary, fontSize: font.small, fontWeight: font.semibold }}>Improve score</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </Pressable>
          </View>
        </Row>
      </Card>

      {/* Stat strip */}
      <Row style={{ gap: space.sm, marginBottom: space.xl }}>
        <StatTile icon="shield-checkmark" value={String(checks)} label="Checks" tint={colors.primary} />
        <StatTile icon="warning" value={String(threats)} label="Threats caught" tint={colors.threat} />
        <StatTile icon="key" value={`${ks.hardeningScore}`} label="Hardening" tint={colors.info} onPress={() => router.push("/feature/passkey-coach")} />
      </Row>

      {/* Activity */}
      <Section title="Activity" right="Last 7 days" />
      <Card style={{ marginBottom: space.xl }}>
        <BarChart data={week} />
      </Card>

      {/* Threats near you */}
      <Section title="Threats near you" right="Open map" onRight={() => router.push("/map")} />
      <Card onPress={() => router.push("/map")} style={{ marginBottom: space.xl }}>
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
            <Small>reports</Small>
          </View>
        </Row>
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: space.md }} />
        <Small>{NATIONAL_STATS.totalReports} reports tracked across {NATIONAL_STATS.cities} Canadian cities this week.</Small>
      </Card>

      {/* Recent checks */}
      <Section title="Recent checks" right="Check now" onRight={() => router.push("/protect")} />
      {ks.history.length === 0 ? (
        <Card style={{ marginBottom: space.xl, alignItems: "center", paddingVertical: space.xl }}>
          <Ionicons name="scan-outline" size={28} color={colors.textMute} />
          <Body style={{ textAlign: "center", marginTop: 10 }}>No checks yet.</Body>
          <Small style={{ textAlign: "center", marginTop: 2 }}>Open Protect and paste a suspicious message.</Small>
        </Card>
      ) : (
        <View style={{ gap: space.sm, marginBottom: space.xl }}>
          {ks.history.slice(0, 4).map((h) => (
            <Card key={h.id} style={{ paddingVertical: 12 }}>
              <Row>
                <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: verdictColor(h.verdict) + "22" }}>
                  <Text style={{ color: verdictColor(h.verdict), fontWeight: font.bold, fontSize: 15 }}>{h.score}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ color: colors.text, fontSize: font.body }}>{h.snippet || h.scriptLabel || "Checked message"}</Text>
                  <Small style={{ textTransform: "capitalize" }}>{h.channel.replace("_", " ")} · {timeAgo(h.ts)}</Small>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMute} />
              </Row>
            </Card>
          ))}
        </View>
      )}

      {/* Quick actions */}
      <Section title="Quick actions" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: space.sm }}>
        <ActionTile icon="card" label="Before you send" onPress={() => router.push("/feature/check-before-you-send")} />
        <ActionTile icon="alert-circle" label="Incident Mode" tint={colors.danger} onPress={() => router.push("/incident")} />
        <ActionTile icon="chatbox-ellipses" label="SMS Shield" onPress={() => router.push("/feature/sms-shield")} />
        <ActionTile icon="time" label="Long-Con Radar" onPress={() => router.push("/feature/long-con-radar")} />
      </View>
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
  return (
    <Card onPress={onPress} style={{ flex: 1, paddingVertical: space.lg, paddingHorizontal: space.md }}>
      <Ionicons name={icon} size={18} color={tint} />
      <Text style={{ color: colors.text, fontSize: 26, fontWeight: font.bold, marginTop: 10 }}>{value}</Text>
      <Small numberOfLines={1}>{label}</Small>
    </Card>
  );
}

function ActionTile({ icon, label, onPress, tint = colors.primary }: { icon: any; label: string; onPress: () => void; tint?: string }) {
  return (
    <Card onPress={onPress} style={{ width: "48%", paddingVertical: space.lg }}>
      <View style={{ width: 38, height: 38, borderRadius: radius.md, backgroundColor: tint + "1A", alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <Text style={{ color: colors.text, fontSize: font.body, fontWeight: font.semibold, marginTop: 10 }}>{label}</Text>
    </Card>
  );
}

function computePosture(hardening: number, threats: number, checks: number) {
  let score = 40 + Math.round(hardening * 0.45) + Math.min(15, checks * 2);
  if (checks > 0 && threats / Math.max(checks, 1) > 0.5) score -= 6;
  score = Math.max(10, Math.min(100, score));
  const color = score >= 70 ? colors.safe : score >= 45 ? colors.caution : colors.threat;
  const label = score >= 80 ? "Strongly protected" : score >= 60 ? "Well protected" : score >= 40 ? "Getting set up" : "Needs attention";
  const hint = hardening < 50 ? "Complete a few hardening steps to raise your score." : checks === 0 ? "Run your first check to keep this current." : "Your household is actively protected.";
  return { score, color, label, hint };
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
