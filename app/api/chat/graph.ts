import {
  END,
  GraphNode,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

import { MessagesState } from "./state";
import { getDynamicModel } from "./model";

const llmCall: GraphNode<typeof MessagesState> = async (
  state,
) => {
  // todo: receive this model id from frontend
  const model = getDynamicModel("gpt-5-mini");

  const response = await model.invoke([
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

export const agent = new StateGraph(MessagesState)
  .addNode("callLlm", llmCall)
  .addEdge(START, "callLlm")
  .addEdge("callLlm", END)
  .compile({ checkpointer });
