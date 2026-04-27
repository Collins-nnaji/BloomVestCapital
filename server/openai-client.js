const { OpenAI } = require('openai');

let cachedClient;

function getClient() {
  if (!cachedClient) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
    const apiKey   = process.env.AZURE_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY || '';

    // This resource uses the standard OpenAI-compatible API at /openai/v1
    // (not the Azure deployment-per-URL format)
    const baseURL = endpoint.replace(/\/$/, '') + '/openai/v1';

    console.log(`[AI] Initialising client (base: ${baseURL})`);
    cachedClient = new OpenAI({ apiKey, baseURL });
  }
  return cachedClient;
}

function resolveModel(kind = 'default') {
  if (kind === 'analysis') {
    return (
      process.env.AZURE_OPENAI_ANALYSIS_DEPLOYMENT ||
      process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
      process.env.AZURE_OPENAI_DEPLOYMENT ||
      'gpt-4.1-mini'
    );
  }
  if (kind === 'chat') {
    return process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4.1-mini';
  }
  return process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || 'gpt-4.1-mini';
}

function hasAiCredentials() {
  return Boolean(
    (process.env.AZURE_OPENAI_ENDPOINT || '') &&
    (process.env.AZURE_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY || '')
  );
}

function getClientMode() {
  return 'azure';
}

// Named alias so existing call sites don't need to change
const getOpenAiClient = getClient;

module.exports = {
  getOpenAiClient,
  hasAiCredentials,
  resolveModel,
  getClientMode,
  OpenAI,
};
