import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Title, H3, Small, Body, Button, Row } from "../components/ui";
import { useVraiShield, type Member, type MemberRole } from "../lib/store";
import { LogoWordmark } from "../components/Logo";
import type { Language } from "../lib/trust-engine";
import { colors, font, space, radius } from "../lib/theme";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "English" }, { code: "fr", label: "Français" }, { code: "pa", label: "ਪੰਜਾਬੀ" }, { code: "zh", label: "中文" },
  { code: "es", label: "Español" }, { code: "tl", label: "Tagalog" }, { code: "ar", label: "العربية" }, { code: "vi", label: "Tiếng Việt" },
  { code: "ko", label: "한국어" }, { code: "pt", label: "Português" }, { code: "hi", label: "हिन्दी" },
];

export default function Welcome() {
  const ks = useVraiShield();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"self" | "parent" | "business" | "">("");
  const [language, setLanguage] = useState<Language>("en");
  const [household, setHousehold] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [mName, setMName] = useState("");
  const [mRole, setMRole] = useState<MemberRole>("senior");
  const [tier, setTier] = useState<"Free" | "Family" | "Premium">("Family");

  function addMember() {
    if (!mName.trim()) return;
    setMembers((m) => [...m, { id: Math.random().toString(36).slice(2, 9), name: mName, role: mRole, device: "iPhone", language }]);
    setMName("");
  }
  function finish() {
    const all: Member[] = [{ id: "you", name: name || "You", role: "guardian", device: "This iPhone", language }, ...members];
    ks.completeOnboarding({ name: name || "You", role: role || "self", language, household: household || `${name || "My"} household`, members: all, tier, seniorMode: role === "parent" });
    router.replace("/");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Row style={{ justifyContent: "space-between", marginBottom: space.md }}>
          <LogoWordmark size={18} mark={24} />
          <Pressable onPress={finish}><Small>Skip</Small></Pressable>
        </Row>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(148,163,184,0.16)", marginBottom: space.lg, overflow: "hidden" }}>
          <View style={{ height: 6, width: `${((step + 1) / 4) * 100}%`, backgroundColor: colors.primary, borderRadius: 3 }} />
        </View>

        {step === 0 && (
          <View>
            <Title>Let&apos;s get you protected</Title>
            <Small style={{ marginTop: 6, marginBottom: space.lg }}>About 60 seconds. Everything stays on your device.</Small>
            <Label>What should we call you?</Label>
            <Input value={name} onChange={setName} placeholder="Your first name" />
            <Label style={{ marginTop: space.lg }}>Who are you protecting?</Label>
            <View style={{ gap: 8, marginTop: 8 }}>
              {([["self", "Myself", "person"], ["parent", "A parent / senior", "accessibility"], ["business", "My business", "business"]] as const).map(([v, l, ic]) => (
                <Pressable key={v} onPress={() => setRole(v)} style={optStyle(role === v)}>
                  <Ionicons name={ic as any} size={20} color={role === v ? colors.primary : colors.textDim} />
                  <Text style={{ color: role === v ? colors.primary : colors.text, fontWeight: font.semibold, fontSize: font.body }}>{l}</Text>
                </Pressable>
              ))}
            </View>
            <Button label="Continue" onPress={() => setStep(1)} style={{ marginTop: space.xl, opacity: name.trim() && role ? 1 : 0.5 }} />
          </View>
        )}

        {step === 1 && (
          <View>
            <Title>Your language</Title>
            <Small style={{ marginTop: 6, marginBottom: space.lg }}>Detection, explanations and spoken verdicts adapt to it.</Small>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {LANGS.map((l) => (
                <Pressable key={l.code} onPress={() => setLanguage(l.code)} style={{ borderRadius: radius.md, borderWidth: 1, borderColor: language === l.code ? colors.primary : colors.border, backgroundColor: language === l.code ? colors.primaryDim : "transparent", paddingHorizontal: 14, paddingVertical: 10 }}>
                  <Text style={{ color: language === l.code ? colors.primary : colors.text }}>{l.label}</Text>
                </Pressable>
              ))}
            </View>
            <Nav onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </View>
        )}

        {step === 2 && (
          <View>
            <Title>Build your Family Circle</Title>
            <Small style={{ marginTop: 6, marginBottom: space.lg }}>Add the people you want under one shield.</Small>
            <Label>Household name</Label>
            <Input value={household} onChange={setHousehold} placeholder="e.g. The Singh family" />
            <View style={{ marginTop: space.md, backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border }}>
              <Label>Add a member</Label>
              <Input value={mName} onChange={setMName} placeholder="Name" />
              <Row style={{ gap: 8, marginTop: 8 }}>
                {(["senior", "member", "guardian"] as MemberRole[]).map((r) => (
                  <Pressable key={r} onPress={() => setMRole(r)} style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: mRole === r ? colors.primary : colors.border, paddingVertical: 8, alignItems: "center" }}>
                    <Text style={{ color: mRole === r ? colors.primary : colors.textDim, fontSize: font.small }}>{r === "senior" ? "Senior" : r === "guardian" ? "Guardian" : "Member"}</Text>
                  </Pressable>
                ))}
              </Row>
              <Button label="Add member" icon="add" variant="ghost" onPress={addMember} style={{ marginTop: 10 }} />
            </View>
            {members.map((m) => (
              <Row key={m.id} style={{ justifyContent: "space-between", backgroundColor: colors.primaryDim, borderRadius: 10, padding: 10, marginTop: 8 }}>
                <Text style={{ color: colors.text }}>{m.name} · {m.role}</Text>
                <Pressable onPress={() => setMembers((x) => x.filter((y) => y.id !== m.id))}><Ionicons name="close" size={18} color={colors.textMute} /></Pressable>
              </Row>
            ))}
            <Nav onBack={() => setStep(1)} onNext={() => setStep(3)} disabled={!household.trim()} />
          </View>
        )}

        {step === 3 && (
          <View>
            <Title>Choose a plan</Title>
            <Small style={{ marginTop: 6, marginBottom: space.lg }}>Start free. This demo unlocks everything regardless.</Small>
            {([["Free", "$0", "SMS Shield, basic checks, Incident Mode"], ["Family", "$9.99/mo", "The Line, Family Circle, Crisis Vault, Long-Con Radar"], ["Premium", "$19.99/mo", "Human Recovery Line, Wire Guard, Voice Lock, Insurance"]] as const).map(([t, p, d]) => (
              <Pressable key={t} onPress={() => setTier(t)} style={[optStyle(tier === t), { marginBottom: 8, alignItems: "flex-start" }]}>
                <Row style={{ justifyContent: "space-between", width: "100%" }}>
                  <Text style={{ color: colors.text, fontWeight: font.bold, fontSize: font.body }}>{t}</Text>
                  <Text style={{ color: colors.primary, fontWeight: font.semibold }}>{p}</Text>
                </Row>
                <Small style={{ marginTop: 2 }}>{d}</Small>
              </Pressable>
            ))}
            <Button label="Enter VraiShield" icon="arrow-forward" onPress={finish} style={{ marginTop: space.lg }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function optStyle(active: boolean) {
  return { flexDirection: "row" as const, alignItems: "center" as const, gap: 12, borderRadius: radius.md, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primaryDim : "transparent", padding: 14 };
}
function Label({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[{ color: colors.text, fontWeight: font.semibold, fontSize: font.small, marginBottom: 6 }, style]}>{children}</Text>;
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.textMute} style={{ color: colors.text, fontSize: font.body, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12 }} />;
}
function Nav({ onBack, onNext, disabled }: { onBack: () => void; onNext: () => void; disabled?: boolean }) {
  return (
    <Row style={{ gap: 12, marginTop: space.xl }}>
      <Button label="Back" variant="ghost" onPress={onBack} style={{ flex: 1 }} />
      <Button label="Continue" onPress={onNext} style={{ flex: 2, opacity: disabled ? 0.5 : 1 }} />
    </Row>
  );
}
