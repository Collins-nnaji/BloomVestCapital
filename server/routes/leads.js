const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.post('/', async (req, res) => {
  const { type, name, email, company, message, service, preferred_time } = req.body;

  if (!name || !email || !type) {
    return res.status(400).json({ error: 'name, email, and type are required' });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const validTypes = ['book_call', 'discuss_service', 'general'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid lead type' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO leads (type, name, email, company, message, service, preferred_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
      [type, name.trim(), email.trim().toLowerCase(), company?.trim() || null,
       message?.trim() || null, service?.trim() || null, preferred_time?.trim() || null]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Lead submission error:', err);
    res.status(500).json({ error: 'Failed to save your request. Please try again.' });
  }
});

module.exports = router;
