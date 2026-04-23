const express = require('express');
const { pool, getOrCreateUser } = require('../db');
const { getOpenAiClient, hasAiCredentials, resolveModel } = require('../openai-client');

const router = express.Router();

// ─── RSS feeds: broad coverage across equities, macro, sectors, crypto, commodities ───
const RSS_FEEDS = [
  // Major indices & broad market
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EGSPC,%5EDJI,%5EIXIC', source: 'Yahoo Finance', id: 'yahoo' },
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC Markets', id: 'cnbc' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories', source: 'MarketWatch', id: 'marketwatch' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_marketpulse', source: 'MarketWatch Pulse', id: 'mw_pulse' },
  // Earnings & individual stocks
  { url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html', source: 'CNBC Earnings', id: 'cnbc_earn' },
  { url: 'https://news.google.com/rss/search?q=earnings+beat+miss+guidance+stock&hl=en-US&gl=US&ceid=US:en', source: 'Google Earnings', id: 'g_earn' },
  { url: 'https://news.google.com/rss/search?q=stock+upgrade+downgrade+analyst+target+price&hl=en-US&gl=US&ceid=US:en', source: 'Google Analyst', id: 'g_analyst' },
  // Technology & AI
  { url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', source: 'CNBC Tech', id: 'cnbc_tech' },
  { url: 'https://news.google.com/rss/search?q=AI+semiconductor+chip+nvidia+microsoft+technology+stock&hl=en-US&gl=US&ceid=US:en', source: 'Google Tech', id: 'g_tech' },
  // Crypto
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph', id: 'ct' },
  { url: 'https://news.google.com/rss/search?q=bitcoin+ethereum+crypto+cryptocurrency&hl=en-US&gl=US&ceid=US:en', source: 'Google Crypto', id: 'g_crypto' },
  // Commodities & energy
  { url: 'https://www.cnbc.com/id/10000867/device/rss/rss.html', source: 'CNBC Energy', id: 'cnbc_energy' },
  { url: 'https://news.google.com/rss/search?q=gold+oil+copper+commodity+silver+natural+gas&hl=en-US&gl=US&ceid=US:en', source: 'Google Commodities', id: 'g_comm' },
  // Macro: Fed, rates, inflation
  { url: 'https://news.google.com/rss/search?q=Federal+Reserve+interest+rates+inflation+CPI+GDP&hl=en-US&gl=US&ceid=US:en', source: 'Google Macro', id: 'g_macro' },
  // Healthcare & biotech
  { url: 'https://news.google.com/rss/search?q=FDA+approval+biotech+pharma+drug+trial+healthcare+stock&hl=en-US&gl=US&ceid=US:en', source: 'Google Health', id: 'g_health' },
  // Financials & banking
  { url: 'https://news.google.com/rss/search?q=bank+financial+JPMorgan+Goldman+earnings+interest+rate&hl=en-US&gl=US&ceid=US:en', source: 'Google Financials', id: 'g_fin' },
  // International / geopolitics
  { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC Business', id: 'bbc' },
  { url: 'https://news.google.com/rss/search?q=trade+tariff+geopolitics+China+Europe+market&hl=en-US&gl=US&ceid=US:en', source: 'Google Global', id: 'g_global' },
  // Options & volatility
  { url: 'https://news.google.com/rss/search?q=options+volatility+VIX+short+squeeze+puts+calls&hl=en-US&gl=US&ceid=US:en', source: 'Google Options', id: 'g_opts' },
];

let dailyBriefCache = { at: 0, payload: null };
const DAILY_BRIEF_CACHE_MS = 25 * 60 * 1000;
const RSS_PER_FEED = 8;
const RSS_MAX_TOTAL = 120;
const RSS_FETCH_MS = 12000;

// ─── Alpha Vantage: market news with sentiment ──────────────────────────────
// Returns { articles: [...], tickerSentiments: Map<ticker, {score, label, count}> }
async function fetchAlphaVantageNews() {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) return { articles: [], tickerSentiments: new Map() };

  const fetchAV = async (params) => {
    try {
      const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&${params}&apikey=${key}`;
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 12000);
      const res = await fetch(url, { signal: ctl.signal });
      clearTimeout(t);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.feed) ? data.feed : [];
    } catch (e) {
      return [];
    }
  };

  // Broad latest news + targeted major-ticker calls in parallel
  const [broadFeed, techFeed, cryptoFeed] = await Promise.all([
    fetchAV('sort=LATEST&limit=50'),
    fetchAV('tickers=MSFT,NVDA,GOOGL,AMZN,AAPL,META,TSLA,AMD&sort=RELEVANCE&limit=30'),
    fetchAV('tickers=BTC:USD,ETH:USD&sort=LATEST&limit=20'),
  ]);

  // Deduplicate across feeds by title
  const seen = new Set();
  const allItems = [];
  for (const item of [...broadFeed, ...techFeed, ...cryptoFeed]) {
    const key = String(item.title || '').slice(0, 100).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    allItems.push(item);
  }

  // Aggregate ticker sentiment across all articles
  const tickerSentiments = new Map();
  for (const item of allItems) {
    if (!Array.isArray(item.ticker_sentiment)) continue;
    for (const ts of item.ticker_sentiment) {
      const t = ts.ticker;
      const score = parseFloat(ts.ticker_sentiment_score) || 0;
      const label = ts.ticker_sentiment_label || '';
      if (!t || !label) continue;
      if (!tickerSentiments.has(t)) {
        tickerSentiments.set(t, { scoreSum: 0, count: 0, label: '', labels: [] });
      }
      const entry = tickerSentiments.get(t);
      entry.scoreSum += score;
      entry.count += 1;
      entry.labels.push(label);
    }
  }
  // Finalise: compute average score and most-common label
  for (const [ticker, entry] of tickerSentiments) {
    entry.avgScore = entry.scoreSum / entry.count;
    const labelCounts = {};
    for (const l of entry.labels) labelCounts[l] = (labelCounts[l] || 0) + 1;
    entry.label = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  }

  const articles = allItems.slice(0, 80).map(item => ({
    title: item.title || '',
    summary: item.summary ? item.summary.slice(0, 350) : '',
    source: item.source || 'Alpha Vantage',
    sourceId: 'av',
    sentiment: item.overall_sentiment_label || '',
    sentimentScore: item.overall_sentiment_score ?? null,
    tickers: Array.isArray(item.ticker_sentiment)
      ? item.ticker_sentiment.slice(0, 5).map(ts => `${ts.ticker}(${ts.ticker_sentiment_label})`).join(', ')
      : '',
  }));

  return { articles, tickerSentiments };
}

// ─── Finnhub: general + crypto + merger news ──────────────────────────────
async function fetchFinnhubNews() {
  const key = process.env.FINNHUB_KEY;
  if (!key) return [];

  const fetchCategory = async (category) => {
    try {
      const url = `https://finnhub.io/api/v1/news?category=${category}&token=${key}`;
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 10000);
      const res = await fetch(url, { signal: ctl.signal });
      clearTimeout(t);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn(`Finnhub ${category} failed:`, e.message);
      return [];
    }
  };

  const [general, crypto, merger] = await Promise.all([
    fetchCategory('general'),
    fetchCategory('crypto'),
    fetchCategory('merger'),
  ]);

  // Deduplicate by headline
  const seen = new Set();
  const out = [];
  for (const item of [...general, ...crypto, ...merger]) {
    const k = String(item.headline || '').slice(0, 100).toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push({
      title: item.headline || '',
      summary: item.summary ? item.summary.slice(0, 350) : '',
      source: item.source || 'Finnhub',
      sourceId: `fh_${item.category || 'general'}`,
      sentiment: '',
      tickers: item.related || '',
      category: item.category || 'general',
    });
  }
  return out.slice(0, 100);
}

// Build a ranked ticker sentiment table for GPT (top 40 by article count)
function buildTickerSentimentTable(tickerSentiments) {
  if (!tickerSentiments || tickerSentiments.size === 0) return '';
  const rows = [...tickerSentiments.entries()]
    .filter(([, v]) => v.count >= 1)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 40);
  if (rows.length === 0) return '';
  const lines = rows.map(([ticker, v]) => {
    const score = v.avgScore >= 0 ? `+${v.avgScore.toFixed(3)}` : v.avgScore.toFixed(3);
    return `  ${ticker.padEnd(12)} ${v.label.padEnd(22)} score=${score}  (${v.count} articles)`;
  });
  return `TICKER SENTIMENT SIGNALS (from Alpha Vantage — ${rows.length} tickers across ${[...tickerSentiments.values()].reduce((s, v) => s + v.count, 0)} article mentions):\n${lines.join('\n')}`;
}

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

