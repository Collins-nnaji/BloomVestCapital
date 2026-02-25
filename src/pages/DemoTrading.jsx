import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaArrowUp, FaArrowDown, FaWallet, FaChartLine, FaShoppingCart, FaHistory, FaInfoCircle, FaSearch, FaCheckCircle, FaSync } from 'react-icons/fa';
import { stocks, marketIndices } from '../data/stockData';
import { scenarios, difficultyColors } from '../data/scenarios';
import { api } from '../api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0f1c 0%, #111827 100%);
`;

const HeaderSection = styled.section`
  padding: 2.5rem 1.5rem 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
`;

const HeaderContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  span { color: #22c55e; }
`;

const IndicesRow = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
`;

const IndexChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
`;

const IndexName = styled.span`color: rgba(255,255,255,0.4);font-weight:500;`;
const IndexVal = styled.span`color: white;font-weight:700;`;
const IndexChg = styled.span`color: ${p => p.$pos ? '#4ade80' : '#f87171'};font-weight:600;`;

const PortfolioBar = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
`;

const PortfolioCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex-wrap: wrap;
`;

const PortfolioStat = styled.div`min-width: 110px;`;
const StatLabel = styled.div`font-size:0.65rem;color:rgba(255,255,255,0.35);text-transform:uppercase;font-weight:700;letter-spacing:0.8px;margin-bottom:0.15rem;`;
const StatValue = styled.div`font-size:1.25rem;font-weight:800;color:${p => p.$color || 'white'};`;

const ResetBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 8px;
  color: #f87171;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { background: rgba(239,68,68,0.2); }
`;

const MainContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.25rem;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  svg { color: #22c55e; }
`;

const CardBody = styled.div`padding: 1.25rem;`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  font-size: 0.85rem;
  color: white;
  width: 100%;
  &::placeholder { color: rgba(255,255,255,0.25); }
`;

const StockList = styled.div`max-height: 400px;overflow-y: auto;`;

const StockRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 6px;
  &:hover { background: rgba(34,197,94,0.05); padding: 0.6rem 0.5rem; }
  ${p => p.$active && `background: rgba(34,197,94,0.08); padding: 0.6rem 0.5rem; border-left: 2px solid #22c55e;`}
`;

const StockSymbol = styled.div`font-weight:700;color:white;font-size:0.9rem;`;
const StockName = styled.div`color:rgba(255,255,255,0.35);font-size:0.75rem;`;
const PriceValue = styled.div`font-weight:700;color:white;font-size:0.9rem;`;
const PriceChange = styled.div`
  font-size:0.75rem;font-weight:600;
  color:${p => p.$pos ? '#4ade80' : '#f87171'};
  display:flex;align-items:center;gap:0.15rem;justify-content:flex-end;
`;

const ChartContainer = styled.div`height:220px;margin:0 -0.5rem;`;

const BigPrice = styled.div`font-size:1.6rem;font-weight:800;color:white;`;
const BigChange = styled.div`font-size:0.85rem;font-weight:600;color:${p => p.$pos ? '#4ade80' : '#f87171'};`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin: 1rem 0;
  @media (max-width: 500px) { grid-template-columns: repeat(2, 1fr); }
`;

const MetricBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 0.6rem;
  text-align: center;
`;

const MetricLabel = styled.div`font-size:0.6rem;color:rgba(255,255,255,0.3);text-transform:uppercase;font-weight:600;letter-spacing:0.5px;`;
const MetricValue = styled.div`font-size:0.95rem;font-weight:700;color:white;`;

const TradeForm = styled.div`
  background: rgba(34,197,94,0.04);
  border: 1px solid rgba(34,197,94,0.1);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 0.75rem;
