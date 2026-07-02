import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { VraiShieldProvider } from "../lib/store";
import { useT } from "../lib/i18n";
import { colors } from "../lib/theme";

SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {});

function AppStack() {
  const t = useT();
  return (
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
      <Stack.Screen name="check/[id]" options={{ title: t("check.title") }} />
      <Stack.Screen name="scan" options={{ title: t("protect.scan") }} />
      <Stack.Screen name="incident" options={{ title: t("incident.title") }} />
      <Stack.Screen name="scam-drill" options={{ title: t("drill.title") }} />
      <Stack.Screen name="settings" options={{ title: t("set.title") }} />
      <Stack.Screen name="alerts" options={{ title: t("alerts.title") }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <VraiShieldProvider>
          <StatusBar style="light" />
          <AppStack />
        </VraiShieldProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
