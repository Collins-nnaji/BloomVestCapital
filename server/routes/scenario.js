const express = require('express');
const OpenAI = require('openai');
const { pool, getOrCreateUser } = require('../db');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ADVISOR_PROMPT = `You are BloomVest's AI Investment Advisor guiding a student through a hands-on investing simulation. You are an encouraging, expert teacher.

CONTEXT: The student is using a virtual trading simulator with $100,000 in fake money. They are working through a guided investment scenario to learn.

YOUR ROLE:
- Explain WHY each investment decision matters using simple language
- Reference real market concepts (P/E ratios, diversification, sector allocation, risk)
- When they buy a stock, explain what makes that stock interesting (or risky)
- When they complete an objective, congratulate them and explain what they learned
- Give specific, actionable next-step suggestions
- Use real ticker symbols and approximate data
- Keep responses concise (2-4 short paragraphs max)
- Use **bold** for key terms and bullet points for lists
- Be encouraging but honest about risks

NEVER give real financial advice. Always remind this is for educational purposes if they ask about real money.`;

router.post('/advisor', async (req, res) => {
  try {
    const { sessionId, scenarioTitle, action, details, portfolio, objectives } = req.body;
    if (!sessionId || !action) {
      return res.status(400).json({ error: 'sessionId and action are required' });
    }

    const user = await getOrCreateUser(sessionId);

    let userMessage = '';

    switch (action) {
      case 'START_SCENARIO':
        userMessage = `The student just started the scenario: "${scenarioTitle}". 
Their objectives are: ${JSON.stringify(objectives)}. 
They have $${portfolio?.balance?.toLocaleString() || '100,000'} to invest. 
Give them a welcome briefing: explain the scenario goal, what they'll learn, and suggest their first move. Be specific about which stocks to consider and why.`;
        break;

      case 'BUY_STOCK':
        userMessage = `The student just BOUGHT ${details.shares} shares of ${details.symbol} (${details.name}) at $${details.price} per share (total: $${details.total}). 
Sector: ${details.sector}. P/E ratio: ${details.pe}. Dividend yield: ${details.dividend}%.
Their current portfolio: Cash: $${portfolio.balance}, Holdings: ${JSON.stringify(portfolio.holdings)}.
Completed objectives: ${JSON.stringify(objectives?.completed || [])}.
Remaining objectives: ${JSON.stringify(objectives?.remaining || [])}.
Analyze this purchase: Was it a good choice for this scenario? What should they do next?`;
        break;

      case 'SELL_STOCK':
        userMessage = `The student just SOLD ${details.shares} shares of ${details.symbol} at $${details.price} per share.
Their current portfolio: Cash: $${portfolio.balance}, Holdings: ${JSON.stringify(portfolio.holdings)}.
Explain what selling means in this context and suggest next steps.`;
        break;

      case 'ASK_ADVICE':
        userMessage = `The student is in the "${scenarioTitle}" scenario and asks: "${details.question}"
Their portfolio: Cash: $${portfolio.balance}, Holdings: ${JSON.stringify(portfolio.holdings)}.
Objectives remaining: ${JSON.stringify(objectives?.remaining || [])}.
Answer their question in the context of this scenario.`;
        break;

      case 'CHECK_PROGRESS':
        userMessage = `The student wants a progress check on "${scenarioTitle}".
Portfolio: Cash: $${portfolio.balance}, Holdings: ${JSON.stringify(portfolio.holdings)}.
Completed objectives: ${JSON.stringify(objectives?.completed || [])}.
Remaining objectives: ${JSON.stringify(objectives?.remaining || [])}.
Give them a progress summary and specific guidance on what to do next.`;
        break;

      case 'COMPLETE_SCENARIO':
        userMessage = `The student has COMPLETED the scenario "${scenarioTitle}"! 🎉
Final portfolio: Cash: $${portfolio.balance}, Total invested: $${portfolio.invested}, Holdings: ${JSON.stringify(portfolio.holdings)}.
All objectives completed: ${JSON.stringify(objectives?.completed || [])}.
Give them a thorough performance review: what they did well, what they learned, and one key takeaway for real-world investing.`;
        break;

      default:
        userMessage = details?.question || 'The student needs help with their scenario.';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: ADVISOR_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ advice: reply });
  } catch (err) {
    console.error('Scenario advisor error:', err);
    res.status(500).json({ error: 'Failed to get advisor response' });
  }
});

module.exports = router;
