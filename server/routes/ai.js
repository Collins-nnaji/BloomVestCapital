const express = require('express');
const OpenAI = require('openai');
const { pool, getOrCreateUser } = require('../db');

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are BloomVest AI, an expert investment tutor built into an interactive investment education platform. Your role is to teach people how to invest in a clear, engaging, and educational way.

Guidelines:
- Explain concepts simply, using real-world examples and analogies
- Use **bold** for key terms and bullet points for lists — avoid markdown headers (# or ##)
- Keep formatting clean: use bold and bullets, not hash tags or excessive formatting
- When discussing stocks, mention real tickers and approximate valuations
- Always emphasize risk management and long-term thinking
- If asked about specific investment advice, remind users this is for education only
- Keep responses focused and under 300 words unless the topic requires more detail
- Use relevant emojis sparingly to make responses engaging
- Reference the platform's Demo Trading and Learn features when relevant
- Cover topics: stocks, bonds, ETFs, index funds, portfolio building, risk management, behavioral finance, financial statements, dividends, compound interest, market analysis
- Be encouraging and supportive — no question is too basic`;

router.post('/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' });
    }

    const user = await getOrCreateUser(sessionId);

    await pool.query(
      'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)',
      [user.id, 'user', message]
    );

    const historyResult = await pool.query(
      'SELECT role, content FROM chat_messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [user.id]
    );
    const history = historyResult.rows.reverse();

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(m => ({ role: m.role, content: m.content }))
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    await pool.query(
      'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)',
      [user.id, 'assistant', reply]
    );

    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const user = await getOrCreateUser(sessionId);
    const result = await pool.query(
      'SELECT role, content, created_at FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC LIMIT 100',
      [user.id]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error('Chat history error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.delete('/history', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const user = await getOrCreateUser(sessionId);
    await pool.query('DELETE FROM chat_messages WHERE user_id = $1', [user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Clear history error:', err);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

module.exports = router;
