# BloomVest Capital

BloomVest is a Create React App frontend with an API layer implemented in Express and also exposed through a Netlify serverless function wrapper.

## How API routing works

- The frontend now supports `REACT_APP_API_URL` for all API calls.
- If `REACT_APP_API_URL` is set, the app calls `${REACT_APP_API_URL}/api/...`.
- If `REACT_APP_API_URL` is not set, the app uses same-origin `/api/...`.
- On Netlify, `netlify.toml` rewrites `/api/*` to `/.netlify/functions/api/api/:splat`.

## Common ways to run it

### Frontend only against a deployed API

Use this if you are not running the local Express server:

```bash
REACT_APP_API_URL=https://your-site-or-api-domain npm start
```

### Frontend + local Express implementation

Use this if you want the local Node/Express API:

```bash
npm run dev
```

This starts:

- React on port `3000`
- Express on port `5000` by default

### Frontend only with same-origin API

If you are serving the built app behind Netlify or another host that already handles `/api` on the same origin:

```bash
npm start
```

## Scripts

- `npm start` runs the React app
- `npm run server` runs `server/index.js`
- `npm run dev` runs frontend and backend together
- `npm run build` builds the production bundle
- `npm test` runs the test suite
