export const scenarios = [
  {
    id: 'first-investment',
    title: 'Your First $10,000 Investment',
    difficulty: 'Beginner',
    duration: '15 min',
    icon: '🌱',
    description: 'You just received $10,000 and want to start investing. Build a diversified portfolio from scratch using the demo trading simulator.',
    objectives: [
      'Allocate $10,000 across at least 3 different stocks',
      'Include stocks from at least 2 different sectors',
      'Keep no more than 30% in any single stock',
      'Aim for a mix of growth and stable dividend stocks'
    ],
    startingBalance: 10000,
    tips: [
      'Diversify across sectors to reduce risk',
      'Consider a mix of large-cap stable stocks and growth stocks',
      'Don\'t put all your money in one stock',
      'Think about your risk tolerance before investing'
    ],
    learningGoals: ['Portfolio diversification', 'Sector allocation', 'Risk management basics']
  },
  {
    id: 'market-crash',
    title: 'Surviving a Market Crash',
    difficulty: 'Intermediate',
    icon: '📉',
    duration: '20 min',
    description: 'The market just dropped 25%. You have an existing portfolio. Do you sell, hold, or buy more? Navigate a simulated crash scenario.',
    objectives: [
      'Review your portfolio after a 25% market decline',
      'Decide which positions to hold, sell, or add to',
      'Rebalance your portfolio for recovery',
      'Avoid panic selling quality investments'
    ],
    startingBalance: 50000,
    tips: [
      'History shows markets always recover from crashes',
      'Quality companies with strong balance sheets survive downturns',
      'Panic selling locks in losses permanently',
      'Crashes create buying opportunities for long-term investors'
    ],
    learningGoals: ['Crisis management', 'Emotional discipline', 'Rebalancing strategies']
  },
  {
    id: 'dividend-income',
    title: 'Building a Dividend Income Portfolio',
    difficulty: 'Intermediate',
    icon: '💰',
    duration: '20 min',
    description: 'Create a portfolio focused on generating passive income through dividends. Target $1,000/year in dividend income.',
    objectives: [
      'Select dividend-paying stocks with yields above 2%',
      'Diversify across at least 4 sectors',
      'Calculate your expected annual dividend income',
      'Balance yield with dividend growth potential'
    ],
    startingBalance: 25000,
    tips: [
      'Higher yield doesn\'t always mean better — check dividend sustainability',
      'Look for companies with a track record of increasing dividends',
      'REITs and utilities tend to offer higher dividends',
      'Dividend aristocrats have increased dividends for 25+ consecutive years'
    ],
    learningGoals: ['Dividend investing', 'Income generation', 'Yield analysis']
  },
  {
    id: 'tech-vs-value',
    title: 'Growth vs. Value: Pick Your Strategy',
    difficulty: 'Advanced',
    icon: '⚔️',
    duration: '25 min',
    description: 'Split your capital between a growth portfolio and a value portfolio. Compare returns and learn when each strategy shines.',
    objectives: [
      'Create a growth-focused portfolio with half your capital',
      'Create a value-focused portfolio with the other half',
      'Analyze P/E ratios to classify stocks',
      'Compare the risk-return profile of each approach'
    ],
    startingBalance: 40000,
    tips: [
      'Growth stocks typically have high P/E ratios (>30)',
      'Value stocks usually have lower P/E ratios (<20) and pay dividends',
      'Growth stocks are more volatile but can offer higher upside',
      'Value stocks provide stability and income during downturns'
    ],
    learningGoals: ['Growth investing', 'Value investing', 'Strategy comparison']
  },
  {
    id: 'retirement-planning',
    title: 'Plan Your Retirement Portfolio',
    difficulty: 'Advanced',
    icon: '🏖️',
    duration: '25 min',
    description: 'You\'re 30 years old with $50,000 to invest for retirement at 65. Build a portfolio that balances growth with increasing stability over time.',
    objectives: [
      'Create an age-appropriate asset allocation',
      'Include both growth and income investments',
      'Plan for gradual shift to more conservative allocation',
      'Calculate projected portfolio value at retirement'
    ],
    startingBalance: 50000,
    tips: [
      'Use the "110 minus age" rule as a starting point for stock allocation',
      'Early years should focus on growth to maximize compounding',
      'Gradually increase bond/stable allocation as retirement approaches',
      'Don\'t forget to account for inflation in your projections'
    ],
    learningGoals: ['Retirement planning', 'Long-term strategy', 'Asset allocation']
  }
];

export const difficultyColors = {
  'Beginner': '#22c55e',
  'Intermediate': '#f59e0b',
  'Advanced': '#ef4444'
};
