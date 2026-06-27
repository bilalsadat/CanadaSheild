import React, { useState } from "react";
import { View, Text, Pressable, Alert, Share, Linking, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Card, H3, Small, Kicker, Row } from "../components/ui";
import { useKinShield } from "../lib/store";
import { useT } from "../lib/i18n";
import { colors, font, space, radius } from "../lib/theme";
import type { Language } from "../lib/trust-engine";
import type { Settings } from "../lib/store";

const LANGS: { code: Language; label: string; native: string; full: boolean }[] = [
  { code: "en", label: "English", native: "English", full: true },
  { code: "fr", label: "French", native: "Français", full: true },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", full: false },
  { code: "zh", label: "Chinese", native: "中文", full: false },
  { code: "es", label: "Spanish", native: "Español", full: false },
  { code: "tl", label: "Tagalog", native: "Tagalog", full: false },
  { code: "ar", label: "Arabic", native: "العربية", full: false },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt", full: false },
  { code: "ko", label: "Korean", native: "한국어", full: false },
  { code: "pt", label: "Portuguese", native: "Português", full: false },
  { code: "hi", label: "Hindi", native: "हिन्दी", full: false },
];

export default function SettingsScreen() {
  const ks = useKinShield();
  const t = useT();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGS.find((l) => l.code === ks.settings.language) ?? LANGS[0];
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.lg, paddingBottom: 60 }}>
      <Stack.Screen options={{ title: t("set.title") }} />
      {/* Account */}
      <Card style={{ marginBottom: space.lg }}>
        <Row>
          <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: colors.primaryDim, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.primary, fontSize: 22, fontWeight: font.bold }}>{(ks.profile.name || "U").slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <H3>{ks.profile.name || t("dash.welcome")}</H3>
            <Small>{t("set.householdPlan", { plan: ks.profile.tier, n: ks.household.members.length || 1 })}</Small>
          </View>
          <View style={{ backgroundColor: colors.primaryDim, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: colors.primary, fontSize: font.tiny, fontWeight: font.bold }}>{ks.profile.tier}</Text>
          </View>
        </Row>
      </Card>

      {/* Language & region */}
      <SectionLabel>{t("set.langRegion")}</SectionLabel>
      <Card style={{ marginBottom: space.lg, padding: 0, overflow: "hidden" }}>
        <SettingsRow icon="language" label={t("set.appLanguage")} sub={t("set.appLanguageSub")} value={currentLang.native} onPress={() => setLangOpen((o) => !o)} chevron={langOpen ? "chevron-up" : "chevron-down"} last={!langOpen} />
        {langOpen && (
          <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            {LANGS.map((l, i) => {
              const active = l.code === ks.settings.language;
              return (
                <Pressable key={l.code} onPress={() => { ks.setSetting("language", l.code); setLangOpen(false); }} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 13, paddingHorizontal: space.lg, gap: 12, borderBottomWidth: i === LANGS.length - 1 ? 0 : 1, borderBottomColor: colors.border, backgroundColor: active ? colors.primaryDim : "transparent" }}>
                  <Text style={{ color: active ? colors.primary : colors.text, fontSize: font.body, fontWeight: active ? font.semibold : font.regular, flex: 1 }}>
                    {l.native} <Text style={{ color: colors.textMute, fontSize: font.small }}>· {l.label}</Text>
                  </Text>
                  {l.full && <View style={{ backgroundColor: colors.primaryDim, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ color: colors.primary, fontSize: 10, fontWeight: font.bold }}>UI</Text></View>}
                  {active && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                </Pressable>
              );
            })}
            <View style={{ padding: space.lg, paddingTop: 10 }}><Small>{t("set.uiNote")}</Small></View>
          </View>
        )}
      </Card>

      {/* Preferences */}
      <SectionLabel>{t("set.preferences")}</SectionLabel>
      <Card style={{ marginBottom: space.lg, padding: 0, overflow: "hidden" }}>
        <Toggle icon="accessibility" label={t("set.seniorMode")} sub={t("set.seniorModeSub")} settingKey="seniorMode" />
        <Toggle icon="volume-high" label={t("set.speak")} sub={t("set.speakSub")} settingKey="speakVerdicts" />
        <Toggle icon="notifications" label={t("set.notifications")} sub={t("set.notificationsSub")} settingKey="notifications" />
        <Toggle icon="call" label={t("set.screenCallers")} sub={t("set.screenCallersSub")} settingKey="screenUnknownCallers" last />
      </Card>

      {/* Plan */}
      <SectionLabel>{t("set.plan")}</SectionLabel>
      <Card style={{ marginBottom: space.lg }}>
        <Row style={{ gap: 8 }}>
          {(["Free", "Family", "Premium"] as const).map((tier) => (
            <Pressable key={tier} onPress={() => ks.setTier(tier)} style={{ flex: 1, borderRadius: radius.md, borderWidth: 1, borderColor: ks.profile.tier === tier ? colors.primary : colors.border, backgroundColor: ks.profile.tier === tier ? colors.primaryDim : "transparent", paddingVertical: 12, alignItems: "center" }}>
              <Text style={{ color: ks.profile.tier === tier ? colors.primary : colors.textDim, fontWeight: font.semibold }}>{tier}</Text>
            </Pressable>
          ))}
        </Row>
      </Card>

      {/* Privacy */}
      <SectionLabel>{t("set.privacy")}</SectionLabel>
      <Row style={{ gap: space.md, marginBottom: space.lg }}>
        <Card style={{ flex: 1, borderColor: colors.primary + "33" }}>
          <Ionicons name="lock-closed" size={18} color={colors.primary} />
          <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: 15, marginTop: 8 }}>{t("set.personalPlane")}</Text>
          <Small style={{ marginTop: 4 }}>{t("set.personalPlaneSub", { n: ks.history.length })}</Small>
        </Card>
        <Card style={{ flex: 1 }}>
          <Ionicons name="globe" size={18} color={colors.textDim} />
          <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: 15, marginTop: 8 }}>{t("set.networkPlane")}</Text>
          <Small style={{ marginTop: 4 }}>{t("set.networkPlaneSub")}</Small>
        </Card>
      </Row>

      {/* Data */}
      <SectionLabel>{t("set.data")}</SectionLabel>
      <Card style={{ marginBottom: space.lg, padding: 0, overflow: "hidden" }}>
        <SettingsRow icon="download-outline" label={t("set.exportData")} sub={t("set.exportDataSub")} onPress={() => exportData(ks)} />
        <SettingsRow icon="trash-outline" tint={colors.danger} label={t("set.deleteAll")} onPress={() => Alert.alert(t("set.deleteConfirmTitle"), t("set.deleteConfirmBody"), [{ text: t("common.cancel"), style: "cancel" }, { text: t("common.delete"), style: "destructive", onPress: () => ks.reset() }])} last />
      </Card>

      {/* About */}
      <SectionLabel>{t("set.about")}</SectionLabel>
      <Card style={{ marginBottom: space.lg, padding: 0, overflow: "hidden" }}>
        <SettingsRow icon="star-outline" label={t("set.rate")} onPress={() => Linking.openURL("https://apps.apple.com").catch(() => {})} />
        <SettingsRow icon="share-social-outline" label={t("set.share")} onPress={() => Share.share({ message: "KinShield — fraud defence for every Canadian family. https://kinshield.ca" }).catch(() => {})} />
        <SettingsRow icon="help-buoy-outline" label={t("set.help")} onPress={() => Linking.openURL("mailto:support@kinshield.ca").catch(() => {})} />
        <SettingsRow icon="document-text-outline" label={t("set.privacyPolicy")} onPress={() => Linking.openURL("https://kinshield.ca/privacy").catch(() => {})} />
        <SettingsRow icon="reader-outline" label={t("set.terms")} onPress={() => Linking.openURL("https://kinshield.ca/terms").catch(() => {})} />
        <SettingsRow icon="information-circle-outline" label={t("set.version")} value={`${version} (54)`} last />
      </Card>

      <Small style={{ textAlign: "center", marginTop: space.sm }}>{t("set.footer")}</Small>
    </ScrollView>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Kicker color={colors.textMute}>{children}</Kicker>;
}

