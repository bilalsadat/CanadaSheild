# Run KinShield on your iPhone with Expo Go

This is a **native** app (Expo SDK 54, React Native 0.81) — it runs inside the
**Expo Go** app on your iPhone, not in a web browser.

## One-time setup

1. **On your iPhone:** open the App Store and make sure **Expo Go** is installed
   and **up to date** (the current App Store build runs SDK 54, which this app
   targets). If the project ever says “incompatible SDK”, updating Expo Go fixes
   it.
2. **On your computer:** install **Node.js 20+** from <https://nodejs.org> (LTS).

## Start the app

In a terminal:

```bash
cd mobile
npm install      # first time only (≈1 min)
npx expo start
```

A **QR code** appears in the terminal.

## Open it on your phone

1. Make sure your **iPhone and computer are on the same Wi-Fi**.
2. Open the **Camera** app on your iPhone and point it at the QR code in the
   terminal.
3. Tap the banner — it opens the project inside **Expo Go**. KinShield loads
   natively. 🎉

> Windows PowerShell: if `npx` isn’t found, use `npx.cmd expo start`.
> Press `r` in the terminal to reload, `?` to see all commands.

## If the phone can’t connect (different networks / strict Wi-Fi)

Use a tunnel — it works even across networks:

```bash
npx expo start --tunnel
```

(The first time it may install a small helper; accept it.)

## What you’ll see

A real native iOS app with a bottom tab bar:

- **Dashboard** — your protection posture, 7-day activity, threats near you,
  recent checks, quick actions. The one screen that summarises everything.
- **Protect** — Ask KinShield. The Trust Engine runs **on-device**; paste a
  scam and get a scored verdict with the full reasoning ledger, spoken aloud.
- **Map** — a native **Apple Maps** threat map of Canada with live markers,
  heat circles, category filters, and the weekly briefing.
- **Family** — your Family Circle graph, members and shared policies.
- **Features** — all 30 catalogue features, grouped, each with its own screen
  (green = live engine, amber = interactive demo), plus Incident Mode, Scam
  Drill and Settings.

First launch shows a 60-second onboarding (it’s reachable anytime from the
Dashboard’s “Get protected” card). Everything you do persists on the device.

## Notes

- No Expo account, login, or API keys are required.
- The Trust Engine, scoring, languages, dashboard, persistence and map are
  genuinely functional. Features marked **interactive demo** (live call
  screening, voice lock, honeypot, etc.) are faithful simulations — those need
  telephony and OS-level entitlements that require a full native build (EAS),
  not Expo Go.
