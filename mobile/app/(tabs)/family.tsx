import React, { useState } from "react";
import { View, Text } from "react-native";
import Svg, { Line, Circle, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Card, Title, H3, Small, Kicker, Row, Pill } from "../../components/ui";
import { useVraiShield } from "../../lib/store";
import { useT } from "../../lib/i18n";
import { colors, font, space } from "../../lib/theme";

interface M { name: string; role: string; device: string; senior?: boolean; guardian?: boolean }

const DEMO: M[] = [
  { name: "Priya", role: "Guardian", device: "iPhone", guardian: true },
  { name: "Arjun", role: "Member", device: "Pixel" },
  { name: "Dadi", role: "Protected", device: "Galaxy", senior: true },
  { name: "Nanu", role: "Protected", device: "iPhone", senior: true },
  { name: "Simran", role: "Member", device: "iPhone" },
];

const POLICIES = [
  { key: "screen", label: "Screen unknown callers for seniors", sub: "Routes to the VraiShield Line" },
  { key: "ping", label: "Ping guardian on transfers over $500", sub: "Policy-set, not surveillance" },
  { key: "slow", label: "Use the patient screening persona", sub: "Senior Mode households" },
  { key: "broadcast", label: "Alert the circle if Incident Mode opens", sub: "Silent, instant" },
];

export default function Family() {
  const ks = useVraiShield();
  const t = useT();
  const members: M[] = ks.onboarded && ks.household.members.length > 0
    ? ks.household.members.map((m) => ({ name: m.name, role: m.role, device: m.device, senior: m.role === "senior", guardian: m.role === "guardian" }))
    : DEMO;
  const name = ks.onboarded && ks.household.name ? ks.household.name : "The Singh family";
  const [policies, setPolicies] = useState<Record<string, boolean>>({ screen: true, ping: true, slow: true, broadcast: true });

  return (
    <Screen>
      <Kicker>{t("family.kicker")}</Kicker>
      <Title style={{ marginTop: 4 }}>{t("family.title")}</Title>
      <Small style={{ marginTop: 4, marginBottom: space.lg }}>{t("family.sub")}</Small>

      <Card>
        <Row style={{ justifyContent: "space-between" }}>
          <Kicker color={colors.textDim}>{name}</Kicker>
          <Small>{t("family.count", { n: members.length })}</Small>
        </Row>
        <Constellation members={members} />
        <Small style={{ textAlign: "center", marginTop: 4 }}>{t("family.coverage")}</Small>
      </Card>

      <H3 style={{ marginTop: space.lg, marginBottom: 10 }}>{t("family.members")}</H3>
      <View style={{ gap: 8 }}>
        {members.map((m, i) => (
          <Card key={i} style={{ paddingVertical: 12 }}>
            <Row>
              <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: (m.senior ? colors.warn : m.guardian ? colors.primary : colors.info) + "22" }}>
                <Ionicons name={m.senior ? "accessibility" : m.guardian ? "shield" : "person"} size={18} color={m.senior ? colors.warn : m.guardian ? colors.primary : colors.info} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: font.body }}>{m.name}</Text>
                <Small>{m.role} · {m.device}</Small>
              </View>
            </Row>
          </Card>
        ))}
      </View>

      <H3 style={{ marginTop: space.lg, marginBottom: 10 }}>{t("family.policies")}</H3>
      <View style={{ gap: 8 }}>
        {POLICIES.map((p) => (
          <Card key={p.key} onPress={() => setPolicies((s) => ({ ...s, [p.key]: !s[p.key] }))} style={{ paddingVertical: 14 }}>
            <Row style={{ justifyContent: "space-between" }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: colors.text, fontWeight: font.semibold, fontSize: font.body }}>{p.label}</Text>
                <Small>{p.sub}</Small>
              </View>
              <Toggle on={!!policies[p.key]} />
            </Row>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

function Constellation({ members }: { members: M[] }) {
  const size = 280;
  const cx = size / 2;
  const R = 96;
  return (
    <Svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} style={{ marginTop: 8 }}>
      {members.map((_, i) => {
        const a = (i / members.length) * Math.PI * 2 - Math.PI / 2;
        return <Line key={`l${i}`} x1={cx} y1={cx} x2={cx + R * Math.cos(a)} y2={cx + R * Math.sin(a)} stroke="rgba(47,211,155,0.25)" strokeWidth={1.5} />;
      })}
      <Circle cx={cx} cy={cx} r={28} fill="rgba(47,211,155,0.16)" stroke={colors.primary} strokeWidth={2} />
      <SvgText x={cx} y={cx + 4} fontSize={12} fill={colors.text} fontWeight="700" textAnchor="middle">Kin</SvgText>
      {members.map((m, i) => {
        const a = (i / members.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + R * Math.cos(a);
        const y = cx + R * Math.sin(a);
        const col = m.senior ? colors.warn : m.guardian ? colors.primary : colors.info;
        return (
          <React.Fragment key={i}>
            <Circle cx={x} cy={y} r={22} fill={colors.bg} stroke={col} strokeWidth={2} />
            <SvgText x={x} y={y + 4} fontSize={9} fill={colors.text} fontWeight="600" textAnchor="middle">{m.name.split(" ")[0].slice(0, 6)}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <View style={{ width: 46, height: 28, borderRadius: 14, backgroundColor: on ? colors.primary : "rgba(148,163,184,0.3)", justifyContent: "center", paddingHorizontal: 3 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff", alignSelf: on ? "flex-end" : "flex-start" }} />
    </View>
  );
}
