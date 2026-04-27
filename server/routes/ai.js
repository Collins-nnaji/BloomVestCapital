const express = require('express');
const { pool, getOrCreateUser } = require('../db');
const { getOpenAiClient, hasAiCredentials, resolveModel, getClientMode } = require('../openai-client');

const router = express.Router();

// ─── RSS feeds: broad coverage across equities, macro, sectors, crypto, commodities ───
const RSS_FEEDS = [
  // Major indices & broad market
  { url: 'https://news.google.com/rss/search?q=S%26P+500+Dow+Jones+Nasdaq&hl=en-US&gl=US&ceid=US:en', source: 'Google Markets', id: 'g_markets' },
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

// Deep Analysis Cache: results mapped by JSON.stringify(prefs + assetTypes)
let deepAnalysisCache = new Map();
const DEEP_ANALYSIS_CACHE_MS = 15 * 60 * 1000;

// Cleanup old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of deepAnalysisCache.entries()) {
    if (now - val.at > DEEP_ANALYSIS_CACHE_MS) deepAnalysisCache.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Strips markdown code blocks and other noise from AI JSON responses.
 */
function sanitizeAiJson(raw) {
  if (!raw) return '';
  let clean = raw.trim();
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');
  clean = clean.trim();
  // If JSON appears truncated, attempt to close open structures so JSON.parse has a chance
  if (clean.startsWith('{') && !clean.endsWith('}')) {
    // Count unclosed arrays and objects to patch the tail
    let depth = 0; let inStr = false; let escape = false;
    for (const ch of clean) {
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inStr) { escape = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === '{' || ch === '[') depth++;
      else if (ch === '}' || ch === ']') depth--;
    }
    // Trim trailing incomplete token (incomplete string or bare key)
    clean = clean.replace(/,?\s*"[^"]*$/, '').replace(/,?\s*[^}\]]*$/, '');
    // Close open structures
    while (depth-- > 0) clean += depth === 0 ? '}' : ']';
    if (!clean.endsWith('}')) clean += '}';
  }
  return clean;
}

const RSS_PER_FEED = 12;
const RSS_MAX_TOTAL = 180;
const RSS_FETCH_MS = 15000;

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
    const fhDate = item.datetime ? new Date(item.datetime * 1000) : null;
    out.push({
      title: item.headline || '',
      summary: item.summary ? item.summary.slice(0, 350) : '',
      source: item.source || 'Finnhub',
      sourceId: `fh_${item.category || 'general'}`,
      sentiment: '',
      tickers: item.related || '',
      category: item.category || 'general',
      pubDate: fhDate ? fhDate.toISOString() : null,
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
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const tm = block.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const lm = block.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
    const dm = block.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i)
            || block.match(/<dc:date\b[^>]*>([\s\S]*?)<\/dc:date>/i)
            || block.match(/<updated\b[^>]*>([\s\S]*?)<\/updated>/i);
    const title = decodeXmlEntities(tm ? tm[1].trim() : '');
    const link  = lm ? decodeXmlEntities(lm[1].trim()) : null;
    const pubDateRaw = dm ? dm[1].trim() : null;
    const pubDate = pubDateRaw ? new Date(pubDateRaw) : null;
    if (title) items.push({ title, link, pubDate: pubDate && !isNaN(pubDate) ? pubDate : null });
  }
  // Sort newest first, items without dates go to end
  items.sort((a, b) => {
    if (a.pubDate && b.pubDate) return b.pubDate - a.pubDate;
    if (a.pubDate) return -1;
    if (b.pubDate) return 1;
    return 0;
  });
  return items.slice(0, limit);
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
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      signal: ctl.signal,
    });
    clearTimeout(t);
    if (res.status === 429) {
      console.warn(`[RSS] Rate limited (429) for ${source}`);
      return [];
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const rows = parseRssHeadlines(xml, RSS_PER_FEED * 3); // parse more, then filter by age
    const cutoff = Date.now() - 48 * 60 * 60 * 1000; // drop anything older than 48 h
    const fresh = rows.filter(h => !h.pubDate || h.pubDate.getTime() >= cutoff);
    const final = (fresh.length > 0 ? fresh : rows).slice(0, RSS_PER_FEED); // fall back to all if none pass
    return final.map((h) => ({
      title: h.title,
      link: h.link,
      pubDate: h.pubDate ? h.pubDate.toISOString() : null,
      source,
      sourceId: id,
    }));
  } catch (e) {
    if (e.name === 'AbortError') {
      console.warn(`[RSS] Timeout fetching ${source}`);
    } else {
      console.warn(`[RSS] ${source} failed:`, e.message);
    }
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

  // Sort all sources newest-first before dedup so freshest wins
  merged.sort((a, b) => {
    const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });

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

    const { headlines, tickerSentiments } = await fetchAggregatedHeadlines();
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
          messages: [
            { role: 'system', content: DAILY_BRIEF_SYSTEM },
            { role: 'user', content: userPrompt },
          ],
        });

        const raw = completion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(sanitizeAiJson(raw));
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
          messages: [
            { role: 'system', content: INVESTMENT_MODES_SYSTEM },
            { role: 'user', content: ideaPrompt },
          ],
        });

        const raw = completion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(sanitizeAiJson(raw));
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

    // Serialize ticker sentiments for the frontend sentiment tab
    const tickerSentimentArray = [...tickerSentiments.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 60)
      .map(([ticker, v]) => ({
        ticker,
        label: v.label,
        avgScore: v.avgScore,
        count: v.count,
      }));

    const payload = {
      generatedAt: new Date().toISOString(),
      headlines: headlines.slice(0, 60),
      investmentModes,
      tickerSentiments: tickerSentimentArray,
      ...analysis,
    };

    dailyBriefCache = { at: now, payload };
    res.json(payload);
  } catch (err) {
    console.error('Daily brief error:', err);
    res.status(500).json({ error: 'Failed to build daily brief' });
  }
});

