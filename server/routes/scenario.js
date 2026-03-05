const express = require('express');
const OpenAI = require('openai');
const { getOrCreateUser, pool } = require('../db');

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

const BUILDER_PROMPT = `You design interactive investing simulation scenarios for BloomVest, an educational app.

Return strictly valid JSON for a playable scenario blueprint.

Rules:
- Keep language practical and motivating.
- Use educational framing (never real financial advice).
- Use 3-6 objectives.
- Objectives must use one of these rule types:
  1) holdings_count_min: { "min": number }
  2) sectors_min: { "min": number }
  3) invest_percent_min: { "minPercent": number between 10 and 95 }
  4) stock_in_portfolio: { "symbol": "AAPL" }
  5) sector_holdings_min: { "sector": "Technology", "min": number }
  6) dividend_stock_min: { "minDividend": number }
  7) pe_condition_any: { "operator": "gte"|"lte"|"gt"|"lt", "value": number }
  8) single_position_max: { "maxPercent": number between 5 and 95 }
- Return this shape:
{
  "title": "string",
  "description": "string",
  "briefing": "string",
  "difficulty": "Beginner|Intermediate|Advanced",
  "duration": "e.g. 15 min",
  "icon": "single emoji",
  "startingBalance": number,
  "assets": ["AAPL", "MSFT"],
  "objectives": [
    { "id": "short-id", "label": "string", "rule": { "type": "...", ... } }
  ],
  "tips": ["string"],
  "learningGoals": ["string"]
}
- Assets must be uppercase ticker symbols.
- IDs should be kebab-case and unique.
`;

const allowedRuleTypes = new Set([
  'holdings_count_min',
  'sectors_min',
  'invest_percent_min',
  'stock_in_portfolio',
  'sector_holdings_min',
  'dividend_stock_min',
  'pe_condition_any',
  'single_position_max',
]);

function sanitizeText(value, fallback = '') {
  if (!value || typeof value !== 'string') return fallback;
  return value.trim();
}

function sanitizeSymbols(input) {
  if (!Array.isArray(input)) return [];
  const symbols = input
    .map((value) => String(value || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6))
    .filter(Boolean);
  return [...new Set(symbols)];
}

function makeObjectiveId(label, index) {
  const slug = String(label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 32);
  return slug || `objective-${index + 1}`;
}

function normalizeObjectiveRule(rule) {
  if (!rule || typeof rule !== 'object') return null;
  const type = sanitizeText(rule.type);
  if (!allowedRuleTypes.has(type)) return null;

  switch (type) {
    case 'holdings_count_min':
      return { type, min: Math.max(1, Number(rule.min) || 1) };
    case 'sectors_min':
      return { type, min: Math.max(1, Number(rule.min) || 1) };
    case 'invest_percent_min':
      return { type, minPercent: Math.max(10, Math.min(95, Number(rule.minPercent) || 50)) };
    case 'stock_in_portfolio':
      return { type, symbol: String(rule.symbol || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) };
    case 'sector_holdings_min':
      return {
        type,
        sector: sanitizeText(rule.sector, 'Technology').slice(0, 40),
        min: Math.max(1, Number(rule.min) || 1),
      };
    case 'dividend_stock_min':
      return { type, minDividend: Math.max(0, Number(rule.minDividend) || 1) };
    case 'pe_condition_any':
      return {
        type,
        operator: ['gte', 'lte', 'gt', 'lt'].includes(rule.operator) ? rule.operator : 'gte',
        value: Math.max(0, Number(rule.value) || 20),
      };
    case 'single_position_max':
      return { type, maxPercent: Math.max(5, Math.min(95, Number(rule.maxPercent) || 40)) };
    default:
      return null;
  }
}

