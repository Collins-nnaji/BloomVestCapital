require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seedPro() {
  try {
    console.log('🚀 Starting PRO courses seed...\n');

    // Ensure is_pro column exists
    console.log('Ensuring is_pro column exists on courses table...');
    await pool.query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;');
    console.log('✅ is_pro column ready.\n');

    // =====================================================
    // PRO COURSE 1: Options & Derivatives Trading
    // =====================================================
    console.log('📚 Inserting PRO Course 1: Options & Derivatives Trading...');
    const course1 = await pool.query(
      `INSERT INTO courses (title, description, level, icon, color, sort_order, is_pro)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        'Options & Derivatives Trading',
        'Master options trading from calls and puts to complex multi-leg strategies. Learn how derivatives work, how to hedge risk, and generate income through options.',
        'advanced',
        '📑',
        '#dc2626',
        8,
        true,
      ]
    );
    const course1Id = course1.rows[0].id;

    // Module 16: Options Fundamentals
    console.log('  📦 Module 16: Options Fundamentals');
    const mod16 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course1Id,
        'Options Fundamentals',
        'Understand the building blocks of options trading — from basic calls and puts to the Greeks that drive pricing',
        16,
      ]
    );
    const mod16Id = mod16.rows[0].id;

    // Lesson 1: What Are Options? Calls & Puts Explained
    console.log('    📝 Lesson: What Are Options? Calls & Puts Explained');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod16Id,
        'What Are Options? Calls & Puts Explained',
        'Learn the fundamentals of options contracts including calls, puts, strike prices, and expiration dates.',
        '15 min',
        '📑',
        JSON.stringify([
          {
            heading: 'What Is an Options Contract?',
            text: 'An options contract is a financial derivative that gives the buyer the right, but not the obligation, to buy or sell an underlying asset at a specified price before a certain date. Unlike buying stock directly, options let you control shares for a fraction of the cost, making them powerful tools for leverage. Each standard options contract represents 100 shares of the underlying stock. Options are traded on exchanges just like stocks, with bid-ask spreads and market makers providing liquidity.',
          },
          {
            heading: 'Calls vs. Puts: The Two Types',
            text: 'A call option gives the holder the right to buy 100 shares at the strike price before expiration — you buy calls when you expect the price to rise. A put option gives the holder the right to sell 100 shares at the strike price — you buy puts when you expect the price to fall. For example, buying a $150 call on Apple means you can purchase 100 AAPL shares at $150 each regardless of the market price. Conversely, buying a $150 put means you can sell at $150 even if the stock drops to $120.',
          },
          {
            heading: 'Strike Price and Expiration',
            text: 'The strike price is the predetermined price at which the option can be exercised — it is the core variable that determines an option\'s value relative to the current stock price. Expiration date is when the contract expires and becomes worthless if not exercised or sold. Options can be weekly (expiring every Friday), monthly (third Friday of each month), or LEAPS (long-term options expiring up to 2-3 years out). Choosing the right strike and expiration is one of the most critical decisions in options trading.',
          },
          {
            heading: 'Premium: The Price of an Option',
            text: 'The premium is the price you pay to buy an options contract, and it is composed of two parts: intrinsic value and time value. Intrinsic value is the amount the option is in-the-money — for a call, it is the stock price minus the strike price. Time value represents the additional premium paid for the possibility that the option could become more valuable before expiration. As expiration approaches, time value decays (a concept called theta decay), which is why options are sometimes called "wasting assets."',
          },
          {
            heading: 'Intrinsic Value vs. Time Value',
            text: 'An option is in-the-money (ITM) when it has intrinsic value — a call is ITM when the stock is above the strike, and a put is ITM when the stock is below the strike. An out-of-the-money (OTM) option has zero intrinsic value and consists entirely of time value. At-the-money (ATM) options, where the strike equals the stock price, typically have the highest time value. Understanding this breakdown helps you evaluate whether an option is fairly priced and what you are actually paying for.',
          },
        ]),
        JSON.stringify([
          'An options contract gives you the right, but not the obligation, to buy or sell at a set price.',
          'Call options profit when prices rise; put options profit when prices fall.',
          'The strike price and expiration date are the two key parameters of any option.',
          'Option premiums consist of intrinsic value (real value) and time value (possibility value).',
          'Each standard options contract controls 100 shares of the underlying stock.',
        ]),
        JSON.stringify([
          {
            question: 'What does a call option give the buyer the right to do?',
            options: [
              'Sell shares at the strike price',
              'Buy shares at the strike price',
              'Short sell the underlying stock',
              'Lend shares to other investors',
            ],
            answer: 1,
          },
          {
            question: 'How many shares does one standard options contract represent?',
            options: ['10 shares', '50 shares', '100 shares', '1000 shares'],
            answer: 2,
          },
          {
            question: 'What is intrinsic value for an in-the-money call option?',
            options: [
              'The premium paid minus the commission',
              'The time remaining until expiration',
              'The stock price minus the strike price',
              'The implied volatility of the option',
            ],
            answer: 2,
          },
          {
            question: 'What happens to time value as an option approaches expiration?',
            options: [
              'It increases exponentially',
              'It remains constant',
              'It decays toward zero',
              'It converts to intrinsic value',
            ],
            answer: 2,
          },
        ]),
        1,
      ]
    );

    // Lesson 2: Options Pricing & The Greeks
    console.log('    📝 Lesson: Options Pricing & The Greeks');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod16Id,
        'Options Pricing & The Greeks',
        'Understand how options are priced using the Greeks — Delta, Gamma, Theta, and Vega — and how implied volatility impacts premiums.',
        '18 min',
        '🔢',
        JSON.stringify([
          {
            heading: 'Delta: Directional Sensitivity',
            text: 'Delta measures how much an option\'s price changes for every $1 move in the underlying stock. A call option with a delta of 0.50 will gain $0.50 when the stock rises $1. Delta ranges from 0 to 1 for calls and 0 to -1 for puts — the closer to 1 (or -1), the more the option behaves like owning (or shorting) the stock itself. Delta also serves as a rough probability estimate: a 0.30 delta call has approximately a 30% chance of expiring in-the-money.',
          },
          {
            heading: 'Gamma: The Rate of Change of Delta',
            text: 'Gamma measures how much delta changes when the stock moves $1 — it is the "acceleration" of an option\'s price movement. Options that are at-the-money have the highest gamma, meaning their delta changes the most rapidly with stock movements. High gamma is desirable for option buyers because it means profits accelerate as the trade moves in your favor. For option sellers, high gamma is risky because losses can accelerate quickly if the stock moves against the position.',
          },
          {
            heading: 'Theta: Time Decay',
            text: 'Theta measures how much value an option loses each day due to the passage of time, all else being equal. A theta of -0.05 means the option loses $5 per day (per contract) in time value. Time decay accelerates as expiration approaches — an option loses more time value in its final weeks than in its first months. This is why option sellers love theta: they profit from the relentless erosion of time value, while option buyers must overcome theta decay to profit.',
          },
          {
            heading: 'Vega: Volatility Sensitivity',
            text: 'Vega measures how much an option\'s price changes for each 1% change in implied volatility. High vega means the option is very sensitive to changes in market expectations of future volatility. When implied volatility rises (such as before earnings announcements), option premiums increase even if the stock hasn\'t moved. Understanding vega is crucial for timing your trades — buying options when IV is low and selling when IV is high is a core edge in options trading.',
          },
          {
            heading: 'Implied Volatility and Option Pricing',
            text: 'Implied volatility (IV) represents the market\'s expectation of how much the stock will move in the future, and it is the single most important factor in option pricing beyond the stock price itself. High IV means expensive options; low IV means cheap options. The concept of "IV rank" and "IV percentile" helps traders determine whether current volatility is relatively high or low compared to the past year. Buying options when IV is elevated (like right before earnings) often leads to losses even when you guess the direction correctly, because the post-event IV collapse (called "IV crush") destroys the premium.',
          },
        ]),
        JSON.stringify([
          'Delta tells you how much the option moves per $1 change in the stock and approximates the probability of expiring ITM.',
          'Gamma measures how fast delta changes — at-the-money options have the highest gamma.',
          'Theta is time decay: options lose value every day, accelerating near expiration.',
          'Vega captures sensitivity to changes in implied volatility — higher IV means pricier options.',
          'IV crush after events like earnings can destroy option value even if the stock moves in your direction.',
        ]),
        JSON.stringify([
          {
            question: 'A call option has a delta of 0.60. If the stock rises by $2, approximately how much does the option price increase?',
            options: ['$0.60', '$1.20', '$2.00', '$0.30'],
            answer: 1,
          },
          {
            question: 'Which Greek measures the daily loss in option value due to time passing?',
            options: ['Delta', 'Gamma', 'Theta', 'Vega'],
            answer: 2,
          },
          {
            question: 'What is IV crush?',
            options: [
              'When intrinsic value suddenly drops to zero',
              'A rapid decline in implied volatility after an anticipated event',
              'When gamma causes delta to invert',
              'A margin call triggered by high vega',
            ],
            answer: 1,
          },
          {
            question: 'Which options have the highest gamma?',
            options: [
              'Deep in-the-money options',
              'Deep out-of-the-money options',
              'At-the-money options near expiration',
              'LEAPS with long expiration dates',
            ],
            answer: 2,
          },
        ]),
        2,
      ]
    );

    // Lesson 3: Buying vs. Selling Options
    console.log('    📝 Lesson: Buying vs. Selling Options');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod16Id,
        'Buying vs. Selling Options',
        'Compare the risk profiles of buying and selling options, including covered vs naked positions and margin requirements.',
        '16 min',
        '⚖️',
        JSON.stringify([
          {
            heading: 'Buying Options: Limited Risk, Unlimited Potential',
            text: 'When you buy (go long) an option, your maximum loss is limited to the premium you paid — you can never lose more than your initial investment. A long call has theoretically unlimited profit potential as the stock can rise indefinitely, while a long put profits as the stock falls toward zero. The tradeoff is that you are fighting time decay every day, so you need the stock to move enough in your direction, fast enough, to overcome the erosion of time value. Statistics show that a majority of options expire worthless, which is why buying options requires discipline in position sizing.',
          },
          {
            heading: 'Selling Options: Collecting Premium',
            text: 'When you sell (write) an option, you collect the premium upfront and profit if the option expires worthless or loses value. Option sellers have the advantage of time decay working in their favor — theta is their friend. However, selling options carries significant risk: a naked call seller faces theoretically unlimited losses if the stock rises sharply, and a naked put seller could lose substantially if the stock drops to zero. This asymmetric risk profile is why most brokerages require high margin levels and experience qualifications for selling naked options.',
          },
          {
            heading: 'Covered vs. Naked Positions',
            text: 'A covered position means you own the underlying asset that backs your option obligation — for example, selling a call while owning 100 shares of the stock. This limits your risk because if the option is exercised, you simply deliver your shares. A naked position means you have no underlying shares, exposing you to potentially catastrophic losses. Covered calls are considered conservative strategies suitable for most investors, while naked options are speculative and require deep options knowledge. Most beginners should start with covered strategies before considering any naked positions.',
          },
          {
            heading: 'Margin Requirements and Risk Management',
            text: 'Selling options typically requires a margin account, and your broker will hold collateral (margin) to ensure you can fulfill your obligations. Margin requirements vary by strategy: covered calls require holding the shares, cash-secured puts require holding enough cash to buy the shares, and naked options require a percentage of the underlying value plus the premium received. Understanding your broker\'s margin rules is essential because a margin call can force you to close positions at the worst possible time. Always know your maximum loss before entering any options trade.',
          },
        ]),
        JSON.stringify([
          'Buying options limits your loss to the premium paid but requires the stock to move fast enough to overcome time decay.',
          'Selling options puts time decay in your favor but can carry unlimited risk with naked positions.',
          'Covered positions (owning the underlying stock) are safer than naked positions.',
          'Margin requirements vary by strategy and determine how much capital your broker holds as collateral.',
          'Most options expire worthless, which statistically favors sellers over buyers.',
        ]),
        JSON.stringify([
          {
            question: 'What is the maximum loss when buying a call option?',
            options: [
              'The current stock price',
              'The premium paid for the option',
              'Unlimited',
              'The strike price minus the stock price',
            ],
            answer: 1,
          },
          {
            question: 'Why is selling naked call options considered very risky?',
            options: [
              'Because the premium collected is always small',
              'Because the stock can theoretically rise infinitely, creating unlimited loss potential',
              'Because naked calls expire faster than covered calls',
              'Because naked calls have no time value',
            ],
            answer: 1,
          },
          {
            question: 'What makes a call option "covered"?',
            options: [
              'The seller also bought a put option for protection',
              'The seller owns the underlying shares',
              'The option has insurance through the exchange',
              'The option is traded on a regulated exchange',
            ],
            answer: 1,
          },
          {
            question: 'Who benefits from time decay (theta)?',
            options: [
              'Option buyers',
              'Option sellers',
              'Both equally',
              'Neither — theta only affects at expiration',
            ],
            answer: 1,
          },
        ]),
        3,
      ]
    );

    // Lesson 4: Reading an Options Chain
    console.log('    📝 Lesson: Reading an Options Chain');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod16Id,
        'Reading an Options Chain',
        'Learn how to interpret real options chains including open interest, volume, bid-ask spreads, and moneyness.',
        '14 min',
        '🔗',
        JSON.stringify([
          {
            heading: 'Anatomy of an Options Chain',
            text: 'An options chain is a table that displays all available options contracts for a given stock, organized by expiration date and strike price. Calls are typically shown on the left side and puts on the right, with strike prices running down the center column. Each row shows the bid price, ask price, last traded price, volume, and open interest for that specific contract. Learning to read an options chain fluently is like learning to read a financial statement — it is the foundational skill every options trader needs.',
          },
          {
            heading: 'Open Interest and Volume',
            text: 'Volume represents the number of contracts traded during the current session, while open interest shows the total number of outstanding contracts that have not been closed or exercised. High open interest at a particular strike indicates a popular price level where many traders have positions, and these levels often act as magnets for the stock price near expiration. A surge in volume relative to open interest can signal new money flowing into that contract, potentially indicating institutional activity or a large directional bet. Traders generally prefer options with higher open interest because they offer better liquidity and tighter bid-ask spreads.',
          },
          {
            heading: 'The Bid-Ask Spread',
            text: 'The bid price is the highest price a buyer is willing to pay for an option, while the ask price is the lowest price a seller will accept. The difference between the two is the bid-ask spread, and it represents a hidden cost of trading options. Liquid options on popular stocks like AAPL or SPY might have spreads of just a few cents, while illiquid options on small-cap stocks can have spreads of $0.50 or more. Always use limit orders rather than market orders when trading options, because a wide bid-ask spread combined with a market order can instantly cost you 5-10% of your premium.',
          },
          {
            heading: 'In-the-Money, At-the-Money, Out-of-the-Money',
            text: 'On an options chain, contracts are color-coded or shaded to indicate their moneyness relative to the current stock price. In-the-money (ITM) calls have strike prices below the stock price, while ITM puts have strikes above it — these options have intrinsic value. At-the-money (ATM) options have strikes closest to the current stock price and typically have the highest time value. Out-of-the-money (OTM) options are cheaper because they consist entirely of time value, but they require a larger stock move to become profitable.',
          },
          {
            heading: 'Choosing the Right Contract',
            text: 'Selecting the best option from a chain involves balancing strike price, expiration, premium cost, and liquidity. Near-the-money options offer the best balance of cost and probability, while deep OTM options are cheap but rarely profitable. Longer expirations give you more time for the trade to work but cost more in premium. A practical starting approach is to look for options with at least 30-45 days to expiration, strikes near the current stock price, open interest above 500, and bid-ask spreads under $0.20 — these parameters ensure adequate liquidity and a reasonable probability of success.',
          },
        ]),
        JSON.stringify([
          'An options chain shows all available contracts organized by expiration and strike price.',
          'High open interest signals popular strike levels with good liquidity.',
          'The bid-ask spread is a hidden cost — always use limit orders when trading options.',
          'In-the-money options have intrinsic value while out-of-the-money options are pure time value.',
          'Choose options with adequate liquidity (OI > 500) and tight spreads for better execution.',
        ]),
        JSON.stringify([
          {
            question: 'What does open interest represent in an options chain?',
            options: [
              'The number of contracts traded today',
              'The total number of outstanding contracts not yet closed or exercised',
              'The interest rate used to price the option',
              'The number of market makers for that option',
            ],
            answer: 1,
          },
          {
            question: 'Why should you use limit orders instead of market orders for options?',
            options: [
              'Market orders are not allowed for options',
              'Limit orders execute faster than market orders',
              'Wide bid-ask spreads can cause poor fills with market orders',
              'Limit orders have lower commissions',
            ],
            answer: 2,
          },
          {
            question: 'A stock trades at $150. Which call option is in-the-money?',
            options: [
              '$155 strike call',
              '$160 strike call',
              '$145 strike call',
              '$150 strike call',
            ],
            answer: 2,
          },
          {
            question: 'What is a good minimum open interest to look for when selecting an options contract?',
            options: ['10', '50', '100', '500'],
            answer: 3,
          },
        ]),
        4,
      ]
    );

    // Module 17: Options Strategies
    console.log('  📦 Module 17: Options Strategies');
    const mod17 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course1Id,
        'Options Strategies',
        'Learn proven options strategies from covered calls to iron condors to generate income and manage risk',
        17,
      ]
    );
    const mod17Id = mod17.rows[0].id;

    // Lesson 1: Covered Calls
    console.log('    📝 Lesson: Covered Calls: Income on Stocks You Own');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod17Id,
        'Covered Calls: Income on Stocks You Own',
        'Learn how to generate income from stocks you already own by selling covered call options.',
        '16 min',
        '💰',
        JSON.stringify([
          {
            heading: 'How Covered Calls Work',
            text: 'A covered call involves owning 100 shares of a stock and selling one call option against those shares. You collect the premium immediately, which is yours to keep regardless of what happens next. If the stock stays below the strike price at expiration, the option expires worthless and you keep both the shares and the premium — free income. If the stock rises above the strike, your shares are "called away" (sold at the strike price), and you keep the premium plus any appreciation up to the strike.',
          },
          {
            heading: 'Selecting Strike Price and Expiration',
            text: 'The strike price you choose represents the maximum price at which you are willing to sell your shares. Selecting a strike 5-10% above the current price (out-of-the-money) gives the stock room to appreciate while still collecting a meaningful premium. Most covered call sellers use 30-45 day expirations because theta decay accelerates in the final month, maximizing premium income relative to time. For example, selling a $160 call on AAPL when it trades at $150 with 30 days to expiration might collect $3 per share ($300 per contract), giving you a 2% monthly return.',
          },
          {
            heading: 'Rolling Covered Calls',
            text: 'If the stock price approaches your strike near expiration, you can "roll" the position by buying back the current option and selling a new one with a later expiration and/or higher strike. Rolling up and out extends the trade while capturing additional premium and giving you a higher potential selling price. For example, if you sold a $160 call that is now deep in-the-money with AAPL at $165, you could buy it back and sell a $170 call expiring next month. This technique allows you to manage assignments and continue generating income without giving up your shares prematurely.',
          },
          {
            heading: 'Real-World Example with AAPL',
            text: 'Suppose you own 100 shares of Apple at $150 per share ($15,000 investment) and sell a $160 call expiring in 30 days for $3.00 ($300 premium). If AAPL stays below $160, you keep $300 — a 2% return in one month or about 24% annualized. If AAPL rises to $170, your shares are called away at $160 for a $1,000 gain plus the $300 premium — a solid $1,300 total profit (8.7%). You miss out on $1,000 of additional upside, which is the key tradeoff of the covered call strategy.',
          },
          {
            heading: 'Risks and Tradeoffs',
            text: 'The main risk of covered calls is capping your upside — if the stock rallies significantly, you miss the gains above the strike price. The premium provides a small cushion on the downside, but it does not protect against large drops in the stock price. Covered calls work best on stocks you plan to hold long-term in range-bound or slowly rising markets. Avoid selling covered calls before earnings announcements or other catalysts where a big upside move is possible, as this is precisely when you want to benefit from the full move.',
          },
        ]),
        JSON.stringify([
          'Covered calls generate income by selling call options on shares you already own.',
          'OTM strikes 5-10% above the current price balance income potential with upside room.',
          '30-45 day expirations optimize theta decay and premium collection.',
          'Rolling options lets you avoid assignment and continue generating income.',
          'The main tradeoff is capping your upside in exchange for premium income.',
        ]),
        JSON.stringify([
          {
            question: 'What do you need to own to sell a covered call?',
            options: [
              'A put option on the same stock',
              'At least 100 shares of the underlying stock',
              'A margin account with sufficient buying power',
              'Another call option at a different strike',
            ],
            answer: 1,
          },
          {
            question: 'What happens if the stock price is below the strike price at expiration?',
            options: [
              'You must buy more shares',
              'The option is exercised and your shares are sold',
              'The option expires worthless and you keep the premium and shares',
              'You owe the difference to the option buyer',
            ],
            answer: 2,
          },
          {
            question: 'What does "rolling" a covered call mean?',
            options: [
              'Selling your underlying shares at market price',
              'Buying back the current option and selling a new one with a later expiration',
              'Converting a call option into a put option',
              'Exercising the option early',
            ],
            answer: 1,
          },
          {
            question: 'What is the primary tradeoff of selling covered calls?',
            options: [
              'You must pay high margin fees',
              'Your upside is capped at the strike price',
              'You lose the premium if the stock rises',
              'You cannot sell the underlying shares for a year',
            ],
            answer: 1,
          },
        ]),
        1,
      ]
    );

    // Lesson 2: Protective Puts
    console.log('    📝 Lesson: Protective Puts: Portfolio Insurance');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod17Id,
        'Protective Puts: Portfolio Insurance',
        'Learn how to hedge your portfolio downside risk using protective put options and collar strategies.',
        '15 min',
        '🛡️',
        JSON.stringify([
          {
            heading: 'How Protective Puts Work',
            text: 'A protective put involves buying a put option on a stock you own to establish a "floor" price below which you cannot lose. It functions exactly like insurance: you pay a premium to protect against a catastrophic loss. If the stock drops below the put strike price, the put gains value dollar-for-dollar, offsetting your stock losses. Your maximum loss is limited to the difference between your stock purchase price and the put strike, plus the premium paid.',
          },
          {
            heading: 'The Cost of Protection',
            text: 'Put options on popular stocks typically cost 2-5% of the stock value for 30-60 day protection, and this cost can significantly eat into your returns if used continuously. For example, buying quarterly protective puts at 3% per cycle would cost 12% annually — a drag that would eliminate most of your expected stock returns. This is why most investors use protective puts selectively: during periods of elevated uncertainty, ahead of known risk events, or when their portfolio has significant concentrated positions. The cheapest protection often uses out-of-the-money puts that only kick in during large drawdowns.',
          },
          {
            heading: 'The Collar Strategy',
            text: 'A collar combines a protective put with a covered call to reduce or eliminate the cost of downside protection. You buy a put below the current price and simultaneously sell a call above it — the premium from the call sale offsets the put purchase cost. A zero-cost collar means the call premium exactly equals the put premium, giving you free downside protection in exchange for capped upside. For example, with a stock at $100, you might buy a $90 put for $3 and sell a $110 call for $3, creating a free collar that protects below $90 while capping gains above $110.',
          },
          {
            heading: 'When Protection Makes Sense',
            text: 'Protective puts are most valuable when you have concentrated stock positions that represent a large percentage of your net worth, such as company stock from an employer. They are also useful before binary events like earnings, FDA approvals, or elections where the downside risk is asymmetric. Long-term investors generally find that broad diversification is cheaper protection than buying puts, but there are situations where options-based protection is the right tool. Consider protection when the cost of being wrong is financially devastating, not just uncomfortable.',
          },
        ]),
        JSON.stringify([
          'Protective puts create a price floor for stocks you own, limiting maximum downside.',
          'The cost of continuous put protection (2-5% per cycle) can severely reduce long-term returns.',
          'Collar strategies use covered call premium to offset the cost of protective puts.',
          'Zero-cost collars provide free downside protection in exchange for capped upside.',
          'Use protective puts selectively for concentrated positions or ahead of binary events.',
        ]),
        JSON.stringify([
          {
            question: 'What is the purpose of a protective put?',
            options: [
              'To generate income from stocks you own',
              'To set a floor price that limits your maximum downside loss',
              'To increase your leverage on a stock position',
              'To reduce the cost of buying additional shares',
            ],
            answer: 1,
          },
          {
            question: 'What is a collar strategy?',
            options: [
              'Buying two put options at different strike prices',
              'Buying a protective put and selling a covered call simultaneously',
              'Selling both a call and a put at the same strike',
              'Buying a call and selling the underlying stock',
            ],
            answer: 1,
          },
          {
            question: 'Why do most investors use protective puts selectively rather than continuously?',
            options: [
              'Because puts are only available during certain months',
              'Because the ongoing premium cost significantly reduces returns',
              'Because protective puts increase portfolio volatility',
              'Because brokers limit the number of puts you can buy',
            ],
            answer: 1,
          },
          {
            question: 'A zero-cost collar provides downside protection by:',
            options: [
              'Using government guarantees instead of options',
              'Buying puts funded by selling calls, with no net premium cost',
              'Diversifying across uncorrelated assets',
              'Using stop-loss orders instead of options',
            ],
            answer: 1,
          },
        ]),
        2,
      ]
    );

    // Lesson 3: Spreads
    console.log('    📝 Lesson: Spreads: Bull, Bear & Iron Condor');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod17Id,
        'Spreads: Bull, Bear & Iron Condor',
        'Master vertical spreads and iron condors for defined-risk trading in directional and range-bound markets.',
        '18 min',
        '📊',
        JSON.stringify([
          {
            heading: 'What Are Vertical Spreads?',
            text: 'A vertical spread involves buying and selling options of the same type (both calls or both puts) on the same stock with the same expiration but different strike prices. The "spread" between the two strike prices defines your maximum profit and maximum loss, making these defined-risk trades that you can size precisely. Vertical spreads are more capital-efficient than buying options outright because the sold option reduces your cost. They are the building blocks of most advanced options strategies.',
          },
          {
            heading: 'Bull Call Spread and Bear Put Spread',
            text: 'A bull call spread is created by buying a call at a lower strike and selling a call at a higher strike — you profit when the stock rises. For example, buying a $100 call and selling a $110 call for a net $3 debit gives you a maximum profit of $7 ($10 spread width minus $3 cost) if the stock finishes above $110. A bear put spread works the same way in reverse: buy a higher-strike put and sell a lower-strike put to profit from a decline. Both strategies have defined maximum profits and losses, making them easier to manage than outright option purchases.',
          },
          {
            heading: 'Credit Spreads vs. Debit Spreads',
            text: 'Debit spreads require you to pay money upfront (you buy the more expensive option and sell the cheaper one), and you profit when the stock moves in your direction. Credit spreads pay you money upfront (you sell the more expensive option and buy the cheaper one), and you profit when the stock stays away from your short strike. Credit spreads benefit from time decay, while debit spreads fight it. Many experienced traders prefer credit spreads because they can profit from time passing even without a significant stock move.',
          },
          {
            heading: 'The Iron Condor for Range-Bound Markets',
            text: 'An iron condor combines a bull put spread and a bear call spread, creating a position that profits when the stock stays within a defined range. You sell an out-of-the-money put spread below the stock and an out-of-the-money call spread above the stock, collecting premium from both sides. For example, with a stock at $100, you might sell the $90/$85 put spread and the $110/$115 call spread for a total credit of $2. If the stock stays between $90 and $110 at expiration, you keep the entire $2 premium. Your maximum loss is the width of either spread minus the premium collected.',
          },
          {
            heading: 'Max Profit and Max Loss Calculations',
            text: 'For debit spreads, max profit equals the width of the spread minus the premium paid, and max loss is the premium paid. For credit spreads, max profit is the premium received, and max loss is the width of the spread minus the premium received. For iron condors, max profit is the total premium collected, and max loss is the wider spread width minus the premium (only one side can be fully breached at expiration). Always calculate these numbers before entering a trade so you know exactly what you stand to gain or lose.',
          },
        ]),
        JSON.stringify([
          'Vertical spreads are defined-risk trades that combine buying and selling options at different strikes.',
          'Bull call spreads profit from upside; bear put spreads profit from downside.',
          'Credit spreads pay you upfront and benefit from time decay; debit spreads require upfront payment.',
          'Iron condors profit when stocks stay in a range, combining a bull put spread with a bear call spread.',
          'Always calculate max profit and max loss before entering any spread trade.',
        ]),
        JSON.stringify([
          {
            question: 'What defines a vertical spread?',
            options: [
              'Options with different expiration dates',
              'Options on different underlying stocks',
              'Same type options, same expiration, different strikes',
              'One call and one put at the same strike',
            ],
            answer: 2,
          },
          {
            question: 'A bull call spread with a $100/$110 strike costs $3. What is the maximum profit?',
            options: ['$3', '$7', '$10', '$13'],
            answer: 1,
          },
          {
            question: 'When does an iron condor achieve maximum profit?',
            options: [
              'When the stock makes a large move in either direction',
              'When the stock stays within the range of the two short strikes',
              'When implied volatility increases significantly',
              'When one side of the condor is fully breached',
            ],
            answer: 1,
          },
          {
            question: 'What advantage do credit spreads have over debit spreads?',
            options: [
              'They have unlimited profit potential',
              'They never expire worthless',
              'They benefit from time decay even without stock movement',
              'They require no margin',
            ],
            answer: 2,
          },
        ]),
        3,
      ]
    );

    // Lesson 4: Straddles & Strangles
    console.log('    📝 Lesson: Straddles & Strangles: Betting on Volatility');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod17Id,
        'Straddles & Strangles: Betting on Volatility',
        'Learn to profit from big stock moves regardless of direction using straddle and strangle strategies.',
        '15 min',
        '🎯',
        JSON.stringify([
          {
            heading: 'The Long Straddle',
            text: 'A long straddle involves buying both a call and a put at the same strike price and expiration — typically at-the-money. This strategy profits from a large move in either direction; it does not matter if the stock goes up or down, only that it moves far enough to overcome the cost of both options. The breakeven points are the strike price plus the total premium paid (upside) and the strike price minus the total premium (downside). Straddles are the purest bet on volatility: you believe the stock will make a big move but are unsure which direction.',
          },
          {
            heading: 'The Long Strangle: A Cheaper Alternative',
            text: 'A long strangle is similar to a straddle but uses out-of-the-money options: you buy a call above the stock price and a put below the stock price. Strangles are cheaper than straddles because both options are OTM, but they require a larger stock move to become profitable. For example, with a stock at $100, you might buy a $105 call and a $95 put for a combined $4. The stock needs to move above $109 or below $91 for you to profit at expiration. Strangles are popular for earnings plays where traders expect a big move but want to minimize their cash outlay.',
          },
          {
            heading: 'Earnings Plays with Volatility Strategies',
            text: 'Many traders buy straddles or strangles before earnings announcements, expecting the report to trigger a large stock move. However, this strategy often fails because implied volatility is already elevated before earnings, making options expensive. After the earnings announcement, IV collapses (IV crush), and even a 5% stock move may not be enough to overcome the inflated premium you paid. Successful earnings volatility traders often look at the implied move priced into the options versus the stock\'s historical post-earnings moves to determine if the straddle is overpriced or underpriced.',
          },
          {
            heading: 'Selling Straddles and Strangles',
            text: 'Short straddles and strangles are the mirror image: you sell both options and collect premium, profiting when the stock stays calm and implied volatility decreases. Short strangles are a core strategy for professional options traders because they profit from the statistical tendency of implied volatility to overstate actual moves. However, short straddles have theoretically unlimited risk on both sides, making position sizing and risk management critical. Many professionals manage risk by closing positions when the stock reaches a predefined loss threshold or delta level.',
          },
        ]),
        JSON.stringify([
          'Long straddles profit from big moves in either direction by buying both a call and put at the same strike.',
          'Long strangles are cheaper than straddles but require larger moves because both options are OTM.',
          'IV crush after earnings often destroys straddle value even when the stock makes a significant move.',
          'Short straddles and strangles collect premium and profit when the stock stays range-bound.',
          'Compare the implied move (options pricing) to historical moves before entering a volatility trade.',
        ]),
        JSON.stringify([
          {
            question: 'What is a long straddle?',
            options: [
              'Buying a call and selling a put at the same strike',
              'Buying both a call and a put at the same strike and expiration',
              'Selling a call and a put at different strikes',
              'Buying two calls at different strike prices',
            ],
            answer: 1,
          },
          {
            question: 'Why are strangles cheaper than straddles?',
            options: [
              'They use fewer contracts',
              'They have shorter expiration periods',
              'Both options are out-of-the-money instead of at-the-money',
              'They do not require margin',
            ],
            answer: 2,
          },
          {
            question: 'What is IV crush?',
            options: [
              'When the stock price collapses after bad earnings',
              'When implied volatility drops sharply after an anticipated event',
              'When the options exchange halts trading',
              'When delta exceeds 1.0',
            ],
            answer: 1,
          },
          {
            question: 'When does a short strangle reach maximum profit?',
            options: [
              'When the stock makes a very large move',
              'When implied volatility increases',
              'When both options expire worthless because the stock stayed between the strikes',
              'When the trader exercises both options early',
            ],
            answer: 2,
          },
        ]),
        4,
      ]
    );

    // Lesson 5: The Wheel Strategy
    console.log('    📝 Lesson: The Wheel Strategy');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod17Id,
        'The Wheel Strategy',
        'Master the systematic income strategy of selling cash-secured puts, getting assigned, and selling covered calls.',
        '17 min',
        '🎡',
        JSON.stringify([
          {
            heading: 'The Wheel Strategy Overview',
            text: 'The Wheel is a systematic options income strategy that cycles between two phases: selling cash-secured puts to potentially buy shares at a discount, and selling covered calls to generate income on shares you own. The strategy works like a "wheel" because it continuously rotates between these two modes. When your put is exercised, you own shares and switch to selling calls. When your call is exercised, your shares are sold and you switch back to selling puts. It is considered one of the most reliable income-generating options strategies for patient, disciplined traders.',
          },
          {
            heading: 'Phase 1: Selling Cash-Secured Puts',
            text: 'The wheel begins by selling a put option on a stock you would happily own at a lower price, while keeping enough cash in your account to buy 100 shares if assigned. You select a strike price at or below your target purchase price and collect the premium. If the stock stays above the strike, you keep the premium and sell another put. If the stock drops below the strike, you are assigned 100 shares at the strike price, but your effective cost basis is the strike price minus the premium collected. For example, selling a $95 put for $3 on a stock trading at $100 means your effective purchase price if assigned is $92.',
          },
          {
            heading: 'Phase 2: Selling Covered Calls',
            text: 'Once you own the shares (through put assignment), you switch to selling covered calls at or above your cost basis to generate additional income. You select a strike price above your effective purchase price and collect another premium. If the stock rises above the strike, your shares are called away at a profit plus you keep the premium. If the stock stays below the strike, you keep the shares and premium, then sell another call. Each cycle of premium collection further reduces your cost basis, making the position more profitable over time.',
          },
          {
            heading: 'Choosing the Right Stocks for the Wheel',
            text: 'The Wheel works best on quality stocks you genuinely want to own at a lower price — stocks with strong fundamentals, steady earnings, and moderate volatility. Avoid wheeling highly volatile stocks, meme stocks, or companies with binary events like biotech FDA approvals, because an adverse move can cause assignment at prices well above the stock\'s new value. Ideal wheel candidates include blue-chip stocks, large-cap tech, dividend aristocrats, and broad market ETFs like SPY or QQQ. The key criterion is simple: would you be happy owning this stock for months or years if it dropped 20%?',
          },
          {
            heading: 'Systematic Income Generation',
            text: 'Consistent wheel traders often generate 15-25% annualized returns through premium collection, even in flat markets. The key is consistency and discipline: sell puts at strikes where you want to buy, sell calls at strikes where you are happy to sell, and let the compounding of weekly or monthly premium payments do the work. Track your effective cost basis carefully, including all premiums received, to know your true breakeven point. Over time, a well-executed wheel strategy can significantly outperform simple buy-and-hold while providing regular income — though it requires more active management and a solid understanding of options mechanics.',
          },
        ]),
        JSON.stringify([
          'The Wheel strategy rotates between selling cash-secured puts and covered calls for systematic income.',
          'Cash-secured puts let you get paid while waiting to buy a stock at your target price.',
          'Each premium collected reduces your effective cost basis, improving your breakeven over time.',
          'Choose quality stocks you genuinely want to own — avoid high-risk or meme stocks for the wheel.',
          'Disciplined wheel traders can generate 15-25% annualized returns through consistent premium collection.',
        ]),
        JSON.stringify([
          {
            question: 'What are the two phases of the Wheel strategy?',
            options: [
              'Buying calls and buying puts',
              'Selling cash-secured puts and selling covered calls',
              'Day trading and swing trading',
              'Buying straddles and selling iron condors',
            ],
            answer: 1,
          },
          {
            question: 'You sell a $95 put for $3 premium. What is your effective cost basis if assigned?',
            options: ['$95', '$98', '$92', '$100'],
            answer: 2,
          },
          {
            question: 'What type of stocks are best for the Wheel strategy?',
            options: [
              'Highly volatile meme stocks',
              'Penny stocks with low premiums',
              'Quality stocks you would be happy to own long-term',
              'Stocks about to report earnings',
            ],
            answer: 2,
          },
          {
            question: 'When does Phase 1 (put selling) transition to Phase 2 (call selling)?',
            options: [
              'After a set number of days',
              'When the put option is assigned and you own the shares',
              'When implied volatility reaches a certain level',
              'When the stock price doubles',
            ],
            answer: 1,
          },
        ]),
        5,
      ]
    );

    console.log('✅ PRO Course 1 complete.\n');

    // =====================================================
    // PRO COURSE 2: Technical Analysis Mastery
    // =====================================================
    console.log('📚 Inserting PRO Course 2: Technical Analysis Mastery...');
    const course2 = await pool.query(
      `INSERT INTO courses (title, description, level, icon, color, sort_order, is_pro)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        'Technical Analysis Mastery',
        'Learn to read charts like a professional trader. Master candlestick patterns, indicators, trend analysis, and develop a systematic trading approach.',
        'intermediate',
        '📉',
        '#7c3aed',
        9,
        true,
      ]
    );
    const course2Id = course2.rows[0].id;

    // Module 18: Chart Reading Foundations
    console.log('  📦 Module 18: Chart Reading Foundations');
    const mod18 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course2Id,
        'Chart Reading Foundations',
        'Master the essential chart-reading skills every technical trader needs — candlesticks, trend lines, and volume',
        18,
      ]
    );
    const mod18Id = mod18.rows[0].id;

    // Lesson 1: Candlestick Charts & Patterns
    console.log('    📝 Lesson: Candlestick Charts & Patterns');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod18Id,
        'Candlestick Charts & Patterns',
        'Understand candlestick anatomy and learn to identify key reversal and continuation patterns.',
        '16 min',
        '🕯️',
        JSON.stringify([
          {
            heading: 'Anatomy of a Candlestick',
            text: 'Each candlestick represents price action over a specific time period and displays four data points: the open, high, low, and close prices. The thick body shows the range between open and close — a green (or white) body means the close was higher than the open (bullish), while a red (or black) body means the close was lower (bearish). The thin lines extending above and below the body are called wicks or shadows, representing the highest and lowest prices reached during the period. The relationship between the body size and wick lengths tells a story about the battle between buyers and sellers.',
          },
          {
            heading: 'Single Candlestick Patterns',
            text: 'The doji forms when the open and close are nearly identical, creating a cross shape that signals indecision in the market — neither bulls nor bears have won. A hammer appears at the bottom of a downtrend with a small body and long lower wick, suggesting sellers pushed the price down but buyers fought back aggressively. The shooting star is the inverse: it appears at the top of an uptrend with a long upper wick, showing that buyers pushed prices higher but sellers took control by the close. These single-candle patterns gain significance when they appear at key support or resistance levels.',
          },
          {
            heading: 'Multi-Candlestick Reversal Patterns',
            text: 'Engulfing patterns occur when a candle\'s body completely engulfs the previous candle\'s body — a bullish engulfing at a low signals a potential upward reversal, while a bearish engulfing at a high suggests the trend may reverse downward. The morning star is a three-candle bullish reversal: a long red candle, followed by a small-bodied candle (the "star"), then a long green candle that closes above the first candle\'s midpoint. The evening star is its bearish counterpart. These multi-candle patterns are more reliable than single-candle signals because they show a clear shift in market sentiment over multiple periods.',
          },
          {
            heading: 'Using Candlestick Patterns in Context',
            text: 'Candlestick patterns are most powerful when combined with other technical analysis tools like support/resistance levels, volume, and trend direction. A hammer at a major support level with high volume is a much stronger signal than a hammer in the middle of nowhere with low volume. No pattern works 100% of the time — most have reliability rates between 55-70% when properly identified. The key is to use patterns as part of a broader trading system rather than trading them in isolation, and always to confirm signals with additional evidence before committing capital.',
          },
        ]),
        JSON.stringify([
          'Candlesticks show open, high, low, close — green bodies are bullish, red bodies are bearish.',
          'Doji candles signal indecision; hammers and shooting stars signal potential reversals.',
          'Multi-candle patterns like engulfing and morning/evening star are more reliable than single-candle signals.',
          'Candlestick patterns are most meaningful at key support/resistance levels with confirming volume.',
          'No single pattern is reliable enough to trade alone — always use additional confirmation.',
        ]),
        JSON.stringify([
          {
            question: 'What does a green (bullish) candlestick body indicate?',
            options: [
              'The stock price fell during the period',
              'The close was higher than the open',
              'Volume was above average',
              'The stock hit a new all-time high',
            ],
            answer: 1,
          },
          {
            question: 'What does a doji candlestick pattern indicate?',
            options: [
              'Strong bullish momentum',
              'Strong bearish momentum',
              'Indecision between buyers and sellers',
              'A stock split is imminent',
            ],
            answer: 2,
          },
          {
            question: 'Where does a hammer candlestick appear to signal a bullish reversal?',
            options: [
              'At the top of an uptrend',
              'In the middle of a sideways market',
              'At the bottom of a downtrend',
              'During pre-market trading only',
            ],
            answer: 2,
          },
          {
            question: 'What makes a bullish engulfing pattern?',
            options: [
              'A green candle whose body completely engulfs the previous red candle\'s body',
              'Two green candles of equal size',
              'A candle with wicks longer than its body',
              'Any candle that closes above the 200-day moving average',
            ],
            answer: 0,
          },
        ]),
        1,
      ]
    );

    // Lesson 2: Support, Resistance & Trend Lines
    console.log('    📝 Lesson: Support, Resistance & Trend Lines');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod18Id,
        'Support, Resistance & Trend Lines',
        'Learn how price levels form, how to draw trend lines, and how to trade breakouts and fakeouts.',
        '15 min',
        '📏',
        JSON.stringify([
          {
            heading: 'How Support and Resistance Levels Form',
            text: 'Support is a price level where buying pressure consistently exceeds selling pressure, creating a "floor" that prevents further decline. Resistance is the opposite — a "ceiling" where selling pressure overwhelms buying pressure and prevents further advance. These levels form because of collective market memory: traders remember prices where they previously bought or sold, and they tend to act similarly when the stock returns to those levels. The more times a level is tested (bounced off), the stronger it becomes, but each test also weakens it slightly because some buyers/sellers get exhausted.',
          },
          {
            heading: 'Drawing Trend Lines',
            text: 'A trend line is drawn by connecting at least two swing lows (for an uptrend) or two swing highs (for a downtrend) with a straight line. A valid trend line should touch at least two points, but three or more touches make it significantly more reliable as a dynamic support or resistance level. In an uptrend, the trend line acts as rising support — each pullback to the trend line represents a buying opportunity. In a downtrend, the trend line acts as falling resistance — each rally to the trend line represents a selling opportunity. The angle of the trend line also matters: very steep trend lines are unsustainable and tend to break quickly.',
          },
          {
            heading: 'Breakouts vs. Fakeouts',
            text: 'A breakout occurs when the price decisively moves through a support or resistance level, signaling a potential new trend direction. A genuine breakout typically shows increased volume, a strong close beyond the level, and follow-through in subsequent candles. A fakeout (or false breakout) occurs when the price briefly pierces a level but quickly reverses, trapping traders who entered on the initial move. Professional traders often wait for a "retest" — where the price breaks through, pulls back to the level, and then continues — before committing to a breakout trade.',
          },
          {
            heading: 'Role Reversal: When Support Becomes Resistance',
            text: 'One of the most important concepts in technical analysis is role reversal: when a support level breaks, it often becomes resistance, and vice versa. For example, if a stock has support at $50 and breaks below it, the $50 level typically becomes resistance on any subsequent rally — former buyers at $50 who are now underwater will sell to break even. This phenomenon occurs because of the psychological anchoring of market participants to key price levels. Role reversal levels are among the most reliable trading setups because they combine the significance of a broken level with the powerful psychology of trapped traders.',
          },
        ]),
        JSON.stringify([
          'Support is a price floor where buying pressure exceeds selling; resistance is a ceiling where selling dominates.',
          'Valid trend lines need at least two touches; three or more make them significantly more reliable.',
          'Genuine breakouts show increased volume and follow-through; fakeouts reverse quickly.',
          'When support breaks, it often becomes resistance (role reversal) and vice versa.',
          'Wait for retests of broken levels before entering breakout trades to avoid fakeouts.',
        ]),
        JSON.stringify([
          {
            question: 'What creates a support level?',
            options: [
              'High trading volume at random prices',
              'Consistent buying pressure at a price level that prevents further decline',
              'Moving average crossovers',
              'Company earnings announcements',
            ],
            answer: 1,
          },
          {
            question: 'How many touches are needed for a reliable trend line?',
            options: [
              'One touch is sufficient',
              'Two touches minimum, three or more for reliability',
              'Exactly five touches',
              'Trend lines do not require touches',
            ],
            answer: 1,
          },
          {
            question: 'What is a fakeout in technical analysis?',
            options: [
              'A price that moves too fast to trade',
              'A brief break through a level that quickly reverses, trapping traders',
              'A stock that is delisted from the exchange',
              'A candlestick with no wicks',
            ],
            answer: 1,
          },
          {
            question: 'What is "role reversal" in the context of support and resistance?',
            options: [
              'When buyers become sellers and sellers become buyers simultaneously',
              'When a broken support level becomes resistance, or vice versa',
              'When an uptrend changes to a downtrend within one candle',
              'When market makers switch from buying to selling',
            ],
            answer: 1,
          },
        ]),
        2,
      ]
    );

    // Lesson 3: Moving Averages
    console.log('    📝 Lesson: Moving Averages: SMA, EMA & Crossovers');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod18Id,
        'Moving Averages: SMA, EMA & Crossovers',
        'Master simple and exponential moving averages and learn to identify golden cross and death cross signals.',
        '14 min',
        '📈',
        JSON.stringify([
          {
            heading: 'Simple Moving Average (SMA)',
            text: 'A simple moving average calculates the arithmetic mean of closing prices over a specified number of periods. The 50-day SMA averages the last 50 daily closing prices, creating a smooth line that filters out daily noise and reveals the underlying trend direction. The 200-day SMA is considered the most important long-term trend indicator — when a stock is above its 200-day SMA, it is generally in an uptrend, and when below, it is in a downtrend. Institutional investors and funds frequently use the 200-day SMA as a decision point for major allocation changes.',
          },
          {
            heading: 'Exponential Moving Average (EMA)',
            text: 'The exponential moving average gives more weight to recent prices, making it more responsive to new information than the SMA. This makes the EMA better for short-term traders who need faster signals, while the SMA is preferred for identifying longer-term trends. The 12-day and 26-day EMAs are the foundation of the popular MACD indicator, and the 9-day EMA is commonly used as a short-term trend filter. Most traders use EMAs for shorter timeframes (9, 12, 21 days) and SMAs for longer timeframes (50, 100, 200 days), combining both for a comprehensive view.',
          },
          {
            heading: 'Golden Cross and Death Cross',
            text: 'The golden cross occurs when the 50-day moving average crosses above the 200-day moving average, signaling a potential long-term bullish trend change. The death cross is the opposite — when the 50-day crosses below the 200-day, suggesting a bearish trend ahead. Historically, golden crosses have preceded significant bull runs, including the rallies after the 2009 and 2020 market bottoms. However, these signals are lagging indicators — by the time a golden cross forms, the stock has typically already risen 15-20% from its lows, so they are better for confirming trends than for timing exact bottoms.',
          },
          {
            heading: 'Moving Averages as Dynamic Support and Resistance',
            text: 'Moving averages act as dynamic (moving) support and resistance levels that trend-following traders use for entries and exits. In an uptrend, the 50-day SMA often acts as support on pullbacks — traders buy when the price dips to the 50-day and bounces. In a strong uptrend, the 21-day EMA serves as support, while in a correction the price may fall to the 200-day SMA before finding buyers. When a stock breaks below a key moving average on high volume, it often signals the beginning of a deeper correction or trend change, prompting many systematic traders to reduce positions.',
          },
        ]),
        JSON.stringify([
          'The 50-day and 200-day SMAs are the most widely watched moving averages by institutions.',
          'EMAs respond faster to price changes than SMAs due to heavier weighting on recent prices.',
          'The golden cross (50 above 200) is bullish; the death cross (50 below 200) is bearish.',
          'Moving averages act as dynamic support/resistance in trending markets.',
          'Moving average signals are lagging — they confirm trends rather than predict exact turning points.',
        ]),
        JSON.stringify([
          {
            question: 'How is a simple moving average (SMA) calculated?',
            options: [
              'By averaging the highest and lowest prices over a period',
              'By calculating the arithmetic mean of closing prices over a set number of periods',
              'By weighting recent prices more heavily than older prices',
              'By multiplying volume by price for each day',
            ],
            answer: 1,
          },
          {
            question: 'What advantage does the EMA have over the SMA?',
            options: [
              'It is more accurate for long-term trends',
              'It responds faster to recent price changes',
              'It eliminates all false signals',
              'It requires fewer data points to calculate',
            ],
            answer: 1,
          },
          {
            question: 'What is a golden cross?',
            options: [
              'When the stock price crosses above its IPO price',
              'When the RSI crosses above 70',
              'When the 50-day MA crosses above the 200-day MA',
              'When volume exceeds the 30-day average',
            ],
            answer: 2,
          },
          {
            question: 'In an uptrend, which moving average commonly acts as dynamic support on pullbacks?',
            options: [
              'The 200-day SMA',
              'The 50-day SMA',
              'The 500-day SMA',
              'No moving average acts as support',
            ],
            answer: 1,
          },
        ]),
        3,
      ]
    );

    // Lesson 4: Volume Analysis
    console.log('    📝 Lesson: Volume Analysis & Confirmation');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod18Id,
        'Volume Analysis & Confirmation',
        'Learn how volume confirms price moves, identifies accumulation and distribution, and signals trend strength.',
        '14 min',
        '📊',
        JSON.stringify([
          {
            heading: 'Volume Confirms Price Moves',
            text: 'Volume is the number of shares traded during a given period, and it serves as a confirmation tool for price movements. A price increase on high volume suggests strong buying conviction — many participants are willing to buy at higher prices. A price increase on low volume is suspicious because it suggests the move lacks broad participation and may not be sustainable. The general rule is: trust price moves that are accompanied by above-average volume, and be skeptical of moves on below-average volume.',
          },
          {
            heading: 'Accumulation and Distribution',
            text: 'Accumulation occurs when smart money (institutional investors) is quietly buying shares over time, often visible as rising volume during price increases and declining volume during pullbacks. Distribution is the opposite — institutions selling their positions, shown by rising volume on down days and declining volume on up days. Watching for these patterns helps you align with institutional money flow rather than trading against it. The accumulation/distribution line (A/D line) is a technical indicator that tracks cumulative money flow and can diverge from price to signal upcoming reversals.',
          },
          {
            heading: 'Volume Spikes and Climax Events',
            text: 'A volume spike — a day with 3-5x normal volume — often signals a climactic event such as a capitulation bottom or an exhaustion top. Selling climaxes occur when panicked investors dump shares at any price, creating massive volume at a price low; once the selling is exhausted, the stock often reverses sharply. Buying climaxes happen when euphoric investors pile in at the top, and once the buying frenzy fades, the stock drops as there are no new buyers left. These extreme volume events often mark important turning points and are some of the most reliable signals in technical analysis.',
          },
          {
            heading: 'On-Balance Volume (OBV)',
            text: 'On-Balance Volume is a cumulative indicator that adds volume on up days and subtracts volume on down days, creating a running total that tracks money flow. When OBV is rising while the stock is flat or declining, it suggests hidden accumulation — buyers are stepping in despite the flat or falling price. When OBV is falling while the stock is rising, it signals hidden distribution — the rally may be running out of steam as smart money exits. OBV divergences from price are powerful leading indicators that often predict trend changes days or weeks before they become visible in the price chart itself.',
          },
        ]),
        JSON.stringify([
          'Volume confirms price moves — high-volume moves are more trustworthy than low-volume moves.',
          'Accumulation shows institutional buying; distribution shows institutional selling.',
          'Volume spikes often mark climactic turning points (selling capitulation or buying exhaustion).',
          'OBV tracks cumulative money flow and can diverge from price as a leading indicator.',
          'Always check volume when evaluating breakouts — breakouts on low volume are often fakeouts.',
        ]),
        JSON.stringify([
          {
            question: 'What does a price increase on low volume typically suggest?',
            options: [
              'Strong bullish conviction among traders',
              'The move may lack broad participation and could be unsustainable',
              'Institutions are aggressively buying',
              'A golden cross is forming',
            ],
            answer: 1,
          },
          {
            question: 'What is a selling climax?',
            options: [
              'A period of low volume at a market top',
              'Massive volume at a price low where panicked investors dump shares, often marking a bottom',
              'A gradual decline over several months',
              'When short sellers cover their positions slowly',
            ],
            answer: 1,
          },
          {
            question: 'What does rising OBV with a flat stock price suggest?',
            options: [
              'The stock is about to be delisted',
              'Hidden accumulation — buyers are stepping in',
              'The stock is overvalued',
              'Trading volume is decreasing',
            ],
            answer: 1,
          },
          {
            question: 'What is the general rule about volume and price moves?',
            options: [
              'Volume does not matter for price analysis',
              'Trust moves accompanied by above-average volume; be skeptical of low-volume moves',
              'Low volume always leads to higher prices',
              'Only volume on red days matters',
            ],
            answer: 1,
          },
        ]),
        4,
      ]
    );

    // Module 19: Advanced Technical Indicators
    console.log('  📦 Module 19: Advanced Technical Indicators');
    const mod19 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course2Id,
        'Advanced Technical Indicators',
        'Go beyond basics with RSI, Bollinger Bands, Fibonacci, chart patterns, and systematic trading frameworks',
        19,
      ]
    );
    const mod19Id = mod19.rows[0].id;

    // Lesson 1: RSI & Momentum Indicators
    console.log('    📝 Lesson: RSI & Momentum Indicators');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod19Id,
        'RSI & Momentum Indicators',
        'Master the Relative Strength Index, divergence signals, and the MACD histogram for momentum analysis.',
        '16 min',
        '⚡',
        JSON.stringify([
          {
            heading: 'Relative Strength Index (RSI)',
            text: 'The RSI is a momentum oscillator that measures the speed and magnitude of price changes on a scale of 0 to 100. Readings above 70 traditionally indicate overbought conditions (the stock may have risen too far, too fast), while readings below 30 suggest oversold conditions (the stock may have fallen too far). However, in strong uptrends, RSI can remain above 70 for extended periods — using overbought readings as sell signals in a bull market often means selling too early. The most reliable RSI signals come from divergences and centerline crossovers, not simple overbought/oversold levels.',
          },
          {
            heading: 'RSI Divergence Signals',
            text: 'Bullish divergence occurs when the stock makes a lower low but RSI makes a higher low — this shows that selling momentum is weakening even as the price continues to decline, often foreshadowing a reversal. Bearish divergence is the opposite: the stock makes a higher high but RSI makes a lower high, warning that buying momentum is fading despite higher prices. Divergence signals are among the most powerful tools in technical analysis because they reveal hidden shifts in momentum before they become visible in the price itself. Divergences work best on the daily and weekly timeframes and should be confirmed with other indicators.',
          },
          {
            heading: 'MACD: Moving Average Convergence Divergence',
            text: 'The MACD measures the relationship between two exponential moving averages (typically the 12-day and 26-day EMA) and presents it as a momentum indicator. The MACD line (12 EMA minus 26 EMA) and the signal line (9-period EMA of the MACD) generate buy signals when the MACD crosses above the signal line and sell signals when it crosses below. The MACD histogram visualizes the distance between these two lines, making it easy to spot momentum shifts. When the histogram bars start shrinking, it often signals that a trend is losing steam even if the price hasn\'t reversed yet.',
          },
          {
            heading: 'Combining Momentum Indicators',
            text: 'Using multiple momentum indicators together provides stronger signals than any single indicator alone. A powerful combination is RSI divergence confirmed by a MACD histogram shift: when RSI shows bullish divergence at the same time the MACD histogram starts forming higher bars, the reversal signal is significantly more reliable. Avoid stacking too many indicators (a common beginner mistake called "indicator overload"), which creates confusion and contradictory signals. Most professional traders use two or three complementary indicators — typically one trend indicator, one momentum oscillator, and one volume indicator — to form a complete picture.',
          },
        ]),
        JSON.stringify([
          'RSI measures momentum on a 0-100 scale; above 70 is overbought, below 30 is oversold.',
          'RSI divergences (price vs. RSI direction conflicts) are more reliable than overbought/oversold levels.',
          'MACD measures the relationship between two EMAs and generates signals via line crossovers.',
          'MACD histogram shows momentum shifts before they are visible in the price chart.',
          'Combine two or three complementary indicators — avoid indicator overload.',
        ]),
        JSON.stringify([
          {
            question: 'What does an RSI reading above 70 traditionally indicate?',
            options: [
              'The stock is cheap and ready to buy',
              'The stock may be overbought and could pull back',
              'The stock is about to split',
              'Volume is extremely high',
            ],
            answer: 1,
          },
          {
            question: 'What is bullish RSI divergence?',
            options: [
              'RSI and price both making higher highs',
              'RSI making a higher low while price makes a lower low',
              'RSI dropping below 30',
              'RSI crossing above the 50 centerline',
            ],
            answer: 1,
          },
          {
            question: 'What two EMAs does the standard MACD use?',
            options: [
              '5-day and 10-day',
              '50-day and 200-day',
              '12-day and 26-day',
              '20-day and 50-day',
            ],
            answer: 2,
          },
          {
            question: 'What is "indicator overload"?',
            options: [
              'When an indicator reaches its maximum value',
              'Using too many indicators which creates confusion and contradictory signals',
              'When volume exceeds the chart scale',
              'When RSI and MACD perfectly agree',
            ],
            answer: 1,
          },
        ]),
        1,
      ]
    );

    // Lesson 2: Bollinger Bands & Volatility
    console.log('    📝 Lesson: Bollinger Bands & Volatility');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod19Id,
        'Bollinger Bands & Volatility',
        'Learn to use Bollinger Bands for measuring volatility, identifying squeeze breakouts, and mean reversion trades.',
        '15 min',
        '📐',
        JSON.stringify([
          {
            heading: 'How Bollinger Bands Work',
            text: 'Bollinger Bands consist of three lines: a middle band (typically a 20-day SMA), an upper band set two standard deviations above the SMA, and a lower band two standard deviations below. The bands automatically widen during periods of high volatility and narrow during calm periods, creating a dynamic envelope around price action. Approximately 95% of price action falls within the two-standard-deviation bands under normal conditions. This statistical property makes Bollinger Bands uniquely useful for identifying when prices have moved to statistical extremes.',
          },
          {
            heading: 'The Bollinger Squeeze',
            text: 'The Bollinger squeeze occurs when the bands narrow to their tightest point in recent history, indicating very low volatility. Low volatility periods are typically followed by high volatility breakouts — like a coiled spring that releases energy. Traders watch for squeezes and then enter when the price breaks decisively out of the narrow range, either above the upper band (bullish) or below the lower band (bearish). The squeeze is one of the most reliable setup patterns in technical analysis because it identifies the buildup of energy before a significant move.',
          },
          {
            heading: 'Walking the Bands',
            text: 'In strong trends, the price will "walk" along the upper or lower Bollinger Band, touching or exceeding it repeatedly without mean-reverting. During a strong uptrend, prices hug the upper band while barely touching the middle band; during a strong downtrend, prices walk along the lower band. This behavior is a sign of trend strength, and trying to fade (trade against) a walking band is dangerous. The key distinction is between a single touch of the band (potential mean reversion) and persistent walking along the band (strong trend that should be traded with, not against).',
          },
          {
            heading: 'Mean Reversion with Bollinger Bands',
            text: 'Mean reversion is the principle that prices tend to return to their average over time, and Bollinger Bands make this concept tradable. When the price touches the lower band in a range-bound market, it often represents a buying opportunity as the price reverts back toward the middle band. Conversely, touching the upper band may be a selling signal in a sideways market. The key is context: mean reversion works in range-bound markets, while trend-following works in trending markets. Professional traders use the bandwidth indicator (the distance between the bands) to determine which regime the market is in.',
          },
          {
            heading: 'Combining Bollinger Bands with Other Indicators',
            text: 'Bollinger Bands work best when combined with momentum indicators like RSI. A powerful setup is when the price touches the lower Bollinger Band while RSI shows bullish divergence — this combination significantly increases the probability of a successful mean-reversion trade. Another useful combination is the Bollinger squeeze confirmed by declining MACD histogram bars: the squeeze identifies the setup, and the MACD confirms the direction of the eventual breakout. Avoid trading Bollinger Band signals in isolation; always seek confirmation from at least one other indicator or price pattern.',
          },
        ]),
        JSON.stringify([
          'Bollinger Bands use two standard deviations around a 20-day SMA to create a dynamic volatility envelope.',
          'The Bollinger squeeze (very narrow bands) often precedes significant breakout moves.',
          'In strong trends, prices "walk" along a band — this signals trend strength, not reversal.',
          'Mean reversion (buying lower band, selling upper band) works in range-bound markets only.',
          'Combine Bollinger Bands with RSI or MACD for higher-probability signals.',
        ]),
        JSON.stringify([
          {
            question: 'What do Bollinger Bands measure?',
            options: [
              'The average trading volume',
              'Price volatility relative to a moving average',
              'The correlation between two stocks',
              'The total market capitalization',
            ],
            answer: 1,
          },
          {
            question: 'What does a Bollinger squeeze indicate?',
            options: [
              'High volatility that is about to decrease',
              'The stock is about to pay a dividend',
              'Low volatility that may precede a significant breakout',
              'The trend is about to reverse',
            ],
            answer: 2,
          },
          {
            question: 'What does "walking the band" mean?',
            options: [
              'The price occasionally touches the outer band',
              'The price persistently hugs and exceeds a band in a strong trend',
              'The bands narrow to a squeeze',
              'The middle band crosses the upper band',
            ],
            answer: 1,
          },
          {
            question: 'In what type of market does Bollinger Band mean reversion work best?',
            options: [
              'Strong uptrending markets',
              'Strong downtrending markets',
              'Range-bound (sideways) markets',
              'Markets with decreasing volume',
            ],
            answer: 2,
          },
        ]),
        2,
      ]
    );

    // Lesson 3: Fibonacci Retracements
    console.log('    📝 Lesson: Fibonacci Retracements');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod19Id,
        'Fibonacci Retracements',
        'Learn to use the golden ratio to identify key support and resistance levels for entries and exits.',
        '14 min',
        '🌀',
        JSON.stringify([
          {
            heading: 'The Golden Ratio in Markets',
            text: 'Fibonacci retracements are based on the mathematical sequence discovered by Leonardo Fibonacci, where each number is the sum of the two preceding ones (1, 1, 2, 3, 5, 8, 13...). The ratios derived from this sequence — particularly 23.6%, 38.2%, 50%, 61.8%, and 78.6% — appear repeatedly in financial markets as levels where prices tend to pause, reverse, or consolidate. The 61.8% ratio (the golden ratio) is the most important: when a stock retraces 61.8% of a prior move and holds, it often signals a strong resumption of the trend. While the mathematical basis is debated, Fibonacci levels work partly because so many traders watch them, creating self-fulfilling prophecy effects.',
          },
          {
            heading: 'How to Draw Fibonacci Retracements',
            text: 'To draw Fibonacci retracements, identify a significant swing low and swing high in the price chart. In an uptrend, draw from the swing low to the swing high — the retracement levels then appear as potential support zones for pullbacks. In a downtrend, draw from the swing high to the swing low — the levels become potential resistance zones for rallies. Most charting platforms have a built-in Fibonacci tool that automatically places all the key levels once you select your two anchor points. The accuracy of Fibonacci levels depends heavily on choosing the correct swing points — use clear, significant pivots rather than minor fluctuations.',
          },
          {
            heading: 'Key Fibonacci Levels and What They Mean',
            text: 'The 23.6% retracement is shallow and typically seen in very strong trends where buyers eagerly step in at small dips. The 38.2% level is considered a healthy pullback in a strong trend — if the stock bounces here, the trend is robust. The 50% level (not technically a Fibonacci ratio but widely used) represents a "half-way back" retracement and is psychologically significant. The 61.8% level is the golden ratio and the most critical — a bounce here often represents the last chance for the trend to survive. A break below 78.6% usually means the entire prior move has failed and the trend has likely reversed.',
          },
          {
            heading: 'Using Fibonacci Levels for Trading',
            text: 'The most reliable Fibonacci trading setup is a confluence zone — where a Fibonacci level aligns with another technical element like a moving average, a prior support/resistance level, or a trend line. For example, if the 61.8% retracement coincides with the 50-day SMA and a previous resistance-turned-support level, that triple confluence zone becomes a very high-probability entry point. Many traders use Fibonacci levels to set profit targets as well: after entering at a retracement level, they target the previous high (100% extension) or the 161.8% extension for a more aggressive objective.',
          },
        ]),
        JSON.stringify([
          'Fibonacci retracements use ratios (23.6%, 38.2%, 50%, 61.8%, 78.6%) to identify pullback levels.',
          'The 61.8% level (golden ratio) is the most important — a hold here often signals trend continuation.',
          'Draw retracements from significant swing lows to swing highs (or vice versa in downtrends).',
          'Confluence zones where Fibonacci levels align with other indicators create high-probability setups.',
          'A break below 78.6% retracement typically indicates the prior trend has failed.',
        ]),
        JSON.stringify([
          {
            question: 'Which Fibonacci retracement level is considered the "golden ratio"?',
            options: ['23.6%', '38.2%', '50.0%', '61.8%'],
            answer: 3,
          },
          {
            question: 'How do you draw Fibonacci retracements in an uptrend?',
            options: [
              'From the swing high to the swing low',
              'From the swing low to the swing high',
              'From the current price to the highest price',
              'From the opening price to the closing price',
            ],
            answer: 1,
          },
          {
            question: 'What is a confluence zone in Fibonacci analysis?',
            options: [
              'When two Fibonacci sequences overlap',
              'When a Fibonacci level aligns with other technical elements like moving averages or support levels',
              'When all Fibonacci levels converge at one price',
              'When the stock crosses the 50% retracement',
            ],
            answer: 1,
          },
          {
            question: 'What does a break below the 78.6% retracement typically signal?',
            options: [
              'The trend is very strong and will continue',
              'A shallow pullback is complete',
              'The entire prior move has likely failed and the trend may have reversed',
              'The stock is about to reach a new all-time high',
            ],
            answer: 2,
          },
        ]),
        3,
      ]
    );

    // Lesson 4: Chart Patterns That Predict Moves
    console.log('    📝 Lesson: Chart Patterns That Predict Moves');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod19Id,
        'Chart Patterns That Predict Moves',
        'Identify classic chart patterns including head and shoulders, double tops/bottoms, and continuation patterns.',
        '17 min',
        '🔺',
        JSON.stringify([
          {
            heading: 'Head and Shoulders',
            text: 'The head and shoulders pattern is the most reliable reversal pattern in technical analysis, with a historical accuracy rate above 70%. It consists of three peaks: a left shoulder, a higher head, and a right shoulder at roughly the same level as the left shoulder, connected by a "neckline" drawn across the two troughs between them. The pattern is confirmed when the price breaks below the neckline on increased volume. The measured move target is calculated by subtracting the height of the head from the neckline — for example, if the head is $10 above the neckline, the target is $10 below the neckline.',
          },
          {
            heading: 'Double Top and Double Bottom',
            text: 'A double top forms when the price reaches the same resistance level twice and fails to break through, creating an "M" shape. This bearish pattern signals that buyers have tried and failed twice to push through resistance, suggesting selling pressure will prevail. A double bottom is the bullish inverse — a "W" shape where the price bounces off the same support level twice, indicating strong buying interest at that level. These patterns are confirmed when the price breaks past the intermediate swing point between the two tops or bottoms, and the measured move target equals the height of the pattern.',
          },
          {
            heading: 'Cup and Handle',
            text: 'The cup and handle is a bullish continuation pattern that resembles a tea cup viewed from the side. The cup forms as the price gradually declines and then recovers in a rounded "U" shape back to the original level, and the handle is a short consolidation or pullback from the cup\'s rim. The breakout occurs when the price moves above the handle\'s resistance on increasing volume. William O\'Neil, founder of Investor\'s Business Daily, popularized this pattern and considered it one of the most bullish formations a stock can show. Cup and handle patterns that form over 7-65 weeks with handles that retrace no more than 15% of the cup tend to have the highest success rates.',
          },
          {
            heading: 'Triangles, Flags, and Pennants',
            text: 'Triangles form as price swings contract between converging trend lines — ascending triangles (flat top, rising bottom) are bullish, descending triangles (flat bottom, falling top) are bearish, and symmetrical triangles can break either way. Flags are short-term continuation patterns that form as a small rectangle against the prior trend (a bull flag slopes slightly downward during an uptrend), signaling a pause before the trend resumes. Pennants are similar but form as small symmetrical triangles after a strong move. Both flags and pennants typically resolve within 1-4 weeks, and their measured move target is the length of the "flagpole" (the prior sharp move) added to the breakout point.',
          },
          {
            heading: 'Measured Moves and Price Targets',
            text: 'Most chart patterns have a "measured move" technique for projecting price targets after a breakout. The general principle is that the height or width of the pattern provides a forecast for how far the price is likely to move after the breakout. For example, a head and shoulders pattern with a $5 head-to-neckline distance projects a $5 move below the neckline. While these targets are not guaranteed, they provide useful benchmarks for setting profit targets and evaluating risk-reward ratios before entering a trade. Professional traders typically use measured moves in conjunction with Fibonacci extensions and support/resistance levels to set realistic profit objectives.',
          },
        ]),
        JSON.stringify([
          'Head and shoulders is the most reliable reversal pattern with 70%+ historical accuracy.',
          'Double tops (bearish) and double bottoms (bullish) signal failed breakout/breakdown attempts.',
          'Cup and handle is a bullish continuation pattern popularized by William O\'Neil.',
          'Triangles, flags, and pennants are continuation patterns that signal pauses before trend resumption.',
          'Measured move targets use pattern height/width to project post-breakout price objectives.',
        ]),
        JSON.stringify([
          {
            question: 'What shape does a head and shoulders pattern create?',
            options: [
              'Two equal peaks with a valley between them',
              'Three peaks where the middle one is the highest',
              'A gradual upward slope',
              'A series of higher highs and higher lows',
            ],
            answer: 1,
          },
          {
            question: 'How is a double top pattern confirmed?',
            options: [
              'When the stock reaches the resistance level a third time',
              'When the price breaks below the intermediate swing point between the two tops',
              'When volume decreases on the second top',
              'When the RSI reaches 70',
            ],
            answer: 1,
          },
          {
            question: 'What is a bull flag pattern?',
            options: [
              'A small downward-sloping rectangle in an uptrend that signals continuation',
              'A reversal pattern that ends an uptrend',
              'A broadening formation with expanding price range',
              'A candlestick with a very long upper wick',
            ],
            answer: 0,
          },
          {
            question: 'How is the measured move target calculated for most chart patterns?',
            options: [
              'By doubling the breakout price',
              'By multiplying the pattern width by 1.618',
              'By projecting the height of the pattern from the breakout point',
              'By averaging the high and low of the pattern',
            ],
            answer: 2,
          },
        ]),
        4,
      ]
    );

    // Lesson 5: Building a Technical Trading System
    console.log('    📝 Lesson: Building a Technical Trading System');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod19Id,
        'Building a Technical Trading System',
        'Learn to combine indicators into a systematic approach with clear entry/exit rules and backtesting.',
        '18 min',
        '🔧',
        JSON.stringify([
          {
            heading: 'Why You Need a System',
            text: 'A trading system is a set of predefined rules that dictate when to enter, when to exit, and how much to risk on each trade. Without a system, traders make emotional decisions driven by fear and greed — buying at tops during euphoria and selling at bottoms during panic. A systematic approach removes emotion from the equation by providing clear, objective criteria for every trading decision. Studies consistently show that systematic traders outperform discretionary traders over the long term, primarily because they maintain discipline during the volatile periods when most traders make their worst decisions.',
          },
          {
            heading: 'Combining Indicators: A Practical Framework',
            text: 'An effective trading system typically combines one trend indicator, one momentum oscillator, and one volume confirmation tool. For example: use the 50/200 SMA crossover to determine the overall trend direction, RSI to identify entry points during pullbacks (buying when RSI dips below 40 in an uptrend), and volume to confirm that moves have conviction. The rules might be: go long when the 50 SMA is above the 200 SMA, RSI drops below 40 and turns up, and volume on the reversal candle is above the 20-day average. Having exactly three conditions prevents indicator overload while providing sufficient confirmation.',
          },
          {
            heading: 'Entry and Exit Rules',
            text: 'Clear entry rules define exactly when you will pull the trigger — ambiguity leads to hesitation or impulsive entries. Exit rules are equally important and should include both a profit target (where you take gains) and a stop-loss (where you cut losses). A common approach is a 2:1 reward-to-risk ratio: if your stop-loss is $5 below your entry, your profit target should be at least $10 above. Trail your stop-loss up as the trade moves in your favor using a method like the 21-day EMA or a fixed percentage to lock in profits while giving the trade room to develop.',
          },
          {
            heading: 'Backtesting Basics',
            text: 'Backtesting involves applying your trading rules to historical price data to see how the system would have performed in the past. While past performance does not guarantee future results, backtesting reveals whether your system has a statistical edge, what drawdowns to expect, and how sensitive the results are to different market conditions. Start by manually testing your system on 1-2 years of data for a few stocks before automating. Track key metrics: win rate, average win vs. average loss, maximum drawdown, and profit factor (gross profits divided by gross losses — you want this above 1.5). If the backtest shows promising results, paper trade the system for at least a month before risking real capital.',
          },
          {
            heading: 'Avoiding Indicator Overload',
            text: 'One of the most common mistakes among aspiring technical traders is using too many indicators, creating a cluttered chart where signals contradict each other and nothing ever lines up perfectly. This "analysis paralysis" results in missed trades and second-guessing. The solution is disciplined minimalism: choose a maximum of three to four indicators that each serve a distinct purpose, and stick with them. If your system requires more than four indicators to all agree before you enter a trade, the conditions will rarely align and you will miss most opportunities. The best trading systems are simple, repeatable, and robust across different market conditions.',
          },
        ]),
        JSON.stringify([
          'A systematic approach with predefined rules removes emotion and improves long-term consistency.',
          'Combine one trend indicator, one momentum oscillator, and one volume tool for a balanced system.',
          'Define clear entry rules, profit targets, and stop-losses before every trade.',
          'Backtest your system on historical data and track win rate, drawdown, and profit factor.',
          'Limit yourself to 3-4 indicators to avoid analysis paralysis and indicator overload.',
        ]),
        JSON.stringify([
          {
            question: 'What is the primary benefit of a systematic trading approach?',
            options: [
              'It guarantees profits on every trade',
              'It removes emotional decision-making and provides objective criteria',
              'It eliminates the need to analyze charts',
              'It allows you to use unlimited indicators',
            ],
            answer: 1,
          },
          {
            question: 'What is a 2:1 reward-to-risk ratio?',
            options: [
              'Risking $2 for every $1 of potential profit',
              'Setting a profit target that is twice as far as the stop-loss',
              'Using two indicators for every one trading signal',
              'Holding a trade for two days for every one day of analysis',
            ],
            answer: 1,
          },
          {
            question: 'What is a good minimum profit factor for a trading system?',
            options: ['0.5', '1.0', '1.5', '3.0'],
            answer: 2,
          },
          {
            question: 'Why is indicator overload problematic?',
            options: [
              'Too many indicators cause the computer to crash',
              'Conflicting signals lead to analysis paralysis and missed opportunities',
              'Indicators become more accurate with more of them',
              'Brokers charge more for additional indicators',
            ],
            answer: 1,
          },
        ]),
        5,
      ]
    );

    console.log('✅ PRO Course 2 complete.\n');

    // =====================================================
    // PRO COURSE 3: Wealth Building & Financial Independence
    // =====================================================
    console.log('📚 Inserting PRO Course 3: Wealth Building & Financial Independence...');
    const course3 = await pool.query(
      `INSERT INTO courses (title, description, level, icon, color, sort_order, is_pro)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        'Wealth Building & Financial Independence',
        'Build a comprehensive wealth-building plan. Learn tax optimization, estate planning, real estate strategies, and the path to financial independence (FIRE).',
        'intermediate',
        '🏆',
        '#0891b2',
        10,
        true,
      ]
    );
    const course3Id = course3.rows[0].id;

    // Module 20: Tax-Smart Investing
    console.log('  📦 Module 20: Tax-Smart Investing');
    const mod20 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course3Id,
        'Tax-Smart Investing',
        'Learn tax optimization strategies that keep more of your investment returns in your pocket',
        20,
      ]
    );
    const mod20Id = mod20.rows[0].id;

    // Lesson 1: Capital Gains Tax
    console.log('    📝 Lesson: Capital Gains Tax: Short vs Long Term');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod20Id,
        'Capital Gains Tax: Short vs Long Term',
        'Understand how capital gains are taxed, holding period rules, and strategies like tax-loss harvesting.',
        '15 min',
        '💵',
        JSON.stringify([
          {
            heading: 'Short-Term vs. Long-Term Capital Gains',
            text: 'Capital gains are the profits you make when selling an investment for more than you paid. Short-term capital gains (assets held for one year or less) are taxed at your ordinary income tax rate, which can be as high as 37% for top earners. Long-term capital gains (assets held for more than one year) receive preferential tax rates of 0%, 15%, or 20% depending on your income level. This massive difference in tax rates — potentially 37% vs 15% — makes holding period one of the most important yet overlooked factors in investment returns.',
          },
          {
            heading: 'Tax Brackets for Capital Gains',
            text: 'For 2024, single filers with taxable income up to $47,025 pay 0% on long-term capital gains, those earning $47,026–$518,900 pay 15%, and those above $518,900 pay 20%. Additionally, high earners may owe the 3.8% Net Investment Income Tax (NIIT), bringing the top effective rate to 23.8%. For a married couple filing jointly, the 0% bracket extends to $94,050. Understanding these brackets is essential for tax planning: strategically realizing gains in years when your income is lower (retirement, sabbatical, or between jobs) can save thousands in taxes.',
          },
          {
            heading: 'The Wash Sale Rule',
            text: 'The wash sale rule prevents you from claiming a tax loss if you buy a "substantially identical" security within 30 days before or after the sale. For example, if you sell 100 shares of an S&P 500 index fund at a loss and buy them back within 30 days, the IRS disallows the loss deduction. The 30-day window applies in both directions, creating a 61-day total window. To work around this rule, you can buy a similar but not identical investment (for example, selling an S&P 500 fund and buying a total market fund) or wait 31 days before repurchasing the same security.',
          },
          {
            heading: 'Tax-Loss Harvesting Strategies',
            text: 'Tax-loss harvesting involves deliberately selling investments at a loss to offset capital gains taxes on your winners. You can deduct up to $3,000 in net capital losses against ordinary income per year, and unused losses carry forward indefinitely to future tax years. Systematic tax-loss harvesting can add 1-2% to annual after-tax returns over time, which compounds significantly over decades. Many robo-advisors and financial advisors now offer automated tax-loss harvesting, making this strategy accessible to everyday investors, not just the ultra-wealthy.',
          },
        ]),
        JSON.stringify([
          'Short-term gains (held ≤1 year) are taxed at ordinary income rates up to 37%; long-term gains get preferential 0/15/20% rates.',
          'The holding period difference can save 15-22% in taxes — a massive impact on net returns.',
          'The wash sale rule prevents claiming a loss if you rebuy the same security within 30 days.',
          'Tax-loss harvesting can add 1-2% to annual after-tax returns through systematic loss realization.',
          'Unused capital losses carry forward indefinitely and can offset $3,000 of ordinary income per year.',
        ]),
        JSON.stringify([
          {
            question: 'How long must you hold an asset for long-term capital gains treatment?',
            options: [
              '6 months',
              'More than 1 year',
              'More than 2 years',
              '5 years',
            ],
            answer: 1,
          },
          {
            question: 'What is the maximum long-term capital gains tax rate (excluding NIIT)?',
            options: ['10%', '15%', '20%', '37%'],
            answer: 2,
          },
          {
            question: 'What is the wash sale rule?',
            options: [
              'A rule requiring you to wash-trade equal amounts of buys and sells',
              'A rule disallowing tax loss deduction if you rebuy the same security within 30 days',
              'A rule that eliminates capital gains for day traders',
              'A rule that doubles the tax on gains from frequent trading',
            ],
            answer: 1,
          },
          {
            question: 'How much in net capital losses can you deduct against ordinary income each year?',
            options: ['$1,000', '$3,000', '$5,000', '$10,000'],
            answer: 1,
          },
        ]),
        1,
      ]
    );

    // Lesson 2: Tax-Advantaged Accounts Deep Dive
    console.log('    📝 Lesson: Tax-Advantaged Accounts Deep Dive');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod20Id,
        'Tax-Advantaged Accounts Deep Dive',
        'Master 401(k) strategies, backdoor Roth IRA conversions, mega backdoor Roth, and the triple-tax-free HSA.',
        '17 min',
        '🏦',
        JSON.stringify([
          {
            heading: '401(k) Employer Match Optimization',
            text: 'The employer match on a 401(k) is the closest thing to free money in investing — a 100% match on contributions up to 3-6% of your salary is an immediate 100% return before any investment gains. Always contribute at least enough to get the full employer match; not doing so is literally leaving free money on the table. In 2024, you can contribute up to $23,000 per year ($30,500 if over 50) to a 401(k). If your employer offers both traditional and Roth 401(k) options, consider your current vs. expected future tax bracket to choose the most tax-efficient option.',
          },
          {
            heading: 'Backdoor Roth IRA',
            text: 'If your income exceeds the Roth IRA contribution limits ($161,000 single / $240,000 married in 2024), you can still contribute through the "backdoor" method: contribute to a traditional IRA (no income limit for non-deductible contributions), then immediately convert the balance to a Roth IRA. Since you contributed after-tax money, the conversion is generally tax-free. The key caveat is the pro-rata rule: if you have existing pre-tax IRA balances, the IRS will treat your conversion as coming proportionally from pre-tax and after-tax money. To avoid this issue, roll any existing traditional IRA balances into your 401(k) before executing the backdoor conversion.',
          },
          {
            heading: 'Mega Backdoor Roth',
            text: 'The mega backdoor Roth is an advanced strategy available only if your employer\'s 401(k) plan allows after-tax contributions and in-service Roth conversions. The total 401(k) contribution limit (including employer match) is $69,000 in 2024. After maxing out your regular $23,000 employee contribution, you can contribute additional after-tax money up to the $69,000 limit and then convert those after-tax contributions to Roth. This effectively lets high earners contribute $40,000+ to Roth accounts annually — a powerful wealth-building tool. Not all plans allow this, so check with your HR department or plan administrator.',
          },
          {
            heading: 'HSA: The Triple-Tax-Free Account',
            text: 'The Health Savings Account (HSA) is the only account in the U.S. tax code that offers a triple tax benefit: contributions are tax-deductible, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. In 2024, you can contribute $4,150 (individual) or $8,300 (family) per year if you have a High Deductible Health Plan. The power move is to pay current medical expenses out of pocket, let your HSA investments grow for decades, and then withdraw tax-free in retirement for any medical expenses you have receipts for — including past expenses. After age 65, HSA funds can be withdrawn for any purpose (taxed like a traditional IRA), making it a flexible retirement supplement.',
          },
          {
            heading: 'Account Prioritization Strategy',
            text: 'The optimal contribution order for most people is: first, contribute to your 401(k) up to the employer match, then max out your HSA, then max out your Roth IRA (or backdoor Roth), then return to your 401(k) to max out the employee contribution limit, and finally invest in a taxable brokerage account. This order maximizes tax benefits while maintaining flexibility and liquidity. For high earners with mega backdoor Roth access, the math shifts to prioritize the mega backdoor after maxing the HSA and regular Roth. Your specific situation (current tax bracket, state taxes, retirement timeline) may warrant adjustments to this general framework.',
          },
        ]),
        JSON.stringify([
          'Always contribute enough to a 401(k) to capture the full employer match — it is a guaranteed 100% return.',
          'The backdoor Roth IRA lets high earners access Roth benefits regardless of income limits.',
          'Mega backdoor Roth can enable $40,000+ in annual Roth contributions if your plan allows it.',
          'HSAs offer triple tax benefits and can serve as a powerful supplemental retirement account.',
          'The ideal contribution order is: 401k match → HSA → Roth IRA → max 401k → taxable brokerage.',
        ]),
        JSON.stringify([
          {
            question: 'What is the 2024 annual employee contribution limit for a 401(k) (under age 50)?',
            options: ['$6,500', '$22,500', '$23,000', '$69,000'],
            answer: 2,
          },
          {
            question: 'What is the backdoor Roth IRA strategy?',
            options: [
              'Contributing directly to a Roth IRA above the income limit',
              'Contributing to a non-deductible traditional IRA, then converting to Roth',
              'Using employer funds to open a Roth IRA',
              'Converting a 401(k) to a Roth IRA while still employed',
            ],
            answer: 1,
          },
          {
            question: 'What makes the HSA unique compared to other tax-advantaged accounts?',
            options: [
              'It has no contribution limits',
              'It offers triple tax benefits: deductible contributions, tax-free growth, and tax-free qualified withdrawals',
              'Anyone can open one regardless of insurance type',
              'It allows unlimited contributions after age 50',
            ],
            answer: 1,
          },
          {
            question: 'What should be the first priority in account contribution order?',
            options: [
              'Maxing out your Roth IRA',
              'Contributing to a taxable brokerage account',
              'Contributing to your 401(k) up to the employer match',
              'Maxing out your HSA',
            ],
            answer: 2,
          },
        ]),
        2,
      ]
    );

    // Lesson 3: Tax-Loss Harvesting Strategies
    console.log('    📝 Lesson: Tax-Loss Harvesting Strategies');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod20Id,
        'Tax-Loss Harvesting Strategies',
        'Master systematic tax-loss harvesting including direct indexing, gain offsetting, and wash sale avoidance.',
        '14 min',
        '✂️',
        JSON.stringify([
          {
            heading: 'Systematic Tax-Loss Harvesting',
            text: 'Systematic tax-loss harvesting goes beyond opportunistic selling — it involves regularly scanning your portfolio for positions with unrealized losses and strategically realizing those losses to offset gains elsewhere. The best practitioners harvest losses throughout the year, not just at year-end, because market volatility creates opportunities continuously. Research from Wealthfront and Betterment suggests systematic daily or weekly scanning can capture 2-3x more harvesting opportunities than annual reviews. The key is maintaining your overall market exposure by immediately reinvesting proceeds into similar (but not identical) securities.',
          },
          {
            heading: 'Direct Indexing for Maximum Harvesting',
            text: 'Direct indexing involves buying individual stocks that comprise an index (like the S&P 500) rather than buying the index fund itself. This approach creates hundreds of individual tax lots, dramatically increasing harvesting opportunities since individual stocks vary more than the index as a whole. When one stock drops significantly while the index is flat, you can harvest the loss on that specific stock and replace it with a similar one. Studies show direct indexing can add 1-2% in additional after-tax alpha annually compared to holding index funds, though it requires more sophisticated portfolio management (typically automated by platforms like Wealthfront or Parametric).',
          },
          {
            heading: 'Offsetting Gains Strategically',
            text: 'The IRS requires that short-term losses first offset short-term gains, and long-term losses first offset long-term gains, before any cross-offsetting occurs. Since short-term gains are taxed at higher rates (up to 37%), using short-term losses to offset short-term gains saves more money than offsetting long-term gains. Strategic gain/loss matching can save an additional 5-10% in taxes compared to random harvesting. Track your realized gains throughout the year and plan your harvesting activity to maximize the tax benefit of each loss realized.',
          },
          {
            heading: 'Avoiding Wash Sales in Practice',
            text: 'To avoid wash sales while maintaining market exposure, use a "swap" approach: sell the losing position and immediately buy a similar but not substantially identical alternative. For example, sell the Vanguard S&P 500 ETF (VOO) at a loss and buy the iShares S&P 500 ETF (IVV) — they track the same index but are different securities. After 31 days, you can swap back if desired. Be careful with automatic dividend reinvestment (DRIP), which can inadvertently trigger wash sales if a dividend reinvestment occurs within 30 days of your loss sale. Many advisors recommend turning off DRIP in taxable accounts during harvesting season.',
          },
        ]),
        JSON.stringify([
          'Systematic harvesting throughout the year captures 2-3x more opportunities than annual reviews.',
          'Direct indexing buys individual stocks instead of funds, creating hundreds of harvesting opportunities.',
          'Short-term losses offsetting short-term gains save more taxes than offsetting long-term gains.',
          'Use a "swap" approach (buy similar but not identical securities) to maintain exposure while harvesting.',
          'Turn off automatic dividend reinvestment to avoid accidental wash sales during harvesting.',
        ]),
        JSON.stringify([
          {
            question: 'Why is systematic tax-loss harvesting more effective than annual harvesting?',
            options: [
              'Because tax laws change every month',
              'Because continuous scanning captures 2-3x more opportunities from ongoing market volatility',
              'Because the IRS only allows harvesting in certain months',
              'Because brokers offer lower commissions for systematic trading',
            ],
            answer: 1,
          },
          {
            question: 'What is direct indexing?',
            options: [
              'Buying index futures instead of ETFs',
              'Buying individual stocks that make up an index to create more tax-loss harvesting opportunities',
              'Creating your own stock market index',
              'Investing only in indexed annuities',
            ],
            answer: 1,
          },
          {
            question: 'Which type of loss offset saves the most in taxes?',
            options: [
              'Long-term losses offsetting long-term gains',
              'Short-term losses offsetting short-term gains (taxed at higher rates)',
              'Long-term losses offsetting short-term gains',
              'All offsets save the same amount',
            ],
            answer: 1,
          },
          {
            question: 'How can automatic dividend reinvestment cause problems during tax-loss harvesting?',
            options: [
              'Dividends are not taxable in retirement accounts',
              'Reinvested dividends can trigger a wash sale if they occur within 30 days of a loss sale',
              'Dividend reinvestment disqualifies the account from harvesting',
              'Reinvested dividends always count as short-term gains',
            ],
            answer: 1,
          },
        ]),
        3,
      ]
    );

    // Lesson 4: Estate Planning & Wealth Transfer
    console.log('    📝 Lesson: Estate Planning & Wealth Transfer');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod20Id,
        'Estate Planning & Wealth Transfer',
        'Learn about step-up in basis, gift tax exclusions, trusts, and strategies for transferring wealth efficiently.',
        '16 min',
        '🏛️',
        JSON.stringify([
          {
            heading: 'Step-Up in Basis at Death',
            text: 'One of the most powerful (and controversial) tax benefits in the U.S. tax code is the step-up in basis at death. When you pass away, your heirs receive your investments with a cost basis "stepped up" to the fair market value at the date of death, eliminating all unrealized capital gains. For example, if you bought Amazon stock at $10 and it is worth $200 when you die, your heirs inherit it with a $200 basis and pay zero capital gains tax. This rule means that holding highly appreciated assets until death is one of the most tax-efficient wealth transfer strategies available, saving potentially millions in taxes for wealthy families.',
          },
          {
            heading: 'Gift Tax Exclusions',
            text: 'You can gift up to $18,000 per recipient per year (2024) without any gift tax or reporting requirements — this is the annual exclusion amount. A married couple can gift $36,000 per recipient by "gift splitting." Beyond the annual exclusion, there is a lifetime gift and estate tax exemption of $13.61 million per person (2024), meaning most people will never owe gift or estate taxes. However, this exemption is scheduled to drop roughly in half after 2025 unless Congress acts, creating urgency for high-net-worth families to use their exemption now through strategic gifting and trust planning.',
          },
          {
            heading: 'Trusts Basics',
            text: 'A trust is a legal arrangement where you (the grantor) transfer assets to a trustee who manages them for the benefit of your designated beneficiaries. Revocable trusts allow you to maintain control and change terms during your lifetime; they avoid probate but don\'t reduce estate taxes. Irrevocable trusts remove assets from your estate, potentially reducing estate taxes, but you give up control of the assets. Common trust types include bypass trusts (to use both spouses\' estate tax exemptions), generation-skipping trusts (to transfer wealth to grandchildren), and charitable remainder trusts (to provide income while making a charitable contribution).',
          },
          {
            heading: 'Beneficiary Designations and Common Mistakes',
            text: 'Beneficiary designations on retirement accounts, life insurance, and transfer-on-death accounts override your will — a critical detail that many people overlook. Failing to update beneficiary designations after life events (marriage, divorce, death) is one of the most common estate planning mistakes. Another frequent error is naming your estate as the beneficiary of an IRA, which accelerates the distribution timeline and increases taxes. Every year, review all beneficiary designations to ensure they align with your current wishes, and name contingent beneficiaries in case your primary beneficiaries predecease you.',
          },
        ]),
        JSON.stringify([
          'Step-up in basis at death eliminates all unrealized capital gains for heirs — a massive tax benefit.',
          'You can gift $18,000 per person per year ($36,000 for couples) without tax consequences.',
          'The $13.61M lifetime exemption is scheduled to drop after 2025, creating planning urgency.',
          'Irrevocable trusts remove assets from your estate but require giving up control.',
          'Beneficiary designations override your will — review them annually after life events.',
        ]),
        JSON.stringify([
          {
            question: 'What is the "step-up in basis" at death?',
            options: [
              'A tax penalty applied to inherited assets',
              'Heirs receive inherited assets with a cost basis equal to the fair market value at the date of death',
              'An increase in the estate tax rate for larger estates',
              'A requirement to sell all assets within one year of inheritance',
            ],
            answer: 1,
          },
          {
            question: 'What is the 2024 annual gift tax exclusion per recipient?',
            options: ['$10,000', '$15,000', '$18,000', '$25,000'],
            answer: 2,
          },
          {
            question: 'What is the key difference between revocable and irrevocable trusts?',
            options: [
              'Revocable trusts are cheaper to set up',
              'Revocable trusts allow you to maintain control; irrevocable trusts remove assets from your estate',
              'Only irrevocable trusts can hold real estate',
              'Revocable trusts cannot name beneficiaries',
            ],
            answer: 1,
          },
          {
            question: 'Why is it important to review beneficiary designations regularly?',
            options: [
              'Because the IRS requires annual updates',
              'Because beneficiary designations override your will and may be outdated after life events',
              'Because banks close accounts with outdated designations',
              'Because trust beneficiaries must change every year',
            ],
            answer: 1,
          },
        ]),
        4,
      ]
    );

    // Module 21: The FIRE Movement
    console.log('  📦 Module 21: The FIRE Movement');
    const mod21 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course3Id,
        'The FIRE Movement',
        'Master the math, psychology, and strategies behind financial independence and early retirement',
        21,
      ]
    );
    const mod21Id = mod21.rows[0].id;

    // Lesson 1: Financial Independence: The Math
    console.log('    📝 Lesson: Financial Independence: The Math');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod21Id,
        'Financial Independence: The Math',
        'Learn the 25x rule, safe withdrawal rates, and the different flavors of FIRE — lean, fat, coast, and barista.',
        '16 min',
        '🔢',
        JSON.stringify([
          {
            heading: 'The 25x Rule',
            text: 'The foundational math of financial independence is simple: you need approximately 25 times your annual expenses saved and invested to be financially independent. This comes from the 4% rule — if you can safely withdraw 4% of your portfolio each year without running out of money, then a portfolio of 25x your expenses will sustain you indefinitely. If you spend $40,000 per year, you need $1,000,000. If you spend $80,000, you need $2,000,000. This simple calculation is the starting point for every FIRE journey, and it immediately shows that reducing expenses is just as powerful as increasing income.',
          },
          {
            heading: 'Safe Withdrawal Rates: 3.5% vs. 4%',
            text: 'The 4% rule comes from the Trinity Study, which found that a 4% initial withdrawal rate (adjusted for inflation) sustained a 60/40 portfolio for at least 30 years in 96% of historical scenarios. However, for early retirees with 40-60 year horizons, many financial planners recommend a more conservative 3.5% withdrawal rate (requiring about 28.6x annual expenses). Some researchers suggest that with global diversification and flexible spending, even a 4% rate is conservative for most scenarios. The key insight is that the safe withdrawal rate is not a single number but a range that depends on your asset allocation, time horizon, flexibility, and risk tolerance.',
          },
          {
            heading: 'Lean FIRE vs. Fat FIRE',
            text: 'Lean FIRE means reaching financial independence on a minimal budget — typically $25,000-$40,000 per year for a single person, requiring a portfolio of $625,000-$1,000,000. Lean FIRE practitioners prioritize frugality and simplicity, often living in low-cost areas. Fat FIRE is the opposite extreme: achieving financial independence with a luxurious budget of $100,000-$200,000+ per year, requiring a portfolio of $2.5-$5+ million. Fat FIRE usually requires high income or business ownership, but allows for a comfortable lifestyle without budget constraints. Most people fall somewhere in between, and the right target depends on your values and lifestyle preferences.',
          },
          {
            heading: 'Coast FIRE and Barista FIRE',
            text: 'Coast FIRE means you have saved enough that compounding will grow your portfolio to your full FIRE number by traditional retirement age without additional contributions. For example, if a 35-year-old has $400,000 invested, it will grow to approximately $2 million by age 60 at 7% real returns — they can "coast" by working just enough to cover current expenses. Barista FIRE is a hybrid approach where you leave your high-stress career but work part-time (like a barista) for benefits and spending money while your portfolio grows. Both concepts acknowledge that full FIRE is not binary — there are valuable milestones along the way that dramatically increase your freedom.',
          },
          {
            heading: 'How Savings Rate Determines Your Timeline',
            text: 'Your savings rate, not your income or investment returns, is the most powerful variable in your FIRE timeline. At a 10% savings rate, it takes about 51 years to reach financial independence; at 25%, it takes 32 years; at 50%, only 17 years; at 75%, just 7 years. This is because a higher savings rate simultaneously increases the amount you invest AND decreases the amount you need (since your expenses are lower). A person earning $50,000 who saves 50% ($25,000/year expenses, $625,000 target) reaches FIRE faster than someone earning $200,000 who saves 20% ($160,000/year expenses, $4 million target).',
          },
        ]),
        JSON.stringify([
          'The 25x rule: you need 25 times your annual expenses invested to be financially independent.',
          'The 4% withdrawal rate has a 96% historical success rate over 30-year periods.',
          'Lean FIRE targets minimal spending ($25-40K); Fat FIRE targets luxury spending ($100K+).',
          'Coast FIRE and Barista FIRE offer intermediate milestones that reduce financial stress.',
          'Savings rate is the most powerful variable: 50% savings rate = ~17 years to FIRE.',
        ]),
        JSON.stringify([
          {
            question: 'According to the 25x rule, how much do you need if your annual expenses are $60,000?',
            options: ['$600,000', '$1,000,000', '$1,500,000', '$2,400,000'],
            answer: 2,
          },
          {
            question: 'What is the origin of the 4% withdrawal rule?',
            options: [
              'The Federal Reserve mandate',
              'The Trinity Study, which analyzed historical portfolio survival rates',
              'A Wall Street convention dating back to the 1920s',
              'The SEC required it for retirement planning',
            ],
            answer: 1,
          },
          {
            question: 'What is Coast FIRE?',
            options: [
              'Living on a coast where expenses are lower',
              'Having saved enough that compound growth will reach your FIRE number without further contributions',
              'The fastest possible path to financial independence',
              'Retiring and moving to a coastal city',
            ],
            answer: 1,
          },
          {
            question: 'Approximately how many years to FIRE at a 50% savings rate?',
            options: ['7 years', '17 years', '25 years', '32 years'],
            answer: 1,
          },
        ]),
        1,
      ]
    );

    // Lesson 2: Optimizing Your Savings Rate
    console.log('    📝 Lesson: Optimizing Your Savings Rate');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod21Id,
        'Optimizing Your Savings Rate',
        'Learn why savings rate matters more than returns and strategies for achieving 50%+ savings rates.',
        '14 min',
        '💪',
        JSON.stringify([
          {
            heading: 'Why Savings Rate Matters More Than Returns',
            text: 'In the early years of your investing journey, your savings rate has a far greater impact than your investment returns. If you have $50,000 invested and earn a spectacular 20% return, that is $10,000. But increasing your savings from $1,000 to $2,000 per month adds $12,000 — more impact from simply saving more. As your portfolio grows larger, returns become more important, but for the first 5-10 years, the amount you save dwarfs the returns you earn. This is why optimizing your savings rate should be your primary focus before obsessing over asset allocation or stock picking.',
          },
          {
            heading: 'Strategies for 50%+ Savings Rates',
            text: 'Achieving a 50% or higher savings rate sounds extreme, but the FIRE community has proven it is achievable through deliberate choices in the "big three" expenses: housing (30%+ of most budgets), transportation (15-20%), and food (10-15%). Moving to a lower-cost area can save $10,000-$30,000 per year in housing alone. Driving a used car instead of financing a new one saves $5,000-$10,000 annually. Meal prepping and cooking at home can halve food costs. The key insight is that small daily expenses (lattes, subscriptions) matter far less than major structural decisions about where you live, what you drive, and how you eat.',
          },
          {
            heading: 'Lifestyle Design and Intentional Spending',
            text: 'High savings rates do not require deprivation — they require intentionality. The concept of "lifestyle design" means spending lavishly on things that bring you genuine joy while ruthlessly cutting expenses that do not. A FIRE practitioner might spend $200 per month on rock climbing (their passion) while having no cable TV, no car payment, and a modest apartment. This approach often leads to greater happiness than the default consumer lifestyle because it forces you to identify what actually matters to you. Research consistently shows that spending on experiences and relationships produces more lasting happiness than spending on material goods.',
          },
          {
            heading: 'Geographic Arbitrage',
            text: 'Geographic arbitrage means earning income in a high-cost area while spending in a low-cost area — the ultimate savings rate accelerator. This can mean working remotely from a low-cost-of-living city while earning a high-cost-city salary, or relocating abroad to countries where your dollars stretch dramatically further. A software engineer earning $150,000 in San Francisco (high rent, high taxes) might save 20-30% of their income, but the same salary while living in Lisbon, Portugal or Medellín, Colombia could result in a 60-70% savings rate. Even domestic moves — from New York City to Raleigh or Austin to Boise — can dramatically increase your savings rate.',
          },
        ]),
        JSON.stringify([
          'In early accumulation years, savings rate impacts wealth far more than investment returns.',
          'Focus on the "big three" expenses — housing, transportation, and food — for the biggest savings impact.',
          'Lifestyle design means spending on what truly matters and cutting everything that does not.',
          'Geographic arbitrage (earning high-cost income, spending in low-cost areas) can double savings rates.',
          'High savings rates stem from intentional choices, not deprivation.',
        ]),
        JSON.stringify([
          {
            question: 'Why does savings rate matter more than returns in the early years?',
            options: [
              'Because investment returns are always low for beginners',
              'Because on a small portfolio, additional savings add more dollars than even exceptional returns',
              'Because savings are tax-deductible',
              'Because returns do not exist for the first 5 years',
            ],
            answer: 1,
          },
          {
            question: 'Which "big three" expenses have the largest impact on savings rate?',
            options: [
              'Coffee, entertainment, and clothing',
              'Housing, transportation, and food',
              'Insurance, taxes, and healthcare',
              'Technology, utilities, and subscriptions',
            ],
            answer: 1,
          },
          {
            question: 'What is geographic arbitrage?',
            options: [
              'Moving frequently to avoid taxes',
              'Earning in a high-cost area while spending in a low-cost area',
              'Investing only in local real estate',
              'Working in two different states simultaneously',
            ],
            answer: 1,
          },
          {
            question: 'What is the core principle of lifestyle design for FIRE?',
            options: [
              'Eliminate all discretionary spending',
              'Spend lavishly on things that bring genuine joy while cutting everything else',
              'Follow a strict budget with zero flexibility',
              'Only buy assets that appreciate in value',
            ],
            answer: 1,
          },
        ]),
        2,
      ]
    );

    // Lesson 3: Building Multiple Income Streams
    console.log('    📝 Lesson: Building Multiple Income Streams');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod21Id,
        'Building Multiple Income Streams',
        'Create an income ladder using dividends, rental properties, side businesses, and royalties.',
        '15 min',
        '🪜',
        JSON.stringify([
          {
            heading: 'Dividend Income',
            text: 'Dividend-paying stocks provide regular cash payments that can partially or fully cover your living expenses in early retirement. A portfolio of dividend aristocrats (companies that have raised dividends for 25+ consecutive years) currently yields about 2.5-3.5%, meaning a $1 million portfolio generates $25,000-$35,000 annually in dividends. The beauty of dividend income is its relative predictability and the historical tendency of quality companies to increase payouts over time — many retirees find their dividend income growing 6-8% annually, providing a natural inflation hedge. Dividends also provide psychological comfort because you receive cash without selling shares.',
          },
          {
            heading: 'Rental Property Income',
            text: 'Real estate rental income is one of the most popular FIRE income streams because it combines cash flow, appreciation, tax benefits, and leverage. A well-purchased rental property can generate 8-12% cash-on-cash returns while appreciating in value and providing significant tax deductions through depreciation. The "house hacking" strategy — buying a duplex or triplex, living in one unit, and renting the others — is a popular first step that can reduce or eliminate your housing costs. The main challenges are the time commitment of property management, dealing with tenants, and the large upfront capital required, though property managers can handle the operational burden for 8-10% of rent.',
          },
          {
            heading: 'Side Businesses and Digital Products',
            text: 'Building a side business or creating digital products (online courses, ebooks, software tools) can generate income that scales without proportional time investment. Unlike a side job where you trade hours for dollars, digital products create once and sell repeatedly, building toward passive income. Many FIRE practitioners start blogs, YouTube channels, or podcasts that eventually generate significant income through advertising, sponsorships, and affiliate marketing. The key is choosing a niche where you have genuine expertise and can provide value — the initial effort is substantial, but successful digital businesses can generate $2,000-$20,000+ per month with minimal ongoing work.',
          },
          {
            heading: 'Creating an Income Ladder',
            text: 'An income ladder combines multiple streams so that no single source needs to cover all your expenses. For example, a FIRE retiree might have: $15,000/year from dividends, $18,000/year from a rental property, $12,000/year from a part-time consulting gig, and $5,000/year from a digital product — totaling $50,000 with no single point of failure. This diversification provides security because if one stream decreases (a tenant moves out, dividends get cut), the others continue flowing. Building this ladder takes years of intentional effort, but the resulting financial resilience far exceeds what any single income source can provide.',
          },
        ]),
        JSON.stringify([
          'Dividend aristocrats provide predictable, growing income that naturally hedges inflation.',
          'Rental properties combine cash flow, appreciation, tax benefits, and leverage for strong total returns.',
          'Digital products (courses, ebooks, tools) create scalable income that is not directly tied to your time.',
          'An income ladder combining multiple streams provides financial resilience with no single point of failure.',
          'Start building additional income streams years before you plan to leave your primary career.',
        ]),
        JSON.stringify([
          {
            question: 'What is a dividend aristocrat?',
            options: [
              'Any stock that pays a dividend',
              'A company that has raised its dividend for 25+ consecutive years',
              'The highest-yielding stock in the S&P 500',
              'A stock recommended by financial aristocrats',
            ],
            answer: 1,
          },
          {
            question: 'What is "house hacking"?',
            options: [
              'Renovating a house to increase its value',
              'Buying a multi-unit property, living in one unit, and renting the others',
              'Using an app to find cheap housing',
              'Building a house yourself to save money',
            ],
            answer: 1,
          },
          {
            question: 'Why are digital products attractive as an income stream?',
            options: [
              'They guarantee a minimum income',
              'They scale without proportional time investment after initial creation',
              'They are tax-free',
              'They always generate more income than traditional jobs',
            ],
            answer: 1,
          },
          {
            question: 'What is the primary benefit of an income ladder?',
            options: [
              'It maximizes returns from a single source',
              'It reduces tax obligations to zero',
              'It diversifies income so no single stream failure is catastrophic',
              'It allows you to retire in one year',
            ],
            answer: 2,
          },
        ]),
        3,
      ]
    );

    // Lesson 4: Sequence of Returns Risk
    console.log('    📝 Lesson: Sequence of Returns Risk');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod21Id,
        'Sequence of Returns Risk',
        'Understand why early retirement years are critical and learn strategies like bond tents and flexible withdrawals.',
        '15 min',
        '📉',
        JSON.stringify([
          {
            heading: 'Why Early Retirement Years Matter Most',
            text: 'Sequence of returns risk is the danger that poor market returns in the first few years of retirement will permanently impair your portfolio, even if average returns over the full period are fine. A 30% market drop in year one of retirement combined with 4% withdrawals can reduce your portfolio by one-third, and the smaller remaining balance may never recover even when markets bounce back. Paradoxically, the same 30% drop in year 15 has much less impact because earlier years of growth have built a buffer. This is why the first 5-10 years of retirement are called the "danger zone" — protecting your portfolio during this period is the single most important factor in retirement success.',
          },
          {
            heading: 'The Bond Tent Strategy',
            text: 'A bond tent (or rising equity glide path) involves temporarily increasing your bond allocation around retirement to protect against sequence risk, then gradually shifting back to stocks over the first decade of retirement. Instead of maintaining a constant 60/40 allocation, you might move to 40/60 (more bonds) at retirement, then gradually shift to 75/25 (more stocks) over 15 years. Research by Michael Kitces and Wade Pfau shows this approach can improve portfolio survival rates by 5-10% compared to static allocations. The "tent" shape comes from bonds peaking at retirement and declining on both sides — fewer bonds before retirement (when sequence risk is lower) and fewer bonds later in retirement (when the danger zone has passed).',
          },
          {
            heading: 'Flexible Withdrawal Rates',
            text: 'Instead of rigidly withdrawing 4% adjusted for inflation every year, flexible withdrawal strategies adjust spending based on market performance. The simplest approach is the "guardrails" method: if your portfolio grows above a ceiling (say, 20% above your initial withdrawal), you can increase spending by 10%; if it drops below a floor (20% below), you decrease spending by 10%. This flexibility dramatically improves portfolio survival rates because it reduces withdrawals when the portfolio is stressed. Research shows flexible spending rules can increase safe withdrawal rates to 5% or higher while maintaining a very high probability of portfolio survival over 30-40 year periods.',
          },
          {
            heading: 'The Guardrails Approach',
            text: 'The Guyton-Klinger guardrails method uses three specific rules: a portfolio management rule (take the higher of last year\'s withdrawal or the calculated withdrawal), a capital preservation rule (reduce withdrawals by 10% if the current withdrawal rate exceeds the initial rate by 20%), and a prosperity rule (increase withdrawals by 10% if the current rate falls below 80% of the initial rate). This systematic approach provides a framework for making withdrawal decisions without emotional second-guessing. Retirees using guardrails can typically start with a 5.2-5.6% initial withdrawal rate — significantly higher than the standard 4% — because the built-in flexibility protects the portfolio during downturns.',
          },
        ]),
        JSON.stringify([
          'Sequence of returns risk means poor early returns can permanently impair a retirement portfolio.',
          'The first 5-10 years of retirement are the "danger zone" — protecting the portfolio here is critical.',
          'A bond tent temporarily increases bonds at retirement, then gradually shifts back to stocks.',
          'Flexible withdrawal rates (adjusting spending with markets) dramatically improve portfolio survival.',
          'The Guyton-Klinger guardrails method can support 5.2-5.6% initial withdrawal rates with built-in adjustments.',
        ]),
        JSON.stringify([
          {
            question: 'What is sequence of returns risk?',
            options: [
              'The risk of investing in the wrong sequence of asset classes',
              'The danger that poor returns early in retirement permanently damage the portfolio',
              'The risk that returns come in alphabetical order',
              'The volatility of daily stock returns',
            ],
            answer: 1,
          },
          {
            question: 'What is a bond tent strategy?',
            options: [
              'Investing only in bonds during retirement',
              'Temporarily increasing bonds at retirement, then gradually shifting back to stocks',
              'Buying bonds in a tent-shaped yield pattern',
              'A strategy that requires living in a tent to reduce expenses',
            ],
            answer: 1,
          },
          {
            question: 'How do flexible withdrawal strategies improve portfolio survival?',
            options: [
              'By never withdrawing any money',
              'By reducing withdrawals during market downturns when the portfolio is stressed',
              'By only investing in guaranteed-return products',
              'By borrowing money instead of withdrawing during downturns',
            ],
            answer: 1,
          },
          {
            question: 'The Guyton-Klinger method allows what approximate initial withdrawal rate?',
            options: ['3.0%', '4.0%', '5.2-5.6%', '8.0%'],
            answer: 2,
          },
        ]),
        4,
      ]
    );

    // Lesson 5: Your Financial Independence Roadmap
    console.log('    📝 Lesson: Your Financial Independence Roadmap');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod21Id,
        'Your Financial Independence Roadmap',
        'Calculate your FI number, track milestones, create a glide path, and maintain motivation for the journey.',
        '16 min',
        '🗺️',
        JSON.stringify([
          {
            heading: 'Calculating Your FI Number',
            text: 'Your Financial Independence (FI) number is the total invested assets you need to sustain your desired lifestyle without employment income. Start by tracking your actual spending for 3-6 months to determine your true annual expenses — most people are surprised by their actual spending. Multiply your annual expenses by 25 (for a 4% withdrawal rate) or 28.6 (for a more conservative 3.5% rate) to get your FI number. Be sure to include expenses that will change in retirement: healthcare costs will likely increase (no employer subsidy), commuting costs disappear, and you may want to budget for travel or hobbies. Your FI number is not fixed — revisit it annually as your life circumstances and priorities evolve.',
          },
          {
            heading: 'Milestone Tracking',
            text: 'The FIRE journey is a marathon, not a sprint, and tracking milestones keeps you motivated and provides evidence of progress. Common milestones include: your first $100K (the hardest milestone because compounding has not kicked in yet), reaching Coast FIRE, achieving "FU money" (1-2 years of expenses saved), hitting 50% of your FI number, and crossing the finish line. Many FIRE practitioners track their net worth monthly and celebrate milestones to maintain momentum. Visualizing your progress through charts and graphs makes the abstract concept of financial independence feel tangible and achievable.',
          },
          {
            heading: 'Glide Path to Retirement',
            text: 'A glide path is the gradual transition from full-time work to financial independence, and it is healthier than an abrupt retirement for both financial and psychological reasons. Consider reducing work hours progressively: from full-time to 4 days a week, then 3 days, then consulting or freelancing part-time. This approach provides continued income that reduces portfolio withdrawals during the critical early retirement years (addressing sequence of returns risk), maintains social connections and purpose, and lets you test whether full retirement is actually what you want. Many people who planned for full FIRE discover they prefer a semi-retirement lifestyle with some meaningful work.',
          },
          {
            heading: 'Maintaining Motivation on the FIRE Journey',
            text: 'The biggest threat to achieving FIRE is not market returns or savings rate — it is losing motivation over what is often a 10-20 year journey. Lifestyle inflation (spending more as you earn more) is the most common motivation killer, gradually eroding your savings rate without you noticing. Surround yourself with like-minded people through FIRE communities, blogs, and local meetups. Focus on what financial independence enables (freedom, purpose, time with family) rather than what you are giving up. Remember that the journey itself has enormous value: the skills of intentional spending, intelligent investing, and thoughtful life design serve you well regardless of whether you ever fully "retire."',
          },
        ]),
        JSON.stringify([
          'Your FI number = annual expenses × 25 (or 28.6 for conservative planning).',
          'Track your actual spending for 3-6 months — most people underestimate their expenses.',
          'Celebrate milestones ($100K, Coast FIRE, 50% FI) to maintain momentum on a long journey.',
          'A gradual glide path from work to retirement is healthier financially and psychologically.',
          'Lifestyle inflation is the biggest threat — surround yourself with FIRE community for accountability.',
        ]),
        JSON.stringify([
          {
            question: 'How should you calculate your FI number?',
            options: [
              'Multiply your salary by 10',
              'Multiply your actual annual expenses by 25 (for a 4% withdrawal rate)',
              'Save until you have $1 million',
              'Multiply your rent by 300',
            ],
            answer: 1,
          },
          {
            question: 'Why is the first $100K considered the hardest FIRE milestone?',
            options: [
              'Because taxes take most of your savings until $100K',
              'Because compounding has not had time to meaningfully contribute to growth',
              'Because banks do not offer good rates until you hit $100K',
              'Because most people get fired before reaching $100K',
            ],
            answer: 1,
          },
          {
            question: 'What is a "glide path" to retirement?',
            options: [
              'An investment strategy that only uses index funds',
              'A gradual transition from full-time work to financial independence',
              'A type of bond fund that matures at retirement',
              'A tax strategy for retirees',
            ],
            answer: 1,
          },
          {
            question: 'What is the biggest threat to achieving FIRE over a long journey?',
            options: [
              'Stock market crashes',
              'High taxes',
              'Lifestyle inflation that gradually erodes savings rate',
              'Rising interest rates',
            ],
            answer: 2,
          },
        ]),
        5,
      ]
    );

    console.log('✅ PRO Course 3 complete.\n');

    // =====================================================
    // PRO COURSE 4: Macroeconomics for Investors
    // =====================================================
    console.log('📚 Inserting PRO Course 4: Macroeconomics for Investors...');
    const course4 = await pool.query(
      `INSERT INTO courses (title, description, level, icon, color, sort_order, is_pro)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        'Macroeconomics for Investors',
        'Understand how the economy drives markets. Master interest rates, inflation, Fed policy, business cycles, and geopolitics — the forces that move every asset class.',
        'advanced',
        '🌐',
        '#059669',
        11,
        true,
      ]
    );
    const course4Id = course4.rows[0].id;

    // Module 22: Interest Rates & The Federal Reserve
    console.log('  📦 Module 22: Interest Rates & The Federal Reserve');
    const mod22 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course4Id,
        'Interest Rates & The Federal Reserve',
        'Understand how the Fed controls interest rates and how monetary policy drives every asset class',
        22,
      ]
    );
    const mod22Id = mod22.rows[0].id;

    // Lesson 1: How Interest Rates Move Markets
    console.log('    📝 Lesson: How Interest Rates Move Markets');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod22Id,
        'How Interest Rates Move Markets',
        'Learn how the federal funds rate affects stocks, bonds, real estate, and the broader economy.',
        '16 min',
        '📊',
        JSON.stringify([
          {
            heading: 'The Federal Funds Rate',
            text: 'The federal funds rate is the interest rate at which banks lend to each other overnight, and it is the most important rate in the financial system because all other rates are derived from it. When the Fed raises this rate, borrowing becomes more expensive across the entire economy — mortgages, car loans, credit cards, and corporate debt all cost more. When the Fed lowers it, the opposite occurs: borrowing becomes cheaper, encouraging spending and investment. The federal funds rate effectively acts as the "price of money" in the economy, and its movement ripples through every asset class.',
          },
          {
            heading: 'How Rates Affect Stocks',
            text: 'Interest rates affect stock valuations through multiple channels. Higher rates increase the discount rate used to value future earnings, making future cash flows worth less today — this particularly hurts high-growth stocks that depend on distant future earnings. Higher rates also increase borrowing costs for companies, reducing profit margins and making expansion more expensive. Additionally, higher rates make bonds more attractive relative to stocks, causing some investors to shift from equities to fixed income. Historically, the stock market has performed well during slow, gradual rate-hiking cycles but poorly during sharp, unexpected rate increases.',
          },
          {
            heading: 'How Rates Affect Bonds and Real Estate',
            text: 'Bond prices move inversely to interest rates — when rates rise, existing bond prices fall because new bonds offer higher yields. This relationship is direct and mathematical: a 1% rise in rates causes a 10-year bond to lose approximately 8% of its value. Real estate is similarly sensitive because property values are heavily influenced by mortgage rates. When mortgage rates drop from 7% to 5%, the monthly payment on a $400,000 mortgage falls by about $550, making homes more affordable and pushing prices higher. The same dynamic works in reverse: rising rates reduce affordability and put downward pressure on property values.',
          },
          {
            heading: 'Rate Hiking vs. Rate Cutting Cycles',
            text: 'The Fed\'s interest rate policy moves in cycles that typically last 2-5 years. Rate hiking cycles occur when the economy is growing too fast and inflation is rising — the Fed raises rates to cool things down. Rate cutting cycles happen during economic slowdowns or recessions — the Fed lowers rates to stimulate growth. Each cycle creates distinct investment environments: early in a cutting cycle, bonds rally and growth stocks surge; late in a hiking cycle, value stocks and cash outperform while bonds and growth stocks suffer. Understanding where you are in the rate cycle is crucial for asset allocation decisions.',
          },
          {
            heading: 'The Yield Curve',
            text: 'The yield curve plots interest rates for government bonds across different maturities, from 3-month to 30-year. A normal (upward-sloping) yield curve means long-term rates are higher than short-term rates, reflecting healthy economic expectations. A flat curve suggests slowing growth, and an inverted curve (short-term rates higher than long-term) has predicted nearly every U.S. recession in the past 60 years. The most closely watched spread is the 2-year vs. 10-year Treasury yield: when the 2-year yield exceeds the 10-year yield, a recession has historically followed within 6-24 months.',
          },
        ]),
        JSON.stringify([
          'The federal funds rate is the base rate from which all other borrowing costs are derived.',
          'Higher rates hurt growth stocks most because they reduce the present value of future earnings.',
          'Bond prices fall when rates rise — a 1% rate increase can drop a 10-year bond ~8%.',
          'Rate hiking/cutting cycles create distinct investment environments for different asset classes.',
          'An inverted yield curve (2s10s) has predicted nearly every U.S. recession in the past 60 years.',
        ]),
        JSON.stringify([
          {
            question: 'What is the federal funds rate?',
            options: [
              'The interest rate on savings accounts',
              'The rate at which banks lend to each other overnight',
              'The tax rate on federal investments',
              'The guaranteed return on government bonds',
            ],
            answer: 1,
          },
          {
            question: 'How do rising interest rates typically affect growth stocks?',
            options: [
              'They boost growth stock valuations',
              'They have no effect on stock prices',
              'They reduce the present value of future earnings, hurting growth stocks',
              'They only affect bond prices, not stocks',
            ],
            answer: 2,
          },
          {
            question: 'What happens to existing bond prices when interest rates rise?',
            options: [
              'Bond prices rise',
              'Bond prices stay the same',
              'Bond prices fall',
              'Bond prices become volatile but unchanged on average',
            ],
            answer: 2,
          },
          {
            question: 'What does an inverted yield curve historically predict?',
            options: [
              'A stock market rally',
              'A period of high inflation',
              'An upcoming recession',
              'A Fed rate hike',
            ],
            answer: 2,
          },
        ]),
        1,
      ]
    );

    // Lesson 2: The Federal Reserve Explained
    console.log('    📝 Lesson: The Federal Reserve Explained');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod22Id,
        'The Federal Reserve Explained',
        'Understand the Fed\'s dual mandate, FOMC meetings, quantitative easing, and how to interpret Fed communications.',
        '17 min',
        '🏛️',
        JSON.stringify([
          {
            heading: 'The Fed\'s Dual Mandate',
            text: 'The Federal Reserve has two primary objectives set by Congress: maximum employment and stable prices (targeting approximately 2% inflation). These two goals often conflict — policies that boost employment (low rates, easy money) can fuel inflation, while policies that control inflation (high rates, tight money) can increase unemployment. The Fed constantly balances these competing objectives, and its policy decisions reflect which mandate it considers more at risk at any given time. When inflation is low and unemployment is high (like 2020), the Fed prioritizes jobs with easy money; when inflation is high (like 2022), it tightens aggressively even at the risk of slower growth.',
          },
          {
            heading: 'FOMC Meetings and Decision-Making',
            text: 'The Federal Open Market Committee (FOMC) meets eight times per year (roughly every six weeks) to set monetary policy. The committee consists of 12 voting members: the 7 Board of Governors and 5 of the 12 regional Fed presidents (rotating). After each meeting, the FOMC releases a statement summarizing its decision and economic outlook, followed by the Chair\'s press conference. Markets parse every word of these communications for clues about future policy direction. The "dot plot," released quarterly, shows each member\'s projection for the future path of interest rates, providing the market with the Fed\'s collective forecast.',
          },
          {
            heading: 'Quantitative Easing and Tightening',
            text: 'When the federal funds rate reaches zero and the economy still needs stimulus, the Fed turns to quantitative easing (QE) — buying large quantities of Treasury bonds and mortgage-backed securities to inject money into the financial system. QE pushes bond prices up and yields down, encourages risk-taking, and supports asset prices across the board. Quantitative tightening (QT) is the reverse: the Fed reduces its holdings by letting bonds mature without reinvesting, draining liquidity from the system. During the 2020-2021 QE program, the Fed\'s balance sheet grew from $4 trillion to nearly $9 trillion, creating massive liquidity that flowed into stocks, crypto, and real estate.',
          },
          {
            heading: 'Forward Guidance and Market Impact',
            text: 'Forward guidance is the Fed\'s practice of communicating its policy intentions to markets before actually implementing changes. By signaling future rate moves, the Fed can influence financial conditions immediately — markets price in expected changes before they happen. Phrases like "patient approach," "data-dependent," or "restrictive for some time" carry enormous weight because traders analyze every word change between statements. The CME FedWatch tool tracks market-implied probabilities of future rate changes, letting investors see exactly what the bond market expects. Understanding how to interpret Fed communications gives investors a significant edge in positioning their portfolios ahead of policy shifts.',
          },
        ]),
        JSON.stringify([
          'The Fed balances two often-conflicting mandates: maximum employment and 2% inflation.',
          'The FOMC meets 8 times per year; its statements and dot plot guide market expectations.',
          'QE injects liquidity by buying bonds; QT drains liquidity by letting bonds mature without reinvesting.',
          'Forward guidance allows the Fed to influence markets through communication before action.',
          'The CME FedWatch tool shows market-implied probabilities of future rate decisions.',
        ]),
        JSON.stringify([
          {
            question: 'What is the Fed\'s dual mandate?',
            options: [
              'Maximize GDP and minimize government debt',
              'Maximum employment and stable prices (about 2% inflation)',
              'Control the stock market and manage currency exchange rates',
              'Regulate banks and manage the federal budget',
            ],
            answer: 1,
          },
          {
            question: 'How often does the FOMC meet to set monetary policy?',
            options: [
              'Monthly',
              'Four times per year',
              'Eight times per year',
              'Weekly',
            ],
            answer: 2,
          },
          {
            question: 'What is quantitative easing (QE)?',
            options: [
              'Raising interest rates to slow the economy',
              'The Fed buying bonds to inject money into the financial system',
              'Reducing taxes to stimulate spending',
              'Printing physical currency to distribute to banks',
            ],
            answer: 1,
          },
          {
            question: 'What is the "dot plot"?',
            options: [
              'A chart showing historical stock market returns',
              'Each FOMC member\'s projection for future interest rates',
              'A visualization of inflation data',
              'A map of Federal Reserve bank locations',
            ],
            answer: 1,
          },
        ]),
        2,
      ]
    );

    // Lesson 3: Inflation: The Silent Wealth Destroyer
    console.log('    📝 Lesson: Inflation: The Silent Wealth Destroyer');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod22Id,
        'Inflation: The Silent Wealth Destroyer',
        'Understand CPI, PCE, core inflation, and how to protect your portfolio with inflation hedges.',
        '15 min',
        '🔥',
        JSON.stringify([
          {
            heading: 'CPI and PCE: Measuring Inflation',
            text: 'The Consumer Price Index (CPI) and Personal Consumption Expenditures (PCE) are the two primary measures of inflation in the U.S. CPI measures the price changes of a fixed basket of goods and services that urban consumers buy, while PCE measures what consumers actually spend (adjusting for substitution effects when prices change). The Fed officially targets 2% PCE inflation, which tends to run 0.3-0.5% lower than CPI. Both are reported monthly and can move markets significantly — a hotter-than-expected inflation print often triggers a selloff in both stocks and bonds as markets price in tighter monetary policy.',
          },
          {
            heading: 'Core Inflation vs. Headline Inflation',
            text: 'Headline inflation includes all items in the basket, while core inflation excludes volatile food and energy prices. The Fed pays more attention to core inflation because food and energy prices swing wildly with weather, geopolitics, and supply disruptions, making them unreliable indicators of the underlying inflation trend. "Supercore" inflation (core services excluding housing) has become increasingly important as the Fed tries to gauge sticky inflation in the services sector. Understanding which measure the Fed is focused on at any given time helps investors anticipate policy decisions and position accordingly.',
          },
          {
            heading: 'TIPS and I-Bonds: Direct Inflation Protection',
            text: 'Treasury Inflation-Protected Securities (TIPS) are U.S. government bonds whose principal adjusts with CPI inflation, guaranteeing a real (inflation-adjusted) return. If you buy a TIPS bond yielding 1.5% and inflation runs at 3%, your total nominal return is about 4.5%. I-Bonds are savings bonds that combine a fixed rate with a variable rate tied to CPI inflation, currently limited to $10,000 per person per year in purchases. Both TIPS and I-Bonds protect against unexpected inflation, but they have different tax treatments and liquidity profiles — TIPS are tradeable on secondary markets, while I-Bonds must be held for at least one year.',
          },
          {
            heading: 'Other Inflation Hedges',
            text: 'Beyond TIPS and I-Bonds, several asset classes historically provide inflation protection. Gold has been a traditional inflation hedge for centuries, though its relationship with inflation is inconsistent over shorter periods. Real estate tends to be an excellent long-term inflation hedge because both property values and rents rise with inflation, and mortgage debt is eroded by rising prices. Commodities (oil, agricultural products, metals) tend to rise with inflation since they are a key component of the price index itself. Stocks with pricing power — companies that can raise prices without losing customers — are the best equity-based inflation protection.',
          },
        ]),
        JSON.stringify([
          'CPI and PCE are the two main inflation measures; the Fed officially targets 2% PCE inflation.',
          'Core inflation (excluding food and energy) is more important to the Fed than headline inflation.',
          'TIPS and I-Bonds provide direct inflation protection through CPI-linked adjustments.',
          'Real estate, commodities, and gold offer additional inflation hedging across different time horizons.',
          'Companies with strong pricing power are the best equity-based inflation protection.',
        ]),
        JSON.stringify([
          {
            question: 'Which inflation measure does the Fed officially target?',
            options: [
              'CPI (Consumer Price Index)',
              'PCE (Personal Consumption Expenditures)',
              'PPI (Producer Price Index)',
              'GDP Deflator',
            ],
            answer: 1,
          },
          {
            question: 'Why does the Fed focus on core inflation rather than headline inflation?',
            options: [
              'Because core inflation is always higher',
              'Because food and energy prices are too volatile to indicate underlying inflation trends',
              'Because the Fed does not have data on food and energy prices',
              'Because headline inflation is not published monthly',
            ],
            answer: 1,
          },
          {
            question: 'What are TIPS?',
            options: [
              'Tax-advantaged investment partnership shares',
              'Treasury bonds whose principal adjusts with CPI inflation',
              'Short-term commercial paper issued by banks',
              'High-yield bonds with inflation-linked coupons',
            ],
            answer: 1,
          },
          {
            question: 'Which asset class is generally considered the best long-term inflation hedge?',
            options: [
              'Cash and savings accounts',
              'Long-term government bonds',
              'Real estate (property values and rents rise with inflation)',
              'Cryptocurrency',
            ],
            answer: 2,
          },
        ]),
        3,
      ]
    );

    // Lesson 4: The Yield Curve: Recession Predictor
    console.log('    📝 Lesson: The Yield Curve: Recession Predictor');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod22Id,
        'The Yield Curve: Recession Predictor',
        'Learn about normal vs. inverted yield curves, the 2s10s spread, and how to position when recession signals flash.',
        '14 min',
        '📉',
        JSON.stringify([
          {
            heading: 'Understanding the Yield Curve',
            text: 'The yield curve is a graph that plots the interest rates of government bonds across different maturities, from short-term (3-month) to long-term (30-year). In a healthy economy, the yield curve slopes upward — investors demand higher yields for locking up money for longer periods due to inflation risk and opportunity cost. A normal yield curve reflects optimism about future economic growth, with the spread between short and long rates typically around 1-2 percentage points. The shape of the yield curve tells you what the bond market collectively expects about future economic conditions, interest rates, and inflation.',
          },
          {
            heading: 'The Inverted Yield Curve',
            text: 'A yield curve inversion occurs when short-term rates exceed long-term rates, creating a downward-sloping curve. This unusual situation typically happens when the Fed has raised short-term rates aggressively to fight inflation, while long-term rates decline as the bond market anticipates an economic slowdown. The inversion signals that investors are so pessimistic about the future that they accept lower returns for longer maturities — essentially pricing in rate cuts and economic weakness. An inverted yield curve has preceded every U.S. recession since 1970, with only one false positive, making it one of the most reliable recession indicators in economics.',
          },
          {
            heading: 'The 2s10s Spread',
            text: 'The most closely watched yield curve measure is the "2s10s spread" — the difference between the 10-year and 2-year Treasury yields. When this spread turns negative (inverts), recession warning lights flash. Historically, a recession has followed a 2s10s inversion with a lag of 6-24 months, giving investors meaningful time to adjust portfolios. The 3-month/10-year spread is actually a slightly better predictor, but the 2s10s gets more media attention and trader focus. Importantly, the inversion itself does not cause the recession — it reflects the market\'s assessment that the Fed has overtightened and an economic downturn is likely.',
          },
          {
            heading: 'What to Do When the Yield Curve Inverts',
            text: 'When the yield curve inverts, consider gradually shifting your portfolio toward defensive positioning: increase allocation to high-quality bonds (which rally during recessions as rates are cut), reduce exposure to cyclical sectors (financials, industrials, consumer discretionary), and increase allocation to defensive sectors (utilities, healthcare, consumer staples). Build your cash position for buying opportunities during the eventual downturn. However, avoid panic selling — the stock market often continues rising for 6-18 months after the initial inversion before a recession hits. The key is gradual, measured preparation rather than abrupt changes.',
          },
        ]),
        JSON.stringify([
          'A normal upward-sloping yield curve reflects healthy economic expectations.',
          'An inverted yield curve has preceded every U.S. recession since 1970.',
          'The 2s10s spread (10-year minus 2-year yield) is the most closely watched recession indicator.',
          'Recessions typically follow inversions by 6-24 months, giving investors time to prepare.',
          'Shift gradually to defensive positioning after an inversion — do not panic sell.',
        ]),
        JSON.stringify([
          {
            question: 'What does a normal (healthy) yield curve look like?',
            options: [
              'Flat — all maturities have the same yield',
              'Upward-sloping — longer maturities have higher yields',
              'Downward-sloping — shorter maturities have higher yields',
              'U-shaped — middle maturities have the lowest yields',
            ],
            answer: 1,
          },
          {
            question: 'What is the "2s10s spread"?',
            options: [
              'The difference between 2% and 10% interest rates',
              'The difference between the 10-year and 2-year Treasury yields',
              'A spread trade between 2 stocks and 10 bonds',
              'The gap between the stock market and bond market returns',
            ],
            answer: 1,
          },
          {
            question: 'How long after a yield curve inversion does a recession typically follow?',
            options: [
              'Immediately',
              '1-3 months',
              '6-24 months',
              '3-5 years',
            ],
            answer: 2,
          },
          {
            question: 'What should investors avoid doing right after a yield curve inversion?',
            options: [
              'Reviewing their portfolio allocation',
              'Building cash for buying opportunities',
              'Panic selling everything immediately',
              'Increasing defensive sector exposure',
            ],
            answer: 2,
          },
        ]),
        4,
      ]
    );

    // Module 23: Global Markets & Geopolitics
    console.log('  📦 Module 23: Global Markets & Geopolitics');
    const mod23 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course4Id,
        'Global Markets & Geopolitics',
        'Understand how business cycles, currencies, geopolitics, and economic indicators drive global investment opportunities',
        23,
      ]
    );
    const mod23Id = mod23.rows[0].id;

    // Lesson 1: Business Cycles & Sector Rotation
    console.log('    📝 Lesson: Business Cycles & Sector Rotation');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod23Id,
        'Business Cycles & Sector Rotation',
        'Learn the four phases of the business cycle and which sectors lead in each phase.',
        '16 min',
        '🔄',
        JSON.stringify([
          {
            heading: 'The Four Phases of the Business Cycle',
            text: 'Every economy moves through a recurring cycle of four phases: expansion (growing GDP, falling unemployment, rising confidence), peak (maximum economic activity, capacity constraints, inflationary pressures), contraction/recession (declining GDP, rising unemployment, falling confidence), and trough (the bottom, where the economy stabilizes before recovering). These cycles typically last 5-10 years from peak to peak, though the length varies significantly. Understanding where the economy sits in the cycle is crucial because different asset classes and sectors perform best in different phases, and the winners of one phase often become the laggards of the next.',
          },
          {
            heading: 'Sector Rotation Strategy',
            text: 'Sector rotation is the strategy of shifting portfolio allocations to sectors expected to outperform based on the current phase of the business cycle. During early expansion, cyclical sectors (consumer discretionary, technology, industrials) lead because they benefit most from reviving economic activity. During late expansion, energy and materials stocks outperform as commodity prices rise with demand. During contraction, defensive sectors (utilities, healthcare, consumer staples) provide stability. During recovery from a trough, financials and real estate typically lead as interest rates drop and lending recovers. This rotation pattern has been consistent across decades of business cycles.',
          },
          {
            heading: 'Cyclical vs. Defensive Stocks',
            text: 'Cyclical stocks are companies whose earnings are highly sensitive to the economic cycle — think automakers, airlines, luxury retailers, and home builders. These stocks can double during expansions but also drop 40-60% during recessions. Defensive stocks are companies with stable demand regardless of economic conditions — utilities, healthcare, and consumer staples (toothpaste, food, cleaning products). People need electricity, medicine, and groceries in any economy. Defensive stocks underperform during bull markets but significantly outperform during bear markets, providing essential portfolio stability. A well-diversified portfolio includes both cyclical and defensive holdings, with the mix adjusted based on the cycle phase.',
          },
          {
            heading: 'Identifying the Current Cycle Phase',
            text: 'Determining the current cycle phase requires watching a combination of leading indicators. The Conference Board\'s Leading Economic Index (LEI), which combines 10 components including manufacturing orders, stock prices, and building permits, has a strong track record of signaling turns. PMI (Purchasing Managers Index) readings above 50 indicate expansion, below 50 indicate contraction. Consumer confidence surveys, initial jobless claims, and the yield curve all provide additional cycle-phase signals. No single indicator is perfect, but when multiple indicators agree, the signal becomes highly reliable. Professional fund managers constantly monitor these data points to time their sector rotation strategies.',
          },
        ]),
        JSON.stringify([
          'Business cycles have four phases: expansion, peak, contraction, and trough, typically lasting 5-10 years.',
          'Cyclical sectors (tech, consumer discretionary) lead in early expansion; defensives lead in contraction.',
          'Energy and materials typically outperform during late expansion as commodity demand peaks.',
          'Cyclical stocks can double in expansions but drop 40-60% in recessions; defensives provide stability.',
          'Use LEI, PMI, consumer confidence, and jobless claims to identify the current cycle phase.',
        ]),
        JSON.stringify([
          {
            question: 'What are the four phases of the business cycle?',
            options: [
              'Bull, bear, flat, volatile',
              'Expansion, peak, contraction, trough',
              'Growth, maturity, decline, rebirth',
              'Inflation, deflation, stagflation, reflation',
            ],
            answer: 1,
          },
          {
            question: 'Which sectors typically lead during early economic expansion?',
            options: [
              'Utilities and healthcare',
              'Energy and materials',
              'Technology and consumer discretionary',
              'Real estate and financials',
            ],
            answer: 2,
          },
          {
            question: 'What distinguishes cyclical stocks from defensive stocks?',
            options: [
              'Cyclical stocks pay dividends; defensive stocks do not',
              'Cyclical stocks have higher P/E ratios',
              'Cyclical earnings swing with the economy; defensive earnings remain stable',
              'Cyclical stocks are only in the technology sector',
            ],
            answer: 2,
          },
          {
            question: 'What does a PMI reading below 50 indicate?',
            options: [
              'Strong economic expansion',
              'Manufacturing sector contraction',
              'Low inflation',
              'Rising stock prices',
            ],
            answer: 1,
          },
        ]),
        1,
      ]
    );

    // Lesson 2: Currency Wars & Trade Policy
    console.log('    📝 Lesson: Currency Wars & Trade Policy');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod23Id,
        'Currency Wars & Trade Policy',
        'Understand how currency strength, trade deficits, tariffs, and the petrodollar system affect your investments.',
        '15 min',
        '💱',
        JSON.stringify([
          {
            heading: 'Strong vs. Weak Dollar Impact',
            text: 'The U.S. dollar\'s strength relative to other currencies has profound effects on investment returns. A strong dollar makes U.S. imports cheaper (benefiting consumers) but makes U.S. exports more expensive globally (hurting exporters like Boeing, Caterpillar, and agricultural companies). For investors, a strong dollar reduces the returns of international investments when converted back to USD — a European stock might gain 10% in euros but only 5% in dollar terms if the dollar strengthened 5% against the euro. Conversely, a weakening dollar boosts international returns and helps U.S. multinational companies by making their overseas revenues worth more in dollar terms.',
          },
          {
            heading: 'Trade Deficits and Their Impact',
            text: 'A trade deficit occurs when a country imports more goods and services than it exports. The U.S. has run a trade deficit for decades, currently around $800 billion annually. While often portrayed negatively, a trade deficit is not inherently bad — it reflects strong consumer demand and the dollar\'s role as the global reserve currency. However, large persistent deficits can weaken the domestic manufacturing base and create political pressure for protectionist trade policies. Trade deficit data is released monthly and can affect currency markets, as large deficits put downward pressure on the domestic currency.',
          },
          {
            heading: 'Tariffs and Trade Wars',
            text: 'Tariffs are taxes on imported goods designed to protect domestic industries or punish trading partners. While they can help specific domestic industries in the short term, tariffs increase costs for consumers and businesses that rely on imports, often leading to retaliatory tariffs that hurt exporters. The 2018-2019 U.S.-China trade war demonstrated these effects: U.S. farmers lost Chinese export markets, while U.S. companies faced higher input costs for electronics and raw materials. For investors, trade wars create uncertainty and volatility, but they also create opportunities in domestic companies that benefit from protection and in supply chain shifts to alternative countries.',
          },
          {
            heading: 'The Petrodollar System',
            text: 'Since the 1970s, global oil has been predominantly priced and traded in U.S. dollars — the "petrodollar" system. This arrangement ensures constant global demand for dollars, supporting the currency\'s value and allowing the U.S. to borrow at lower rates than it otherwise could. Oil-exporting nations accumulate dollar reserves and often recycle them into U.S. Treasury bonds, helping finance U.S. government spending. Any serious challenge to the petrodollar system — such as major oil exporters accepting payment in other currencies — could weaken the dollar and increase U.S. borrowing costs. Recent moves by some nations to trade oil in yuan or other currencies have raised questions about the system\'s long-term stability.',
          },
        ]),
        JSON.stringify([
          'A strong dollar helps consumers but hurts exporters and reduces international investment returns.',
          'Trade deficits reflect consumer demand but can weaken domestic manufacturing.',
          'Tariffs protect specific industries but raise costs for consumers and invite retaliation.',
          'The petrodollar system underpins dollar demand and U.S. borrowing advantage globally.',
          'Currency moves can significantly impact international portfolio returns — hedge or diversify accordingly.',
        ]),
        JSON.stringify([
          {
            question: 'How does a strong U.S. dollar affect U.S. exporters?',
            options: [
              'It makes their products cheaper abroad, boosting sales',
              'It has no effect on exporters',
              'It makes their products more expensive abroad, hurting sales',
              'It only affects importers',
            ],
            answer: 2,
          },
          {
            question: 'What is a trade deficit?',
            options: [
              'When a country exports more than it imports',
              'When a country imports more than it exports',
              'When government spending exceeds revenue',
              'When stock market losses exceed gains',
            ],
            answer: 1,
          },
          {
            question: 'What is the primary effect of tariffs on consumers?',
            options: [
              'Lower prices on imported goods',
              'Higher prices on imported goods',
              'No change in consumer prices',
              'Lower taxes on domestic goods',
            ],
            answer: 1,
          },
          {
            question: 'What is the petrodollar system?',
            options: [
              'A U.S. tax on oil companies',
              'The practice of pricing and trading global oil predominantly in U.S. dollars',
              'An oil futures exchange in New York',
              'A system for converting oil profits into gold',
            ],
            answer: 1,
          },
        ]),
        2,
      ]
    );

    // Lesson 3: Emerging Markets
    console.log('    📝 Lesson: Emerging Markets: Risk & Opportunity');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod23Id,
        'Emerging Markets: Risk & Opportunity',
        'Understand why emerging markets can outperform long-term and the unique risks including political, currency, and corruption.',
        '15 min',
        '🌍',
        JSON.stringify([
          {
            heading: 'Why Emerging Markets Can Outperform',
            text: 'Emerging markets (EMs) include countries like China, India, Brazil, South Korea, and Taiwan — nations with rapidly growing economies and expanding middle classes. The investment case for EMs is compelling: they represent over 40% of global GDP and contain 85% of the world\'s population, yet account for only about 12% of global stock market capitalization. This underrepresentation means faster economic growth has room to translate into outsized stock market returns. From 2000-2010, EM stocks returned over 150% while the S&P 500 was essentially flat, demonstrating their potential to lead during certain decades.',
          },
          {
            heading: 'Political and Regulatory Risk',
            text: 'The primary risk unique to emerging markets is political and regulatory instability. Governments may suddenly change foreign investment rules, nationalize industries, impose capital controls, or take actions that destroy shareholder value without recourse. China\'s 2021 crackdown on technology companies wiped hundreds of billions of dollars from stocks like Alibaba and Tencent almost overnight. Russia\'s 2022 invasion of Ukraine effectively made Russian stocks uninvestable for foreign investors. These tail risks cannot be diversified away within a single country, which is why EM investors should spread exposure across multiple countries and regions rather than concentrating in any single market.',
          },
          {
            heading: 'Currency Risk in Emerging Markets',
            text: 'EM currencies can be highly volatile, and currency depreciation can devastate returns for foreign investors even when local stock markets are rising. For example, the Turkish lira lost over 80% of its value against the dollar from 2018-2023, meaning a Turkish stock that doubled in lira terms still lost money in dollar terms. Currency risk is driven by inflation differentials, current account balances, political stability, and central bank credibility. Some investors hedge currency risk using futures or options, while others accept it as part of the EM risk-reward package. Using dollar-denominated EM bond funds or ADRs (American Depositary Receipts) can provide EM exposure with reduced currency risk.',
          },
          {
            heading: 'Frontier Markets: The Next Frontier',
            text: 'Frontier markets are smaller, less developed economies that have not yet achieved EM status — countries like Vietnam, Nigeria, Bangladesh, and Kenya. These markets offer even higher growth potential but with greater risk and lower liquidity. Vietnam, for example, has been growing at 6-8% annually and is rapidly industrializing as manufacturing shifts from China. Frontier market funds provide diversified exposure to dozens of these economies, though trading volumes are lower and bid-ask spreads are wider than in developed or EM stocks. For patient investors with a 10-20 year horizon, a small allocation (2-5%) to frontier markets can boost portfolio returns through exposure to the world\'s fastest-growing economies.',
          },
        ]),
        JSON.stringify([
          'EMs represent 40%+ of global GDP but only ~12% of market cap — a potential opportunity for outsized returns.',
          'Political risk (regulation changes, nationalization) is the primary unique risk in EM investing.',
          'Currency depreciation can devastate EM returns even when local markets are rising.',
          'Diversify across multiple EM countries to reduce single-country political risk.',
          'Frontier markets (Vietnam, Nigeria, Bangladesh) offer the highest growth potential with the most risk.',
        ]),
        JSON.stringify([
          {
            question: 'What makes emerging markets attractive for long-term investors?',
            options: [
              'They have lower stock market volatility than developed markets',
              'They represent a large share of global GDP but a small share of stock market capitalization',
              'Their currencies are more stable than the U.S. dollar',
              'They are completely immune to global recessions',
            ],
            answer: 1,
          },
          {
            question: 'What is the biggest unique risk in emerging market investing?',
            options: [
              'Higher trading commissions',
              'Political and regulatory instability',
              'Lack of financial data',
              'Time zone differences',
            ],
            answer: 1,
          },
          {
            question: 'How can currency depreciation affect emerging market returns?',
            options: [
              'It always increases returns for foreign investors',
              'It has no impact on investment returns',
              'It can destroy returns even when local stock markets are rising',
              'It only affects bond investments, not stocks',
            ],
            answer: 2,
          },
          {
            question: 'What are frontier markets?',
            options: [
              'Markets at the border between two countries',
              'The largest and most developed stock markets',
              'Smaller, less developed economies that have not yet achieved emerging market status',
              'Markets that only trade agricultural commodities',
            ],
            answer: 2,
          },
        ]),
        3,
      ]
    );

    // Lesson 4: Geopolitical Risk & Your Portfolio
    console.log('    📝 Lesson: Geopolitical Risk & Your Portfolio');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod23Id,
        'Geopolitical Risk & Your Portfolio',
        'Learn how oil shocks, wars, sanctions, and supply chain disruptions affect markets and how to hedge.',
        '16 min',
        '⚔️',
        JSON.stringify([
          {
            heading: 'Oil Supply Shocks',
            text: 'Oil is the lifeblood of the global economy, and sudden supply disruptions can send shockwaves through every market. The 1973 Arab oil embargo quadrupled oil prices and triggered a severe recession; the 2022 Russia-Ukraine conflict caused oil to spike above $130 per barrel, fueling global inflation. Higher oil prices act as a tax on consumers and businesses, reducing discretionary spending and increasing production costs across nearly every industry. Energy stocks are the obvious beneficiaries of oil shocks, but investors should also consider the downstream effects: airlines, shipping companies, and chemical manufacturers suffer, while renewable energy companies may benefit from accelerated adoption.',
          },
          {
            heading: 'War Premiums and Conflict',
            text: 'Military conflicts create market uncertainty through multiple channels: disrupted trade routes, commodity supply shocks, increased government spending, sanctions, and the ever-present risk of escalation. Markets typically sell off sharply at the onset of conflict (the "war premium") but often recover relatively quickly once the initial shock passes and the scope of the conflict becomes clearer. Historical data shows that the average market drawdown from geopolitical events is about 5% and recovers within weeks to months. However, conflicts that directly affect major economies, critical supply chains, or nuclear-armed states carry tail risks that are impossible to quantify.',
          },
          {
            heading: 'Sanctions and Their Market Impact',
            text: 'Economic sanctions are financial weapons that can isolate entire countries from the global economic system. The 2022 sanctions on Russia froze over $300 billion in central bank reserves, excluded major Russian banks from SWIFT (the global payments system), and made Russian assets effectively worthless for foreign investors. Sanctions create investment risks not just in the targeted country but in companies with significant exposure to it — European banks with Russian operations, energy companies dependent on Russian gas, and agricultural firms reliant on Ukrainian grain all suffered. Understanding your portfolio\'s exposure to geopolitically sensitive regions is an essential risk management practice.',
          },
          {
            heading: 'Supply Chain Concentration Risk',
            text: 'The global economy\'s dependence on specific supply chain chokepoints creates geopolitical vulnerabilities that can affect investor portfolios. Taiwan produces over 90% of the world\'s most advanced semiconductors through TSMC — any disruption (from conflict, natural disaster, or political tension) could cripple the global technology industry. The Strait of Hormuz handles 20% of global oil shipments; the Suez Canal carries 12% of global trade. Investors should understand these concentration risks and consider positions in companies that are diversifying their supply chains, as well as defense and cybersecurity stocks that benefit from increased geopolitical spending.',
          },
          {
            heading: 'Hedging Geopolitical Risk',
            text: 'While you cannot predict specific geopolitical events, you can build a portfolio that is resilient to them. Gold is the classic geopolitical hedge — it tends to rise during crises as investors seek safety. U.S. Treasury bonds are another traditional safe haven, typically rallying when global uncertainty spikes. Defense stocks (Lockheed Martin, Raytheon, Northrop Grumman) and cybersecurity companies often benefit from increased geopolitical tensions. Diversification across geographies reduces the impact of any single regional crisis. Most importantly, maintain adequate cash reserves and avoid leverage during periods of elevated geopolitical risk — the worst losses occur when forced selling meets illiquid markets.',
          },
        ]),
        JSON.stringify([
          'Oil supply shocks act as a tax on the economy, hurting consumers and most industries while benefiting energy stocks.',
          'Markets typically sell off 5% on average during geopolitical events but recover within weeks to months.',
          'Sanctions can make entire countries\' assets worthless for foreign investors virtually overnight.',
          'Supply chain chokepoints (Taiwan chips, Strait of Hormuz, Suez Canal) create concentrated geopolitical risk.',
          'Hedge with gold, Treasuries, defense stocks, and geographic diversification — avoid leverage during uncertainty.',
        ]),
        JSON.stringify([
          {
            question: 'How do oil supply shocks typically affect the broader economy?',
            options: [
              'They boost consumer spending',
              'They have no effect outside the energy sector',
              'They act as a tax, reducing spending and increasing costs across most industries',
              'They lower inflation',
            ],
            answer: 2,
          },
          {
            question: 'What is the average market drawdown from geopolitical events historically?',
            options: ['About 1%', 'About 5%', 'About 20%', 'About 40%'],
            answer: 1,
          },
          {
            question: 'Why is Taiwan a major geopolitical risk for the technology industry?',
            options: [
              'Taiwan produces most of the world\'s display screens',
              'Taiwan controls most global fiber optic cables',
              'Taiwan produces over 90% of the world\'s most advanced semiconductors',
              'Taiwan hosts most of the world\'s data centers',
            ],
            answer: 2,
          },
          {
            question: 'Which asset is the classic safe-haven hedge during geopolitical crises?',
            options: [
              'Cryptocurrency',
              'Gold',
              'High-yield bonds',
              'Emerging market stocks',
            ],
            answer: 1,
          },
        ]),
        4,
      ]
    );

    // Lesson 5: Reading Economic Indicators
    console.log('    📝 Lesson: Reading Economic Indicators');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod23Id,
        'Reading Economic Indicators',
        'Master GDP, unemployment, PMI, consumer confidence, and the difference between leading and lagging indicators.',
        '16 min',
        '📅',
        JSON.stringify([
          {
            heading: 'GDP: The Big Picture',
            text: 'Gross Domestic Product (GDP) measures the total value of all goods and services produced in an economy and is the broadest measure of economic health. In the U.S., GDP is reported quarterly with three releases: the advance estimate (30 days after quarter-end), the second estimate (60 days), and the final estimate (90 days). Two consecutive quarters of negative GDP growth is the common (though unofficial) definition of a recession. However, GDP is a lagging indicator — by the time it confirms a recession, the economy has already been contracting for months. Investors use GDP data to confirm trends rather than predict them, and markets often react more to how GDP compares to expectations than to the absolute number.',
          },
          {
            heading: 'Unemployment and Jobs Data',
            text: 'The monthly jobs report (Non-Farm Payrolls) is one of the most market-moving economic releases, published on the first Friday of each month. It reports how many jobs were added or lost, the unemployment rate, and average hourly earnings (a proxy for wage inflation). Strong jobs numbers (high payroll additions, low unemployment) are generally positive for the economy but can be negative for markets if they signal the Fed will keep rates higher for longer. The unemployment rate is a lagging indicator that often peaks months after a recession has ended. Leading labor market indicators include initial jobless claims (weekly), job openings (JOLTS), and the quits rate — which measures worker confidence in their ability to find new jobs.',
          },
          {
            heading: 'PMI and Consumer Confidence',
            text: 'The Purchasing Managers Index (PMI) is a leading indicator based on monthly surveys of business purchasing managers across manufacturing and services sectors. A PMI reading above 50 indicates expansion; below 50 indicates contraction. The ISM Manufacturing PMI and ISM Services PMI are released on the first and third business days of each month and are among the earliest signals of economic turning points. Consumer confidence surveys (Conference Board and University of Michigan) measure household sentiment about current conditions and future expectations. When consumer confidence drops sharply, it often precedes a pullback in consumer spending, which represents roughly 70% of U.S. GDP.',
          },
          {
            heading: 'Housing Starts and Other Indicators',
            text: 'Housing starts (new residential construction) are a powerful leading indicator because building a home involves months of planning, permits, and financing — making it a forward-looking indicator of economic confidence. Building permits (even more leading than starts) show developer expectations for future demand. Other important indicators include retail sales (consumer spending strength), industrial production (manufacturing activity), and the Leading Economic Index (LEI), which combines 10 indicators into a single composite measure. The LEI has declined before every recession in the past 60 years, though the lead time varies from 2 to 20 months.',
          },
          {
            heading: 'Leading vs. Lagging Indicators and the Economic Calendar',
            text: 'Leading indicators signal future economic activity (PMI, building permits, initial jobless claims, yield curve, stock prices), while lagging indicators confirm trends that have already occurred (unemployment rate, GDP, CPI). Coincident indicators reflect current conditions (industrial production, personal income, retail sales). Successful investors focus primarily on leading indicators to position ahead of economic turns, while using lagging indicators for confirmation. The economic calendar (available on sites like Investing.com, MarketWatch, or Bloomberg) lists all upcoming data releases with their expected impact — high, medium, or low — and the consensus forecast. Comparing actual releases to expectations drives short-term market moves.',
          },
        ]),
        JSON.stringify([
          'GDP is the broadest economic measure but is a lagging indicator that confirms rather than predicts trends.',
          'Non-Farm Payrolls (first Friday of each month) is one of the most market-moving economic releases.',
          'PMI above 50 = expansion, below 50 = contraction — it is one of the earliest leading indicators.',
          'Housing starts and building permits are powerful leading indicators of economic confidence.',
          'Focus on leading indicators to position ahead of economic turns; use lagging indicators for confirmation.',
        ]),
        JSON.stringify([
          {
            question: 'How many consecutive quarters of negative GDP define a common recession?',
            options: ['One', 'Two', 'Three', 'Four'],
            answer: 1,
          },
          {
            question: 'When is the monthly U.S. jobs report (Non-Farm Payrolls) released?',
            options: [
              'The last day of each month',
              'The first Friday of each month',
              'Every Wednesday',
              'The 15th of each month',
            ],
            answer: 1,
          },
          {
            question: 'What does a PMI reading of 48 indicate?',
            options: [
              'Strong economic expansion',
              'Economic contraction in that sector',
              'Neutral economic conditions',
              'High inflation',
            ],
            answer: 1,
          },
          {
            question: 'What type of indicator is the unemployment rate?',
            options: [
              'A leading indicator',
              'A coincident indicator',
              'A lagging indicator',
              'A composite indicator',
            ],
            answer: 2,
          },
        ]),
        5,
      ]
    );

    console.log('✅ PRO Course 4 complete.\n');

    // Final summary
    const courseCount = await pool.query('SELECT COUNT(*) FROM courses');
    const moduleCount = await pool.query('SELECT COUNT(*) FROM modules');
    const lessonCount = await pool.query('SELECT COUNT(*) FROM lessons');
    const proCount = await pool.query('SELECT COUNT(*) FROM courses WHERE is_pro = true');

    console.log('🎉 PRO seed complete!');
    console.log(`   📚 Total Courses: ${courseCount.rows[0].count} (${proCount.rows[0].count} PRO)`);
    console.log(`   📦 Total Modules: ${moduleCount.rows[0].count}`);
    console.log(`   📝 Total Lessons: ${lessonCount.rows[0].count}`);
  } catch (err) {
    console.error('❌ PRO seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedPro();
