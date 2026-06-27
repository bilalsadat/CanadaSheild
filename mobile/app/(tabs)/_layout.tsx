import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, font } from "../../lib/theme";
import { useT } from "../../lib/i18n";

export default function TabsLayout() {
  const t = useT();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMute,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarLabelStyle: { fontSize: font.tiny, fontWeight: font.semibold },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("tab.dashboard"), tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="protect" options={{ title: t("tab.protect"), tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark" size={size} color={color} /> }} />
      <Tabs.Screen name="map" options={{ title: t("tab.map"), tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size - 1} color={color} /> }} />
      <Tabs.Screen name="family" options={{ title: t("tab.family"), tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: t("tab.features"), tabBarIcon: ({ color, size }) => <Ionicons name="apps" size={size - 2} color={color} /> }} />
    </Tabs>
  );
}
