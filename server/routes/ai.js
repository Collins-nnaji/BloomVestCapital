const express = require('express');
const OpenAI = require('openai');
const { pool, getOrCreateUser } = require('../db');

const router = express.Router();

const RSS_FEEDS = [
  {
    url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EGSPC,%5EDJI,%5EIXIC',
    source: 'Yahoo Finance',
    id: 'yahoo',
  },
  {
    url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
    source: 'BBC Business',
    id: 'bbc',
  },
  {
    url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories',
    source: 'MarketWatch',
    id: 'marketwatch',
  },
  {
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    source: 'CNBC',
    id: 'cnbc',
  },
  {
    url: 'https://news.google.com/rss/search?q=stock+market+OR+earnings+OR+%22Federal+Reserve%22&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News',
    id: 'google',
  },
];

let dailyBriefCache = { at: 0, payload: null };
const DAILY_BRIEF_CACHE_MS = 25 * 60 * 1000;
const RSS_PER_FEED = 12;
const RSS_MAX_TOTAL = 48;
const RSS_FETCH_MS = 14000;

function decodeXmlEntities(s) {
  if (!s) return '';
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseRssHeadlines(xml, limit = 14) {
  if (!xml || typeof xml !== 'string') return [];
  const items = [];
  const re = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null && items.length < limit) {
    const block = m[1];
    const tm = block.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const lm = block.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
    const title = decodeXmlEntities(tm ? tm[1].trim() : '');
    const link = lm ? decodeXmlEntities(lm[1].trim()) : null;
    if (title) items.push({ title, link });
  }
  return items;
}

function normalizeHeadlineKey(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .slice(0, 140);
}

async function fetchOneRssFeed({ url, source, id }) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), RSS_FETCH_MS);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'BloomVestCapital/1.0 (educational app)' },
      signal: ctl.signal,
    });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const rows = parseRssHeadlines(xml, RSS_PER_FEED);
    return rows.map((h) => ({
      title: h.title,
      link: h.link,
      source,
      sourceId: id,
    }));
  } catch (e) {
    console.warn(`RSS ${source} failed:`, e.message);
    return [];
  }
}

