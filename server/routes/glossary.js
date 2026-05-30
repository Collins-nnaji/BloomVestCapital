const express = require('express');
const { pool, getOrCreateUser } = require('../db');

const router = express.Router();

/* GET /api/glossary/history */
router.get('/history', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const result = await pool.query(
      `SELECT id, terms, ai_response, term_labels, created_at
       FROM glossary_history WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 50`,
      [user.id]
    );
    res.json({ items: result.rows });
  } catch (err) {
    console.error('Glossary history GET error:', err);
    res.status(500).json({ error: 'Failed to fetch glossary history' });
  }
});

/* POST /api/glossary/history */
router.post('/history', async (req, res) => {
  try {
    const { sessionId, terms, aiResponse, termLabels } = req.body;
    if (!sessionId || !terms?.length) return res.status(400).json({ error: 'sessionId and terms required' });
    const user = await getOrCreateUser(sessionId);
    await pool.query(
      `INSERT INTO glossary_history (user_id, terms, ai_response, term_labels)
       VALUES ($1, $2, $3, $4)`,
      [user.id, terms, JSON.stringify(aiResponse || {}), termLabels || terms.join(', ')]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Glossary history POST error:', err);
    res.status(500).json({ error: 'Failed to save glossary history' });
  }
});

/* DELETE /api/glossary/history/:id */
router.delete('/history/:id', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    await pool.query(
      'DELETE FROM glossary_history WHERE id = $1 AND user_id = $2',
      [req.params.id, user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Glossary history DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

/* GET /api/glossary/bookmarks */
router.get('/bookmarks', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const result = await pool.query(
      'SELECT term_id, term_label, category FROM glossary_bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    );
    res.json({ bookmarks: result.rows });
  } catch (err) {
    console.error('Glossary bookmarks GET error:', err);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

/* POST /api/glossary/bookmarks */
router.post('/bookmarks', async (req, res) => {
  try {
    const { sessionId, termId, termLabel, category } = req.body;
    if (!sessionId || !termId) return res.status(400).json({ error: 'sessionId and termId required' });
    const user = await getOrCreateUser(sessionId);
    await pool.query(
      `INSERT INTO glossary_bookmarks (user_id, term_id, term_label, category)
       VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, term_id) DO NOTHING`,
      [user.id, termId, termLabel || termId, category || null]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Glossary bookmark POST error:', err);
    res.status(500).json({ error: 'Failed to save bookmark' });
  }
});

/* DELETE /api/glossary/bookmarks/:termId */
router.delete('/bookmarks/:termId', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    await pool.query(
      'DELETE FROM glossary_bookmarks WHERE term_id = $1 AND user_id = $2',
      [req.params.termId, user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Glossary bookmark DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

/* GET /api/glossary/learned */
router.get('/learned', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const user = await getOrCreateUser(sessionId);
    const result = await pool.query(
      'SELECT term_id FROM glossary_learned WHERE user_id = $1',
      [user.id]
    );
    res.json({ learnedIds: result.rows.map(r => r.term_id) });
  } catch (err) {
    console.error('Glossary learned GET error:', err);
    res.status(500).json({ error: 'Failed to fetch learned' });
  }
});

/* POST /api/glossary/learned */
router.post('/learned', async (req, res) => {
  try {
    const { sessionId, termId } = req.body;
    if (!sessionId || !termId) return res.status(400).json({ error: 'sessionId and termId required' });
    const user = await getOrCreateUser(sessionId);
    await pool.query(
      `INSERT INTO glossary_learned (user_id, term_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user.id, termId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Glossary learned POST error:', err);
    res.status(500).json({ error: 'Failed to save learned' });
  }
});

module.exports = router;
