const express = require('express');
const router = express.Router();
const { pool } = require('../db');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = ['book_call', 'discuss_service', 'general', 'fund_management', 'daily_insights'];

/* POST /api/leads — submit a service enquiry / lead */
router.post('/', async (req, res) => {
  const {
    type, name, email, company, message, service, preferred_time,
    investment_range, investment_goals, investment_timeline,
  } = req.body;

  if (!name || !email || !type) {
    return res.status(400).json({ error: 'name, email, and type are required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Invalid lead type' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO leads
         (type, name, email, company, message, service, preferred_time,
          investment_range, investment_goals, investment_timeline)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, created_at`,
      [
        type,
        name.trim(),
        email.trim().toLowerCase(),
        company?.trim()              || null,
        message?.trim()              || null,
        service?.trim()              || null,
        preferred_time?.trim()       || null,
        investment_range?.trim()     || null,
        investment_goals?.trim()     || null,
        investment_timeline?.trim()  || null,
      ]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Lead submission error:', err);
    res.status(500).json({ error: 'Failed to save your request. Please try again.' });
  }
});

/* POST /api/leads/insights — subscribe to daily insights */
router.post('/insights', async (req, res) => {
  const { email, name, frequency = 'daily', topics = [] } = req.body;
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO insights_subscribers (email, name, frequency, topics)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (email) DO UPDATE
         SET name = COALESCE(EXCLUDED.name, insights_subscribers.name),
             frequency = EXCLUDED.frequency,
             topics = EXCLUDED.topics,
             active = TRUE,
             updated_at = NOW()
       RETURNING id, created_at`,
      [email.trim().toLowerCase(), name?.trim() || null, frequency, topics]
    );
    res.json({ success: true, id: rows[0].id });
  } catch (err) {
    console.error('Insights subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

/* GET /api/leads/insights/check?email=xxx — check subscription status */
router.get('/insights/check', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.json({ subscribed: false });
  try {
    const { rows } = await pool.query(
      'SELECT id, frequency, active FROM insights_subscribers WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    res.json({ subscribed: rows.length > 0 && rows[0].active, frequency: rows[0]?.frequency || null });
  } catch {
    res.json({ subscribed: false });
  }
});

module.exports = router;