async function fetchAggregatedHeadlines() {
  const batches = await Promise.all(RSS_FEEDS.map((f) => fetchOneRssFeed(f)));
  const merged = batches.flat();
  const seen = new Set();
  const out = [];
  for (const h of merged) {
    const key = normalizeHeadlineKey(h.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(h);
    if (out.length >= RSS_MAX_TOTAL) break;
  }
  return out;
}

const DAILY_BRIEF_SYSTEM = `You are BloomVest's market education assistant. You receive recent PUBLIC headline titles aggregated from several mainstream finance and business RSS sources (not full articles). Each line may be prefixed with a source name in brackets.

Rules:
- Output valid JSON only, no markdown.
- Write for investors who are learning; be clear and balanced.
- These are educational observations tied to news themes, NOT personalized investment advice or buy/sell recommendations.
- Never claim you read full articles; you only have headlines.
- Include 3 to 5 items in "signals". Each signal has: stance (one of watch, caution, opportunity), title (short), detail (2-3 sentences).
- "narrative" is 3-5 sentences connecting themes for a learner reading the homepage.
- "dayTheme" is a short punchy phrase (4-8 words).
- "disclaimer" must state that this is educational commentary, not financial advice, and summaries are based on public RSS headline titles only.`;

let openai;
const getOpenAi = () => {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

const SYSTEM_PROMPT = `You are BloomVest AI, an expert investment tutor built into an interactive investment education platform. Your role is to teach people how to invest in a clear, engaging, and educational way.

Guidelines:
- Explain concepts simply, using real-world examples and analogies
- Use **bold** for key terms and bullet points for lists — avoid markdown headers (# or ##)
- Keep formatting clean: use bold and bullets, not hash tags or excessive formatting
- When discussing stocks, mention real tickers and approximate valuations
- Always emphasize risk management and long-term thinking
- If asked about specific investment advice, remind users this is for education only
- Keep responses focused and under 300 words unless the topic requires more detail
- Use relevant emojis sparingly to make responses engaging
- Reference the platform's Demo Trading and Learn features when relevant
- Cover topics: stocks, bonds, ETFs, index funds, portfolio building, risk management, behavioral finance, financial statements, dividends, compound interest, market analysis
- Be encouraging and supportive — no question is too basic`;

router.post('/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' });
    }

    const user = await getOrCreateUser(sessionId);

    await pool.query(
      'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)',
      [user.id, 'user', message]
    );

    const historyResult = await pool.query(
      'SELECT role, content FROM chat_messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [user.id]
    );
    const history = historyResult.rows.reverse();

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(m => ({ role: m.role, content: m.content }))
    ];

    const completion = await getOpenAi().chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    await pool.query(
      'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)',
      [user.id, 'assistant', reply]
    );

    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const user = await getOrCreateUser(sessionId);
    const result = await pool.query(
      'SELECT role, content, created_at FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC LIMIT 100',
      [user.id]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error('Chat history error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.delete('/history', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const user = await getOrCreateUser(sessionId);
    await pool.query('DELETE FROM chat_messages WHERE user_id = $1', [user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Clear history error:', err);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

router.get('/daily-brief', async (req, res) => {
  try {
    const now = Date.now();
    const bust = req.query.refresh === '1' || req.query.refresh === 'true';
    if (
      !bust &&
      dailyBriefCache.payload &&
      now - dailyBriefCache.at < DAILY_BRIEF_CACHE_MS
    ) {
      return res.json(dailyBriefCache.payload);
    }

    const headlines = await fetchAggregatedHeadlines();
    const forPrompt = headlines.slice(0, 42);
    const headlineLines = forPrompt.length
      ? forPrompt.map((h) => `• [${h.source}] ${h.title}`).join('\n')
      : '(No headlines retrieved; give general 2026 learner-focused market education themes: diversification, rates awareness, earnings quality, and risk management.)';

    let analysis = {
      dayTheme: 'Markets in focus',
      signals: [
        {
          stance: 'watch',
          title: 'Stay headline-aware',
          detail:
            'Price moves often react to macro and earnings news. Use headlines as prompts to research fundamentals, not as automatic trade triggers.',
        },
        {
          stance: 'caution',
          title: 'Volatility is normal',
          detail:
            'Short-term swings are expected. A learning mindset focuses on position sizing and time horizon rather than chasing every move.',
        },
        {
          stance: 'opportunity',
          title: 'Build a research habit',
          detail:
            'Pick one theme from the news cycle and trace it to sectors, ETFs, or company fundamentals to deepen your understanding.',
        },
      ],
      narrative:
        'Today’s tape is shaped by a mix of macro data, corporate earnings, and sentiment. As you read the headlines below, ask what would have to be true for each story to matter to long-term investors—and what could prove it wrong.',
      disclaimer:
        'Educational commentary only, not financial advice. Summaries are based on public RSS headlines, not full articles.',
    };

    if (process.env.OPENAI_API_KEY && headlines.length > 0) {
      try {
        const userPrompt = `Today's date (server): ${new Date().toISOString().slice(0, 10)}\n\nHeadline titles from public RSS:\n${headlineLines}\n\nReturn JSON with keys: dayTheme (string), signals (array of {stance, title, detail}), narrative (string), disclaimer (string).`;

        const completion = await getOpenAi().chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.55,
          max_tokens: 1200,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: DAILY_BRIEF_SYSTEM },
            { role: 'user', content: userPrompt },
          ],
        });

        const raw = completion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.dayTheme && Array.isArray(parsed.signals) && parsed.narrative) {
            analysis = {
              dayTheme: String(parsed.dayTheme),
              signals: parsed.signals.slice(0, 6).map((s) => ({
                stance: ['watch', 'caution', 'opportunity'].includes(s.stance)
                  ? s.stance
                  : 'watch',
                title: String(s.title || '').slice(0, 120),
                detail: String(s.detail || '').slice(0, 600),
              })),
              narrative: String(parsed.narrative),
              disclaimer: String(
                parsed.disclaimer ||
                  analysis.disclaimer
              ),
            };
          }
        }
      } catch (e) {
        console.warn('Daily brief AI step failed:', e.message);
      }
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      headlines,
      ...analysis,
    };

    dailyBriefCache = { at: now, payload };
    res.json(payload);
  } catch (err) {
    console.error('Daily brief error:', err);
    res.status(500).json({ error: 'Failed to build daily brief' });
  }
});

module.exports = router;
