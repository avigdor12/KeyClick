export const LICENSE_TYPES = {
  System_Free_Run: 'תקופת הרצה',          // חינם ללא תפוגה
  User_Trial:      'תקופת נסיון',          // חינם עם תפוגה
  User_VIP_Free:   'VIP',                  // חינם לצמיתות
  System_Owner:    'מערכת',                // חינם + debug מלא
  User_Monthly:    'חודשי',
  User_Annual:     'שנתי',
  User_One_Time:   'כניסה בודדת',
  System_Suspended_NonPayment: 'מנותק עקב אי תשלום',
  User_Cancelled:              'המשתמש ביטל הרשמה',
} as const

export type LicenseType = typeof LICENSE_TYPES[keyof typeof LICENSE_TYPES]
