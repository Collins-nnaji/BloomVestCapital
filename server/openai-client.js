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

function getOpenAiClient(kind = 'default') {
  const mode = getClientMode();
  // We check if the specific kind is supported by Azure. If not, and we have an OpenAI key, we might want to use OpenAI.
  // However, the current structure uses a single cachedClient. 
  // Let's refine this to allow switching based on the 'kind' if necessary, or at least ensure the client matches the capabilities.
  
  if (!cachedClient || cachedMode !== mode) {
    cachedMode = mode;
    if (mode === 'azure') {
      console.log(`[AI] Initialising Azure OpenAI client (endpoint: ${getAzureEndpoint()})`);
      cachedClient = new AzureOpenAI({
        endpoint: getAzureEndpoint(),
        apiKey: getAzureApiKey(),
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview',
      });
    } else {
      console.log('[AI] Initialising standard OpenAI client');
      cachedClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }
  return cachedClient;
}

function resolveModel(kind = 'default', fallbackModel = 'gpt-4o-mini') {
  const mode = getClientMode();
  
  if (mode === 'azure') {
    const deployment = getAzureDeployment(kind);
    if (deployment) return deployment;
    
    // If we are in Azure mode but no specific deployment for this kind, 
    // it's likely to fail unless we have a 'default' deployment.
    return getAzureDeployment('default') || fallbackModel;
  }

  if (kind === 'analysis') {
    return process.env.OPENAI_ANALYSIS_MODEL || process.env.OPENAI_MODEL || fallbackModel;
  }

  if (kind === 'chat') {
    return process.env.OPENAI_CHAT_MODEL || process.env.OPENAI_MODEL || fallbackModel;
  }

  return process.env.OPENAI_MODEL || fallbackModel;
}

function hasAiCredentials(kind = 'default') {
  const canAzure = canUseAzure(kind);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  
  if (kind === 'analysis' || kind === 'chat') {
    return canAzure || hasOpenAI;
  }
  
  return canAzure || canUseAzure('chat') || canUseAzure('analysis') || hasOpenAI;
}

module.exports = {
  getOpenAiClient,
  hasAiCredentials,
  resolveModel,
  getClientMode,
  OpenAI,
  AzureOpenAI,
};
