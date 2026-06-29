const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
});

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  balance DECIMAL(15,2) DEFAULT 100000.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_users_session ON users(session_id);
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255),
  tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON user_subscriptions(email);
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  type VARCHAR(30) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  message TEXT,
  service VARCHAR(100),
  preferred_time VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
DO $$ BEGIN
  ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_type_check;
  ALTER TABLE leads ADD CONSTRAINT leads_type_check
    CHECK (type IN ('investor_enquiry', 'seller_enquiry', 'jv_enquiry', 'general'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  tagline VARCHAR(500),
  bio TEXT,
  location VARCHAR(255),
  avatar_color VARCHAR(20) DEFAULT '#15803d',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;

async function initializeDatabase() {
  try {
    await pool.query(SCHEMA);
    console.log('Database schema initialized');
  } catch (err) {
    console.error('Database initialization error:', err.message);
    throw err;
  }
}

async function getOrCreateUser(sessionId) {
  const email = sessionId.startsWith('auth:') ? sessionId.slice(5) : null;
  const existing = await pool.query('SELECT * FROM users WHERE session_id = $1', [sessionId]);
  if (existing.rows.length > 0) {
    if (email && !existing.rows[0].email) {
      await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, existing.rows[0].id]);
    }
    return existing.rows[0];
  }

  const result = await pool.query(
    'INSERT INTO users (session_id, email) VALUES ($1, $2) RETURNING *',
    [sessionId, email]
  );
  return result.rows[0];
}

module.exports = { pool, initializeDatabase, getOrCreateUser };
