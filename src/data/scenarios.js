export const scenarios = [
  {
    id: 'first-investment',
    title: 'Your First $10,000 Investment',
    difficulty: 'Beginner',
    duration: '15 min',
    icon: '🌱',
    assets: ['AAPL', 'MSFT', 'GOOGL', 'JNJ', 'JPM', 'PG', 'KO', 'V', 'SPY'],
    description: 'You just received $10,000 and want to start investing. The AI advisor will guide you through building a diversified portfolio from scratch.',
    briefing: 'In this simulation, you\'ll learn how to build a diversified portfolio from scratch. Your AI tutor will teach you about sector allocation, position sizing, and why putting all your eggs in one basket is risky. Every stock you buy, I\'ll explain what makes it a good or bad choice and why diversification protects your money.',
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
    assets: ['KO', 'JNJ', 'PG', 'JPM', 'V', 'AAPL', 'VNQ', 'BND', 'HYG'],
    description: 'Create a portfolio focused on generating passive income through dividends. The AI advisor will teach you about yield, payout ratios, and income investing.',
    briefing: 'Your AI tutor will teach you how dividends work — how companies share their profits with you as a shareholder. You\'ll learn to evaluate dividend yield, check if dividends are sustainable, and build a portfolio that pays you regular income. I\'ll explain every concept as you invest.',
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
    assets: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'JNJ', 'KO', 'PG', 'QQQ'],
    description: 'Build a growth-oriented tech portfolio and learn why growth stocks trade at premium valuations. The AI will explain P/E ratios and growth metrics.',
    briefing: 'Your AI tutor will teach you why tech stocks trade at premium prices (high P/E ratios) and when that\'s justified by growth. You\'ll learn the difference between growth and value investing, understand P/E ratios in context, and discover why even a growth portfolio needs some defensive balance.',
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
    assets: ['AAPL', 'MSFT', 'GOOGL', 'JNJ', 'JPM', 'KO', 'PG', 'GLD', 'BND', 'SPY'],
    description: 'Your portfolio just dropped 25%. Do you sell, hold, or buy more? The AI advisor helps you navigate fear and make rational decisions during a downturn.',
    briefing: 'Your AI tutor will walk you through the psychology of a market crash. You\'ll learn why panic selling destroys wealth, how legendary investors like Warren Buffett profit from crashes, and the historical data showing markets always recover. Every action you take, I\'ll teach you the mindset behind smart crisis investing.',
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
    assets: ['AAPL', 'MSFT', 'NVDA', 'JNJ', 'KO', 'JPM', 'BND', 'VNQ', 'SPY', 'VXUS'],
    description: 'Build a long-term retirement portfolio. The AI advisor teaches asset allocation, the importance of starting early, and balancing growth with stability.',
    briefing: 'Your AI tutor will teach you the "110 minus age" rule, why time horizon is the most powerful factor in investing, and how to balance growth with stability at different life stages. You\'ll build a retirement portfolio and learn exactly why each allocation decision matters for your future.',
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
  {
    id: 'commodities-101',
    title: 'Commodities: Gold, Oil & Agriculture',
    difficulty: 'Intermediate',
    duration: '18 min',
    icon: '🛢️',
    assets: ['GLD', 'SLV', 'USO', 'CORN', 'AAPL', 'SPY', 'BND'],
    description: 'Learn to trade commodities — gold as a safe haven, oil as an economic indicator, and agricultural products. The AI tutor explains how commodities behave differently from stocks.',
    briefing: 'Your AI tutor will teach you how commodity markets work and why they move differently from stocks. You\'ll learn why gold rises during fear, how oil prices reflect economic health, and the role of agricultural commodities. Every trade, I\'ll explain the unique dynamics of commodity investing.',
    startingBalance: 20000,
    objectives: [
      { id: 'buy-gold', label: 'Buy gold (GLD) — the classic safe haven', check: (h) => h.some(holding => holding.symbol === 'GLD') },
      { id: 'buy-oil', label: 'Buy oil (USO) — the economic bellwether', check: (h) => h.some(holding => holding.symbol === 'USO') },
      { id: 'buy-agri', label: 'Buy an agricultural commodity (CORN)', check: (h) => h.some(holding => holding.symbol === 'CORN') },
      { id: 'add-stock', label: 'Add a stock for comparison (any stock)', check: (h, stocks) => h.some(holding => ['Technology','Healthcare','Financial','Consumer Staples','Consumer Cyclical','Energy'].includes(stocks.find(s => s.symbol === holding.symbol)?.sector)) },
      { id: 'deploy', label: 'Invest at least 60% of capital', check: (h, stocks, balance) => balance <= 8000 },
    ],
    tips: [
      'Gold (GLD) historically rises during market uncertainty and inflation fears',
      'Oil (USO) prices reflect global economic demand — they fall in recessions',
      'Commodities have low correlation with stocks, making them good diversifiers',
      'Commodity prices are driven by supply/demand, weather, and geopolitics — not earnings'
    ],
    learningGoals: ['Commodity markets', 'Safe haven assets', 'Supply & demand dynamics', 'Portfolio diversification with alternatives']
  },
  {
    id: 'crypto-portfolio',
    title: 'Crypto Investing: Risk & Reward',
    difficulty: 'Intermediate',
    duration: '15 min',
    icon: '🪙',
    assets: ['IBIT', 'ETHE', 'BND', 'SPY', 'GLD', 'AAPL'],
    description: 'Explore cryptocurrency through regulated ETFs. The AI tutor teaches you about Bitcoin, Ethereum, extreme volatility, and how to size crypto positions responsibly.',
    briefing: 'Your AI tutor will guide you through crypto investing using regulated ETFs. You\'ll learn why Bitcoin is called "digital gold," how Ethereum enables smart contracts, why crypto is so volatile, and the golden rule: never invest more than you can afford to lose. I\'ll explain every decision.',
    startingBalance: 15000,
    objectives: [
      { id: 'buy-btc', label: 'Buy Bitcoin exposure (IBIT)', check: (h) => h.some(holding => holding.symbol === 'IBIT') },
      { id: 'buy-eth', label: 'Buy Ethereum exposure (ETHE)', check: (h) => h.some(holding => holding.symbol === 'ETHE') },
      { id: 'limit-crypto', label: 'Keep total crypto under 30% of portfolio', check: (h, stocks, balance) => {
        const total = h.reduce((s, holding) => s + (stocks.find(st => st.symbol === holding.symbol)?.price || 0) * holding.shares, 0) + balance;
        const cryptoVal = h.filter(holding => stocks.find(st => st.symbol === holding.symbol)?.sector === 'Crypto')
          .reduce((s, holding) => s + (stocks.find(st => st.symbol === holding.symbol)?.price || 0) * holding.shares, 0);
        return total > 0 && (cryptoVal / total) < 0.3;
      }},
      { id: 'add-stable', label: 'Balance with a stable asset (bonds or index fund)', check: (h, stocks) => h.some(holding => ['Bonds','Index Fund'].includes(stocks.find(s => s.symbol === holding.symbol)?.sector)) },
    ],
    tips: [
      'Bitcoin (IBIT) has dropped 50-80% multiple times — size positions carefully',
      'Most advisors recommend keeping crypto under 5% of total portfolio',
      'Balance high-volatility crypto with stable assets like bonds (BND)',
      'IBIT and ETHE are SEC-regulated ETFs — safer than holding crypto directly'
    ],
    learningGoals: ['Cryptocurrency basics', 'Volatility management', 'Position sizing for high-risk assets', 'Balancing risk with stability']
  },
  {
    id: 'bond-basics',
    title: 'Bonds & Fixed Income Strategy',
    difficulty: 'Beginner',
    duration: '15 min',
    icon: '📜',
    assets: ['BND', 'TLT', 'HYG', 'SPY', 'AAPL', 'JNJ', 'VNQ'],
    description: 'Learn why bonds are the backbone of conservative portfolios. The AI tutor explains interest rates, yield, and how bonds protect you during stock market crashes.',
    briefing: 'Your AI tutor will teach you how bonds work and why every portfolio needs them. You\'ll learn the relationship between interest rates and bond prices, why government bonds are considered risk-free, and how high-yield bonds offer more income with more risk. I\'ll explain the role of each bond type as you invest.',
    startingBalance: 20000,
    objectives: [
      { id: 'buy-total-bond', label: 'Buy total bond market (BND)', check: (h) => h.some(holding => holding.symbol === 'BND') },
      { id: 'buy-treasury', label: 'Buy long-term treasuries (TLT)', check: (h) => h.some(holding => holding.symbol === 'TLT') },
      { id: 'buy-highyield', label: 'Try high-yield bonds (HYG)', check: (h) => h.some(holding => holding.symbol === 'HYG') },
      { id: 'add-equity', label: 'Add a stock/ETF for growth balance', check: (h, stocks) => h.some(holding => !['Bonds'].includes(stocks.find(s => s.symbol === holding.symbol)?.sector)) },
      { id: 'deploy', label: 'Invest at least 70% of capital', check: (h, stocks, balance) => balance <= 6000 },
    ],
    tips: [
      'BND provides broad bond market exposure — the safest starting point',
      'TLT (long-term treasury) is very sensitive to interest rate changes',
      'HYG offers 5.6% yield but carries more credit risk than government bonds',
      'Bonds typically rise when stocks fall — they are natural portfolio insurance'
    ],
    learningGoals: ['Bond fundamentals', 'Interest rate sensitivity', 'Yield vs. risk tradeoff', 'Bonds as portfolio insurance']
  },
  {
    id: 'forex-intro',
    title: 'Forex: Currency Markets Explained',
    difficulty: 'Advanced',
    duration: '18 min',
    icon: '💱',
    assets: ['UUP', 'FXE', 'FXY', 'VXUS', 'GLD', 'SPY'],
    description: 'Explore global currency markets through forex ETFs. The AI tutor teaches how currencies move, what drives the US Dollar, Euro, and Yen, and how forex hedging works.',
    briefing: 'Your AI tutor will introduce you to the world\'s largest market — the $7.5 trillion/day forex market. You\'ll learn what makes currencies strengthen or weaken, how interest rate differentials drive forex, and how international investors use currency positions to hedge risk.',
    startingBalance: 15000,
    objectives: [
      { id: 'buy-dollar', label: 'Buy US Dollar exposure (UUP)', check: (h) => h.some(holding => holding.symbol === 'UUP') },
      { id: 'buy-euro', label: 'Buy Euro exposure (FXE)', check: (h) => h.some(holding => holding.symbol === 'FXE') },
      { id: 'buy-yen', label: 'Buy Japanese Yen exposure (FXY)', check: (h) => h.some(holding => holding.symbol === 'FXY') },
      { id: 'add-intl', label: 'Add international stocks (VXUS) to see currency impact', check: (h) => h.some(holding => holding.symbol === 'VXUS') },
    ],
    tips: [
      'The US Dollar (UUP) typically strengthens when interest rates rise',
      'The Euro (FXE) reflects the Eurozone economy — watch ECB decisions',
      'The Yen (FXY) is considered a safe-haven currency during market turmoil',
      'Forex is the largest market in the world — $7.5 trillion traded daily'
    ],
    learningGoals: ['Currency markets', 'Interest rate and forex relationship', 'Safe haven currencies', 'Global diversification hedging']
  },
  {
    id: 'multi-asset',
    title: 'Multi-Asset Portfolio: The Complete Investor',
    difficulty: 'Advanced',
    duration: '25 min',
    icon: '🌍',
    assets: ['AAPL', 'MSFT', 'NVDA', 'JNJ', 'GLD', 'USO', 'BND', 'TLT', 'IBIT', 'VNQ', 'SPY', 'VXUS', 'UUP'],
    description: 'Build a portfolio spanning every asset class — stocks, bonds, commodities, real estate, and international markets. The AI tutor teaches institutional-level asset allocation.',
    briefing: 'Your AI tutor will teach you how professional fund managers build multi-asset portfolios. You\'ll invest across stocks, bonds, commodities, real estate, and international markets — learning why each asset class has a role and how they work together to reduce risk while maximizing returns.',
    startingBalance: 50000,
    objectives: [
      { id: 'buy-stock', label: 'Buy at least 2 individual stocks', check: (h, stocks) => h.filter(holding => ['Technology','Healthcare','Financial','Consumer Staples','Consumer Cyclical','Energy'].includes(stocks.find(s => s.symbol === holding.symbol)?.sector)).length >= 2 },
      { id: 'buy-bond', label: 'Add bond exposure (BND, TLT, or HYG)', check: (h, stocks) => h.some(holding => stocks.find(s => s.symbol === holding.symbol)?.sector === 'Bonds') },
      { id: 'buy-commodity', label: 'Add a commodity (GLD, SLV, USO, or CORN)', check: (h, stocks) => h.some(holding => stocks.find(s => s.symbol === holding.symbol)?.sector === 'Commodities') },
      { id: 'buy-reit', label: 'Add real estate (VNQ)', check: (h) => h.some(holding => holding.symbol === 'VNQ') },
      { id: 'buy-intl', label: 'Add international exposure (VXUS)', check: (h) => h.some(holding => holding.symbol === 'VXUS') },
      { id: 'six-assets', label: 'Own at least 6 different assets', check: (h) => h.length >= 6 },
      { id: 'deploy', label: 'Invest at least 80% of capital', check: (h, stocks, balance) => balance <= 10000 },
    ],
    tips: [
      'Institutional portfolios typically hold: 50-60% stocks, 20-30% bonds, 5-10% commodities, 5-10% real estate',
      'Gold (GLD) often rises when stocks fall — negative correlation is powerful',
      'International stocks (VXUS) give you exposure to 7,000+ companies outside the US',
      'Real estate (VNQ) provides income (3.95% yield) and inflation protection'
    ],
    learningGoals: ['Multi-asset allocation', 'Institutional portfolio design', 'Correlation and diversification', 'Global investing strategy']
  },
];

export const difficultyColors = {
  'Beginner': '#22c55e',
  'Intermediate': '#3b82f6',
  'Advanced': '#a855f7'
};
