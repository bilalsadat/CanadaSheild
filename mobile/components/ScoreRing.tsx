import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors, font, motion, scoreColor, scoreTrack } from "../lib/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * ScoreRing — the product's signature meter.
 * Dataviz spec: the fill carries severity; the unfilled track is a lighter step
 * of the SAME ramp (never generic gray), so state reads across the whole ring.
 * The arc animates in on mount / when the score changes.
 */
export function ScoreRing({
  score,
  size = 160,
  label = "Trust Score",
  uncertainty,
}: {
  score: number;
  size?: number;
  label?: string;
  uncertainty?: number;
}) {
  const stroke = Math.max(10, Math.round(size * 0.075));
  const r = (size - stroke) / 2 - 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const color = scoreColor(score);
  const track = scoreTrack(score);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(Math.max(0.02, Math.min(1, score / 100)), {
      duration: motion.ring,
      easing: Easing.out(Easing.cubic),
    });
  }, [score, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          <LinearGradient id="ksRing" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={1} />
            <Stop offset="1" stopColor={color} stopOpacity={0.55} />
          </LinearGradient>
        </Defs>
        <Circle cx={cx} cy={cx} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={cx}
          cy={cx}
          r={r}
          stroke="url(#ksRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ color, fontSize: size * 0.3, fontWeight: font.heavy, letterSpacing: -1 }}>{score}</Text>
        {label ? (
          <Text style={{ color: colors.textMute, fontSize: font.tiny, fontWeight: font.semibold, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 2 }}>
            {label}
          </Text>
        ) : null}
        {typeof uncertainty === "number" && uncertainty > 0 && (
          <Text style={{ color: colors.textMute, fontSize: font.tiny, marginTop: 2 }}>± {uncertainty}</Text>
        )}
      </View>
    </View>
  );
}
