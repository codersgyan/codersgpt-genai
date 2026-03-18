import { polarClient } from "./auth";

type ingestData = {
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  total_tokens: number;
};

export async function ingestEventToPolar(data: ingestData) {
  await polarClient.events.ingest({
    events: [
      {
        name: "llm_tokens",
        externalCustomerId: data.userId,
        metadata: {
          input_tokens: data.inputTokens,
          output_tokens: data.outputTokens,
          total_tokens: data.total_tokens,
          model: data.model,
        },
      },
    ],
  });
}
