import { StoredMessage } from "@langchain/core/messages";
import { UIMessage } from "ai";

export function convertLangChainToUI(
  storedMessages: StoredMessage[],
): UIMessage[] {
  const uiMessages: UIMessage[] = [];

  storedMessages?.forEach((m, index) => {
    // 1. Determine Role
    const role =
      m.type === "human"
        ? "user"
        : m.type === "ai"
          ? "assistant"
          : "system";

    // 2. Handle Tool Outputs (Merge into previous message)
    if (m.type === "tool") {
      const lastMsg = uiMessages[uiMessages.length - 1];
      if (lastMsg && lastMsg.role === "assistant") {
        // Find the specific tool part that matches this output
        const toolPart = lastMsg.parts?.find(
          (p) =>
            p.type === "dynamic-tool" &&
            p.toolCallId === m.data.tool_call_id,
        );

        if (toolPart && toolPart.type === "dynamic-tool") {
          toolPart.state = "output-available";
          // Matching your UI's specific expected output structure
          toolPart.output = {
            kwargs: { content: m.data.content },
          };
        }
      }
      return;
    }

    const parts: any[] = [];

    // 3. Extract Text Content
    if (
      typeof m.data.content === "string" &&
      m.data.content.trim() !== ""
    ) {
      parts.push({ type: "text", text: m.data.content });
    }

    // 4. Extract Tool Calls (Using Type Assertion to fix your error)
    // We cast to 'any' or a specific shape to access tool_calls safely
    const toolCalls = (m.data as any).tool_calls;
    if (m.type === "ai" && Array.isArray(toolCalls)) {
      toolCalls.forEach((tc: any) => {
        parts.push({
          type: "dynamic-tool",
          toolCallId: tc.id,
          toolName: tc.name,
          args: tc.args,
          state: "input-streaming", // Default state
        });
      });
    }

    // 5. Construct final message
    // If 'content' throws an error, it's because the AI SDK expects it inside parts only.
    uiMessages.push({
      id:
        (m.data.id as string) ||
        `msg-${index}-${Date.now()}`,
      role: role as "user" | "assistant" | "system",
      // Remove 'content: ...' if your TS definition for UIMessage strictly uses parts
      parts: parts,
    } as UIMessage);
  });

  return uiMessages;
}
