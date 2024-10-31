import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useContext,
} from "react";
import { VariableSizeList } from "react-window";
import * as Dialog from "@radix-ui/react-dialog";
import Message from "../message/ProjectChatMessage";
import DeletedMessage from "../message/DeletedMessage";
import chatUserImg from "../../assets/img/chat-user.png";
import chatStyles from "../../styles/ProjectChat.module.scss";
import glassStyles from "../../styles/glass.module.scss";

import { getMessageOffset } from "../../lib/getMessageOffset";
import { getMessageHeight } from "../../lib/getMessageHeight";
import { ChatMediaTypeSelectModal, EmptyChatMessagesList } from "../Chat";
import api from "../../services/api";
import {
  ProjectChat_handleSocketEmitUserJoinConversation,
  ProjectChat_handleSocketEmitUserLeaveConversation,
  ProjectChat_handleSendMessage,
  ProjectChat_handleMessageRead,
  ProjectChat_handleAddReactionToMessage,
  ProjectChat_handleDeleteMessagesForMe,
  ProjectChat_handleDeleteMessagesForEveryone,
  ProjectChat_handleSocketOnUserStartTypingFromServer,
  ProjectChat_handleSocketOnUserStoppedTypingFromServer,
  ProjectChat_handleSocketEmitUserStartTyping,
  ProjectChat_handleSocketEmitUserStoppedTyping,
  ProjectChat_handleSocketOnRecieveMessages,
  ProjectChat_handleSocketOnReadMessages,
  ProjectChat_handleSocketOnUserReactedMessage,
  ProjectChat_handleSocketOnDeleteMessages,
} from "../single_chat/AdminProjectChat";
import userContext from "../../context/userContext";
import { ActivityLoader } from "../Loaders/ActivityLoader";
import { UNREAD_MESSAGE_BAR_HEIGHT } from "../message/UnreadMessageBar";
import { uniqBy } from "lodash";
import { FiSend } from "react-icons/fi";
import { IoIosArrowRoundDown, IoIosAttach } from "react-icons/io";
import usePosition from "../../hooks/usePosition";
import { ChatSendingDataPreviewModalContext } from "../../context/ChatSendingDataPreviewModalContext";
import {
  AiOutlineAudio,
  AiOutlineDelete,
  AiOutlinePause,
} from "react-icons/ai";
import {
  AUDIO_RECORDING_TYPE,
  MESSAGE_TYPE,
  CHAT_TYPE,
} from "../../../constants/helpers";
import Waveform from "../audio/Waveform";
import { MessageContextMenuModalContext } from "../../context/MessageContextMenuModalContext";
import ReplyMessage from "../message/ReplyMessage";
import { IoCloseOutline } from "react-icons/io5";
import ForwardModal from "../Chat/ForwardModal";

async function getSingleConversation(userId, type, chatName) {
  const res = await api.get(
    `/project-chat-conversation/get-single-conversation-by-user-id?userId=${userId}&userType=${type}&name=${chatName}`
  );
  return res.data;
}
async function fetchMessages(conversation_id, page, limit, customSkip = 0) {
  const res = await api.get(
    `/project-chat-message/get-messages?conversationId=${conversation_id}&page=${page}&limit=${limit}&customSkip=${customSkip}`
  );
  return res.data?.length === limit
    ? {
        data: res.data,
        nextPage: page + 1,
      }
    : {
        data: res.data,
        nextPage: undefined,
      };
}
async function fetchUnreadMessages(conversationId, userId) {
  const res = await api.get(
    `/project-chat-message/get-unread-messages?conversationId=${conversationId}&userId=${userId}`
  );
  const { unReadMessages, totalUnReadMessages } = res.data;
  return { unReadMessages, unReadMessagesCount: totalUnReadMessages };
}

