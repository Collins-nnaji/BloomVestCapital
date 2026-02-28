# AGENTS.md

## Cursor Cloud specific instructions

### Overview
BloomVest Finance is a React SPA (Create React App) with an Express/Node.js backend. The backend connects to a remote Neon PostgreSQL database and provides REST API endpoints for AI chat, portfolio trading, and lesson progress.

### Running the app
- `npm run dev` — starts both backend (port 5000) and frontend (port 3000) via `concurrently`
- `npm start` — frontend only (port 3000); backend must be started separately with `npm run server`
- The frontend proxies API requests to `http://localhost:5000` via the `proxy` field in `package.json`

### Lint
- ESLint is configured via `react-app` preset but `DISABLE_ESLINT_PLUGIN=true` in `.env` disables it during `npm start` / `npm run build`.
- Standalone `npx eslint src/` will fail because `eslint-config-react-app` is nested inside `react-scripts/node_modules/` and not hoisted.

### Tests
- `CI=true npm test -- --watchAll=false` runs Jest tests non-interactively.
- The default `src/App.test.js` is a CRA boilerplate test that fails because it looks for "learn react" text that does not exist in this app. This is a pre-existing issue, not a setup problem.

### Build
- `npm run build` produces an optimized production build in `build/`.

### Backend notes
- Backend server entry: `server/index.js` (Express on port 5000)
- Requires `DATABASE_URL` and `OPENAI_API_KEY` in `.env` (already present)
- Database schema auto-initializes on server start
- Pages use `src/api.js` client which calls the backend; they fall back to localStorage if the backend is unreachable

### Styled-components convention
- All boolean props passed to styled-components use transient `$` prefix (e.g. `$active`, `$completed`, `$isUser`) to avoid React DOM warnings. Follow this pattern in any new styled-components.

### Git
- Develop on `main`; always commit and push to `main`.
