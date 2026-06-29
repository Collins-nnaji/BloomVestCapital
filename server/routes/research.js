const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// ─── Company search/list ─────────────────────────────────────────────────────
router.get('/companies', async (req, res) => {
  try {
    const { q } = req.query;
    let result;
    if (q) {
      result = await pool.query(
        `SELECT id, ticker, name, region, sector, industry FROM companies
         WHERE ticker ILIKE $1 OR name ILIKE $1 ORDER BY ticker LIMIT 50`,
        [`%${q}%`]
      );
    } else {
      result = await pool.query(
        `SELECT id, ticker, name, region, sector, industry FROM companies ORDER BY ticker LIMIT 200`
      );
    }
    res.json({ companies: result.rows });
  } catch (err) {
    console.error('List companies error:', err);
    res.status(500).json({ error: 'Failed to list companies' });
  }
});

// ─── Company profile + latest ratios ─────────────────────────────────────────
router.get('/company/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const companyResult = await pool.query('SELECT * FROM companies WHERE ticker = $1', [ticker]);
    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const company = companyResult.rows[0];

    const ratiosResult = await pool.query(
      `SELECT * FROM computed_ratios WHERE company_id = $1 ORDER BY fiscal_period ASC`,
      [company.id]
    );

    res.json({
      company: {
        ticker: company.ticker,
        name: company.name,
        region: company.region,
        exchange: company.exchange,
        sector: company.sector,
        industry: company.industry,
      },
      ratios: ratiosResult.rows.map(r => ({
        fiscalPeriod: r.fiscal_period,
        periodType: r.period_type,
        roic: r.roic !== null ? parseFloat(r.roic) : null,
        fcfYield: r.fcf_yield !== null ? parseFloat(r.fcf_yield) : null,
        debtToEbitda: r.debt_to_ebitda !== null ? parseFloat(r.debt_to_ebitda) : null,
        grossMargin: r.gross_margin !== null ? parseFloat(r.gross_margin) : null,
        operatingMargin: r.operating_margin !== null ? parseFloat(r.operating_margin) : null,
        netMargin: r.net_margin !== null ? parseFloat(r.net_margin) : null,
        currentRatio: r.current_ratio !== null ? parseFloat(r.current_ratio) : null,
        revenueGrowthYoy: r.revenue_growth_yoy !== null ? parseFloat(r.revenue_growth_yoy) : null,
      })),
    });
  } catch (err) {
    console.error('Get company error:', err);
    res.status(500).json({ error: 'Failed to load company' });
  }
});

// ─── Raw statement rows ──────────────────────────────────────────────────────
router.get('/company/:ticker/statements', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const { type = 'income', period = 'annual' } = req.query;
    if (!['income', 'balance', 'cashflow'].includes(type)) {
      return res.status(400).json({ error: 'type must be income, balance, or cashflow' });
    }
    if (!['annual', 'quarterly'].includes(period)) {
      return res.status(400).json({ error: 'period must be annual or quarterly' });
    }

    const companyResult = await pool.query('SELECT id FROM companies WHERE ticker = $1', [ticker]);
    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const statementsResult = await pool.query(
      `SELECT fiscal_period, fiscal_end_date, data, source FROM financial_statements
       WHERE company_id = $1 AND statement_type = $2 AND period_type = $3
       ORDER BY fiscal_period ASC`,
      [companyResult.rows[0].id, type, period]
    );

    res.json({
      ticker,
      statementType: type,
      periodType: period,
      statements: statementsResult.rows.map(r => ({
        fiscalPeriod: r.fiscal_period,
        fiscalEndDate: r.fiscal_end_date,
        data: r.data,
        source: r.source,
      })),
    });
  } catch (err) {
    console.error('Get statements error:', err);
    res.status(500).json({ error: 'Failed to load statements' });
  }
});

module.exports = router;
