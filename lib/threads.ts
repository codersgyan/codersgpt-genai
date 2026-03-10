"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db";
import { thread } from "@/db/schema/chat-schema";
import { desc, eq } from "drizzle-orm";

export async function fetchThreads() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  // todo: error handling
  const threads = await db
    .select({
      id: thread.id,
      title: thread.title,
      createdAt: thread.createdAt,
    })
    .from(thread)
    .where(eq(thread.userId, session.user.id))
    .orderBy(desc(thread.createdAt));

  return threads;
}
