import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { api } from '../api';

const Page = styled.div`
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: #f8fafc;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 5rem;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.25rem;
  &:hover { color: #15803d; }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.75rem;
`;

const Ticker = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.03em;
`;

const CompanyName = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin: 0.35rem 0 0;
  font-family: 'Inter', sans-serif;
`;

const SectorPill = styled.span`
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 100px;
  background: rgba(16,185,129,.1);
  color: #15803d;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  align-self: flex-start;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.4rem;
  border-bottom: 1.5px solid #e2e8f0;
  margin-bottom: 1.75rem;
`;

const Tab = styled.button`
  padding: 0.7rem 1.1rem;
  background: none;
  border: none;
  border-bottom: 2.5px solid ${p => p.$active ? '#10b981' : 'transparent'};
  color: ${p => p.$active ? '#0f172a' : '#94a3b8'};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  margin-bottom: -1.5px;
  transition: color 0.15s;
  &:hover { color: #0f172a; }
`;

const Card = styled.div`
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatBox = styled.div`
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

const StatLabel = styled.div`
  font-size: 0.68rem;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3rem;
`;

const StatValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: ${p => p.$negative ? '#dc2626' : '#0f172a'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
`;

const Th = styled.th`
  text-align: ${p => p.$first ? 'left' : 'right'};
  padding: 0.6rem 0.5rem;
  color: #94a3b8;
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1.5px solid #e2e8f0;
  white-space: nowrap;
`;

const Td = styled.td`
  text-align: ${p => p.$first ? 'left' : 'right'};
  padding: 0.6rem 0.5rem;
  color: ${p => p.$first ? '#0f172a' : '#334155'};
  font-weight: ${p => p.$first ? 600 : 400};
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
`;

const EmptyState = styled.p`
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  padding: 2rem 0;
  text-align: center;
`;

const STATEMENT_ROWS = {
  income: [
    ['totalRevenue', 'Total Revenue'],
    ['grossProfit', 'Gross Profit'],
    ['operatingIncome', 'Operating Income'],
    ['ebitda', 'EBITDA'],
    ['netIncome', 'Net Income'],
  ],
  balance: [
    ['totalAssets', 'Total Assets'],
    ['totalLiabilities', 'Total Liabilities'],
    ['totalCurrentAssets', 'Current Assets'],
    ['totalCurrentLiabilities', 'Current Liabilities'],
    ['totalShareholderEquity', 'Shareholder Equity'],
  ],
  cashflow: [
    ['operatingCashflow', 'Operating Cash Flow'],
    ['capitalExpenditures', 'Capital Expenditures'],
    ['cashflowFromInvestment', 'Investing Cash Flow'],
    ['cashflowFromFinancing', 'Financing Cash Flow'],
  ],
};

function fmtMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  return n.toLocaleString();
}

function fmtPct(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return `${(v * 100).toFixed(1)}%`;
}

export default function CompanyPage() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [company, setCompany] = useState(null);
  const [ratios, setRatios] = useState([]);
  const [statements, setStatements] = useState({});
  const [statementType, setStatementType] = useState('income');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.getCompany(ticker)
      .then(res => {
        if (!active) return;
        setCompany(res.company);
        setRatios(res.ratios || []);
      })
      .catch(() => {
        if (active) setError('Company not found in the covered universe yet.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [ticker]);

  useEffect(() => {
    if (activeTab !== 'financials') return;
    let active = true;
    const key = statementType;
    if (statements[key]) return;
    api.getCompanyStatements(ticker, statementType, 'annual')
      .then(res => {
        if (active) setStatements(prev => ({ ...prev, [key]: res.statements || [] }));
      })
      .catch(() => {
        if (active) setStatements(prev => ({ ...prev, [key]: [] }));
      });
    return () => { active = false; };
  }, [activeTab, statementType, ticker, statements]);

  const setTab = (tab) => setSearchParams({ tab });

  const latestRatio = ratios[ratios.length - 1];
  const ratioChartData = ratios.map(r => ({
    period: r.fiscalPeriod,
    grossMargin: r.grossMargin !== null ? +(r.grossMargin * 100).toFixed(1) : null,
    netMargin: r.netMargin !== null ? +(r.netMargin * 100).toFixed(1) : null,
  }));

  if (loading) {
    return <Page><Inner><EmptyState>Loading {ticker}...</EmptyState></Inner></Page>;
  }

  if (error || !company) {
    return (
      <Page>
        <Inner>
          <BackLink onClick={() => navigate('/research')}>&larr; Back to Research</BackLink>
          <EmptyState>{error || 'Company not found.'}</EmptyState>
        </Inner>
      </Page>
    );
  }

  return (
    <Page>
      <Inner>
        <BackLink onClick={() => navigate('/research')}>&larr; Back to Research</BackLink>

        <Header>
          <div>
            <Ticker>{company.ticker}</Ticker>
            <CompanyName>{company.name}</CompanyName>
          </div>
          {company.sector && <SectorPill>{company.sector}</SectorPill>}
        </Header>

        <TabBar>
          <Tab $active={activeTab === 'overview'} onClick={() => setTab('overview')}>Overview</Tab>
          <Tab $active={activeTab === 'financials'} onClick={() => setTab('financials')}>Financials</Tab>
          <Tab $active={activeTab === 'ratios'} onClick={() => setTab('ratios')}>Ratios</Tab>
        </TabBar>

        {activeTab === 'overview' && (
          <Card>
            <CardTitle>Latest Fundamentals ({latestRatio?.fiscalPeriod || '—'})</CardTitle>
            {!latestRatio ? (
              <EmptyState>No ratio data yet for this company.</EmptyState>
            ) : (
              <StatGrid>
                <StatBox>
                  <StatLabel>Gross Margin</StatLabel>
                  <StatValue>{fmtPct(latestRatio.grossMargin)}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Operating Margin</StatLabel>
                  <StatValue>{fmtPct(latestRatio.operatingMargin)}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Net Margin</StatLabel>
                  <StatValue>{fmtPct(latestRatio.netMargin)}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Revenue Growth YoY</StatLabel>
                  <StatValue $negative={latestRatio.revenueGrowthYoy < 0}>{fmtPct(latestRatio.revenueGrowthYoy)}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>ROIC</StatLabel>
                  <StatValue>{fmtPct(latestRatio.roic)}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Debt / EBITDA</StatLabel>
                  <StatValue>{latestRatio.debtToEbitda !== null ? latestRatio.debtToEbitda.toFixed(2) + 'x' : '—'}</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>Current Ratio</StatLabel>
                  <StatValue>{latestRatio.currentRatio !== null ? latestRatio.currentRatio.toFixed(2) : '—'}</StatValue>
                </StatBox>
              </StatGrid>
            )}
          </Card>
        )}

        {activeTab === 'financials' && (
          <Card>
            <TabBar style={{ marginBottom: '1rem', border: 'none' }}>
              <Tab $active={statementType === 'income'} onClick={() => setStatementType('income')}>Income Statement</Tab>
              <Tab $active={statementType === 'balance'} onClick={() => setStatementType('balance')}>Balance Sheet</Tab>
              <Tab $active={statementType === 'cashflow'} onClick={() => setStatementType('cashflow')}>Cash Flow</Tab>
            </TabBar>
            {!statements[statementType] ? (
              <EmptyState>Loading statements...</EmptyState>
            ) : statements[statementType].length === 0 ? (
              <EmptyState>No {statementType} data available for this company.</EmptyState>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <Th $first>Line Item</Th>
                      {statements[statementType].map(s => (
                        <Th key={s.fiscalPeriod}>{s.fiscalPeriod}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {STATEMENT_ROWS[statementType].map(([key, label]) => (
                      <tr key={key}>
                        <Td $first>{label}</Td>
                        {statements[statementType].map(s => (
                          <Td key={s.fiscalPeriod}>{fmtMoney(s.data?.[key])}</Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'ratios' && (
          <Card>
            <CardTitle>Margin Trend</CardTitle>
            {ratioChartData.length === 0 ? (
              <EmptyState>No ratio history yet for this company.</EmptyState>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={ratioChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                  <Tooltip />
                  <Line type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="netMargin" name="Net Margin %" stroke="#0f172a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        )}
      </Inner>
    </Page>
  );
}
