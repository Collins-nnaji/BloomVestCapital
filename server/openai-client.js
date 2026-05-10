const { OpenAI } = require('openai');

let cachedClient;

/**
 * Resolve credentials without caching the HTTP client (reads latest process.env).
 * Azure Foundry / AI Services: set AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_KEY (or AZURE_OPENAI_API_KEY).
 * Standard OpenAI: set OPENAI_API_KEY (optional OPENAI_BASE_URL for proxies).
 */
function getAiConfig() {
  let azureEndpoint = (process.env.AZURE_OPENAI_ENDPOINT || '').trim().replace(/\/$/, '');
  const azureKey = (
    process.env.AZURE_OPENAI_KEY ||
    process.env.AZURE_OPENAI_API_KEY ||
    ''
  ).trim();
  const openaiKey = (process.env.OPENAI_API_KEY || '').trim();
  const openaiBase =
    (process.env.OPENAI_BASE_URL || '').trim().replace(/\/$/, '') || 'https://api.openai.com/v1';

  if (azureEndpoint && azureKey) {
    if (!azureEndpoint.endsWith('/openai/v1')) {
      azureEndpoint = `${azureEndpoint}/openai/v1`;
    }
    return { baseURL: azureEndpoint, apiKey: azureKey, mode: 'azure' };
  }

  if (openaiKey) {
    return { baseURL: openaiBase, apiKey: openaiKey, mode: 'openai' };
  }

  return { baseURL: '', apiKey: '', mode: 'none' };
}

function getClient() {
  if (!cachedClient) {
    const { baseURL, apiKey, mode } = getAiConfig();
    if (!apiKey || !baseURL) {
      throw new Error('No AI credentials configured (Azure or OPENAI_API_KEY)');
    }
    console.log(`[AI] Client ready — mode=${mode}, baseURL=${baseURL}`);
    cachedClient = new OpenAI({ apiKey, baseURL });
  }
  return cachedClient;
}

/** Call after editing .env so the next request picks up new keys/endpoints without restarting… actually still need restart to clear module cache; exposed for tests. */
function resetAiClientCache() {
  cachedClient = undefined;
}

function resolveModel(kind = 'default') {
  if (kind === 'analysis') {
    return (
      process.env.AZURE_OPENAI_ANALYSIS_DEPLOYMENT ||
      process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
      process.env.AZURE_OPENAI_DEPLOYMENT ||
      process.env.OPENAI_ANALYSIS_MODEL ||
      process.env.OPENAI_MODEL ||
      'gpt-4o-mini'
    );
  }
  if (kind === 'chat') {
    return (
      process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
      process.env.AZURE_OPENAI_DEPLOYMENT ||
      process.env.OPENAI_CHAT_MODEL ||
      process.env.OPENAI_MODEL ||
      'gpt-4o-mini'
    );
  }
  return (
    process.env.AZURE_OPENAI_DEPLOYMENT ||
    process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
    process.env.OPENAI_MODEL ||
    'gpt-4o-mini'
  );
}

function hasAiCredentials() {
  const { apiKey, baseURL } = getAiConfig();
  return Boolean(apiKey && baseURL);
}

function getClientMode() {
  return getAiConfig().mode;
}

/** Startup diagnostics (no secrets). */
function logAiConfigSummary() {
  const { baseURL, mode } = getAiConfig();
  if (mode === 'none') {
    console.warn(
      '[AI] No credentials: set AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_KEY, or OPENAI_API_KEY. Deep analysis and chat will fall back or fail.'
    );
    return;
  }
  console.log(`[AI] Config: mode=${mode}, endpoint=${baseURL}`);
}

const getOpenAiClient = getClient;

module.exports = {
  getOpenAiClient,
  hasAiCredentials,
  resolveModel,
  getClientMode,
  getAiConfig,
  resetAiClientCache,
  logAiConfigSummary,
  OpenAI,
};
