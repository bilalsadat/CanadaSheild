/**
 * The Canadian scam-script corpus — KinShield's first moat made concrete.
 *
 * Each entry is a "script DNA": the named con, the institutions it impersonates,
 * multilingual trigger phrases (losses concentrate in non-English communities,
 * so the corpus is multilingual by construction, not as a translation
 * afterthought), the extraction method, and — for long cons — the staged
 * progression that Long-Con Radar reads over time.
 *
 * This is deliberately a transparent, auditable rule corpus rather than an
 * opaque model: in production it SEEDS and is continually refreshed by the
 * fine-tuned multilingual classifier and the consented community/honeypot feed.
 * Keeping the seed legible is what lets us publish calibration with receipts.
 */

export interface ScamScript {
  id: string;
  label: string;
  /** Canadian institutions/brands this script wears as a mask. */
  impersonates: string[];
  /** Trigger phrases keyed by language. Lowercased, accent-insensitive match. */
  triggers: Partial<Record<"en" | "fr" | "pa" | "zh", string[]>>;
  /** How the money/credential actually leaves the victim. */
  extraction: string;
  /** Base severity 0..1 — how costly this script is when it lands. */
  severity: number;
  /** Stage definitions for multi-step cons (Long-Con Radar). */
  stages?: { stage: number; name: string; markers: string[] }[];
}

