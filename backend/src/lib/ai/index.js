import { GroqProvider } from './groq.provider.js';
import { OpenAIProvider } from './openai.provider.js';
import { GeminiProvider } from './gemini.provider.js';

const providers = {
  groq: GroqProvider,
  openai: OpenAIProvider,
  gemini: GeminiProvider
};

let aiInstance = null;

export function getAIProvider(providerName = null) {
  const name = providerName || process.env.AI_PROVIDER || 'groq';
  
  const ProviderClass = providers[name];
  if (!ProviderClass) {
    throw new Error(`Unknown AI provider: ${name}. Available: ${Object.keys(providers).join(', ')}`);
  }

  return new ProviderClass();
}

export function getAI() {
  if (!aiInstance) {
    aiInstance = getAIProvider();
  }
  return aiInstance;
}

export { GroqProvider, OpenAIProvider, GeminiProvider };
