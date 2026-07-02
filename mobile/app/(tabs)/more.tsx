import React, { useMemo, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, Title, H3, Small, Kicker, Row } from "../../components/ui";
import { Enter, PressableScale } from "../../components/Motion";
import { FEATURES, PILLARS, liveCount, type Feature } from "../../lib/features";
import { useT } from "../../lib/i18n";
import { colors, font, space, radius } from "../../lib/theme";

export default function More() {
  const router = useRouter();
  const t = useT();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return FEATURES;
    return FEATURES.filter(
      (f) =>
        f.name.toLowerCase().includes(needle) ||
        f.tagline.toLowerCase().includes(needle) ||
        f.pillar.toLowerCase().includes(needle) ||
        f.what.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <Screen>
      <Enter>
        <Kicker>{t("feat.kicker")}</Kicker>
        <Title style={{ marginTop: 4 }}>{t("feat.title")}</Title>
        <Small style={{ marginTop: 4, marginBottom: space.md }}>{t("feat.sub", { n: liveCount })}</Small>

        {/* Search */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, marginBottom: space.md }}>
          <Ionicons name="search" size={17} color={colors.textMute} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={t("feat.search")}
            placeholderTextColor={colors.textMute}
            style={{ flex: 1, color: colors.text, fontSize: font.body, paddingVertical: 11 }}
          />
          {q.length > 0 && (
            <Ionicons name="close-circle" size={17} color={colors.textMute} onPress={() => setQ("")} />
          )}
        </View>

        {/* Quick links */}
        {!q && (
          <Row style={{ gap: space.md, marginBottom: space.lg }}>
            <Quick icon="alert-circle" label={t("feat.quickIncident")} color={colors.danger} onPress={() => router.push("/incident")} />
            <Quick icon="school" label={t("feat.quickDrill")} onPress={() => router.push("/scam-drill")} />
            <Quick icon="settings" label={t("feat.quickSettings")} onPress={() => router.push("/settings")} />
          </Row>
        )}
      </Enter>

      {filtered.length === 0 && (
        <Card style={{ alignItems: "center", paddingVertical: space.xl }}>
          <Ionicons name="search-outline" size={26} color={colors.textMute} />
          <Small style={{ marginTop: 8, textAlign: "center" }}>{t("feat.noResults", { q })}</Small>
        </Card>
      )}

      {PILLARS.map((pillar, pi) => {
        const items = filtered.filter((f) => f.pillar === pillar);
        if (items.length === 0) return null;
        return (
          <Enter key={pillar} delay={Math.min(pi, 4) * 50}>
            <View style={{ marginBottom: space.lg }}>
              <H3 style={{ marginBottom: 10 }}>{pillar}</H3>
              <View style={{ gap: 8 }}>
                {items.map((f) => (
                  <FeatureRow key={f.id} f={f} onPress={() => router.push(`/feature/${f.slug}`)} />
                ))}
              </View>
            </View>
          </Enter>
        );
      })}
    </Screen>
  );
}

function FeatureRow({ f, onPress }: { f: Feature; onPress: () => void }) {
  const live = f.status === "live";
  return (
    <PressableScale onPress={onPress}>
      <Card style={{ paddingVertical: 13 }}>
        <Row>
          <View style={{ width: 42, height: 42, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(47,211,155,0.10)" }}>
            <Ionicons name={f.icon} size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Row style={{ gap: 6 }}>
              <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: font.body }}>{f.name}</Text>
              {f.star && <Ionicons name="sparkles" size={12} color={colors.gold} />}
            </Row>
            <Small numberOfLines={1}>{f.tagline}</Small>
          </View>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: live ? colors.primary : colors.warn }} />
            <Text style={{ color: colors.textMute, fontSize: 10 }}>{f.phase}</Text>
          </View>
        </Row>
      </Card>
    </PressableScale>
  );
}

function Quick({ icon, label, onPress, color = colors.primary }: { icon: any; label: string; onPress: () => void; color?: string }) {
  return (
    <PressableScale haptic onPress={onPress} style={{ flex: 1 }}>
      <Card style={{ alignItems: "center", paddingVertical: 16 }}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={{ color: colors.text, fontSize: font.small, fontWeight: font.semibold, marginTop: 6 }}>{label}</Text>
      </Card>
    </PressableScale>
  );
}