async function handleSendForwardMessage(message, selectedUsers, socket, user) {
  let messages = [message];
  console.log(selectedUsers, user);
  let updateSelectedMessagesData = messages.map((selectedMessage) =>
    message.messageType === "Text"
      ? {
          sender: user,
          messageType: "Text",
          textContent: selectedMessage.textContent,
          isForwarded: true,
        }
      : selectedMessage.messageType === "File"
      ? {
          sender: user,
          messageType: "File",
          fileContent: selectedMessage.fileContent,
          isForwarded: true,
        }
      : selectedMessage.messageType === "Voice"
      ? {
          sender: user,
          messageType: "Voice",
          voiceContent: selectedMessage.voiceContent,
          isForwarded: true,
        }
      : null
  );
  // print each elements id in selected users
  let ids = [];
  selectedUsers.map((user, i) => {
    ids[i] = user._id;
  });

  // const ids = selectedUsers.filter((user) => user._id);

  console.log(ids);

  const res = await api.post("/project-chat-message/forward-message", {
    conversation_ids: ids,
    messagesData: updateSelectedMessagesData,
  });

  selectedUsers?.forEach((groupId) => {
    const forwardMessages = res.data?.filter(
      (msg) => msg?.conversation === groupId?._id
    );
    socket.emit("project_chat_user_send_message", forwardMessages);
    socket.emit("project_chat_user_update_latest_message", {
      group_id: groupId?._id,
      latestMessage: forwardMessages[forwardMessages.length - 1],
    });
  });

  return;
}

