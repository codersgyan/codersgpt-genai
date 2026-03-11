import { db } from "@/db";
import { thread } from "@/db/schema/chat-schema";
import {
  BaseMessage,
  mapChatMessagesToStoredMessages,
} from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";

import { and, eq } from "drizzle-orm";

export async function getMessageHistory({
  graph,
  threadId,
  userId,
}: {
  graph: any;
  threadId: string;
  userId: string;
}) {
  const existingThreads = await db
    .select()
    .from(thread)
    .where(
      and(
        eq(thread.id, threadId),
        eq(thread.userId, userId),
      ),
    )
    .limit(1);

  const isOwner = existingThreads.length > 0;

  if (!isOwner) return [];

  const config = { configurable: { thread_id: threadId } };

  const state = await graph.getState(config);

  const messages =
    (state?.values?.messages as BaseMessage[]) ?? [];

  const serialisedMessages =
    mapChatMessagesToStoredMessages(messages);

  return serialisedMessages;
}
