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
  `)
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
