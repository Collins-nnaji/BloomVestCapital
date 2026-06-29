// Alpha Vantage fundamentals: OVERVIEW, INCOME_STATEMENT, BALANCE_SHEET, CASH_FLOW.
// Free tier: 5 calls/min, 500 calls/day, US-listed tickers only, ~5 years of annual history.

const AV_BASE = 'https://www.alphavantage.co/query';
const CALL_SPACING_MS = 13000; // keeps us under 5 calls/min with margin

let lastCallAt = 0;

async function spaceCalls() {
  const wait = lastCallAt + CALL_SPACING_MS - Date.now();
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCallAt = Date.now();
}

async function fetchAvFunction(fn, symbol) {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) throw new Error('ALPHA_VANTAGE_KEY not configured');

  await spaceCalls();

  const url = `${AV_BASE}?function=${fn}&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const r = await fetch(url, { signal: controller.signal });
    const data = await r.json();
    if (data.Note || data.Information) {
      throw new Error(`Alpha Vantage rate limit/info: ${data.Note || data.Information}`);
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function getOverview(symbol) {
  return fetchAvFunction('OVERVIEW', symbol);
}

function getIncomeStatement(symbol) {
  return fetchAvFunction('INCOME_STATEMENT', symbol);
}

function getBalanceSheet(symbol) {
  return fetchAvFunction('BALANCE_SHEET', symbol);
}

function getCashFlow(symbol) {
  return fetchAvFunction('CASH_FLOW', symbol);
}

/**
 * Pulls all four AV fundamentals endpoints for a ticker (rate-limited, sequential).
 * Returns { overview, income: [...], balance: [...], cashflow: [...] } where each
 * statement array holds both annualReports and quarterlyReports rows, tagged with period_type.
 */
async function fetchAllFundamentals(symbol) {
  const overview = await getOverview(symbol);
  const incomeRaw = await getIncomeStatement(symbol);
  const balanceRaw = await getBalanceSheet(symbol);
  const cashflowRaw = await getCashFlow(symbol);

  const flatten = (raw) => [
    ...(raw.annualReports || []).map(r => ({ ...r, period_type: 'annual' })),
    ...(raw.quarterlyReports || []).map(r => ({ ...r, period_type: 'quarterly' })),
  ];

  return {
    overview,
    income: flatten(incomeRaw),
    balance: flatten(balanceRaw),
    cashflow: flatten(cashflowRaw),
  };
}

module.exports = {
  getOverview,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
  fetchAllFundamentals,
};
