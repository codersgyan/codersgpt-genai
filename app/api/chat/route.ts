import { HumanMessage } from "@langchain/core/messages";
import { agent } from "./graph";
import { db } from "@/db";
import { thread } from "@/db/schema/chat-schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createUIMessageStreamResponse } from "ai";
import { toUIMessageStream } from "@ai-sdk/langchain";

// /api/chat
export async function POST(request: Request) {
  const { threadId, messageContent } = await request.json();

  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(authData);

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

  const stream = await agent.streamEvents(
    {
      messages: [new HumanMessage(messageContent)],
    },
    {
      version: "v2",
      configurable: {
        thread_id: threadId,
      },
    },
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
