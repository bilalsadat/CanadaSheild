import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors, font } from "../lib/theme";

/**
 * The VraiShield mark — a shield whose core is a checkmark that doubles as a
 * "V" for Vrai (true). One idea, drawn once: real, verified, protected.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="vsGrad" x1="8" y1="4" x2="40" y2="44">
          <Stop offset="0" stopColor="#3BE3AC" />
          <Stop offset="1" stopColor="#12A87C" />
        </LinearGradient>
      </Defs>
      <Path
        d="M24 3.5 L40.5 10 V21.5 C40.5 32.8 33.6 41.4 24 44.8 C14.4 41.4 7.5 32.8 7.5 21.5 V10 Z"
        fill="rgba(47,211,155,0.09)"
        stroke="url(#vsGrad)"
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <Path
        d="M15.4 23.2 L21.6 30.4 L33 15.8"
        stroke="url(#vsGrad)"
        strokeWidth={4.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Wordmark: Vrai (ink) + Shield (emerald). */
export function LogoWordmark({ size = 20, mark = 26 }: { size?: number; mark?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <LogoMark size={mark} />
      <Text style={{ fontSize: size, fontWeight: font.heavy, letterSpacing: -0.4 }}>
        <Text style={{ color: colors.text }}>Vrai</Text>
        <Text style={{ color: colors.primary }}>Shield</Text>
      </Text>
    </View>
  );
}
