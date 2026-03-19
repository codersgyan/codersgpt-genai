import { HumanMessage } from "@langchain/core/messages";
import { agent } from "./graph";
import { db } from "@/db";
import { thread } from "@/db/schema/chat-schema";
import { eq } from "drizzle-orm";
import { auth, polarClient } from "@/lib/auth";
import { headers } from "next/headers";
import { createUIMessageStreamResponse } from "ai";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { MODEL_REGISTRY, ModelId } from "./model";

// /api/chat
export async function POST(request: Request) {
  const { threadId, messageContent, selectedModel } =
    await request.json();

  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData?.user.id) {
    return new Response(
      "Forbidden: You don't have access to this thread",
      { status: 403 },
    );
  }
  // todo: check if thread exists if not create new one

  const threadsFromDB = await db
    .select()
    .from(thread)
    .where(eq(thread.id, threadId))
    .limit(1);

  const existingThread = threadsFromDB[0];

  if (!existingThread) {
    const title =
      messageContent.trim().slice(0, 30) || "New chat";

    await db.insert(thread).values({
      id: threadId,
      title: title,
      userId: authData.user.id,
    });
  }

  if (
    existingThread &&
    existingThread?.userId !== authData.user.id
  ) {
    return new Response(
      "Forbidden: You don't have access to this thread",
      { status: 403 },
    );
  }

  try {
    const modelToBeUsed =
      MODEL_REGISTRY[selectedModel as ModelId];

    if (modelToBeUsed.tier === "subscription") {
      // todo: caching
      const data = await polarClient.subscriptions.list({
        externalCustomerId: authData.user.id,
        active: true,
      });

      const hasPro = data.result.items.length > 0;

      if (!hasPro) {
        return new Response(
          "This model needs a subscription",
          {
            status: 403,
          },
        );
      }
    }
  } catch (error) {
    console.log("erx", error);

    return new Response("This model needs a subscription", {
      status: 403,
    });
  }

  const stream = await agent.streamEvents(
    {
      messages: [new HumanMessage(messageContent)],
    },
    {
      version: "v2",
      configurable: {
        thread_id: threadId,
      },
      context: {
        userId: authData?.user.id,
        selectedModel: selectedModel,
      },
    },
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
