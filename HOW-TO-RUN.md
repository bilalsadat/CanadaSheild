# Running KinShield (computer + phone)

## On your computer

1. Install **Node.js 20+** from https://nodejs.org (LTS).
2. In a terminal, from the project folder:
   ```bash
   npm install
   npm run dev
   ```
3. Open **http://localhost:3000**.

> Windows PowerShell: use `npm.cmd run dev` if `npm` isn't recognised.
> Stop the server with `Ctrl + C`. Start again anytime with `npm run dev`.

## On your phone (same Wi-Fi — easiest)

When `npm run dev` starts, it prints two URLs, e.g.:

```
- Local:    http://localhost:3000
- Network:  http://10.0.0.125:3000   ← use this on your phone
```

1. Make sure your **phone and computer are on the same Wi-Fi**.
2. On your phone's browser, type the **Network** URL exactly (e.g. `http://10.0.0.125:3000`).
   (Your number will differ — use the one your terminal shows.)
3. KinShield loads. **Install it as an app** — it's a real PWA:
   - **iPhone (Safari):** Share → *Add to Home Screen*.
   - **Android (Chrome):** menu (⋮) → *Install app* / *Add to Home Screen*.
   It then opens full-screen with its own icon, like a native app, and the
   on-device checks even work offline.
4. First launch walks you through a 60-second setup (`/welcome`) and drops you on
   your personalized **Dashboard**.

If the phone can't connect, your computer's firewall may be blocking it:
- **Windows:** allow Node.js through the firewall when prompted (or temporarily
  allow private-network access for Node).
- The app itself needs no special setup — it's just the OS firewall.

## On your phone (anywhere — public link)

To open it on your phone over mobile data (not just your home Wi-Fi), deploy it
free to Vercel:

1. Push this branch to GitHub (already done).
2. Go to https://vercel.com → **Add New → Project** → import the repo →
   pick the branch `claude/product-idea-dev-0mgf8q` → **Deploy**.
3. Vercel auto-detects Next.js. In ~1 minute you get a public URL like
   `https://kinshield.vercel.app` you can open on any device.

No environment variables are required — everything runs out of the box.

## What to try first

- **Home (`/`)** → tap the "CRA arrest call" example in *Ask KinShield*.
- **All 30 features (`/features`)** → every feature is here; green = live engine,
  amber = interactive demo. Tap any card.
- **Live Map (`/map`)** → the Google-Maps-style threat heat map of Canada.
- **Senior Mode (`/senior`)** → big buttons; verdicts are read aloud.
- **Long-Con Radar** → step through a pig-butchering chat and watch it get caught.
- **Calibration (`/transparency`)** → real precision/recall computed live.

## Tests

```bash
npm test        # 14 Trust Engine tests
npm run build   # production build (45 routes)
```
