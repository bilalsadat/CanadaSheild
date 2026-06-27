import { useCallback } from "react";
import { useKinShield } from "./store";
import type { Language } from "./trust-engine";

/**
 * App-UI localization. Separate from the Trust Engine's verdict localization
 * (which covers 12 languages): the on-screen chrome is fully translated for
 * English and Quebec French; other languages fall back to English UI while
 * verdicts still render in the chosen language.
 */

type Dict = Record<string, string>;

const en: Dict = {
  // tabs
  "tab.dashboard": "Dashboard", "tab.protect": "Protect", "tab.map": "Map", "tab.family": "Family", "tab.features": "Features",
  // common
  "common.back": "Back", "common.cancel": "Cancel", "common.delete": "Delete", "common.done": "Done", "common.openMap": "Open map",
  "common.checkNow": "Check now", "common.improveScore": "Improve score", "common.scanAnother": "Scan another", "common.allow": "Allow",
  // dashboard
  "dash.morning": "Good morning", "dash.afternoon": "Good afternoon", "dash.evening": "Good evening", "dash.welcome": "Welcome",
  "dash.finishSetup": "Finish setting up", "dash.finishSetupSub": "Create your Family Circle — 60 seconds.",
  "dash.householdProtection": "Household protection",
  "posture.strong": "Strongly protected", "posture.well": "Well protected", "posture.setup": "Getting set up", "posture.attention": "Needs attention",
  "posture.hintHarden": "Complete a few hardening steps to raise your score.", "posture.hintFirst": "Run your first check to keep this current.", "posture.hintActive": "Your household is actively protected.",
  "dash.checks": "Checks", "dash.threatsCaught": "Threats caught", "dash.hardening": "Hardening",
  "dash.activity": "Activity", "dash.last7": "Last 7 days", "dash.threatsNear": "Threats near you", "dash.reports": "reports",
  "dash.reportsTracked": "{n} reports tracked across {c} Canadian cities this week.",
  "dash.recentChecks": "Recent checks", "dash.noChecks": "No checks yet.", "dash.noChecksSub": "Open Protect and paste a suspicious message.",
  "dash.quickActions": "Quick actions", "qa.beforeSend": "Before sending", "qa.incident": "Incident Mode", "qa.sms": "SMS Shield", "qa.longcon": "Long-Con Radar",
  // protect
  "protect.kicker": "The front door", "protect.title": "Ask KinShield",
  "protect.sub": "Paste a text, email, ad, or what a caller said. The Trust Engine runs entirely on your device.",
  "protect.placeholder": "Paste anything suspicious…", "protect.check": "Check it", "protect.paste": "Paste & check", "protect.scan": "Scan a QR",
  "protect.tryExample": "Try a real example", "protect.report": "Report to Community Network",
  // settings
  "set.title": "Settings", "set.account": "Account", "set.householdPlan": "{plan} plan · {n} protected",
  "set.langRegion": "Language & region", "set.appLanguage": "App language", "set.appLanguageSub": "Interface and spoken verdicts",
  "set.uiNote": "Interface available in English & French. Verdicts speak in your chosen language.",
  "set.preferences": "Protection preferences", "set.seniorMode": "Senior Mode", "set.seniorModeSub": "Larger text, simpler actions, spoken verdicts",
  "set.speak": "Speak verdicts aloud", "set.speakSub": "Reads the result after each check",
  "set.notifications": "Notifications", "set.notificationsSub": "Alerts on flagged events and family activity",
  "set.screenCallers": "Screen unknown callers", "set.screenCallersSub": "Route to the KinShield Line",
  "set.privacy": "Privacy", "set.personalPlane": "Personal plane", "set.personalPlaneSub": "What's yours. We cannot read it — messages, evidence, your {n} checks, encrypted on this device.",
  "set.networkPlane": "Network plane", "set.networkPlaneSub": "The scammer's. Attacker numbers/domains, only when you report — pseudonymized, aggregate to the CAFC.",
  "set.plan": "Plan", "set.currentPlan": "Current plan",
  "set.data": "Your data", "set.exportData": "Export my data", "set.exportDataSub": "Everything KinShield stores, as JSON",
  "set.deleteAll": "Delete everything", "set.deleteConfirmTitle": "Delete everything?", "set.deleteConfirmBody": "This erases your household, history and settings from this device.",
  "set.about": "About", "set.version": "Version", "set.rate": "Rate KinShield", "set.share": "Tell a friend", "set.help": "Help & support",
  "set.privacyPolicy": "Privacy policy", "set.terms": "Terms of service", "set.footer": "KinShield · built in Canada · data resident in ca-central-1",
};

