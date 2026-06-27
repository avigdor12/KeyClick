import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bank_connections (
      id SERIAL PRIMARY KEY, user_id INTEGER, provider VARCHAR(20),
      institution_id VARCHAR(100), institution_name VARCHAR(255),
      access_token_enc TEXT, refresh_token_enc TEXT, expires_at TIMESTAMP,
      status VARCHAR(20) DEFAULT 'active', created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id SERIAL PRIMARY KEY, connection_id INTEGER, external_id VARCHAR(255) UNIQUE,
      iban VARCHAR(50), name VARCHAR(255), currency VARCHAR(10),
      account_type VARCHAR(50), balance DECIMAL(15,2), last_updated TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS bank_transactions (
      id SERIAL PRIMARY KEY, account_id INTEGER, external_id VARCHAR(255) UNIQUE,
      booking_date DATE, description TEXT, amount DECIMAL(15,2),
      currency VARCHAR(10), category VARCHAR(100), created_at TIMESTAMP DEFAULT NOW()
    );
  `)

  const [connections, accounts, transactions] = await Promise.all([
    pool.query('SELECT id, user_id, provider, institution_name, status, created_at FROM bank_connections ORDER BY id DESC'),
    pool.query('SELECT id, connection_id, iban, name, currency, balance, last_updated FROM bank_accounts ORDER BY id DESC'),
    pool.query('SELECT id, account_id, booking_date, description, amount, currency FROM bank_transactions ORDER BY booking_date DESC LIMIT 100'),
  ])

  return NextResponse.json({
    connections: connections.rows,
    accounts: accounts.rows,
    transactions: transactions.rows,
  })
}
