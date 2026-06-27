import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, Title, H3, Body, Small, Kicker, Pill, Row, IconBadge } from "../../components/ui";
import { ScoreRing } from "../../components/ScoreRing";
import { BarChart } from "../../components/BarChart";
import { useKinShield } from "../../lib/store";
import { THREAT_CITIES, NATIONAL_STATS } from "../../lib/data";
import { colors, font, space, verdictColor } from "../../lib/theme";

export default function Dashboard() {
  const ks = useKinShield();
  const router = useRouter();

  const checks = ks.history.length;
  const threats = ks.history.filter((h) => h.verdict === "dangerous" || h.verdict === "likely_scam").length;
  const unread = ks.alerts.length;
  const posture = useMemo(() => computePosture(ks.hardeningScore, threats, checks), [ks.hardeningScore, threats, checks]);
  const week = useMemo(() => last7(ks.history), [ks.history]);
  const topCity = THREAT_CITIES[0];

  const greeting = ks.profile.name ? ks.profile.name : "there";

  return (
    <Screen>
      {/* Header */}
      <Row style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: space.lg }}>
        <View style={{ flex: 1 }}>
          <Kicker>Protection center</Kicker>
          <Title style={{ marginTop: 4 }}>Hello, {greeting}</Title>
          <Small style={{ marginTop: 2 }}>
            {ks.onboarded ? `${ks.household.name || "Your household"} · ${ks.profile.tier} · ${ks.household.members.length || 1} protected` : "Tap below to set up your Family Circle"}
          </Small>
        </View>
        <Pressable onPress={() => router.push("/alerts")} hitSlop={10} style={{ padding: 6 }}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {unread > 0 && <View style={{ position: "absolute", top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 }}><Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>{unread}</Text></View>}
        </Pressable>
      </Row>

      {!ks.onboarded && (
        <Card onPress={() => router.push("/welcome")} style={{ marginBottom: space.lg, borderColor: colors.primary + "55", backgroundColor: colors.primaryDim }}>
          <Row style={{ justifyContent: "space-between" }}>
            <Row style={{ flex: 1 }}>
              <IconBadge name="shield-checkmark" />
              <View style={{ flex: 1 }}>
                <H3>Get protected</H3>
                <Small>Set up your Family Circle in 60 seconds.</Small>
              </View>
            </Row>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </Row>
        </Card>
      )}

      {/* Posture + key stats */}
      <Card style={{ marginBottom: space.md }}>
        <Row style={{ gap: space.lg }}>
          <ScoreRing score={posture.score} size={132} label="Posture" />
          <View style={{ flex: 1, gap: 10 }}>
            <View>
              <Text style={{ color: posture.color, fontSize: font.h3, fontWeight: font.bold }}>{posture.label}</Text>
              <Small>Household protection score</Small>
            </View>
            <Row style={{ gap: space.md }}>
              <MiniStat value={String(checks)} label="checks" />
              <MiniStat value={String(threats)} label="threats" color={colors.threat} />
            </Row>
          </View>
        </Row>
      </Card>

      {/* Stat grid */}
      <Row style={{ gap: space.md, marginBottom: space.md }}>
        <StatCard icon="key" label="Hardening" value={`${ks.hardeningScore}`} onPress={() => router.push("/feature/passkey-coach")} />
        <StatCard icon="school" label="Scam drill" value={ks.drillBest ? `${ks.drillBest}/6` : "—"} onPress={() => router.push("/scam-drill")} />
      </Row>

      {/* Activity */}
      <Card style={{ marginBottom: space.md }}>
        <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <Kicker color={colors.textDim}>Last 7 days</Kicker>
          <Small>{checks} checks total</Small>
        </Row>
        <BarChart data={week} />
      </Card>

      {/* Local threat snapshot */}
      <Card onPress={() => router.push("/map")} style={{ marginBottom: space.md }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Kicker color={colors.textDim}>Threats near you</Kicker>
          <Row style={{ gap: 4 }}><Small>Open map</Small><Ionicons name="chevron-forward" size={14} color={colors.textMute} /></Row>
        </Row>
        <Row style={{ marginTop: 10, justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: colors.threat, fontSize: font.h1, fontWeight: font.bold }}>{topCity.reports}</Text>
            <Small>reports in {topCity.city} this week</Small>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Pill label={topCity.topCategory} color={colors.threat} bg={colors.dangerDim} />
            <Small style={{ marginTop: 6 }}>{NATIONAL_STATS.totalReports} reports · {NATIONAL_STATS.cities} cities</Small>
          </View>
        </Row>
      </Card>

      {/* Recent checks */}
      <Row style={{ justifyContent: "space-between", marginBottom: 10, marginTop: 4 }}>
        <H3>Recent checks</H3>
        <Pressable onPress={() => router.push("/protect")}><Small style={{ color: colors.primary }}>Check a message</Small></Pressable>
      </Row>
      {ks.history.length === 0 ? (
        <Card><Body>No checks yet. Open <Text style={{ color: colors.primary }}>Protect</Text> and paste a suspicious message to begin.</Body></Card>
      ) : (
        <View style={{ gap: 8 }}>
          {ks.history.slice(0, 5).map((h) => (
            <Card key={h.id} style={{ paddingVertical: 12 }}>
              <Row>
                <View style={{ width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: verdictColor(h.verdict) + "22" }}>
                  <Text style={{ color: verdictColor(h.verdict), fontWeight: font.bold }}>{h.score}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ color: colors.text, fontSize: font.body }}>{h.snippet || h.scriptLabel || "Checked message"}</Text>
                  <Small>{h.channel} · {timeAgo(h.ts)}</Small>
                </View>
              </Row>
            </Card>
          ))}
        </View>
      )}

      {/* Quick actions */}
      <H3 style={{ marginTop: space.lg, marginBottom: 10 }}>Quick actions</H3>
      <Row style={{ flexWrap: "wrap", gap: space.md }}>
        <Action icon="card" label="Before you send" onPress={() => router.push("/feature/check-before-you-send")} />
        <Action icon="alert-circle" label="Incident Mode" color={colors.danger} onPress={() => router.push("/incident")} />
        <Action icon="chatbox-ellipses" label="SMS Shield" onPress={() => router.push("/feature/sms-shield")} />
        <Action icon="time" label="Long-Con Radar" onPress={() => router.push("/feature/long-con-radar")} />
      </Row>
    </Screen>
  );
}

