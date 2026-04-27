# BloomVest AI Analysis — Full Technical Documentation

---

## Architecture Overview

```
Browser (React)
      │
      ▼
  src/api.js          ← single frontend API layer
      │
      ▼
Express Server
      ├── server/routes/ai.js        ← main AI routes
      ├── server/routes/scenario.js  ← simulator AI routes
      └── server/openai-client.js    ← Azure OpenAI client (shared)
```

---

## The AI Client — `server/openai-client.js`

This is the single shared module that all AI routes use. It initialises one `AzureOpenAI` client and reuses it across all requests (cached singleton).

### Environment Variables

| Variable | Purpose |
|---|---|
| `AZURE_OPENAI_ENDPOINT` | Your Azure resource URL |
| `AZURE_OPENAI_KEY` | Auth key |
| `AZURE_OPENAI_API_VERSION` | e.g. `2025-01-01-preview` |
| `AZURE_OPENAI_DEPLOYMENT` | Default deployment name |
| `AZURE_OPENAI_CHAT_DEPLOYMENT` | Deployment used for chat/advisor calls |
| `AZURE_OPENAI_ANALYSIS_DEPLOYMENT` | Deployment used for deep analysis calls |

### Deployment Resolution Priority (`resolveModel(kind)`)

- `kind = 'analysis'` → `AZURE_OPENAI_ANALYSIS_DEPLOYMENT` → `CHAT_DEPLOYMENT` → `DEPLOYMENT`
- `kind = 'chat'` → `AZURE_OPENAI_CHAT_DEPLOYMENT` → `DEPLOYMENT`
- `kind = 'default'` → `AZURE_OPENAI_DEPLOYMENT` → `CHAT_DEPLOYMENT`

---

## Data Sources

The AI is fed data from **three external data pipelines** that run in parallel before every AI call.

---

### 1. RSS Feeds (18 feeds, no API key needed)

Fetched via plain HTTP. Up to **12 headlines per feed**, capped at **180 total**. Timeout per feed: 15 seconds.

| Feed ID | Source | Coverage |
|---|---|---|
| `g_markets` | Google News | S&P 500, Dow, Nasdaq |
| `cnbc` | CNBC Markets | Broad market |
| `marketwatch` | MarketWatch | Top stories |
| `mw_pulse` | MarketWatch Pulse | Live market pulse |
| `cnbc_earn` | CNBC Earnings | Earnings reports |
| `g_earn` | Google News | Beats/misses/guidance |
| `g_analyst` | Google News | Upgrades/downgrades/targets |
| `cnbc_tech` | CNBC Tech | Technology sector |
| `g_tech` | Google News | AI, semiconductors, big tech |
| `ct` | CoinTelegraph | Crypto |
| `g_crypto` | Google News | Bitcoin, Ethereum |
| `cnbc_energy` | CNBC Energy | Energy sector |
| `g_comm` | Google News | Gold, oil, commodities |
| `g_macro` | Google News | Fed, rates, inflation, CPI |
| `g_health` | Google News | FDA, biotech, pharma |
| `g_fin` | Google News | Banking, financials |
| `bbc` | BBC Business | International/macro |
| `g_global` | Google News | Trade, tariffs, geopolitics |
| `g_opts` | Google News | Options, VIX, volatility |

---

### 2. Alpha Vantage News & Sentiment API (`ALPHA_VANTAGE_KEY`)

Three parallel calls made to the Alpha Vantage `NEWS_SENTIMENT` endpoint:

- **Broad latest news** — 50 articles, sorted by recency
- **Major tech tickers** — `MSFT, NVDA, GOOGL, AMZN, AAPL, META, TSLA, AMD` — 30 articles sorted by relevance
- **Crypto tickers** — `BTC:USD, ETH:USD` — 20 articles sorted by recency

**What it adds beyond RSS:**

- Article summaries (up to 350 characters each)
- Per-article sentiment label and numeric score (Bullish / Somewhat-Bullish / Neutral / Somewhat-Bearish / Bearish)
- Per-ticker sentiment aggregation — scores averaged across all articles that mention each ticker, producing a ranked table of up to 40 tickers injected directly into the AI prompt. Example:

```
NVDA         Somewhat-Bullish       score=+0.312  (14 articles)
MSFT         Bullish                score=+0.451  (11 articles)
BTC:USD      Neutral                score=+0.021  (9 articles)
```

---

### 3. Finnhub News API (`FINNHUB_KEY`)

Three parallel calls:

- `general` category
- `crypto` category
- `merger` category

Up to **100 deduplicated articles** total. Adds headlines with related ticker symbols.

---

### Deduplication

After all three sources are merged, headlines are deduplicated by normalised title (lowercased, punctuation stripped, first 140 characters used as key). Maximum **180 unique headlines** are passed to the AI.

