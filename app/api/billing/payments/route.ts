import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      amount NUMERIC(10,2),
      currency VARCHAR(10),
      plan VARCHAR(50),
      payment_date TIMESTAMP DEFAULT NOW(),
      status VARCHAR(20) DEFAULT 'success'
    )
  `)
}

export async function GET() {
  try {
    await ensureTable()
    const result = await pool.query(
      'SELECT id, user_id, amount, currency, plan, payment_date, status FROM payments ORDER BY user_id, payment_date DESC'
    )
    return NextResponse.json({ payments: result.rows })
  } catch (e) {
    return NextResponse.json({ payments: [], error: String(e) })
  }
}