function SettingsRow({ icon, label, sub, value, onPress, chevron = "chevron-forward", tint = colors.text, last }: { icon: any; label: string; sub?: string; value?: string; onPress?: () => void; chevron?: any; tint?: string; last?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 13, paddingHorizontal: space.lg, gap: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }}>
      <Ionicons name={icon} size={20} color={tint === colors.danger ? colors.danger : colors.textDim} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: tint, fontSize: font.body, fontWeight: font.medium }}>{label}</Text>
        {sub && <Small style={{ marginTop: 1 }}>{sub}</Small>}
      </View>
      {value && <Text style={{ color: colors.textMute, fontSize: font.small }}>{value}</Text>}
      {onPress && <Ionicons name={chevron} size={18} color={colors.textMute} />}
    </Pressable>
  );
}

function Toggle({ icon, label, sub, settingKey, last }: { icon: any; label: string; sub: string; settingKey: keyof Settings; last?: boolean }) {
  const ks = useKinShield();
  const on = !!ks.settings[settingKey];
  return (
    <Pressable onPress={() => ks.setSetting(settingKey, !on as never)} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 13, paddingHorizontal: space.lg, gap: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }}>
      <Ionicons name={icon} size={20} color={colors.textDim} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: font.body, fontWeight: font.medium }}>{label}</Text>
        <Small style={{ marginTop: 1 }}>{sub}</Small>
      </View>
      <View style={{ width: 46, height: 28, borderRadius: 14, backgroundColor: on ? colors.primary : "rgba(148,163,184,0.3)", justifyContent: "center", paddingHorizontal: 3 }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff", alignSelf: on ? "flex-end" : "flex-start" }} />
      </View>
    </Pressable>
  );
}

function exportData(ks: ReturnType<typeof useKinShield>) {
  const summary = { profile: ks.profile, household: ks.household, history: ks.history, settings: ks.settings, hardeningScore: ks.hardeningScore, drillBest: ks.drillBest };
  Share.share({ message: JSON.stringify(summary, null, 2) }).catch(() => {});
}
