import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // שרת הפיתוח בלבד: מאפשר לפתוח את האתר המקומי מהטלפון ברשת הביתית (בלי זה הכפתורים לא עובדים). לא משפיע על האתר החי
  allowedDevOrigins: ['10.100.102.20'],
  // [24.11.2026] תגיות התצוגה (og:image וכו') תמיד בראש הדף, לכל פונה. בלי זה Next.js שם אותן בראש הדף רק לסורקים מרשימה
  // מוכרת שלו (facebookexternalhit, WhatsApp), ולשאר (Facebot, meta-externalagent, אפליקציית פייסבוק בטלפון) - בגוף הדף,
  // ושם הן לא נקראות: בפרסום מהטלפון בפייסבוק התמונה לא הופיעה
  htmlLimitedBots: /.*/,
};

export default nextConfig;