const DEEP_ANALYSIS_SYSTEM = `You are a high-end quantitative market analyst for BloomVest Strategic Capital.
Your goal is to provide a deep, data-driven analysis of the current market landscape based on live headlines.

CORE REQUIREMENTS:
1. VARIETY & SPECIFICITY: Do not just recommend the same 5 mega-cap tech stocks (AAPL, MSFT, NVDA, etc.) every time. If they are in the news, you can include them, but seek out mid-cap, sectoral, or commodity opportunities mentioned in the headlines.
2. DATA-DRIVEN: Base your picks STRICTLY on the context provided in the headlines. If a specific ticker is mentioned with sentiment data, prioritize analyzing that ticker.
3. STRUCTURE: Return a valid JSON object with the following schema:
{
  "topTheme": "...",
  "marketContext": "...",
  "sectorBreakdown": { "Sector Name": "Detailed note about why this sector is relevant now..." },
  "picks": [
    {
      "company": "...",
      "ticker": "...",
      "assetType": "Stocks|ETFs|Commodities|Crypto|Options Plays",
      "sector": "...",
      "action": "Strong Buy|Buy|Watch|Reduce|Avoid",
      "confidence": "High|Medium|Low",
      "trend": "Uptrend|Downtrend|Sideways|Reversal",
      "trendStrength": "Strong|Moderate|Weak",
      "thesis": "...",
      "entrySignal": "...",
      "priceContext": "...",
      "catalysts": ["...", "...", "..."],
      "risk": "...",
      "horizon": "...",
      "fit": "Balanced|Growth|Value|Income|Speculative|Defensive|Momentum|Compounder|Core|Hedge|Catalyst|Cyclical"
    }
  ],
  "disclaimer": "..."
}

RULES:
- Calibrate to the user's risk level, horizon, and preferred asset types.
- Output ONLY valid JSON — no markdown fences, no extra text before or after.
- Keep your analysis professional, technical, and objective.
- Return 15-20 picks per response.
- The "assetType" field MUST be exactly one of: "Stocks", "ETFs", "Commodities", "Crypto", "Options Plays" — no other values.
- For each pick: "thesis" = 2-3 detailed sentences, "entrySignal" = specific price action or technical trigger, "priceContext" = current market sentiment context, "catalysts" = up to 3 items, "risk" = 1-2 sentences.
- Ensure the JSON is complete and valid — do not truncate.`;

