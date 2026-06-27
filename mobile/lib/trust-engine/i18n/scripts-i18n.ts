import type { Language } from "../types";

/**
 * Localized scam-script names and goals. Keeping these out of the English corpus
 * means a French or Chinese verdict reads as one clean sentence — never the
 * half-translated "...obtenir gift cards, bitcoin..." that the claims discipline
 * exists to prevent. English is the fallback for languages not yet validated.
 */

interface Loc {
  label: Partial<Record<Language, string>>;
  goal: Partial<Record<Language, string>>;
}

export const SCRIPT_I18N: Record<string, Loc> = {
  cra_arrest: {
    label: { fr: "arnaque d'arrestation « ARC / NAS suspendu »", zh: "“税务局/社保号被冻结”逮捕骗局", pa: "CRA/SIN ਗ੍ਰਿਫ਼ਤਾਰੀ ਧੋਖਾ" },
    goal: { fr: "des cartes-cadeaux, du bitcoin ou un virement pour « régler » une fausse dette", zh: "礼品卡、比特币或电子转账来“清偿”虚假欠款", pa: "ਨਕਲੀ ਕਰਜ਼ਾ ਲਈ ਗਿਫਟ ਕਾਰਡ ਜਾਂ ਪੈਸੇ" },
  },
  interac_etransfer: {
    label: { fr: "hameçonnage de virement Interac", zh: "Interac 转账钓鱼", pa: "Interac ਈ-ਟ੍ਰਾਂਸਫਰ ਫਿਸ਼ਿੰਗ" },
    goal: { fr: "vos identifiants bancaires sur une fausse page", zh: "在假冒页面上窃取你的银行登录信息", pa: "ਨਕਲੀ ਪੰਨੇ ਤੇ ਤੁਹਾਡੇ ਬੈਂਕ ਵੇਰਵੇ" },
  },
  canada_post_duty: {
    label: { fr: "hameçonnage « frais de douane » Postes Canada", zh: "加拿大邮政“关税费”短信钓鱼", pa: "ਕੈਨੇਡਾ ਪੋਸਟ ਡਿਊਟੀ ਧੋਖਾ" },
    goal: { fr: "vos données de carte pour de faux « frais »", zh: "以小额“费用”为名骗取你的银行卡信息", pa: "ਛੋਟੀ ਫੀਸ ਲਈ ਕਾਰਡ ਵੇਰਵੇ" },
  },
  ircc_immigration: {
    label: { fr: "menace sur le statut d'immigration (IRCC)", zh: "移民身份威胁（IRCC）", pa: "ਇਮੀਗ੍ਰੇਸ਼ਨ ਸਟੇਟਸ ਧਮਕੀ (IRCC)" },
    goal: { fr: "des frais et documents aux nouveaux arrivants effrayés", zh: "向害怕失去身份的新移民索取费用和证件", pa: "ਨਵੇਂ ਆਏ ਲੋਕਾਂ ਤੋਂ ਫੀਸ ਤੇ ਕਾਗਜ਼" },
  },
  grandparent_emergency: {
    label: { fr: "arnaque d'urgence familiale (grands-parents)", zh: "祖父母/家庭紧急骗局", pa: "ਪਰਿਵਾਰਕ ਐਮਰਜੈਂਸੀ ਧੋਖਾ" },
    goal: { fr: "de l'argent urgent avant que la famille ne vérifie", zh: "在家人核实之前索要紧急汇款", pa: "ਪਰਿਵਾਰ ਦੀ ਜਾਂਚ ਤੋਂ ਪਹਿਲਾਂ ਪੈਸੇ" },
  },
  pig_butchering: {
    label: { fr: "arnaque sentimentale d'investissement (longue durée)", zh: "杀猪盘/恋爱投资骗局（长期）", pa: "ਰੋਮਾਂਸ ਨਿਵੇਸ਼ ਧੋਖਾ" },
    goal: { fr: "des « investissements » croissants vers une fausse plateforme", zh: "诱导你向虚假交易所不断“投资”", pa: "ਨਕਲੀ ਪਲੇਟਫਾਰਮ ਤੇ ਵਧਦੇ ਨਿਵੇਸ਼" },
  },
  bank_security: {
    label: { fr: "usurpation du service des fraudes bancaires", zh: "冒充银行欺诈部门", pa: "ਬੈਂਕ ਫਰਾਡ ਵਿਭਾਗ ਦੀ ਨਕਲ" },
    goal: { fr: "votre code à usage unique ou un virement vers un « compte sûr »", zh: "你的一次性验证码或转入“安全账户”", pa: "ਤੁਹਾਡਾ OTP ਜਾਂ “ਸੁਰੱਖਿਅਤ ਖਾਤੇ” ਚ ਟ੍ਰਾਂਸਫਰ" },
  },
  tech_support: {
    label: { fr: "arnaque au support technique / accès à distance", zh: "技术支持/远程访问骗局", pa: "ਟੈਕ ਸਪੋਰਟ / ਰਿਮੋਟ ਐਕਸੈਸ ਧੋਖਾ" },
    goal: { fr: "le contrôle à distance de votre appareil", zh: "远程控制你的设备", pa: "ਤੁਹਾਡੇ ਡਿਵਾਈਸ ਦਾ ਰਿਮੋਟ ਕੰਟਰੋਲ" },
  },
  prize_lottery: {
    label: { fr: "arnaque à la loterie / au prix (frais d'avance)", zh: "中奖/彩票预付费骗局", pa: "ਇਨਾਮ / ਲਾਟਰੀ ਧੋਖਾ" },
    goal: { fr: "des « frais » d'avance pour un prix inexistant", zh: "为不存在的奖品预付“手续费”", pa: "ਨਾ-ਮੌਜੂਦ ਇਨਾਮ ਲਈ ਪੇਸ਼ਗੀ ਫੀਸ" },
  },
  job_offer: {
    label: { fr: "arnaque à l'offre d'emploi / au colis", zh: "招聘/刷单/转运骗局", pa: "ਨੌਕਰੀ ਦੀ ਪੇਸ਼ਕਸ਼ ਧੋਖਾ" },
    goal: { fr: "un faux chèque en trop-perçu ou des frais d'« équipement »", zh: "假支票多付款或预付“设备”费用", pa: "ਨਕਲੀ ਚੈੱਕ ਜਾਂ ਪੇਸ਼ਗੀ ਫੀਸ" },
  },
  gift_card_extraction: {
    label: { fr: "extorsion par cartes-cadeaux", zh: "礼品卡套取骗局", pa: "ਗਿਫਟ ਕਾਰਡ ਧੋਖਾ" },
    goal: { fr: "des codes de cartes-cadeaux intraçables", zh: "无法追踪的礼品卡兑换码", pa: "ਨਾ-ਟਰੇਸ ਹੋਣ ਵਾਲੇ ਗਿਫਟ ਕਾਰਡ ਕੋਡ" },
  },
  sextortion: {
    label: { fr: "sextorsion / chantage à l'image intime", zh: "性勒索/私密影像勒索", pa: "ਸੈਕਸਟੌਰਸ਼ਨ ਧੋਖਾ" },
    goal: { fr: "un paiement en crypto sous la menace (souvent un bluff)", zh: "以威胁手段索取加密货币（通常是虚张声势）", pa: "ਧਮਕੀ ਹੇਠ ਕ੍ਰਿਪਟੋ ਭੁਗਤਾਨ" },
  },
};

export function localizedScript(id: string, lang: Language, fallbackLabel: string, fallbackGoal: string) {
  const loc = SCRIPT_I18N[id];
  return {
    label: loc?.label[lang] ?? fallbackLabel,
    goal: loc?.goal[lang] ?? fallbackGoal,
  };
}
