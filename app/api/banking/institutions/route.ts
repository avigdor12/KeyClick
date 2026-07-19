import { NextRequest, NextResponse } from 'next/server'
import { initBankingTables, getFinancialInstitutions, updateInstitutionFlags, bulkSetInstitutionFlag, resetAllInstitutionFlags } from '@/lib/banking-db'

export async function GET() {
  await initBankingTables()
  const institutions = await getFinancialInstitutions()
  return NextResponse.json({ institutions })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { bulk, reset, institution_record_id, system_enable_flag, system_simulation_mode } = body

  if (reset) {
    await resetAllInstitutionFlags()
    return NextResponse.json({ institutions: await getFinancialInstitutions() })
  }

  if (bulk) {
    if (typeof system_enable_flag === 'boolean') await bulkSetInstitutionFlag('system_enable_flag', system_enable_flag)
    if (typeof system_simulation_mode === 'boolean') await bulkSetInstitutionFlag('system_simulation_mode', system_simulation_mode)
    return NextResponse.json({ institutions: await getFinancialInstitutions() })
  }

  if (!institution_record_id) return NextResponse.json({ error: 'missing institution_record_id' }, { status: 400 })
  const institution = await updateInstitutionFlags(institution_record_id, { system_enable_flag, system_simulation_mode })
  return NextResponse.json({ institution })
}
