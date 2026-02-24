export const stocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 178.52,
    change: 2.34,
    changePercent: 1.33,
    marketCap: '2.78T',
    pe: 28.5,
    dividend: 0.51,
    description: 'Consumer electronics, software, and services company.',
    historicalPrices: generatePriceHistory(178.52, 90, 0.015),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Technology',
    price: 415.20,
    change: -1.85,
    changePercent: -0.44,
    marketCap: '3.09T',
    pe: 35.2,
    dividend: 0.68,
    description: 'Software, cloud computing, and AI company.',
    historicalPrices: generatePriceHistory(415.20, 90, 0.012),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    price: 141.80,
    change: 0.95,
    changePercent: 0.67,
    marketCap: '1.78T',
    pe: 24.1,
    dividend: 0,
    description: 'Search, advertising, cloud, and AI company.',
    historicalPrices: generatePriceHistory(141.80, 90, 0.018),
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    price: 185.60,
    change: 3.21,
    changePercent: 1.76,
    marketCap: '1.93T',
    pe: 60.8,
    dividend: 0,
    description: 'E-commerce, cloud computing, and digital services.',
    historicalPrices: generatePriceHistory(185.60, 90, 0.02),
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    price: 156.30,
    change: -0.42,
    changePercent: -0.27,
    marketCap: '376B',
    pe: 19.8,
    dividend: 3.12,
    description: 'Pharmaceuticals, medical devices, and consumer health.',
    historicalPrices: generatePriceHistory(156.30, 90, 0.008),
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    sector: 'Financial',
    price: 198.45,
    change: 1.12,
    changePercent: 0.57,
    marketCap: '571B',
    pe: 11.5,
    dividend: 2.45,
    description: 'Global financial services and investment banking.',
    historicalPrices: generatePriceHistory(198.45, 90, 0.013),
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    sector: 'Financial',
    price: 279.10,
    change: 0.68,
    changePercent: 0.24,
    marketCap: '560B',
    pe: 30.2,
    dividend: 0.72,
    description: 'Global payments technology company.',
    historicalPrices: generatePriceHistory(279.10, 90, 0.01),
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble',
    sector: 'Consumer Staples',
    price: 162.85,
    change: 0.35,
    changePercent: 0.22,
    marketCap: '384B',
    pe: 25.6,
    dividend: 2.35,
    description: 'Consumer goods conglomerate with iconic brands.',
    historicalPrices: generatePriceHistory(162.85, 90, 0.006),
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    sector: 'Technology',
    price: 721.33,
    change: 15.42,
    changePercent: 2.18,
    marketCap: '1.78T',
    pe: 65.3,
    dividend: 0.04,
    description: 'GPU and AI computing chip designer.',
    historicalPrices: generatePriceHistory(721.33, 90, 0.035),
  },
  {
    symbol: 'KO',
    name: 'Coca-Cola Co.',
    sector: 'Consumer Staples',
    price: 59.82,
    change: 0.15,
    changePercent: 0.25,
    marketCap: '258B',
    pe: 23.1,
    dividend: 3.08,
    description: 'Global beverage company with iconic brands.',
    historicalPrices: generatePriceHistory(59.82, 90, 0.005),
  }
];

function generatePriceHistory(currentPrice, days, volatility) {
  const prices = [];
  let price = currentPrice * (1 - (Math.random() * 0.15 - 0.05));
  const trend = (currentPrice - price) / days;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const randomWalk = (Math.random() - 0.48) * currentPrice * volatility;
    price = Math.max(price + trend + randomWalk, currentPrice * 0.5);
    prices.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    });
  }
  return prices;
}

export const marketIndices = [
  { name: 'S&P 500', value: 5021.84, change: 0.87, changePercent: 0.52 },
  { name: 'NASDAQ', value: 15990.66, change: -45.20, changePercent: -0.28 },
  { name: 'DOW', value: 38996.40, change: 125.69, changePercent: 0.32 },
];

export const sectors = [
  { name: 'Technology', performance: 2.1, color: '#3b82f6' },
  { name: 'Healthcare', performance: -0.4, color: '#ef4444' },
  { name: 'Financial', performance: 1.3, color: '#22c55e' },
  { name: 'Consumer Staples', performance: 0.2, color: '#f59e0b' },
  { name: 'Consumer Cyclical', performance: 1.8, color: '#8b5cf6' },
  { name: 'Energy', performance: -1.2, color: '#ec4899' },
];
