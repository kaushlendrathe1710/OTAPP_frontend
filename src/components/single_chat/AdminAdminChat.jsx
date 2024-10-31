import React, { useEffect, useRef, useCallback, useState, useMemo, useContext } from "react";
import PropTypes from "prop-types";
import { Outlet, useNavigate } from "react-router-dom";
import { uniqBy } from "lodash";

import SingleUserChatMessage from "../message/SingleUserChatMessage";
import api from "../../services/api";
import { ChatNavigationList, ChatSearch, EmptyChatList, UserChatListCard } from "../Chat";
import chatStyles from "../../styles/chat.module.scss";
import { ActivityLoader } from "../Loaders/ActivityLoader";
import userContext from "../../context/userContext";
import { CHAT_TYPE, MESSAGE_TYPE } from "../../../constants/helpers";
import { toast } from "react-hot-toast";
import { playMessageSendSound } from "../../lib/playMessageSendSound";

async function getAllConversations(adminId) {
  // get all conversations in one request due to getting duplicate conversations when using pagination
  const res = await api.post(`/admin-admin-conversation/get-all-conversations?adminId=${adminId}`);
  return res.data;
}
async function getSingleConversation(conversationId) {
  const res = await api.get(
    `/admin-admin-conversation/get-single-conversation?conversationId=${conversationId}`
  );
  return res.data;
}
async function getLatestConversation(adminId) {
  const res = await api.get(`/admin-admin-conversation/get-latest-conversation?adminId=${adminId}`);
  return res.data;
}
async function fetchMessages(conversation_id, page, limit, customSkip = 0) {
  const res = await api.get(
    `/admin-admin-message/get-messages?conversationId=${conversation_id}&page=${page}&limit=${limit}&customSkip=${customSkip}`
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
    `/admin-admin-message/get-unread-messages?conversationId=${conversationId}&userId=${userId}`
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
    socket.emit("intialize_admin_admin_conversation");
    socket.emit("admin_admin_join_conversation", {
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
    socket.emit("admin_admin_leave_conversation", {
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
    socket.emit("admin_admin_user_start_typing", {
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
    socket.emit("admin_admin_user_stopped_typing", {
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
function handleSocketOnUserStartTypingFromServer(socket, typingUsers, setTypingUsers) {
  if (socket) {
    socket.on(
      "admin_admin_user_start_typing_from_server",
      ({ conversation_id, user: typingUser }) => {
        // INFO: In user you only got user: name and _id from the server
        let isAlreadyAddedTypingUser = typingUsers
          ?.map((tUser) => tUser?._id)
          .includes(typingUser?._id);
        if (!isAlreadyAddedTypingUser) {
          setTypingUsers((prev) => [...prev, { ...typingUser, messageType: "typing" }]);
        }
      }
    );
    return () => socket.off("admin_admin_user_start_typing_from_server");
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
      "admin_admin_user_stopped_typing_from_server",
      ({ conversation_id, user: typingUser }) => {
        setTypingUsers((prev) => prev.filter((tUser) => tUser?._id !== typingUser?._id));
      }
    );
    return () => socket.off("admin_admin_user_stopped_typing_from_server");
  }
}

async function handleSendForwardMessage(message, selectedUsers, socket, user) {
  let messages = message.filter((msg) => msg.selected === true);

  let updateSelectedMessagesData = messages.map((selectedMessage) =>
    selectedMessage.messageType === "Text"
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

  const students = selectedUsers?.map((user) => user?._id);

  const res = await api.post("/admin-admin-message/forward-message", {
    conversation_ids: students,
    messagesData: updateSelectedMessagesData,
  });

  selectedUsers?.forEach((groupId) => {
    const forwardMessages = res.data?.filter((msg) => msg?.conversation === groupId?._id);
    socket.emit("admin_admin_send_message", forwardMessages);
    socket.emit("admin_admin_update_latest_message", {
      conversation_id: groupId?._id,
      latestMessage: forwardMessages[forwardMessages.length - 1],
    });
  });

  return;
}

/**
 *
 * @param {any} socket - Socket
 * @param {string} conversationId - conversationId
 *  @param {Function} setMessages - Funciton to update messages state
 *  @param {Function} finalCallback - Funciton to update messages state
 */
function handleSocketOnRecieveMessages(socket, conversationId, setMessages, finalCallback) {
  if (socket) {
    socket.on("admin_admin_recieve_message", async (messages) => {
      if (messages[0]?.conversation === conversationId) {
        setMessages((prev) => [...messages, ...prev]);
        finalCallback(messages);
      }
    });
    return () => socket.off("admin_admin_recieve_message");
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
    socket.on("admin_admin_reads_the_message", ({ message, message_read_user }) => {
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
    });
    return () => socket.off("admin_admin_reads_the_message");
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
    socket.on("admin_admin_message_reaction_updated", (data) => {
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
            return msg._id === message_id ? { ...msg, reactions: newReactions } : msg;
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

    return () => socket.off("admin_admin_message_reaction_updated");
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setMessages - a setMessages function to update messsages
 */
function handleSocketOnDeleteMessages(socket, setMessages) {
  socket.on("admin_admin_delete_these_messgaes", (data) => {
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
  return () => socket.off("admin_admin_delete_these_messgaes");
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
    } else if (messageType === MESSAGE_TYPE.file || messageType === MESSAGE_TYPE.voice) {
      let attachmentFiles = content;
      if (attachmentFiles.length) {
        const data = {
          messageType: messageType,
          senderId: user._id,
          conversationId: conversation._id,
          fileText: JSON.stringify(
            attachmentFiles.map((item) => {
              return {
                textContent: messageType === MESSAGE_TYPE.voice ? "" : item.caption,
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
      ? `/admin-admin-message/reply-message?replyMessageId=${replyMessage._id}`
      : "/admin-admin-message/send-message";
    const { data: newMessages } = await api.post(url, formData, {
      headers: {
        "Content-Type":
          messageType === MESSAGE_TYPE.text ? "application/json" : "multipart/form-data",
      },
    });
    setMessages((prev) => [...newMessages, ...prev]);
    socket.emit("admin_admin_send_message", newMessages);
    socket.emit("admin_admin_update_latest_message", {
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
  if (socket && readUserId && senderId && readUserIds && conversationId && messageId) {
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
        const res = await api.post("/admin-admin-message/read-message", {
          messageId: messageId,
          readUserId: readUserId,
        });
        if (res.data) {
          finalCallback({
            message: sm_message,
            message_read_user: res.data,
          });
          socket.emit("admin_admin_read_message", {
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
async function handleAddReactionToMessage(reaction, socket, messageId, userId, conversationId) {
  if (reaction && socket && messageId && userId && conversationId) {
    try {
      const res = await api.post("/admin-admin-message/react-message", {
        messageId: messageId,
        reactionUserId: userId,
        reaction,
      });
      socket.emit("admin_admin_reaction_added_to_message", {
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
      const res = await api.patch("/admin-admin-message/delete-messages-for-me", {
        messageIds: data.deleteMessageIds,
        deletedForUserId: data.deleteFor,
      });
      if (res.data?.acknowledged) {
        socket.emit("admin_admin_delete_messages", data);
        socket.emit("admin_admin_update_latest_message", {
          conversation_id: conversationId,
          latestMessage: {
            ...selectedMessages[selectedMessages?.length - 1],
            deletedFor: [...selectedMessages[selectedMessages?.length - 1]?.deletedFor, userId],
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
      const res = await api.patch("/admin-admin-message/delete-messages-for-everyone", {
        messageIds: data.deleteMessageIds,
      });
      if (res.data?.acknowledged) {
        socket.emit("admin_admin_delete_messages", data);
        socket.emit("admin_admin_update_latest_message", {
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

const AdminAdminChat = () => {
  const navigate = useNavigate();
  const { userData: user, socket } = useContext(userContext);

  const [searchText, setSearchText] = useState("");
  const [searchedConversations, setSearchedConversations] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
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
        let conversations = await getAllConversations(user?._id);
        setAllConversations(conversations);
      } catch (err) {
        console.log("Error occured while fetching admin-admin conversations: ", err);
      } finally {
        setLoading((prev) => ({ ...prev, isMainDataLoading: false }));
      }
    })();
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      socket.on("admin_admin_recieve_latest_message", async (data) => {
        const { conversation_id, latestMessage } = data;
        const latestConversation = allConversations.find((item) => item?._id === conversation_id);
        if (!latestConversation) {
          let fetchedLatestConversation = await getLatestConversation(user._id);
          setAllConversations((prev) => uniqBy([fetchedLatestConversation, ...prev], "_id"));
        } else {
          let updatedConversation = { ...latestConversation, latestMessage };
          let filterData = allConversations.filter((item) => item?._id !== conversation_id);
          setAllConversations(uniqBy([updatedConversation, ...filterData], "_id"));
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("admin_admin_recieve_latest_message");
      }
    };
  }, [socket, allConversations, user]);

  const handleSearchTextChange = useCallback(
    (text) => {
      setSearchText(text);
      let searchedConversations = allConversations.filter((item) => {
        return (
          (item.admin1?.name?.toLowerCase() || "").includes(text?.toLowerCase()) ||
          (item.admin2?.name?.toLowerCase() || "").includes(text?.toLowerCase())
        );
      });
      setSearchedConversations(searchedConversations);
    },
    [allConversations]
  );

  const handleNavigate = useCallback((conversation) => {
    setSelectedConversation(conversation);
    navigate(`${conversation._id}`);
  }, []);

  const renderItem = ({ item: conversation, index, data }) => {
    let listUser =
      conversation?.admin1?._id === user?._id ? conversation?.admin2 : conversation?.admin1;
    let activeUser =
      selectedConversation?.admin1?._id === user?._id
        ? selectedConversation?.admin2
        : selectedConversation?.admin1;

    return (
      <UserChatListCard
        listUser={listUser}
        latestMessage={conversation.latestMessage}
        onClick={() => handleNavigate(conversation)}
        activeUser={activeUser}
      />
    );
  };

  function keyExtractor({ item, index }) {
    return item._id;
  }

  function handleForwardMessage(message) {
    console.log("message", message);
    return allConversations;
    console.log(message);
  }

  return (
    <div className={chatStyles.chatContainer}>
      <div className={chatStyles.chatSidebar}>
        <div className={chatStyles.header}>
          <h5>Admins Chats</h5>
        </div>
        <ChatSearch onTextChange={handleSearchTextChange} />
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
              data={searchedConversations}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ListEmptyComponent={() => (
                <EmptyChatList message={`Conversation not found of name: '${searchText}'`} />
              )}
            />
          )
        ) : (
          <ChatNavigationList
            data={allConversations}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={() => <EmptyChatList />}
            ListFooterComponent={() => {
              if (loading.isMainDataLoading) {
                return (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <ActivityLoader />
                  </div>
                );
              } else {
                return (
                  <div style={{ display: "flex", justifyContent: "center" }}>
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
          chatType: CHAT_TYPE.adminAdminSingleChat,
          selectedConversation,
          setSelectedConversation,
          Message: SingleUserChatMessage,
          getSingleConversation,
          fetchMessages,
          fetchUnreadMessages,
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
          handleForwardMessage,
          handleSendForwardMessage,
        }}
      />
    </div>
  );
};

AdminAdminChat.propTypes = {
  user: PropTypes.object,
};

export default AdminAdminChat;
