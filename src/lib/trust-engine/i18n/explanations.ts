import type { Language, ReasonCode, Verdict, RecommendedAction } from "../types";
import { localizedScript } from "./scripts-i18n";

/**
 * The honesty layer. The engine emits stable reason CODES; this renders them
 * into any of the twelve languages. A reason that can't be cleanly translated
 * is a reason we shouldn't be showing — so the template table is the contract.
 *
 * Templates use {param} interpolation. Missing languages fall back to English
 * (and the calibration report tracks coverage so we never *claim* a language we
 * haven't had a paid native speaker validate).
 */

type Template = (p: Record<string, string | number>) => string;
type Pack = Partial<Record<Language, Template>>;

const T: Record<string, Pack> = {
  "content.script_match": {
    en: (p) => `Matches a known scam script: ${p.label}. These typically try to extract ${p.extraction}.`,
    fr: (p) => {
      const s = localizedScript(String(p.id), "fr", String(p.label), String(p.extraction));
      return `Correspond à une arnaque connue : ${s.label}. Ce type d'arnaque cherche généralement à obtenir ${s.goal}.`;
    },
    pa: (p) => {
      const s = localizedScript(String(p.id), "pa", String(p.label), String(p.extraction));
      return `ਇੱਕ ਜਾਣੀ-ਪਛਾਣੀ ਧੋਖਾਧੜੀ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ: ${s.label}। ਇਹ ਆਮ ਤੌਰ ਤੇ ${s.goal} ਹਾਸਲ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰਦੀ ਹੈ।`;
    },
    zh: (p) => {
      const s = localizedScript(String(p.id), "zh", String(p.label), String(p.extraction));
      return `匹配已知诈骗脚本：${s.label}。此类诈骗通常试图获取${s.goal}。`;
    },
  },
  "content.long_con_stage": {
    en: (p) => `This looks like stage ${p.stage} of a long con (${p.name}) — the scam unfolds over time. Intervening now still works.`,
    fr: (p) => `Ceci ressemble à l'étape ${p.stage} d'une arnaque de longue durée (${p.name}). Agir maintenant fonctionne encore.`,
    zh: (p) => `这看起来是长期骗局的第${p.stage}阶段（${p.name}）。现在介入仍然有效。`,
  },
  "content.pressure": {
    en: (p) => `Uses pressure tactics (${p.categories}). Legitimate institutions do not rush or threaten you.`,
    fr: (p) => `Utilise des tactiques de pression (${p.categories}). Les vraies institutions ne vous bousculent pas.`,
    pa: (p) => `ਦਬਾਅ ਦੀਆਂ ਚਾਲਾਂ ਵਰਤਦਾ ਹੈ (${p.categories})। ਅਸਲੀ ਸੰਸਥਾਵਾਂ ਜਲਦਬਾਜ਼ੀ ਨਹੀਂ ਕਰਦੀਆਂ।`,
    zh: (p) => `使用施压手段（${p.categories}）。正规机构不会催促或威胁你。`,
  },
  "content.extraction_ask": {
    en: (p) => `Asks for something scammers want (e.g. "${p.example}"). No real agency collects this way.`,
    fr: (p) => `Demande quelque chose que veulent les fraudeurs (p. ex. « ${p.example} »). Aucune vraie agence ne procède ainsi.`,
    zh: (p) => `索要骗子想要的东西（例如"${p.example}"）。正规机构不会这样收款。`,
  },
  "content.triad": {
    en: () => `Combines authority + urgency + a request for money/codes — the classic three-part scam structure.`,
    fr: () => `Combine autorité + urgence + demande d'argent ou de codes — la structure classique d'une arnaque.`,
    zh: () => `结合了权威 + 紧迫感 + 索要钱财/验证码——典型的三段式骗局结构。`,
  },
  "artifact.lookalike": {
    en: (p) => `The link "${p.host}" imitates ${p.brand} but is not its real website.`,
    fr: (p) => `Le lien « ${p.host} » imite ${p.brand} sans être son vrai site.`,
    pa: (p) => `ਲਿੰਕ "${p.host}" ${p.brand} ਦੀ ਨਕਲ ਕਰਦਾ ਹੈ ਪਰ ਇਹ ਅਸਲੀ ਨਹੀਂ ਹੈ।`,
    zh: (p) => `链接"${p.host}"冒充${p.brand}，但不是其真实网站。`,
  },
  "artifact.homoglyph": {
    en: (p) => `The address "${p.host}" uses look-alike characters to disguise a fake domain.`,
    fr: (p) => `L'adresse « ${p.host} » utilise des caractères trompeurs pour déguiser un faux domaine.`,
    zh: (p) => `地址"${p.host}"使用了相似字符来伪装假域名。`,
  },
  "artifact.risky_tld": {
    en: (p) => `Uses a domain ending (.${p.tld}) heavily abused for fraud.`,
    fr: (p) => `Utilise une terminaison de domaine (.${p.tld}) souvent utilisée pour la fraude.`,
    zh: (p) => `使用了常被用于诈骗的域名后缀（.${p.tld}）。`,
  },
  "artifact.shortener": {
    en: (p) => `Hides its real destination behind a link shortener (${p.host}).`,
    fr: (p) => `Masque sa vraie destination derrière un raccourcisseur de lien (${p.host}).`,
    zh: (p) => `用短链接（${p.host}）隐藏真实目的地。`,
  },
  "artifact.ip_literal": {
    en: (p) => `Links to a raw IP address (${p.host}) instead of a real domain — a phishing hallmark.`,
    fr: (p) => `Pointe vers une adresse IP brute (${p.host}) au lieu d'un vrai domaine.`,
    zh: (p) => `链接指向原始 IP 地址（${p.host}）而非真实域名——钓鱼特征。`,
  },
  "artifact.credentials_in_url": {
    en: (p) => `The link embeds login credentials (${p.host}) to deceive you about where it goes.`,
    fr: (p) => `Le lien intègre des identifiants (${p.host}) pour vous tromper sur sa destination.`,
    zh: () => `链接中嵌入了登录凭据以混淆其真实去向。`,
  },
  "artifact.deep_subdomains": {
    en: (p) => `Stacks many sub-domains (${p.host}) to make a fake address look official.`,
    fr: (p) => `Empile de nombreux sous-domaines (${p.host}) pour paraître officiel.`,
    zh: () => `堆叠多层子域名，让假地址看起来正规。`,
  },
  "artifact.brand_offdomain": {
    en: (p) => `Puts "${p.brand}" in the address but the real domain isn't ${p.brand}'s.`,
    fr: (p) => `Place « ${p.brand} » dans l'adresse alors que le vrai domaine ne lui appartient pas.`,
    zh: (p) => `地址里写着"${p.brand}"，但真实域名并不属于它。`,
  },
  "artifact.crypto_recipient": {
    en: (p) => `Payment goes to a crypto wallet (${p.wallet}) — irreversible and a common scam destination.`,
    fr: (p) => `Le paiement va vers un portefeuille crypto (${p.wallet}) — irréversible et typique des arnaques.`,
    zh: (p) => `付款发往加密钱包（${p.wallet}）——不可撤销，且是常见的诈骗目的地。`,
  },
  "artifact.freemail_institution": {
    en: (p) => `An "official" message from a free email account (${p.recipient}). Institutions don't use Gmail/Outlook.`,
    fr: (p) => `Un message « officiel » depuis une adresse gratuite (${p.recipient}). Les institutions n'utilisent pas Gmail.`,
    zh: (p) => `来自免费邮箱（${p.recipient}）的"官方"消息。正规机构不会用 Gmail/Outlook。`,
  },
  "authenticity.synthetic_voice": {
    en: (p) => `Voice shows signs of AI synthesis (~${p.pct}% likelihood — not certain). Verify the person another way.`,
    fr: (p) => `La voix montre des signes de synthèse par IA (~${p.pct} % — pas certain). Vérifiez la personne autrement.`,
    zh: (p) => `语音显示 AI 合成迹象（约 ${p.pct}%，并非确定）。请用其他方式核实对方。`,
  },
  "authenticity.wire_change_on_call": {
    en: () => `A payment-details change requested on a call/video — confirm out-of-band before sending anything.`,
    fr: () => `Un changement de coordonnées de paiement demandé en appel — confirmez par un autre canal avant de payer.`,
    zh: () => `通话/视频中要求更改付款信息——汇款前请通过其他渠道核实。`,
  },
  "network.community_flag": {
    en: (p) => `Reported by the KinShield community: "${p.artifact}" flagged ${p.reports}× as ${p.category}.`,
    fr: (p) => `Signalé par la communauté KinShield : « ${p.artifact} » signalé ${p.reports}× comme ${p.category}.`,
    pa: (p) => `KinShield ਭਾਈਚਾਰੇ ਵੱਲੋਂ ਰਿਪੋਰਟ ਕੀਤਾ ਗਿਆ: "${p.artifact}" ${p.reports} ਵਾਰ।`,
    zh: (p) => `KinShield 社区已举报："${p.artifact}"被标记 ${p.reports} 次为${p.category}。`,
  },
  "anomaly.unsolicited": {
    en: () => `You didn't start this contact. Unsolicited messages about money or accounts deserve extra caution.`,
    fr: () => `Vous n'avez pas initié ce contact. Méfiez-vous des messages non sollicités au sujet d'argent.`,
    zh: () => `不是你主动发起的联系。对于涉及钱财/账户的主动来信要格外小心。`,
  },
  "anomaly.amount_spike": {
    en: (p) => `$${p.amount} is well above your usual (≈$${p.typical}). Unusual amounts are worth a second look.`,
    fr: (p) => `${p.amount} $ dépasse largement votre habitude (≈${p.typical} $). Un montant inhabituel mérite vérification.`,
    zh: (p) => `$${p.amount} 远高于你的常规金额（约 $${p.typical}）。异常金额值得再确认。`,
  },
  "anomaly.large_to_unknown": {
    en: (p) => `Sending $${p.amount} to someone not in your known contacts — verify the recipient first.`,
    fr: (p) => `Envoi de ${p.amount} $ à un destinataire inconnu — vérifiez-le d'abord.`,
    zh: (p) => `向未知联系人转账 $${p.amount}——请先核实收款人。`,
  },
};

