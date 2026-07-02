import React from "react";
import { View, Text } from "react-native";
import { colors, font } from "../lib/theme";

/**
 * Single-hue activity chart, per the dataviz mark spec:
 *  - bars ≤ 24px thick, 4px rounded data-end, SQUARE at the baseline
 *  - one hue (magnitude job = sequential), zero-days as a track step of the ramp
 *  - selective labels: only the extreme (max) and the current day — never every bar
 *  - recessive hairline baseline; weekday ticks in muted ink
 */
export function BarChart({ data, height = 96 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const maxIdx = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
  const lastIdx = data.length - 1;

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height }}>
        {data.map((d, i) => {
          const h = Math.max(4, (d.value / max) * (height - 20));
          const active = d.value > 0;
          const labeled = active && (i === maxIdx || i === lastIdx);
          return (
            <View key={i} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", height }}>
              {labeled && (
                <Text style={{ color: colors.textDim, fontSize: 10, marginBottom: 3, fontWeight: font.semibold }}>
                  {d.value}
                </Text>
              )}
              <View
                style={{
                  width: 18,
                  height: h,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  backgroundColor: active ? colors.primary : colors.primaryTrack,
                }}
              />
            </View>
          );
        })}
      </View>
      {/* baseline hairline */}
      <View style={{ height: 1, backgroundColor: colors.border }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 7 }}>
        {data.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: colors.textMute, fontSize: font.tiny }}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
