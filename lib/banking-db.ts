import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// NOTE: personal banking data (connections/accounts/transactions) is intentionally not
// persisted here anymore — see lib/banking-session.ts. This file now only manages the
// static list of available financial institutions (not customer data).
export async function initBankingTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS financial_institutions (
      institution_record_id SERIAL PRIMARY KEY,
      country_name VARCHAR(100) NOT NULL,
      country_code VARCHAR(5),
      institution_name VARCHAR(255) NOT NULL,
      institution_code VARCHAR(100),
      provider_name VARCHAR(50),
      provider_code VARCHAR(50),
      institution_available BOOLEAN DEFAULT false,
      system_enable_flag BOOLEAN DEFAULT true,
      system_simulation_mode BOOLEAN DEFAULT false,
      institution_registration_date TIMESTAMP
    );
  `)
  await seedFinancialInstitutionsIfEmpty()
}

type InstitutionSeed = {
  countryName: string
  countryCode: string
  providerName: string | null
  providerCode: string | null
  banks: string[]
}

const FINANCIAL_INSTITUTION_SEED: InstitutionSeed[] = [
  { countryName: 'United Kingdom', countryCode: 'GB', providerName: 'Nordigen', providerCode: 'nordigen',
    banks: ['Barclays', 'HSBC', 'Lloyds', 'NatWest', 'Santander UK'] },
  { countryName: 'Germany', countryCode: 'DE', providerName: 'Nordigen', providerCode: 'nordigen',
    banks: ['Deutsche Bank', 'Commerzbank', 'DZ Bank', 'KfW'] },
  { countryName: 'France', countryCode: 'FR', providerName: 'Nordigen', providerCode: 'nordigen',
    banks: ['BNP Paribas', 'Société Générale', 'Crédit Agricole', 'La Banque Postale', 'Crédit Mutuel'] },
  { countryName: 'Spain', countryCode: 'ES', providerName: 'Nordigen', providerCode: 'nordigen',
    banks: ['Santander', 'BBVA', 'CaixaBank', 'Bankinter'] },
  { countryName: 'Italy', countryCode: 'IT', providerName: 'Nordigen', providerCode: 'nordigen',
    banks: ['UniCredit', 'Intesa Sanpaolo', 'Banco BPM', 'BPER Banca'] },
  { countryName: 'Russia', countryCode: 'RU', providerName: 'Nordigen', providerCode: 'nordigen',
    banks: ['Sberbank', 'VTB', 'Gazprombank', 'Alfa-Bank'] },
  { countryName: 'United States', countryCode: 'US', providerName: 'Plaid', providerCode: 'plaid',
    banks: ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Goldman Sachs', 'Morgan Stanley'] },
  { countryName: 'Japan', countryCode: 'JP', providerName: null, providerCode: null,
    banks: ['MUFG', 'Mizuho', 'SMBC', 'Japan Post Bank'] },
  { countryName: 'China', countryCode: 'CN', providerName: null, providerCode: null,
    banks: ['ICBC', 'Bank of China', 'CCB', 'ABC', 'Bank of Communications'] },
  { countryName: 'India', countryCode: 'IN', providerName: null, providerCode: null,
    banks: ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak Mahindra'] },
  { countryName: 'Israel', countryCode: 'IL', providerName: null, providerCode: null,
    banks: ['Bank Hapoalim', 'Bank Leumi', 'Discount Bank', 'Mizrahi Bank', 'The International Bank', 'Bank Yahav',
             'Barclays', 'Bank of Jerusalem', 'Isracard', 'Cal', 'Max', 'American Express'] },
  { countryName: 'Saudi Arabia', countryCode: 'SA', providerName: null, providerCode: null,
    banks: ['Al Rajhi Bank', 'SNB', 'Riyad Bank', 'Banque Saudi Fransi'] },
]

async function seedFinancialInstitutionsIfEmpty() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM financial_institutions')
  if (parseInt(rows[0].count, 10) > 0) return
  for (const c of FINANCIAL_INSTITUTION_SEED) {
    for (const bank of c.banks) {
      await pool.query(
        `INSERT INTO financial_institutions
           (country_name, country_code, institution_name, institution_code,
            provider_name, provider_code, institution_available, system_enable_flag, system_simulation_mode)
         VALUES ($1,$2,$3,NULL,$4,$5,false,true,false)`,
        [c.countryName, c.countryCode, bank, c.providerName, c.providerCode]
      )
    }
  }
}

export async function getFinancialInstitutions() {
  const res = await pool.query('SELECT * FROM financial_institutions ORDER BY country_code, institution_name')
  return res.rows
}

export async function updateInstitutionFlags(
  institutionRecordId: number,
  flags: { system_enable_flag?: boolean; system_simulation_mode?: boolean }
) {
  const res = await pool.query(
    `UPDATE financial_institutions SET
       system_enable_flag = COALESCE($2, system_enable_flag),
       system_simulation_mode = COALESCE($3, system_simulation_mode)
     WHERE institution_record_id = $1
     RETURNING *`,
    [institutionRecordId, flags.system_enable_flag ?? null, flags.system_simulation_mode ?? null]
  )
  return res.rows[0]
}

export async function bulkSetInstitutionFlag(
  key: 'system_enable_flag' | 'system_simulation_mode',
  value: boolean
) {
  await pool.query(`UPDATE financial_institutions SET ${key} = $1`, [value])
}

export async function resetAllInstitutionFlags() {
  await pool.query('UPDATE financial_institutions SET system_enable_flag = true, system_simulation_mode = false')
}

