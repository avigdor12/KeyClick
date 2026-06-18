'use client'
import type { Metadata } from "next";
import { Dancing_Script, Amatic_SC, Caveat } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["700"],
});

const amaticSC = Amatic_SC({
  variable: "--font-amatic",
  subsets: ["latin", "hebrew"],
  weight: ["700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "cyrillic"],
  weight: ["700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" className={`${dancingScript.variable} ${amaticSC.variable} ${caveat.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