export const SCAM_SCRIPTS: ScamScript[] = [
  {
    id: "cra_arrest",
    label: "CRA / SIN-suspension arrest script",
    impersonates: ["CRA", "Canada Revenue Agency", "Service Canada", "RCMP"],
    triggers: {
      en: [
        "cra", "canada revenue", "social insurance number", "sin has been",
        "arrest warrant", "legal action", "tax fraud", "suspended", "press 1",
        "outstanding balance", "criminal case", "do not hang up",
      ],
      fr: [
        "agence du revenu", "numero d'assurance sociale", "mandat d'arret",
        "fraude fiscale", "poursuite", "suspendu", "appuyez sur le 1",
      ],
      pa: ["cra", "ਗ੍ਰਿਫ਼ਤਾਰੀ", "ਟੈਕਸ", "ਪੁਲਿਸ"],
      zh: ["税务局", "逮捕", "社会保险号", "冻结"],
    },
    extraction: "gift cards, bitcoin, or e-transfer to 'clear' a fake debt",
    severity: 0.95,
  },
  {
    id: "interac_etransfer",
    label: "Interac e-Transfer interception / fake deposit",
    impersonates: ["Interac", "RBC", "TD", "Scotiabank", "BMO", "CIBC", "Tangerine"],
    triggers: {
      en: [
        "interac", "e-transfer", "etransfer", "deposit your", "auto-deposit",
        "click to accept", "your transfer is pending", "verify to receive",
        "security alert", "unusual sign-in", "your account is locked",
      ],
      fr: [
        "virement", "interac", "depot automatique", "cliquez pour accepter",
        "alerte de securite", "votre compte est verrouille",
      ],
      zh: ["转账", "存款", "点击接收", "账户已锁定"],
    },
    extraction: "credential phishing on a lookalike bank/Interac page",
    severity: 0.85,
  },
  {
    id: "canada_post_duty",
    label: "Canada Post / parcel customs-fee smish",
    impersonates: ["Canada Post", "Postes Canada", "UPS", "FedEx", "DHL"],
    triggers: {
      en: [
        "canada post", "your package", "parcel", "customs fee", "duty",
        "redelivery", "shipping fee", "could not be delivered", "schedule delivery",
        "small fee", "update your address",
      ],
      fr: [
        "postes canada", "votre colis", "frais de douane", "frais de livraison",
        "n'a pas pu etre livre", "reprogrammer la livraison",
      ],
      pa: ["ਪਾਰਸਲ", "ਡਿਊਟੀ", "ਡਿਲੀਵਰੀ"],
      zh: ["包裹", "关税", "派送", "运费"],
    },
    extraction: "card details for a tiny 'fee' on a fake courier page",
    severity: 0.7,
  },
  {
    id: "ircc_immigration",
    label: "IRCC / immigration-status threat",
    impersonates: ["IRCC", "Immigration Canada", "Service Canada", "consulate"],
    triggers: {
      en: [
        "ircc", "immigration", "your visa", "study permit", "work permit",
        "deportation", "your status", "pr application", "removal order",
        "embassy", "consulate", "biometrics fee",
      ],
      fr: ["immigration", "votre visa", "permis d'etudes", "expulsion", "ambassade"],
      pa: ["ਇਮੀਗ੍ਰੇਸ਼ਨ", "ਵੀਜ਼ਾ", "ਵਰਕ ਪਰਮਿਟ"],
      zh: ["移民", "签证", "工作许可", "驱逐"],
    },
    extraction: "fees + documents from newcomers afraid of losing status",
    severity: 0.9,
  },
  {
    id: "grandparent_emergency",
    label: "Grandparent / family-emergency scam",
    impersonates: ["grandchild", "family member", "lawyer", "police"],
    triggers: {
      en: [
        "grandma", "grandpa", "it's me", "i'm in trouble", "i had an accident",
        "i was arrested", "need bail", "don't tell mom", "don't tell dad",
        "please send", "keep this between us", "i lost my phone",
      ],
      fr: [
        "mamie", "papi", "c'est moi", "j'ai eu un accident", "caution",
        "ne le dis pas a maman", "ne le dis a personne",
      ],
      zh: ["奶奶", "爷爷", "是我", "出事了", "保释", "别告诉"],
    },
    extraction: "urgent cash/e-transfer/gift cards before the family can verify",
    severity: 0.92,
  },
  {
    id: "pig_butchering",
    label: "Pig-butchering / romance investment (long con)",
    impersonates: ["investor", "mentor", "trading platform", "love interest"],
    triggers: {
      en: [
        "guaranteed returns", "crypto", "trading signals", "my mentor",
        "investment opportunity", "let me teach you", "we can build a future",
        "move to whatsapp", "move to telegram", "withdraw your profit",
        "just pay the tax to withdraw", "exclusive platform", "double your money",
      ],
      fr: [
        "rendements garantis", "crypto", "mentor", "opportunite d'investissement",
        "plateforme exclusive", "doubler votre argent",
      ],
      zh: ["保证收益", "投资", "导师", "提现", "翻倍"],
    },
    extraction: "escalating 'investments' into a fake exchange that never pays out",
    severity: 0.97,
    stages: [
      { stage: 1, name: "Affection / rapport", markers: ["good morning", "thinking of you", "we can build a future", "you are special"] },
      { stage: 2, name: "Move off-platform", markers: ["move to whatsapp", "move to telegram", "add me on", "let's talk privately"] },
      { stage: 3, name: "Introduce the 'opportunity'", markers: ["my mentor", "investment opportunity", "trading signals", "exclusive platform"] },
      { stage: 4, name: "Small successful withdrawal", markers: ["withdraw your profit", "you made a profit", "see, it works"] },
      { stage: 5, name: "The big ask / exit tax", markers: ["just pay the tax to withdraw", "deposit more to unlock", "account frozen", "verification fee"] },
    ],
  },
  {
    id: "bank_security",
    label: "Bank fraud-department impersonation",
    impersonates: ["RBC", "TD", "Scotiabank", "BMO", "CIBC", "fraud department"],
    triggers: {
      en: [
        "fraud department", "suspicious transaction", "verify your account",
        "we detected", "confirm your identity", "read me the code", "one-time passcode",
        "move your money to a safe account", "your card was used",
      ],
      fr: [
        "service des fraudes", "transaction suspecte", "verifiez votre compte",
        "lisez-moi le code", "compte securise",
      ],
      zh: ["欺诈部门", "可疑交易", "验证账户", "验证码", "安全账户"],
    },
    extraction: "the one-time passcode, or a transfer to a 'safe account'",
    severity: 0.93,
  },
  {
    id: "tech_support",
    label: "Tech-support / remote-access scam",
    impersonates: ["Microsoft", "Apple", "Amazon", "your ISP"],
    triggers: {
      en: [
        "virus detected", "your computer is infected", "microsoft support",
        "remote access", "anydesk", "teamviewer", "install this app",
        "your subscription auto-renewed", "refund department", "we overcharged you",
      ],
      fr: [
        "virus detecte", "ordinateur infecte", "support microsoft", "acces a distance",
        "service de remboursement",
      ],
      zh: ["病毒", "电脑中毒", "远程访问", "退款"],
    },
    extraction: "remote control of the device, then drains the bank app",
    severity: 0.88,
  },
  {
    id: "prize_lottery",
    label: "Prize / lottery advance-fee scam",
    impersonates: ["lottery", "sweepstakes", "a brand giveaway"],
    triggers: {
      en: [
        "you won", "congratulations you", "claim your prize", "lottery",
        "you have been selected", "processing fee", "release fee", "gift card to claim",
      ],
      fr: ["vous avez gagne", "felicitations", "reclamez votre prix", "loterie", "frais de traitement"],
      zh: ["中奖", "恭喜", "领取奖品", "手续费"],
    },
    extraction: "an upfront 'fee' to release a prize that does not exist",
    severity: 0.65,
  },
  {
    id: "job_offer",
    label: "Job-offer / task / reshipping scam",
    impersonates: ["recruiter", "HR", "a known company"],
    triggers: {
      en: [
        "work from home", "earn $", "easy money", "no experience needed",
        "reshipping", "package handler", "we will send you a cheque", "deposit the cheque",
        "buy equipment upfront", "task-based earning", "your daily commission",
      ],
      fr: ["travail a domicile", "argent facile", "aucune experience", "deposez le cheque"],
      pa: ["ਘਰ ਤੋਂ ਕੰਮ", "ਨੌਕਰੀ"],
      zh: ["在家工作", "轻松赚钱", "刷单", "佣金"],
    },
    extraction: "fake-cheque overpayment, or upfront 'equipment' fees",
    severity: 0.78,
  },
  {
    id: "gift_card_extraction",
    label: "Gift-card extraction (any pretext)",
    impersonates: ["boss", "agency", "utility", "any authority"],
    triggers: {
      en: [
        "gift card", "google play card", "apple gift card", "steam card",
        "scratch off the back", "send me the code", "itunes card", "vanilla card",
      ],
      fr: ["carte cadeau", "carte google play", "carte apple", "envoyez-moi le code"],
      zh: ["礼品卡", "兑换码", "刮开背面"],
    },
    extraction: "untraceable gift-card codes — a near-certain scam signal",
    severity: 0.9,
  },
  {
    id: "sextortion",
    label: "Sextortion / intimate-image extortion",
    impersonates: ["a hacker", "an online contact"],
    triggers: {
      en: [
        "i have your video", "i recorded you", "i have access to your camera",
        "pay or i send", "i will send to your contacts", "bitcoin within 24",
        "your intimate", "i hacked your",
      ],
      fr: ["j'ai votre video", "payez ou j'envoie", "j'ai pirate votre"],
      zh: ["我有你的视频", "不付钱就发", "我黑了你"],
    },
    extraction: "crypto payment under threat of releasing images (usually a bluff)",
    severity: 0.85,
  },
  {
    id: "utility_disconnect",
    label: "Utility disconnection threat (hydro/gas)",
    impersonates: ["BC Hydro", "Hydro One", "Hydro-Québec", "Enbridge", "ATCO", "Toronto Hydro"],
    triggers: {
      en: ["hydro", "your power will be", "disconnect", "disconnection", "overdue bill", "service will be cut", "reconnection fee", "pay within 30 minutes", "technician is on the way"],
      fr: ["hydro-québec", "votre électricité", "débranché", "coupure", "facture en souffrance", "frais de reconnexion"],
      zh: ["电力公司", "断电", "逾期账单", "立即付款"],
      pa: ["ਬਿਜਲੀ", "ਕੱਟ", "ਬਿੱਲ"],
    },
    extraction: "urgent payment (often prepaid card) to avoid a fake same-day disconnection",
    severity: 0.82,
  },
  {
    id: "toll_unpaid",
    label: "Unpaid toll / 407 ETR smish",
    impersonates: ["407 ETR", "highway toll", "DriveON", "provincial tolls"],
    triggers: {
      en: ["unpaid toll", "outstanding toll", "407", "toll charge", "final notice before", "pay your toll", "license plate has an outstanding", "small toll balance"],
      fr: ["péage", "péage impayé", "solde de péage", "dernier avis"],
      zh: ["过路费", "未付通行费", "罚款"],
    },
    extraction: "card details for a tiny fake toll on a lookalike payment page",
    severity: 0.68,
  },
  {
    id: "rental_deposit",
    label: "Rental deposit (sight-unseen) scam",
    impersonates: ["landlord", "property manager", "rental listing"],
    triggers: {
      en: ["deposit to hold", "first and last", "i'm out of the country", "can't show it in person", "send the deposit before", "e-transfer the deposit", "keys will be couriered", "missionary", "currently abroad"],
      fr: ["dépôt pour réserver", "je suis à l'étranger", "envoyez le dépôt", "premier et dernier mois"],
      pa: ["ਡਿਪਾਜ਼ਿਟ", "ਕਿਰਾਇਆ"],
    },
    extraction: "a deposit by e-transfer for a property the 'landlord' doesn't control",
    severity: 0.8,
  },
  {
    id: "marketplace_overpay",
    label: "Marketplace overpayment / item scam",
    impersonates: ["buyer", "seller", "Facebook Marketplace", "Kijiji", "puppy/ticket seller"],
    triggers: {
      en: ["i'll send a cheque for more", "shipping company", "send back the difference", "zelle", "still available", "pay by e-transfer to hold", "my agent will pick up", "send the puppy", "extra for shipping"],
      fr: ["je paierai plus", "renvoyez la différence", "encore disponible", "transporteur"],
      zh: ["还在卖吗", "多付", "退还差价"],
    },
    extraction: "an overpayment refund, or a deposit for an item that never ships",
    severity: 0.72,
  },
  {
    id: "account_takeover_otp",
    label: "“Is this you?” account-takeover / OTP theft",
    impersonates: ["Amazon", "Apple", "your bank", "Microsoft", "a delivery app"],
    triggers: {
      en: ["did you try to log in", "is this you", "we sent you a code", "confirm it's you", "reply yes to verify", "we'll call to confirm the code", "approve the sign-in", "your one-time code is"],
      fr: ["est-ce vous", "avez-vous essayé de vous connecter", "confirmez que c'est vous", "approuvez la connexion"],
      zh: ["是你吗", "确认是你", "验证码", "批准登录"],
      pa: ["ਕੀ ਇਹ ਤੁਸੀਂ ਹੋ", "ਕੋਡ"],
    },
    extraction: "the login-approval or OTP that hands over your account",
    severity: 0.86,
  },
  {
    id: "charity_disaster",
    label: "Disaster / charity donation fraud",
    impersonates: ["a charity", "disaster relief", "a GoFundMe"],
    triggers: {
      en: ["donate now", "disaster relief", "every dollar helps", "urgent appeal", "send crypto to help", "tax receipt", "victims need your", "donate by gift card"],
      fr: ["faites un don", "secours aux sinistrés", "appel urgent", "reçu fiscal"],
    },
    extraction: "a 'donation' (often crypto or gift card) to a fake relief fund",
    severity: 0.6,
  },
];