const MainChat = ({ user, open, setOpen, type }) => {
  const { userData, socket } = useContext(userContext);
  const { hanldeCloseMessageContextMenuModal } = useContext(
    MessageContextMenuModalContext
  );
  const { handleUpdateModalPosition } = useContext(
    ChatSendingDataPreviewModalContext
  );

  const variableSizeListRef = useRef();
  const variableSizeListOuterRef = useRef();
  const typingTimeoutRef = useRef(null);
  const pageRef = useRef(1);
  const limitRef = useRef(25);
  const attachmentButtonRef = useRef(null);
  const mediaRecorder = useRef(null);

  const [forwardModal, setforwardModal] = useState(false);

  const [loading, setLoading] = useState({
    isMessageSendLoading: false,
    isMessagesLoadingOnMount: false,
    isMoreMessagesFetching: false,
  });
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputTextMessage, setInputTextMessage] = useState("");
  const [isLastChat, setIsLastChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [forwardMessage, setforwardMessage] = useState([]);

  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [firstUnreadMessage, setFirstUnreadMessage] = useState(null);
  const [initialScrollOffset, setInitialScrollOffset] = useState(0);
  const [oneTimeSkipMessagesCount, setOneTimeSkipMessagesCount] = useState(0);
  const [canFetchNextMessages, setCanFetchNextMessages] = useState(false);
  const [mediaTypeSelectModalVisibility, setMediaTypeSelectModalVisibility] =
    useState(false);
  const { top: attachmentButtonTop, left: attachmentButtonLeft } =
    usePosition(attachmentButtonRef);

  const [users, setUsers] = useState([]);

  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [replyMessage, setReplyMessage] = useState(null);
  const [unReadOnGoingMessages, setUnReadOnGoingMessages] = useState([]);

  useEffect(() => {
    handleUpdateModalPosition({
      top: attachmentButtonTop,
      left: attachmentButtonLeft,
      width: 300,
    });
  }, [attachmentButtonTop, attachmentButtonLeft]);

  async function handleForwardMessage() {
    const res = await api.get(
      `/project-chat-conversation/get-conversation-for-forward?userId=${user?._id}&userType=${type}`
    );
    return res.data;
  }

  const handleCancelForwardModal = useCallback((message) => {
    setforwardModal(false);
    setforwardMessage(message);
  }, []);

  useEffect(() => {
    let canFetchNextMessagesTimeout;
    (async function () {
      setLoading((prev) => ({ ...prev, isMessagesLoadingOnMount: true }));
      if (!user?._id) {
        return;
      }
      try {
        setUnReadOnGoingMessages([]);
        const conversation = await getSingleConversation(
          user?._id,
          type,
          user?.assignmentId
        );
        console.log(conversation);

        const counterPart = await handleForwardMessage();
        setUsers([counterPart]);
        setConversation(conversation);
        if (conversation && userData) {
          let { unReadMessages, unReadMessagesCount: unreadMessagesCount } =
            await fetchUnreadMessages(conversation?._id, userData?._id);
          if (unreadMessagesCount > 0) {
            setFirstUnreadMessage(unReadMessages[unreadMessagesCount - 1]);
            setUnreadMessagesCount(unreadMessagesCount);
            if (unreadMessagesCount < limitRef.current) {
              // then fetch more messages to reach the limit
              const { data: moreMessages } = await fetchMessages(
                conversation?._id,
                pageRef.current,
                limitRef.current - unreadMessagesCount,
                unreadMessagesCount
              );
              let finalMessages = [...unReadMessages, ...moreMessages];
              let offset = getMessageOffset(
                [...finalMessages].reverse(),
                moreMessages.length - 1
              );
              setInitialScrollOffset(offset);
              setMessages(finalMessages);
            } else if (unreadMessagesCount === limitRef.current) {
              setMessages(unReadMessages);
            } else {
              let extraFetchedMessagesCount =
                unreadMessagesCount - limitRef.current;
              let extraFetchedPagesCount = Math.floor(
                extraFetchedMessagesCount / limitRef.current
              );
              pageRef.current = pageRef.current + extraFetchedPagesCount;
              setOneTimeSkipMessagesCount(
                extraFetchedMessagesCount -
                  extraFetchedPagesCount * limitRef.current
              );
            }
          } else {
            const { data } = await fetchMessages(
              conversation?._id,
              pageRef.current,
              limitRef.current
            );
            setInitialScrollOffset(getMessageOffset(data, data.length - 1));
            setMessages(data);
          }
        }
      } catch (err) {
        console.log("An error occured while fetching project chat: ", err);
      } finally {
        setLoading((prev) => ({ ...prev, isMessagesLoadingOnMount: false }));
        canFetchNextMessagesTimeout = setTimeout(
          () => setCanFetchNextMessages(true),
          2000
        );
      }
    })();
    return () => clearTimeout(canFetchNextMessagesTimeout);
  }, [userData]);

  useEffect(() => {
    let socketOffRecieveMessages = () => {};
    let socketOffReadMessages = () => {};
    let socketOffDeleteMessages = () => {};
    if (socket) {
      if (conversation) {
        socketOffRecieveMessages = ProjectChat_handleSocketOnRecieveMessages(
          socket,
          conversation?._id,
          setMessages,
          (newUnreadOnGoingMessages) => {
            setUnReadOnGoingMessages((prev) => [
              ...prev,
              ...newUnreadOnGoingMessages,
            ]);
          }
        );
      }
      socketOffReadMessages = ProjectChat_handleSocketOnReadMessages(
        socket,
        userData?._id,
        setMessages
      );
      socketOffDeleteMessages = ProjectChat_handleSocketOnDeleteMessages(
        socket,
        setMessages
      );
    }
    if (socket && userData && conversation) {
      ProjectChat_handleSocketEmitUserJoinConversation(
        userData,
        socket,
        conversation
      );
    }
    return () => {
      socketOffRecieveMessages();
      socketOffReadMessages();
      socketOffDeleteMessages();
      if (socket && userData && conversation) {
        ProjectChat_handleSocketEmitUserLeaveConversation(
          userData,
          socket,
          conversation
        );
      }
    };
  }, [socket, userData, conversation]);

  useEffect(() => {
    let socketOffUserReactedMessage = () => {};
    if (socket) {
      socketOffUserReactedMessage =
        ProjectChat_handleSocketOnUserReactedMessage(
          socket,
          messages,
          setMessages
        );
    }
    return () => {
      socketOffUserReactedMessage();
    };
  }, [socket, messages]);

  useEffect(() => {
    let socketOffUserStartTypingFromServer = () => {};
    let socketOffUserStoppedTypingFromServer = () => {};
    if (socket) {
      socketOffUserStartTypingFromServer =
        ProjectChat_handleSocketOnUserStartTypingFromServer(
          socket,
          typingUsers,
          setTypingUsers
        );
      socketOffUserStoppedTypingFromServer =
        ProjectChat_handleSocketOnUserStoppedTypingFromServer(
          socket,
          setTypingUsers
        );
    }

    return () => {
      socketOffUserStartTypingFromServer();
      socketOffUserStoppedTypingFromServer();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [typingUsers, socket]);

  useEffect(() => {
    if (userData && socket && conversation) {
      if (isTyping) {
        ProjectChat_handleSocketEmitUserStartTyping(
          userData,
          socket,
          conversation
        );
      } else {
        ProjectChat_handleSocketEmitUserStoppedTyping(
          userData,
          socket,
          conversation
        );
      }
    }
    return () => {
      if (socket && userData) {
        ProjectChat_handleSocketEmitUserStoppedTyping(
          userData,
          socket,
          conversation
        );
      }
    };
  }, [isTyping, conversation, userData]);

  const handleMessageTextChange = useCallback(
    (text) => {
      setInputTextMessage(text);
      setIsTyping(text !== "");

      clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        ProjectChat_handleSocketEmitUserStoppedTyping(
          userData,
          socket,
          conversation
        );
      }, 1000);
    },
    [socket, userData, conversation]
  );

  const handleSendMessageWrapper = useCallback(async () => {
    if (!inputTextMessage) {
      return;
    }
    let text = inputTextMessage;
    setInputTextMessage("");
    setLoading((prev) => ({ ...prev, isMessageSendLoading: true }));
    try {
      await ProjectChat_handleSendMessage(
        replyMessage,
        text,
        setMessages,
        userData,
        conversation,
        socket,
        MESSAGE_TYPE.text
      );
      setReplyMessage(null);
      variableSizeListRef.current?.scrollToItem(messages?.length, "end");
    } catch (err) {
      console.log("An error occured while sending message: ", err);
    } finally {
      setLoading((prev) => ({ ...prev, isMessageSendLoading: false }));
    }
  }, [inputTextMessage, userData, conversation, socket]);

  const handleEnterKeyPress = async (e) => {
    if (e.keyCode === 13) {
      await handleSendMessageWrapper();
    }
  };

  const handleForwardMessageModal = useCallback(async (message) => {
    setforwardModal(true);
    setforwardMessage(message);
    console.log(users);
    // setUsers(conversation?.adminParticipants);
    hanldeCloseMessageContextMenuModal();
  }, []);

  const handleMediaSendMessage = async (content) => {
    try {
      await ProjectChat_handleSendMessage(
        replyMessage,
        content,
        setMessages,
        userData,
        conversation,
        socket,
        MESSAGE_TYPE.file
      );
      setReplyMessage(null);
      variableSizeListRef.current?.scrollToItem(messages?.length, "end");
    } catch (err) {
      console.log("An error occured while sending media message: ", err);
    } finally {
      setLoading((prev) => ({ ...prev, isMessageSendLoading: false }));
    }
  };
  const handleSendVoiceMessage = async () => {
    if (!audioBlob) return;
    setLoading((prev) => ({ ...prev, isMessageSendLoading: true }));
    try {
      let filename = `voice-recording-${Date.now()}.wav`;
      const blobFile = new File([audioBlob], filename, {
        type: AUDIO_RECORDING_TYPE,
      });
      let content = [
        {
          name: filename,
          type: AUDIO_RECORDING_TYPE,
          size: audioBlob.size,
          lastModified: Date.now(),
          file: blobFile,
        },
      ];
      await ProjectChat_handleSendMessage(
        replyMessage,
        content,
        setMessages,
        userData,
        conversation,
        socket,
        MESSAGE_TYPE.voice
      );
      handleDiscardRecording();
      setReplyMessage(null);
      variableSizeListRef.current?.scrollToItem(messages?.length, "end");
    } catch (err) {
      console.log("An error occured while sending voice message: ", err);
    } finally {
      setLoading((prev) => ({ ...prev, isMessageSendLoading: false }));
    }
  };

  const handleCopyMessage = useCallback(async (textContent) => {
    if (!textContent) {
      return new Error("Text content is empty");
    }
    await navigator.clipboard.writeText(textContent);
    hanldeCloseMessageContextMenuModal();
  }, []);

  const handleReplyMessage = useCallback((message) => {
    setReplyMessage(message);
    hanldeCloseMessageContextMenuModal();
  }, []);

  const handleListOnScroll = async ({ scrollDirection, scrollOffset }) => {
    if (scrollDirection === "backward" && scrollOffset < 500) {
      if (
        loading.isMoreMessagesFetching ||
        isLastChat ||
        !canFetchNextMessages
      ) {
        return;
      }
      // fetch more messages
      setLoading((prev) => ({ ...prev, isMoreMessagesFetching: true }));
      try {
        pageRef.current += 1;
        const { data: newMessages } = await fetchMessages(
          conversation?._id,
          pageRef.current,
          limitRef.current - oneTimeSkipMessagesCount,
          oneTimeSkipMessagesCount
        );
        if (newMessages?.length === 0) {
          setIsLastChat(true);
          return;
        }
        setMessages((prev) => uniqBy([...prev, ...newMessages], "_id"));
        setOneTimeSkipMessagesCount(0);
      } catch (error) {
        console.log(
          "An error occured while fetching more messages on scroll to top: ",
          error
        );
      } finally {
        setLoading((prev) => ({ ...prev, isMoreMessagesFetching: false }));
      }
      console.log("fetch more messages");
    }
  };

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: AUDIO_RECORDING_TYPE });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.current.start();
      setIsRecording(true);
      console.log("recording started");
    } catch (error) {
      console.error(error);
    }
  }
  async function stopRecording() {
    try {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.log("An error occured while stopping recording: ", error);
    }
  }
  function handleDiscardRecording() {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsRecording(false);
  }

  const handleScrollToBottom = useCallback(() => {
    variableSizeListRef.current?.scrollToItem(messages.length - 1);
  }, [messages]);

  const handleRemoveReadMessageFromUnreadOnGoingMessages = useCallback(
    ({ message, message_read_userData }) => {
      if (message_read_userData?.readBy === userData?._id) {
        setUnReadOnGoingMessages((prev) =>
          prev.filter(
            (unReadOnGoingMsg) => unReadOnGoingMsg?._id !== message?.message_id
          )
        );
      }
    },
    [userData]
  );

  const itemSize = (index) => {
    let message = [...messages].reverse()[index];
    let isMessageDeletedForMe = message?.deletedFor?.includes(userData?._id)
      ? true
      : false;
    let isMessageDeletedForEveryone = message?.isDeletedForEveryone;
    let additionalHeight =
      message?._id === firstUnreadMessage?._id ? UNREAD_MESSAGE_BAR_HEIGHT : 0;
    return isMessageDeletedForEveryone || isMessageDeletedForMe
      ? 50 + additionalHeight
      : getMessageHeight(message, 26) + additionalHeight;
  };

  const Row = ({ index: i, style, data: arr }) => {
    let message = arr[i];
    let isMessageDeletedForMe = message?.deletedFor?.includes(userData?._id)
      ? true
      : false;
    let isMessageDeletedForEveryone = message?.isDeletedForEveryone;
    if (isMessageDeletedForEveryone || isMessageDeletedForMe) {
      return (
        <DeletedMessage
          message={message}
          ref={variableSizeListOuterRef}
          unreadMessagesCount={unreadMessagesCount}
          handleMessageRead={ProjectChat_handleMessageRead}
          handleMessageReadFinalCallback={
            handleRemoveReadMessageFromUnreadOnGoingMessages
          }
          unreadMessage={firstUnreadMessage}
          previousMessageSender={i === 0 ? "" : arr[i - 1]?.sender}
          userId={userData?._id}
          style={{
            ...style,
            padding: "0 0.5rem",
          }}
        />
      );
    }
    return (
      <Message
        key={i}
        message={message}
        unreadMessagesCount={unreadMessagesCount}
        unreadMessage={firstUnreadMessage}
        previousMessageSender={i === 0 ? "" : arr[i - 1]?.sender}
        handleForwardMessage={handleForwardMessageModal}
        handleReplyMessage={handleReplyMessage}
        handleCopyMessage={handleCopyMessage}
        handleMessageRead={ProjectChat_handleMessageRead}
        handleMessageReadFinalCallback={
          handleRemoveReadMessageFromUnreadOnGoingMessages
        }
        handleAddReactionToMessage={ProjectChat_handleAddReactionToMessage}
        handleDeleteMessagesForMe={ProjectChat_handleDeleteMessagesForMe}
        handleDeleteMessagesForEveryone={
          ProjectChat_handleDeleteMessagesForEveryone
        }
        style={{ ...style, padding: "0 0.5rem" }}
        ref={variableSizeListOuterRef}
        messageMiddleWrapperMaxWidth={264}
        disableRightClick={false}
        userDataId={userData?._id}
        disableMessageSeenClick={true}
        width={232} // Audio Message width (./Waveform.js)
      />
    );
  };
  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content
            className="DialogContent"
            style={{ maxWidth: "1280px", padding: 0, height: "100%" }}
          >
            <div className={chatStyles.chatDetailContainer}>
              <div className={chatStyles.header}>
                <div className={chatStyles.avatar}>
                  <img src={chatUserImg} alt="userData image" />
                </div>
                <div className={chatStyles.metaInfoWrapper} style={{ flex: 1 }}>
                  <h5>
                    {conversation?.chatName} - (
                    {conversation?.userType?.toUpperCase()})
                  </h5>
                  {typingUsers?.length > 0 && <p>Typing...</p>}
                </div>
                <button
                  className="btnNeutral btn--small"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className={chatStyles.chatMessagesContainer}>
                {messages.length !== 0 ? (
                  // <AutoSizer>
                  //   {({ height, width }) => {
                  //     return (
                  <div
                    className={chatStyles.chatMessagesList}
                    style={{ padding: "0" }}
                  >
                    <VariableSizeList
                      // className={chatStyles.chatMessagesList}
                      outerRef={variableSizeListOuterRef}
                      ref={variableSizeListRef}
                      // height={height}
                      // width={width}
                      height={800}
                      width={700}
                      itemCount={messages.length}
                      overscanCount={10}
                      initialScrollOffset={Math.max(
                        0,
                        initialScrollOffset - 498
                      )}
                      itemSize={itemSize}
                      itemData={[...messages].reverse()}
                      style={{ maxWidth: "960px", margin: "0 auto" }}
                      itemKey={(index, data) => data[index]?._id}
                      onScroll={handleListOnScroll}
                    >
                      {Row}
                    </VariableSizeList>
                  </div>
                ) : (
                  //     );
                  //   }}
                  // </AutoSizer>
                  <EmptyChatMessagesList
                    message={"Start your conversation with Admin"}
                  />
                )}
              </div>
              {replyMessage && (
                <div className={chatStyles.sendReplyMessage}>
                  <ReplyMessage replyMessage={replyMessage} />
                  <button onClick={() => setReplyMessage(null)}>
                    <IoCloseOutline size={24} />
                  </button>
                </div>
              )}
              <div className={chatStyles.chatInputContainer}>
                {isRecording || audioUrl ? (
                  <div className={chatStyles.recordedAudioContainer}>
                    <button
                      className={chatStyles.micBtn}
                      onClick={handleDiscardRecording}
                      disabled={loading.isMessageSendLoading || isRecording}
                      style={{ width: 44 }}
                    >
                      <AiOutlineDelete style={{ fill: "var(--danger-400)" }} />
                    </button>
                    {audioUrl ? (
                      <Waveform
                        url={audioUrl}
                        isOwnMessage={true}
                        height={40}
                        width={200}
                        showPlaybackRate={false}
                        waveColor="#ccc"
                        micButtonSize={40}
                      />
                    ) : (
                      <div className={chatStyles.recordingIndicatorContainer}>
                        <span className={chatStyles.indicator}></span>
                        <div className={chatStyles.dotsContainer}>
                          {Array.from(new Array(20)).map((_, i) => (
                            <span key={i} className={chatStyles.dot}></span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <ChatMediaTypeSelectModal
                      visibility={mediaTypeSelectModalVisibility}
                      handleClose={() =>
                        setMediaTypeSelectModalVisibility(false)
                      }
                      handleSendMessage={handleMediaSendMessage}
                    />
                    <button
                      ref={attachmentButtonRef}
                      onClick={() =>
                        setMediaTypeSelectModalVisibility((prev) => !prev)
                      }
                    >
                      <IoIosAttach fill="var(--gray-700)" />
                    </button>
                    <div className={chatStyles.chatInput}>
                      <input
                        type="text"
                        placeholder="Type a message"
                        value={inputTextMessage}
                        onChange={(e) =>
                          handleMessageTextChange(e.target.value)
                        }
                        onKeyDown={handleEnterKeyPress}
                      />
                    </div>
                  </>
                )}

                {inputTextMessage ? (
                  <button>
                    {loading.isMessageSendLoading ? (
                      <ActivityLoader size={64} />
                    ) : (
                      <FiSend onClick={handleSendMessageWrapper} />
                    )}
                  </button>
                ) : (
                  <>
                    {isRecording && !audioUrl ? (
                      <button
                        className={chatStyles.micBtn}
                        onClick={stopRecording}
                      >
                        <AiOutlinePause />
                      </button>
                    ) : !isRecording && !audioUrl ? (
                      <button
                        className={chatStyles.micBtn}
                        onClick={startRecording}
                      >
                        <AiOutlineAudio />
                      </button>
                    ) : (
                      <button>
                        {loading.isMessageSendLoading ? (
                          <ActivityLoader size={64} />
                        ) : (
                          <FiSend onClick={handleSendVoiceMessage} />
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>

              {forwardModal && (
                <ForwardModal
                  message={forwardMessage}
                  users={users}
                  onCancel={handleCancelForwardModal}
                  conversation={conversation}
                  chatType={"ProjectChat"}
                  handleSendForwardMessage={handleSendForwardMessage}
                  socket={socket}
                  user={user?._id}
                />
              )}

              {unReadOnGoingMessages.length > 0 && (
                <button
                  className={chatStyles.bottomUnReadMessagesIndicator}
                  onClick={handleScrollToBottom}
                >
                  <IoIosArrowRoundDown size={32} color="var(--gray-800)" />
                  <b>{unReadOnGoingMessages.length}</b>
                </button>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default MainChat;