---

## The Six AI Endpoints

---

### 1. `GET /ai/daily-brief`

**Purpose:** Homepage market overview — generates a day theme, market signals, and narrative.

**Cache:** 25 minutes (force refresh with `?refresh=1`).

**Flow:**
1. Fetch all headlines + Alpha Vantage + Finnhub in parallel
2. Build headline block — top 60 headlines with summaries and sentiment labels
3. Call Azure OpenAI with `DAILY_BRIEF_SYSTEM` prompt
4. Parse JSON response → `{ dayTheme, signals[], narrative, disclaimer }`
5. Second call with `INVESTMENT_MODES_SYSTEM` prompt → `{ longTerm[], shortTerm[], methodology, disclaimer }`
6. Merge both into one response with raw headlines attached

**Model used:** `resolveModel('default')` — your `AZURE_OPENAI_DEPLOYMENT`

**If AI fails:** Falls back to hardcoded static defaults — still returns a valid educational response.

---

### 2. `POST /ai/deep-analysis`

**Purpose:** The main quantitative analysis — generates 12 specific investment picks per call, designed to be called in batches.

**Cache:** 15 minutes per unique combination of `{ riskLevel, horizon, style, sectors, assetTypes, batchIndex, totalBatches }`.

**Request body:**
```json
{
  "sessionId": "...",
  "riskLevel": "moderate",
  "horizon": "medium",
  "style": "balanced",
  "sectors": [],
  "assetTypes": ["Stocks", "ETFs", "Commodities"],
  "batchIndex": 1,
  "totalBatches": 1
}
```

**Flow:**
1. Check cache — return immediately if a recent result exists
2. Fetch all headlines + build Alpha Vantage ticker sentiment table
3. Build user preference block (risk level, horizon, style, sectors, asset types)
4. Apply segment specialisation based on `batchIndex`:
   - Batch 1 → Mega-cap leaders and major indices
   - Batch 2 → Mid-cap growth and emerging sector leaders
   - Batch 3 → Value plays, Cyclicals, Dividend payers
   - Batch 4 → Technology, AI infrastructure, Semiconductors
   - Batch 5 → Energy, Commodities, related ETFs
   - Batch 6 → Financials, Healthcare, Defensive sectors
   - Batch 7 → Crypto, Emerging Tech, high-volatility Catalysts
   - Batch 8 → Under-the-radar names from headlines not picked in other batches
5. Call Azure OpenAI with `DEEP_ANALYSIS_SYSTEM` prompt — requests exactly 12 picks
6. Validate and normalise each pick — sanitises `assetType`, `action`, `confidence`, and `trend` to allowed enum values
7. Cache successful result and return

**Pick schema returned:**
```json
{
  "company": "...",
  "ticker": "...",
  "assetType": "Stocks | ETFs | Commodities | Crypto | Options Plays",
  "sector": "...",
  "action": "Strong Buy | Buy | Watch | Reduce | Avoid",
  "confidence": "High | Medium | Low",
  "trend": "Uptrend | Downtrend | Sideways | Reversal",
  "trendStrength": "Strong | Moderate | Weak",
  "thesis": "2-3 sentences",
  "entrySignal": "specific price/technical trigger",
  "priceContext": "market sentiment context",
  "catalysts": ["...", "...", "..."],
  "risk": "1-2 sentences",
  "horizon": "...",
  "fit": "Balanced | Growth | Value | Income | Speculative | Defensive | Momentum | Compounder | Core | Hedge | Catalyst | Cyclical"
}
```

**Model used:** `resolveModel('analysis')` — your `AZURE_OPENAI_ANALYSIS_DEPLOYMENT`

**If AI fails:** Returns static fallback picks with `fromFallback: true` flag in the response.

---

### 3. `POST /ai/chat`

**Purpose:** Conversational AI tutor — answers general investing questions with memory of conversation history.

**Flow:**
1. Save user message to PostgreSQL (`chat_messages` table, keyed by `sessionId`)
2. Load last 20 messages for this user (conversation history for context)
3. Call Azure OpenAI with investment tutor system prompt + full conversation history
4. Save AI reply to database
5. Return `{ reply: "..." }`

**Model used:** `resolveModel('chat')` — your `AZURE_OPENAI_CHAT_DEPLOYMENT`

**No fallback** — errors return HTTP 500.

---

### 4. `POST /ai/analyse-headline`

**Purpose:** Quick 3-bullet insight on a single clicked headline in the daily brief.

**Request body:** `{ title, source }`

**Flow:**
1. Takes the headline title and source name
2. Single Azure call, 220 max tokens
3. Returns 3 bullets:
   - What this likely means for markets / investors
   - Which asset class or sector is most affected
   - One key risk to watch

