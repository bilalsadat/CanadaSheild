import React, { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, Body, Small, Button, Row } from "../components/ui";
import { Enter } from "../components/Motion";
import { useVraiShield } from "../lib/store";
import { useT } from "../lib/i18n";
import { colors, font } from "../lib/theme";

const SEV: Record<string, { color: string; bg: string; icon: any }> = {
  info: { color: colors.info, bg: colors.infoDim, icon: "information-circle" },
  warn: { color: colors.warn, bg: colors.warnDim, icon: "warning" },
  danger: { color: colors.danger, bg: colors.dangerDim, icon: "alert-circle" },
};

export default function Alerts() {
  const ks = useVraiShield();
  const router = useRouter();
  const t = useT();

  // Snapshot which alerts were unread when the screen opened (so the NEW tags
  // stay visible during this visit), then mark them read on unmount.
  const unreadIds = useRef<Set<string>>(new Set(ks.alerts.filter((a) => !a.read).map((a) => a.id)));
  const markRef = useRef(ks.markAlertsRead);
  markRef.current = ks.markAlertsRead;
  useEffect(() => () => markRef.current(), []);

  if (ks.alerts.length === 0) {
    return (
      <Screen>
        <Enter>
          <Card style={{ alignItems: "center", paddingVertical: 36 }}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.textMute} />
            <Body style={{ textAlign: "center", marginTop: 12 }}>{t("alerts.empty")}</Body>
            <Button label={t("alerts.checkOne")} icon="shield-checkmark" onPress={() => router.push("/protect")} style={{ marginTop: 16 }} />
          </Card>
        </Enter>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        {ks.alerts.map((a, i) => {
          const s = SEV[a.severity];
          const isNew = unreadIds.current.has(a.id);
          return (
            <Enter key={a.id} delay={Math.min(i, 8) * 40}>
              <Card style={{ paddingVertical: 14, borderColor: isNew ? s.color + "44" : colors.border }}>
                <Row style={{ alignItems: "flex-start" }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: s.bg, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name={s.icon} size={20} color={s.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Row style={{ gap: 6 }}>
                      <Text style={{ color: s.color, fontWeight: font.semibold, fontSize: font.body, flexShrink: 1 }}>{a.title}</Text>
                      {isNew && (
                        <View style={{ backgroundColor: s.bg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 }}>
                          <Text style={{ color: s.color, fontSize: 9, fontWeight: font.heavy, letterSpacing: 0.6 }}>{t("alerts.new")}</Text>
                        </View>
                      )}
                    </Row>
                    <Small style={{ marginTop: 2 }}>{a.body}</Small>
                    <Small style={{ marginTop: 4, color: colors.textMute }}>{timeAgo(a.ts)}</Small>
                  </View>
                </Row>
              </Card>
            </Enter>
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