const fr: Dict = {
  "tab.dashboard": "Accueil", "tab.protect": "Protéger", "tab.map": "Carte", "tab.family": "Famille", "tab.features": "Fonctions",
  "common.back": "Retour", "common.cancel": "Annuler", "common.delete": "Supprimer", "common.done": "Terminé", "common.openMap": "Voir la carte",
  "common.checkNow": "Vérifier", "common.improveScore": "Améliorer le score", "common.scanAnother": "Scanner un autre", "common.allow": "Autoriser",
  "dash.morning": "Bonjour", "dash.afternoon": "Bon après-midi", "dash.evening": "Bonsoir", "dash.welcome": "Bienvenue",
  "dash.finishSetup": "Terminer la configuration", "dash.finishSetupSub": "Créez votre Cercle familial — 60 secondes.",
  "dash.householdProtection": "Protection du foyer",
  "posture.strong": "Bien protégé", "posture.well": "Protégé", "posture.setup": "Configuration en cours", "posture.attention": "À surveiller",
  "posture.hintHarden": "Complétez quelques étapes de sécurité pour augmenter votre score.", "posture.hintFirst": "Faites une première vérification pour rester à jour.", "posture.hintActive": "Votre foyer est activement protégé.",
  "dash.checks": "Vérifs", "dash.threatsCaught": "Menaces bloquées", "dash.hardening": "Sécurité",
  "dash.activity": "Activité", "dash.last7": "7 derniers jours", "dash.threatsNear": "Menaces près de vous", "dash.reports": "signalements",
  "dash.reportsTracked": "{n} signalements suivis dans {c} villes canadiennes cette semaine.",
  "dash.recentChecks": "Vérifications récentes", "dash.noChecks": "Aucune vérification.", "dash.noChecksSub": "Ouvrez Protéger et collez un message suspect.",
  "dash.quickActions": "Actions rapides", "qa.beforeSend": "Avant d'envoyer", "qa.incident": "Mode incident", "qa.sms": "Bouclier SMS", "qa.longcon": "Radar longue arnaque",
  "protect.kicker": "La porte d'entrée", "protect.title": "Demander à KinShield",
  "protect.sub": "Collez un texto, un courriel, une annonce ou ce qu'un appelant a dit. Le moteur Trust fonctionne entièrement sur votre appareil.",
  "protect.placeholder": "Collez tout ce qui est suspect…", "protect.check": "Vérifier", "protect.paste": "Coller et vérifier", "protect.scan": "Scanner un QR",
  "protect.tryExample": "Essayez un exemple réel", "protect.report": "Signaler au réseau communautaire",
  "set.title": "Réglages", "set.account": "Compte", "set.householdPlan": "Forfait {plan} · {n} protégés",
  "set.langRegion": "Langue et région", "set.appLanguage": "Langue de l'application", "set.appLanguageSub": "Interface et verdicts vocaux",
  "set.uiNote": "Interface disponible en anglais et en français. Les verdicts sont énoncés dans la langue choisie.",
  "set.preferences": "Préférences de protection", "set.seniorMode": "Mode aîné", "set.seniorModeSub": "Texte plus grand, actions simplifiées, verdicts à voix haute",
  "set.speak": "Énoncer les verdicts", "set.speakSub": "Lit le résultat après chaque vérification",
  "set.notifications": "Notifications", "set.notificationsSub": "Alertes sur les événements signalés et l'activité familiale",
  "set.screenCallers": "Filtrer les appels inconnus", "set.screenCallersSub": "Acheminer vers la Ligne KinShield",
  "set.privacy": "Confidentialité", "set.personalPlane": "Plan personnel", "set.personalPlaneSub": "Ce qui vous appartient. Nous ne pouvons pas le lire — messages, preuves, vos {n} vérifications, chiffrés sur cet appareil.",
  "set.networkPlane": "Plan réseau", "set.networkPlaneSub": "Celui de l'arnaqueur. Numéros/domaines, seulement quand vous signalez — pseudonymisés, agrégés au CAFC.",
  "set.plan": "Forfait", "set.currentPlan": "Forfait actuel",
  "set.data": "Vos données", "set.exportData": "Exporter mes données", "set.exportDataSub": "Tout ce que KinShield stocke, en JSON",
  "set.deleteAll": "Tout supprimer", "set.deleteConfirmTitle": "Tout supprimer ?", "set.deleteConfirmBody": "Ceci efface votre foyer, l'historique et les réglages de cet appareil.",
  "set.about": "À propos", "set.version": "Version", "set.rate": "Évaluer KinShield", "set.share": "Parlez-en à un proche", "set.help": "Aide et soutien",
  "set.privacyPolicy": "Politique de confidentialité", "set.terms": "Conditions d'utilisation", "set.footer": "KinShield · conçu au Canada · données hébergées dans ca-central-1",
};

const DICTS: Partial<Record<Language, Dict>> = { en, fr };

export function useT() {
  const { settings } = useKinShield();
  const lang = settings.language;
  return useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const dict = DICTS[lang] ?? en;
      let s = dict[key] ?? en[key] ?? key;
      if (params) for (const k in params) s = s.replace(`{${k}}`, String(params[k]));
      return s;
    },
    [lang],
  );
}

export const APP_UI_LANGUAGES: Language[] = ["en", "fr"];
