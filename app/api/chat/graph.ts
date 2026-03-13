import {
  END,
  GraphNode,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

import { MessagesState } from "./state";
import { getDynamicModel } from "./model";
import { tools } from "./tools";

const llmCall: GraphNode<typeof MessagesState> = async (
  state,
) => {
  // todo: receive this model id from frontend
  const model = getDynamicModel("gpt-5-mini");

  const modelWithTools = model.bindTools(tools);

  const response = await modelWithTools.invoke([
    new SystemMessage("You are a helpful assistant."),
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
};

// this an in-memory store
// const checkpointer = new MemorySaver();
const checkpointer = PostgresSaver.fromConnString(
  process.env.DATABASE_URL!,
);

// do this only one time.
// (async () => {
//   await checkpointer.setup();
// })();

function shouldContinue(state: typeof MessagesState.State) {
  const lastMessage = state.messages.at(-1);

  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return "__end__";
  }

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  return "__end__";
}

const toolNode = new ToolNode(tools);

export const agent = new StateGraph(MessagesState)
  .addNode("callLlm", llmCall)
  .addNode("tools", toolNode)
  .addEdge(START, "callLlm")
  .addConditionalEdges("callLlm", shouldContinue, {
    __end__: END,
    tools: "tools",
  })
  // .addEdge("callLlm", END)
  .compile({ checkpointer });
