import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import { MessageContextMenuModalContext } from "../../context/MessageContextMenuModalContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import MessageMiddleWrapper from "./MessageMiddleWrapper";
import MessageTimeView from "./MessageTimeView";
import MessageWrapper from "./MessageWrapper";
import TextMessage from "./TextMessage";

export const AdminAdminMessage = forwardRef(
  (
    {
      message,
      previousMessageSender,
      handleForwardMessage,
      handleDeleteMessageForMe,
      handleCopyMessage,
      style,
    },
    variableSizeListRef
  ) => {
    const messageRef = useRef();

    const { isIntersecting } = useIntersectionObserver(
      variableSizeListRef,
      messageRef
    );

    let myId = "slmv3094msf2";
    let isOwnMessage = message?.sender === myId;
    let isPreviousMessageSenderSame = message?.sender === previousMessageSender;

    const { hanldeShowMessageContextMenuModal } = useContext(
      MessageContextMenuModalContext
    );

    useEffect(() => {
      console.log(
        `${message.textContent?.slice(0, 10)} isIntersecting: `,
        isIntersecting
      );
    }, [isIntersecting]);

    const handleRightClick = (e) => {
      // options,
      hanldeShowMessageContextMenuModal({
        isOwnMessage,
        top: e.clientY,
        left: e.clientX,
        handleForwardMessage: () => handleForwardMessage(message),
        handleDeleteMessageForMe: () => handleDeleteMessageForMe(message),
        handleCopyMessage: () => handleCopyMessage(message?.textContent),
      });
    };
    return (
      <>
        <MessageWrapper
          ref={messageRef}
          style={style}
          isOwnMessage={isOwnMessage}
        >
          <MessageMiddleWrapper
            isOwnMessage={isOwnMessage}
            isPreviousMessageSenderSame={isPreviousMessageSenderSame}
            onRightClick={handleRightClick}
            reactions={message?.reactions}
          >
            <TextMessage
              text={message?.textContent}
              isOwnMessage={isOwnMessage}
            />
            <MessageTimeView
              sendTime={message?.createdAt}
              isOwnMessage={isOwnMessage}
            />
          </MessageMiddleWrapper>
        </MessageWrapper>
      </>
    );
  }
);
