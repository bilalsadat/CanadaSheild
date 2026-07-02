import React from "react";
import { Pressable, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { motion } from "../lib/theme";

/**
 * PressableScale — the app-wide touch response: a quick, subtle scale-down with
 * optional haptic tick. One physical language for every tappable card.
 */
export function PressableScale({
  children,
  onPress,
  style,
  haptic = false,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      disabled={disabled || !onPress}
      onPressIn={() => { scale.value = withTiming(0.97, { duration: motion.fast, easing: Easing.out(Easing.quad) }); }}
      onPressOut={() => { scale.value = withTiming(1, { duration: motion.base, easing: Easing.out(Easing.quad) }); }}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
    >
      <Animated.View style={[aStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Enter — staggered fade-up entrance for list/dashboard content. */
export function Enter({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(motion.slow).delay(delay).springify().damping(18)} style={style}>
      {children}
    </Animated.View>
  );
}
