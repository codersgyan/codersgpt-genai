import { agent } from "@/app/api/chat/graph";
import { ChatInterfaceNew } from "@/components/chat-interface";
import { auth } from "@/lib/auth";
import { getMessageHistory } from "@/lib/conversation";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}>) {
  const { thread_id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  // this will run on server side

  const messages = await getMessageHistory({
    graph: agent,
    threadId: thread_id as string,
    userId: session?.user.id,
  });

  console.log(JSON.stringify(messages, null, 2));
  return (
    <>
      <ChatInterfaceNew oldMessages={messages} />
    </>
  );
}
