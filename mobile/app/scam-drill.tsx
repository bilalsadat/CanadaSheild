import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, H3, Small, Body, Button, Row } from "../components/ui";
import { scoreTrust, explain } from "../lib/trust-engine";
import { useVraiShield } from "../lib/store";
import { colors, font, space } from "../lib/theme";

const DRILLS = [
  { from: "INTERAC", text: "Your transfer is pending. Accept within 24h: http://interac-secure-deposit.xyz/login", scam: true },
  { from: "Dr. Lee's office", text: "Reminder: your appointment is Tuesday at 2pm. Reply C to cancel.", scam: false },
  { from: "+1 604-555-0147", text: "CRA: your SIN is suspended, arrest warrant issued. Pay with gift cards now.", scam: true },
  { from: "Telus", text: "Your monthly bill is ready to view in the My Telus app.", scam: false },
  { from: "Recruiter", text: "Work from home, $500/day. We'll mail you a cheque — deposit it and buy equipment.", scam: true },
  { from: "Bank of Friend", text: "Sent you $40 for dinner over e-transfer, should auto-deposit.", scam: false },
];

export default function ScamDrill() {
  const ks = useVraiShield();
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => { if (done) ks.setDrillBest(score); }, [done]); // eslint-disable-line

  const d = DRILLS[i];
  const eng = scoreTrust({ text: d.text, channel: "sms" });

  function answer(guess: boolean) {
    if (answered !== null) return;
    if (guess === d.scam) setScore((s) => s + 1);
    setAnswered(guess === d.scam);
  }
  function next() { if (i + 1 >= DRILLS.length) setDone(true); else { setI(i + 1); setAnswered(null); } }

  if (done) {
    return (
      <Screen>
        <Card style={{ alignItems: "center", paddingVertical: 32 }}>
          <Ionicons name={score >= 5 ? "trophy" : score >= 3 ? "ribbon" : "school"} size={48} color={colors.gold} />
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: font.bold, marginTop: 12 }}>{score} / {DRILLS.length}</Text>
          <Body style={{ textAlign: "center", marginTop: 6 }}>{score >= 5 ? "Scam-spotting black belt. Teach the family!" : score >= 3 ? "Solid instincts — a little practice and you're unshakeable." : "That's exactly why we drill. The reflex is learnable."}</Body>
          <Button label="Play again" icon="refresh" onPress={() => { setI(0); setScore(0); setAnswered(null); setDone(false); }} style={{ marginTop: 20 }} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Small>Spot the scam. Whoever scores highest wins bragging rights at dinner.</Small>
      <Card style={{ marginTop: space.md }}>
        <Row style={{ justifyContent: "space-between" }}><Small>Question {i + 1} of {DRILLS.length}</Small><Small>Score: {score}</Small></Row>
        <View style={{ marginTop: 12, backgroundColor: colors.bgElevated, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
          <Small>From: {d.from}</Small>
          <Text style={{ color: colors.text, fontSize: font.body, marginTop: 4, lineHeight: 22 }}>{d.text}</Text>
        </View>

        {answered === null ? (
          <Row style={{ marginTop: 16, gap: 12 }}>
            <Button label="Scam" icon="close-circle" variant="danger" onPress={() => answer(true)} style={{ flex: 1 }} />
            <Button label="Safe" icon="checkmark-circle" onPress={() => answer(false)} style={{ flex: 1 }} />
          </Row>
        ) : (
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: answered ? colors.primary : colors.danger, fontWeight: font.bold, fontSize: font.h3 }}>{answered ? "Correct!" : "Not quite —"} this was {d.scam ? "a scam" : "legitimate"}.</Text>
            <Small style={{ marginTop: 4 }}>VraiShield scored it {eng.trustScore}/100. {explain(eng).reasons[0] ?? "No fraud signals — a normal message."}</Small>
            <Button label={i + 1 >= DRILLS.length ? "See results" : "Next"} onPress={next} style={{ marginTop: 16 }} />
          </View>
        )}
      </Card>
    </Screen>
  );
}
