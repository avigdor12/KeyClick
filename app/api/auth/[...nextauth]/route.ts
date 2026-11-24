import { withDbQuota } from '@/lib/kc-security'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
const wrapped = withDbQuota(handler)
export { wrapped as GET, wrapped as POST }

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
