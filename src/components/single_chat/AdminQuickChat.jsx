import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useContext,
} from "react";
import PropTypes from "prop-types";
import { Outlet, useNavigate } from "react-router-dom";
import { uniqBy } from "lodash";

import QuickChatMessage from "../message/QuickChatMessage";
import api from "../../services/api";
import {
  ChatNavigationList,
  ChatSearch,
  EmptyChatList,
  UserChatListCard,
} from "../Chat";
import chatStyles from "../../styles/chat.module.scss";
import { ActivityLoader } from "../Loaders/ActivityLoader";
import userContext from "../../context/userContext";
import { toast } from "react-hot-toast";
import { playMessageSendSound } from "../../lib/playMessageSendSound";
import { CHAT_TYPE, MESSAGE_TYPE } from "../../../constants/helpers";

// DON'T CHANGE THIS VALUE
const TABS = ["Student", "Tutor"];

async function getAllConversations(
  page = 1,
  limit = 15,
  userType = "Super-Admin"
) {
  if (userType === "Super-Admin" || userType === "Admin") {
    const res = await api.get(
      `/quick-chat-conversation/get-all-conversations?page=${page}&limit=${limit}`
    );
    return res.data;
  } else if (userType === "Sub-Admin") {
    const res = await api.get(
      `/quick-chat-conversation/get-all-student-conversations?page=${page}&limit=${limit}`
    );
    return res.data;
  } else if (userType === "Co-Admin") {
    const res = await api.get(
      `/quick-chat-conversation//get-all-tutor-conversations?page=${page}&limit=${limit}`
    );
    return res.data;
  }
}
async function getConversationsByPhoneNumber(
  phoneNumber,
  userType = "Super-Admin"
) {
  if (userType === "Super-Admin" || userType === "Admin") {
    const res = await api.get(
      `/quick-chat-conversation/get-conversations-by-phone-number?phoneNumber=${phoneNumber}`
    );
    return res.data;
  } else if (userType === "Sub-Admin") {
    const res = await api.get(
      `/quick-chat-conversation/get-conversations-by-phone-number?phoneNumber=${phoneNumber}&userType=Student`
    );
    return res.data;
  } else if (userType === "Co-Admin") {
    const res = await api.get(
      `/quick-chat-conversation/get-conversations-by-phone-number?phoneNumber=${phoneNumber}&userType=Tutor`
    );
    return res.data;
  }
}

async function getSingleConversation(conversationId) {
  const res = await api.get(
    `/quick-chat-conversation/get-single-conversation?conversationId=${conversationId}`
  );
  return res.data;
}
async function fetchMessages(conversation_id, page, limit, customSkip = 0) {
  const res = await api.get(
    `/quick-chat-message/get-messages?conversationId=${conversation_id}&page=${page}&limit=${limit}&customSkip=${customSkip}`
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
    `/quick-chat-message/get-unread-messages?conversationId=${conversationId}&userId=${userId}`
  );
  const { unReadMessages, totalUnReadMessages } = res.data;
  return { unReadMessages, unReadMessagesCount: totalUnReadMessages };
}
/**
 *
 * @param {Object} user - User info object
 * @param {any} socket - Socket
 * @param {Object} conversation - Conversation info object
 */
function handleSocketEmitUserJoinConversation(user, socket, conversation) {
  if (user && socket && conversation) {
    socket.emit("intitialize_quick_chat_user");
    socket.emit("quick_chat_user_join_conversation", {
      conversation_id: conversation?._id,
      user,
    });
  }
}
/**
 *
 * @param {Object} user - User info object
 * @param {any} socket - Socket
 * @param {Object} conversation - Conversation info object
 */
function handleSocketEmitUserLeaveConversation(user, socket, conversation) {
  if (user && socket && conversation) {
    socket.emit("quick_chat_user_leave_conversation", {
      conversation_id: conversation?._id,
      user: { _id: user?._id, name: user?.name },
    });
  }
}
/**
 *
 * @param {Object} user - User info object
 * @param {any} socket - Socket
 * @param {Object} conversation - Conversation info object
 */
