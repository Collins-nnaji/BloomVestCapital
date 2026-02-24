export const lessons = [
  {
    id: 1,
    title: 'What Is Investing?',
    level: 'beginner',
    duration: '8 min',
    icon: '📚',
    description: 'Learn the fundamentals of investing, why it matters, and how it can help you build wealth over time.',
    content: [
      {
        heading: 'Why Invest?',
        text: 'Investing is the act of allocating money into assets — stocks, bonds, real estate, or funds — with the expectation that they will grow in value over time. Unlike saving, which preserves your money, investing puts it to work so it can outpace inflation and compound over the years.'
      },
      {
        heading: 'The Power of Compound Interest',
        text: 'Albert Einstein reportedly called compound interest the "eighth wonder of the world." When your investment earns returns, those returns also earn returns. A $10,000 investment growing at 8% annually becomes $21,589 in 10 years and $46,610 in 20 years — without adding a single dollar.'
      },
      {
        heading: 'Investing vs. Saving vs. Speculating',
        text: 'Saving means putting money aside in low-risk accounts like savings accounts. Investing means buying assets expected to appreciate over months or years. Speculating is making high-risk bets on short-term price movements. Successful wealth building relies primarily on disciplined investing.'
      }
    ],
    keyTakeaways: [
      'Investing helps your money grow faster than inflation',
      'Compound interest accelerates wealth building over time',
      'Start early — even small amounts grow significantly',
      'Investing is different from saving and speculating'
    ],
    quiz: [
      { question: 'What is the main advantage of investing over saving?', options: ['Higher risk', 'Potential for higher returns that outpace inflation', 'Guaranteed returns', 'Instant access to money'], answer: 1 },
      { question: 'What does compound interest mean?', options: ['Interest paid only on the original amount', 'Earning returns on your returns', 'A fixed interest rate', 'Interest that decreases over time'], answer: 1 },
      { question: 'A $10,000 investment at 8% annual return becomes approximately how much in 10 years?', options: ['$18,000', '$21,589', '$15,000', '$30,000'], answer: 1 }
    ]
  },
  {
    id: 2,
    title: 'Understanding the Stock Market',
    level: 'beginner',
    duration: '12 min',
    icon: '📈',
    description: 'Discover how the stock market works, what stocks represent, and how prices are determined.',
    content: [
      {
        heading: 'What Is a Stock?',
        text: 'A stock represents a share of ownership in a company. When you buy stock in Apple, you become a part-owner of Apple. Companies sell shares to raise money for growth, and investors buy shares expecting the company to become more valuable over time.'
      },
      {
        heading: 'How Stock Prices Move',
        text: 'Stock prices are driven by supply and demand. If more people want to buy a stock than sell it, the price rises. If more people want to sell, the price falls. Company earnings, economic conditions, interest rates, and investor sentiment all influence these decisions.'
      },
      {
        heading: 'Stock Exchanges and Indices',
        text: 'Stocks are traded on exchanges like the NYSE and NASDAQ. Market indices like the S&P 500 (top 500 US companies), Dow Jones (30 large companies), and NASDAQ Composite track the overall market performance and serve as benchmarks for investors.'
      }
    ],
    keyTakeaways: [
      'Stocks represent ownership in a company',
      'Prices move based on supply and demand',
      'Major indices like S&P 500 track overall market health',
      'Stock exchanges are regulated marketplaces for trading'
    ],
    quiz: [
      { question: 'What does owning a stock mean?', options: ['You lent money to a company', 'You own a portion of the company', 'You guaranteed returns from the company', 'You work for the company'], answer: 1 },
      { question: 'What primarily drives stock prices?', options: ['The company CEO', 'Government regulations only', 'Supply and demand', 'The stock exchange'], answer: 2 },
      { question: 'What does the S&P 500 track?', options: ['500 largest global companies', 'Top 500 US companies by market cap', '500 tech companies', '500 oldest companies'], answer: 1 }
    ]
  },
  {
    id: 3,
    title: 'Building Your First Portfolio',
    level: 'beginner',
    duration: '10 min',
    icon: '💼',
    description: 'Learn how to construct a diversified investment portfolio that matches your goals and risk tolerance.',
    content: [
      {
        heading: 'What Is a Portfolio?',
        text: 'An investment portfolio is your collection of financial assets — stocks, bonds, ETFs, cash, and other investments. Think of it as a basket that holds all your investments. A well-constructed portfolio balances growth potential with risk management.'
      },
      {
        heading: 'Diversification: Don\'t Put All Eggs in One Basket',
        text: 'Diversification means spreading your money across different types of investments, industries, and regions. If one investment drops 50%, but it\'s only 10% of your portfolio, your total loss is just 5%. A diversified portfolio might include US stocks, international stocks, bonds, and real estate.'
      },
      {
        heading: 'Asset Allocation by Age',
        text: 'A common rule of thumb is "110 minus your age = percentage in stocks." A 25-year-old might hold 85% stocks and 15% bonds. A 55-year-old might hold 55% stocks and 45% bonds. Younger investors can take more risk because they have more time to recover from market downturns.'
      }
    ],
    keyTakeaways: [
      'A portfolio is your collection of all investments',
      'Diversification reduces risk without eliminating returns',
      'Asset allocation should match your age and goals',
      'Rebalance periodically to maintain your target mix'
    ],
    quiz: [
      { question: 'What is diversification?', options: ['Buying only one type of stock', 'Spreading investments across different asset types', 'Investing all money at once', 'Only investing in bonds'], answer: 1 },
      { question: 'Using the "110 minus age" rule, what percentage should a 30-year-old have in stocks?', options: ['30%', '70%', '80%', '110%'], answer: 2 },
      { question: 'Why is diversification important?', options: ['It guarantees profits', 'It reduces overall portfolio risk', 'It eliminates all losses', 'It increases taxes'], answer: 1 }
    ]
  },
  {
    id: 4,
    title: 'Risk and Return',
    level: 'intermediate',
    duration: '10 min',
    icon: '⚖️',
    description: 'Understand the relationship between risk and return, and how to assess your own risk tolerance.',
    content: [
      {
        heading: 'The Risk-Return Tradeoff',
        text: 'In investing, higher potential returns come with higher risk. Savings accounts offer ~4% with almost no risk. Bonds offer 4-6% with moderate risk. Stocks have historically returned 8-10% annually but can lose 30-50% in bad years. Understanding this tradeoff is crucial for making informed decisions.'
      },
      {
        heading: 'Types of Investment Risk',
        text: 'Market risk affects all investments during downturns. Company-specific risk comes from individual business problems. Inflation risk erodes purchasing power. Interest rate risk affects bonds when rates change. Currency risk applies to international investments. Diversification helps mitigate many of these risks.'
      },
      {
        heading: 'Assessing Your Risk Tolerance',
        text: 'Your risk tolerance depends on your time horizon, financial goals, income stability, and emotional comfort with volatility. If a 20% portfolio drop would cause you to panic-sell, you need a more conservative allocation. Honest self-assessment prevents costly emotional decisions.'
      }
    ],
    keyTakeaways: [
      'Higher returns require accepting higher risk',
      'Multiple types of risk affect investments differently',
      'Diversification reduces but doesn\'t eliminate risk',
      'Know your risk tolerance before investing'
    ],
    quiz: [
      { question: 'Which typically offers the highest long-term returns?', options: ['Savings accounts', 'Government bonds', 'Stocks', 'Certificates of deposit'], answer: 2 },
      { question: 'What is market risk?', options: ['Risk that one company fails', 'Risk that the overall market declines', 'Risk of inflation', 'Risk of currency changes'], answer: 1 },
      { question: 'What should you consider when assessing risk tolerance?', options: ['Only your age', 'Only your income', 'Time horizon, goals, income, and emotional comfort', 'Only what your friends invest in'], answer: 2 }
    ]
  },
  {
    id: 5,
    title: 'ETFs and Index Funds',
    level: 'intermediate',
    duration: '9 min',
    icon: '🏦',
    description: 'Learn about the most popular investment vehicles for building a diversified portfolio efficiently.',
    content: [
      {
        heading: 'What Are ETFs and Index Funds?',
        text: 'Exchange-Traded Funds (ETFs) and index funds are collections of investments bundled together. Instead of buying 500 individual stocks, you can buy one S&P 500 index fund to own a piece of all 500 companies. ETFs trade like stocks throughout the day; index funds (mutual funds) trade once daily at market close.'
      },
      {
        heading: 'Why Index Funds Win',
        text: 'Over 15-year periods, roughly 90% of actively managed funds underperform the S&P 500 index. Index funds charge much lower fees (0.03-0.20% vs 1-2% for active funds). This fee difference alone can cost hundreds of thousands of dollars over a career of investing. Warren Buffett recommends index funds for most investors.'
      },
      {
        heading: 'Building a Portfolio with ETFs',
        text: 'A simple but effective portfolio: VTI (US total market), VXUS (international stocks), BND (US bonds). Three funds give you exposure to thousands of companies worldwide. This "three-fund portfolio" is recommended by many financial advisors for its simplicity and effectiveness.'
      }
    ],
    keyTakeaways: [
      'ETFs and index funds provide instant diversification',
      'Most active managers underperform index funds long-term',
      'Low fees compound into huge savings over decades',
      'A three-fund portfolio covers the global market'
    ],
    quiz: [
      { question: 'What is an ETF?', options: ['A single stock', 'A bundle of investments that trades like a stock', 'A savings account', 'A type of bond'], answer: 1 },
      { question: 'Over 15 years, what percentage of active funds underperform the S&P 500?', options: ['About 50%', 'About 70%', 'About 90%', 'About 10%'], answer: 2 },
      { question: 'What is the "three-fund portfolio"?', options: ['Three individual stocks', 'US stocks + international stocks + bonds', 'Three savings accounts', 'Three crypto coins'], answer: 1 }
    ]
  },
  {
    id: 6,
    title: 'Reading Financial Statements',
    level: 'intermediate',
    duration: '15 min',
    icon: '📊',
    description: 'Master the fundamentals of analyzing company financial statements to make informed investment decisions.',
    content: [
      {
        heading: 'The Three Key Financial Statements',
        text: 'Every public company publishes three main financial statements quarterly. The Income Statement shows revenue and profit over a period. The Balance Sheet shows assets, liabilities, and equity at a point in time. The Cash Flow Statement shows actual money moving in and out. Together, they tell the full financial story.'
      },
      {
        heading: 'Key Metrics to Watch',
        text: 'Revenue growth shows if a company is expanding. Profit margin shows how efficiently it turns revenue into profit. P/E ratio (Price/Earnings) compares stock price to earnings — a P/E of 20 means investors pay $20 for every $1 of earnings. Debt-to-equity ratio shows how leveraged the company is.'
      },
      {
        heading: 'Red Flags to Watch For',
        text: 'Declining revenue over multiple quarters signals trouble. Growing debt faster than revenue is unsustainable. Negative cash flow despite reported profits may indicate accounting manipulation. Management frequently missing their own guidance erodes trust. Always look at the trend, not just a single quarter.'
      }
    ],
    keyTakeaways: [
      'Three statements: income, balance sheet, cash flow',
      'Track revenue growth, margins, P/E ratio, and debt levels',
      'Trends matter more than single data points',
      'Red flags include declining revenue and growing debt'
    ],
    quiz: [
      { question: 'Which statement shows a company\'s revenue and profit?', options: ['Balance Sheet', 'Income Statement', 'Cash Flow Statement', 'Tax Return'], answer: 1 },
      { question: 'A P/E ratio of 25 means investors pay ____ for every $1 of earnings', options: ['$2.50', '$25', '$250', '$0.25'], answer: 1 },
      { question: 'Which is a red flag in financial statements?', options: ['Growing revenue', 'Positive cash flow', 'Declining revenue with growing debt', 'Increasing profit margins'], answer: 2 }
    ]
  },
  {
    id: 7,
    title: 'Advanced Portfolio Strategies',
    level: 'advanced',
    duration: '14 min',
    icon: '🎯',
    description: 'Explore advanced strategies like value investing, growth investing, and factor-based approaches.',
    content: [
      {
        heading: 'Value vs. Growth Investing',
        text: 'Value investors seek underpriced stocks trading below their intrinsic worth — like buying a $1 bill for $0.70. Growth investors seek companies with exceptional revenue and earnings growth potential, willing to pay premium prices. Historically, value outperforms long-term but growth dominates certain decades (like 2010-2020).'
      },
      {
        heading: 'Factor-Based Investing',
        text: 'Academic research identifies factors that drive returns: Value (cheap stocks outperform), Size (small caps outperform large), Momentum (recent winners keep winning), Quality (profitable companies outperform), and Low Volatility (less volatile stocks offer better risk-adjusted returns). Factor ETFs let you tilt your portfolio toward these premiums.'
      },
      {
        heading: 'Dollar-Cost Averaging vs. Lump Sum',
        text: 'Dollar-cost averaging (DCA) means investing fixed amounts at regular intervals regardless of price. Lump-sum investing means investing all at once. Studies show lump-sum wins ~67% of the time because markets tend to rise. But DCA reduces regret risk and is psychologically easier. Both beat not investing at all.'
      }
    ],
    keyTakeaways: [
      'Value and growth are complementary strategies',
      'Academic factors (value, size, momentum) can enhance returns',
      'Lump sum statistically beats DCA but DCA reduces regret',
      'No single strategy works in all market conditions'
    ],
    quiz: [
      { question: 'What do value investors look for?', options: ['Trendy companies', 'Stocks trading below intrinsic value', 'The most expensive stocks', 'Only tech companies'], answer: 1 },
      { question: 'Which is NOT a recognized investment factor?', options: ['Value', 'Momentum', 'Popularity', 'Quality'], answer: 2 },
      { question: 'How often does lump-sum beat dollar-cost averaging?', options: ['About 50%', 'About 67%', 'About 90%', 'Never'], answer: 1 }
    ]
  },
  {
    id: 8,
    title: 'Market Psychology & Behavioral Finance',
    level: 'advanced',
    duration: '12 min',
    icon: '🧠',
    description: 'Understand the psychological biases that cause investors to make costly mistakes.',
    content: [
      {
        heading: 'Common Cognitive Biases',
        text: 'Loss aversion makes losses feel twice as painful as equivalent gains feel good, leading to panic selling. Confirmation bias makes you seek information that confirms what you already believe. Recency bias makes you overweight recent events — after a crash, you think stocks will never recover; during a boom, you think they\'ll never fall.'
      },
      {
        heading: 'Herd Mentality and FOMO',
        text: 'Humans are social creatures. When everyone is buying crypto or meme stocks, FOMO (Fear Of Missing Out) kicks in. This is exactly when prices are usually highest. Warren Buffett advises to "be fearful when others are greedy, and greedy when others are fearful." The best buying opportunities often feel the scariest.'
      },
      {
        heading: 'Building an Emotion-Proof System',
        text: 'Create an Investment Policy Statement (IPS) that defines your strategy, allocation, and rebalancing rules. Automate investments so you don\'t have to make decisions during volatile markets. Review your portfolio quarterly, not daily. Having a written plan prevents emotional decision-making during market turbulence.'
      }
    ],
    keyTakeaways: [
      'Loss aversion, confirmation bias, and recency bias hurt returns',
      'FOMO and herd mentality lead to buying high',
      'Automate investing to remove emotional decisions',
      'A written investment policy prevents panic moves'
    ],
    quiz: [
      { question: 'What is loss aversion?', options: ['Fear of all investing', 'Losses feeling more painful than equivalent gains feel good', 'Avoiding the stock market', 'Only investing in safe assets'], answer: 1 },
      { question: 'When does Warren Buffett suggest being greedy?', options: ['When everyone is buying', 'When stocks hit all-time highs', 'When others are fearful', 'At the end of the year'], answer: 2 },
      { question: 'What helps prevent emotional investing?', options: ['Checking stocks hourly', 'Following social media tips', 'A written investment policy and automated investing', 'Day trading'], answer: 2 }
    ]
  }
];

export const levelInfo = {
  beginner: { label: 'Beginner', color: '#22c55e', description: 'Start your investment journey' },
  intermediate: { label: 'Intermediate', color: '#f59e0b', description: 'Deepen your knowledge' },
  advanced: { label: 'Advanced', color: '#ef4444', description: 'Master advanced strategies' }
};
