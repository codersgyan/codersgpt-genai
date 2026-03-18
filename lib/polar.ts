"use server";

import { headers } from "next/headers";
import { auth, polarClient } from "./auth";

type ingestData = {
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  total_tokens: number;
};

export async function isUserHaveSubscription() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return false;
    }

    const data = await polarClient.subscriptions.list({
      externalCustomerId: session.user.id,
      active: true,
    });

    return data.result.items.length > 0;
  } catch (error) {
    console.log("erx", error);
    return false;
  }
}

export async function getCutomerMeters() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not logged in");
  }

  const meters = await polarClient.customerMeters.list({
    externalCustomerId: session.user.id,
  });

  return meters.result.items[0];
}

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
