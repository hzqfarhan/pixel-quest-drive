import type { Metadata, Viewport } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import "@/styles/pixel.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HOGWARTS DRIVE — Gamified File Explorer",
  description:
    "A pixel-art RPG-style Google Drive dashboard. Explore files like dungeon loot — earn XP, level up, unlock achievements. No login required.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD700",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelFont.variable} h-full`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className="min-h-full flex flex-col font-pixel"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          background: "var(--pixel-bg, #FFFFF0)",
          color: "var(--pixel-black, #1a1a2e)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
