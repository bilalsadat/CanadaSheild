import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, Title, H3, Small, Kicker, Row } from "../../components/ui";
import { FEATURES, PILLARS, liveCount, type Feature } from "../../lib/features";
import { colors, font, space, radius } from "../../lib/theme";

export default function More() {
  const router = useRouter();

  return (
    <Screen>
      <Kicker>The A-to-Z catalogue</Kicker>
      <Title style={{ marginTop: 4 }}>All 30 features</Title>
      <Small style={{ marginTop: 4, marginBottom: space.lg }}>
        {liveCount} run on the live on-device Trust Engine; the rest are faithful interactive demos for capabilities that need OS hooks, telephony or partners. Tap any to open.
      </Small>

      {/* Quick links */}
      <Row style={{ gap: space.md, marginBottom: space.lg }}>
        <Quick icon="alert-circle" label="Incident" color={colors.danger} onPress={() => router.push("/incident")} />
        <Quick icon="school" label="Scam Drill" onPress={() => router.push("/scam-drill")} />
        <Quick icon="settings" label="Settings" onPress={() => router.push("/settings")} />
      </Row>

      {PILLARS.map((pillar) => {
        const items = FEATURES.filter((f) => f.pillar === pillar);
        if (items.length === 0) return null;
        return (
          <View key={pillar} style={{ marginBottom: space.lg }}>
            <H3 style={{ marginBottom: 10 }}>{pillar}</H3>
            <View style={{ gap: 8 }}>
              {items.map((f) => <FeatureRow key={f.id} f={f} onPress={() => router.push(`/feature/${f.slug}`)} />)}
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

function FeatureRow({ f, onPress }: { f: Feature; onPress: () => void }) {
  const live = f.status === "live";
  return (
    <Card onPress={onPress} style={{ paddingVertical: 13 }}>
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
  );
}

function Quick({ icon, label, onPress, color = colors.primary }: { icon: any; label: string; onPress: () => void; color?: string }) {
  return (
    <Card onPress={onPress} style={{ flex: 1, alignItems: "center", paddingVertical: 16 }}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={{ color: colors.text, fontSize: font.small, fontWeight: font.semibold, marginTop: 6 }}>{label}</Text>
    </Card>
  );
}