export function renderReason(reason: ReasonCode, lang: Language): string {
  const pack = T[reason.code];
  const fn = pack?.[lang] ?? pack?.en;
  if (!fn) return reason.code; // never crash; worst case shows the code
  return fn(reason.params ?? {});
}

const VERDICT_LABELS: Record<Verdict, Record<Language, string>> = {
  safe: { en: "Looks safe", fr: "Semble sûr", pa: "ਸੁਰੱਖਿਅਤ ਲੱਗਦਾ ਹੈ", zh: "看起来安全" },
  caution: { en: "Be careful", fr: "Soyez prudent", pa: "ਸਾਵਧਾਨ ਰਹੋ", zh: "请小心" },
  likely_scam: { en: "Likely a scam", fr: "Probablement une arnaque", pa: "ਸ਼ਾਇਦ ਧੋਖਾ", zh: "可能是诈骗" },
  dangerous: { en: "Dangerous — do not engage", fr: "Dangereux — n'y répondez pas", pa: "ਖ਼ਤਰਨਾਕ — ਜਵਾਬ ਨਾ ਦਿਓ", zh: "危险——请勿回应" },
};

const ACTION_LABELS: Record<RecommendedAction, Record<Language, string>> = {
  allow: { en: "Safe to proceed", fr: "Vous pouvez continuer", pa: "ਅੱਗੇ ਵਧ ਸਕਦੇ ਹੋ", zh: "可以继续" },
  verify: { en: "Verify before acting", fr: "Vérifiez avant d'agir", pa: "ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚੋ", zh: "行动前请核实" },
  do_not_engage: { en: "Do not reply or click", fr: "Ne répondez pas, ne cliquez pas", pa: "ਜਵਾਬ ਨਾ ਦਿਓ", zh: "不要回复或点击" },
  block_and_report: { en: "Block and report", fr: "Bloquez et signalez", pa: "ਬਲਾਕ ਕਰੋ ਤੇ ਰਿਪੋਰਟ ਕਰੋ", zh: "拉黑并举报" },
  incident_mode: { en: "Open Incident Mode now", fr: "Ouvrez le mode incident", pa: "ਇੰਸੀਡੈਂਟ ਮੋਡ ਖੋਲ੍ਹੋ", zh: "立即打开事件模式" },
};

export const verdictLabel = (v: Verdict, lang: Language): string =>
  VERDICT_LABELS[v][lang] ?? VERDICT_LABELS[v].en;
export const actionLabel = (a: RecommendedAction, lang: Language): string =>
  ACTION_LABELS[a][lang] ?? ACTION_LABELS[a].en;