**Model used:** `resolveModel('chat')`

---

### 5. `POST /ai/journal-assist`

**Purpose:** AI reflection coach for the trading journal feature.

**Request body:** `{ noteContent, action }`

**Actions:**

| Action | What it does |
|---|---|
| `summarise` | 3-4 bullet summary of the journal note |
| `analyse` | Identifies thesis, psychological biases, strengths, and key learnings |
| `improve` | 3 actionable reflection questions to improve the trader's thinking |
| `risks` | Identifies key risks and blind spots in the note |

**Model used:** `resolveModel('chat')` — 350 max tokens

---

### 6. `POST /scenario/advisor`

**Purpose:** Real-time coaching inside the investment simulator, responding to student actions.

**Actions:**

| Action | Trigger |
|---|---|
| `START_SCENARIO` | Student opens a scenario |
| `BUY_STOCK` | Student buys shares |
| `SELL_STOCK` | Student sells shares |
| `ASK_ADVICE` | Student submits a question |
| `CHECK_PROGRESS` | Student requests a progress review |
| `COMPLETE_SCENARIO` | All objectives completed |

Each action sends full portfolio state (cash balance, holdings) and objective progress to the AI, which responds with contextual coaching advice.

**Model used:** `resolveModel('chat')` — 600 max tokens

---

### Scenario Builder — `POST /scenario/custom/generate`

Accepts a user-configured builder form and uses Azure OpenAI to generate a complete playable scenario, including:
- Title, description, difficulty, duration
- Up to 16 asset tickers
- 3–6 structured objectives with rule types (e.g. `holdings_count_min`, `invest_percent_min`, `stock_in_portfolio`)
- Tips and learning goals

**Model used:** `resolveModel('chat')` — 1100 max tokens, JSON mode enabled

---

## Full Data Flow Diagram

```
Every /daily-brief and /deep-analysis request:

  ┌─────────────────────────────────────────────────────────┐
  │  fetchAggregatedHeadlines()  — runs fully in parallel   │
  │                                                         │
  │  ┌─────────────────┐  ┌──────────────────────────────┐  │
  │  │  18 RSS Feeds   │  │  Alpha Vantage API            │  │
  │  │  (all parallel) │  │  - broad news (50 articles)   │  │
  │  │  12 per feed    │  │  - tech tickers (30 articles) │  │
  │  │  180 max total  │  │  - crypto tickers (20 articles│  │
  │  └─────────────────┘  │  → ticker sentiment table     │  │
  │  ┌─────────────────┐  └──────────────────────────────┘  │
  │  │  Finnhub API    │                                     │
  │  │  - general news │                                     │
  │  │  - crypto news  │                                     │
  │  │  - merger news  │                                     │
  │  └─────────────────┘                                     │
  │                                                         │
  │  → Merge all sources                                    │
  │  → Deduplicate by normalised title                      │
  │  → Cap at 180 headlines                                 │
  │  → Build ticker sentiment table (Alpha Vantage only)    │
  └─────────────────────────────────────────────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────────────────────────┐
  │  Azure OpenAI (your deployment)                         │
  │                                                         │
  │  System prompt  →  defines role, output schema, rules   │
  │  User prompt    →  headlines + ticker sentiment table   │
  │                    + user preferences (risk/horizon)    │
  │                                                         │
  │  → Structured JSON response                             │
  └─────────────────────────────────────────────────────────┘
                    │
                    ▼
  Validate fields → normalise enums → cache result → browser
```

---

## Required Environment Variables Summary

| Variable | Used by | Required |
|---|---|---|
| `AZURE_OPENAI_ENDPOINT` | All AI routes | Yes |
| `AZURE_OPENAI_KEY` | All AI routes | Yes |
| `AZURE_OPENAI_API_VERSION` | All AI routes | Yes |
| `AZURE_OPENAI_DEPLOYMENT` | daily-brief, fallback | Yes |
| `AZURE_OPENAI_CHAT_DEPLOYMENT` | chat, advisor, journal, scenario | Recommended |
| `AZURE_OPENAI_ANALYSIS_DEPLOYMENT` | deep-analysis | Recommended |
| `ALPHA_VANTAGE_KEY` | Ticker sentiment data | Optional |
| `FINNHUB_KEY` | Merger and crypto news | Optional |

---

## Caching Summary

| Endpoint | Cache Duration | Cache Key |
|---|---|---|
| `/ai/daily-brief` | 25 minutes | Global (one cache for all users) |
| `/ai/deep-analysis` | 15 minutes | Per `{ riskLevel, horizon, style, sectors, assetTypes, batchIndex, totalBatches }` |
| All other endpoints | No cache | — |

---

*Document generated: April 2026*
