const express = require('express');
const router = express.Router();

const NEON_AUTH_URL = process.env.REACT_APP_NEON_AUTH_URL || process.env.NEON_AUTH_URL || '';

if (!NEON_AUTH_URL) {
  console.warn('NEON_AUTH_URL not set - auth proxy disabled');
}

async function proxyAuth(req, res) {
  if (!NEON_AUTH_URL) {
    return res.status(503).json({ error: 'Auth not configured' });
  }
  const path = req.path === '/' ? '' : req.path || '';
  const base = NEON_AUTH_URL.replace(/\/$/, '');
  const targetPath = path.startsWith('/') ? path : `/${path}`;
  let targetUrl = `${base}${targetPath}`;
  const url = new URL(targetUrl);
  if (req.query && Object.keys(req.query).length) {
    Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers = {};
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
  headers['accept'] = req.headers['accept'] || 'application/json';

  try {
    const fetchOpts = {
      method: req.method,
      headers,
      redirect: 'manual',
    };
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
      fetchOpts.body = JSON.stringify(req.body);
    }

    let response = await fetch(url.toString(), fetchOpts);

    if (response.status === 404 && !targetPath.includes('/api/auth')) {
      const altUrl = `${base}/api/auth${targetPath}`;
      response = await fetch(altUrl, fetchOpts);
    }

    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      return res.redirect(response.status, response.headers.get('location'));
    }

    const text = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';
    res.status(response.status).contentType(contentType).send(text);
  } catch (err) {
    console.error('Auth proxy error:', err);
    res.status(502).json({ error: 'Auth service unavailable' });
  }
}

router.all('*', express.json(), proxyAuth);

module.exports = router;
