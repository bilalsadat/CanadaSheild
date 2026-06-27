import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, font } from "../../lib/theme";

export default function TabsLayout() {
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
      <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="protect" options={{ title: "Protect", tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark" size={size} color={color} /> }} />
      <Tabs.Screen name="map" options={{ title: "Map", tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size - 1} color={color} /> }} />
      <Tabs.Screen name="family" options={{ title: "Family", tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: "Features", tabBarIcon: ({ color, size }) => <Ionicons name="apps" size={size - 2} color={color} /> }} />
    </Tabs>
  );
}
