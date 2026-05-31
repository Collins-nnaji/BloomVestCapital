const express = require('express');
const router = express.Router();
const { pool, getOrCreateUser } = require('../db');

/* ── Resolve requester email from sessionId header ── */
async function resolveEmail(req) {
  const sid = req.query.sessionId || (req.body && req.body.sessionId);
  if (!sid) return null;
  if (sid.startsWith('auth:')) return sid.slice(5);
  const { rows } = await pool.query('SELECT email FROM users WHERE session_id = $1', [sid]);
  return rows[0]?.email || null;
}

/* ── Admin check middleware ── */
async function requireAdmin(req, res, next) {
  try {
    const email = await resolveEmail(req);
    if (!email) return res.status(401).json({ error: 'Not authenticated' });
    const { rows } = await pool.query('SELECT 1 FROM admins WHERE email = $1', [email]);
    if (rows.length === 0) return res.status(403).json({ error: 'Admin access required' });
    req.adminEmail = email;
    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    res.status(500).json({ error: 'Auth check failed' });
  }
}

/* GET /api/admin/check — verify if current user is admin */
router.get('/check', async (req, res) => {
  try {
    const email = await resolveEmail(req);
    if (!email) return res.json({ isAdmin: false });
    const { rows } = await pool.query('SELECT 1 FROM admins WHERE email = $1', [email]);
    res.json({ isAdmin: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Check failed' });
  }
});

/* GET /api/admin/users — paginated user list with profiles */
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 25);
    const search = (req.query.search || '').trim();
    const offset = (page - 1) * limit;

    const where = search
      ? `WHERE u.email ILIKE $3 OR p.display_name ILIKE $3 OR p.location ILIKE $3`
      : '';
    const params = search ? [limit, offset, `%${search}%`] : [limit, offset];

    const countQ = search
      ? `SELECT COUNT(*) FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE u.email ILIKE $1 OR p.display_name ILIKE $1 OR p.location ILIKE $1`
      : `SELECT COUNT(*) FROM users`;
    const countParams = search ? [`%${search}%`] : [];

    const [usersRes, countRes] = await Promise.all([
      pool.query(`
        SELECT
          u.id, u.email, u.session_id, u.balance, u.created_at,
          p.display_name, p.tagline, p.location, p.risk_tolerance,
          p.investor_type, p.investment_style, p.primary_focus,
          p.experience_years, p.net_worth, p.monthly_income, p.monthly_savings,
          p.avatar_color,
          (SELECT COUNT(*) FROM financial_goals g WHERE g.user_id = u.id) AS goal_count,
          (SELECT COUNT(*) FROM financial_plans pl WHERE pl.user_id = u.id) AS plan_count,
          (SELECT COUNT(*) FROM glossary_learned gl WHERE gl.user_id = u.id) AS learned_count,
          (SELECT COUNT(*) FROM transactions t WHERE t.user_id = u.id) AS trade_count,
          (SELECT COUNT(*) FROM chat_messages cm WHERE cm.user_id = u.id AND cm.role = 'user') AS chat_count
        FROM users u
        LEFT JOIN user_profiles p ON p.user_id = u.id
        ${where}
        ORDER BY u.created_at DESC
        LIMIT $1 OFFSET $2
      `, params),
      pool.query(countQ, countParams),
    ]);

    res.json({
      users: usersRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit,
    });
  } catch (err) {
    console.error('GET /admin/users error:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

/* GET /api/admin/users/:id — full user details */
router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [userRes, goalsRes, plansRes, tradesRes, sessionsRes, learnedRes] = await Promise.all([
      pool.query(`
        SELECT u.*, p.display_name, p.tagline, p.bio, p.location, p.risk_tolerance,
          p.investor_type, p.investment_style, p.primary_focus, p.experience_years,
          p.net_worth, p.monthly_income, p.monthly_savings, p.avatar_color, p.updated_at AS profile_updated_at
        FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id
        WHERE u.id = $1
      `, [id]),
      pool.query('SELECT * FROM financial_goals WHERE user_id = $1 ORDER BY created_at DESC', [id]),
      pool.query('SELECT id, title, emoji, category, status, steps, created_at FROM financial_plans WHERE user_id = $1 ORDER BY created_at DESC', [id]),
      pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [id]),
      pool.query('SELECT id, term_labels, terms, created_at FROM glossary_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10', [id]),
      pool.query('SELECT COUNT(*) FROM glossary_learned WHERE user_id = $1', [id]),
    ]);

    if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({
      user: userRes.rows[0],
      goals: goalsRes.rows,
      plans: plansRes.rows,
      trades: tradesRes.rows,
      sessions: sessionsRes.rows,
      learnedCount: parseInt(learnedRes.rows[0].count, 10),
    });
  } catch (err) {
    console.error('GET /admin/users/:id error:', err);
    res.status(500).json({ error: 'Failed to load user details' });
  }
});

/* GET /api/admin/stats — platform overview */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [users, goals, trades, sessions] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) AS total,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS new_7d,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) AS new_30d
        FROM users
      `),
      pool.query('SELECT COUNT(*) AS total, COUNT(CASE WHEN completed THEN 1 END) AS completed FROM financial_goals'),
      pool.query('SELECT COUNT(*) AS total, SUM(total) AS volume FROM transactions'),
      pool.query('SELECT COUNT(*) AS total FROM glossary_history'),
    ]);

    res.json({
      users: users.rows[0],
      goals: goals.rows[0],
      trades: trades.rows[0],
      sessions: sessions.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

/* GET /api/admin/admins — list all admins */
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM admins ORDER BY created_at ASC');
    res.json({ admins: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load admins' });
  }
});

/* POST /api/admin/admins — add new admin */
router.post('/admins', requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });
    const { rows } = await pool.query(
      'INSERT INTO admins (email, added_by) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING *',
      [email.toLowerCase().trim(), req.adminEmail]
    );
    res.json({ admin: rows[0] || null, message: rows[0] ? 'Admin added' : 'Already an admin' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add admin' });
  }
});

/* DELETE /api/admin/admins/:email — remove admin (cannot remove self) */
router.delete('/admins/:email', requireAdmin, async (req, res) => {
  try {
    const target = decodeURIComponent(req.params.email).toLowerCase().trim();
    if (target === req.adminEmail) return res.status(400).json({ error: 'Cannot remove yourself' });
    await pool.query('DELETE FROM admins WHERE email = $1', [target]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove admin' });
  }
});

module.exports = router;
