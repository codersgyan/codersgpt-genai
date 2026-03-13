import { UIMessage } from "ai";
import { RefreshCcwIcon, CopyIcon } from "lucide-react";
import React, { Fragment } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";
import { ProductCarousel } from "./gen-ui/product-carousel";

const MessageRenderer = ({
  messages,
}: {
  messages: UIMessage[];
}) => {
  return (
    <>
      {messages.map((message, messageIndex) => (
        <Fragment key={message.id}>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                const isLastMessage =
                  messageIndex === messages.length - 1;
                return (
                  <Fragment key={`${message.id}-${i}`}>
                    <Message from={message.role}>
                      <MessageContent>
                        <MessageResponse>
                          {part.text}
                        </MessageResponse>
                      </MessageContent>
                    </Message>
                    {message.role === "assistant" &&
                      isLastMessage && (
                        <MessageActions>
                          <MessageAction
                            onClick={() => {}}
                            label="Retry">
                            <RefreshCcwIcon className="size-3" />
                          </MessageAction>
                          <MessageAction
                            onClick={() =>
                              navigator.clipboard.writeText(
                                part.text,
                              )
                            }
                            label="Copy">
                            <CopyIcon className="size-3" />
                          </MessageAction>
                        </MessageActions>
                      )}
                  </Fragment>
                );
              case "dynamic-tool":
                switch (part.toolName) {
                  case "display_products":
                    if (part.state === "output-available") {
                      const toolContent = JSON.parse(
                        (part.output as any).kwargs.content,
                      );

                      return (
                        <div
                          key={`${part.toolCallId}-${i}`}>
                          <ProductCarousel
                            query={toolContent.query}
                            products={toolContent.products}
                          />
                        </div>
                      );
                    }
                  default:
                    return null;
                }

              default:
                return null;
            }
          })}
        </Fragment>
      ))}
      <ConversationScrollButton />
    </>
  );
};

export default MessageRenderer;
