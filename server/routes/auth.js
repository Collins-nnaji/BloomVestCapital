const express = require('express');
const router = express.Router();

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
  let targetUrl = `${base}${targetPath}`;

  try {
    const url = new URL(targetUrl);
    if (req.query && Object.keys(req.query).length) {
      Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    targetUrl = url.toString();
  } catch (urlErr) {
    console.error('Auth proxy: invalid URL', targetUrl, urlErr.message);
    return res.status(502).json({ error: 'Invalid auth URL', message: urlErr.message });
  }

  const headers = { 'accept': req.headers['accept'] || 'application/json' };
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
  if (req.headers['cookie']) headers['cookie'] = req.headers['cookie'];
  if (req.headers['x-neon-client-info']) headers['x-neon-client-info'] = req.headers['x-neon-client-info'];
  if (req.headers['origin']) headers['origin'] = req.headers['origin'];

  const fetchOpts = { method: req.method, headers, redirect: 'manual' };
  const body = req.body;
  const hasBody = body != null && (
    (typeof body === 'object' && Object.keys(body).length > 0) ||
    (typeof body === 'string' && body.length > 0)
  );
  if (hasBody && req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOpts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    let response = await fetch(targetUrl, fetchOpts);

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
    return res.status(response.status).contentType(contentType).send(text);
  } catch (err) {
    console.error('Auth proxy error:', err.message, targetUrl);
    return res.status(502).json({ error: 'Auth service unavailable', message: err.message });
  }
}

router.get('/health', (req, res) => {
  res.json({ ok: !!NEON_AUTH_URL, configured: !!NEON_AUTH_URL });
});

router.all('/*splat', proxyAuth);

module.exports = router;
