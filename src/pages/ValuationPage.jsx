import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const Page = styled.div`
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: #faf8f5;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 5rem;
`;

const Eyebrow = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #15803d;
  margin: 0 0 0.5rem;
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  font-weight: 800;
  color: #1c1917;
  margin: 0 0 0.6rem;
  letter-spacing: -0.03em;
`;

const Sub = styled.p`
  color: #57534e;
  font-size: 0.95rem;
  margin: 0 0 2rem;
  max-width: 620px;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
`;

const Layout2Col = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1.5px solid #e7e2db;
  border-radius: 16px;
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.02rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0 0 1.1rem;
`;

const Field = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.76rem;
  font-weight: 700;
  color: #78716c;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.35rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: 9px;
  border: 1.5px solid #e7e2db;
  font-family: 'Inter', sans-serif;
  font-size: 0.92rem;
  color: #1c1917;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: #15803d; }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: 9px;
  border: 1.5px solid #e7e2db;
  font-family: 'Inter', sans-serif;
  font-size: 0.92rem;
  color: #1c1917;
  outline: none;
  background: #fff;
  &:focus { border-color: #15803d; }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.4rem;
  border-bottom: 1.5px solid #e7e2db;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.65rem 1rem;
  background: none;
  border: none;
  border-bottom: 2.5px solid ${p => p.$active ? '#15803d' : 'transparent'};
  color: ${p => p.$active ? '#1c1917' : '#a8a29e'};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  margin-bottom: -1.5px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const StatBox = styled.div`
  padding: 0.95rem 1.05rem;
  border-radius: 12px;
  background: #faf8f5;
  border: 1px solid #e7e2db;
`;

const StatLabel = styled.div`
  font-size: 0.68rem;
  color: #a8a29e;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3rem;
`;

const StatValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${p => p.$negative ? '#b91c1c' : p.$positive ? '#4d7c5f' : '#1c1917'};
`;

const Note = styled.p`
  color: #a8a29e;
  font-size: 0.78rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  margin: 1.5rem 0 0;
`;

const CtaBar = styled.div`
  margin-top: 1.5rem;
  padding: 1.25rem 1.4rem;
  border-radius: 14px;
  background: #1c1917;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CtaText = styled.p`
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  margin: 0;
`;

const CtaLink = styled(Link)`
  padding: 0.6rem 1.2rem;
  border-radius: 9px;
  background: linear-gradient(135deg, #22c55e, #15803d);
  color: #1c1917;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  white-space: nowrap;
`;

const CURRENCY = {
  GBP: { symbol: '£', locale: 'en-GB' },
  NGN: { symbol: '₦', locale: 'en-NG' },
};

function fmt(n, currency) {
  if (!Number.isFinite(n)) return '—';
  const { symbol } = CURRENCY[currency];
  return `${symbol}${Math.round(n).toLocaleString(CURRENCY[currency].locale)}`;
}

function fmtPct(n) {
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(1)}%`;
}

function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

export default function ValuationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('mode') || 'flip';
  const setTab = (mode) => setSearchParams({ mode });

  const [currency, setCurrency] = useState('GBP');

  const [purchasePrice, setPurchasePrice] = useState('150000');
  const [refurbCost, setRefurbCost] = useState('20000');
  const [otherCosts, setOtherCosts] = useState('5000');
  const [gdv, setGdv] = useState('220000');

  const [monthlyRent, setMonthlyRent] = useState('1100');
  const [monthlyCosts, setMonthlyCosts] = useState('250');

  const flip = useMemo(() => {
    const purchase = num(purchasePrice);
    const refurb = num(refurbCost);
    const other = num(otherCosts);
    const sale = num(gdv);
    const totalInvested = purchase + refurb + other;
    const profit = sale - totalInvested;
    const roi = totalInvested > 0 ? (profit / totalInvested) * 100 : null;
    return { purchase, refurb, other, sale, totalInvested, profit, roi };
  }, [purchasePrice, refurbCost, otherCosts, gdv]);

  const btl = useMemo(() => {
    const purchase = num(purchasePrice);
    const refurb = num(refurbCost);
    const totalInvested = purchase + refurb;
    const rent = num(monthlyRent);
    const costs = num(monthlyCosts);
    const annualRent = rent * 12;
    const annualNet = (rent - costs) * 12;
    const grossYield = totalInvested > 0 ? (annualRent / totalInvested) * 100 : null;
    const netYield = totalInvested > 0 ? (annualNet / totalInvested) * 100 : null;
    const monthlyCashflow = rent - costs;
    return { totalInvested, annualRent, annualNet, grossYield, netYield, monthlyCashflow };
  }, [purchasePrice, refurbCost, monthlyRent, monthlyCosts]);

  const chartData = activeTab === 'flip'
    ? [
        { name: 'Purchase', value: flip.purchase },
        { name: 'Refurb + Other', value: flip.refurb + flip.other },
        { name: 'Profit', value: Math.max(flip.profit, 0) },
      ]
    : [
        { name: 'Annual Rent', value: btl.annualRent },
        { name: 'Annual Net', value: Math.max(btl.annualNet, 0) },
      ];

  return (
    <Page>
      <Inner>
        <Eyebrow>Property Tools</Eyebrow>
        <Title>Valuation & Market Analysis</Title>
        <Sub>
          Estimate the return on a flip or buy-to-let, side by side. Enter your numbers to see
          projected profit, ROI, and rental yield based on the figures you provide.
        </Sub>

        <Layout2Col>
          <Card>
            <CardTitle>Property Inputs</CardTitle>

            <Field>
              <Label>Currency</Label>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="GBP">£ GBP (UK)</option>
                <option value="NGN">₦ NGN (Nigeria)</option>
              </Select>
            </Field>

            <Field>
              <Label>Purchase Price</Label>
              <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
            </Field>

            <Field>
              <Label>Refurbishment Cost</Label>
              <Input type="number" value={refurbCost} onChange={(e) => setRefurbCost(e.target.value)} />
            </Field>

            {activeTab === 'flip' ? (
              <>
                <Field>
                  <Label>Other Costs (fees, stamp duty, etc.)</Label>
                  <Input type="number" value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} />
                </Field>
                <Field>
                  <Label>Projected Sale Price (GDV)</Label>
                  <Input type="number" value={gdv} onChange={(e) => setGdv(e.target.value)} />
                </Field>
              </>
            ) : (
              <>
                <Field>
                  <Label>Expected Monthly Rent</Label>
                  <Input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} />
                </Field>
                <Field>
                  <Label>Monthly Running Costs</Label>
                  <Input type="number" value={monthlyCosts} onChange={(e) => setMonthlyCosts(e.target.value)} />
                </Field>
              </>
            )}
          </Card>

          <div>
            <TabBar>
              <Tab $active={activeTab === 'flip'} onClick={() => setTab('flip')}>Flip Analysis</Tab>
              <Tab $active={activeTab === 'btl'} onClick={() => setTab('btl')}>Buy-to-Let Analysis</Tab>
            </TabBar>

            <Card>
              {activeTab === 'flip' ? (
                <>
                  <CardTitle>Projected Flip Returns</CardTitle>
                  <StatGrid>
                    <StatBox>
                      <StatLabel>Total Invested</StatLabel>
                      <StatValue>{fmt(flip.totalInvested, currency)}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Projected Sale (GDV)</StatLabel>
                      <StatValue>{fmt(flip.sale, currency)}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Projected Profit</StatLabel>
                      <StatValue $positive={flip.profit > 0} $negative={flip.profit < 0}>
                        {fmt(flip.profit, currency)}
                      </StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>ROI</StatLabel>
                      <StatValue $positive={flip.roi > 0} $negative={flip.roi < 0}>
                        {fmtPct(flip.roi)}
                      </StatValue>
                    </StatBox>
                  </StatGrid>
                </>
              ) : (
                <>
                  <CardTitle>Projected Buy-to-Let Returns</CardTitle>
                  <StatGrid>
                    <StatBox>
                      <StatLabel>Total Invested</StatLabel>
                      <StatValue>{fmt(btl.totalInvested, currency)}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Monthly Cashflow</StatLabel>
                      <StatValue $positive={btl.monthlyCashflow > 0} $negative={btl.monthlyCashflow < 0}>
                        {fmt(btl.monthlyCashflow, currency)}
                      </StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Gross Yield</StatLabel>
                      <StatValue>{fmtPct(btl.grossYield)}</StatValue>
                    </StatBox>
                    <StatBox>
                      <StatLabel>Net Yield</StatLabel>
                      <StatValue>{fmtPct(btl.netYield)}</StatValue>
                    </StatBox>
                  </StatGrid>
                </>
              )}

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e2db" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} />
                  <Tooltip formatter={(v) => fmt(v, currency)} />
                  <Bar dataKey="value" fill="#15803d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <Note>
                Figures are illustrative estimates based on the numbers you provide, not a formal
                valuation or financial advice. Actual returns depend on market conditions, finance
                costs, and execution.
              </Note>
            </Card>

            <CtaBar>
              <CtaText>Want a real valuation on a specific property?</CtaText>
              <CtaLink to="/enquiry">Talk to our team</CtaLink>
            </CtaBar>
          </div>
        </Layout2Col>
      </Inner>
    </Page>
  );
}
