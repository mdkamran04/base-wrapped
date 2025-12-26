import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Base Wrapped 2025",
  description: "Your Year on Base as a Base Wrapped",

  other: {
    // REQUIRED: Base Mini App ID
    "base:app_id": "694e27684d3a403912ed8072",

    // REQUIRED: Farcaster Mini App embed
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://base-wrapped25.vercel.app/og.png",
      button: {
        title: "Get Your Base Wrapped",
        action: {
          type: "launch_miniapp",
          name: "Base Wrapped",
          url: "https://base-wrapped25.vercel.app",
          splashImageUrl: "https://base-wrapped25.vercel.app/splash.png",
          splashBackgroundColor: "#020617",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
