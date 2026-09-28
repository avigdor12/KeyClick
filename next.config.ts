import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // שרת הפיתוח בלבד: מאפשר לפתוח את האתר המקומי מהטלפון ברשת הביתית (בלי זה הכפתורים לא עובדים). לא משפיע על האתר החי
  allowedDevOrigins: ['10.100.102.20'],
};

export default nextConfig;
