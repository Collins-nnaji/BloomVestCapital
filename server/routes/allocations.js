const express = require('express');
const router = express.Router();
const { pool, getOrCreateUser } = require('../db');

/* GET /api/allocations?sessionId=xxx — list saved fund allocations */
router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const { rows } = await pool.query(
      `SELECT id, name, fund_amount, allocations, breakdown, preferences, created_at
       FROM allocation_portfolios
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [user.id]
    );
    res.json({ allocations: rows });
  } catch (err) {
    console.error('GET /allocations error:', err);
    res.status(500).json({ error: 'Failed to load allocations' });
  }
});

/* POST /api/allocations — save a fund allocation */
router.post('/', async (req, res) => {
  try {
    const { sessionId, name, fundAmount, allocations, breakdown, preferences } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    if (!Array.isArray(allocations) || allocations.length === 0) {
      return res.status(400).json({ error: 'allocations array required' });
    }
    const user = await getOrCreateUser(sessionId);
    const { rows } = await pool.query(
      `INSERT INTO allocation_portfolios (user_id, name, fund_amount, allocations, breakdown, preferences)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, fund_amount, allocations, breakdown, preferences, created_at`,
      [
        user.id,
        (name || 'Untitled allocation').slice(0, 255),
        Number(fundAmount) || 100,
        JSON.stringify(allocations),
        JSON.stringify(breakdown || {}),
        JSON.stringify(preferences || {}),
      ]
    );
    res.json({ allocation: rows[0] });
  } catch (err) {
    console.error('POST /allocations error:', err);
    res.status(500).json({ error: 'Failed to save allocation' });
  }
});

/* DELETE /api/allocations/:id */
router.delete('/:id', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    await pool.query(
      'DELETE FROM allocation_portfolios WHERE id = $1 AND user_id = $2',
      [req.params.id, user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /allocations error:', err);
    res.status(500).json({ error: 'Failed to delete allocation' });
  }
});

module.exports = router;
