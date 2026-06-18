import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function run() {
  const r = await pool.query('SELECT * FROM users WHERE email = $1', ['avmeir@gmail.com'])
  console.log(JSON.stringify(r.rows[0], null, 2))
  await pool.end()
}

run().catch(console.error)
