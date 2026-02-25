const express = require('express');
const { pool, getOrCreateUser } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const user = await getOrCreateUser(sessionId);

    const holdings = await pool.query(
      'SELECT symbol, shares, avg_price FROM holdings WHERE user_id = $1 AND shares > 0 ORDER BY symbol',
      [user.id]
    );

    const transactions = await pool.query(
      'SELECT type, symbol, shares, price, total, created_at FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [user.id]
    );

    res.json({
      balance: parseFloat(user.balance),
      holdings: holdings.rows.map(h => ({
        symbol: h.symbol,
        shares: h.shares,
        avgPrice: parseFloat(h.avg_price)
      })),
      transactions: transactions.rows.map(t => ({
        type: t.type,
        symbol: t.symbol,
        shares: t.shares,
        price: parseFloat(t.price),
        total: parseFloat(t.total),
        date: t.created_at
      }))
    });
  } catch (err) {
    console.error('Get portfolio error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

router.post('/trade', async (req, res) => {
  const client = await pool.connect();
  try {
    const { sessionId, type, symbol, shares, price } = req.body;
    if (!sessionId || !type || !symbol || !shares || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await client.query('BEGIN');

    const userResult = await client.query(
      'SELECT * FROM users WHERE session_id = $1 FOR UPDATE',
      [sessionId]
    );
    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];
    const total = shares * price;

    if (type === 'BUY') {
      if (parseFloat(user.balance) < total) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      await client.query(
        'UPDATE users SET balance = balance - $1 WHERE id = $2',
        [total, user.id]
      );

      const existing = await client.query(
        'SELECT * FROM holdings WHERE user_id = $1 AND symbol = $2',
        [user.id, symbol]
      );

      if (existing.rows.length > 0) {
        const old = existing.rows[0];
        const totalShares = old.shares + shares;
        const newAvg = (parseFloat(old.avg_price) * old.shares + total) / totalShares;
        await client.query(
          'UPDATE holdings SET shares = $1, avg_price = $2 WHERE user_id = $3 AND symbol = $4',
          [totalShares, newAvg, user.id, symbol]
        );
      } else {
        await client.query(
          'INSERT INTO holdings (user_id, symbol, shares, avg_price) VALUES ($1, $2, $3, $4)',
          [user.id, symbol, shares, price]
        );
      }
    } else if (type === 'SELL') {
      const existing = await client.query(
        'SELECT * FROM holdings WHERE user_id = $1 AND symbol = $2',
        [user.id, symbol]
      );

      if (existing.rows.length === 0 || existing.rows[0].shares < shares) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Insufficient shares' });
      }

      await client.query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [total, user.id]
      );

      const remaining = existing.rows[0].shares - shares;
      if (remaining === 0) {
        await client.query(
          'DELETE FROM holdings WHERE user_id = $1 AND symbol = $2',
          [user.id, symbol]
        );
      } else {
        await client.query(
          'UPDATE holdings SET shares = $1 WHERE user_id = $2 AND symbol = $3',
          [remaining, user.id, symbol]
        );
      }
    }

    await client.query(
      'INSERT INTO transactions (user_id, type, symbol, shares, price, total) VALUES ($1, $2, $3, $4, $5, $6)',
      [user.id, type, symbol, shares, price, total]
    );

    await client.query('COMMIT');

    const updatedUser = await pool.query('SELECT balance FROM users WHERE id = $1', [user.id]);
    const holdings = await pool.query(
      'SELECT symbol, shares, avg_price FROM holdings WHERE user_id = $1 AND shares > 0',
      [user.id]
    );

    res.json({
      success: true,
      balance: parseFloat(updatedUser.rows[0].balance),
      holdings: holdings.rows.map(h => ({
        symbol: h.symbol,
        shares: h.shares,
        avgPrice: parseFloat(h.avg_price)
      }))
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Trade error:', err);
    res.status(500).json({ error: 'Trade failed' });
  } finally {
    client.release();
  }
});

router.post('/reset', async (req, res) => {
  const client = await pool.connect();
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const user = await getOrCreateUser(sessionId);

    await client.query('BEGIN');
    await client.query('DELETE FROM holdings WHERE user_id = $1', [user.id]);
    await client.query('DELETE FROM transactions WHERE user_id = $1', [user.id]);
    await client.query('UPDATE users SET balance = 100000.00 WHERE id = $1', [user.id]);
    await client.query('COMMIT');

    res.json({ success: true, balance: 100000 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Reset failed' });
  } finally {
    client.release();
  }
});

module.exports = router;
