import React, {
  useContext,
  useEffect,
  useRef,
  memo,
  useMemo,
  forwardRef,
} from "react";
import MessageWrapper from "./MessageWrapper";
import styles from "../../styles/message.module.scss";
import userContext from "../../context/userContext";
import { UnreadMessageBar } from "./UnreadMessageBar";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

export const DELETED_MESSAGE_HEIGHT = 52;

const DeletedMessage = forwardRef(
  (
    {
      message,
      previousMessageSender,
      unreadMessagesCount,
      unreadMessage,
      handleMessageRead,
      handleMessageReadFinalCallback,
      userId = "",
      style,
      messageMiddleWrapperMaxWidth = "auto",
    },
    variableSizeListRef
  ) => {
    const { userData: user, socket } = useContext(userContext);

    const messageRef = useRef();

    const { isIntersecting } = useIntersectionObserver(
      variableSizeListRef,
      messageRef
    );

    userId = userId || user?._id;
    let isOwnMessage =
      message?.fromAdmin && user ? true : message?.sender === userId;
    let isPreviousMessageSenderSame = message?.sender === previousMessageSender;

    const readUserIds = useMemo(
      () => message.readBy?.map((readUser) => readUser?.readBy) || [],
      [message]
    );

    useEffect(() => {
      if (isIntersecting) {
        handleMessageRead(
          userId,
          socket,
          message?.sender,
          readUserIds,
          message?.conversation,
          message?._id,
          handleMessageReadFinalCallback
        );
      }
    }, [isIntersecting, userId, socket, message]);
    return (
      <MessageWrapper
        ref={messageRef}
        style={style}
        isOwnMessage={isOwnMessage}
      >
        {unreadMessage?._id === message?._id && (
          <UnreadMessageBar unreadMessagesCount={unreadMessagesCount} />
        )}
        <div
          style={{
            opacity: 0.75,
            display: "flex",
            justifyContent: isOwnMessage ? "flex-end" : "flex-start",
            maxWidth: messageMiddleWrapperMaxWidth,
            alignSelf:
              isOwnMessage &&
              !isNaN(messageMiddleWrapperMaxWidth) &&
              "flex-end",
          }}
        >
          <div
            className={styles.messageMiddleWrapper}
            data-own-message={isOwnMessage}
            data-previous-message-sender-same={isPreviousMessageSenderSame}
          >
            <i className={styles.messageText}>This message was deleted</i>
          </div>
        </div>
      </MessageWrapper>
    );
  }
);

export default memo(DeletedMessage);
