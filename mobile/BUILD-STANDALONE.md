# Build a standalone VraiShield app (EAS)

Expo Go is great for testing, but it can only run the SDK it ships with and
can't include custom native modules. To get a **real, standalone app on your
iPhone** — your own icon, no Expo Go, and the foundation for the native-only
features (call screening, etc.) — use **EAS Build** (Expo's cloud build
service).

## What you need

- A free **Expo account** → <https://expo.dev/signup>
- For installing on a physical iPhone, an **Apple Developer account**
  ($99/yr) — EAS uses it to sign the build and manage TestFlight. (Android has
  no such fee.)

## One-time setup

```bash
cd mobile
npm install -g eas-cli      # the EAS command-line tool
eas login                   # sign in to your Expo account
eas init                    # links this project & writes your projectId
```

`eas init` adds your `projectId` under `expo.extra.eas` in `app.json` — commit
that change.

## Build it

A **preview** build is an internal-distribution app you can install directly:

```bash
eas build --profile preview --platform ios
```

EAS will offer to generate the iOS credentials for you — say yes. The build runs
in the cloud (~10–20 min) and gives you a link/QR. On iOS, internal builds are
delivered via **TestFlight** or registered-device ad-hoc; follow the link EAS
prints.

For Android (no Apple account needed):

```bash
eas build --profile preview --platform android
```

This produces an `.apk` you can download and install straight onto an Android
phone.

## Over-the-air updates (after the first build)

Once a standalone build is installed, you can ship JS/UI changes without
rebuilding:

```bash
eas update --branch preview -m "tweak the dashboard"
```

## Production / App Store

```bash
eas build --profile production --platform ios
eas submit --profile production --platform ios
```

`eas.json` already defines the `development`, `preview`, and `production`
profiles.

---

### Honest scope note

EAS gives you a standalone binary and removes Expo Go's SDK ceiling — that's the
**prerequisite** for the native-only features. Making those features actually
functional (live call screening, SMS interception, on-device voice biometrics)
is additional native work: each needs platform entitlements, a config plugin,
and in some cases carrier/telephony integration. EAS is the runway; those
features are separate builds on top of it. The Trust Engine, scoring, dashboard,
map, languages and persistence already work today in both Expo Go and a
standalone build.
