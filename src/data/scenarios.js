export const scenarios = [
  {
    id: 'first-investment',
    title: 'Your First $10,000 Investment',
    difficulty: 'Beginner',
    duration: '15 min',
    icon: '🌱',
    description: 'You just received $10,000 and want to start investing. The AI advisor will guide you through building a diversified portfolio from scratch.',
    briefing: 'Imagine you have saved $10,000 and are ready to make your first investments. Your goal is to build a diversified portfolio across multiple sectors. The AI advisor will explain each step and help you understand why diversification matters.',
    startingBalance: 10000,
    objectives: [
      { id: 'buy-first', label: 'Make your first stock purchase', check: (h) => h.length >= 1 },
      { id: 'diversify-3', label: 'Own at least 3 different stocks', check: (h) => h.length >= 3 },
      { id: 'multi-sector', label: 'Invest across at least 2 sectors', check: (h, stocks) => {
        const sectors = new Set(h.map(holding => stocks.find(s => s.symbol === holding.symbol)?.sector).filter(Boolean));
        return sectors.size >= 2;
      }},
      { id: 'max-30', label: 'Keep each position under 40% of portfolio', check: (h, stocks, balance) => {
        const total = h.reduce((sum, holding) => sum + (stocks.find(s => s.symbol === holding.symbol)?.price || 0) * holding.shares, 0) + balance;
        return h.every(holding => {
          const val = (stocks.find(s => s.symbol === holding.symbol)?.price || 0) * holding.shares;
          return val / total < 0.4;
        });
      }},
      { id: 'invest-50', label: 'Invest at least 50% of your capital', check: (h, stocks, balance) => balance <= 5000 },
    ],
    tips: [
      'Start with companies you know and understand',
      'Spread your money across different sectors (tech, healthcare, finance)',
      'Don\'t put more than 30-40% in any single stock',
      'Consider a mix of growth stocks and stable dividend payers'
    ],
    learningGoals: ['Portfolio diversification', 'Sector allocation', 'Position sizing', 'Risk management basics']
  },
  {
    id: 'dividend-income',
    title: 'Build a Dividend Income Portfolio',
    difficulty: 'Intermediate',
    duration: '20 min',
    icon: '💰',
    description: 'Create a portfolio focused on generating passive income through dividends. The AI advisor will teach you about yield, payout ratios, and income investing.',
    briefing: 'Your goal is to build a portfolio that generates passive income through dividends. You will learn to identify quality dividend-paying stocks, understand dividend yield, and balance income with growth potential.',
    startingBalance: 25000,
    objectives: [
      { id: 'buy-dividend', label: 'Buy a stock with dividend yield above 2%', check: (h, stocks) => h.some(holding => (stocks.find(s => s.symbol === holding.symbol)?.dividend || 0) >= 2) },
      { id: 'three-dividends', label: 'Own at least 3 dividend-paying stocks', check: (h, stocks) => h.filter(holding => (stocks.find(s => s.symbol === holding.symbol)?.dividend || 0) > 0).length >= 3 },
      { id: 'diversify-sectors', label: 'Spread across 3+ sectors', check: (h, stocks) => {
        const sectors = new Set(h.map(holding => stocks.find(s => s.symbol === holding.symbol)?.sector).filter(Boolean));
        return sectors.size >= 3;
      }},
      { id: 'invest-60', label: 'Invest at least 60% of capital', check: (h, stocks, balance) => balance <= 10000 },
    ],
    tips: [
      'Look for stocks with consistent dividend histories (KO, JNJ, PG)',
      'Higher yield isn\'t always better — check if dividends are sustainable',
      'Consumer Staples and Healthcare tend to offer reliable dividends',
      'Reinvesting dividends accelerates wealth building (DRIP)'
    ],
    learningGoals: ['Dividend investing', 'Income generation', 'Yield analysis', 'Dividend sustainability']
  },
  {
    id: 'tech-growth',
    title: 'Growth vs. Value: Tech Portfolio',
    difficulty: 'Intermediate',
    duration: '20 min',
    icon: '🚀',
    description: 'Build a growth-oriented tech portfolio and learn why growth stocks trade at premium valuations. The AI will explain P/E ratios and growth metrics.',
    briefing: 'Technology stocks often trade at higher valuations because investors expect rapid future growth. Your challenge is to build a tech-focused portfolio while understanding the tradeoff between growth potential and valuation risk.',
    startingBalance: 20000,
    objectives: [
      { id: 'buy-tech', label: 'Buy at least 2 technology stocks', check: (h, stocks) => h.filter(holding => stocks.find(s => s.symbol === holding.symbol)?.sector === 'Technology').length >= 2 },
      { id: 'high-pe', label: 'Own a stock with P/E ratio above 30', check: (h, stocks) => h.some(holding => (stocks.find(s => s.symbol === holding.symbol)?.pe || 0) > 30) },
      { id: 'add-stable', label: 'Add a non-tech stock for balance', check: (h, stocks) => h.some(holding => stocks.find(s => s.symbol === holding.symbol)?.sector !== 'Technology') },
      { id: 'invest-70', label: 'Deploy at least 70% of capital', check: (h, stocks, balance) => balance <= 6000 },
    ],
    tips: [
      'AAPL, MSFT, GOOGL, NVDA are major tech players',
      'High P/E ratios reflect growth expectations, not overvaluation',
      'Balance tech exposure with a defensive stock (JNJ, KO, PG)',
      'NVDA\'s high P/E reflects explosive AI-driven growth'
    ],
    learningGoals: ['Growth investing', 'P/E ratio analysis', 'Sector concentration risk', 'Balancing growth and stability']
  },
  {
    id: 'market-crash',
    title: 'Surviving a Market Crash',
    difficulty: 'Advanced',
    duration: '15 min',
    icon: '📉',
    description: 'Your portfolio just dropped 25%. Do you sell, hold, or buy more? The AI advisor helps you navigate fear and make rational decisions during a downturn.',
    briefing: 'Markets have crashed — your portfolio is down significantly. History shows that panic selling is the worst thing you can do. This scenario teaches you how to think rationally during fear, when to buy the dip, and why long-term investors actually benefit from crashes.',
    startingBalance: 50000,
    objectives: [
      { id: 'buy-dip', label: 'Buy stocks during the "crash" (buy any stock)', check: (h) => h.length >= 1 },
      { id: 'diversify', label: 'Buy at least 3 different stocks', check: (h) => h.length >= 3 },
      { id: 'quality-focus', label: 'Buy a stock with P/E under 30 (value pick)', check: (h, stocks) => h.some(holding => (stocks.find(s => s.symbol === holding.symbol)?.pe || 0) < 30) },
      { id: 'stay-invested', label: 'Invest at least 40% of capital', check: (h, stocks, balance) => balance <= 30000 },
    ],
    tips: [
      'Warren Buffett: "Be fearful when others are greedy, greedy when others are fearful"',
      'Market crashes create buying opportunities for long-term investors',
      'Quality companies with strong balance sheets survive downturns',
      'Missing the 10 best days in a decade cuts your returns in half'
    ],
    learningGoals: ['Crisis management', 'Emotional discipline', 'Contrarian investing', 'Long-term perspective']
  },
  {
    id: 'retirement-30',
    title: 'Plan Your Retirement Portfolio',
    difficulty: 'Advanced',
    duration: '20 min',
    icon: '🏖️',
    description: 'Build a long-term retirement portfolio. The AI advisor teaches asset allocation, the importance of starting early, and balancing growth with stability.',
    briefing: 'You are 30 years old with $50,000 to invest for retirement at 65. Your challenge is to build an age-appropriate portfolio that balances growth (stocks) with stability. The AI advisor will explain the "110 minus age" rule and why time horizon matters.',
    startingBalance: 50000,
    objectives: [
      { id: 'growth-focus', label: 'Allocate at least 60% to growth stocks', check: (h, stocks, balance) => {
        const total = h.reduce((sum, holding) => sum + (stocks.find(s => s.symbol === holding.symbol)?.price || 0) * holding.shares, 0) + balance;
        const growthVal = h.filter(holding => (stocks.find(s => s.symbol === holding.symbol)?.pe || 0) > 20)
          .reduce((sum, holding) => sum + (stocks.find(s => s.symbol === holding.symbol)?.price || 0) * holding.shares, 0);
        return total > 0 && growthVal / total >= 0.3;
      }},
      { id: 'add-dividend', label: 'Include at least 1 dividend stock for income', check: (h, stocks) => h.some(holding => (stocks.find(s => s.symbol === holding.symbol)?.dividend || 0) >= 1) },
      { id: 'diversify-4', label: 'Own at least 4 different stocks', check: (h) => h.length >= 4 },
      { id: 'deploy-capital', label: 'Invest at least 70% of capital', check: (h, stocks, balance) => balance <= 15000 },
    ],
    tips: [
      'At 30, the "110 minus age" rule suggests ~80% in stocks',
      'Growth stocks (AAPL, MSFT, NVDA) drive long-term returns',
      'Include some dividend payers (JNJ, KO) for stability',
      'Time in the market beats timing the market'
    ],
    learningGoals: ['Retirement planning', 'Asset allocation by age', 'Long-term strategy', 'Growth vs. income balance']
  },
];

export const difficultyColors = {
  'Beginner': '#22c55e',
  'Intermediate': '#3b82f6',
  'Advanced': '#a855f7'
};