function normalizeObjectives(objectivesInput) {
  if (!Array.isArray(objectivesInput)) return [];
  return objectivesInput
    .map((item, index) => {
      const label = sanitizeText(item?.label);
      const rule = normalizeObjectiveRule(item?.rule);
      if (!label || !rule) return null;
      const id = sanitizeText(item?.id, makeObjectiveId(label, index)).slice(0, 64);
      return { id, label, rule };
    })
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeScenarioPayload(input, defaults = {}) {
  const objectives = normalizeObjectives(input?.objectives);
  const learningGoals = Array.isArray(input?.learningGoals)
    ? input.learningGoals.map((goal) => sanitizeText(goal)).filter(Boolean).slice(0, 8)
    : [];
  const tips = Array.isArray(input?.tips)
    ? input.tips.map((tip) => sanitizeText(tip)).filter(Boolean).slice(0, 8)
    : [];

  return {
    title: sanitizeText(input?.title, defaults.title || 'My Custom Scenario').slice(0, 255),
    description: sanitizeText(input?.description, defaults.description || 'Custom scenario created by user.').slice(0, 1200),
    briefing: sanitizeText(input?.briefing, defaults.briefing || 'Use this simulation to practice smart portfolio decisions.').slice(0, 4000),
    difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(input?.difficulty) ? input.difficulty : (defaults.difficulty || 'Beginner'),
    duration: sanitizeText(input?.duration, defaults.duration || '15 min').slice(0, 20),
    icon: sanitizeText(input?.icon, defaults.icon || '🧠').slice(0, 10),
    startingBalance: Math.max(2000, Math.min(200000, Number(input?.startingBalance) || defaults.startingBalance || 10000)),
    assets: sanitizeSymbols(input?.assets).slice(0, 16),
    objectives: objectives.length > 0 ? objectives : (defaults.objectives || []),
    tips: tips.length > 0 ? tips : (defaults.tips || []),
    learningGoals: learningGoals.length > 0 ? learningGoals : (defaults.learningGoals || []),
  };
}

function parseAssistantJson(content) {
  if (!content || typeof content !== 'string') return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (innerError) {
      return null;
    }
  }
}

