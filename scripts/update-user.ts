import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function run() {
  const r = await pool.query(
    `UPDATE users SET license_type = 'תקופת הרצה', language = 'עברית' WHERE email = 'avmeir@gmail.com'`
  )
  console.log('Updated:', r.rowCount, 'row')
  await pool.end()
}

run().catch(e => { console.error(e); process.exit(1) })
