# AGENTS.md

## Cursor Cloud specific instructions

### Overview
BloomVest Finance is a client-side-only React SPA (Create React App). There is no backend, database, or external API dependency. The only service to run is the CRA dev server.

### Running the app
- `npm start` — launches dev server on port 3000 (see `README.md` for standard CRA scripts)

### Lint
- ESLint is configured (`.eslintrc.js` extends `react-app`) but `eslint-config-react-app` is nested inside `react-scripts/node_modules/` and not hoisted. Running `npx eslint src/` standalone will fail with a config-not-found error. ESLint runs embedded within the CRA build/dev-server pipeline only.
- The `.env` file sets `DISABLE_ESLINT_PLUGIN=true`, so ESLint is intentionally disabled during `npm start` and `npm run build`.

### Tests
- `CI=true npm test -- --watchAll=false` runs Jest tests non-interactively.
- The default `src/App.test.js` is a CRA boilerplate test that fails because it looks for "learn react" text that does not exist in this app. This is a pre-existing issue, not a setup problem.

### Build
- `npm run build` produces an optimized production build in `build/`.
