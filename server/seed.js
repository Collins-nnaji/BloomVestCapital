require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await pool.query('DELETE FROM lessons');
    await pool.query('DELETE FROM modules');
    await pool.query('DELETE FROM courses');
    console.log('✅ Existing data cleared.\n');

    // =====================================================
    // COURSE 1: Investing Fundamentals
    // =====================================================
    console.log('📚 Inserting Course 1: Investing Fundamentals...');
    const course1 = await pool.query(
      `INSERT INTO courses (title, description, level, icon, color, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'Investing Fundamentals',
        'Master the essentials of investing. Learn why investing matters, understand different asset types, and build your first portfolio with confidence.',
        'beginner',
        '📚',
        '#22c55e',
        1,
      ]
    );
    const course1Id = course1.rows[0].id;

    // Module 1: Getting Started with Investing
    console.log('  📦 Module 1: Getting Started with Investing');
    const mod1 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course1Id,
        'Getting Started with Investing',
        'Understand the basics of investing and set yourself up for success',
        1,
      ]
    );
    const mod1Id = mod1.rows[0].id;

    // Lesson 1
    console.log('    📝 Lesson 1: What Is Investing & Why It Matters');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod1Id,
        'What Is Investing & Why It Matters',
        'Learn the definition of investing and why it is essential for building long-term wealth.',
        '10 min',
        '🌱',
        JSON.stringify([
          {
            heading: 'What Is Investing?',
            text: 'Investing is the act of allocating money into assets — such as stocks, bonds, or real estate — with the expectation that they will grow in value over time. Unlike saving, which preserves your money at a fixed rate, investing puts your capital to work so it can generate returns that outpace inflation. Think of it as planting a seed: with patience and the right conditions, a small amount today can grow into a much larger sum in the future.',
          },
          {
            heading: 'Why Invest Instead of Just Saving?',
            text: 'A traditional savings account might pay 0.5% interest, while inflation averages about 3% per year. That means the purchasing power of cash sitting in a savings account actually shrinks over time. If you keep $10,000 in savings for 20 years at 0.5% interest while inflation runs at 3%, your money loses nearly 40% of its real value. Investing in a diversified portfolio has historically returned 7–10% per year, allowing your wealth to grow well above the inflation rate.',
          },
          {
            heading: 'The Power of Compound Interest',
            text: 'Compound interest is what turns modest investments into life-changing wealth. When your investment earns a return, that return itself starts earning returns. For example, $10,000 invested at an 8% average annual return grows to roughly $21,500 in 10 years, $46,600 in 20 years, and over $100,000 in 30 years — all without adding another dollar. The earlier you start, the more time compounding has to work its magic.',
          },
          {
            heading: 'Investing vs. Saving vs. Speculating',
            text: 'Saving is setting aside money in low-risk vehicles like bank accounts for short-term needs or emergencies. Investing is committing money for the long term with an expectation of reasonable growth based on fundamentals. Speculating is making high-risk bets on price movements, often without thorough analysis — think day trading or buying meme stocks. A smart financial plan includes all three in proper proportion: an emergency fund in savings, a core portfolio of investments, and only money you can afford to lose in speculative plays.',
          },
        ]),
        JSON.stringify([
          'Starting to invest early is one of the most impactful financial decisions you can make.',
          'Compound interest turns small, consistent investments into significant wealth over decades.',
          'Investing differs from saving (low risk, low return) and speculating (high risk, uncertain return).',
          'Inflation erodes the purchasing power of cash, making investing essential for preserving wealth.',
          'Even modest returns of 7–8% per year can multiply your money many times over 20–30 years.',
        ]),
        JSON.stringify([
          {
            question: 'What is the primary difference between investing and saving?',
            options: [
              'Saving has higher returns than investing',
              'Investing allocates money into assets that can grow, while saving preserves money at a low fixed rate',
              'Investing is the same as speculating',
              'Saving involves buying stocks and bonds',
            ],
            answer: 1,
          },
          {
            question: 'If inflation averages 3% per year, what happens to cash kept in a 0.5% savings account over time?',
            options: [
              'It grows faster than inflation',
              'It maintains its purchasing power exactly',
              'Its purchasing power decreases over time',
              'It doubles every 10 years',
            ],
            answer: 2,
          },
          {
            question: 'Approximately how much would $10,000 grow to in 30 years at an 8% average annual return?',
            options: [
              '$15,000',
              '$30,000',
              '$65,000',
              '$100,000',
            ],
            answer: 3,
          },
        ]),
        1,
      ]
    );

    // Lesson 2
    console.log('    📝 Lesson 2: Setting Your Financial Goals');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod1Id,
        'Setting Your Financial Goals',
        'Learn how to set clear, actionable investment goals using the SMART framework.',
        '8 min',
        '🎯',
        JSON.stringify([
          {
            heading: 'SMART Goals for Investing',
            text: 'Effective investment goals follow the SMART framework: Specific (exactly what you want to achieve, such as "save $50,000 for a house down payment"), Measurable (a dollar amount or percentage you can track), Achievable (realistic given your income and expenses), Relevant (aligned with your life priorities), and Time-bound (with a clear deadline). Without SMART goals, investing becomes aimless and you are more likely to make emotional decisions during market volatility.',
          },
          {
            heading: 'Short-Term, Medium-Term, and Long-Term Goals',
            text: 'Short-term goals (1–3 years) include things like building an emergency fund or saving for a vacation; these should be kept in low-risk assets like high-yield savings or short-term bonds. Medium-term goals (3–10 years) such as buying a home or funding education allow for a moderate mix of stocks and bonds. Long-term goals (10+ years) like retirement or generational wealth can be invested more aggressively in stocks, since you have time to ride out market fluctuations.',
          },
          {
            heading: 'How Much Should You Invest Monthly?',
            text: 'To figure out your monthly investment amount, work backward from your goal. If you want $100,000 in 15 years and expect an 8% annual return, you need to invest approximately $290 per month. The Rule of 72 is a quick shortcut: divide 72 by your expected annual return to estimate how many years it takes to double your money. At 8%, your money doubles roughly every 9 years. Use these calculations to set a realistic monthly contribution that keeps you on track.',
          },
        ]),
        JSON.stringify([
          'Use the SMART framework to set investment goals that are specific, measurable, and time-bound.',
          'Match your investment risk level to your goal\'s time horizon — longer horizons allow more stock exposure.',
          'Calculate your required monthly contribution by working backward from your target amount.',
          'The Rule of 72 estimates doubling time: at 8% return, your money doubles roughly every 9 years.',
        ]),
        JSON.stringify([
          {
            question: 'What does the "T" in SMART goals stand for?',
            options: [
              'Transferable',
              'Time-bound',
              'Tactical',
              'Total',
            ],
            answer: 1,
          },
          {
            question: 'Which type of investment is most appropriate for a goal that is 2 years away?',
            options: [
              'Aggressive growth stocks',
              'Cryptocurrency',
              'High-yield savings or short-term bonds',
              'Small-cap stocks',
            ],
            answer: 2,
          },
          {
            question: 'Using the Rule of 72, approximately how long does it take to double your money at a 6% annual return?',
            options: [
              '6 years',
              '8 years',
              '12 years',
              '15 years',
            ],
            answer: 2,
          },
        ]),
        2,
      ]
    );

    // Lesson 3
    console.log('    📝 Lesson 3: Understanding Risk & Return');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod1Id,
        'Understanding Risk & Return',
        'Explore the relationship between risk and return and learn how to assess your own risk tolerance.',
        '12 min',
        '⚖️',
        JSON.stringify([
          {
            heading: 'The Risk-Return Tradeoff',
            text: 'In investing, risk and return are fundamentally linked: assets with higher potential returns generally carry higher risk. At the low end of the spectrum, savings accounts and Treasury bills offer minimal returns but virtually no risk of loss. Moving up, investment-grade bonds offer moderate returns with moderate risk. At the high end, individual stocks and cryptocurrencies offer the potential for large gains but can also lose significant value. Understanding where each asset falls on this spectrum is essential for building a portfolio that matches your comfort level.',
          },
          {
            heading: 'Types of Investment Risk',
            text: 'Market risk is the chance that the entire market declines, dragging all investments down with it. Company-specific risk (also called unsystematic risk) is the chance that a single company underperforms due to poor management or industry changes. Inflation risk is the danger that your returns fail to keep up with rising prices. Interest rate risk affects bonds — when rates rise, existing bond prices fall. Liquidity risk is the possibility that you cannot sell an asset quickly without a significant price discount. A well-constructed portfolio accounts for all these risk types.',
          },
          {
            heading: 'Assessing Your Personal Risk Tolerance',
            text: 'Your risk tolerance depends on your age, income stability, financial obligations, and emotional temperament. A common guideline is that younger investors with decades until retirement can afford more stock exposure, while those nearing retirement should shift toward bonds and stable assets. Ask yourself: if your portfolio dropped 30% in a month, would you panic-sell or see it as a buying opportunity? Your honest answer reveals your true risk tolerance, which should guide your asset allocation decisions.',
          },
          {
            heading: 'Diversification: Reducing Risk Without Eliminating Returns',
            text: 'Diversification means spreading your investments across different asset classes, sectors, and geographies so that a downturn in one area does not devastate your entire portfolio. A portfolio holding 500 different stocks is far less volatile than one holding just 5. Research shows that diversification can significantly reduce portfolio risk while preserving the majority of expected returns. The key principle is that assets which do not move in perfect lockstep (low correlation) provide the greatest diversification benefit.',
          },
        ]),
        JSON.stringify([
          'Higher potential returns always come with higher risk — there is no free lunch in investing.',
          'Understanding the different types of risk (market, company, inflation, interest rate, liquidity) helps you protect your portfolio.',
          'Your personal risk tolerance should be based on your time horizon, financial situation, and emotional response to losses.',
          'Diversification across asset classes and geographies reduces risk without proportionally reducing expected returns.',
          'Younger investors can generally take on more risk because they have time to recover from market downturns.',
        ]),
        JSON.stringify([
          {
            question: 'Which of the following best describes the risk-return tradeoff?',
            options: [
              'Higher-risk investments always guarantee higher returns',
              'Lower-risk investments tend to have higher returns',
              'Higher potential returns generally come with higher risk',
              'Risk and return are not related',
            ],
            answer: 2,
          },
          {
            question: 'What type of risk can be reduced through diversification?',
            options: [
              'Market risk (systematic risk)',
              'Inflation risk',
              'Company-specific risk (unsystematic risk)',
              'Interest rate risk',
            ],
            answer: 2,
          },
          {
            question: 'An investor who would panic-sell during a 30% market drop should likely choose which allocation?',
            options: [
              '90% stocks, 10% bonds',
              '100% cryptocurrency',
              'A more conservative mix with more bonds and fewer stocks',
              'All individual growth stocks',
            ],
            answer: 2,
          },
        ]),
        3,
      ]
    );

    // Lesson 4
    console.log('    📝 Lesson 4: The Magic of Compound Interest');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod1Id,
        'The Magic of Compound Interest',
        'Discover how compound interest works and why starting early can make an enormous difference.',
        '9 min',
        '✨',
        JSON.stringify([
          {
            heading: 'Understanding Compound Interest',
            text: 'Compound interest is interest earned on both your original principal and on previously accumulated interest. Albert Einstein reportedly called it "the eighth wonder of the world," noting that "he who understands it, earns it; he who doesn\'t, pays it." The formula is simple: Future Value = Principal × (1 + rate)^years. What makes it powerful is the exponential nature — growth accelerates the longer you stay invested, because each year\'s returns generate their own returns in subsequent years.',
          },
          {
            heading: 'Early Start vs. Late Start: A Real Example',
            text: 'Consider two investors: Alex starts investing $200 per month at age 25, while Jordan starts the same $200 per month at age 35. Both earn an average 8% annual return and retire at 65. Alex invests for 40 years (total contributions: $96,000) and ends up with approximately $698,000. Jordan invests for 30 years (total contributions: $72,000) and ends up with roughly $300,000. Despite contributing only $24,000 more, Alex ends up with over twice as much — the extra decade of compounding made all the difference.',
          },
          {
            heading: 'The Rule of 72 and Reinvesting Dividends',
            text: 'The Rule of 72 is a quick mental math shortcut: divide 72 by your annual return rate to estimate how many years it takes to double your money. At 6%, money doubles in about 12 years; at 8%, in about 9 years; at 12%, in about 6 years. Reinvesting dividends supercharges compounding — instead of taking dividend payments as cash, you use them to buy more shares, which then generate their own dividends. Historically, reinvested dividends have accounted for roughly 40% of the S&P 500\'s total return.',
          },
        ]),
        JSON.stringify([
          'Time is the most powerful factor in compound interest — starting 10 years earlier can more than double your final wealth.',
          'The Rule of 72 provides a quick estimate: divide 72 by your annual return to find the doubling time.',
          'Reinvesting dividends significantly accelerates compounding and has historically contributed about 40% of total stock market returns.',
          'Even small monthly contributions grow dramatically over decades thanks to exponential compounding.',
        ]),
        JSON.stringify([
          {
            question: 'What makes compound interest different from simple interest?',
            options: [
              'Compound interest pays a higher rate',
              'Compound interest earns returns on previously earned interest, not just the original principal',
              'Simple interest grows faster over time',
              'There is no difference',
            ],
            answer: 1,
          },
          {
            question: 'Using the Rule of 72, how long does it take to double your money at a 9% annual return?',
            options: [
              '6 years',
              '8 years',
              '9 years',
              '12 years',
            ],
            answer: 1,
          },
          {
            question: 'In the Alex vs. Jordan example, why does Alex end up with more than twice as much money?',
            options: [
              'Alex earned a higher interest rate',
              'Alex invested a larger amount each month',
              'Alex had 10 extra years of compounding which exponentially increased growth',
              'Jordan paid higher fees',
            ],
            answer: 2,
          },
        ]),
        4,
      ]
    );

    // Module 2: Understanding Investment Types
    console.log('  📦 Module 2: Understanding Investment Types');
    const mod2 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course1Id,
        'Understanding Investment Types',
        'Learn about stocks, bonds, ETFs, and other investment vehicles',
        2,
      ]
    );
    const mod2Id = mod2.rows[0].id;

    // Lesson 5
    console.log('    📝 Lesson 5: Stocks: Owning a Piece of a Company');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod2Id,
        'Stocks: Owning a Piece of a Company',
        'Understand what stocks represent, how they are valued, and the basics of stock trading.',
        '12 min',
        '📈',
        JSON.stringify([
          {
            heading: 'What Stocks Represent',
            text: 'When you buy a stock, you are purchasing a small ownership stake in a real company. If a company has 1 million shares outstanding and you own 100 shares, you own 0.01% of that company. Stock prices are determined by supply and demand — if more people want to buy a stock than sell it, the price goes up, and vice versa. Over the long term, stock prices tend to follow the company\'s earnings growth, but in the short term, prices can be driven by emotions, news, and speculation.',
          },
          {
            heading: 'Common vs. Preferred Stock and Market Cap',
            text: 'Common stock gives you voting rights at shareholder meetings and the potential for capital gains and dividends, but you are last in line if the company goes bankrupt. Preferred stock typically pays a fixed dividend and has priority over common stock in bankruptcy, but usually lacks voting rights. Companies are also classified by market capitalization: large-cap (over $10 billion) are established industry leaders, mid-cap ($2–10 billion) offer a balance of growth and stability, and small-cap (under $2 billion) are younger companies with higher growth potential but greater risk.',
          },
          {
            heading: 'How to Evaluate Stocks',
            text: 'The Price-to-Earnings (P/E) ratio is one of the most common valuation metrics — it shows how much investors are willing to pay per dollar of earnings. A P/E of 15 means investors pay $15 for every $1 of annual earnings. Revenue growth indicates how fast a company\'s sales are expanding. Earnings per share (EPS) shows profitability on a per-share basis. Dividends are periodic cash payments to shareholders — the dividend yield (annual dividend / stock price) indicates the cash return. Always compare these metrics within the same industry, as normal ranges vary widely between sectors.',
          },
          {
            heading: 'Stock Exchanges and How Trading Works',
            text: 'The two major U.S. stock exchanges are the New York Stock Exchange (NYSE) and NASDAQ. The NYSE is the world\'s largest exchange by market capitalization and is known for listing established blue-chip companies. NASDAQ is technology-heavy and was the first electronic exchange. Trading occurs during market hours (9:30 AM–4:00 PM ET, Monday–Friday). When you place a trade through your broker, the order is routed to a market maker or exchange where it is matched with a counterparty. Modern trades execute in milliseconds and cost zero commission at most major brokers.',
          },
        ]),
        JSON.stringify([
          'Owning stock means owning a real piece of a company, with your returns tied to its performance.',
          'Market capitalization (large, mid, small cap) indicates a company\'s size and typically its risk-return profile.',
          'Key valuation metrics like P/E ratio, revenue growth, and EPS help you assess whether a stock is fairly priced.',
          'Major U.S. exchanges (NYSE, NASDAQ) facilitate trading during market hours with near-instant execution.',
          'Always compare stock metrics within the same industry for meaningful analysis.',
        ]),
        JSON.stringify([
          {
            question: 'What does owning a share of stock represent?',
            options: [
              'A loan to the company',
              'A partial ownership stake in the company',
              'A guaranteed return on investment',
              'A government bond',
            ],
            answer: 1,
          },
          {
            question: 'A company with a market capitalization of $500 million would be classified as:',
            options: [
              'Large-cap',
              'Mid-cap',
              'Small-cap',
              'Micro-cap',
            ],
            answer: 2,
          },
          {
            question: 'If a stock has a P/E ratio of 20, what does that mean?',
            options: [
              'The stock price is $20',
              'Investors pay $20 for every $1 of the company\'s annual earnings',
              'The company earns $20 per share',
              'The stock has 20% annual returns',
            ],
            answer: 1,
          },
        ]),
        5,
      ]
    );

    // Lesson 6
    console.log('    📝 Lesson 6: Bonds & Fixed Income');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod2Id,
        'Bonds & Fixed Income',
        'Learn what bonds are, how they work, and how they fit into a diversified portfolio.',
        '10 min',
        '📜',
        JSON.stringify([
          {
            heading: 'What Are Bonds?',
            text: 'A bond is essentially a loan you make to a government or corporation. When you buy a bond, you are lending the issuer money in exchange for periodic interest payments (called coupon payments) and the return of your principal (face value) at maturity. For example, a $1,000 bond with a 5% coupon rate pays you $50 per year until it matures, at which point you get your $1,000 back. Bonds are generally less volatile than stocks and provide a predictable income stream.',
          },
          {
            heading: 'Types of Bonds and Credit Ratings',
            text: 'Government bonds (U.S. Treasury bills, notes, and bonds) are backed by the full faith of the U.S. government and are considered the safest investments. Corporate bonds are issued by companies and offer higher yields to compensate for the higher risk of default. Municipal bonds are issued by state and local governments and often offer tax-exempt interest. Credit rating agencies (Moody\'s, S&P, Fitch) rate bonds from AAA (highest quality) to D (in default) — higher-rated bonds pay lower interest because they are safer.',
          },
          {
            heading: 'Bond Prices, Interest Rates, and Yield',
            text: 'Bond prices and interest rates have an inverse relationship: when interest rates rise, existing bond prices fall, and vice versa. This happens because new bonds issued at higher rates make existing lower-rate bonds less attractive. Yield is the effective return you earn — current yield equals the annual coupon payment divided by the bond\'s current market price. If you buy a $1,000 bond with a 5% coupon for $950 on the secondary market, your current yield is $50/$950 = 5.26%. Understanding this inverse relationship is crucial for managing bond investments.',
          },
        ]),
        JSON.stringify([
          'Bonds are loans to governments or corporations that pay periodic interest and return principal at maturity.',
          'Government bonds are the safest; corporate bonds pay higher yields to compensate for default risk.',
          'Bond prices and interest rates move in opposite directions — rising rates cause existing bond prices to fall.',
          'Credit ratings (AAA to D) indicate the likelihood that the bond issuer will repay its debt.',
          'Bonds provide portfolio stability and predictable income, making them essential for diversification.',
        ]),
        JSON.stringify([
          {
            question: 'What is a bond?',
            options: [
              'An ownership stake in a company',
              'A loan you make to a government or corporation in exchange for interest payments',
              'A type of savings account',
              'A share of an index fund',
            ],
            answer: 1,
          },
          {
            question: 'What happens to existing bond prices when interest rates rise?',
            options: [
              'Bond prices rise',
              'Bond prices fall',
              'Bond prices stay the same',
              'Bond prices are not affected by interest rates',
            ],
            answer: 1,
          },
          {
            question: 'Which type of bond is generally considered the safest?',
            options: [
              'Corporate bonds',
              'Municipal bonds',
              'U.S. Treasury bonds',
              'High-yield (junk) bonds',
            ],
            answer: 2,
          },
        ]),
        6,
      ]
    );

    // Lesson 7
    console.log('    📝 Lesson 7: ETFs & Index Funds');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod2Id,
        'ETFs & Index Funds',
        'Discover how ETFs and index funds provide instant diversification at low cost.',
        '11 min',
        '🏦',
        JSON.stringify([
          {
            heading: 'What Are ETFs and Index Funds?',
            text: 'Exchange-Traded Funds (ETFs) and index funds are investment vehicles that bundle hundreds or even thousands of individual securities into a single, easy-to-buy package. An S&P 500 index fund, for example, holds all 500 companies in the S&P 500 index, giving you instant diversification across the largest U.S. companies. ETFs trade on exchanges like stocks throughout the day, while traditional index mutual funds are priced once daily. Both offer a simple way to build a diversified portfolio without picking individual stocks.',
          },
          {
            heading: 'Why Index Funds Beat Most Active Managers',
            text: 'Over a 15-year period, roughly 90% of actively managed funds underperform their benchmark index. The primary reason is fees: active funds charge 0.5%–1.5% annually, while index funds charge as little as 0.03%. That fee difference compounds enormously over decades. A $10,000 investment growing at 8% for 30 years would be worth about $100,000 with a 0.03% fee, but only about $76,000 with a 1% fee — that seemingly small difference costs you $24,000. This is why legendary investor Warren Buffett recommends low-cost index funds for most investors.',
          },
          {
            heading: 'Popular ETFs and the Three-Fund Portfolio',
            text: 'Some of the most popular ETFs include VOO (Vanguard S&P 500, tracking the 500 largest U.S. companies), VTI (Vanguard Total Stock Market, covering the entire U.S. market), VXUS (Vanguard Total International, covering non-U.S. stocks), and BND (Vanguard Total Bond Market). The "three-fund portfolio" strategy uses just three funds — a U.S. stock fund, an international stock fund, and a bond fund — to achieve global diversification. This simple strategy has outperformed most complex portfolios over the long term while keeping costs and complexity minimal.',
          },
        ]),
        JSON.stringify([
          'ETFs and index funds bundle hundreds of investments into one purchase, providing instant diversification.',
          'About 90% of active fund managers underperform index funds over 15 years, primarily due to higher fees.',
          'Fee differences compound dramatically — even 1% more in fees can cost tens of thousands over a career.',
          'The three-fund portfolio (U.S. stocks, international stocks, bonds) offers simple and effective global diversification.',
        ]),
        JSON.stringify([
          {
            question: 'What is the main advantage of index funds over actively managed funds?',
            options: [
              'Index funds are only available to professional investors',
              'Index funds guarantee higher returns',
              'Index funds typically have much lower fees and outperform most active managers over time',
              'Index funds only invest in bonds',
            ],
            answer: 2,
          },
          {
            question: 'What percentage of actively managed funds underperform their benchmark index over 15 years?',
            options: [
              'About 25%',
              'About 50%',
              'About 75%',
              'About 90%',
            ],
            answer: 3,
          },
          {
            question: 'What does the three-fund portfolio consist of?',
            options: [
              'Three individual stocks',
              'A U.S. stock fund, an international stock fund, and a bond fund',
              'Three different bond funds',
              'Three cryptocurrency tokens',
            ],
            answer: 1,
          },
        ]),
        7,
      ]
    );

    // Lesson 8
    console.log('    📝 Lesson 8: Real Estate & Alternative Investments');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod2Id,
        'Real Estate & Alternative Investments',
        'Explore REITs, commodities, and other alternative investments and how they fit in a portfolio.',
        '10 min',
        '🏠',
        JSON.stringify([
          {
            heading: 'REITs: Real Estate Without Buying Property',
            text: 'Real Estate Investment Trusts (REITs) are companies that own, operate, or finance income-producing real estate. They are required by law to distribute at least 90% of their taxable income as dividends, which makes them attractive for income-seeking investors. REITs trade on stock exchanges just like regular stocks, so you can invest in real estate without the hassle of being a landlord. Typical REIT dividend yields range from 3% to 6%, and they provide diversification because real estate often moves differently from stocks and bonds.',
          },
          {
            heading: 'Commodities and Cryptocurrency',
            text: 'Commodities like gold and oil are physical goods traded on specialized markets. Gold has historically served as a hedge against inflation and economic uncertainty — it tends to rise when stocks fall. Oil prices affect entire economies and sectors. Cryptocurrency (Bitcoin, Ethereum, etc.) is a newer, highly volatile asset class built on blockchain technology. While some investors have seen massive gains, crypto can lose 50% or more of its value in months. Treat cryptocurrency as a speculative investment and only invest what you can afford to lose entirely.',
          },
          {
            heading: 'How Alternatives Fit in Your Portfolio',
            text: 'Financial advisors typically recommend allocating 5% to 15% of your portfolio to alternative investments like REITs, commodities, or crypto. The primary benefit is low correlation with traditional stocks and bonds — when your stocks are down, your alternatives may hold steady or even rise, smoothing out your overall portfolio volatility. However, alternatives often have higher fees, lower liquidity, or higher risk than traditional investments, so they should complement your core stock-and-bond holdings rather than replace them.',
          },
        ]),
        JSON.stringify([
          'REITs let you invest in real estate without buying property, offering attractive dividend yields of 3–6%.',
          'Gold serves as an inflation hedge; cryptocurrency offers high potential returns but extreme volatility and risk.',
          'Alternative investments should comprise 5–15% of a portfolio for diversification benefits.',
          'The key benefit of alternatives is low correlation with stocks and bonds, which reduces overall portfolio volatility.',
        ]),
        JSON.stringify([
          {
            question: 'What are REITs required to distribute as dividends?',
            options: [
              'At least 50% of taxable income',
              'At least 75% of taxable income',
              'At least 90% of taxable income',
              '100% of taxable income',
            ],
            answer: 2,
          },
          {
            question: 'Which asset has historically served as a hedge against inflation and economic uncertainty?',
            options: [
              'Corporate bonds',
              'Savings accounts',
              'Gold',
              'Small-cap stocks',
            ],
            answer: 2,
          },
          {
            question: 'What percentage of a portfolio do advisors typically recommend for alternative investments?',
            options: [
              '0–2%',
              '5–15%',
              '25–35%',
              '50% or more',
            ],
            answer: 1,
          },
        ]),
        8,
      ]
    );

    // Module 3: Building Your First Portfolio
    console.log('  📦 Module 3: Building Your First Portfolio');
    const mod3 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course1Id,
        'Building Your First Portfolio',
        'Put it all together and start investing with confidence',
        3,
      ]
    );
    const mod3Id = mod3.rows[0].id;

    // Lesson 9
    console.log('    📝 Lesson 9: Asset Allocation Strategies');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod3Id,
        'Asset Allocation Strategies',
        'Learn how to divide your investments among different asset classes for optimal results.',
        '11 min',
        '🧩',
        JSON.stringify([
          {
            heading: 'What Is Asset Allocation?',
            text: 'Asset allocation is the process of dividing your investments among different asset categories — primarily stocks, bonds, and cash equivalents. Research by Brinson, Hood, and Beebower found that asset allocation determines approximately 90% of a portfolio\'s return variability over time, making it far more important than individual security selection or market timing. Your allocation decision is the single most impactful investment choice you will make.',
          },
          {
            heading: 'Age-Based Allocation Rules',
            text: 'A popular rule of thumb is "110 minus your age equals your stock allocation." A 30-year-old would hold 80% stocks and 20% bonds, while a 60-year-old would hold 50% stocks and 50% bonds. Model portfolios by age: in your 20s–30s (80–90% stocks, 10–20% bonds), 40s (70% stocks, 30% bonds), 50s (60% stocks, 40% bonds), and 60s+ (40–50% stocks, 50–60% bonds). These are starting points — your personal situation, risk tolerance, and goals may call for adjustments.',
          },
          {
            heading: 'Aggressive, Moderate, and Conservative Allocations',
            text: 'An aggressive portfolio (80–100% stocks) targets maximum growth and is suitable for young investors with long time horizons who can tolerate significant volatility. A moderate portfolio (50–70% stocks, 30–50% bonds) balances growth with stability, ideal for mid-career investors. A conservative portfolio (20–40% stocks, 60–80% bonds) prioritizes capital preservation and steady income, appropriate for those nearing or in retirement. Each allocation produces different expected returns and risk levels — there is no universally "best" allocation, only the one that best fits your circumstances.',
          },
        ]),
        JSON.stringify([
          'Asset allocation — how you divide investments among stocks, bonds, and cash — drives roughly 90% of portfolio returns.',
          'The "110 minus your age" rule provides a simple starting point for stock allocation.',
          'Aggressive, moderate, and conservative portfolios serve different life stages and risk tolerances.',
          'Your ideal allocation depends on your personal circumstances, not just a formula.',
        ]),
        JSON.stringify([
          {
            question: 'According to research, what percentage of a portfolio\'s return variability is determined by asset allocation?',
            options: [
              'About 25%',
              'About 50%',
              'About 75%',
              'About 90%',
            ],
            answer: 3,
          },
          {
            question: 'Using the "110 minus your age" rule, what stock allocation would a 40-year-old have?',
            options: [
              '40%',
              '60%',
              '70%',
              '80%',
            ],
            answer: 2,
          },
          {
            question: 'Which portfolio type is most appropriate for an investor nearing retirement?',
            options: [
              'Aggressive (90% stocks)',
              'Moderate (60% stocks)',
              'Conservative (30% stocks, 70% bonds)',
              'All cryptocurrency',
            ],
            answer: 2,
          },
        ]),
        9,
      ]
    );

    // Lesson 10
    console.log('    📝 Lesson 10: Opening Your First Brokerage Account');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod3Id,
        'Opening Your First Brokerage Account',
        'Navigate account types, choose a broker, and place your first trade.',
        '8 min',
        '🔑',
        JSON.stringify([
          {
            heading: 'Types of Investment Accounts',
            text: 'A taxable brokerage account has no contribution limits or withdrawal restrictions, but you pay taxes on dividends and capital gains each year. A Traditional IRA lets you contribute pre-tax dollars (up to $7,000/year in 2024) and defer taxes until withdrawal in retirement. A Roth IRA uses after-tax contributions but all future growth and withdrawals in retirement are completely tax-free — this is often the best choice for younger investors in lower tax brackets. A 401(k) is an employer-sponsored plan with higher contribution limits ($23,000/year in 2024), often with an employer match that is essentially free money.',
          },
          {
            heading: 'Choosing a Broker',
            text: 'The best brokers for beginners are Fidelity, Vanguard, and Charles Schwab — all offer zero-commission stock and ETF trades, no account minimums, excellent research tools, and strong customer support. When choosing a broker, consider factors like the platform\'s ease of use, available investment options, research and educational resources, and whether they offer fractional shares (which let you invest in expensive stocks with small amounts). Avoid brokers that charge commissions, have high account fees, or aggressively push complex products like options to beginners.',
          },
          {
            heading: 'Funding Your Account and Placing Your First Order',
            text: 'Once your account is open, link your bank account and transfer funds — most brokers process transfers within 1–3 business days. When placing your first order, you will encounter two main order types: a market order buys at the current price immediately (best for beginners and liquid stocks), while a limit order lets you set the maximum price you are willing to pay, and the order only executes if the price reaches your limit. For your first investment, consider buying a broad market ETF like VTI or VOO with a market order — this gives you instant diversification across hundreds of companies.',
          },
        ]),
        JSON.stringify([
          'Roth IRAs offer tax-free growth and are often the best choice for younger investors.',
          '401(k) employer matches are free money — always contribute enough to get the full match.',
          'Fidelity, Vanguard, and Schwab are excellent zero-commission brokers for beginners.',
          'Market orders execute immediately; limit orders let you set your maximum purchase price.',
          'Starting with a broad market ETF provides instant diversification for your first investment.',
        ]),
        JSON.stringify([
          {
            question: 'What is the main tax advantage of a Roth IRA?',
            options: [
              'Contributions are tax-deductible',
              'No taxes on employer contributions',
              'All future growth and qualified withdrawals are completely tax-free',
              'There are no contribution limits',
            ],
            answer: 2,
          },
          {
            question: 'What type of order executes immediately at the current market price?',
            options: [
              'Limit order',
              'Stop-loss order',
              'Market order',
              'Trailing stop order',
            ],
            answer: 2,
          },
          {
            question: 'Why is contributing to a 401(k) up to the employer match especially important?',
            options: [
              '401(k) funds are FDIC insured',
              'The employer match is essentially free money that doubles part of your contribution',
              '401(k) accounts have no investment risk',
              'You can withdraw from a 401(k) at any age without penalty',
            ],
            answer: 1,
          },
        ]),
        10,
      ]
    );

    // Lesson 11
    console.log('    📝 Lesson 11: Dollar-Cost Averaging');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod3Id,
        'Dollar-Cost Averaging',
        'Learn the strategy of investing fixed amounts at regular intervals to reduce timing risk.',
        '9 min',
        '📊',
        JSON.stringify([
          {
            heading: 'What Is Dollar-Cost Averaging?',
            text: 'Dollar-cost averaging (DCA) is the strategy of investing a fixed dollar amount at regular intervals — say $500 every month — regardless of whether the market is up or down. When prices are high, your fixed amount buys fewer shares; when prices are low, it buys more shares. Over time, this naturally lowers your average cost per share compared to trying to time the market. DCA removes the emotional decision of "when to invest" and replaces it with a disciplined, automatic process.',
          },
          {
            heading: 'DCA vs. Lump Sum Investing',
            text: 'Statistical analysis shows that lump sum investing (investing all your money at once) beats DCA about 67% of the time, because markets tend to go up over time and having your money invested sooner means more time for growth. However, DCA has a psychological advantage: it dramatically reduces the regret of investing a large sum right before a market downturn. For most people, the slight reduction in expected return is worth the emotional peace of mind and discipline that DCA provides. If you receive a large windfall, a compromise is to invest it over 3–6 months.',
          },
          {
            heading: 'Setting Up Automatic Investments',
            text: 'Most brokers allow you to set up automatic recurring investments — you choose the amount, frequency, and which fund to buy, and the broker does the rest. This is the most powerful aspect of DCA: it removes human decision-making from the equation. By automating your investments, you avoid the temptation to time the market or skip contributions when you feel anxious. Staying consistent through both bull and bear markets is one of the most important habits of successful long-term investors. Set it, forget it, and let compounding do the heavy lifting.',
          },
        ]),
        JSON.stringify([
          'Dollar-cost averaging reduces timing risk by investing fixed amounts at regular intervals.',
          'Lump sum investing wins 67% of the time statistically, but DCA reduces emotional regret and promotes discipline.',
          'Automating your investments removes emotional decision-making and ensures consistency.',
          'Staying invested through market volatility — not trying to time tops and bottoms — is key to long-term success.',
        ]),
        JSON.stringify([
          {
            question: 'What is dollar-cost averaging?',
            options: [
              'Investing all your money at once when prices are low',
              'Investing a fixed dollar amount at regular intervals regardless of market conditions',
              'Only buying stocks when they are below their average price',
              'Selling stocks when they reach a target price',
            ],
            answer: 1,
          },
          {
            question: 'How often does lump sum investing outperform dollar-cost averaging statistically?',
            options: [
              'About 33% of the time',
              'About 50% of the time',
              'About 67% of the time',
              'About 90% of the time',
            ],
            answer: 2,
          },
          {
            question: 'What is the biggest advantage of automating your investments?',
            options: [
              'It guarantees higher returns',
              'It eliminates all investment risk',
              'It removes emotional decision-making and ensures consistent contributions',
              'It allows you to time the market better',
            ],
            answer: 2,
          },
        ]),
        11,
      ]
    );

    // =====================================================
    // COURSE 2: Stock Market Mastery
    // =====================================================
    console.log('\n📊 Inserting Course 2: Stock Market Mastery...');
    const course2 = await pool.query(
      `INSERT INTO courses (title, description, level, icon, color, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'Stock Market Mastery',
        'Go deeper into stock analysis, learn to read financial statements, and develop strategies for picking individual stocks.',
        'intermediate',
        '📊',
        '#3b82f6',
        2,
      ]
    );
    const course2Id = course2.rows[0].id;

    // Module 4: How Markets Work
    console.log('  📦 Module 4: How Markets Work');
    const mod4 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course2Id,
        'How Markets Work',
        'Understand the mechanics of stock exchanges and trading',
        1,
      ]
    );
    const mod4Id = mod4.rows[0].id;

    // Lesson 12
    console.log('    📝 Lesson 12: Stock Exchanges & Market Mechanics');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod4Id,
        'Stock Exchanges & Market Mechanics',
        'Understand how stock exchanges operate and the mechanics of trading.',
        '11 min',
        '🏛️',
        JSON.stringify([
          {
            heading: 'How Stock Exchanges Operate',
            text: 'Stock exchanges like the NYSE and NASDAQ are regulated marketplaces where buyers and sellers trade securities. The NYSE operates as a hybrid market with both electronic and floor-based trading, while NASDAQ is fully electronic. Market makers are firms that commit to buying and selling specific stocks at quoted prices, ensuring there is always a counterparty for your trade. They profit from the bid-ask spread — the small difference between the price they will buy at (bid) and sell at (ask).',
          },
          {
            heading: 'Order Flow and Market Hours',
            text: 'When you place a trade through your broker, your order enters a system called order flow, where it is routed to the best available price across multiple venues. Regular U.S. market hours are 9:30 AM to 4:00 PM Eastern, Monday through Friday. Pre-market trading (4:00–9:30 AM) and after-hours trading (4:00–8:00 PM) are available but have lower volume and wider spreads, making prices less favorable. Major market-moving events like earnings reports are often released outside regular hours, which is why pre-market and after-hours prices can gap significantly.',
          },
          {
            heading: 'The Bid-Ask Spread Explained',
            text: 'The bid price is the highest price a buyer is currently willing to pay, and the ask price is the lowest price a seller is willing to accept. The difference is the bid-ask spread. For highly traded stocks like Apple, the spread might be just one cent. For thinly traded small-cap stocks, it could be 10 cents or more. A tighter spread means lower trading costs for you. Liquidity — how easily a stock can be bought or sold — is the primary determinant of spread width. Always check the spread before trading less liquid securities.',
          },
        ]),
        JSON.stringify([
          'Stock exchanges are regulated marketplaces; NYSE uses hybrid trading while NASDAQ is fully electronic.',
          'Market makers ensure liquidity by always offering to buy and sell, profiting from the bid-ask spread.',
          'Regular U.S. market hours are 9:30 AM–4:00 PM ET; pre-market and after-hours have wider spreads.',
          'The bid-ask spread is a real trading cost — tighter spreads mean lower costs for investors.',
        ]),
        JSON.stringify([
          {
            question: 'What role do market makers play?',
            options: [
              'They regulate the stock exchange',
              'They provide liquidity by always offering to buy and sell specific stocks',
              'They set the price of all stocks',
              'They only trade during after-hours sessions',
            ],
            answer: 1,
          },
          {
            question: 'What are regular U.S. stock market trading hours?',
            options: [
              '8:00 AM–3:00 PM ET',
              '9:00 AM–3:30 PM ET',
              '9:30 AM–4:00 PM ET',
              '10:00 AM–5:00 PM ET',
            ],
            answer: 2,
          },
          {
            question: 'A stock has a bid of $50.00 and an ask of $50.05. What is the bid-ask spread?',
            options: [
              '$0.01',
              '$0.05',
              '$0.50',
              '$50.05',
            ],
            answer: 1,
          },
        ]),
        12,
      ]
    );

    // Lesson 13
    console.log('    📝 Lesson 13: Order Types & Execution');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod4Id,
        'Order Types & Execution',
        'Master the different types of stock orders and when to use each one.',
        '9 min',
        '⚡',
        JSON.stringify([
          {
            heading: 'Market Orders and Limit Orders',
            text: 'A market order is an instruction to buy or sell immediately at the best available price. It guarantees execution but not price — in volatile markets, you might get a slightly different price than expected (called slippage). A limit order specifies the maximum price you will pay (for buys) or minimum price you will accept (for sells). Limit orders guarantee price but not execution — if the stock never reaches your limit price, the order will not fill. For most everyday investing in liquid stocks, market orders are fine; use limit orders when precision matters or when trading less liquid securities.',
          },
          {
            heading: 'Stop-Loss Orders and Trailing Stops',
            text: 'A stop-loss order automatically sells your stock if it drops to a specified price, protecting you from large losses. For example, if you buy a stock at $100 and set a stop-loss at $90, the stock will be sold automatically if it falls to $90, limiting your loss to 10%. A trailing stop is a dynamic version — instead of a fixed price, you set a percentage or dollar amount below the current price. If the stock rises from $100 to $120, a 10% trailing stop moves up to $108. If the stock then drops to $108, it triggers a sell. Trailing stops lock in gains while still protecting against significant declines.',
          },
          {
            heading: 'When to Use Each Order Type',
            text: 'Use market orders for routine purchases of highly liquid ETFs and large-cap stocks where the bid-ask spread is tight. Use limit orders when buying less liquid stocks, when you have a specific target price in mind, or during volatile market conditions. Use stop-loss orders to protect existing positions from catastrophic declines — many professionals set them at 7–10% below purchase price. Use trailing stops when you want to ride an uptrend while automatically protecting accumulated gains. Understanding these tools gives you much greater control over your trading outcomes.',
          },
        ]),
        JSON.stringify([
          'Market orders guarantee execution but not price; limit orders guarantee price but not execution.',
          'Stop-loss orders protect against large losses by automatically selling at a specified price.',
          'Trailing stops dynamically adjust with price increases, locking in gains while protecting against declines.',
          'Choose the right order type based on the stock\'s liquidity, your precision needs, and market volatility.',
        ]),
        JSON.stringify([
          {
            question: 'What does a limit order do?',
            options: [
              'Buys or sells immediately at the current price',
              'Specifies the maximum buy price or minimum sell price, executing only if that price is reached',
              'Automatically sells if the price drops by 10%',
              'Cancels the order after one day',
            ],
            answer: 1,
          },
          {
            question: 'You buy a stock at $50 and set a stop-loss at $45. What happens?',
            options: [
              'The stock is sold immediately',
              'The stock is automatically sold if the price drops to $45 or below',
              'You earn a $5 profit',
              'The stop-loss prevents the stock from falling below $45',
            ],
            answer: 1,
          },
          {
            question: 'When is a market order most appropriate?',
            options: [
              'When trading a thinly traded small-cap stock',
              'When you need to buy at a specific price',
              'When buying a highly liquid ETF or large-cap stock with a tight bid-ask spread',
              'During extreme market volatility',
            ],
            answer: 2,
          },
        ]),
        13,
      ]
    );

    // Lesson 14
    console.log('    📝 Lesson 14: Reading Stock Quotes & Charts');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod4Id,
        'Reading Stock Quotes & Charts',
        'Learn to read stock quotes, understand candlestick charts, and identify basic patterns.',
        '12 min',
        '📋',
        JSON.stringify([
          {
            heading: 'Understanding Stock Quotes',
            text: 'A stock quote provides key data points: Open (the price at market open), High (the highest price during the session), Low (the lowest price), Close (the final price at market close), and Volume (total shares traded). Together, these form "OHLCV" data. The close price is the most commonly referenced. Volume is crucial — high volume confirms that a price move has broad participation, while low-volume moves are less reliable. When volume spikes alongside a price change, it suggests strong conviction among market participants.',
          },
          {
            heading: 'Candlestick Charts Basics',
            text: 'Candlestick charts are the most popular way to visualize price action. Each candlestick represents one time period (a day, week, or hour). The rectangular "body" shows the range between open and close — a green (or hollow) body means the close was higher than the open (bullish), while a red (or filled) body means the close was lower (bearish). The thin lines above and below the body are called "wicks" or "shadows" and show the high and low of the period. Candlestick patterns can reveal market sentiment and potential turning points.',
          },
          {
            heading: 'Support, Resistance, and Moving Averages',
            text: 'Support is a price level where a stock tends to stop falling and bounce back up, because buyers step in at that price. Resistance is a price level where a stock tends to stop rising and pull back, because sellers take profits. Moving averages smooth out price data to reveal trends — the 50-day moving average shows the average price over the last 50 trading days, while the 200-day moving average shows the longer-term trend. When the 50-day crosses above the 200-day (a "golden cross"), it is considered a bullish signal; when it crosses below (a "death cross"), it is bearish.',
          },
        ]),
        JSON.stringify([
          'OHLCV (Open, High, Low, Close, Volume) are the fundamental data points of any stock quote.',
          'Candlestick charts visually show price action — green bodies are bullish, red bodies are bearish.',
          'Support and resistance levels indicate where prices tend to reverse direction.',
          'The 50-day and 200-day moving averages reveal short- and long-term trends; their crossovers signal potential trend changes.',
        ]),
        JSON.stringify([
          {
            question: 'What does a green (hollow) candlestick body indicate?',
            options: [
              'The stock price decreased during that period',
              'The closing price was higher than the opening price',
              'Trading volume was high',
              'The stock hit a new all-time high',
            ],
            answer: 1,
          },
          {
            question: 'What is a "support" level?',
            options: [
              'The highest price a stock has ever reached',
              'A price level where a stock tends to stop falling as buyers step in',
              'The average price over the last 200 days',
              'A price level set by the stock exchange',
            ],
            answer: 1,
          },
          {
            question: 'What is a "golden cross"?',
            options: [
              'When a stock reaches a new all-time high',
              'When trading volume exceeds 1 million shares',
              'When the 50-day moving average crosses above the 200-day moving average',
              'When a stock pays its first dividend',
            ],
            answer: 2,
          },
        ]),
        14,
      ]
    );

    // Module 5: Fundamental Analysis
    console.log('  📦 Module 5: Fundamental Analysis');
    const mod5 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course2Id,
        'Fundamental Analysis',
        'Learn to evaluate companies by reading their financial statements',
        2,
      ]
    );
    const mod5Id = mod5.rows[0].id;

    // Lesson 15
    console.log('    📝 Lesson 15: Income Statements Decoded');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod5Id,
        'Income Statements Decoded',
        'Learn to read and analyze a company\'s income statement like a professional.',
        '14 min',
        '📄',
        JSON.stringify([
          {
            heading: 'Revenue and Cost of Goods Sold',
            text: 'The income statement (also called the profit and loss statement) shows a company\'s financial performance over a specific period. Revenue (or "top line") is the total money earned from selling products or services. Cost of Goods Sold (COGS) is the direct cost of producing those products — for a car manufacturer, this includes raw materials, factory labor, and manufacturing overhead. Gross Profit is Revenue minus COGS. A company with rising revenue and stable or declining COGS as a percentage of revenue is demonstrating improving efficiency and is generally attractive to investors.',
          },
          {
            heading: 'Operating Expenses and Net Income',
            text: 'Below gross profit, you subtract operating expenses — research & development, sales & marketing, and general & administrative costs — to arrive at Operating Income (EBIT). This shows how much a company earns from its core business operations. After subtracting interest expenses and taxes from operating income, you arrive at Net Income (the "bottom line"). Net Income divided by the number of outstanding shares gives you Earnings Per Share (EPS), one of the most widely followed metrics. Growing EPS is a primary driver of rising stock prices over time.',
          },
          {
            heading: 'Reading Real Income Statements',
            text: 'When analyzing an income statement, focus on trends over multiple quarters and years rather than single snapshots. Look for consistent revenue growth, expanding or stable gross margins, and growing net income. Compare metrics to industry peers — a 20% gross margin is excellent for a grocery chain but poor for a software company. Red flags include declining revenue, shrinking margins, and net income propped up by one-time gains rather than operational improvements. Every public company\'s income statement is freely available in their quarterly (10-Q) and annual (10-K) SEC filings.',
          },
        ]),
        JSON.stringify([
          'Revenue is the total sales; COGS is direct production costs; Gross Profit = Revenue minus COGS.',
          'Operating income shows core business profitability; Net Income is the "bottom line" after all expenses.',
          'EPS (Earnings Per Share) is a key metric that directly drives stock valuation.',
          'Always analyze trends over multiple periods and compare margins to industry peers.',
        ]),
        JSON.stringify([
          {
            question: 'What is Gross Profit?',
            options: [
              'Total revenue before any deductions',
              'Revenue minus Cost of Goods Sold',
              'Net Income plus taxes',
              'Operating expenses minus interest',
            ],
            answer: 1,
          },
          {
            question: 'What does EPS stand for and what does it measure?',
            options: [
              'Earnings Per Share — net income divided by shares outstanding',
              'Equity Price Score — the valuation of a stock',
              'Expected Profit Standard — projected future earnings',
              'Expense Per Sale — cost efficiency metric',
            ],
            answer: 0,
          },
          {
            question: 'Which is a red flag when analyzing an income statement?',
            options: [
              'Consistently growing revenue over several years',
              'Expanding gross margins',
              'Net income driven by one-time gains rather than operational improvements',
              'Increasing EPS quarter over quarter',
            ],
            answer: 2,
          },
        ]),
        15,
      ]
    );

    // Lesson 16
    console.log('    📝 Lesson 16: Balance Sheets & Cash Flow');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod5Id,
        'Balance Sheets & Cash Flow',
        'Understand assets, liabilities, equity, and cash flow analysis.',
        '13 min',
        '📑',
        JSON.stringify([
          {
            heading: 'Assets, Liabilities, and Equity',
            text: 'The balance sheet provides a snapshot of what a company owns (assets), what it owes (liabilities), and the residual value belonging to shareholders (equity). The fundamental equation is: Assets = Liabilities + Equity. Current assets (cash, receivables, inventory) can be converted to cash within a year; long-term assets include property, equipment, and intangible assets like patents. Current liabilities (payables, short-term debt) are due within a year; long-term liabilities include bonds and long-term loans. Equity represents the shareholders\' residual claim on assets after all debts are paid.',
          },
          {
            heading: 'Key Balance Sheet Ratios',
            text: 'The current ratio (current assets / current liabilities) measures short-term financial health — a ratio above 1.5 generally indicates the company can comfortably meet its short-term obligations. The debt-to-equity ratio (total debt / total equity) shows how much the company relies on borrowed money — a ratio below 1.0 means the company has more equity than debt, which is generally healthier. High debt-to-equity ratios are common in some industries (utilities, real estate) but can signal danger in others. Always compare ratios within the same industry for meaningful analysis.',
          },
          {
            heading: 'Cash Flow: The Lifeblood of Business',
            text: 'The cash flow statement tracks actual cash moving in and out of the company and is divided into three sections: Operating cash flow (cash from core business activities), Investing cash flow (cash spent on or received from assets and investments), and Financing cash flow (cash from issuing or repaying debt and equity). Free Cash Flow (FCF) — operating cash flow minus capital expenditures — is arguably the most important metric because it shows how much cash a company generates after maintaining its operations. Companies with strong, growing free cash flow can pay dividends, buy back shares, reduce debt, and invest in growth.',
          },
        ]),
        JSON.stringify([
          'The balance sheet equation is: Assets = Liabilities + Equity.',
          'Current ratio above 1.5 indicates strong short-term financial health.',
          'Debt-to-equity ratio shows leverage — compare within industries for meaningful analysis.',
          'Free Cash Flow (operating cash flow minus capital expenditures) is the ultimate measure of financial health.',
        ]),
        JSON.stringify([
          {
            question: 'What is the fundamental balance sheet equation?',
            options: [
              'Assets = Revenue - Expenses',
              'Assets = Liabilities + Equity',
              'Equity = Assets + Liabilities',
              'Liabilities = Assets × Equity',
            ],
            answer: 1,
          },
          {
            question: 'A company has current assets of $500,000 and current liabilities of $250,000. What is its current ratio?',
            options: [
              '0.5',
              '1.0',
              '2.0',
              '250,000',
            ],
            answer: 2,
          },
          {
            question: 'What is Free Cash Flow?',
            options: [
              'Total revenue minus total expenses',
              'Cash from financing activities',
              'Operating cash flow minus capital expenditures',
              'Net income plus depreciation',
            ],
            answer: 2,
          },
        ]),
        16,
      ]
    );

    // Lesson 17
    console.log('    📝 Lesson 17: Key Financial Ratios');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod5Id,
        'Key Financial Ratios',
        'Master the essential ratios used by professional investors to evaluate stocks.',
        '12 min',
        '🔢',
        JSON.stringify([
          {
            heading: 'Valuation Ratios: P/E, P/B, and P/S',
            text: 'The Price-to-Earnings (P/E) ratio is the most commonly used valuation metric — it divides the stock price by earnings per share. The S&P 500 average P/E is historically around 15–17, but growth companies often trade at 25–40+ while value stocks trade at 8–15. The Price-to-Book (P/B) ratio compares stock price to the book value (assets minus liabilities) per share — useful for asset-heavy industries like banking. The Price-to-Sales (P/S) ratio divides market cap by revenue and is useful for evaluating unprofitable growth companies where P/E is not applicable.',
          },
          {
            heading: 'Growth and Profitability Ratios',
            text: 'The PEG ratio (P/E divided by earnings growth rate) adjusts the P/E for growth — a PEG below 1.0 suggests the stock may be undervalued relative to its growth rate. Return on Equity (ROE) measures how efficiently a company generates profits from shareholders\' equity — an ROE above 15% is generally considered strong. Return on Assets (ROA) shows how efficiently a company uses all its assets to generate earnings. Companies with consistently high ROE and ROA tend to be well-managed and capital-efficient, making them attractive long-term investments.',
          },
          {
            heading: 'Debt Ratios and Sector Comparisons',
            text: 'The debt-to-equity ratio and interest coverage ratio (operating income / interest expenses) reveal how comfortably a company manages its debt. An interest coverage ratio below 2 is a warning sign. The critical rule with all financial ratios is to compare within the same sector — a tech company and a utility company have fundamentally different capital structures, growth profiles, and normal ratio ranges. A P/E of 30 might be cheap for a fast-growing cloud company but expensive for a mature consumer staples company. Context is everything in financial analysis.',
          },
        ]),
        JSON.stringify([
          'P/E ratio is the most common valuation metric; compare it to industry averages and historical ranges.',
          'PEG ratio below 1.0 suggests a stock may be undervalued relative to its earnings growth.',
          'ROE above 15% indicates efficient use of shareholder equity; ROA shows overall asset efficiency.',
          'Always compare financial ratios within the same industry — context determines whether a number is good or bad.',
        ]),
        JSON.stringify([
          {
            question: 'What does a PEG ratio below 1.0 typically suggest?',
            options: [
              'The stock is overvalued',
              'The stock may be undervalued relative to its growth rate',
              'The company is unprofitable',
              'The company has too much debt',
            ],
            answer: 1,
          },
          {
            question: 'Which ratio measures how efficiently a company generates profits from shareholders\' equity?',
            options: [
              'P/E ratio',
              'Current ratio',
              'Return on Equity (ROE)',
              'Price-to-Book ratio',
            ],
            answer: 2,
          },
          {
            question: 'Why is it important to compare financial ratios within the same industry?',
            options: [
              'All industries have the same normal ratio ranges',
              'Different industries have fundamentally different structures, making cross-industry comparisons misleading',
              'It is not important — ratios are universal',
              'Only tech companies use financial ratios',
            ],
            answer: 1,
          },
        ]),
        17,
      ]
    );

    // Module 6: Stock Selection Strategies
    console.log('  📦 Module 6: Stock Selection Strategies');
    const mod6 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course2Id,
        'Stock Selection Strategies',
        'Develop your own approach to picking winning stocks',
        3,
      ]
    );
    const mod6Id = mod6.rows[0].id;

    // Lesson 18
    console.log('    📝 Lesson 18: Value Investing (Warren Buffett\'s Approach)');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod6Id,
        'Value Investing (Warren Buffett\'s Approach)',
        'Learn the principles of value investing that made Warren Buffett the most successful investor in history.',
        '13 min',
        '💎',
        JSON.stringify([
          {
            heading: 'Margin of Safety and Intrinsic Value',
            text: 'Value investing, pioneered by Benjamin Graham and perfected by Warren Buffett, is built on one core idea: buy stocks for less than they are worth. Intrinsic value is the true underlying value of a company based on its assets, earnings, and growth potential. The margin of safety is the difference between intrinsic value and your purchase price — if you estimate a stock is worth $100 and you buy it at $70, you have a 30% margin of safety. This buffer protects you from errors in your analysis and unexpected downturns.',
          },
          {
            heading: 'Economic Moats and Competitive Advantages',
            text: 'Buffett looks for companies with a "moat" — a sustainable competitive advantage that protects the business from competitors. Moats come in several forms: brand power (Coca-Cola, Apple), network effects (Visa, Facebook), cost advantages (Walmart, Costco), switching costs (Microsoft, Oracle), and patents or regulatory barriers (pharmaceutical companies). A wide moat means competitors cannot easily replicate the company\'s advantage, leading to consistently high returns on capital over decades. Buffett says he would rather buy a wonderful company at a fair price than a fair company at a wonderful price.',
          },
          {
            heading: 'Patience and Long-Term Thinking',
            text: 'Buffett\'s most powerful weapon is patience. His favorite holding period is "forever." He ignores short-term market noise, quarterly earnings whispers, and macroeconomic predictions. Instead, he focuses on buying great businesses with strong management teams at reasonable prices, then holding them for years or decades. He famously says, "The stock market is a device for transferring money from the impatient to the patient." This philosophy has generated a 20%+ annualized return over his 50+ year career, turning Berkshire Hathaway into one of the most valuable companies in the world.',
          },
        ]),
        JSON.stringify([
          'Buy stocks below intrinsic value with a margin of safety to protect against errors.',
          'Look for companies with wide economic moats — sustainable competitive advantages that fend off competitors.',
          'Patience is paramount: focus on long-term business quality, not short-term price fluctuations.',
          'A wonderful company at a fair price is better than a fair company at a wonderful price.',
          'Value investing has consistently outperformed over long time periods for disciplined practitioners.',
        ]),
        JSON.stringify([
          {
            question: 'What is "margin of safety" in value investing?',
            options: [
              'The maximum amount you can lose on an investment',
              'The difference between a stock\'s intrinsic value and its purchase price',
              'The minimum account balance required by your broker',
              'The percentage of your portfolio in bonds',
            ],
            answer: 1,
          },
          {
            question: 'Which of the following is an example of an economic "moat"?',
            options: [
              'A company with declining revenue',
              'A company with strong brand power that competitors cannot easily replicate',
              'A company trading at a high P/E ratio',
              'A company that just went public through an IPO',
            ],
            answer: 1,
          },
          {
            question: 'What is Warren Buffett\'s preferred holding period?',
            options: [
              '3–6 months',
              '1–2 years',
              '5 years exactly',
              '"Forever" — as long as the business fundamentals remain strong',
            ],
            answer: 3,
          },
        ]),
        18,
      ]
    );

    // Lesson 19
    console.log('    📝 Lesson 19: Growth Investing');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod6Id,
        'Growth Investing',
        'Learn how to identify and invest in high-growth companies with massive potential.',
        '11 min',
        '🚀',
        JSON.stringify([
          {
            heading: 'Identifying Growth Companies',
            text: 'Growth investing focuses on companies whose revenues and earnings are expanding faster than the overall market. Key indicators include revenue growth rates exceeding 20% year-over-year, expanding market share, and a large Total Addressable Market (TAM) — the total revenue opportunity available if the company captured 100% of its market. The best growth companies solve important problems, have scalable business models, and operate in industries with secular tailwinds such as cloud computing, e-commerce, or artificial intelligence.',
          },
          {
            heading: 'Revenue Acceleration and High P/E Explained',
            text: 'Revenue acceleration — when the growth rate itself is increasing (e.g., from 20% to 25% to 30% year-over-year) — is an especially bullish signal because it suggests the company\'s products are gaining momentum. Growth stocks often trade at seemingly "expensive" P/E ratios of 40, 60, or even 100+. This high valuation is justified when the company\'s earnings are growing fast enough that the P/E will come down to reasonable levels within a few years. Amazon traded at a P/E above 100 for years but rewarded patient investors with 100x returns as earnings eventually caught up.',
          },
          {
            heading: 'Risks of Growth Investing',
            text: 'Growth investing carries significant risks. High valuations mean any disappointment in growth can trigger sharp price declines — a growth stock that misses earnings expectations by even a small amount can drop 20–30% in a single day. Many growth companies are unprofitable, funding expansion through cash burn, so if the market environment shifts and capital becomes scarce, these companies can face existential threats. Growth investors should maintain strict position sizing (no single stock over 5–10% of portfolio), monitor quarterly results closely, and be willing to sell if the growth thesis breaks.',
          },
        ]),
        JSON.stringify([
          'Growth companies are characterized by 20%+ revenue growth, expanding market share, and large TAM.',
          'Revenue acceleration is a powerful bullish signal indicating strengthening product demand.',
          'High P/E ratios can be justified if earnings are growing fast enough to bring the ratio down over time.',
          'Growth investing carries risks of sharp declines on any disappointment — strict position sizing is essential.',
        ]),
        JSON.stringify([
          {
            question: 'What is Total Addressable Market (TAM)?',
            options: [
              'The current revenue of a company',
              'The total revenue opportunity if the company captured 100% of its market',
              'The market capitalization of all competitors',
              'The average market cap of an industry',
            ],
            answer: 1,
          },
          {
            question: 'What does "revenue acceleration" mean?',
            options: [
              'Revenue is declining faster each quarter',
              'Revenue growth rate itself is increasing over time',
              'Revenue is growing at a constant rate',
              'Revenue per employee is increasing',
            ],
            answer: 1,
          },
          {
            question: 'Why should growth investors maintain strict position sizing?',
            options: [
              'Growth stocks never lose value',
              'Growth stocks can drop 20–30% on any disappointment, so concentration increases risk significantly',
              'Position sizing does not matter for growth stocks',
              'Brokers require minimum position sizes',
            ],
            answer: 1,
          },
        ]),
        19,
      ]
    );

    // Lesson 20
    console.log('    📝 Lesson 20: Dividend Investing for Passive Income');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod6Id,
        'Dividend Investing for Passive Income',
        'Build a portfolio that generates reliable passive income through dividend-paying stocks.',
        '12 min',
        '💰',
        JSON.stringify([
          {
            heading: 'Understanding Dividend Yield and Payout Ratio',
            text: 'Dividend yield is the annual dividend payment divided by the stock price, expressed as a percentage. If a stock costs $100 and pays $3 in annual dividends, its yield is 3%. The payout ratio is the percentage of earnings paid out as dividends — a payout ratio of 50% means the company distributes half its earnings and retains half for growth. A payout ratio above 80% may be unsustainable, as the company has little room to maintain dividends if earnings dip. Look for companies with moderate payout ratios (40–60%) and a track record of growing dividends over time.',
          },
          {
            heading: 'Dividend Aristocrats and DRIPs',
            text: 'Dividend Aristocrats are S&P 500 companies that have increased their dividends for at least 25 consecutive years. Examples include Johnson & Johnson, Coca-Cola, Procter & Gamble, and 3M. These companies have proven their ability to grow dividends through recessions, wars, and financial crises. A DRIP (Dividend Reinvestment Plan) automatically uses your dividend payments to purchase additional shares, supercharging compound growth. Over long periods, reinvested dividends can account for a significant portion of total returns — they buy more shares at lower prices during downturns, amplifying your recovery.',
          },
          {
            heading: 'Building a Dividend Income Portfolio',
            text: 'To build a meaningful income stream, focus on a diversified basket of 20–30 dividend-paying stocks across different sectors. A $25,000 portfolio yielding 3% generates about $750 per year in passive income; a $100,000 portfolio at 3% produces $3,000 annually. As you reinvest dividends and add more capital, your income snowball grows. Diversify across sectors (utilities, consumer staples, healthcare, financials, REITs) to ensure no single industry downturn devastates your income. Dividend investing is a marathon, not a sprint — the real magic happens after 15–20 years of consistent accumulation.',
          },
        ]),
        JSON.stringify([
          'Dividend yield is annual dividend divided by stock price; payout ratio shows what percentage of earnings is paid out.',
          'Dividend Aristocrats have raised dividends for 25+ consecutive years, proving reliability through all market conditions.',
          'DRIPs (Dividend Reinvestment Plans) supercharge compounding by automatically buying more shares.',
          'A diversified portfolio of 20–30 dividend stocks across sectors provides reliable and growing income.',
          'A $25,000 portfolio at 3% yield produces roughly $750/year, growing as you reinvest and add capital.',
        ]),
        JSON.stringify([
          {
            question: 'What is a Dividend Aristocrat?',
            options: [
              'Any company that pays a dividend',
              'An S&P 500 company that has increased dividends for at least 25 consecutive years',
              'A company with the highest dividend yield in its sector',
              'A company that pays dividends monthly instead of quarterly',
            ],
            answer: 1,
          },
          {
            question: 'A stock priced at $80 pays an annual dividend of $2.40. What is its dividend yield?',
            options: [
              '2.0%',
              '2.5%',
              '3.0%',
              '3.5%',
            ],
            answer: 2,
          },
          {
            question: 'Why might a payout ratio above 80% be a concern?',
            options: [
              'It means the company is growing too fast',
              'It leaves little room to maintain dividends if earnings decline',
              'It indicates the stock price is too high',
              'It means the company has too much cash',
            ],
            answer: 1,
          },
        ]),
        20,
      ]
    );

    // =====================================================
    // COURSE 3: Advanced Investment Strategies
    // =====================================================
    console.log('\n🎓 Inserting Course 3: Advanced Investment Strategies...');
    const course3 = await pool.query(
      `INSERT INTO courses (title, description, level, icon, color, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'Advanced Investment Strategies',
        'Master portfolio theory, behavioral finance, and sophisticated strategies used by professional investors.',
        'advanced',
        '🎓',
        '#a855f7',
        3,
      ]
    );
    const course3Id = course3.rows[0].id;

    // Module 7: Portfolio Theory & Management
    console.log('  📦 Module 7: Portfolio Theory & Management');
    const mod7 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course3Id,
        'Portfolio Theory & Management',
        'Apply academic portfolio theory to real-world investing',
        1,
      ]
    );
    const mod7Id = mod7.rows[0].id;

    // Lesson 21
    console.log('    📝 Lesson 21: Modern Portfolio Theory');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod7Id,
        'Modern Portfolio Theory',
        'Understand the efficient frontier and how to construct optimally diversified portfolios.',
        '14 min',
        '📐',
        JSON.stringify([
          {
            heading: 'The Efficient Frontier',
            text: 'Modern Portfolio Theory (MPT), developed by Harry Markowitz in 1952, revolutionized investing by proving mathematically that diversification reduces risk without proportionally reducing returns. The efficient frontier is a curve showing the set of portfolios that offer the highest expected return for each level of risk. Portfolios below the frontier are sub-optimal because you could achieve higher returns for the same risk or the same returns with less risk. The goal is to construct a portfolio that sits on or near the efficient frontier.',
          },
          {
            heading: 'Risk-Adjusted Returns and the Sharpe Ratio',
            text: 'Raw returns alone do not tell the full story — a 12% return with wild swings is less desirable than a 10% return with steady growth. The Sharpe ratio measures risk-adjusted performance by calculating (portfolio return - risk-free rate) / portfolio standard deviation. A Sharpe ratio above 1.0 is considered good, above 2.0 is very good, and above 3.0 is excellent. This metric allows you to compare investments on a level playing field, accounting for both return and the amount of risk taken to achieve it.',
          },
          {
            heading: 'Correlation and Optimal Portfolios',
            text: 'The key insight of MPT is that portfolio risk depends not only on individual asset risks but also on correlations between assets. Correlation ranges from +1 (assets move in perfect lockstep) to -1 (assets move in exactly opposite directions). Combining assets with low or negative correlation reduces overall portfolio volatility. For example, stocks and Treasury bonds often have low or negative correlation — when stocks crash, investors flee to bonds, pushing bond prices up. This is why a stock-bond portfolio is less volatile than either asset alone, and why global diversification (U.S. + international) is so powerful.',
          },
        ]),
        JSON.stringify([
          'Modern Portfolio Theory proves that diversification reduces risk without proportionally reducing returns.',
          'The efficient frontier represents portfolios offering the best return for each level of risk.',
          'The Sharpe ratio measures risk-adjusted returns — higher is better (above 1.0 is good, above 2.0 is very good).',
          'Low or negative correlation between assets is the key to effective diversification.',
        ]),
        JSON.stringify([
          {
            question: 'What does the efficient frontier represent?',
            options: [
              'The highest-returning stocks in the market',
              'The set of portfolios offering the highest expected return for each level of risk',
              'The boundary between bull and bear markets',
              'The maximum amount you should invest',
            ],
            answer: 1,
          },
          {
            question: 'A portfolio with a Sharpe ratio of 2.5 would be considered:',
            options: [
              'Poor',
              'Average',
              'Good',
              'Very good to excellent',
            ],
            answer: 3,
          },
          {
            question: 'Why does combining stocks and bonds reduce portfolio volatility?',
            options: [
              'Bonds always go up in value',
              'Stocks and bonds often have low or negative correlation — they tend to move in different directions',
              'Bonds are risk-free investments',
              'Stocks and bonds always move in the same direction',
            ],
            answer: 1,
          },
        ]),
        21,
      ]
    );

    // Lesson 22
    console.log('    📝 Lesson 22: Factor-Based Investing');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod7Id,
        'Factor-Based Investing',
        'Explore the academically proven factors that drive stock returns and how to tilt your portfolio toward them.',
        '12 min',
        '🔬',
        JSON.stringify([
          {
            heading: 'The Fama-French Factors',
            text: 'Research by Eugene Fama and Kenneth French identified specific "factors" that explain why some stocks outperform others over long periods. The original three factors are: market (stocks outperform bonds), value (cheap stocks outperform expensive ones), and size (small companies outperform large ones). Later research added momentum (stocks that have recently risen tend to keep rising), quality (profitable companies with low debt outperform), and low volatility (less volatile stocks deliver surprisingly strong risk-adjusted returns). These factors have been verified across decades of data and multiple countries.',
          },
          {
            heading: 'Factor ETFs and Smart Beta',
            text: '"Smart beta" or factor ETFs are funds designed to tilt toward specific factors rather than simply tracking a market-cap-weighted index. For example, a value ETF overweights stocks with low P/E and P/B ratios, while a momentum ETF overweights stocks with strong recent price trends. Popular factor ETFs include VLUE (value), MTUM (momentum), QUAL (quality), and USMV (low volatility). Factor investing sits between passive index investing and active stock picking — it is systematic, rules-based, and typically charges lower fees than active funds (0.15–0.30%) but more than plain vanilla index funds.',
          },
          {
            heading: 'Implementing a Factor Tilt',
            text: 'To implement factor investing, you can either replace a portion of your core index holdings with factor ETFs or use a multi-factor fund that blends several factors together. A common approach is to keep 70% in broad market index funds and allocate 30% to factor tilts (such as 10% value, 10% small-cap, 10% quality). Be aware that individual factors can underperform for years — value stocks lagged growth stocks for over a decade from 2010–2020 before bouncing back strongly. This is why diversifying across multiple factors and maintaining a long-term horizon (10+ years) is essential.',
          },
        ]),
        JSON.stringify([
          'Academically proven factors (value, size, momentum, quality, low volatility) explain persistent return differences.',
          'Factor ETFs offer a systematic, lower-cost way to tilt toward these return drivers.',
          'Individual factors can underperform for extended periods, so diversify across multiple factors.',
          'A common implementation is 70% broad market index + 30% factor tilts with a 10+ year horizon.',
        ]),
        JSON.stringify([
          {
            question: 'Which of the following is NOT one of the Fama-French factors?',
            options: [
              'Value',
              'Size (small cap)',
              'Dividend yield',
              'Market (equity premium)',
            ],
            answer: 2,
          },
          {
            question: 'What is "smart beta" investing?',
            options: [
              'Only investing in technology stocks',
              'Using AI to pick stocks',
              'Systematic, rules-based investing that tilts toward specific proven factors',
              'Trading based on insider information',
            ],
            answer: 2,
          },
          {
            question: 'Why is it important to diversify across multiple factors?',
            options: [
              'All factors always outperform the market',
              'Individual factors can underperform for years, but diversifying reduces that risk',
              'You need exactly five factors for any benefit',
              'Factor investing only works in U.S. markets',
            ],
            answer: 1,
          },
        ]),
        22,
      ]
    );

    // Lesson 23
    console.log('    📝 Lesson 23: Tax-Efficient Investing');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod7Id,
        'Tax-Efficient Investing',
        'Learn strategies to minimize taxes and keep more of your investment returns.',
        '11 min',
        '📋',
        JSON.stringify([
          {
            heading: 'Capital Gains: Short-Term vs. Long-Term',
            text: 'When you sell an investment for a profit, you owe capital gains tax. Short-term capital gains (from assets held less than one year) are taxed as ordinary income, which can be as high as 37% for top earners. Long-term capital gains (from assets held more than one year) receive preferential tax rates of 0%, 15%, or 20% depending on your income. This massive difference is one of the strongest arguments for long-term investing — simply holding an investment for at least 366 days can cut your tax bill nearly in half. Always be aware of your holding period before selling.',
          },
          {
            heading: 'Tax-Loss Harvesting',
            text: 'Tax-loss harvesting is the strategy of selling investments at a loss to offset capital gains and reduce your tax bill. If you have $5,000 in realized gains and $3,000 in realized losses, you only pay taxes on $2,000 of net gains. If your losses exceed your gains, you can deduct up to $3,000 per year against ordinary income, with excess losses carrying forward to future years. Many robo-advisors perform tax-loss harvesting automatically. This strategy can add an estimated 0.5–1.0% to your annual after-tax returns over time.',
          },
          {
            heading: 'Asset Location and the Wash Sale Rule',
            text: 'Asset location means placing investments in the most tax-efficient account type. Tax-inefficient assets (bonds, REITs, actively traded funds) should go in tax-advantaged accounts (IRA, 401k) where their income is sheltered from taxes. Tax-efficient assets (index funds, long-held stocks) should go in taxable accounts where their lower capital gains rates apply. The wash sale rule prevents you from claiming a tax loss if you repurchase the same or a "substantially identical" security within 30 days before or after the sale. If you trigger a wash sale, the loss is disallowed and added to the cost basis of the new shares instead.',
          },
        ]),
        JSON.stringify([
          'Long-term capital gains (assets held 1+ year) are taxed at much lower rates than short-term gains.',
          'Tax-loss harvesting offsets gains with losses, potentially adding 0.5–1.0% to annual after-tax returns.',
          'Asset location strategy places tax-inefficient investments in tax-advantaged accounts.',
          'The wash sale rule disallows losses if you repurchase the same security within 30 days.',
        ]),
        JSON.stringify([
          {
            question: 'What is the key difference between short-term and long-term capital gains taxes?',
            options: [
              'There is no difference',
              'Short-term gains are tax-free',
              'Long-term gains (held 1+ year) are taxed at lower preferential rates than short-term gains',
              'Long-term gains are taxed at higher rates',
            ],
            answer: 2,
          },
          {
            question: 'What is tax-loss harvesting?',
            options: [
              'Investing only in tax-free bonds',
              'Selling investments at a loss to offset capital gains and reduce taxes',
              'Moving all investments to a Roth IRA',
              'Avoiding all taxable investments',
            ],
            answer: 1,
          },
          {
            question: 'What does the wash sale rule prevent?',
            options: [
              'Buying stocks in a retirement account',
              'Selling stocks at a profit',
              'Claiming a tax loss if you repurchase the same security within 30 days',
              'Holding a stock for more than one year',
            ],
            answer: 2,
          },
        ]),
        23,
      ]
    );

    // Module 8: Behavioral Finance & Psychology
    console.log('  📦 Module 8: Behavioral Finance & Psychology');
    const mod8 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course3Id,
        'Behavioral Finance & Psychology',
        'Master the mental game of investing',
        2,
      ]
    );
    const mod8Id = mod8.rows[0].id;

    // Lesson 24
    console.log('    📝 Lesson 24: Cognitive Biases in Investing');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod8Id,
        'Cognitive Biases in Investing',
        'Identify the psychological biases that cause investors to make costly mistakes.',
        '13 min',
        '🧠',
        JSON.stringify([
          {
            heading: 'Loss Aversion and Confirmation Bias',
            text: 'Loss aversion, discovered by Daniel Kahneman and Amos Tversky, shows that people feel the pain of losses about twice as strongly as the pleasure of equivalent gains. This causes investors to hold losing positions too long (hoping to break even) and sell winners too quickly (locking in gains). Confirmation bias is the tendency to seek out information that confirms your existing beliefs while ignoring contradictory evidence. If you are bullish on a stock, you will naturally gravitate toward positive analyses and dismiss negative ones. Both biases lead to poor decision-making and suboptimal portfolio performance.',
          },
          {
            heading: 'Anchoring and Overconfidence',
            text: 'Anchoring occurs when investors fixate on a specific reference point — often the price they paid for a stock — and make decisions based on that anchor rather than current fundamentals. If you bought a stock at $100 and it drops to $60, anchoring makes you feel it "should" return to $100, even if the company\'s fundamentals have deteriorated. Overconfidence bias causes investors to overestimate their knowledge and ability to predict market movements. Studies show that the most active traders tend to earn the lowest returns because overconfidence leads to excessive trading, higher fees, and more tax events.',
          },
          {
            heading: 'Sunk Cost Fallacy and Herd Mentality',
            text: 'The sunk cost fallacy is the tendency to continue investing in a losing position because of the money already committed, rather than evaluating the investment on its current merits. The rational approach is to ask: "If I didn\'t already own this, would I buy it today at this price?" Herd mentality is the instinct to follow the crowd — buying when everyone is euphoric and selling when everyone is panicking. This leads to buying high and selling low, the exact opposite of successful investing. Warren Buffett advises: "Be fearful when others are greedy and greedy when others are fearful."',
          },
        ]),
        JSON.stringify([
          'Loss aversion causes investors to hold losers too long and sell winners too quickly.',
          'Confirmation bias makes us seek information that supports our existing beliefs while ignoring contradicting evidence.',
          'Anchoring to purchase price leads to irrational decisions — evaluate investments on current fundamentals.',
          'Overconfident investors trade too frequently, reducing returns through fees and taxes.',
          'Herd mentality causes buying high and selling low — successful investors often act contrary to the crowd.',
        ]),
        JSON.stringify([
          {
            question: 'What is loss aversion?',
            options: [
              'The preference for guaranteed returns',
              'Feeling the pain of losses about twice as strongly as the pleasure of equivalent gains',
              'Avoiding all investment risk',
              'Only investing in bonds',
            ],
            answer: 1,
          },
          {
            question: 'How does overconfidence bias typically affect investor returns?',
            options: [
              'It leads to higher returns through more frequent trading',
              'It has no effect on returns',
              'It leads to lower returns due to excessive trading, higher fees, and more tax events',
              'It only affects professional investors',
            ],
            answer: 2,
          },
          {
            question: 'What advice does Warren Buffett give about herd mentality?',
            options: [
              'Always follow the crowd for safety',
              'Only invest in popular stocks',
              'Be fearful when others are greedy and greedy when others are fearful',
              'Never invest during a bear market',
            ],
            answer: 2,
          },
        ]),
        24,
      ]
    );

    // Lesson 25
    console.log('    📝 Lesson 25: Market Cycles & Sentiment');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod8Id,
        'Market Cycles & Sentiment',
        'Understand bull and bear market cycles and how investor sentiment drives market extremes.',
        '12 min',
        '🔄',
        JSON.stringify([
          {
            heading: 'Bull and Bear Markets',
            text: 'A bull market is defined as a sustained period where stock prices rise 20% or more from recent lows, while a bear market is a decline of 20% or more from recent highs. Since 1950, the average bull market has lasted about 5 years with an average gain of 180%, while the average bear market has lasted about 10 months with an average decline of 36%. This asymmetry is crucial — markets spend far more time going up than going down, which is why staying invested through downturns is so important. Trying to time the market means you risk missing the best recovery days.',
          },
          {
            heading: 'Market Cycle Phases and Sentiment',
            text: 'Market cycles typically move through four phases: accumulation (smart money buys after a bottom), markup (the broader market joins the uptrend), distribution (smart money sells to latecomers), and markdown (the bear market decline). The Fear & Greed Index, published by CNN, measures market sentiment on a scale from Extreme Fear to Extreme Greed using seven indicators. Extreme fear often signals a buying opportunity, while extreme greed warns of a potential correction. Understanding where we are in the cycle helps you avoid buying at peaks and missing bottoms.',
          },
          {
            heading: 'Contrarian Thinking and Famous Quotes',
            text: 'Contrarian investors deliberately go against prevailing market sentiment. They buy during fear and panic when assets are cheap, and sell (or reduce exposure) during euphoria when everything seems to only go up. Sir John Templeton said, "Bull markets are born on pessimism, grow on skepticism, mature on optimism, and die on euphoria." Baron Rothschild advised, "Buy when there\'s blood in the streets, even if the blood is your own." Contrarian thinking does not mean blindly opposing the crowd — it means having the discipline to act on valuation and fundamentals when emotions push prices to extremes.',
          },
        ]),
        JSON.stringify([
          'Bull markets last much longer (avg. 5 years) and gain more (avg. 180%) than bear markets lose (avg. 36% over 10 months).',
          'The four phases of a market cycle are accumulation, markup, distribution, and markdown.',
          'Extreme fear often signals buying opportunities; extreme greed warns of potential corrections.',
          'Contrarian investors buy during fear and sell during euphoria — disciplined, not blindly oppositional.',
        ]),
        JSON.stringify([
          {
            question: 'What defines a bear market?',
            options: [
              'Any day the market goes down',
              'A decline of 10% from recent highs',
              'A decline of 20% or more from recent highs',
              'A market that has been flat for one year',
            ],
            answer: 2,
          },
          {
            question: 'During which phase of the market cycle does "smart money" typically buy?',
            options: [
              'Markup',
              'Distribution',
              'Markdown',
              'Accumulation',
            ],
            answer: 3,
          },
          {
            question: 'What does the Fear & Greed Index measure?',
            options: [
              'The price of gold',
              'Overall market sentiment from extreme fear to extreme greed',
              'Individual stock volatility',
              'The federal funds rate',
            ],
            answer: 1,
          },
        ]),
        25,
      ]
    );

    // Lesson 26
    console.log('    📝 Lesson 26: Building Your Investment System');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod8Id,
        'Building Your Investment System',
        'Create a systematic investment process that removes emotion and promotes consistency.',
        '11 min',
        '⚙️',
        JSON.stringify([
          {
            heading: 'Creating an Investment Policy Statement (IPS)',
            text: 'An Investment Policy Statement is a written document that defines your investment goals, risk tolerance, asset allocation targets, and rules for making decisions. It serves as a contract with yourself that prevents emotional decision-making during market turmoil. Your IPS should specify: your return objectives, risk constraints, target asset allocation with acceptable ranges (e.g., stocks 60–70%), criteria for buying and selling, and rebalancing rules. When the market is crashing and your gut screams "sell everything," your IPS keeps you grounded by reminding you of the plan you made with a clear head.',
          },
          {
            heading: 'Automated Investing and Quarterly Reviews',
            text: 'The most effective investment system runs mostly on autopilot. Set up automatic contributions to your brokerage account and automatic purchases of your target funds on a fixed schedule (monthly or biweekly). Then conduct quarterly reviews — not to react to market movements, but to ensure your contributions are on track and your allocation has not drifted significantly from targets. A quarterly review should take 30 minutes or less: check your asset allocation, verify automatic investments are running, review any holdings that have fundamentally changed, and note your portfolio\'s progress toward your goals.',
          },
          {
            heading: 'Rebalancing and Staying the Course',
            text: 'Rebalancing is the process of bringing your portfolio back to its target allocation when market movements cause it to drift. If your target is 70% stocks / 30% bonds and a rally pushes stocks to 80%, you sell some stocks and buy bonds to restore the 70/30 split. Common rebalancing triggers are calendar-based (quarterly or annually) or threshold-based (rebalance when any asset class drifts more than 5% from target). Staying the course through volatility is the hardest but most important skill. Investors who check their portfolios daily earn lower returns than those who check monthly or quarterly, because frequent monitoring increases the temptation to make impulsive changes.',
          },
        ]),
        JSON.stringify([
          'An Investment Policy Statement prevents emotional decisions by documenting your strategy in advance.',
          'Automate contributions and purchases to remove human decision-making from the investing process.',
          'Quarterly reviews should take 30 minutes: check allocation, verify contributions, and review fundamentals.',
          'Rebalance when allocations drift significantly (5%+) from targets, either on a schedule or by threshold.',
          'Less frequent portfolio monitoring correlates with better returns — avoid checking daily.',
        ]),
        JSON.stringify([
          {
            question: 'What is the purpose of an Investment Policy Statement?',
            options: [
              'To predict which stocks will go up',
              'To define your investment strategy and rules in advance, preventing emotional decisions',
              'To report your taxes to the IRS',
              'To track daily stock prices',
            ],
            answer: 1,
          },
          {
            question: 'How often should you conduct portfolio reviews?',
            options: [
              'Daily',
              'Weekly',
              'Quarterly',
              'Every five years',
            ],
            answer: 2,
          },
          {
            question: 'What does rebalancing involve?',
            options: [
              'Selling all your investments and starting over',
              'Buying only the best-performing stocks',
              'Adjusting your portfolio back to its target allocation when market movements cause drift',
              'Moving all investments to cash during bear markets',
            ],
            answer: 2,
          },
        ]),
        26,
      ]
    );

    // Module 9: Special Topics
    console.log('  📦 Module 9: Special Topics');
    const mod9 = await pool.query(
      `INSERT INTO modules (course_id, title, description, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        course3Id,
        'Special Topics',
        'Explore advanced topics and emerging trends',
        3,
      ]
    );
    const mod9Id = mod9.rows[0].id;

    // Lesson 27
    console.log('    📝 Lesson 27: Global & International Investing');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod9Id,
        'Global & International Investing',
        'Learn why global diversification matters and how to invest in international markets.',
        '11 min',
        '🌍',
        JSON.stringify([
          {
            heading: 'Why Diversify Globally',
            text: 'The U.S. stock market represents only about 60% of global market capitalization — ignoring the other 40% means missing enormous opportunities. Different countries and regions have different economic cycles, and U.S. stocks do not always lead global performance. International stocks outperformed U.S. stocks for most of the 2000–2010 decade. By diversifying globally, you reduce concentration risk in any single economy and access faster-growing markets. Vanguard research suggests that an allocation of 20–40% international stocks has historically improved risk-adjusted returns for U.S. investors.',
          },
          {
            heading: 'Developed vs. Emerging Markets',
            text: 'Developed markets (Europe, Japan, Australia, Canada) have mature economies, stable political systems, and well-regulated financial markets. They offer lower growth but also lower risk. Emerging markets (China, India, Brazil, Southeast Asia) are rapidly growing economies with younger populations and expanding middle classes. They offer higher growth potential but come with additional risks including political instability, weaker rule of law, less transparent accounting standards, and currency volatility. A balanced international allocation might include 70% developed markets and 30% emerging markets.',
          },
          {
            heading: 'Currency Risk, ADRs, and International ETFs',
            text: 'When you invest internationally, your returns are affected by currency fluctuations. If the dollar strengthens against foreign currencies, your international investments lose value in dollar terms even if the underlying stocks are rising locally. American Depositary Receipts (ADRs) are foreign stocks that trade on U.S. exchanges in U.S. dollars, making international investing accessible. However, the easiest approach is through international ETFs like VXUS (total international), VEA (developed markets), and VWO (emerging markets). These funds handle currency conversion, regulatory compliance, and diversification automatically.',
          },
        ]),
        JSON.stringify([
          'The U.S. is only ~60% of global markets — diversifying internationally captures the remaining 40%.',
          'International stocks do not always move with U.S. stocks, improving overall portfolio diversification.',
          'Emerging markets offer higher growth but higher risk compared to developed international markets.',
          'Currency fluctuations add an extra layer of risk/return to international investments.',
          'International ETFs (VXUS, VEA, VWO) are the simplest way to access global diversification.',
        ]),
        JSON.stringify([
          {
            question: 'What percentage of global market capitalization does the U.S. represent?',
            options: [
              'About 30%',
              'About 45%',
              'About 60%',
              'About 80%',
            ],
            answer: 2,
          },
          {
            question: 'Which of the following is an additional risk of emerging market investing?',
            options: [
              'Lower growth potential',
              'Too much regulation',
              'Political instability and currency volatility',
              'No available ETFs',
            ],
            answer: 2,
          },
          {
            question: 'What is an ADR (American Depositary Receipt)?',
            options: [
              'A type of U.S. Treasury bond',
              'A foreign stock that trades on U.S. exchanges in U.S. dollars',
              'An account at a foreign brokerage',
              'A tax form for international investments',
            ],
            answer: 1,
          },
        ]),
        27,
      ]
    );

    // Lesson 28
    console.log('    📝 Lesson 28: Retirement Planning Deep Dive');
    await pool.query(
      `INSERT INTO lessons (module_id, title, description, duration, icon, content, key_takeaways, quiz, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mod9Id,
        'Retirement Planning Deep Dive',
        'Master advanced retirement strategies including Roth conversions, withdrawal rates, and sequence of returns risk.',
        '13 min',
        '🏖️',
        JSON.stringify([
          {
            heading: '401(k) and IRA Strategies',
            text: 'Maximizing your 401(k) employer match is the highest-return investment you can make — a 50% match on contributions is an instant 50% return before any market gains. Beyond the match, consider whether your tax rate will be higher or lower in retirement. If higher now, use pre-tax (Traditional) contributions for the immediate tax deduction. If you expect higher taxes later (e.g., you are early in your career), Roth contributions lock in today\'s lower rate. Many advisors recommend a mix of both for tax diversification. Also consider backdoor Roth contributions if your income exceeds direct Roth IRA limits.',
          },
          {
            heading: 'The Roth Conversion Ladder and the 4% Rule',
            text: 'A Roth conversion ladder is a strategy for early retirees: convert Traditional IRA money to Roth IRA gradually, paying taxes on each conversion. After a 5-year seasoning period, you can withdraw the converted amounts penalty-free before age 59½. The "4% rule," based on the Trinity Study, suggests you can withdraw 4% of your portfolio in the first year of retirement, then adjust for inflation each year, and have a very high probability (95%+) of not running out of money over 30 years. On a $1 million portfolio, that means $40,000 per year. Some recent research suggests 3.5% may be more appropriate given current lower expected returns.',
          },
          {
            heading: 'Target-Date Funds and Sequence of Returns Risk',
            text: 'Target-date funds automatically shift from aggressive to conservative allocation as your retirement date approaches. A "2050 Target Date Fund" would be mostly stocks now and gradually shift to bonds as 2050 nears. They are an excellent hands-off option for retirement investors who prefer simplicity. Sequence of returns risk is the danger that poor market returns in the first few years of retirement permanently deplete your portfolio. A 30% market drop in year one of retirement is far more damaging than the same drop in year 15, because you are withdrawing from a shrinking base. Maintaining 1–2 years of expenses in cash or short-term bonds provides a buffer against selling stocks during downturns.',
          },
        ]),
        JSON.stringify([
          'Always capture the full 401(k) employer match — it is an instant guaranteed return on your contribution.',
          'Choose Traditional vs. Roth contributions based on whether your tax rate will be higher or lower in retirement.',
          'The 4% rule suggests withdrawing 4% of your portfolio annually for a high probability of lasting 30+ years.',
          'Sequence of returns risk makes early retirement years critical — keep 1–2 years of expenses in cash as a buffer.',
          'Target-date funds offer simple, automatic allocation adjustment as retirement approaches.',
        ]),
        JSON.stringify([
          {
            question: 'What is the "4% rule" for retirement withdrawals?',
            options: [
              'Save 4% of your income for retirement',
              'Withdraw 4% of your portfolio in year one, then adjust for inflation annually, for a high probability of lasting 30+ years',
              'Invest 4% of your portfolio in bonds',
              'Pay 4% of your portfolio in fees annually',
            ],
            answer: 1,
          },
          {
            question: 'What is "sequence of returns risk"?',
            options: [
              'The risk of choosing investments in the wrong order',
              'The risk that poor returns in the first few years of retirement permanently deplete your portfolio',
              'The risk of missing stock market returns by staying in cash',
              'The risk of outliving your portfolio by 4%',
            ],
            answer: 1,
          },
          {
            question: 'Why is capturing the full employer 401(k) match so important?',
            options: [
              'It reduces your investment risk to zero',
              'The employer match is essentially free money — an instant guaranteed return',
              'It guarantees a 10% annual return',
              'You are legally required to do so',
            ],
            answer: 1,
          },
        ]),
        28,
      ]
    );

    // Final summary
    const courseCount = await pool.query('SELECT COUNT(*) FROM courses');
    const moduleCount = await pool.query('SELECT COUNT(*) FROM modules');
    const lessonCount = await pool.query('SELECT COUNT(*) FROM lessons');

    console.log('\n🎉 Seed complete!');
    console.log(`   📚 Courses: ${courseCount.rows[0].count}`);
    console.log(`   📦 Modules: ${moduleCount.rows[0].count}`);
    console.log(`   📝 Lessons: ${lessonCount.rows[0].count}`);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
