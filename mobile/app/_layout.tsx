import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { KinShieldProvider } from "../lib/store";
import { colors } from "../lib/theme";

SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <KinShieldProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: "700" },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.bg },
              headerBackButtonDisplayMode: "minimal",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false, presentation: "modal" }} />
            <Stack.Screen name="feature/[slug]" options={{ title: "" }} />
            <Stack.Screen name="scan" options={{ title: "Scan QR" }} />
            <Stack.Screen name="incident" options={{ title: "Incident Mode" }} />
            <Stack.Screen name="scam-drill" options={{ title: "Scam Drill" }} />
            <Stack.Screen name="settings" options={{ title: "Settings & Privacy" }} />
            <Stack.Screen name="alerts" options={{ title: "Alerts" }} />
          </Stack>
        </KinShieldProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
