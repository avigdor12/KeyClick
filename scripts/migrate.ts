import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function migrate() {
  await pool.query(`
    ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
  `)
  console.log('password_hash — now nullable')

  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS language     VARCHAR(20) DEFAULT 'English';
  `)
  console.log('language — added')

  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;
  `)
  console.log('cancelled_at — added')

  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active    BOOLEAN DEFAULT TRUE;
  `)
  console.log('is_active — added')

  await pool.end()
  console.log('Migration complete')
}

migrate().catch(e => { console.error(e); process.exit(1) })
