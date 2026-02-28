# Production Deployment

## Environment Variables (Exact Names)

Set these on your **backend/server** (where Express runs: Netlify Functions, Railway, Render, etc.):

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `NEON_AUTH_URL` | Yes | `https://ep-xxx.neonauth.c-4.us-east-1.aws.neon.tech/neondb/auth` | Neon Auth URL from Console → Auth → Configuration |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host/db?sslmode=require` | Neon PostgreSQL connection string |
| `OPENAI_API_KEY` | Yes | `sk-proj-...` | For AI chat |
| `PORT` | No | `5000` | Server port (default 5000) |

For Stripe (billing):

| Variable | Required | Example |
|----------|----------|---------|
| `STRIPE_SECRET_KEY` | For billing | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | For billing | `whsec_...` |
| `STRIPE_PRICE_ID_USD` | For billing | `price_...` |
| `STRIPE_PRICE_ID_NGN` | For billing | `price_...` |

## Frontend (React Build)

Set these at **build time** (when you run `npm run build`). If your frontend and backend share env config, set both:

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `REACT_APP_NEON_AUTH_URL` | Optional* | Same as `NEON_AUTH_URL` | Only if frontend needs it at runtime; auth uses proxy so backend `NEON_AUTH_URL` is primary |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | For billing | `pk_live_...` | Shown in checkout UI |

\* Auth requests go through `/api/auth` (your backend). The frontend does not call Neon directly, so `REACT_APP_NEON_AUTH_URL` is not required for auth.

If your API is on a different host (e.g. `api.bloomvestfinance.com`):

| Variable | Example |
|----------|---------|
| `REACT_APP_API_URL` | `https://api.bloomvestfinance.com` |

## Critical: Backend must expose `/api/auth`

Ensure your production backend serves:
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-in/social`
- `GET /api/auth/get-session`
- `POST /api/auth/sign-out`

These are proxied to Neon Auth. If the frontend is at `https://bloomvestfinance.com`, the backend must be reachable at `https://bloomvestfinance.com/api/*` (same origin) or you must configure the proxy in the frontend.

## Neon Trusted Domains (Required for OAuth 403 fix)

The callback URL `https://bloomvestfinance.com/auth/callback` must be from a trusted domain.

In **Neon Console → Project → Auth → Configuration → Trusted Domains** (or Settings → Auth), add:
- `https://bloomvestfinance.com`
- `http://localhost:3000` (for local dev)

Without this, Google sign-in returns 403 "Invalid URL" because Neon rejects the callback.
