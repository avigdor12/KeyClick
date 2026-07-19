import { Pool } from 'pg'
import { encrypt, decrypt } from './banking-crypto'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function initBankingTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bank_connections (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      provider VARCHAR(20) NOT NULL,
      institution_id VARCHAR(100),
      institution_name VARCHAR(255),
      access_token_enc TEXT,
      refresh_token_enc TEXT,
      expires_at TIMESTAMP,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id SERIAL PRIMARY KEY,
      connection_id INTEGER REFERENCES bank_connections(id),
      external_id VARCHAR(255) UNIQUE,
      iban VARCHAR(50),
      name VARCHAR(255),
      currency VARCHAR(10),
      account_type VARCHAR(50),
      balance DECIMAL(15,2),
      last_updated TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS bank_transactions (
      id SERIAL PRIMARY KEY,
      account_id INTEGER REFERENCES bank_accounts(id),
      external_id VARCHAR(255) UNIQUE,
      booking_date DATE,
      description TEXT,
      amount DECIMAL(15,2),
      currency VARCHAR(10),
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    );
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

export async function saveConnection(
  userId: number, provider: string,
  institutionId: string, institutionName: string,
  accessToken: string, refreshToken: string, expiresAt: Date
): Promise<number> {
  const res = await pool.query(
    `INSERT INTO bank_connections (user_id, provider, institution_id, institution_name, access_token_enc, refresh_token_enc, expires_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [userId, provider, institutionId, institutionName, encrypt(accessToken), encrypt(refreshToken || ''), expiresAt]
  )
  return res.rows[0].id
}

export async function getConnection(connectionId: number) {
  const res = await pool.query('SELECT * FROM bank_connections WHERE id=$1', [connectionId])
  const c = res.rows[0]
  if (!c) return null
  return {
    ...c,
    access_token: decrypt(c.access_token_enc),
    refresh_token: c.refresh_token_enc ? decrypt(c.refresh_token_enc) : null
  }
}

export async function getUserConnections(userId: number) {
  const res = await pool.query(
    `SELECT id, provider, institution_name, status, created_at
     FROM bank_connections WHERE user_id=$1 AND status='active'`,
    [userId]
  )
  return res.rows
}

export async function updateConnectionStatus(connectionId: number, status: string) {
  await pool.query('UPDATE bank_connections SET status=$1 WHERE id=$2', [status, connectionId])
}

export async function saveAccount(
  connectionId: number, externalId: string, iban: string,
  name: string, currency: string, accountType: string, balance: number
): Promise<number> {
  const res = await pool.query(
    `INSERT INTO bank_accounts (connection_id, external_id, iban, name, currency, account_type, balance)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (external_id) DO UPDATE SET balance=$7, last_updated=NOW()
     RETURNING id`,
    [connectionId, externalId, iban, name, currency, accountType, balance]
  )
  return res.rows[0].id
}

export async function getAccountsByConnection(connectionId: number) {
  const res = await pool.query(
    'SELECT * FROM bank_accounts WHERE connection_id=$1',
    [connectionId]
  )
  return res.rows
}

export async function saveTransaction(
  accountId: number, externalId: string, bookingDate: string,
  description: string, amount: number, currency: string, category: string
) {
  await pool.query(
    `INSERT INTO bank_transactions (account_id, external_id, booking_date, description, amount, currency, category)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (external_id) DO NOTHING`,
    [accountId, externalId, bookingDate, description, amount, currency, category]
  )
}

export async function getTransactionsByAccount(accountId: number) {
  const res = await pool.query(
    'SELECT * FROM bank_transactions WHERE account_id=$1 ORDER BY booking_date DESC',
    [accountId]
  )
  return res.rows
}