function mapScenarioRow(row) {
  return {
    id: `custom-${row.id}`,
    dbId: row.id,
    title: row.title,
    description: row.description,
    briefing: row.briefing,
    difficulty: row.difficulty,
    duration: row.duration,
    icon: row.icon,
    startingBalance: Number(row.starting_balance),
    assets: Array.isArray(row.assets) ? row.assets : [],
    objectives: Array.isArray(row.objectives) ? row.objectives : [],
    tips: Array.isArray(row.tips) ? row.tips : [],
    learningGoals: Array.isArray(row.learning_goals) ? row.learning_goals : [],
    isCustom: true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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

router.get('/custom', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const user = await getOrCreateUser(sessionId);
    const result = await pool.query(
      `SELECT *
       FROM custom_scenarios
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [user.id]
    );

    res.json({ scenarios: result.rows.map(mapScenarioRow) });
  } catch (err) {
    console.error('Custom scenarios fetch error:', err);
    res.status(500).json({ error: 'Failed to load custom scenarios' });
  }
});

router.post('/custom/save', async (req, res) => {
  try {
    const { sessionId, scenario } = req.body;
    if (!sessionId || !scenario) {
      return res.status(400).json({ error: 'sessionId and scenario are required' });
    }

    const user = await getOrCreateUser(sessionId);
    const normalized = normalizeScenarioPayload(scenario);

    if (normalized.assets.length < 2) {
      return res.status(400).json({ error: 'Scenario needs at least 2 assets' });
    }
    if (normalized.objectives.length < 2) {
      return res.status(400).json({ error: 'Scenario needs at least 2 objectives' });
    }

    let row;
    const existingId = sanitizeText(scenario.dbId || scenario.id || '').replace(/^custom-/, '');

    if (existingId) {
      const updateResult = await pool.query(
        `UPDATE custom_scenarios
         SET title = $1,
             description = $2,
             briefing = $3,
             difficulty = $4,
             duration = $5,
             icon = $6,
             starting_balance = $7,
             assets = $8::jsonb,
             objectives = $9::jsonb,
             tips = $10::jsonb,
             learning_goals = $11::jsonb,
             updated_at = NOW()
         WHERE id = $12 AND user_id = $13
         RETURNING *`,
        [
          normalized.title,
          normalized.description,
          normalized.briefing,
          normalized.difficulty,
          normalized.duration,
          normalized.icon,
          normalized.startingBalance,
          JSON.stringify(normalized.assets),
          JSON.stringify(normalized.objectives),
          JSON.stringify(normalized.tips),
          JSON.stringify(normalized.learningGoals),
          existingId,
          user.id,
        ]
      );
      row = updateResult.rows[0];
      if (!row) {
        return res.status(404).json({ error: 'Scenario not found' });
      }
    } else {
      const insertResult = await pool.query(
        `INSERT INTO custom_scenarios
          (user_id, title, description, briefing, difficulty, duration, icon, starting_balance, assets, objectives, tips, learning_goals)
         VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb)
         RETURNING *`,
        [
          user.id,
          normalized.title,
          normalized.description,
          normalized.briefing,
          normalized.difficulty,
          normalized.duration,
          normalized.icon,
          normalized.startingBalance,
          JSON.stringify(normalized.assets),
          JSON.stringify(normalized.objectives),
          JSON.stringify(normalized.tips),
          JSON.stringify(normalized.learningGoals),
        ]
      );
      row = insertResult.rows[0];
    }

    res.json({ scenario: mapScenarioRow(row) });
  } catch (err) {
    console.error('Custom scenario save error:', err);
    res.status(500).json({ error: 'Failed to save custom scenario' });
  }
});

router.post('/custom/generate', async (req, res) => {
  try {
    const { sessionId, builder } = req.body;
    if (!sessionId || !builder) {
      return res.status(400).json({ error: 'sessionId and builder are required' });
    }
    await getOrCreateUser(sessionId);

    const builderSummary = {
      topic: sanitizeText(builder.topic, 'Personalized investing challenge'),
      goal: sanitizeText(builder.goal, 'Learn diversified investing'),
      narrativeStyle: sanitizeText(builder.narrativeStyle, 'Coach-style'),
      challengeLevel: sanitizeText(builder.challengeLevel, builder.difficulty || 'Beginner'),
      selectedAssets: sanitizeSymbols(builder.selectedAssets),
      objectiveFocus: Array.isArray(builder.objectiveFocus) ? builder.objectiveFocus.slice(0, 12) : [],
      duration: sanitizeText(builder.duration, '15 min'),
      startingBalance: Math.max(2000, Math.min(200000, Number(builder.startingBalance) || 10000)),
      emoji: sanitizeText(builder.emoji, '🧠'),
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: BUILDER_PROMPT },
        {
          role: 'user',
          content: `Build a scenario from this builder input:\n${JSON.stringify(builderSummary, null, 2)}`,
        },
      ],
      max_tokens: 1100,
      temperature: 0.7,
    });

    const raw = completion.choices?.[0]?.message?.content;
    const parsed = parseAssistantJson(raw);
    if (!parsed) {
      return res.status(502).json({ error: 'AI response was not valid JSON' });
    }

    const normalized = normalizeScenarioPayload(parsed, {
      title: builderSummary.topic,
      description: `A custom scenario focused on ${builderSummary.goal.toLowerCase()}.`,
      briefing: `Practice ${builderSummary.goal.toLowerCase()} with a guided simulator.`,
      difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(builderSummary.challengeLevel)
        ? builderSummary.challengeLevel
        : 'Beginner',
      duration: builderSummary.duration,
      icon: builderSummary.emoji,
      startingBalance: builderSummary.startingBalance,
      objectives: [
        { id: 'make-first-trade', label: 'Make your first purchase', rule: { type: 'holdings_count_min', min: 1 } },
        { id: 'invest-capital', label: 'Invest at least 50% of your cash', rule: { type: 'invest_percent_min', minPercent: 50 } },
      ],
      learningGoals: ['Portfolio construction', 'Risk-aware decision making'],
      tips: ['Diversify before concentration.', 'Review risk before each trade.'],
    });

    if (normalized.assets.length < 2) {
      normalized.assets = builderSummary.selectedAssets.slice(0, 12);
    }
    if (normalized.assets.length < 2) {
      return res.status(400).json({ error: 'Select at least 2 assets to generate a scenario' });
    }

    res.json({
      scenario: {
        ...normalized,
        id: null,
        dbId: null,
        isCustom: true,
      },
    });
  } catch (err) {
    console.error('Custom scenario generate error:', err);
    res.status(500).json({ error: 'Failed to generate custom scenario' });
  }
});

module.exports = router;