function handleSocketEmitUserStartTyping(user, socket, conversation) {
  if (user && socket && conversation) {
    socket.emit("quick_chat_user_user_start_typing", {
      conversation_id: conversation?._id,
      user: { _id: user?._id, name: user?.name },
    });
  }
}
/**
 *
 * @param {Object} user - User info object
 * @param {any} socket - Socket
 * @param {Object} conversation - Conversation info object
 */
function handleSocketEmitUserStoppedTyping(user, socket, conversation) {
  if (user && socket && conversation) {
    socket.emit("quick_chat_user_user_stopped_typing", {
      conversation_id: conversation?._id,
      user: { _id: user?._id, name: user?.name },
    });
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Array} typingUsers - Array of typing users
 * @param {Function} setTypingUsers - Funciton to update typing users state
 */
function handleSocketOnUserStartTypingFromServer(
  socket,
  typingUsers,
  setTypingUsers
) {
  if (socket) {
    socket.on(
      "quick_chat_user_user_start_typing_from_server",
      ({ conversation_id, user: typingUser }) => {
        // INFO: In user you only got user: name and _id from the server
        let isAlreadyAddedTypingUser = typingUsers
          ?.map((tUser) => tUser?._id)
          .includes(typingUser?._id);
        if (!isAlreadyAddedTypingUser) {
          setTypingUsers((prev) => [
            ...prev,
            { ...typingUser, messageType: "typing" },
          ]);
        }
      }
    );
    return () => socket.off("quick_chat_user_user_start_typing_from_server");
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setTypingUsers - Funciton to update typing users state
 */
function handleSocketOnUserStoppedTypingFromServer(socket, setTypingUsers) {
  if (socket) {
    socket.on(
      "quick_chat_user_user_stopped_typing_from_server",
      ({ conversation_id, user: typingUser }) => {
        setTypingUsers((prev) =>
          prev.filter((tUser) => tUser?._id !== typingUser?._id)
        );
      }
    );
    return () => socket.off("quick_chat_user_user_stopped_typing_from_server");
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {string} conversationId - conversationId
 *  @param {Function} setMessages - Funciton to update messages state
 *  @param {Function} finalCallback - Funciton to update messages state
 */
function handleSocketOnRecieveMessages(
  socket,
  conversationId,
  setMessages,
  finalCallback
) {
  if (socket) {
    socket.on("quick_chat_user_recieve_message", async (messages) => {
      if (messages[0]?.conversation === conversationId) {
        setMessages((prev) => [...messages, ...prev]);
        finalCallback(messages);
      }
    });
    return () => socket.off("quick_chat_user_recieve_message");
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {string} userId - user id
 *  @param {Function} setMessages - Funciton to update messages state
 */
function handleSocketOnReadMessages(socket, userId, setMessages) {
  if (socket && userId) {
    socket.on(
      "quick_chat_user_reads_the_message",
      ({ message, message_read_user }) => {
        // In "message" you only got: conversation_id, message_id and message_sender_id
        // if (message?.message_sender_id === userId) {
        setMessages((prev) =>
          prev.map((msg) => {
            return msg._id === message?.message_id
              ? { ...msg, readBy: [...msg?.readBy, message_read_user] }
              : msg;
          })
        );
        // }
      }
    );
    return () => socket.off("quick_chat_user_reads_the_message");
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Array} messages - Array of all messages
 *  @param {Function} setMessages - Funciton to update messages state
 */
function handleSocketOnUserReactedMessage(socket, messages, setMessages) {
  if (socket && messages) {
    socket.on("quick_chat_user_message_reaction_updated", (data) => {
      const { message_id, reactionData } = data;
      const { reactionUser } = reactionData;
      const reactionMessage = messages.find((msg) => msg._id === message_id);
      if (reactionMessage) {
        // check if user already reacted to message
        const isAlreadyReactedToMessage = reactionMessage?.reactions?.find(
          (item) => item?.reactionUser === reactionUser
        );
        if (isAlreadyReactedToMessage) {
          let newReactions = reactionMessage?.reactions?.map((item) =>
            item?.reactionUser === reactionUser ? reactionData : item
          );
          let mapped = messages.map((msg) => {
            return msg._id === message_id
              ? { ...msg, reactions: newReactions }
              : msg;
          });
          setMessages(mapped);
        } else {
          // user reacted first time on the message
          let mapped = messages.map((msg) => {
            return msg._id === message_id
              ? { ...msg, reactions: [...msg?.reactions, reactionData] }
              : msg;
          });
          setMessages(mapped);
        }
      }
    });

    return () => socket.off("quick_chat_user_message_reaction_updated");
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setMessages - a setMessages function to update messsages
 */
function handleSocketOnDeleteMessages(socket, setMessages) {
  socket.on("quick_chat_user_delete_these_messgaes", (data) => {
    let { deleteType, deleteMessageIds } = data;
    if (deleteType === "for-me") {
      let deleteForUserId = data?.deleteFor;
      setMessages((prev) =>
        prev?.map((msg) => {
          return deleteMessageIds?.includes(msg?._id)
            ? {
                ...msg,
                deletedFor: [...msg?.deletedFor, deleteForUserId],
              }
            : msg;
        })
      );
    } else if (deleteType === "for-everyone") {
      setMessages((prev) =>
        prev.map((msg) => {
          return deleteMessageIds?.includes(msg?._id)
            ? {
                ...msg,
                isDeletedForEveryone: true,
              }
            : msg;
        })
      );
    }
  });
  return () => socket.off("quick_chat_user_delete_these_messgaes");
}
/**
 *
 * @param {Object} replyMessage - reply message
 * @param {any} content - Content Text or File
 * @param {Function} setMessages - Function to update messages
 * @param {Object} user - User info object
 * @param {Object} conversation - Conversation info object
 * @param {any} socket - Socket
 * @param {string} messageType - type of message
 * @returns
 */
async function handleSendMessage(
  replyMessage = null,
  content,
  setMessages,
  user,
  conversation,
  socket,
  messageType
) {
  if (!content || !user || !conversation || !socket) {
    return;
  }
  let formData;
  try {
    if (messageType === MESSAGE_TYPE.text) {
      formData = {
        messageType: "Text",
        senderId: user?._id,
        conversationId: conversation?._id,
        content: {
          textContent: content,
        },
      };
    } else if (
      messageType === MESSAGE_TYPE.file ||
      messageType === MESSAGE_TYPE.voice
    ) {
      let attachmentFiles = content;
      if (attachmentFiles.length) {
        const data = {
          messageType: messageType,
          senderId: user._id,
          conversationId: conversation._id,
          fileText: JSON.stringify(
            attachmentFiles.map((item) => {
              return {
                textContent:
                  messageType === MESSAGE_TYPE.voice ? "" : item.caption,
              };
            })
          ),
          files: attachmentFiles.map((item) => {
            return {
              file: item.file,
            };
          }),
        };

        formData = new FormData();
        for (const i in data) {
          if (i === "files") {
            data[i].forEach((item) => {
              formData.append(i, item.file);
            });
          } else {
            formData.append(i, data[i]);
          }
        }
      }
    }

    let url = replyMessage
      ? `/quick-chat-message/reply-message?replyMessageId=${replyMessage._id}`
      : "/quick-chat-message/send-message";
    const { data: newMessages } = await api.post(url, formData, {
      headers: {
        "Content-Type":
          messageType === MESSAGE_TYPE.text
            ? "application/json"
            : "multipart/form-data",
      },
    });
    setMessages((prev) => [...newMessages, ...prev]);
    socket.emit("quick_chat_user_send_message", newMessages);
    socket.emit("quick_chat_user_update_latest_message", {
      conversation_id: conversation?._id,
      latestMessage: newMessages[newMessages?.length - 1],
    });
    await playMessageSendSound();
    return newMessages;

    //   setAttachmentFiles([]);
    //   await handleSendNotificationToAllGroupMembers(newMessages);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
/**
 *
 * @param {string} readUserId - User info object
 * @param {*} socket - Socket
 * @param {string} senderId - message sender id
 * @param {Array} readUserIds - readUserIds array (message.readBy)
 * @param {string} conversationId - conversation id
 * @param {string} messageId - message id
 * @param {Function} finalCallback - finalCallback
 * @returns
 */
async function handleMessageRead(
  readUserId,
  socket,
  senderId,
  readUserIds,
  conversationId,
  messageId,
  finalCallback
) {
  if (
    socket &&
    readUserId &&
    senderId &&
    readUserIds &&
    conversationId &&
    messageId
  ) {
    if (readUserId === senderId) {
      return;
    } else if (!readUserIds.includes(readUserId)) {
      try {
        // In "message" only send group_id, message_id and message_sender_id
        let sm_message = {
          conversation_id: conversationId,
          message_id: messageId,
          message_sender_id: senderId,
        };
        const res = await api.post("/quick-chat-message/read-message", {
          messageId: messageId,
          readUserId: readUserId,
        });
        if (res.data) {
          finalCallback({
            message: sm_message,
            message_read_user: res.data,
          });
          socket.emit("quick_chat_user_read_message", {
            message: sm_message,
            message_read_user: res.data,
          });
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}
/**
 *
 * @param {string} reaction - Reaction emoji string
 * @param {any} socket - Socket
 * @param {string} messageId - Message id on which user reacting
 * @param {string} userId - User id of the user who reacting
 * @param {string} conversationId - Conversation id
 */
async function handleAddReactionToMessage(
  reaction,
  socket,
  messageId,
  userId,
  conversationId
) {
  if (reaction && socket && messageId && userId && conversationId) {
    try {
      const res = await api.post("/quick-chat-message/react-message", {
        messageId: messageId,
        reactionUserId: userId,
        reaction,
      });
      socket.emit("quick_chat_user_reaction_added_to_message", {
        conversation_id: conversationId,
        message_id: messageId,
        reactionData: res.data,
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {string} conversationId - conversation id
 * @param {string} userId - user id
 * @param {Array} selectedMessages - messages array you want to delete
 * @param {Function} finalCallback - a callback you want to run in finally block
 */
async function handleDeleteMessagesForMe(
  socket,
  conversationId,
  userId,
  selectedMessages,
  finalCallback = () => {}
) {
  if (socket && conversationId && userId && selectedMessages) {
    let data = {
      conversation_id: conversationId,
      deleteType: "for-me",
      deleteFor: userId,
      deleteMessageIds: selectedMessages.map((msg) => msg?._id),
    };
    try {
      const res = await api.patch(
        "/quick-chat-message/delete-messages-for-me",
        {
          messageIds: data.deleteMessageIds,
          deletedForUserId: data.deleteFor,
        }
      );
      if (res.data?.acknowledged) {
        socket.emit("quick_chat_user_delete_messages", data);
        socket.emit("quick_chat_user_update_latest_message", {
          conversation_id: conversationId,
          latestMessage: {
            ...selectedMessages[selectedMessages?.length - 1],
            deletedFor: [
              ...selectedMessages[selectedMessages?.length - 1]?.deletedFor,
              userId,
            ],
          },
        });
      }
    } catch (err) {
      toast.error("An error occurred while deleting messages, Try again");
      console.log("An error occurred while deleting messages for me", err);
    } finally {
      finalCallback();
    }
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {string} conversationId - conversation id
 * @param {string} userId - user id
 * @param {Array} selectedMessages - messages array you want to delete
 * @param {Function} finalCallback - a callback you want to run in finally block
 */
async function handleDeleteMessagesForEveryone(
  socket,
  conversationId,
  userId,
  selectedMessages,
  finalCallback = () => {}
) {
  if (socket && conversationId && userId && selectedMessages) {
    let data = {
      conversation_id: conversationId,
      deleteType: "for-everyone",
      deleteFor: userId,
      deleteMessageIds: selectedMessages.map((msg) => msg?._id),
    };
    try {
      const res = await api.patch(
        "/quick-chat-message/delete-messages-for-everyone",
        {
          messageIds: data.deleteMessageIds,
        }
      );
      if (res.data?.acknowledged) {
        socket.emit("quick_chat_user_delete_messages", data);
        socket.emit("quick_chat_user_update_latest_message", {
          conversation_id: conversationId,
          latestMessage: {
            ...selectedMessages[selectedMessages?.length - 1],
            isDeletedForEveryone: true,
          },
        });
      }
    } catch (err) {
      toast.error("An error occurred while deleting messages, Try again");
      console.log("An error occurred while deleting messages for me", err);
    } finally {
      finalCallback();
    }
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Object} notificationData - Notification data
 */
function handleSendNotificationToGroupParticipants(socket, notificationData) {
  if (notificationData && socket) {
    socket.emit("send_chat_message_notification", notificationData);
  }
}
// Exporting this function to reuse in Home QuickChat
export {
  handleSocketEmitUserJoinConversation as QuickChat_handleSocketEmitUserJoinConversation,
  handleSocketEmitUserLeaveConversation as QuickChat_handleSocketEmitUserLeaveConversation,
  handleSocketOnUserStartTypingFromServer as QuickChat_handleSocketOnUserStartTypingFromServer,
  handleSocketOnUserStoppedTypingFromServer as QuickChat_handleSocketOnUserStoppedTypingFromServer,
  handleSocketEmitUserStartTyping as QuickChat_handleSocketEmitUserStartTyping,
  handleSocketEmitUserStoppedTyping as QuickChat_handleSocketEmitUserStoppedTyping,
  handleSocketOnRecieveMessages as QuickChat_handleSocketOnRecieveMessages,
  handleSocketOnReadMessages as QuickChat_handleSocketOnReadMessages,
  handleSocketOnUserReactedMessage as QuickChat_handleSocketOnUserReactedMessage,
  handleSocketOnDeleteMessages as QuickChat_handleSocketOnDeleteMessages,
  handleSendMessage as QuickChat_handleSendMessage,
  handleMessageRead as QuickChat_handleMessageRead,
  handleAddReactionToMessage as QuickChat_handleAddReactionToMessage,
  handleDeleteMessagesForMe as QuickChat_handleDeleteMessagesForMe,
  handleDeleteMessagesForEveryone as QuickChat_handleDeleteMessagesForEveryone,
  handleSendNotificationToGroupParticipants as QuickChat_handleSendNotificationToGroupParticipants,
};

const AdminQuickChat = () => {
  const navigate = useNavigate();
  const { userData: user, socket } = useContext(userContext);

  const pageRef = useRef(1);
  const limitRef = useRef(15);
  const mouseOverTimeoutRef = useRef();
  const searchTimeoutRef = useRef();

  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [studentConversations, setStudentConversations] = useState([]);
  const [tutorConversations, setTutorConversations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedConversations, setSearchedConversations] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isNextDataFetching, setIsNextDataFetching] = useState(false);
  const [isLastConversation, setIsLastConversation] = useState(false);
  const [loading, setLoading] = useState({
    isMainDataLoading: false,
    isSearchedDataLoading: false,
  });

  useEffect(() => {
    (async function () {
      if (!user) {
        return;
      }
      setLoading((prev) => ({ ...prev, isMainDataLoading: true }));
      try {
        let conversations = await getAllConversations(
          pageRef.current,
          limitRef.current,
          user?.userType
        );
        setAllConversations(conversations);
        if (user?.userType === "Admin" || user?.userType === "Super-Admin") {
          setStudentConversations(
            conversations.filter(
              (item) => item?.quickChatUser?.userType === "Student"
            )
          );
          setTutorConversations(
            conversations.filter(
              (item) => item?.quickChatUser?.userType === "Tutor"
            )
          );
        }
      } catch (err) {
        console.log(
          "Error occured while fetching admin-admin conversations: ",
          err
        );
      } finally {
        setLoading((prev) => ({ ...prev, isMainDataLoading: false }));
      }
    })();

    return () => {
      clearTimeout(mouseOverTimeoutRef.current);
      clearTimeout(searchTimeoutRef.current);
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("quick_chat_user_recieve_latest_message", async (data) => {
        const { conversation_id, latestMessage } = data;
        const latestConversation = allConversations.find(
          (item) => item?._id === conversation_id
        );
        if (!latestConversation) {
          let fetchedLatestConversation = await getAllConversations(1, 1);
          let uniqueConversations = uniqBy(
            [...fetchedLatestConversation, ...allConversations],
            "_id"
          );
          setAllConversations(uniqueConversations);
          if (user?.userType === "Admin" || user?.userType === "Super-Admin") {
            setStudentConversations(
              uniqueConversations.filter(
                (item) => item?.quickChatUser?.userType === "Student"
              )
            );
            setTutorConversations(
              uniqueConversations.filter(
                (item) => item?.quickChatUser?.userType === "Tutor"
              )
            );
          }
        } else {
          let updatedConversation = { ...latestConversation, latestMessage };
          let filterData = allConversations.filter(
            (item) => item?._id !== conversation_id
          );
          let uniqueConversations = uniqBy(
            [updatedConversation, ...filterData],
            "_id"
          );
          setAllConversations(uniqueConversations);
          if (user?.userType === "Admin" || user?.userType === "Super-Admin") {
            setStudentConversations(
              uniqueConversations.filter(
                (item) => item?.quickChatUser?.userType === "Student"
              )
            );
            setTutorConversations(
              uniqueConversations.filter(
                (item) => item?.quickChatUser?.userType === "Tutor"
              )
            );
          }
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("quick_chat_user_recieve_latest_message");
      }
    };
  }, [socket, allConversations]);

  const handleSearchTextChange = useCallback(
    (text) => {
      if (!user) return;
      setLoading((prev) => ({ ...prev, isSearchedDataLoading: true }));
      setSearchText(text);
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(async () => {
        if (text) {
          try {
            const searchedData = await getConversationsByPhoneNumber(
              text,
              user?.userType
            );
            setSearchedConversations(searchedData);
          } catch (err) {
            console.log(
              "An error occured while searching conversations: ",
              err
            );
          } finally {
            setLoading((prev) => ({ ...prev, isSearchedDataLoading: false }));
          }
        }
      }, 1000);
    },
    [getConversationsByPhoneNumber, user]
  );

  const handleOnEndReached = useCallback(async () => {
    if (isNextDataFetching || isLastConversation || !user) {
      return;
    }
    try {
      setIsNextDataFetching(true);
      pageRef.current += 1;
      const newConversations = await getAllConversations(
        pageRef.current,
        limitRef.current,
        user?.userType
      );
      if (newConversations.length === 0) {
        setIsLastConversation(true);
        return;
      }
      let uniqueConversations = uniqBy(
        [...allConversations, ...newConversations],
        "_id"
      );
      setAllConversations(uniqueConversations);
      if (user?.userType === "Admin" || user?.userType === "Super-Admin") {
        setStudentConversations(
          uniqueConversations.filter(
            (item) => item?.quickChatUser?.userType === "Student"
          )
        );
        setTutorConversations(
          uniqueConversations.filter(
            (item) => item?.quickChatUser?.userType === "Tutor"
          )
        );
      }
    } catch (err) {
      console.log("Error occured while fetching new conversations: ", err);
    } finally {
      setIsNextDataFetching(false);
    }
  }, [
    pageRef,
    limitRef,
    user,
    isNextDataFetching,
    isLastConversation,
    allConversations,
  ]);

  const handleNavigate = useCallback((conversation) => {
    setSelectedConversation(conversation);
    navigate(`${conversation._id}`);
  }, []);

  const renderItem = ({ item: conversation, index, data }) => {
    return (
      <UserChatListCard
        listUser={conversation?.quickChatUser}
        latestMessage={conversation.latestMessage}
        onClick={() => handleNavigate(conversation)}
        activeUser={selectedConversation?.quickChatUser}
      />
    );
  };

  function keyExtractor({ item, index }) {
    return item._id;
  }

  return (
    <div className={chatStyles.chatContainer}>
      <div className={chatStyles.chatSidebar}>
        <div className={chatStyles.header}>
          <h5>Quick Chats</h5>
        </div>
        <ChatSearch
          onTextChange={handleSearchTextChange}
          placeholder="Search a chat with phone number"
        />
        {(user?.userType === "Admin" || user?.userType === "Super-Admin") && (
          <div className={chatStyles.tabsContainer}>
            {TABS.map((tab, index) => (
              <button
                key={index}
                className={chatStyles.tab}
                data-active={selectedTab === tab}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
        {searchText !== "" ? (
          loading.isSearchedDataLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5rem",
              }}
            >
              <ActivityLoader />
            </div>
          ) : (
            <ChatNavigationList
              data={
                user?.userType === "Admin" || user?.userType === "Super-Admin"
                  ? searchedConversations.filter(
                      (item) => item?.quickChatUser?.userType === selectedTab
                    )
                  : searchedConversations
              }
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              // onEndReached={handleOnEndReached}
              ListEmptyComponent={() => (
                <EmptyChatList
                  message={`Conversation not found of name: '${searchText} for ${selectedTab}'`}
                />
              )}
            />
          )
        ) : (
          <ChatNavigationList
            data={
              user?.userType === "Admin" || user?.userType === "Super-Admin"
                ? selectedTab === "Student"
                  ? studentConversations
                  : tutorConversations
                : allConversations
            }
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={handleOnEndReached}
            ListEmptyComponent={() => <EmptyChatList />}
            ListFooterComponent={() => {
              if (isNextDataFetching) {
                return (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <ActivityLoader />
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "1rem 0",
                    }}
                  >
                    <p style={{ fontSize: "0.75rem" }}>End of chats</p>
                  </div>
                );
              }
            }}
          />
        )}
      </div>
      <Outlet
        context={{
          chatType: CHAT_TYPE.quickChat,
          selectedConversation,
          setSelectedConversation,
          Message: QuickChatMessage,
          fetchMessages,
          fetchUnreadMessages,
          getSingleConversation,
          handleSendMessage,
          handleMessageRead,
          handleAddReactionToMessage,
          handleDeleteMessagesForMe,
          handleDeleteMessagesForEveryone,
          handleSocketEmitUserJoinConversation,
          handleSocketEmitUserLeaveConversation,
          handleSocketEmitUserStartTyping,
          handleSocketEmitUserStoppedTyping,
          handleSocketOnUserStartTypingFromServer,
          handleSocketOnUserStoppedTypingFromServer,
          handleSocketOnRecieveMessages,
          handleSocketOnReadMessages,
          handleSocketOnUserReactedMessage,
          handleSocketOnDeleteMessages,
          handleSendNotificationToGroupParticipants,
        }}
      />
    </div>
  );
};

AdminQuickChat.propTypes = {
  user: PropTypes.object,
};

export default AdminQuickChat;
