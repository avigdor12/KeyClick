'use client'
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

// פונטים (30.09.2026): כל הפונטים של האתר הם קבצים בפרויקט, ב-public/fonts, ולא next/font:
// בלי הורדה מגוגל בזמן בנייה, ובלי עומס על השרת המקומי (הכנת הפונטים היפניים והסיניים הפילה אותו מחוסר זיכרון).
// fonts_web.css - כל הפונטים חוץ מיפנית וסינית. fonts_cjk.css - יפנית וסינית. הדפדפן מוריד רק את החלקים של האותיות שבדף.
// שמות המשתנים (--font-dancing וכו') מוגדרים ב-globals.css
// הקבצים לטעינה מראש (מתוך fonts_web.css): Dancing Script לטינית, Amatic SC עברית+לטינית, Caveat רוסית+לטינית,
// Assistant עברית+לטינית, Playpen Sans Hebrew עברית
const PRELOAD_FONTS = ['8f5d6e0025a3', '33c609df21f2', 'cc4b5513b1f7', 'c053ad0f4565', 'c70e1c8856ca', 'f022d4de8f08', '42fce9a6a8e9', 'd1b939712b07']

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" className="h-full">
      <head>
        {/* טעינה מראש, כמו שהיה ב-next/font: ארבעת הפונטים הוותיקים (הכתב הלטיני, העברי והרוסי שלהם) ו-Playpen העברי של דף השער,
            כדי שהכיתוב לא יופיע לרגע בפונט אחר ויתחלף */}
        {PRELOAD_FONTS.map(f => <link key={f} rel="preload" href={`/fonts/free/${f}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />)}
        {/* שלב 6 (30.09.2026): השמות Arial ו-Segoe UI טוענים פונטים חופשיים מהפרויקט - הטקסט הרגיל זהה במחשב ובטלפון */}
        <link rel="stylesheet" href="/fonts/fonts_alias.css" />
        <link rel="stylesheet" href="/fonts/fonts_web.css" />
        <link rel="stylesheet" href="/fonts/fonts_cjk.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
