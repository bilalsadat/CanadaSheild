import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors, font, scoreColor } from "../lib/theme";

export function ScoreRing({ score, size = 160, label = "Trust Score", uncertainty }: { score: number; size?: number; label?: string; uncertainty?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2 - 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, score / 100));
  const color = scoreColor(score);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={1} />
            <Stop offset="1" stopColor={color} stopOpacity={0.55} />
          </LinearGradient>
        </Defs>
        <Circle cx={cx} cy={cx} r={r} stroke="rgba(148,163,184,0.14)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="url(#ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference * frac} ${circumference}`}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ color, fontSize: size * 0.3, fontWeight: font.bold, letterSpacing: -1 }}>{score}</Text>
        <Text style={{ color: colors.textMute, fontSize: font.tiny, fontWeight: font.semibold, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 2 }}>{label}</Text>
        {typeof uncertainty === "number" && uncertainty > 0 && (
          <Text style={{ color: colors.textMute, fontSize: font.tiny, marginTop: 2 }}>± {uncertainty}</Text>
        )}
      </View>
    </View>
  );
}