/** Universal pressure markers — the grammar of fraud, across every script. */
export const PRESSURE_MARKERS = {
  urgency: {
    en: ["immediately", "right now", "within 24 hours", "act now", "urgent", "last warning", "expires today", "before midnight", "don't delay", "final notice"],
    fr: ["immediatement", "tout de suite", "dans les 24 heures", "urgent", "dernier avertissement", "expire aujourd'hui"],
    pa: ["ਤੁਰੰਤ", "ਅੱਜ ਹੀ"],
    zh: ["立即", "马上", "24小时内", "紧急", "最后警告"],
  },
  threat: {
    en: ["arrest", "lawsuit", "deport", "suspend", "terminate", "legal action", "police", "criminal", "freeze your account", "jail"],
    fr: ["arrestation", "poursuite", "expulsion", "suspendre", "action en justice", "police", "geler votre compte"],
    pa: ["ਗ੍ਰਿਫ਼ਤਾਰੀ", "ਪੁਲਿਸ", "ਜੇਲ੍ਹ"],
    zh: ["逮捕", "诉讼", "驱逐", "冻结", "坐牢", "警察"],
  },
  secrecy: {
    en: ["don't tell", "keep this between us", "confidential", "do not discuss", "this is private", "between you and me"],
    fr: ["ne le dis a personne", "entre nous", "confidentiel", "ne pas en parler"],
    zh: ["别告诉", "保密", "你我之间"],
  },
  authority: {
    en: ["officer", "agent", "government", "official", "department", "investigator", "badge number", "case number"],
    fr: ["agent", "gouvernement", "officiel", "departement", "numero de dossier"],
    pa: ["ਅਫਸਰ", "ਸਰਕਾਰ"],
    zh: ["警官", "政府", "部门", "案件编号"],
  },
} as const;

/** Direct extraction asks — the strongest single content signal. */
export const EXTRACTION_ASKS = {
  en: ["gift card", "bitcoin", "btc", "wire transfer", "e-transfer", "etransfer", "send money", "one-time code", "otp", "verification code", "your password", "your pin", "remote access", "social insurance", "credit card number", "banking login"],
  fr: ["carte cadeau", "bitcoin", "virement", "code a usage unique", "votre mot de passe", "votre nip", "acces a distance", "numero d'assurance sociale"],
  pa: ["ਗਿਫਟ ਕਾਰਡ", "ਪਾਸਵਰਡ", "ਕੋਡ"],
  zh: ["礼品卡", "比特币", "电汇", "验证码", "密码", "远程访问", "社会保险号"],
} as const;
