import {
  END,
  GraphNode,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";

import { MessagesState } from "./state";
import { getDynamicModel } from "./model";

const llmCall: GraphNode<typeof MessagesState> = async (
  state,
) => {
  // todo: receive this model id from frontend
  const model = getDynamicModel("gemini-2.5-flash");

  const response = await model.invoke([
    new SystemMessage("You are a helpful assistant."),
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
};

export const agent = new StateGraph(MessagesState)
  .addNode("callLlm", llmCall)
  .addEdge(START, "callLlm")
  .addEdge("callLlm", END)
  .compile();
