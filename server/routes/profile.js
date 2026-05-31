const express = require('express');
const router = express.Router();
const { pool, getOrCreateUser } = require('../db');

/* GET /api/profile?sessionId=xxx */
router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);

    const [profileRes, goalsRes, plansRes, learnedRes, historyRes, bookmarkRes] = await Promise.all([
      pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [user.id]),
      pool.query('SELECT * FROM financial_goals WHERE user_id = $1 ORDER BY sort_order ASC, created_at ASC', [user.id]),
      pool.query('SELECT * FROM financial_plans WHERE user_id = $1 ORDER BY sort_order ASC, created_at ASC', [user.id]),
      pool.query('SELECT COUNT(*) AS count FROM glossary_learned WHERE user_id = $1', [user.id]),
      pool.query('SELECT id, term_labels, terms, created_at FROM glossary_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 8', [user.id]),
      pool.query('SELECT COUNT(*) AS count FROM glossary_bookmarks WHERE user_id = $1', [user.id]),
    ]);

    res.json({
      profile: profileRes.rows[0] || null,
      goals: goalsRes.rows,
      plans: plansRes.rows,
      learnedCount: parseInt(learnedRes.rows[0]?.count || 0, 10),
      recentSessions: historyRes.rows,
      bookmarkCount: parseInt(bookmarkRes.rows[0]?.count || 0, 10),
      memberSince: user.created_at,
    });
  } catch (err) {
    console.error('GET /profile error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

/* POST /api/profile — upsert profile */
router.post('/', async (req, res) => {
  try {
    const { sessionId, ...fields } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);

    const allowed = [
      'display_name', 'tagline', 'bio', 'location',
      'risk_tolerance', 'investor_type', 'investment_style',
      'primary_focus', 'experience_years',
      'net_worth', 'monthly_income', 'monthly_savings', 'avatar_color',
    ];
    const updates = {};
    for (const k of allowed) {
      if (fields[k] !== undefined) updates[k] = fields[k];
    }

    const cols = Object.keys(updates);
    if (cols.length === 0) return res.json({ ok: true });

    const setClauses = cols.map((c, i) => `${c} = $${i + 2}`).join(', ');
    const vals = [user.id, ...Object.values(updates)];

    await pool.query(
      `INSERT INTO user_profiles (user_id, ${cols.join(', ')}, updated_at)
       VALUES ($1, ${cols.map((_, i) => `$${i + 2}`).join(', ')}, NOW())
       ON CONFLICT (user_id) DO UPDATE SET ${setClauses}, updated_at = NOW()`,
      vals
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /profile error:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

/* GET /api/profile/goals */
router.get('/goals', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const { rows } = await pool.query(
      'SELECT * FROM financial_goals WHERE user_id = $1 ORDER BY sort_order ASC, created_at ASC',
      [user.id]
    );
    res.json({ goals: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load goals' });
  }
});

/* POST /api/profile/goals — create goal */
router.post('/goals', async (req, res) => {
  try {
    const { sessionId, title, category, emoji, targetAmount, currentAmount, deadline, color } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const { rows } = await pool.query(
      `INSERT INTO financial_goals (user_id, title, category, emoji, target_amount, current_amount, deadline, color)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [user.id, title, category || 'custom', emoji || '🎯',
       targetAmount, currentAmount || 0, deadline || null, color || '#15803d']
    );
    res.json({ goal: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

/* PATCH /api/profile/goals/:id */
router.patch('/goals/:id', async (req, res) => {
  try {
    const { sessionId, currentAmount, completed, title, targetAmount, deadline } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const fields = {};
    if (currentAmount !== undefined) fields.current_amount = currentAmount;
    if (completed   !== undefined) fields.completed = completed;
    if (title       !== undefined) fields.title = title;
    if (targetAmount!== undefined) fields.target_amount = targetAmount;
    if (deadline    !== undefined) fields.deadline = deadline;
    if (Object.keys(fields).length === 0) return res.json({ ok: true });
    const cols = Object.keys(fields);
    const setClauses = cols.map((c, i) => `${c} = $${i + 3}`).join(', ');
    await pool.query(
      `UPDATE financial_goals SET ${setClauses}, updated_at = NOW() WHERE id = $1 AND user_id = $2`,
      [req.params.id, user.id, ...Object.values(fields)]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

/* DELETE /api/profile/goals/:id */
router.delete('/goals/:id', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    await pool.query('DELETE FROM financial_goals WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

/* GET /api/profile/plans */
router.get('/plans', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const { rows } = await pool.query(
      'SELECT * FROM financial_plans WHERE user_id = $1 ORDER BY sort_order ASC, created_at ASC',
      [user.id]
    );
    res.json({ plans: rows });
  } catch (err) { res.status(500).json({ error: 'Failed to load plans' }); }
});

/* POST /api/profile/plans */
router.post('/plans', async (req, res) => {
  try {
    const { sessionId, title, category, emoji, description, steps } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const { rows } = await pool.query(
      `INSERT INTO financial_plans (user_id, title, category, emoji, description, steps)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user.id, title, category || 'custom', emoji || '📋', description || '', JSON.stringify(steps || [])]
    );
    res.json({ plan: rows[0] });
  } catch (err) { res.status(500).json({ error: 'Failed to create plan' }); }
});

/* PATCH /api/profile/plans/:id */
router.patch('/plans/:id', async (req, res) => {
  try {
    const { sessionId, title, description, steps, status } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const fields = {};
    if (title       !== undefined) fields.title = title;
    if (description !== undefined) fields.description = description;
    if (steps       !== undefined) fields.steps = JSON.stringify(steps);
    if (status      !== undefined) fields.status = status;
    if (!Object.keys(fields).length) return res.json({ ok: true });
    const cols = Object.keys(fields);
    const set  = cols.map((c, i) => `${c} = $${i + 3}`).join(', ');
    await pool.query(
      `UPDATE financial_plans SET ${set}, updated_at = NOW() WHERE id = $1 AND user_id = $2`,
      [req.params.id, user.id, ...Object.values(fields)]
    );
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Failed to update plan' }); }
});

/* DELETE /api/profile/plans/:id */
router.delete('/plans/:id', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    await pool.query('DELETE FROM financial_plans WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Failed to delete plan' }); }
});

module.exports = router;
