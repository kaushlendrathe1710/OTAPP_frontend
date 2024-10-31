import React, {
  useContext,
  useEffect,
  useRef,
  forwardRef,
  useMemo,
  useCallback,
  memo,
  useState,
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
import { CHAT_TYPE } from "../../../constants/helpers";
import MessageHeaderView from "./MessageHeaderView";

const SingleUserChatMessage = forwardRef(
  (
    {
      chatType,
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
      handleForwardMessageModal,
      onReplyMessageClick,
      unreadMessagesCount,
      unreadMessage,
      selectedMessages,
      setSelectedMessages,
      messageMiddleWrapperMaxWidth = "auto",
      disableRightClick = false,
      disableMessageSeenClick = false,
      style,
      forwardModal,
      userId = "",
      width,
    },
    variableSizeListRef
  ) => {
    const { userData: user, socket } = useContext(userContext);
    const [isChecked, setIsChecked] = useState(false);

    const { hanldeShowMessageContextMenuModal, hanldeCloseMessageContextMenuModal } = useContext(
      MessageContextMenuModalContext
    );
    userId ||= user?._id;
    const senderId = message?.sender;

    const messageRef = useRef();

    const { isIntersecting } = useIntersectionObserver(variableSizeListRef, messageRef);

    let isOwnMessage =
      chatType === CHAT_TYPE.adminStudentSingleChat &&
      message?.fromAdmin &&
      user?.userType !== "Student"
        ? true
        : message?.sender === userId;
    let isPreviousMessageSenderSame = message?.sender === previousMessageSender;

    const readUserIds = useMemo(() => {
      if (chatType === CHAT_TYPE.adminAdminSingleChat) {
        return message?.readBy?.map((readUser) => readUser?.readBy?._id) || [];
      } else {
        return message?.readBy?.map((readUser) => readUser?.readBy) || [];
      }
    }, [message]);

    useEffect(() => {
      if (isIntersecting) {
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

      let anyoneReadMessage = message?.readBy?.length > 0;

      if (anyoneReadMessage) {
        return "readed-by-all";
      } else if (anyoneReadMessage) {
        return "readed-by-someone";
      } else {
        return "delivered";
      }
    }, [message]);

    // function handleCheckboxChange(event, message) {
    //     console.log(event.target.checked);
    //     const messageId = message?._id;
    //     const isChecked = event.target.checked;
    //     setIsChecked(isChecked);
    //     console.log(message);
    //     event.target.checked = isChecked;
    //     setSelectedMessages((prevSelectedMessages) => {
    //         return { ...prevSelectedMessages, [messageId]: isChecked ? message : null };
    //     });
    // }

    // const handleForwardMessageSelection = useCallback(
    //     (e, message) => {
    //         console.log(e.target.checked);
    //         if (e.target.checked) {
    //             selectedMessages[selectedMessages.length] = message;
    //         } else {
    //             selectedMessages = selectedMessages.filter((msg) => msg._id !== message._id);
    //             console.log(selectedMessages);
    //         }
    //     },
    //     [selectedMessages]
    // );

    const handleForwardMessageSelection = useCallback((e, message) => {
      if (e.target.checked) {
        console.log(selectedMessages);
        message["selected"] = true;
        selectedMessages.push(message);
      } else {
        message["selected"] = false;

        // oppsoite of push
        selectedMessages = selectedMessages.filter((msg) => msg._id !== message._id);
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

    const containerStyle = {
      rowGap: "0.5rem",
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
            handleClickedReaction={(reaction) => handleClickedReaction(reaction)}
            isSelectionOn={forwardModal}
            handleForwardMessageSelection={handleForwardMessageSelection}
          >
            {user?.userType === "Student" || user?.userType === "Tutor" ? null : (
              <MessageHeaderView
                senderName={
                  isOwnMessage
                    ? "You"
                    : message?.fromAdmin?.name ||
                      message?.fromStudent?.name ||
                      message?.fromTutor?.name
                }
                isForwarded={message?.isForwarded}
              />
            )}

            {message?.replyOn && (
              <ReplyMessage
                replyMessage={message.replyOn}
                onReplyMessageClick={onReplyMessageClick}
              />
            )}
            {message.messageType === "File" ? (
              <FileMessage fileContent={message.fileContent} isOwnMessage={isOwnMessage} />
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

export default memo(SingleUserChatMessage);
