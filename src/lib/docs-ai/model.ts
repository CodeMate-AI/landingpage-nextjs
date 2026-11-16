import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export class AIConfigError extends Error {}

// OpenAI-compatible gateway. The token goes in `authorization` and the key in `api-key`
export function getModel() {
  const baseURL = process.env.DOCS_AI_BASE_URL;
  const token = process.env.DOCS_AI_TOKEN;
  const apiKey = process.env.DOCS_AI_API_KEY;
  if (!baseURL || !token || !apiKey) throw new AIConfigError("Docs AI is not configured");

  const provider = createOpenAICompatible({
    name: "codemate",
    baseURL,
    headers: { authorization: token, "api-key": apiKey },
  });
  return provider.chatModel(process.env.DOCS_AI_MODEL || "bodh-b0");
}

export function isAIConfigured() {
  return Boolean(process.env.DOCS_AI_BASE_URL && process.env.DOCS_AI_TOKEN && process.env.DOCS_AI_API_KEY);
}
