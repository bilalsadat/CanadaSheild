import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card, Small, Body, Row } from "../components/ui";
import { PressableScale } from "../components/Motion";
import { useVraiShield } from "../lib/store";
import { useT } from "../lib/i18n";
import { colors, font, space, radius, verdictColor } from "../lib/theme";

type Filter = "all" | "threats" | "safe";

export default function History() {
  const ks = useVraiShield();
  const router = useRouter();
  const t = useT();
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    if (filter === "threats") return ks.history.filter((h) => h.verdict === "dangerous" || h.verdict === "likely_scam");
    if (filter === "safe") return ks.history.filter((h) => h.verdict === "safe" || h.verdict === "caution");
    return ks.history;
  }, [ks.history, filter]);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: t("history.all") },
    { key: "threats", label: t("history.threats") },
    { key: "safe", label: t("history.safe") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: t("history.title") }} />

      <Row style={{ paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.sm, justifyContent: "space-between" }}>
        <Row style={{ gap: 8 }}>
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={{ borderRadius: radius.pill, borderWidth: 1, borderColor: filter === f.key ? colors.primary : colors.border, backgroundColor: filter === f.key ? colors.primaryDim : "transparent", paddingHorizontal: 14, paddingVertical: 7 }}
            >
              <Text style={{ color: filter === f.key ? colors.primary : colors.textDim, fontSize: font.small, fontWeight: font.medium }}>{f.label}</Text>
            </Pressable>
          ))}
        </Row>
        <Small>{t("history.count", { n: rows.length })}</Small>
      </Row>

      <FlatList
        data={rows}
        keyExtractor={(h) => h.id}
        contentContainerStyle={{ padding: space.lg, paddingTop: space.sm, paddingBottom: 60, gap: space.sm }}
        ListEmptyComponent={
          <Card style={{ alignItems: "center", paddingVertical: space.xxl }}>
            <Ionicons name="file-tray-outline" size={28} color={colors.textMute} />
            <Body style={{ textAlign: "center", marginTop: 10 }}>{t("history.empty")}</Body>
          </Card>
        }
        renderItem={({ item: h }) => (
          <PressableScale onPress={() => router.push(`/check/${h.id}`)}>
            <Card style={{ paddingVertical: 12 }}>
              <Row>
                <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: verdictColor(h.verdict) + "22" }}>
                  <Text style={{ color: verdictColor(h.verdict), fontWeight: font.bold, fontSize: 15 }}>{h.score}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ color: colors.text, fontSize: font.body }}>{h.snippet || h.scriptLabel || "—"}</Text>
                  <Small style={{ textTransform: "capitalize" }}>{h.channel.replace("_", " ")} · {new Date(h.ts).toLocaleDateString()}</Small>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMute} />
              </Row>
            </Card>
          </PressableScale>
        )}
      />
    </View>
  );
}
