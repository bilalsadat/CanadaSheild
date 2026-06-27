import React from "react";
import { View, Text } from "react-native";
import { colors, font } from "../lib/theme";

/** A clean flex-based 7-bar activity chart (reliable across RN layouts). */
export function BarChart({ data, height = 96 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height }}>
        {data.map((d, i) => {
          const h = Math.max(4, (d.value / max) * (height - 8));
          const active = d.value > 0;
          return (
            <View key={i} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", height }}>
              {active && <Text style={{ color: colors.textDim, fontSize: 10, marginBottom: 3, fontWeight: font.semibold }}>{d.value}</Text>}
              <View
                style={{
                  width: 18,
                  height: h,
                  borderRadius: 6,
                  backgroundColor: active ? colors.primary : "rgba(148,163,184,0.14)",
                }}
              />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
        {data.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: colors.textMute, fontSize: font.tiny }}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
