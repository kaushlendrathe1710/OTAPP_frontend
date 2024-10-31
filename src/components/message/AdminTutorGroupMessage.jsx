import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { MessageContextMenuModalContext } from "../../context/MessageContextMenuModalContext";
import userContext from "../../context/userContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import MessageMiddleWrapper from "./MessageMiddleWrapper";
import MessageTimeView from "./MessageTimeView";
import MessageWrapper from "./MessageWrapper";
import TextMessage from "./TextMessage";
import { UnreadMessageBar } from "./UnreadMessageBar";
import FileMessage from "./FileMessage";
import VoiceMessage from "./VoiceMessage";
import ReplyMessage from "./ReplyMessage";
import MessageHeaderView from "./MessageHeaderView";

const AdminTutorGroupMessage = forwardRef(
  (
    {
      group,
      message,
      previousMessageSender,
      handleReplyMessage,
      handleForwardMessage,
      handleCopyMessage,
      handleMessageRead,
      handleMessageReadFinalCallback,
      handleAddReactionToMessage,
      handleDeleteMessagesForMe,
      handleDeleteMessagesForEveryone,
      unreadMessagesCount,
      unreadMessage,
      selectedMessages,

      style,
      forwardModal,
      messageMiddleWrapperMaxWidth = "auto",
      disableRightClick = false,
      disableMessageSeenClick = false,
      userId = "",
      width,
    },
    variableSizeListRef
  ) => {
    const { userData: user, socket } = useContext(userContext);
    const {
      hanldeShowMessageContextMenuModal,
      hanldeCloseMessageContextMenuModal,
    } = useContext(MessageContextMenuModalContext);
    userId = userId || user?._id;
    const senderId = message?.sender;

    const messageRef = useRef();

    const { isIntersecting } = useIntersectionObserver(
      variableSizeListRef,
      messageRef
    );

    // let isOwnMessage = message?.fromAdmin && user ? true : message?.sender === userId;
    let isOwnMessage = message?.sender === userId;
    let isPreviousMessageSenderSame = message?.sender === previousMessageSender;

    const readUserIds = useMemo(
      () => message.readBy?.map((readUser) => readUser?.readBy) || [],
      [message]
    );

    useEffect(() => {
      if (isIntersecting) {
        // console.log(message);
        handleMessageRead(
          userId,
          socket,
          senderId,
          readUserIds,
          message?.conversation,
          message?._id,
          handleMessageReadFinalCallback
        );
      }
    }, [isIntersecting, userId, socket, senderId, message, readUserIds]);

    const messageReadStatus = useMemo(() => {
      if (!message) return "loading";

      let someoneReadMessage = message?.readBy?.length > 0;
      let allParticipantsReadMessage =
        message?.readBy?.length ===
        group?.adminParticipants?.length -
          1 +
          group?.tutorParticipants?.length -
          1;

      if (allParticipantsReadMessage) {
        return "readed-by-all";
      } else if (someoneReadMessage) {
        return "readed-by-someone";
      } else {
        return "delivered";
      }
    }, [message]);

    const handleForwardMessageSelection = useCallback((e, message) => {
      if (e.target.checked) {
        console.log(selectedMessages);
        message["selected"] = true;
        selectedMessages.push(message);
      } else {
        message["selected"] = false;

        // oppsoite of push
        selectedMessages = selectedMessages.filter(
          (msg) => msg._id !== message._id
        );
      }
    });

    const handleClickedReaction = useCallback(
      async (reaction) => {
        if (!reaction) {
          return;
        }
        try {
          await handleAddReactionToMessage(
            reaction,
            socket,
            message?._id,
            userId,
            message?.conversation
          );
        } catch (err) {
          console.log("An error occured while adding reaction to msg: ", err);
        }
      },
      [socket, message, userId]
    );

    const handleRightClick = (e) => {
      if (disableRightClick) {
        return;
      }
      // see all options in modal context,
      hanldeShowMessageContextMenuModal({
        isOwnMessage,
        top: e.clientY,
        left: e.clientX,
        handleForwardMessage: () => handleForwardMessage(message),
        handleReplyMessage: () => handleReplyMessage(message),
        handleDeleteMessageForMe: () =>
          handleDeleteMessagesForMe(
            socket,
            message?.conversation,
            userId,
            [message],
            hanldeCloseMessageContextMenuModal
          ),
        handleCopyMessage: () => handleCopyMessage(message?.textContent),
        handleDeleteMessageForEveryone: () =>
          handleDeleteMessagesForEveryone(
            socket,
            message?.conversation,
            userId,
            [message],
            hanldeCloseMessageContextMenuModal
          ),
      });
    };
    return (
      <>
        <MessageWrapper
          ref={messageRef}
          style={style}
          isOwnMessage={isOwnMessage}
          isSelectionOn={forwardModal}
        >
          {unreadMessage?._id === message?._id && (
            <UnreadMessageBar unreadMessagesCount={unreadMessagesCount} />
          )}
          <MessageMiddleWrapper
            message={message}
            isOwnMessage={isOwnMessage}
            isPreviousMessageSenderSame={isPreviousMessageSenderSame}
            onRightClick={handleRightClick}
            reactions={message?.reactions}
            messageMiddleWrapperMaxWidth={messageMiddleWrapperMaxWidth}
            handleClickedReaction={(reaction) =>
              handleClickedReaction(reaction)
            }
            isSelectionOn={forwardModal}
            handleForwardMessageSelection={handleForwardMessageSelection}
          >
            <MessageHeaderView
              senderName={isOwnMessage ? "You" : message?.fromAdmin?.name}
              isForwarded={message?.isForwarded}
            />
            {message?.replyOn && (
              <ReplyMessage replyMessage={message.replyOn} />
            )}
            {message.messageType === "File" ? (
              <FileMessage
                fileContent={message.fileContent}
                isOwnMessage={isOwnMessage}
              />
            ) : message.messageType === "Voice" ? (
              <VoiceMessage
                url={message.fileContent?.fileUrl}
                width={width}
                isOwnMessage={isOwnMessage}
              />
            ) : null}
            <TextMessage
              text={message?.textContent || message?.fileContent?.textContent}
              isOwnMessage={isOwnMessage}
            />
            <MessageTimeView
              sendTime={message?.createdAt}
              isOwnMessage={isOwnMessage}
              messageReadStatus={messageReadStatus}
              readBy={message?.readBy}
              disableMessageSeenClick={disableMessageSeenClick}
            />
          </MessageMiddleWrapper>
        </MessageWrapper>
      </>
    );
  }
);

export default memo(AdminTutorGroupMessage);
