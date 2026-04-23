const { AzureOpenAI, OpenAI } = require('openai');

let cachedClient;
let cachedMode;

function getAzureApiKey() {
  return process.env.AZURE_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY || '';
}

function getAzureEndpoint() {
  return process.env.AZURE_OPENAI_ENDPOINT || process.env.AZURE_OPENAI_RESOURCE_ENDPOINT || '';
}

function getAzureDeployment(kind = 'default') {
  if (kind === 'analysis') {
    return (
      process.env.AZURE_OPENAI_ANALYSIS_DEPLOYMENT ||
      process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
      process.env.AZURE_OPENAI_DEPLOYMENT ||
      ''
    );
  }

  if (kind === 'chat') {
    return process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || process.env.AZURE_OPENAI_DEPLOYMENT || '';
  }

  return process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || '';
}

function canUseAzure(kind = 'default') {
  return Boolean(getAzureEndpoint() && getAzureApiKey() && getAzureDeployment(kind));
}

function getClientMode() {
  return canUseAzure('default') || canUseAzure('chat') || canUseAzure('analysis') ? 'azure' : 'openai';
}

function getOpenAiClient() {
  const mode = getClientMode();
  if (!cachedClient || cachedMode !== mode) {
    cachedMode = mode;
    if (mode === 'azure') {
      cachedClient = new AzureOpenAI({
        endpoint: getAzureEndpoint(),
        apiKey: getAzureApiKey(),
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview',
      });
    } else {
      cachedClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }
  return cachedClient;
}

function resolveModel(kind = 'default', fallbackModel = 'gpt-4o-mini') {
  if (kind === 'analysis') {
    return (
      getAzureDeployment('analysis') ||
      process.env.OPENAI_ANALYSIS_MODEL ||
      process.env.OPENAI_MODEL ||
      fallbackModel
    );
  }

  if (kind === 'chat') {
    return (
      getAzureDeployment('chat') ||
      process.env.OPENAI_CHAT_MODEL ||
      process.env.OPENAI_MODEL ||
      fallbackModel
    );
  }

  return (
    getAzureDeployment('default') ||
    getAzureDeployment('chat') ||
    process.env.OPENAI_MODEL ||
    fallbackModel
  );
}

function hasAiCredentials(kind = 'default') {
  if (kind === 'analysis' || kind === 'chat') {
    return Boolean(canUseAzure(kind) || process.env.OPENAI_API_KEY);
  }
  return Boolean(canUseAzure('default') || canUseAzure('chat') || canUseAzure('analysis') || process.env.OPENAI_API_KEY);
}

module.exports = {
  getOpenAiClient,
  hasAiCredentials,
  resolveModel,
};
