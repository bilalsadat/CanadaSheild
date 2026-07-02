import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { Button, Card, Small, Body } from "../components/ui";
import { VerdictView } from "../components/VerdictView";
import { scoreTrust, explain } from "../lib/trust-engine";
import { networkLookup } from "../lib/data";
import { useKinShield } from "../lib/store";
import { toScanDetail } from "../lib/verdict";
import { colors, font, space, radius } from "../lib/theme";

export default function Scan() {
  const ks = useKinShield();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<string | null>(null);
  const [ignored, setIgnored] = useState(false);
  const [res, setRes] = useState<ReturnType<typeof scoreTrust> | null>(null);
  const [rend, setRend] = useState<ReturnType<typeof explain> | null>(null);

  function handleScan({ data }: { data: string }) {
    if (scanned || ignored) return;
    // Ignore developer/app QR codes (e.g. the Expo Go launcher) — not links to check.
    if (/^exp(s)?:\/\//i.test(data) || /expo\.dev|exp\.host|u\.expo\.dev/i.test(data)) {
      setIgnored(true);
      return;
    }
    setScanned(data);
    const isUrl = /^(https?:\/\/|www\.)|\.[a-z]{2,}(\/|$)/i.test(data);
    const r = scoreTrust({ text: data, url: isUrl ? data : undefined, channel: "qr", network: networkLookup });
    const e = explain(r);
    setRes(r);
    setRend(e);
    ks.addScan({ channel: "qr", score: r.trustScore, verdict: r.verdict, snippet: data.slice(0, 80), scriptLabel: r.detectedScript?.label, detail: toScanDetail(r, e, data) });
    Haptics.notificationAsync(r.trustScore < 45 ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  function reset() { setScanned(null); setRes(null); setRend(null); setIgnored(false); }

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", padding: space.xl }}>
        <Stack.Screen options={{ title: "Scan QR" }} />
        <Ionicons name="qr-code-outline" size={48} color={colors.primary} />
        <Body style={{ textAlign: "center", marginTop: 16 }}>KinShield needs the camera to scan a QR code and check it for fraud. It only reads the code you point at.</Body>
        <Button label="Allow camera" icon="camera" onPress={requestPermission} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Stack.Screen options={{ title: "Scan QR", headerTransparent: true }} />
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />
      {/* Reticle overlay */}
      {!scanned && !ignored && (
        <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 230, height: 230, borderRadius: 24, borderWidth: 3, borderColor: colors.primary }} />
          <Text style={{ color: "#fff", marginTop: 18, fontSize: font.body, fontWeight: font.semibold }}>Point at a QR code</Text>
        </View>
      )}

      {/* Ignored an app/dev QR */}
      {ignored && (
        <View style={{ position: "absolute", left: space.lg, right: space.lg, bottom: 60 }}>
          <Card>
            <Body style={{ textAlign: "center" }}>That&apos;s an app QR code, not a link to check. Point at a QR from a poster, invoice, or message.</Body>
            <Button label="Scan again" icon="scan" onPress={reset} style={{ marginTop: space.md }} />
          </Card>
        </View>
      )}

      {/* Result sheet */}
      {res && rend && (
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: space.sm, maxHeight: "72%" }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, alignSelf: "center", marginVertical: 8 }} />
          <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 0 }}>
            <Card style={{ marginBottom: space.md, paddingVertical: 12 }}>
              <Small>Decoded from QR</Small>
              <Text numberOfLines={2} style={{ color: colors.text, fontSize: font.small, marginTop: 4 }}>{scanned}</Text>
            </Card>
            <VerdictView result={res} rendered={rend} />
            <Button label="Scan another" icon="scan" onPress={reset} style={{ marginTop: space.md }} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}