// Returns { headlines: [...], tickerSentiments: Map }
async function fetchAggregatedHeadlines() {
  const [rssBatches, avResult, fhNews] = await Promise.all([
    Promise.all(RSS_FEEDS.map((f) => fetchOneRssFeed(f))),
    fetchAlphaVantageNews(),
    fetchFinnhubNews(),
  ]);

  const { articles: avNews, tickerSentiments } = avResult;

  const merged = [
    ...rssBatches.flat(),
    ...avNews,
    ...fhNews,
  ];

  const seen = new Set();
  const out = [];
  for (const h of merged) {
    const key = normalizeHeadlineKey(h.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(h);
    if (out.length >= RSS_MAX_TOTAL) break;
  }
  return { headlines: out, tickerSentiments };
}

// Build a rich text block for GPT: headline + optional summary + sentiment + tickers
function buildHeadlineBlock(headlines, limit = 100) {
  return headlines.slice(0, limit).map(h => {
    let line = `• [${h.source}] ${h.title}`;
    if (h.tickers) line += ` | Tickers: ${h.tickers}`;
    if (h.sentiment && h.sentiment !== '') line += ` | Sentiment: ${h.sentiment}`;
    if (h.summary) line += `\n  Summary: ${h.summary}`;
    return line;
  }).join('\n');
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

const INVESTMENT_MODES_SYSTEM = `You are BloomVest's investing ideas engine for an educational app.

You receive only aggregated public RSS headline titles from multiple finance/business sources. You do NOT have full articles, live prices, proprietary data, or the user's personal financial information.

Rules:
- Output valid JSON only, no markdown.
- This is educational market commentary, not personalized financial advice.
- Never claim certainty. Use balanced language.
- Separate ideas into "longTerm" and "shortTerm".
- Each list must contain 4 to 6 ideas.
- Prefer actual investable names connected to the headlines: public companies, commodity proxies, commodity ETFs, sector ETFs, index ETFs, or major bond ETFs.
- Avoid vague entries like "AI theme" or "energy theme" unless no cleaner investable proxy exists.
- Each idea must include:
  - asset: actual company, ETF, commodity proxy, or commodity name
  - ticker: real ticker when applicable, otherwise use a recognizable commodity symbol/name like Gold or Oil
  - vehicle: one of Stock, ETF, Bond ETF, Commodity, Commodity ETF
  - reason: 1 concise sentence explaining the structural thesis
  - whyNow: 1 concise sentence linking the thesis to current headline flow
  - risk: 1 concise sentence naming the main thing that could go wrong
  - horizon: for longTerm use horizons like "3-5 years" or "5+ years"; for shortTerm use horizons like "days-weeks" or "1-3 months"
  - fit: a short label such as Compounder, Defensive, Momentum, Catalyst, Income, Cyclical
- Use liquid, recognizable names only.
- If headline evidence is thin for a category, infer cautiously from broad macro themes and say so indirectly in the wording.
- Add "methodology" as 2-3 sentences explaining that ideas were synthesized from headline themes across multiple public sources, then grouped by long-term vs short-term suitability.
- Add "disclaimer" that clearly says this is educational, not financial advice, and based on public RSS headline titles only.`;

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

    const completion = await getOpenAiClient().chat.completions.create({
      model: resolveModel('chat', 'gpt-4o-mini'),
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

    const { headlines } = await fetchAggregatedHeadlines();
    const headlineLines = headlines.length
      ? buildHeadlineBlock(headlines, 60)
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

    let investmentModes = {
      methodology:
        'These ideas are synthesized from recurring themes appearing across multiple public finance and business RSS headlines, then split by holding period. Long-term ideas emphasize durable earnings power, diversification, and resilience; short-term ideas emphasize nearer catalysts and momentum sensitivity.',
      disclaimer:
        'Educational commentary only, not financial advice. Ideas are derived from public RSS headline titles only, not full articles or personalized portfolio analysis.',
      longTerm: [
        {
          asset: 'Microsoft',
          ticker: 'MSFT',
          vehicle: 'Stock',
          reason: 'Microsoft combines durable enterprise cash flows with long-run exposure to cloud and AI spending.',
          whyNow: 'AI infrastructure and software productivity headlines keep reinforcing demand for large-cap platform leaders.',
          risk: 'If enterprise spending slows or AI monetization underwhelms, the premium valuation could compress.',
          horizon: '5+ years',
          fit: 'Compounder',
        },
        {
          asset: 'NVIDIA',
          ticker: 'NVDA',
          vehicle: 'Stock',
          reason: 'NVIDIA remains central to AI compute demand and semiconductor capital expenditure cycles.',
          whyNow: 'News flow around AI deployment, chip demand, and data-center investment keeps the company highly relevant.',
          risk: 'Any pause in AI spending or rising competition could trigger sharp multiple pressure.',
          horizon: '3-5 years',
          fit: 'Growth',
        },
        {
          asset: 'Gold',
          ticker: 'GLD',
          vehicle: 'Commodity ETF',
          reason: 'Gold can add diversification and act as a hedge when macro uncertainty or policy risk rises.',
          whyNow: 'A headline mix of rates, geopolitics, and risk sentiment often pushes investors toward defensive stores of value.',
          risk: 'If real yields rise or risk appetite improves, gold can lose momentum.',
          horizon: '3-5 years',
          fit: 'Defensive',
        },
        {
          asset: 'S&P 500 ETF',
          ticker: 'VOO',
          vehicle: 'ETF',
          reason: 'A broad US equity ETF spreads exposure across the companies most consistently shaping earnings headlines.',
          whyNow: 'When news is cross-cutting, diversified exposure can capture winners without overcommitting to one story.',
          risk: 'A broad slowdown in profits or valuation reset would still weigh on the whole market.',
          horizon: '5+ years',
          fit: 'Core',
        },
        {
          asset: 'US Aggregate Bonds',
          ticker: 'BND',
          vehicle: 'Bond ETF',
          reason: 'Core bonds can stabilize a portfolio and provide income while reducing equity-only volatility.',
          whyNow: 'Rate and policy headlines keep fixed income relevant for balancing risk as macro expectations shift.',
          risk: 'Bond prices can still fall if inflation stays sticky or rates move higher than expected.',
          horizon: '3-5 years',
          fit: 'Defensive',
        },
      ],
      shortTerm: [
        {
          asset: 'Tesla',
          ticker: 'TSLA',
          vehicle: 'Stock',
          reason: 'Tesla often trades on a volatile mix of delivery, margin, and product-cycle expectations.',
          whyNow: 'Any fresh headlines around pricing, autonomy, production, or demand can move the stock quickly.',
          risk: 'Negative execution news or sentiment reversals can trigger oversized downside moves.',
          horizon: '1-3 months',
          fit: 'Catalyst',
        },
        {
          asset: 'NVIDIA',
          ticker: 'NVDA',
          vehicle: 'Stock',
          reason: 'NVIDIA tends to react sharply when AI-demand or guidance headlines reshape market expectations.',
          whyNow: 'The stock is highly sensitive to earnings revisions, chip export news, and data-center spending stories.',
          risk: 'A small disappointment versus lofty expectations can hit the stock hard.',
          horizon: 'days-weeks',
          fit: 'Momentum',
        },
        {
          asset: 'Crude Oil',
          ticker: 'USO',
          vehicle: 'Commodity ETF',
          reason: 'Oil-linked instruments can move quickly when supply, geopolitical, or demand headlines shift.',
          whyNow: 'Commodity-sensitive news can create near-term breakouts or reversals faster than many equities.',
          risk: 'A change in supply expectations or growth fears can unwind the move abruptly.',
          horizon: 'days-weeks',
          fit: 'Cyclical',
        },
        {
          asset: 'Gold',
          ticker: 'GLD',
          vehicle: 'Commodity ETF',
          reason: 'Gold often becomes a tactical hedge when macro uncertainty and risk aversion rise together.',
          whyNow: 'If the headline flow is dominated by policy noise or geopolitical tension, defensive flows can strengthen.',
          risk: 'If yields rise or the market rotates back into risk assets, the trade can fade quickly.',
          horizon: '1-3 months',
          fit: 'Defensive',
        },
      ],
    };

    if (hasAiCredentials('default') && headlines.length > 0) {
      try {
        const userPrompt = `Today's date (server): ${new Date().toISOString().slice(0, 10)}\n\nHeadline titles from public RSS:\n${headlineLines}\n\nReturn JSON with keys: dayTheme (string), signals (array of {stance, title, detail}), narrative (string), disclaimer (string).`;

        const completion = await getOpenAiClient().chat.completions.create({
          model: resolveModel('default', 'gpt-4o-mini'),
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

      try {
        const ideaPrompt = `Today's date (server): ${new Date().toISOString().slice(0, 10)}\n\nHeadline titles from public RSS:\n${headlineLines}\n\nReturn JSON with keys: methodology (string), disclaimer (string), longTerm (array), shortTerm (array).`;

        const completion = await getOpenAiClient().chat.completions.create({
          model: resolveModel('default', 'gpt-4o-mini'),
          temperature: 0.5,
          max_tokens: 2200,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: INVESTMENT_MODES_SYSTEM },
            { role: 'user', content: ideaPrompt },
          ],
        });

        const raw = completion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          const normalizeIdeas = (ideas, fallbackHorizon) =>
            Array.isArray(ideas)
              ? ideas.slice(0, 6).map((idea) => ({
                  asset: String(idea.asset || 'Market theme').slice(0, 80),
                  ticker: String(idea.ticker || 'Theme').slice(0, 20),
                  vehicle: String(idea.vehicle || 'Theme').slice(0, 30),
                  reason: String(idea.reason || '').slice(0, 220),
                  whyNow: String(idea.whyNow || '').slice(0, 220),
                  risk: String(idea.risk || '').slice(0, 220),
                  horizon: String(idea.horizon || fallbackHorizon).slice(0, 30),
                  fit: String(idea.fit || 'Balanced').slice(0, 24),
                }))
              : [];

          const longTerm = normalizeIdeas(parsed.longTerm, '3-5 years');
          const shortTerm = normalizeIdeas(parsed.shortTerm, 'days-weeks');

          if (longTerm.length > 0 && shortTerm.length > 0) {
            investmentModes = {
              methodology: String(parsed.methodology || investmentModes.methodology).slice(0, 600),
              disclaimer: String(parsed.disclaimer || investmentModes.disclaimer).slice(0, 400),
              longTerm,
              shortTerm,
            };
          }
        }
      } catch (e) {
        console.warn('Investment modes AI step failed:', e.message);
      }
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      headlines: headlines.slice(0, 60),
      investmentModes,
      ...analysis,
    };

    dailyBriefCache = { at: now, payload };
    res.json(payload);
  } catch (err) {
    console.error('Daily brief error:', err);
    res.status(500).json({ error: 'Failed to build daily brief' });
  }
});

const DEEP_ANALYSIS_SYSTEM = `You are BloomVest's deep investment analysis engine. You receive real public RSS headline titles from multiple finance sources plus user preferences. Produce a detailed, structured analysis with 18–20 specific picks.

Rules:
- Output valid JSON only, no markdown fences.
- Name real, publicly-traded instruments — be specific with tickers.
- Anchor every thesis to headline evidence. No generic filler.
- Calibrate to the user's risk level, horizon, preferred sectors, and asset types.
- "assetTypes" in preferences lists which categories to include: Stocks, ETFs, Commodities, Crypto, Options Plays. Honour this — if only Stocks is requested, include only stocks.
- Include exactly 18–20 items in "picks".
- Each pick must have:
  - company: full name of company, ETF, or commodity
  - ticker: exchange ticker or commodity symbol
  - assetType: one of Stock, ETF, Commodity, Crypto, Options Play
  - sector: GICS sector or category (e.g. Information Technology, Energy, Macro)
  - action: one of Strong Buy, Buy, Watch, Reduce, Avoid
  - confidence: one of High, Medium, Low
  - trend: one of Uptrend, Downtrend, Sideways, Reversal — based on what headlines imply about recent price direction
  - trendStrength: one of Strong, Moderate, Weak
  - thesis: 2 sentences max — why this instrument, grounded in headlines
  - entrySignal: 1 sentence — what to look for before entering (technical level, catalyst event, or price condition)
  - priceContext: 1 sentence — approximate valuation or price context (note this is from general knowledge, not live data)
  - catalysts: array of exactly 3 short strings (upcoming events or themes from headlines)
  - risk: 1 sentence — the single biggest downside
  - horizon: time frame matching user preference
  - fit: one short label e.g. Compounder, Momentum, Defensive, Cyclical, Income, Catalyst, Hedge, Speculative
- Top-level fields:
  - topTheme: 5–8 word phrase, the dominant narrative today
  - marketContext: 3 sentences connecting macro headline themes — rates, earnings, geopolitics, sentiment
  - sectorBreakdown: object mapping each sector appearing in picks to a 1-sentence outlook (e.g. {"Information Technology": "AI capex cycle remains the dominant driver..."})
  - disclaimer: educational commentary only, not financial advice, based on public RSS headlines
- Use language like "may", "could", "positioned to" — never "will".
- Sort picks so Strong Buy and Buy appear first, then Watch, then Reduce/Avoid.`;

router.post('/deep-analysis', async (req, res) => {
  try {
    const { riskLevel = 'moderate', horizon = 'medium', sectors = [], style = 'balanced', assetTypes = ['Stocks', 'ETFs', 'Commodities'] } = req.body || {};

    const { headlines, tickerSentiments } = await fetchAggregatedHeadlines();
    const headlineLines = headlines.length
      ? buildHeadlineBlock(headlines, 100)
      : '(No live headlines available; synthesise from broad 2026 macro themes: AI infrastructure, rate policy, energy transition, consumer health.)';

    const sentimentTable = buildTickerSentimentTable(tickerSentiments);

    const prefBlock = [
      `Risk level: ${riskLevel}`,
      `Horizon: ${horizon === 'short' ? '1-6 months' : horizon === 'long' ? '2-5 years' : '6-18 months'}`,
      `Style: ${style}`,
      `Asset types to include: ${assetTypes.join(', ')}`,
      sectors.length ? `Preferred sectors: ${sectors.join(', ')}` : 'Sectors: no preference — diversify across opportunities in the requested asset types',
    ].join('\n');

    const userPrompt = [
      `Today's date: ${new Date().toISOString().slice(0, 10)}`,
      '',
      'User preferences:',
      prefBlock,
      '',
      sentimentTable ? sentimentTable : '',
      '',
      'Live market headlines, summaries, and sentiment signals (from RSS + Alpha Vantage + Finnhub):',
      headlineLines,
      '',
      'INSTRUCTIONS: Using ALL the above data — especially the TICKER SENTIMENT SIGNALS table and any article summaries — return JSON with keys: topTheme (string), marketContext (string), sectorBreakdown (object), picks (array of exactly 18-20 items), disclaimer (string).',
      'The picks MUST be grounded in real data above. Prioritise tickers that appear in the TICKER SENTIMENT SIGNALS table with Bullish or Somewhat-Bullish sentiment and multiple article mentions.',
      'For Crypto picks, use the crypto sentiment data. For ETFs and Commodities, tie to macro headline themes.',
      'Every pick must have all required fields including trend, trendStrength, assetType, entrySignal, priceContext, and exactly 3 catalysts.',
    ].filter(l => l !== null && l !== undefined).join('\n');

    const fallback = {
      topTheme: 'AI, rates, and selective opportunity',
      marketContext:
        'Markets are navigating a complex mix of AI-driven growth enthusiasm, uncertainty around central bank rate paths, and geopolitical supply-chain pressure. Large-cap quality and AI-infrastructure names are holding leadership while rate-sensitive sectors remain volatile. Earnings quality is under scrutiny as analysts separate durable growers from those relying on one-time factors.',
      picks: [
        {
          company: 'Microsoft',
          ticker: 'MSFT',
          sector: 'Information Technology',
          action: 'Buy',
          confidence: 'High',
          thesis: 'Microsoft combines durable enterprise cash flows with leading cloud (Azure) and AI monetisation via Copilot. Its diversified revenue base makes it resilient across macro cycles.',
          entrySignal: 'Consider entering on any pullback toward the 50-day moving average or after a post-earnings reset.',
          priceContext: 'Trades at a premium P/E (~33x) justified by double-digit earnings growth and strong FCF generation.',
          catalysts: ['Azure growth acceleration', 'Copilot enterprise adoption', 'AI capex cycle'],
          risk: 'Multiple compression if AI monetisation disappoints or enterprise IT budgets tighten.',
          horizon: '12-24 months',
          fit: 'Compounder',
        },
        {
          company: 'NVIDIA',
          ticker: 'NVDA',
          sector: 'Information Technology',
          action: 'Watch',
          confidence: 'Medium',
          thesis: 'NVIDIA dominates the AI training and inference chip market. Data-centre demand from hyperscalers keeps revenue momentum elevated. However, valuation demands execution.',
          entrySignal: 'Wait for a post-earnings consolidation or a 10-15% pullback before adding new positions.',
          priceContext: 'Valuation remains stretched on trailing metrics; forward P/E depends heavily on accelerating revenue guidance.',
          catalysts: ['Data-centre CapEx spend', 'New GPU cycle (Blackwell)', 'Sovereign AI buildouts'],
          risk: 'Any guidance miss or chip export restriction could trigger a sharp re-rating.',
          horizon: '6-18 months',
          fit: 'Momentum',
        },
        {
          company: 'Alphabet',
          ticker: 'GOOGL',
          sector: 'Communication Services',
          action: 'Buy',
          confidence: 'High',
          thesis: "Alphabet's search dominance is being extended into AI-assisted results (AI Overviews) while YouTube and Google Cloud add revenue diversification. It remains one of the most cash-generative businesses globally.",
          entrySignal: 'Current levels look reasonable; a pullback to the 200-day MA would be an attractive entry.',
          priceContext: 'Trades at a discount to mega-cap peers on a P/E basis (~22x forward), offering relative value.',
          catalysts: ['AI search monetisation', 'Google Cloud growth', 'Regulatory resolution'],
          risk: 'Antitrust rulings against the Search business pose structural risk.',
          horizon: '12-24 months',
          fit: 'Value-Growth',
        },
        {
          company: 'Eli Lilly',
          ticker: 'LLY',
          sector: 'Health Care',
          action: 'Buy',
          confidence: 'High',
          thesis: 'Eli Lilly leads the GLP-1 obesity and diabetes drug market with Mounjaro and Zepbound. The addressable market is enormous and manufacturing is scaling to meet demand.',
          entrySignal: 'Any dip on macro rotation or earnings-beat fatigue could offer a better entry point.',
          priceContext: 'Premium valuation (~50x forward) reflects multi-year pipeline optionality; position-size accordingly.',
          catalysts: ['Manufacturing capacity ramp', 'New GLP-1 label expansions', 'International approvals'],
          risk: 'Pricing pressure from Medicare negotiation or biosimilar competition could compress long-run margins.',
          horizon: '18-36 months',
          fit: 'Growth',
        },
        {
          company: 'iShares Core S&P 500 ETF',
          ticker: 'IVV',
          sector: 'Diversified',
          action: 'Buy',
          confidence: 'High',
          thesis: 'When multiple macro narratives compete simultaneously, a core broad-market ETF captures winners across sectors without single-stock concentration risk. IVV provides efficient exposure to US large-cap earnings growth.',
          entrySignal: 'Dollar-cost average on a regular schedule rather than timing a single entry.',
          priceContext: 'The S&P 500 trades near historical average valuations on a forward basis; not cheap but not extreme.',
          catalysts: ['Earnings season beats', 'Rate cut cycle resumption', 'AI productivity uplift'],
          risk: 'A broad earnings recession or major policy shock would affect the whole basket.',
          horizon: '3-5 years',
          fit: 'Core',
        },
        {
          company: 'SPDR Gold Shares',
          ticker: 'GLD',
          sector: 'Commodities',
          action: 'Watch',
          confidence: 'Medium',
          thesis: 'Gold benefits when real yields fall, the dollar weakens, or geopolitical/policy uncertainty rises. It serves as portfolio insurance rather than a growth engine.',
          entrySignal: 'Add to hedges when macro uncertainty spikes or if the dollar shows sustained weakness.',
          priceContext: 'Gold near multi-year highs; momentum is supportive but mean-reversion risk exists at elevated levels.',
          catalysts: ['Central bank buying', 'Geopolitical flare-ups', 'Inflation surprise'],
          risk: 'Rising real yields or a risk-on rotation can quickly reduce demand for gold.',
          horizon: '6-12 months',
          fit: 'Defensive',
        },
      ],
      disclaimer:
        'Educational market commentary only, not personalised financial advice. All analysis is derived from publicly available RSS headline titles and general market knowledge — not from proprietary data, full articles, or knowledge of your personal financial situation. Past performance is not indicative of future results. Please conduct your own research and consult a qualified financial adviser before making investment decisions.',
    };

    if (!hasAiCredentials('analysis') || headlines.length === 0) {
      return res.json({ ...fallback, generatedAt: new Date().toISOString(), fromFallback: true, headlines: headlines.slice(0, 60) });
    }

    try {
      const completion = await getOpenAiClient().chat.completions.create({
        model: resolveModel('analysis', 'gpt-4o'),
        temperature: 0.45,
        max_tokens: 6000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: DEEP_ANALYSIS_SYSTEM },
          { role: 'user', content: userPrompt },
        ],
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) throw new Error('Empty response from model');

      const parsed = JSON.parse(raw);

      const normalisePick = (p) => ({
        company: String(p.company || 'Unknown').slice(0, 100),
        ticker: String(p.ticker || '—').slice(0, 12),
        assetType: ['Stock', 'ETF', 'Commodity', 'Crypto', 'Options Play'].includes(p.assetType) ? p.assetType : 'Stock',
        sector: String(p.sector || 'Unknown').slice(0, 60),
        action: ['Strong Buy', 'Buy', 'Watch', 'Reduce', 'Avoid'].includes(p.action) ? p.action : 'Watch',
        confidence: ['High', 'Medium', 'Low'].includes(p.confidence) ? p.confidence : 'Medium',
        trend: ['Uptrend', 'Downtrend', 'Sideways', 'Reversal'].includes(p.trend) ? p.trend : 'Sideways',
        trendStrength: ['Strong', 'Moderate', 'Weak'].includes(p.trendStrength) ? p.trendStrength : 'Moderate',
        thesis: String(p.thesis || '').slice(0, 500),
        entrySignal: String(p.entrySignal || '').slice(0, 250),
        priceContext: String(p.priceContext || '').slice(0, 250),
        catalysts: Array.isArray(p.catalysts) ? p.catalysts.slice(0, 3).map((c) => String(c).slice(0, 80)) : [],
        risk: String(p.risk || '').slice(0, 250),
        horizon: String(p.horizon || '6-18 months').slice(0, 40),
        fit: String(p.fit || 'Balanced').slice(0, 30),
      });

      const picks = Array.isArray(parsed.picks) ? parsed.picks.slice(0, 20).map(normalisePick) : fallback.picks;
      const sectorBreakdown = (parsed.sectorBreakdown && typeof parsed.sectorBreakdown === 'object') ? parsed.sectorBreakdown : {};

      return res.json({
        topTheme: String(parsed.topTheme || fallback.topTheme).slice(0, 120),
        marketContext: String(parsed.marketContext || fallback.marketContext).slice(0, 800),
        sectorBreakdown,
        picks,
        disclaimer: String(parsed.disclaimer || fallback.disclaimer).slice(0, 600),
        generatedAt: new Date().toISOString(),
        fromFallback: false,
        headlines: headlines.slice(0, 60),
        sentimentSummary: sentimentTable ? `${tickerSentiments.size} tickers tracked` : 'No sentiment data',
        preferences: { riskLevel, horizon, sectors, style, assetTypes },
      });
    } catch (aiErr) {
      console.warn('Deep analysis AI step failed:', aiErr.message);
      return res.json({ ...fallback, generatedAt: new Date().toISOString(), fromFallback: true, headlines: headlines.slice(0, 60) });
    }
  } catch (err) {
    console.error('Deep analysis error:', err);
    res.status(500).json({ error: 'Failed to run deep analysis' });
  }
});

module.exports = router;
