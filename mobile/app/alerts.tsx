import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, Body, Small, Button, Row } from "../components/ui";
import { useKinShield } from "../lib/store";
import { colors, font } from "../lib/theme";

const SEV: Record<string, { color: string; bg: string; icon: any }> = {
  info: { color: colors.info, bg: colors.infoDim, icon: "information-circle" },
  warn: { color: colors.warn, bg: colors.warnDim, icon: "warning" },
  danger: { color: colors.danger, bg: colors.dangerDim, icon: "alert-circle" },
};

export default function Alerts() {
  const ks = useKinShield();
  const router = useRouter();

  if (ks.alerts.length === 0) {
    return (
      <Screen>
        <Card style={{ alignItems: "center", paddingVertical: 36 }}>
          <Ionicons name="notifications-off-outline" size={40} color={colors.textMute} />
          <Body style={{ textAlign: "center", marginTop: 12 }}>No alerts yet. As you check messages and protect your family, important events show up here.</Body>
          <Button label="Check a message" icon="shield-checkmark" onPress={() => router.push("/protect")} style={{ marginTop: 16 }} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        {ks.alerts.map((a) => {
          const s = SEV[a.severity];
          return (
            <Card key={a.id} style={{ paddingVertical: 14 }}>
              <Row style={{ alignItems: "flex-start" }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: s.bg, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name={s.icon} size={20} color={s.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: s.color, fontWeight: font.semibold, fontSize: font.body }}>{a.title}</Text>
                  <Small style={{ marginTop: 2 }}>{a.body}</Small>
                  <Small style={{ marginTop: 4, color: colors.textMute }}>{timeAgo(a.ts)}</Small>
                </View>
              </Row>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
