import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, space, radius, font, shadow } from "../lib/theme";

export function Screen({ children, scroll = true, edges = ["top"] }: { children: React.ReactNode; scroll?: boolean; edges?: ("top" | "bottom")[] }) {
  const inner = scroll ? (
    <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, padding: space.lg }}>{children}</View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={edges}>
      {inner}
    </SafeAreaView>
  );
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: ViewStyle; onPress?: () => void }) {
  const body = <View style={[styles.card, style]}>{children}</View>;
  if (onPress) return <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>{body}</Pressable>;
  return body;
}

export function Title({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ color: colors.text, fontSize: font.h1, fontWeight: font.bold, letterSpacing: -0.5 }, style]}>{children}</Text>;
}
export function H2({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ color: colors.text, fontSize: font.h2, fontWeight: font.bold, letterSpacing: -0.3 }, style]}>{children}</Text>;
}
export function H3({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ color: colors.text, fontSize: font.h3, fontWeight: font.semibold }, style]}>{children}</Text>;
}
export function Body({ children, style, numberOfLines }: { children: React.ReactNode; style?: TextStyle; numberOfLines?: number }) {
  return <Text numberOfLines={numberOfLines} style={[{ color: colors.textDim, fontSize: font.body, lineHeight: 22 }, style]}>{children}</Text>;
}
export function Small({ children, style, numberOfLines }: { children: React.ReactNode; style?: TextStyle; numberOfLines?: number }) {
  return <Text numberOfLines={numberOfLines} style={[{ color: colors.textMute, fontSize: font.small, lineHeight: 19 }, style]}>{children}</Text>;
}

export function Kicker({ children, color = colors.primary }: { children: React.ReactNode; color?: string }) {
  return <Text style={{ color, fontSize: font.tiny, fontWeight: font.bold, letterSpacing: 1.6, textTransform: "uppercase" }}>{children}</Text>;
}

export function Pill({ label, color = colors.textDim, bg = "rgba(148,163,184,0.10)" }: { label: string; color?: string; bg?: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3, alignSelf: "flex-start" }}>
      <Text style={{ color, fontSize: font.tiny, fontWeight: font.semibold, letterSpacing: 0.4 }}>{label}</Text>
    </View>
  );
}

export function Button({ label, onPress, icon, variant = "primary", style }: { label: string; onPress: () => void; icon?: React.ComponentProps<typeof Ionicons>["name"]; variant?: "primary" | "ghost" | "danger"; style?: ViewStyle }) {
  const bg = variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : "rgba(148,163,184,0.10)";
  const fg = variant === "ghost" ? colors.text : "#06231A";
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ backgroundColor: bg, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, opacity: pressed ? 0.85 : 1 }, variant === "ghost" && { borderWidth: 1, borderColor: colors.border }, style]}>
      {icon && <Ionicons name={icon} size={18} color={fg} />}
      <Text style={{ color: fg, fontWeight: font.bold, fontSize: font.body }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ borderRadius: radius.pill, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primaryDim : "transparent", paddingHorizontal: 13, paddingVertical: 7 }}>
      <Text style={{ color: active ? colors.primary : colors.textDim, fontSize: font.small, fontWeight: font.medium }}>{label}</Text>
    </Pressable>
  );
}

export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: "row", alignItems: "center", gap: space.md }, style]}>{children}</View>;
}

export function IconBadge({ name, color = colors.primary, size = 20, bg }: { name: React.ComponentProps<typeof Ionicons>["name"]; color?: string; size?: number; bg?: string }) {
  return (
    <View style={{ width: size + 22, height: size + 22, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: bg ?? "rgba(47,211,155,0.10)" }}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: space.md }} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