router.post('/deep-analysis', async (req, res) => {
  try {
    const { 
      sessionId, 
      riskLevel = 'moderate', 
      horizon = 'medium', 
      sectors = [], 
      style = 'balanced', 
      assetTypes = ['Stocks', 'ETFs', 'Commodities'],
      batchIndex = 1,
      totalBatches = 1
    } = req.body || {};

    if (sessionId) {
      await getOrCreateUser(sessionId);
    }

    // 1. Production Caching: Check if we have a recent result for these parameters
    const cacheKey = JSON.stringify({ riskLevel, horizon, style, sectors, assetTypes, batchIndex, totalBatches });
    const cached = deepAnalysisCache.get(cacheKey);
    if (cached && (Date.now() - cached.at < DEEP_ANALYSIS_CACHE_MS)) {
      console.log('[AI Cache] Returning cached deep analysis for:', cacheKey);
      return res.json({ ...cached.payload, fromCache: true });
    }

    const { headlines, tickerSentiments } = await fetchAggregatedHeadlines();
    const headlineLines = headlines.length
      ? buildHeadlineBlock(headlines, 60)
      : '(No live headlines available; synthesise from broad 2026 macro themes: AI infrastructure, rate policy, energy transition, consumer health.)';

    const sentimentTable = buildTickerSentimentTable(tickerSentiments);

    const prefBlock = [
      `Risk level: ${riskLevel}`,
      `Horizon: ${horizon === 'short' ? '1-6 months' : horizon === 'long' ? '2-5 years' : '6-18 months'}`,
      `Style: ${style}`,
      `Asset types to include: ${assetTypes.join(', ')}`,
      sectors.length ? `Preferred sectors: ${sectors.join(', ')}` : 'Sectors: no preference — diversify across opportunities in the requested asset types',
    ].join('\n');

    const segmentInstructions = [
      "Focus on Mega-Cap leaders and major market indices mentioned in the headlines.",
      "Focus on Mid-Cap growth opportunities and emerging sector leaders.",
      "Focus on Value plays, Cyclical stocks, and Dividend payers.",
      "Focus on Technology, AI infrastructure, and Semiconductor specialized plays.",
      "Focus on Energy, Commodities, and related ETFs/Proxies.",
      "Focus on Financials, Healthcare, and Defensive sectors.",
      "Focus on Crypto, Emerging Tech, and high-volatility Catalyst plays.",
      "Focus on a diverse mix of under-the-radar names mentioned in the headlines that haven't been picked in other segments."
    ];

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
      `BATCH INFO: This is request ${batchIndex} of ${totalBatches} for a large-scale analysis.`,
      `SEGMENT SPECIALIZATION: ${segmentInstructions[batchIndex - 1] || 'Focus on unique tickers from the headlines to ensure a diverse final aggregated list.'}`,
      '',
      `INSTRUCTIONS: Using ALL the above data return JSON with keys: topTheme (string), marketContext (string), sectorBreakdown (object), picks (array of exactly 12 items), disclaimer (string).`,
      'The picks MUST be grounded in real data above.',
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

    const normalisePick = (p) => ({
      company: String(p.company || 'Unknown').slice(0, 100),
      ticker: String(p.ticker || '—').slice(0, 12),
      assetType: (() => {
        const VALID = ['Stocks','ETFs','Commodities','Crypto','Options Plays'];
        if (VALID.includes(p.assetType)) return p.assetType;
        // Snap stray AI values to canonical ones
        const t = String(p.assetType || '').toLowerCase();
        if (t.includes('etf'))     return 'ETFs';
        if (t.includes('crypto') || t.includes('coin') || t.includes('token')) return 'Crypto';
        if (t.includes('option'))  return 'Options Plays';
        if (t.includes('commodi') || t.includes('gold') || t.includes('oil') || t.includes('silver')) return 'Commodities';
        return 'Stocks';
      })(),
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

    try {
      console.log(`[AI] Running deep analysis via ${getClientMode()} (${resolveModel('analysis', 'gpt-4o')})`);
      const completion = await getOpenAiClient().chat.completions.create({
        model: resolveModel('analysis', 'gpt-4o'),
        temperature: 0.45,
        max_tokens: 3500,
        messages: [
          { role: 'system', content: DEEP_ANALYSIS_SYSTEM },
          { role: 'user', content: userPrompt },
        ],
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) throw new Error('Empty response from model');

      const parsed = JSON.parse(sanitizeAiJson(raw));

      const picks = Array.isArray(parsed.picks) ? parsed.picks.slice(0, 20).map(normalisePick) : fallback.picks;
      const sectorBreakdown = (parsed.sectorBreakdown && typeof parsed.sectorBreakdown === 'object') ? parsed.sectorBreakdown : {};

      const payload = {
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
      };

      // 2. Cache successful result
      deepAnalysisCache.set(cacheKey, { at: Date.now(), payload });
      return res.json(payload);
    } catch (aiErr) {
      const isRateLimit = aiErr.message.includes('429');
      const isAuthError = aiErr.message.includes('401') || aiErr.message.includes('403');

      console.error(`[AI] Deep analysis failed (${getClientMode()}):`, aiErr.message);

      const userFriendlyError = (isRateLimit || isAuthError)
        ? 'Market analysis service is temporarily busy. Showing reference data.'
        : 'Live AI analysis is currently unavailable. Showing reference data.';

      return res.json({ 
        ...fallback, 
        generatedAt: new Date().toISOString(), 
        fromFallback: true, 
        headlines: headlines.slice(0, 60), 
        aiError: userFriendlyError 
      });
    }
  } catch (err) {
    console.error('Deep analysis error:', err);
    res.status(500).json({ error: 'Failed to run deep analysis' });
  }
});

// Single-headline AI insight
router.post('/analyse-headline', async (req, res) => {
  try {
    const { title, source } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });

    const prompt = `You are a concise financial analyst. A user wants a quick educational insight on this news headline:

"${title}"
Source: ${source || 'Unknown'}

Respond in 3 short bullet points (max 20 words each):
1. What this likely means for markets / investors
2. Which asset class or sector is most affected
3. One key risk to watch

Keep it factual, educational, and jargon-free. Do NOT give personalised investment advice.`;

    const completion = await getOpenAiClient().chat.completions.create({
      model: resolveModel('chat', 'gpt-4o-mini'),
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 220,
      temperature: 0.5,
    });

    res.json({ insight: completion.choices[0].message.content });
  } catch (err) {
    console.error('Headline analysis error:', err);
    res.status(500).json({ error: 'Failed to analyse headline' });
  }
});

/* ── Journal AI assistant ───────────────────────────── */
router.post('/journal-assist', async (req, res) => {
  try {
    const { noteContent, action } = req.body;
    if (!noteContent?.trim()) return res.status(400).json({ error: 'No note content provided' });

    const systemPrompt = `You are a trading journal assistant for BloomVest Capital. You help investors reflect on their trades, decisions, and strategies. Be concise, insightful, and educational. Never give direct financial advice — frame everything as educational analysis and reflection prompts.`;

    const actionPrompts = {
      summarise: `Summarise the key points from this trading journal note in 3-4 bullet points. Be concise.\n\nNote:\n${noteContent}`,
      analyse: `Analyse this trading journal entry. Identify:\n1. The core thesis or decision being described\n2. Potential psychological biases at play (if any)\n3. What went well or could be improved\n4. A key learning to carry forward\n\nNote:\n${noteContent}`,
      improve: `Suggest 3 specific improvements to this trader's thinking or approach based on what they wrote. Frame each as an actionable reflection question.\n\nNote:\n${noteContent}`,
      risks: `Identify the key risks and blind spots in this trading note. What is the trader potentially missing or underweighting? Be direct but constructive.\n\nNote:\n${noteContent}`,
    };

    const userPrompt = actionPrompts[action] || actionPrompts.summarise;

    const completion = await getOpenAiClient().chat.completions.create({
      model: resolveModel('chat', 'gpt-4o-mini'),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 350,
      temperature: 0.6,
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    console.error('Journal assist error:', err);
    res.status(500).json({ error: 'Failed to analyse note' });
  }
});

// ─── Save deep analysis result for authenticated user ────────────────────────
router.post('/analysis/save', async (req, res) => {
  try {
    const { sessionId, payload, preferences } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const dbUser = await getOrCreateUser(sessionId);
    await pool.query(
      `INSERT INTO user_analysis (user_id, payload, preferences, generated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET payload = EXCLUDED.payload,
             preferences = EXCLUDED.preferences,
             generated_at = NOW()`,
      [dbUser.id, JSON.stringify(payload), JSON.stringify(preferences || {})]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Analysis save error:', err);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// ─── Load last saved deep analysis for authenticated user ────────────────────
router.get('/analysis/saved', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const dbUser = await getOrCreateUser(sessionId);
    const result = await pool.query(
      'SELECT payload, preferences, generated_at FROM user_analysis WHERE user_id = $1',
      [dbUser.id]
    );
    if (result.rows.length === 0) return res.json({ saved: null });
    const row = result.rows[0];
    res.json({ saved: { ...row.payload, generatedAt: row.generated_at, savedPreferences: row.preferences } });
  } catch (err) {
    console.error('Analysis load error:', err);
    res.status(500).json({ error: 'Failed to load analysis' });
  }
});

module.exports = router;
