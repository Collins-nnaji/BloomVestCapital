const express = require('express');
const { pool, getOrCreateUser } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const user = await getOrCreateUser(sessionId);
    const result = await pool.query(
      'SELECT lesson_id, completed, quiz_score, completed_at FROM lesson_progress WHERE user_id = $1 ORDER BY lesson_id',
      [user.id]
    );

    res.json({
      progress: result.rows.map(r => ({
        lessonId: r.lesson_id,
        completed: r.completed,
        quizScore: r.quiz_score,
        completedAt: r.completed_at
      }))
    });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const { sessionId, lessonId, quizScore } = req.body;
    if (!sessionId || lessonId === undefined) {
      return res.status(400).json({ error: 'sessionId and lessonId required' });
    }

    const user = await getOrCreateUser(sessionId);

    await pool.query(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed, quiz_score)
       VALUES ($1, $2, true, $3)
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, quiz_score = $3, completed_at = NOW()`,
      [user.id, lessonId, quizScore || 0]
    );

    const result = await pool.query(
      'SELECT lesson_id FROM lesson_progress WHERE user_id = $1 AND completed = true',
      [user.id]
    );

    res.json({
      success: true,
      completedLessons: result.rows.map(r => r.lesson_id)
    });
  } catch (err) {
    console.error('Complete lesson error:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

module.exports = router;
