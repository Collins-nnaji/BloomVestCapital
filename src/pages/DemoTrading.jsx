import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FaArrowUp, FaArrowDown, FaWallet, FaChartLine, FaShoppingCart, FaHistory, FaInfoCircle, FaTimes, FaSearch, FaCheckCircle } from 'react-icons/fa';
import { stocks, marketIndices, sectors } from '../data/stockData';
import { scenarios, difficultyColors } from '../data/scenarios';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f1f5f9;
`;

const HeaderSection = styled.section`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 3.5rem 1.5rem 2.5rem;
`;

const HeaderContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`;

const HeaderTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  span { color: #22c55e; }
  @media (max-width: 768px) { font-size: 1.8rem; }
`;

const HeaderSubtitle = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 1rem;
`;

const PortfolioBar = styled.div`
  max-width: 1300px;
  margin: -1.25rem auto 0;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
`;

const PortfolioCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.75rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const PortfolioStat = styled.div`
  text-align: center;
  min-width: 120px;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${props => props.color || '#0f172a'};
`;

const MainContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { color: #22c55e; }
`;

const CardBody = styled.div`
  padding: 1.25rem 1.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  font-size: 0.9rem;
  color: #334155;
  width: 100%;

  &::placeholder { color: #94a3b8; }
`;

const StockList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const StockRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #f8fafc; margin: 0 -1.5rem; padding: 0.75rem 1.5rem; }
  &:last-child { border-bottom: none; }
`;

const StockInfo = styled.div``;

const StockSymbol = styled.div`
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
`;

const StockName = styled.div`
  color: #94a3b8;
  font-size: 0.8rem;
`;

const StockPrice = styled.div`
  text-align: right;
`;

const PriceValue = styled.div`
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
`;

const PriceChange = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.positive ? '#22c55e' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 0.2rem;
  justify-content: flex-end;
`;

const ChartContainer = styled.div`
  height: 250px;
  margin: 0 -0.5rem;
`;

const StockDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StockDetailInfo = styled.div``;

const StockDetailSymbol = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
`;

const StockDetailName = styled.p`
  color: #64748b;
  font-size: 0.9rem;
`;

const StockDetailPrice = styled.div`
  text-align: right;
`;

const BigPrice = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
`;

const BigChange = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.positive ? '#22c55e' : '#ef4444'};
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin: 1.25rem 0;

  @media (max-width: 500px) { grid-template-columns: repeat(2, 1fr); }
`;

const MetricBox = styled.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 0.75rem;
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
`;

const MetricValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`;

const TradeForm = styled.div`
  background: #f8fafc;
  border-radius: 14px;
  padding: 1.25rem;
  margin-top: 1rem;
`;

const TradeRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const TradeInput = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  outline: none;
  transition: border 0.2s;

  &:focus { border-color: #22c55e; }
`;

const TradeButton = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &.buy {
    background: #22c55e;
    color: white;
    &:hover { background: #16a34a; }
  }

  &.sell {
    background: #ef4444;
    color: white;
    &:hover { background: #dc2626; }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TradeCost = styled.div`
  text-align: right;
  font-size: 0.85rem;
  color: #64748b;

  span { font-weight: 700; color: #0f172a; }
`;

const HoldingsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const HoldingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }
`;

const HoldingInfo = styled.div``;

const HoldingSymbol = styled.div`
  font-weight: 700;
  color: #0f172a;
  font-size: 0.9rem;
`;

const HoldingShares = styled.div`
  color: #94a3b8;
  font-size: 0.8rem;
`;

const HoldingValue = styled.div`
  text-align: right;
`;

const HoldingTotal = styled.div`
  font-weight: 700;
  color: #0f172a;
  font-size: 0.9rem;
`;

const HoldingPnl = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.positive ? '#22c55e' : '#ef4444'};
`;

const TransactionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.85rem;

  &:last-child { border-bottom: none; }
`;

const TransactionType = styled.span`
  font-weight: 700;
  color: ${props => props.type === 'BUY' ? '#22c55e' : '#ef4444'};
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: ${props => props.type === 'BUY' ? '#22c55e15' : '#ef444415'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const ScenariosSection = styled.div`
  margin-top: 1rem;
`;

const ScenarioMiniCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: #22c55e; background: #f0fdf4; }
`;

const ScenarioMiniIcon = styled.span`
  font-size: 1.5rem;
`;

const ScenarioMiniInfo = styled.div`
  flex: 1;
`;

const ScenarioMiniTitle = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
`;

const ScenarioMiniBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${props => props.color};
`;

const NotificationBar = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.type === 'success' ? '#0f172a' : '#ef4444'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const INITIAL_BALANCE = 100000;

const DemoTrading = () => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('bloomvest_balance');
    return saved ? parseFloat(saved) : INITIAL_BALANCE;
  });
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem('bloomvest_holdings');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('bloomvest_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  const saveState = useCallback((newBalance, newHoldings, newTransactions) => {
    localStorage.setItem('bloomvest_balance', newBalance.toString());
    localStorage.setItem('bloomvest_holdings', JSON.stringify(newHoldings));
    localStorage.setItem('bloomvest_transactions', JSON.stringify(newTransactions));
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const executeTrade = (type) => {
    const qty = parseInt(tradeQuantity);
    if (!qty || qty <= 0) return;

    const totalCost = qty * selectedStock.price;

    if (type === 'BUY') {
      if (totalCost > balance) {
        showNotification('Insufficient funds for this purchase', 'error');
        return;
      }

      const newBalance = balance - totalCost;
      const existingIndex = holdings.findIndex(h => h.symbol === selectedStock.symbol);
      let newHoldings;

      if (existingIndex >= 0) {
        newHoldings = [...holdings];
        const existing = newHoldings[existingIndex];
        const totalShares = existing.shares + qty;
        const avgPrice = (existing.avgPrice * existing.shares + totalCost) / totalShares;
        newHoldings[existingIndex] = { ...existing, shares: totalShares, avgPrice };
      } else {
        newHoldings = [...holdings, {
          symbol: selectedStock.symbol,
          name: selectedStock.name,
          shares: qty,
          avgPrice: selectedStock.price
        }];
      }

      const newTransaction = {
        type: 'BUY',
        symbol: selectedStock.symbol,
        shares: qty,
        price: selectedStock.price,
        total: totalCost,
        date: new Date().toLocaleString()
      };
      const newTransactions = [newTransaction, ...transactions].slice(0, 50);

      setBalance(newBalance);
      setHoldings(newHoldings);
      setTransactions(newTransactions);
      saveState(newBalance, newHoldings, newTransactions);
      showNotification(`Bought ${qty} shares of ${selectedStock.symbol} for $${totalCost.toLocaleString()}`);
    } else {
      const holdingIndex = holdings.findIndex(h => h.symbol === selectedStock.symbol);
      if (holdingIndex < 0 || holdings[holdingIndex].shares < qty) {
        showNotification('Not enough shares to sell', 'error');
        return;
      }

      const newBalance = balance + totalCost;
      let newHoldings = [...holdings];

      if (newHoldings[holdingIndex].shares === qty) {
        newHoldings.splice(holdingIndex, 1);
      } else {
        newHoldings[holdingIndex] = {
          ...newHoldings[holdingIndex],
          shares: newHoldings[holdingIndex].shares - qty
        };
      }

      const newTransaction = {
        type: 'SELL',
        symbol: selectedStock.symbol,
        shares: qty,
        price: selectedStock.price,
        total: totalCost,
        date: new Date().toLocaleString()
      };
      const newTransactions = [newTransaction, ...transactions].slice(0, 50);

      setBalance(newBalance);
      setHoldings(newHoldings);
      setTransactions(newTransactions);
      saveState(newBalance, newHoldings, newTransactions);
      showNotification(`Sold ${qty} shares of ${selectedStock.symbol} for $${totalCost.toLocaleString()}`);
    }

    setTradeQuantity('');
  };

  const resetPortfolio = () => {
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
          <HeaderTitle>Demo <span>Trading</span> Simulator</HeaderTitle>
          <HeaderSubtitle>Practice investing with $100,000 in virtual money. Zero risk, real learning.</HeaderSubtitle>
        </HeaderContent>
      </HeaderSection>

      <PortfolioBar>
        <PortfolioCard>
          <PortfolioStat>
            <StatLabel>Total Value</StatLabel>
            <StatValue>${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>Cash</StatLabel>
            <StatValue>${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>Invested</StatLabel>
            <StatValue>${portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StatValue>
          </PortfolioStat>
          <PortfolioStat>
            <StatLabel>P&L</StatLabel>
            <StatValue color={totalPnl >= 0 ? '#22c55e' : '#ef4444'}>
              {totalPnl >= 0 ? '+' : ''}{totalPnlPercent}%
            </StatValue>
          </PortfolioStat>
          <TradeButton className="sell" onClick={resetPortfolio} style={{marginLeft: 'auto', fontSize: '0.8rem', padding: '0.5rem 1rem'}}>
            Reset Portfolio
          </TradeButton>
        </PortfolioCard>
      </PortfolioBar>

      <MainContent>
        <LeftPanel>
          <Card>
            <CardHeader>
              <CardTitle><FaChartLine /> {selectedStock.symbol} — {selectedStock.name}</CardTitle>
            </CardHeader>
            <CardBody>
              <StockDetailHeader>
                <StockDetailInfo>
                  <StockDetailSymbol>{selectedStock.symbol}</StockDetailSymbol>
                  <StockDetailName>{selectedStock.name} • {selectedStock.sector}</StockDetailName>
                </StockDetailInfo>
                <StockDetailPrice>
                  <BigPrice>${selectedStock.price.toFixed(2)}</BigPrice>
                  <BigChange positive={selectedStock.change >= 0}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%)
                  </BigChange>
                </StockDetailPrice>
              </StockDetailHeader>

              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedStock.historicalPrices}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem'}}
                      formatter={(val) => [`$${val.toFixed(2)}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <MetricsRow>
                <MetricBox>
                  <MetricLabel>Mkt Cap</MetricLabel>
                  <MetricValue>{selectedStock.marketCap}</MetricValue>
                </MetricBox>
                <MetricBox>
                  <MetricLabel>P/E Ratio</MetricLabel>
                  <MetricValue>{selectedStock.pe}</MetricValue>
                </MetricBox>
                <MetricBox>
                  <MetricLabel>Div Yield</MetricLabel>
                  <MetricValue>{selectedStock.dividend}%</MetricValue>
                </MetricBox>
                <MetricBox>
                  <MetricLabel>Your Shares</MetricLabel>
                  <MetricValue>{currentHolding ? currentHolding.shares : 0}</MetricValue>
                </MetricBox>
              </MetricsRow>

              <TradeForm>
                <TradeRow>
                  <TradeInput
                    type="number"
                    placeholder="Quantity"
                    value={tradeQuantity}
                    onChange={e => setTradeQuantity(e.target.value)}
                    min="1"
                  />
                  <TradeButton className="buy" onClick={() => executeTrade('BUY')} disabled={!tradeQuantity || parseInt(tradeQuantity) <= 0}>
                    <FaShoppingCart /> Buy
                  </TradeButton>
                  <TradeButton className="sell" onClick={() => executeTrade('SELL')} disabled={!tradeQuantity || parseInt(tradeQuantity) <= 0}>
                    Sell
                  </TradeButton>
                </TradeRow>
                {tradeCost > 0 && (
                  <TradeCost>
                    Total: <span>${tradeCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </TradeCost>
                )}
              </TradeForm>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><FaHistory /> Transaction History</CardTitle>
            </CardHeader>
            <CardBody>
              {transactions.length === 0 ? (
                <EmptyState>No transactions yet. Start trading!</EmptyState>
              ) : (
                transactions.slice(0, 10).map((tx, i) => (
                  <TransactionRow key={i}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <TransactionType type={tx.type}>{tx.type}</TransactionType>
                      <span style={{fontWeight: 700, color: '#0f172a'}}>{tx.symbol}</span>
                      <span style={{color: '#94a3b8'}}>{tx.shares} shares @ ${tx.price.toFixed(2)}</span>
                    </div>
                    <span style={{fontWeight: 600, color: '#0f172a'}}>${tx.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </TransactionRow>
                ))
              )}
            </CardBody>
          </Card>
        </LeftPanel>

        <RightPanel>
          <Card>
            <CardHeader>
              <CardTitle><FaSearch /> Stocks</CardTitle>
            </CardHeader>
            <CardBody>
              <SearchBar>
                <FaSearch style={{color: '#94a3b8'}} />
                <SearchInput
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </SearchBar>
              <StockList>
                {filteredStocks.map(stock => (
                  <StockRow
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    style={{background: selectedStock.symbol === stock.symbol ? '#f0fdf4' : undefined}}
                  >
                    <StockInfo>
                      <StockSymbol>{stock.symbol}</StockSymbol>
                      <StockName>{stock.name}</StockName>
                    </StockInfo>
                    <StockPrice>
                      <PriceValue>${stock.price.toFixed(2)}</PriceValue>
                      <PriceChange positive={stock.change >= 0}>
                        {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {Math.abs(stock.changePercent)}%
                      </PriceChange>
                    </StockPrice>
                  </StockRow>
                ))}
              </StockList>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><FaWallet /> Your Holdings</CardTitle>
            </CardHeader>
            <CardBody>
              {holdings.length === 0 ? (
                <EmptyState>No holdings yet. Buy some stocks!</EmptyState>
              ) : (
                <HoldingsList>
                  {holdings.map(h => {
                    const stock = stocks.find(s => s.symbol === h.symbol);
                    const currentValue = stock ? stock.price * h.shares : 0;
                    const costBasis = h.avgPrice * h.shares;
                    const pnl = currentValue - costBasis;
                    const pnlPercent = ((pnl / costBasis) * 100).toFixed(1);
                    return (
                      <HoldingRow key={h.symbol} onClick={() => setSelectedStock(stocks.find(s => s.symbol === h.symbol) || selectedStock)} style={{cursor: 'pointer'}}>
                        <HoldingInfo>
                          <HoldingSymbol>{h.symbol}</HoldingSymbol>
                          <HoldingShares>{h.shares} shares @ ${h.avgPrice.toFixed(2)}</HoldingShares>
                        </HoldingInfo>
                        <HoldingValue>
                          <HoldingTotal>${currentValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</HoldingTotal>
                          <HoldingPnl positive={pnl >= 0}>
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPercent}%)
                          </HoldingPnl>
                        </HoldingValue>
                      </HoldingRow>
                    );
                  })}
                </HoldingsList>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><FaInfoCircle /> Scenarios</CardTitle>
            </CardHeader>
            <CardBody>
              <ScenariosSection>
                {scenarios.slice(0, 3).map(s => (
                  <ScenarioMiniCard key={s.id}>
                    <ScenarioMiniIcon>{s.icon}</ScenarioMiniIcon>
                    <ScenarioMiniInfo>
                      <ScenarioMiniTitle>{s.title}</ScenarioMiniTitle>
                      <ScenarioMiniBadge color={difficultyColors[s.difficulty]}>
                        {s.difficulty} • {s.duration}
                      </ScenarioMiniBadge>
                    </ScenarioMiniInfo>
                  </ScenarioMiniCard>
                ))}
              </ScenariosSection>
            </CardBody>
          </Card>
        </RightPanel>
      </MainContent>

      <AnimatePresence>
        {notification && (
          <NotificationBar
            type={notification.type}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {notification.type === 'success' ? <FaCheckCircle style={{color: '#22c55e'}} /> : <FaTimes />}
            {notification.message}
          </NotificationBar>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default DemoTrading;
