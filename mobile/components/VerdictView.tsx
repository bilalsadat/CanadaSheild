import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScoreRing } from "./ScoreRing";
import { Card, H3, Small, Pill, Row } from "./ui";
import { colors, font, verdictColor } from "../lib/theme";
import type { TrustResult } from "../lib/trust-engine";

const FAMILY_LABEL: Record<string, string> = {
  content: "Content / script",
  artifact: "Links & artifacts",
  authenticity: "Voice/video",
  network: "Community network",
  anomaly: "Out-of-pattern",
};

export interface Rendered {
  verdictLabel: string;
  actionLabel: string;
  reasons: string[];
  script?: TrustResult["detectedScript"];
}

export function VerdictView({ result, rendered }: { result: TrustResult; rendered: Rendered }) {
  const color = verdictColor(result.verdict);
  const icon = result.verdict === "safe" ? "shield-checkmark" : result.verdict === "caution" ? "alert" : "warning";

  return (
    <Card style={{ borderColor: color + "55" }}>
      <Row style={{ alignItems: "center" }}>
        <ScoreRing score={result.trustScore} size={118} uncertainty={result.uncertainty} />
        <View style={{ flex: 1 }}>
          <Row style={{ gap: 6 }}>
            <Ionicons name={icon} size={20} color={color} />
            <H3 style={{ color, flexShrink: 1 }}>{rendered.verdictLabel}</H3>
          </Row>
          <Small style={{ marginTop: 4 }}>Recommended: <Text style={{ color: colors.text, fontWeight: font.semibold }}>{rendered.actionLabel}</Text></Small>
          {result.detectedScript && (
            <View style={{ marginTop: 8, backgroundColor: color + "1A", borderRadius: 10, padding: 8 }}>
              <Text style={{ color, fontSize: font.tiny, fontWeight: font.bold, letterSpacing: 0.6, textTransform: "uppercase" }}>Scam script identified</Text>
              <Text style={{ color: colors.text, fontWeight: font.semibold, marginTop: 2 }}>{result.detectedScript.label}</Text>
              {result.detectedScript.stage ? <Text style={{ color: colors.textDim, fontSize: font.tiny, marginTop: 2 }}>Long-con stage {result.detectedScript.stage} — intervention still works.</Text> : null}
            </View>
          )}
        </View>
      </Row>

      <View style={{ marginTop: 14, gap: 8 }}>
        {rendered.reasons.map((r, i) => (
          <Row key={i} style={{ alignItems: "flex-start", gap: 8 }}>
            <Ionicons name="ellipse" size={6} color={color} style={{ marginTop: 7 }} />
            <Text style={{ color: colors.text, fontSize: font.body, flex: 1, lineHeight: 21 }}>{r}</Text>
          </Row>
        ))}
        {rendered.reasons.length === 0 && <Small>No fraud signals detected. Stay alert — you can still report anything that feels off.</Small>}
      </View>

      <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Pill label="Why — signal ledger" />
          <Small>{result.engineVersion.split("+")[0]} · {result.latencyMs}ms</Small>
        </Row>
        <View style={{ marginTop: 10, gap: 8 }}>
          {result.ledger.map((l) => (
            <Row key={l.family} style={{ gap: 10 }}>
              <Text style={{ color: colors.textDim, fontSize: font.tiny, width: 96 }}>{FAMILY_LABEL[l.family] ?? l.family}</Text>
              <View style={{ flex: 1, height: 7, borderRadius: 4, backgroundColor: "rgba(148,163,184,0.12)", overflow: "hidden" }}>
                <View style={{ height: 7, width: `${Math.round(l.risk * 100)}%`, backgroundColor: l.risk >= 0.5 ? color : "rgba(148,163,184,0.5)", borderRadius: 4 }} />
              </View>
              <Text style={{ color: colors.textMute, fontSize: font.tiny, width: 32, textAlign: "right" }}>{Math.round(l.risk * 100)}%</Text>
            </Row>
          ))}
        </View>
        <Small style={{ marginTop: 8 }}>No single detector decides — the score fuses all five, which is why a perfect deepfake still can&apos;t win alone.</Small>
      </View>
    </Card>
  );
}
