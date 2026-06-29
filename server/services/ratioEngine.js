// Pure, deterministic ratio computations over Alpha Vantage statement rows.
// No network calls, no AI — this is the shared foundation for both the
// company-page ratio display and (later) the red-flag detector.

const { pool } = require('../db');

/** AV uses the string "None" for missing values; coerce everything to a number or null. */
function num(v) {
  if (v === undefined || v === null || v === 'None' || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function safeDiv(a, b) {
  if (a === null || b === null || b === 0) return null;
  return a / b;
}

/**
 * Computes ratios for a single fiscal period given that period's income, balance,
 * and cashflow rows plus the prior period's income/balance rows (for YoY deltas).
 * Each row is a raw AV statement object (fiscalDateEnding + line items as strings).
 */
function computeRatiosForPeriod({ income, balance, cashflow, prevIncome, prevBalance }) {
  const revenue = num(income?.totalRevenue);
  const grossProfit = num(income?.grossProfit);
  const operatingIncome = num(income?.operatingIncome);
  const netIncome = num(income?.netIncome);
  const ebit = num(income?.ebit);
  const ebitda = num(income?.ebitda);

  const totalAssets = num(balance?.totalAssets);
  const totalLiabilities = num(balance?.totalLiabilities);
  const currentAssets = num(balance?.totalCurrentAssets);
  const currentLiabilities = num(balance?.totalCurrentLiabilities);
  const totalDebt =
    num(balance?.shortLongTermDebtTotal) ??
    safeAdd(num(balance?.shortTermDebt), num(balance?.longTermDebt));
  const shareholderEquity = num(balance?.totalShareholderEquity);

  const operatingCashflow = num(cashflow?.operatingCashflow);
  const capex = num(cashflow?.capitalExpenditures);
  const freeCashFlow = operatingCashflow !== null && capex !== null ? operatingCashflow - capex : null;

  const investedCapital = shareholderEquity !== null && totalDebt !== null ? shareholderEquity + totalDebt : null;

  const prevRevenue = num(prevIncome?.totalRevenue);

  return {
    grossMargin: safeDiv(grossProfit, revenue),
    operatingMargin: safeDiv(operatingIncome, revenue),
    netMargin: safeDiv(netIncome, revenue),
    currentRatio: safeDiv(currentAssets, currentLiabilities),
    debtToEbitda: safeDiv(totalDebt, ebitda),
    roic: safeDiv(ebit !== null ? ebit * 0.79 : null, investedCapital), // approximate NOPAT at a flat 21% tax rate
    fcfYield: null, // requires market cap; left null until a price/marketcap source is wired in
    revenueGrowthYoy: safeDiv(revenue !== null && prevRevenue !== null ? revenue - prevRevenue : null, prevRevenue),
    _raw: { revenue, grossProfit, operatingIncome, netIncome, ebit, ebitda, totalAssets, totalLiabilities, totalDebt, shareholderEquity, operatingCashflow, capex, freeCashFlow },
  };
}

function safeAdd(a, b) {
  if (a === null && b === null) return null;
  return (a || 0) + (b || 0);
}

/**
 * Computes and upserts computed_ratios rows for every period present in the
 * company's stored financial_statements (annual rows only — quarterly ratios
 * can be added later without changing this function's shape).
 */
async function computeAndStoreRatios(companyId) {
  const { rows: incomeRows } = await pool.query(
    `SELECT fiscal_period, data FROM financial_statements
     WHERE company_id = $1 AND statement_type = 'income' AND period_type = 'annual'
     ORDER BY fiscal_period ASC`,
    [companyId]
  );
  const { rows: balanceRows } = await pool.query(
    `SELECT fiscal_period, data FROM financial_statements
     WHERE company_id = $1 AND statement_type = 'balance' AND period_type = 'annual'
     ORDER BY fiscal_period ASC`,
    [companyId]
  );
  const { rows: cashflowRows } = await pool.query(
    `SELECT fiscal_period, data FROM financial_statements
     WHERE company_id = $1 AND statement_type = 'cashflow' AND period_type = 'annual'
     ORDER BY fiscal_period ASC`,
    [companyId]
  );

  const byPeriod = (rows) => Object.fromEntries(rows.map(r => [r.fiscal_period, r.data]));
  const incomeByPeriod = byPeriod(incomeRows);
  const balanceByPeriod = byPeriod(balanceRows);
  const cashflowByPeriod = byPeriod(cashflowRows);

  const periods = incomeRows.map(r => r.fiscal_period);
  const results = [];

  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    const prevPeriod = i > 0 ? periods[i - 1] : null;

    const ratios = computeRatiosForPeriod({
      income: incomeByPeriod[period],
      balance: balanceByPeriod[period],
      cashflow: cashflowByPeriod[period],
      prevIncome: prevPeriod ? incomeByPeriod[prevPeriod] : null,
      prevBalance: prevPeriod ? balanceByPeriod[prevPeriod] : null,
    });

    await pool.query(
      `INSERT INTO computed_ratios
        (company_id, fiscal_period, period_type, roic, fcf_yield, debt_to_ebitda,
         gross_margin, operating_margin, net_margin, current_ratio, revenue_growth_yoy)
       VALUES ($1,$2,'annual',$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (company_id, fiscal_period, period_type) DO UPDATE SET
         roic = EXCLUDED.roic, fcf_yield = EXCLUDED.fcf_yield, debt_to_ebitda = EXCLUDED.debt_to_ebitda,
         gross_margin = EXCLUDED.gross_margin, operating_margin = EXCLUDED.operating_margin,
         net_margin = EXCLUDED.net_margin, current_ratio = EXCLUDED.current_ratio,
         revenue_growth_yoy = EXCLUDED.revenue_growth_yoy, computed_at = NOW()`,
      [
        companyId, period,
        ratios.roic, ratios.fcfYield, ratios.debtToEbitda,
        ratios.grossMargin, ratios.operatingMargin, ratios.netMargin,
        ratios.currentRatio, ratios.revenueGrowthYoy,
      ]
    );

    results.push({ period, ...ratios });
  }

  return results;
}

module.exports = { computeRatiosForPeriod, computeAndStoreRatios, num, safeDiv };
