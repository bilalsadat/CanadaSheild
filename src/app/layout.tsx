import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { KinShieldProvider } from "@/lib/store";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "KinShield — Fraud defence for every Canadian family",
  description:
    "KinShield is the orchestration layer for fraud defence in Canada: one Trust Score behind every channel, built for families, multilingual, and honest about what it can and can't do.",
  applicationName: "KinShield",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "KinShield" },
};

export const viewport: Viewport = {
  themeColor: "#0a1430",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KinShieldProvider>
          <SiteNav />
          <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pb-24">{children}</main>
          <SiteFooter />
          <MobileTabBar />
          <PwaRegister />
        </KinShieldProvider>
      </body>
    </html>
  );
}
