import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle, Callout, PROVIDER_DEFAULT } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Card, H3, Small, Kicker, Row, Pill } from "../../components/ui";
import { useT } from "../../lib/i18n";
import { THREAT_CITIES, NATIONAL_STATS } from "../../lib/data";
import { colors, font, space, radius } from "../../lib/theme";

const { height } = Dimensions.get("window");

export default function MapTab() {
  const t = useT();
  const [cat, setCat] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(THREAT_CITIES.map((c) => c.topCategory)))], []);
  const shown = cat === "All" ? THREAT_CITIES : THREAT_CITIES.filter((c) => c.topCategory === cat);
  const max = Math.max(...THREAT_CITIES.map((c) => c.reports), 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ paddingHorizontal: space.lg, paddingBottom: 10 }}>
        <Kicker>{t("map.kicker")}</Kicker>
        <Row style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <Text style={{ color: colors.text, fontSize: font.h2, fontWeight: font.bold }}>{t("map.title")}</Text>
          <Small>{NATIONAL_STATS.totalReports} {t("map.reports")}</Small>
        </Row>
      </View>

      <View style={{ height: height * 0.5, marginHorizontal: space.lg, borderRadius: radius.lg, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          userInterfaceStyle="dark"
          initialRegion={{ latitude: 56.1, longitude: -96, latitudeDelta: 40, longitudeDelta: 45 }}
        >
          {shown.map((c) => {
            const intensity = c.reports / max;
            return (
              <React.Fragment key={c.city}>
                <Circle center={{ latitude: c.lat, longitude: c.lng }} radius={40000 + intensity * 120000} strokeColor="rgba(251,85,113,0.5)" fillColor={`rgba(251,85,113,${0.12 + intensity * 0.22})`} />
                <Marker coordinate={{ latitude: c.lat, longitude: c.lng }} anchor={{ x: 0.5, y: 0.5 }}>
                  <View style={{ minWidth: 30, height: 30, borderRadius: 15, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff", paddingHorizontal: 4 }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{c.reports}</Text>
                  </View>
                  <Callout tooltip>
                    <View style={{ backgroundColor: colors.surface2, padding: 10, borderRadius: 10, minWidth: 180, borderWidth: 1, borderColor: colors.border }}>
                      <Text style={{ color: colors.text, fontWeight: font.bold, fontSize: font.body }}>{c.city}, {c.region}</Text>
                      <Text style={{ color: colors.textDim, fontSize: font.small, marginTop: 2 }}>{c.reports} reports · {c.language}</Text>
                      <Text style={{ color: colors.threat, fontSize: font.small, marginTop: 4 }}>{c.topCategory}</Text>
                    </View>
                  </Callout>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapView>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.lg, paddingVertical: 12, gap: 8 }}>
        {categories.map((c) => (
          <Pressable key={c} onPress={() => setCat(c)} style={{ borderRadius: radius.pill, borderWidth: 1, borderColor: cat === c ? colors.primary : colors.border, backgroundColor: cat === c ? colors.primaryDim : "transparent", paddingHorizontal: 13, paddingVertical: 7 }}>
            <Text style={{ color: cat === c ? colors.primary : colors.textDim, fontSize: font.small, fontWeight: font.medium }}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Briefing list */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 120, gap: 10 }} showsVerticalScrollIndicator={false}>
        <H3 style={{ marginBottom: 2 }}>{t("map.briefing")}</H3>
        {shown.map((c) => (
          <Card key={c.city} style={{ paddingVertical: 12 }}>
            <Row>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.dangerDim, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: colors.threat, fontWeight: font.bold }}>{c.reports}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Row style={{ justifyContent: "space-between" }}>
                  <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: font.body }}>{c.city}, {c.region}</Text>
                  <Pill label={c.language} />
                </Row>
                <Small style={{ marginTop: 2 }}>{t("map.surging", { cat: c.topCategory })}</Small>
              </View>
            </Row>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
