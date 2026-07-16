import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Minimal Lovable AI Gateway provider — OpenAI-compatible chat completions.
// This file is server-only. Never import from client bundles.
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}