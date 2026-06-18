import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         VARCHAR(255) UNIQUE NOT NULL,
      name          VARCHAR(255),
      password_hash VARCHAR(255),
      license_type  VARCHAR(50)  DEFAULT 'תקופת הרצה',
      license_until DATE,
      created_at    TIMESTAMP    DEFAULT NOW(),
      language      VARCHAR(20)  DEFAULT 'English',
      cancelled_at  TIMESTAMP,
      is_active     BOOLEAN      DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id),
      message    TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id),
      action     VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `)
  console.log('Tables created successfully')
  await pool.end()
}

initDB().catch(console.error)
