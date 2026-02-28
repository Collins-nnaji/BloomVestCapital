const express = require('express');
const router = express.Router();

// Backend must have NEON_AUTH_URL (or REACT_APP_NEON_AUTH_URL) in production
const NEON_AUTH_URL = process.env.NEON_AUTH_URL || process.env.REACT_APP_NEON_AUTH_URL || '';

if (!NEON_AUTH_URL) {
  console.warn('NEON_AUTH_URL not set - auth proxy will return 503');
}

async function proxyAuth(req, res) {
  if (!NEON_AUTH_URL) {
    return res.status(503).json({ error: 'Auth not configured. Set NEON_AUTH_URL on the server.' });
  }
  const path = req.path === '/' ? '' : req.path || '';
  const base = NEON_AUTH_URL.replace(/\/$/, '');
  const targetPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${targetPath}`);
  if (req.query && Object.keys(req.query).length) {
    Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers = { 'accept': req.headers['accept'] || 'application/json' };
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
  if (req.headers['cookie']) headers['cookie'] = req.headers['cookie'];

  const fetchOpts = { method: req.method, headers, redirect: 'manual' };
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
    fetchOpts.body = JSON.stringify(req.body);
  }

  try {
    let response = await fetch(url.toString(), fetchOpts);

    if (response.status === 404 && !targetPath.includes('/api/auth')) {
      const altUrl = `${base}/api/auth${targetPath}`;
      response = await fetch(altUrl, fetchOpts);
    }

    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      return res.redirect(response.status, response.headers.get('location'));
    }

    const text = await response.text();
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);
    const contentType = response.headers.get('content-type') || 'application/json';
    res.status(response.status).contentType(contentType).send(text);
  } catch (err) {
    console.error('Auth proxy error:', err.message, url.toString());
    res.status(502).json({ error: 'Auth service unavailable', message: err.message });
  }
}

router.all('*', express.json(), proxyAuth);

module.exports = router;
