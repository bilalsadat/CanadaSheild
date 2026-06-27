import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, H3, Small, Body, Kicker, Row, Pill } from "../components/ui";
import { useKinShield } from "../lib/store";
import { colors, font, space } from "../lib/theme";
import type { Settings } from "../lib/store";

export default function SettingsScreen() {
  const ks = useKinShield();

  return (
    <Screen>
      <Row style={{ gap: space.md, marginBottom: space.md }}>
        <Card style={{ flex: 1, borderColor: colors.primary + "33" }}>
          <Ionicons name="lock-closed" size={18} color={colors.primary} />
          <H3 style={{ marginTop: 8, fontSize: 15 }}>Personal plane</H3>
          <Small style={{ marginTop: 4 }}>What&apos;s yours. We cannot read it. Messages, evidence, family graph, your {ks.history.length} checks — encrypted on this device.</Small>
        </Card>
        <Card style={{ flex: 1 }}>
          <Ionicons name="globe" size={18} color={colors.textDim} />
          <H3 style={{ marginTop: 8, fontSize: 15 }}>Network plane</H3>
          <Small style={{ marginTop: 4 }}>The scammer&apos;s. Attacker numbers/domains, only when you report — pseudonymized, aggregate to the CAFC.</Small>
        </Card>
      </Row>

      <H3 style={{ marginTop: space.md, marginBottom: 10 }}>Preferences</H3>
      <Card>
        <ToggleRow label="Senior Mode" sub="Larger text, simpler actions, spoken verdicts" on={ks.settings.seniorMode} onPress={() => ks.setSetting("seniorMode", !ks.settings.seniorMode)} />
        <ToggleRow label="Speak verdicts aloud" sub="Reads the result after each check" on={ks.settings.speakVerdicts} onPress={() => ks.setSetting("speakVerdicts", !ks.settings.speakVerdicts)} />
        <ToggleRow label="Notifications" sub="Alerts on flagged events and family activity" on={ks.settings.notifications} onPress={() => ks.setSetting("notifications", !ks.settings.notifications)} />
        <ToggleRow label="Screen unknown callers" sub="Route to the KinShield Line" on={ks.settings.screenUnknownCallers} onPress={() => ks.setSetting("screenUnknownCallers", !ks.settings.screenUnknownCallers)} last />
      </Card>

      <H3 style={{ marginTop: space.lg, marginBottom: 10 }}>Plan</H3>
      <Card>
        <Row style={{ justifyContent: "space-between" }}>
          <Body>Current plan</Body>
          <Pill label={ks.profile.tier} color={colors.primary} bg={colors.primaryDim} />
        </Row>
        <Row style={{ gap: 8, marginTop: 12 }}>
          {(["Free", "Family", "Premium"] as const).map((t) => (
            <Pressable key={t} onPress={() => ks.setTier(t)} style={{ flex: 1, borderRadius: 12, borderWidth: 1, borderColor: ks.profile.tier === t ? colors.primary : colors.border, backgroundColor: ks.profile.tier === t ? colors.primaryDim : "transparent", paddingVertical: 10, alignItems: "center" }}>
              <Text style={{ color: ks.profile.tier === t ? colors.primary : colors.textDim, fontWeight: font.semibold }}>{t}</Text>
            </Pressable>
          ))}
        </Row>
      </Card>

      <H3 style={{ marginTop: space.lg, marginBottom: 10 }}>Your data</H3>
      <Card onPress={() => Alert.alert("Delete everything?", "This erases your household, history and settings from this device.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => ks.reset() }])} style={{ borderColor: colors.danger + "33" }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Row><Ionicons name="trash" size={18} color={colors.danger} /><Body style={{ color: colors.danger }}>Delete everything</Body></Row>
          <Ionicons name="chevron-forward" size={18} color={colors.textMute} />
        </Row>
      </Card>

      <Small style={{ marginTop: space.lg, textAlign: "center" }}>KinShield · built in Canada · data resident in ca-central-1</Small>
    </Screen>
  );
}

function ToggleRow({ label, sub, on, onPress, last }: { label: string; sub: string; on: boolean; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: font.body }}>{label}</Text>
        <Small style={{ marginTop: 2 }}>{sub}</Small>
      </View>
      <View style={{ width: 46, height: 28, borderRadius: 14, backgroundColor: on ? colors.primary : "rgba(148,163,184,0.3)", justifyContent: "center", paddingHorizontal: 3 }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff", alignSelf: on ? "flex-end" : "flex-start" }} />
      </View>
    </Pressable>
  );
}
