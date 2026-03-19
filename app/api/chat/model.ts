import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

type ModelProvider = "openai" | "google" | "anthropic";
type ModelTier = "free" | "subscription";

export type ModelId =
  | "gpt-5-mini"
  | "gpt-5-nano"
  | "gemini-3.1-pro-preview"
  | "gemini-2.5-flash";

type ModelConfig = {
  provider: ModelProvider;
  tier: ModelTier;
  options?: Record<string, unknown>;
};

export const MODEL_REGISTRY: Record<ModelId, ModelConfig> =
  {
    "gpt-5-mini": {
      provider: "openai",
      tier: "free",
      options: { reasoning: { effort: "minimal" } },
    },
    "gpt-5-nano": {
      provider: "openai",
      tier: "free",
      options: { reasoning: { effort: "minimal" } },
    },
    "gemini-3.1-pro-preview": {
      provider: "google",
      tier: "subscription",
      options: { temparature: 0 },
    },
    "gemini-2.5-flash": {
      provider: "google",
      tier: "subscription",
      options: { temparature: 0 },
    },
  };

function getDefaultModel() {
  return new ChatOpenAI({
    model: "gpt-5-nano",
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function createModel(
  modelId: ModelId,
  config: ModelConfig,
) {
  const base = { model: modelId, ...config.options };

  if (config.provider === "openai") {
    return new ChatOpenAI({
      ...base,
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else if (config.provider === "google") {
    return new ChatGoogleGenerativeAI({
      ...base,
      apiKey: process.env.GOOGLE_API_KEY,
    });
  } else if (config.provider === "anthropic") {
    // todo: create anthropic chat instance
    return getDefaultModel();
  }

  return getDefaultModel();
}

export function getDynamicModel(modelId: ModelId) {
  const config = MODEL_REGISTRY[modelId];
  if (!config) return getDefaultModel();

  return createModel(modelId, config);
}
