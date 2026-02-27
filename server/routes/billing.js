const express = require('express');
const { pool } = require('../db');

const router = express.Router();

let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.log('Stripe not configured');
}

router.post('/create-checkout', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });

  try {
    const { email, currency } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const priceId = currency === 'NGN'
      ? process.env.STRIPE_PRICE_ID_NGN
      : process.env.STRIPE_PRICE_ID_USD;

    if (!priceId) return res.status(503).json({ error: 'Price not configured for this currency' });

    let customerId;
    const existing = await pool.query(
      'SELECT stripe_customer_id FROM user_subscriptions WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0 && existing.rows[0].stripe_customer_id) {
      customerId = existing.rows[0].stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
      await pool.query(
        `INSERT INTO user_subscriptions (email, stripe_customer_id, tier)
         VALUES ($1, $2, 'free')
         ON CONFLICT (email) DO UPDATE SET stripe_customer_id = $2`,
        [email, customerId]
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:3000'}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.get('/status', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ isPro: false, tier: 'free' });

    const result = await pool.query(
      'SELECT tier, stripe_customer_id FROM user_subscriptions WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ isPro: false, tier: 'free' });
    }

    const { tier, stripe_customer_id } = result.rows[0];

    if (tier === 'pro' && stripe && stripe_customer_id) {
      try {
        const subs = await stripe.subscriptions.list({
          customer: stripe_customer_id,
          status: 'active',
          limit: 1,
        });
        if (subs.data.length === 0) {
          await pool.query('UPDATE user_subscriptions SET tier = $1 WHERE email = $2', ['free', email]);
          return res.json({ isPro: false, tier: 'free' });
        }
      } catch {}
    }

    res.json({ isPro: tier === 'pro', tier });
  } catch (err) {
    console.error('Status error:', err);
    res.json({ isPro: false, tier: 'free' });
  }
});

router.post('/portal', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });

  try {
    const { email } = req.body;
    const result = await pool.query(
      'SELECT stripe_customer_id FROM user_subscriptions WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0 || !result.rows[0].stripe_customer_id) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: result.rows[0].stripe_customer_id,
      return_url: `${req.headers.origin || 'http://localhost:3000'}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Portal error:', err);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(503).send();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.mode === 'subscription' && session.customer_email) {
        await pool.query(
          `INSERT INTO user_subscriptions (email, stripe_customer_id, tier)
           VALUES ($1, $2, 'pro')
           ON CONFLICT (email) DO UPDATE SET tier = 'pro', stripe_customer_id = $2`,
          [session.customer_email, session.customer]
        );
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const customer = await stripe.customers.retrieve(sub.customer);
      if (customer.email) {
        await pool.query(
          'UPDATE user_subscriptions SET tier = $1 WHERE email = $2',
          ['free', customer.email]
        );
      }
      break;
    }
  }

  res.json({ received: true });
});

module.exports = router;
