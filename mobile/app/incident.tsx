import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, H3, Small, Body, Row } from "../components/ui";
import { colors, font, space } from "../lib/theme";

const STEPS = [
  { id: "breathe", title: "Breathe — you are not to blame", detail: "Scammers run tested scripts. Acting in the next hour matters far more than how this started.", urgent: true },
  { id: "bank", title: "Call your bank's fraud line — exact words", detail: "“I am a fraud victim. I need to open a fraud investigation and request a recall on a transaction I authorized under deception.”", urgent: true },
  { id: "evidence", title: "Capture the evidence", detail: "Screenshots, numbers and receipts are saved to your encrypted vault with a timestamp and hash — pre-evidencing any claim." },
  { id: "cafc", title: "File the CAFC report (pre-filled)", detail: "We pre-fill the Canadian Anti-Fraud Centre report from your evidence. You review and submit." },
  { id: "credit", title: "Fraud alerts: Equifax & TransUnion", detail: "A guided walkthrough for both bureaus so new credit can't be opened in your name." },
  { id: "police", title: "Get a police file number", detail: "Your local non-emergency line, pre-filled with a summary." },
  { id: "rearm", title: "Guard against the recovery scam", detail: "Victims are re-targeted within weeks by fake ‘fund recovery’ agents. Anyone promising to get your money back for a fee is the same network.", urgent: true },
];

export default function Incident() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const count = Object.values(done).filter(Boolean).length;
  const pct = Math.round((count / STEPS.length) * 100);

  return (
    <Screen>
      <Card style={{ borderColor: colors.danger + "55", backgroundColor: colors.dangerDim }}>
        <Row>
          <Ionicons name="alert-circle" size={30} color={colors.danger} />
          <View style={{ flex: 1 }}>
            <H3 style={{ color: colors.danger }}>The first hours decide everything</H3>
            <Small>Work top to bottom. One step at a time.</Small>
          </View>
        </Row>
        <View style={{ marginTop: 14 }}>
          <Row style={{ justifyContent: "space-between" }}><Small>{count} of {STEPS.length} steps</Small><Small>{pct}%</Small></Row>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(148,163,184,0.16)", marginTop: 4, overflow: "hidden" }}>
            <View style={{ height: 8, width: `${pct}%`, backgroundColor: colors.primary, borderRadius: 4 }} />
          </View>
        </View>
      </Card>

      <View style={{ gap: 8, marginTop: space.md }}>
        {STEPS.map((s, i) => {
          const isDone = !!done[s.id];
          return (
            <Card key={s.id} onPress={() => setDone((d) => ({ ...d, [s.id]: !d[s.id] }))} style={{ paddingVertical: 14, borderColor: s.urgent && !isDone ? colors.danger + "44" : colors.border }}>
              <Row style={{ alignItems: "flex-start" }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: isDone ? colors.primary : "rgba(148,163,184,0.4)", backgroundColor: isDone ? colors.primary : "transparent", alignItems: "center", justifyContent: "center" }}>
                  {isDone ? <Ionicons name="checkmark" size={16} color="#06231A" /> : <Text style={{ color: colors.textMute, fontSize: 12 }}>{i + 1}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Row style={{ gap: 6 }}>
                    <Text style={{ color: isDone ? colors.textMute : colors.text, fontWeight: font.semibold, fontSize: font.body, textDecorationLine: isDone ? "line-through" : "none", flexShrink: 1 }}>{s.title}</Text>
                    {s.urgent && !isDone && <View style={{ backgroundColor: colors.dangerDim, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 }}><Text style={{ color: colors.danger, fontSize: 10, fontWeight: "700" }}>URGENT</Text></View>}
                  </Row>
                  <Small style={{ marginTop: 4 }}>{s.detail}</Small>
                </View>
              </Row>
            </Card>
          );
        })}
      </View>

      <Card style={{ marginTop: space.md }}>
        <Body><Text style={{ color: colors.gold, fontWeight: font.semibold }}>On Premium</Text>, a trained, trauma-informed human in your language joins these calls and checks in weekly for three months.</Body>
      </Card>
    </Screen>
  );
}