function MiniStat({ value, label, color = colors.text }: { value: string; label: string; color?: string }) {
  return (
    <View>
      <Text style={{ color, fontSize: font.h2, fontWeight: font.bold }}>{value}</Text>
      <Small>{label}</Small>
    </View>
  );
}

function StatCard({ icon, label, value, onPress }: { icon: any; label: string; value: string; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={{ flex: 1 }}>
      <IconBadge name={icon} size={16} />
      <Text style={{ color: colors.text, fontSize: font.h1, fontWeight: font.bold, marginTop: 8 }}>{value}</Text>
      <Small>{label}</Small>
    </Card>
  );
}

function Action({ icon, label, onPress, color = colors.primary }: { icon: any; label: string; onPress: () => void; color?: string }) {
  return (
    <Card onPress={onPress} style={{ width: "47%", paddingVertical: 16 }}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={{ color: colors.text, fontSize: font.body, fontWeight: font.semibold, marginTop: 8 }}>{label}</Text>
    </Card>
  );
}

function computePosture(hardening: number, threats: number, checks: number) {
  let score = 40 + Math.round(hardening * 0.45) + Math.min(15, checks * 2);
  if (checks > 0 && threats / Math.max(checks, 1) > 0.5) score -= 6;
  score = Math.max(10, Math.min(100, score));
  const color = score >= 70 ? colors.safe : score >= 45 ? colors.caution : colors.threat;
  const label = score >= 80 ? "Strongly protected" : score >= 60 ? "Well protected" : score >= 40 ? "Getting set up" : "Needs attention";
  return { score, color, label };
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
