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
CREATE TABLE IF NOT EXISTS holdings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  shares INTEGER NOT NULL DEFAULT 0,
  avg_price DECIMAL(15,2) NOT NULL,
  UNIQUE(user_id, symbol)
);
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(4) NOT NULL CHECK (type IN ('BUY', 'SELL')),
  symbol VARCHAR(10) NOT NULL,
  shares INTEGER NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level VARCHAR(20) NOT NULL DEFAULT 'beginner',
  icon VARCHAR(10),
  color VARCHAR(20),
  is_pro BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(20),
  icon VARCHAR(10),
  content JSONB NOT NULL DEFAULT '[]',
  key_takeaways JSONB NOT NULL DEFAULT '[]',
  quiz JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_holdings_user ON holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255),
  tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON user_subscriptions(email);
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