`;

const TradeRow = styled.div`display:flex;gap:0.5rem;margin-bottom:0.5rem;`;

const TradeInput = styled.input`
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(255,255,255,0.04);
  color: white;
  outline: none;
  &:focus { border-color: #22c55e; }
`;

const TradeButton = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  &.buy { background: #22c55e; color: white; &:hover { background: #16a34a; } }
  &.sell { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.2); &:hover { background: rgba(239,68,68,0.25); } }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const TradeCost = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  span { font-weight: 700; color: white; }
`;

const HoldingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  cursor: pointer;
  &:last-child { border-bottom: none; }
`;

const HoldingSymbol = styled.div`font-weight:700;color:white;font-size:0.85rem;`;
const HoldingShares = styled.div`color:rgba(255,255,255,0.3);font-size:0.75rem;`;
const HoldingTotal = styled.div`font-weight:700;color:white;font-size:0.85rem;`;
const HoldingPnl = styled.div`font-size:0.75rem;font-weight:600;color:${p => p.$pos ? '#4ade80' : '#f87171'};`;

const TransactionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  font-size: 0.8rem;
  &:last-child { border-bottom: none; }
`;

const TxBadge = styled.span`
  font-weight:700;font-size:0.7rem;padding:0.1rem 0.4rem;border-radius:4px;
  color:${p => p.$type === 'BUY' ? '#4ade80' : '#f87171'};
  background:${p => p.$type === 'BUY' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
`;

const EmptyState = styled.div`text-align:center;padding:1.5rem;color:rgba(255,255,255,0.25);font-size:0.85rem;`;

const Notification = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  border: 1px solid ${p => p.$type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'};
  color: white;
  padding: 0.7rem 1.25rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const INITIAL_BALANCE = 100000;

const DemoTrading = () => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const [useLocal, setUseLocal] = useState(false);

  const loadPortfolio = useCallback(async () => {
    try {
      const data = await api.getPortfolio();
      setBalance(data.balance);
      setHoldings(data.holdings);
      setTransactions(data.transactions);
    } catch (e) {
      setUseLocal(true);
      const sb = localStorage.getItem('bloomvest_balance');
      const sh = localStorage.getItem('bloomvest_holdings');
      const st = localStorage.getItem('bloomvest_transactions');
      if (sb) setBalance(parseFloat(sb));
      if (sh) setHoldings(JSON.parse(sh));
      if (st) setTransactions(JSON.parse(st));
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadPortfolio(); }, [loadPortfolio]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveLocal = (b, h, t) => {
    localStorage.setItem('bloomvest_balance', b.toString());
    localStorage.setItem('bloomvest_holdings', JSON.stringify(h));
    localStorage.setItem('bloomvest_transactions', JSON.stringify(t));
  };

  const executeTrade = async (type) => {
    const qty = parseInt(tradeQuantity);
    if (!qty || qty <= 0) return;
    const totalCost = qty * selectedStock.price;

    if (!useLocal) {
      try {
        const data = await api.trade(type, selectedStock.symbol, qty, selectedStock.price);
        setBalance(data.balance);
        setHoldings(data.holdings);
        showNotification(`${type === 'BUY' ? 'Bought' : 'Sold'} ${qty} shares of ${selectedStock.symbol} for $${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
        loadPortfolio();
        setTradeQuantity('');
        return;
      } catch (err) {
        setUseLocal(true);
      }
    }

    if (type === 'BUY') {
      if (balance < totalCost) { showNotification('Insufficient funds', 'error'); return; }
      const nb = balance - totalCost;
      const ei = holdings.findIndex(h => h.symbol === selectedStock.symbol);
      let nh = [...holdings];
      if (ei >= 0) { const o = nh[ei]; const ts = o.shares + qty; nh[ei] = { ...o, shares: ts, avgPrice: (o.avgPrice * o.shares + totalCost) / ts }; }
      else nh.push({ symbol: selectedStock.symbol, shares: qty, avgPrice: selectedStock.price });
      const nt = [{ type: 'BUY', symbol: selectedStock.symbol, shares: qty, price: selectedStock.price, total: totalCost, date: new Date().toISOString() }, ...transactions].slice(0, 50);
      setBalance(nb); setHoldings(nh); setTransactions(nt); saveLocal(nb, nh, nt);
      showNotification(`Bought ${qty} shares of ${selectedStock.symbol} for $${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    } else {
      const ei = holdings.findIndex(h => h.symbol === selectedStock.symbol);
      if (ei < 0 || holdings[ei].shares < qty) { showNotification('Not enough shares', 'error'); return; }
      const nb = balance + totalCost;
      let nh = [...holdings];
      if (nh[ei].shares === qty) nh.splice(ei, 1);
      else nh[ei] = { ...nh[ei], shares: nh[ei].shares - qty };
      const nt = [{ type: 'SELL', symbol: selectedStock.symbol, shares: qty, price: selectedStock.price, total: totalCost, date: new Date().toISOString() }, ...transactions].slice(0, 50);
      setBalance(nb); setHoldings(nh); setTransactions(nt); saveLocal(nb, nh, nt);
      showNotification(`Sold ${qty} shares of ${selectedStock.symbol} for $${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    }
    setTradeQuantity('');
  };

  const resetPortfolio = async () => {
    try {
      if (!useLocal) await api.resetPortfolio();
    } catch (e) { /* fallback below */ }
    setBalance(INITIAL_BALANCE);
    setHoldings([]);
    setTransactions([]);
    localStorage.removeItem('bloomvest_balance');
    localStorage.removeItem('bloomvest_holdings');
    localStorage.removeItem('bloomvest_transactions');
    showNotification('Portfolio reset to $100,000');
  };

  const portfolioValue = holdings.reduce((total, h) => {
    const stock = stocks.find(s => s.symbol === h.symbol);
    return total + (stock ? stock.price * h.shares : 0);
  }, 0);

  const totalValue = balance + portfolioValue;
  const totalPnl = totalValue - INITIAL_BALANCE;
  const totalPnlPercent = ((totalPnl / INITIAL_BALANCE) * 100).toFixed(2);

  const filteredStocks = stocks.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentHolding = holdings.find(h => h.symbol === selectedStock.symbol);
  const tradeCost = parseInt(tradeQuantity) > 0 ? parseInt(tradeQuantity) * selectedStock.price : 0;

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>Demo <span>Trading</span></HeaderTitle>
          <IndicesRow>
            {marketIndices.map(idx => (
              <IndexChip key={idx.name}>
                <IndexName>{idx.name}</IndexName>
                <IndexVal>{idx.value.toLocaleString()}</IndexVal>
                <IndexChg $pos={idx.changePercent >= 0}>{idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%</IndexChg>
              </IndexChip>
            ))}
          </IndicesRow>
        </HeaderContent>
      </HeaderSection>

      <PortfolioBar>
        <PortfolioCard>
          <PortfolioStat>
            <StatLabel>Total Value</StatLabel>
            <StatValue>${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>Cash Available</StatLabel>
            <StatValue>${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>Invested</StatLabel>
            <StatValue>${portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>P&L</StatLabel>
            <StatValue $color={totalPnl >= 0 ? '#4ade80' : '#f87171'}>
              {totalPnl >= 0 ? '+' : ''}{totalPnlPercent}%
            </StatValue>
          </PortfolioStat>
          <ResetBtn onClick={resetPortfolio}><FaSync /> Reset</ResetBtn>
        </PortfolioCard>
      </PortfolioBar>

      <MainContent>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <Card>
            <CardHeader><CardTitle><FaChartLine /> {selectedStock.symbol} — {selectedStock.name}</CardTitle></CardHeader>
            <CardBody>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                <div>
                  <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.35)'}}>{selectedStock.sector}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <BigPrice>${selectedStock.price.toFixed(2)}</BigPrice>
                  <BigChange $pos={selectedStock.change >= 0}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%)
                  </BigChange>
                </div>
              </div>

              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedStock.historicalPrices}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{fontSize: 10, fill: 'rgba(255,255,255,0.25)'}} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{fontSize: 10, fill: 'rgba(255,255,255,0.25)'}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{background:'#1e293b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',fontSize:'0.8rem',color:'white'}} formatter={v => [`$${v.toFixed(2)}`, 'Price']} />
                    <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} fill="url(#grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <MetricsRow>
                <MetricBox><MetricLabel>Mkt Cap</MetricLabel><MetricValue>{selectedStock.marketCap}</MetricValue></MetricBox>
                <MetricBox><MetricLabel>P/E</MetricLabel><MetricValue>{selectedStock.pe}</MetricValue></MetricBox>
                <MetricBox><MetricLabel>Div Yield</MetricLabel><MetricValue>{selectedStock.dividend}%</MetricValue></MetricBox>
                <MetricBox><MetricLabel>Shares Held</MetricLabel><MetricValue>{currentHolding ? currentHolding.shares : 0}</MetricValue></MetricBox>
              </MetricsRow>

              <TradeForm>
                <TradeRow>
                  <TradeInput type="number" placeholder="Qty" value={tradeQuantity} onChange={e => setTradeQuantity(e.target.value)} min="1" />
                  <TradeButton className="buy" onClick={() => executeTrade('BUY')} disabled={!tradeQuantity || parseInt(tradeQuantity) <= 0}>
                    <FaShoppingCart /> Buy
                  </TradeButton>
                  <TradeButton className="sell" onClick={() => executeTrade('SELL')} disabled={!tradeQuantity || parseInt(tradeQuantity) <= 0}>
                    Sell
                  </TradeButton>
                </TradeRow>
                {tradeCost > 0 && <TradeCost>Total: <span>${tradeCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></TradeCost>}
              </TradeForm>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle><FaHistory /> Transactions</CardTitle></CardHeader>
            <CardBody>
              {transactions.length === 0 ? <EmptyState>No transactions yet</EmptyState> : (
                transactions.slice(0, 10).map((tx, i) => (
                  <TransactionRow key={i}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                      <TxBadge $type={tx.type}>{tx.type}</TxBadge>
                      <span style={{fontWeight:700,color:'white'}}>{tx.symbol}</span>
                      <span style={{color:'rgba(255,255,255,0.3)'}}>{tx.shares}×${tx.price.toFixed(2)}</span>
                    </div>
                    <span style={{fontWeight:600,color:'white'}}>${tx.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </TransactionRow>
                ))
              )}
            </CardBody>
          </Card>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <Card>
            <CardHeader><CardTitle><FaSearch /> Market</CardTitle></CardHeader>
            <CardBody>
              <SearchBar>
                <FaSearch style={{color:'rgba(255,255,255,0.2)'}} />
                <SearchInput placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </SearchBar>
              <StockList>
                {filteredStocks.map(stock => (
                  <StockRow key={stock.symbol} onClick={() => setSelectedStock(stock)} $active={selectedStock.symbol === stock.symbol}>
                    <div><StockSymbol>{stock.symbol}</StockSymbol><StockName>{stock.name}</StockName></div>
                    <div style={{textAlign:'right'}}>
                      <PriceValue>${stock.price.toFixed(2)}</PriceValue>
                      <PriceChange $pos={stock.change >= 0}>{stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}{Math.abs(stock.changePercent)}%</PriceChange>
                    </div>
                  </StockRow>
                ))}
              </StockList>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle><FaWallet /> Holdings</CardTitle></CardHeader>
            <CardBody>
              {holdings.length === 0 ? <EmptyState>No holdings yet</EmptyState> : (
                holdings.map(h => {
                  const stock = stocks.find(s => s.symbol === h.symbol);
                  const cv = stock ? stock.price * h.shares : 0;
                  const cb = h.avgPrice * h.shares;
                  const pnl = cv - cb;
                  return (
                    <HoldingRow key={h.symbol} onClick={() => { const s = stocks.find(s => s.symbol === h.symbol); if(s) setSelectedStock(s); }}>
                      <div><HoldingSymbol>{h.symbol}</HoldingSymbol><HoldingShares>{h.shares} @ ${h.avgPrice.toFixed(2)}</HoldingShares></div>
                      <div style={{textAlign:'right'}}>
                        <HoldingTotal>${cv.toLocaleString(undefined, {minimumFractionDigits: 2})}</HoldingTotal>
                        <HoldingPnl $pos={pnl >= 0}>{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</HoldingPnl>
                      </div>
                    </HoldingRow>
                  );
                })
              )}
            </CardBody>
          </Card>
        </div>
      </MainContent>

      <AnimatePresence>
        {notification && (
          <Notification $type={notification.type}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
            {notification.type === 'success' ? <FaCheckCircle style={{color:'#4ade80'}} /> : <FaInfoCircle style={{color:'#f87171'}} />}
            {notification.message}
          </Notification>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default DemoTrading;
