const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
});

async function initializeDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(schema);
    console.log('Database schema initialized');
  } catch (err) {
    console.error('Database initialization error:', err.message);
    throw err;
  }
}

async function getOrCreateUser(sessionId) {
  const existing = await pool.query('SELECT * FROM users WHERE session_id = $1', [sessionId]);
  if (existing.rows.length > 0) return existing.rows[0];

  const result = await pool.query(
    'INSERT INTO users (session_id) VALUES ($1) RETURNING *',
    [sessionId]
  );
  return result.rows[0];
}

module.exports = { pool, initializeDatabase, getOrCreateUser };
