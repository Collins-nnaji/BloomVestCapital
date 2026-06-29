// One-off backfill: populates companies + financial_statements + computed_ratios
// for the Phase 1 MVP ticker list, via Alpha Vantage. Safe to re-run — skips
// statements already fetched (Alpha Vantage's 500 calls/day cap makes re-fetching
// everything on every run too expensive to do unconditionally).
//
// Usage: node server/scripts/seedCompanies.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), override: true });

const { pool, initializeDatabase } = require('../db');
const { fetchAllFundamentals } = require('../services/alphaVantageFundamentals');
const { computeAndStoreRatios } = require('../services/ratioEngine');

const TICKERS = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
  { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Financial' },
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Defensive' },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
  { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Financial' },
  { ticker: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy' },
  { ticker: 'BAC', name: 'Bank of America Corp.', sector: 'Financial' },
  { ticker: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Defensive' },
  { ticker: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Defensive' },
  { ticker: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer Defensive' },
  { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
  { ticker: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
  { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
  { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
  { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
  { ticker: 'INTC', name: 'Intel Corp.', sector: 'Technology' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
  { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
  { ticker: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology' },
  { ticker: 'ORCL', name: 'Oracle Corp.', sector: 'Technology' },
];

async function upsertCompany({ ticker, name, sector }) {
  const result = await pool.query(
    `INSERT INTO companies (ticker, name, region, sector)
     VALUES ($1, $2, 'US', $3)
     ON CONFLICT (ticker) DO UPDATE SET name = EXCLUDED.name, sector = EXCLUDED.sector
     RETURNING id`,
    [ticker, name, sector]
  );
  return result.rows[0].id;
}

async function alreadyFetched(companyId) {
  const result = await pool.query(
    `SELECT COUNT(*) FROM financial_statements WHERE company_id = $1`,
    [companyId]
  );
  return parseInt(result.rows[0].count, 10) > 0;
}

async function storeStatements(companyId, statementType, rows) {
  for (const row of rows) {
    const fiscalPeriod = row.period_type === 'annual'
      ? row.fiscalDateEnding.slice(0, 4)
      : `${row.fiscalDateEnding.slice(0, 4)}Q${Math.ceil(new Date(row.fiscalDateEnding).getMonth() / 3) || 4}`;

    await pool.query(
      `INSERT INTO financial_statements
        (company_id, statement_type, period_type, fiscal_period, fiscal_end_date, data, source)
       VALUES ($1, $2, $3, $4, $5, $6, 'alpha_vantage')
       ON CONFLICT (company_id, statement_type, period_type, fiscal_period) DO UPDATE SET
         data = EXCLUDED.data, fiscal_end_date = EXCLUDED.fiscal_end_date, fetched_at = NOW()`,
      [companyId, statementType, row.period_type, fiscalPeriod, row.fiscalDateEnding, JSON.stringify(row)]
    );
  }
}

async function seedTicker({ ticker, name, sector }) {
  const companyId = await upsertCompany({ ticker, name, sector });

  if (await alreadyFetched(companyId)) {
    console.log(`[seed] ${ticker} already has statements, skipping fetch (re-run ratios only)`);
  } else {
    console.log(`[seed] Fetching fundamentals for ${ticker}...`);
    const { income, balance, cashflow } = await fetchAllFundamentals(ticker);
    await storeStatements(companyId, 'income', income);
    await storeStatements(companyId, 'balance', balance);
    await storeStatements(companyId, 'cashflow', cashflow);
    console.log(`[seed] Stored statements for ${ticker}`);
  }

  await computeAndStoreRatios(companyId);
  console.log(`[seed] Computed ratios for ${ticker}`);
}

async function main() {
  await initializeDatabase();

  for (const entry of TICKERS) {
    try {
      await seedTicker(entry);
    } catch (err) {
      console.error(`[seed] Failed for ${entry.ticker}:`, err.message);
    }
  }

  console.log('[seed] Done.');
  await pool.end();
}

main().catch(err => {
  console.error('[seed] Fatal error:', err);
  process.exit(1);
});
