import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors, font } from "../lib/theme";

/** Minimal 7-bar activity chart. */
export function BarChart({ data, height = 90 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = 14;
  const gap = 0;
  return (
    <View>
      <Svg width="100%" height={height}>
        <Defs>
          <LinearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primary} />
            <Stop offset="1" stopColor={colors.primaryDeep} />
          </LinearGradient>
        </Defs>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 18) + 3;
          const xPct = (i + 0.5) / data.length;
          return (
            <Rect
              key={i}
              x={`${xPct * 100}%`}
              y={height - h}
              width={barW}
              height={h}
              rx={5}
              fill="url(#bar)"
              translateX={-barW / 2 - gap}
              opacity={d.value === 0 ? 0.25 : 1}
            />
          );
        })}
      </Svg>
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 4 }}>
        {data.map((d, i) => (
          <Text key={i} style={{ color: colors.textMute, fontSize: font.tiny }}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
}
