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

import AdminTutorGroupMessage from "../message/AdminTutorGroupMessage";
import api, { getAccessToken } from "../../services/api";
import { ChatNavigationList, ChatSearch, EmptyChatList } from "../Chat";
import { ActivityLoader } from "../Loaders/ActivityLoader";
import userContext from "../../context/userContext";
import { toast } from "react-hot-toast";
import { playMessageSendSound } from "../../lib/playMessageSendSound";
import { CHAT_TYPE, MESSAGE_TYPE } from "../../../constants/helpers";
// import { CreateGroupModal } from "../Chat";
// import CreateGroupModal from "../createGroupModals/createAdminTutorGroup";
import { CreateAdminTutorGroup } from "../createGroupModals";

import GroupChatListCard from "../Chat/GroupChatListCard";
import chatStyles from "../../styles/chat.module.scss";
import { FiEdit } from "react-icons/fi";

async function getAllConversations(page = 1, limit = 15, user_id) {
  const res = await api.get(
    `/admin-tutor-group-conversation/get-all-groups-for-current-user?page=${page}&limit=${limit}&user_id=${user_id}`
  );
  return res.data.conversationGroups;
}
async function getConversationsByPhoneNumber(phoneNumber) {
  return [];
}

async function getSingleConversation(conversationId) {
  const res = await api.get(
    `/admin-tutor-group-conversation/get-single-group?group_id=${conversationId}`
  );
  return res.data;
}
async function fetchMessages(conversation_id, page, limit, customSkip = 0) {
  const res = await api.get(
    `/admin-tutor-group-message/get-messages?groupId=${conversation_id}&page=${page}&limit=${limit}&customSkip=${customSkip}`
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
    `/admin-tutor-group-message/get-unread-messages?groupId=${conversationId}&userId=${userId}`
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
  if (socket) {
    socket.emit("intialize_admin_tutor_group");
    if (user && conversation) {
      socket.emit("admin_tutor_group_join", {
        group_id: conversation?._id,
        user,
      });
    }
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
    socket.emit("admin_tutor_group_leave_conversation", {
      group_id: conversation?._id,
      user: { _id: user?._id, name: user?.name },
    });
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

  const tutors = selectedUsers.filter((user) => user._id);

  try {
    const res = await api.post("/admin-tutor-group-message/forward-messages", {
      conversationIds: tutors,
      messagesData: updateSelectedMessagesData,
    });
    selectedUsers?.forEach((groupId) => {
      const forwardMessages = res.data?.filter(
        (msg) => msg?.conversation === groupId?._id
      );
      socket.emit("admin_tutor_group_send_message", forwardMessages);
      socket.emit("admin_tutor_group_update_latest_message", {
        group_id: groupId?._id,
        latestMessage: forwardMessages[forwardMessages.length - 1],
      });
    });
  } catch (error) {}
  return;
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
      "admin_tutor_group_user_start_typing_from_server",
      ({ group_id, user: typingUser }) => {
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
    return () => socket.off("admin_tutor_group_user_start_typing_from_server");
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
      "admin_tutor_group_user_stopped_typing_from_server",
      ({ group_id, user: typingUser }) => {
        setTypingUsers((prev) =>
          prev.filter((tUser) => tUser?._id !== typingUser?._id)
        );
      }
    );
    return () =>
      socket.off("admin_tutor_group_user_stopped_typing_from_server");
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
    socket.emit("admin_tutor_group_user_start_typing", {
      group_id: conversation?._id,
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
    socket.emit("admin_tutor_group_user_stopped_typing", {
      group_id: conversation?._id,
      user: { _id: user?._id, name: user?.name },
    });
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
    socket.on("admin_tutor_group_recieve_message", async (messages) => {
      console.log("Messages", messages);
      if (messages[0]?.conversation === conversationId) {
        setMessages((prev) => [...messages, ...prev]);
        finalCallback(messages);
      }
    });
    return () => socket.off("admin_tutor_group_recieve_message");
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
      "admin_tutor_group_reads_the_message",
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
    return () => socket.off("admin_tutor_group_reads_the_message");
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
    socket.on("admin_tutor_group_message_reaction_updated", (data) => {
      const { message_id, reactionData } = data;
      const { reactionUser } = reactionData;
      const reactionMessage = messages.find((msg) => msg._id === message_id);
      if (reactionMessage) {
        // check if user already reacted to message
        const isAlreadyReactedToMessage = reactionMessage?.reactions?.find(
          (item) => item?.reactionUser?._id === reactionUser?._id
        );
        if (isAlreadyReactedToMessage) {
          let newReactions = reactionMessage?.reactions?.map((item) =>
            item?.reactionUser?._id === reactionUser?._id ? reactionData : item
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

    return () => socket.off("admin_tutor_group_message_reaction_updated");
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setMessages - a setMessages function to update messsages
 */
function handleSocketOnDeleteMessages(socket, setMessages) {
  socket.on("admin_tutor_group_delete_these_messgaes", (data) => {
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
  return () => socket.off("admin_tutor_group_delete_these_messgaes");
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setConversation - a setConversation function to update covnersation
 */
function handleSocketOnUpdateGroupName(socket, setConversation) {
  if (!socket || !setConversation) return;
  socket.on(
    "admin_tutor_group_name_updated",
    ({ group_id, updatedGroupName }) => {
      if (!group_id || !updatedGroupName) return;
      setConversation((prev) => ({ ...prev, groupName: updatedGroupName }));
    }
  );
  return () => socket.off("admin_tutor_group_name_updated");
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setConversation - a setConversation function to update covnersation
 */
function handleSocketOnUpdateGroupDescription(socket, setConversation) {
  if (!socket || !setConversation) return;
  socket.on(
    "admin_tutor_group_description_updated",
    ({ group_id, updatedGroupDescription }) => {
      if (!group_id || !updatedGroupDescription) return;
      setConversation((prev) => ({
        ...prev,
        groupDescription: updatedGroupDescription,
      }));
    }
  );
  return () => socket.off("admin_tutor_group_description_updated");
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setConversation - a setConversation function to update covnersation
 */
function handleSocketOnNewAdminsAdded(socket, setConversation) {
  if (!socket || !setConversation) return;
  socket.on("admin_tutor_group_new_admins_added", (group) => {
    if (!group) return;
    setConversation(group);
  });
  return () => socket.off("admin_tutor_group_new_admins_added");
}
/**
 *
 * @param {any} socket - Socket
 * @param {string} userId - userId
 * @param {Object} conversation - conversation
 * @param {Function} setConversation - a setConversation function to update covnersation
 * @param {Function} conditionalCallback - a conditionalCallback function to run for that admin which is got deleted
 */
function handleSocketOnAdminGotDeleted(
  socket,
  userId,
  conversation,
  setConversation,
  conditionalCallback
) {
  if (!socket || !setConversation || !userId) return;
  socket.on("admin_tutor_group_admin_got_deleted", ({ group_id, admin_id }) => {
    if (!group_id || !admin_id) return;
    if (conversation?._id !== group_id) return;
    if (admin_id === userId) {
      conditionalCallback();
    } else {
      setConversation((prev) => ({
        ...prev,
        adminParticipants: prev?.adminParticipants?.filter(
          (admin) => admin?._id !== admin_id
        ),
      }));
    }
  });
  return () => socket.off("admin_tutor_group_admin_got_deleted");
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setConversation - a setConversation function to update covnersation
 */
function handleSocketOnNewTutorsAdded(socket, setConversation) {
  if (!socket || !setConversation) return;
  socket.on("admin_tutor_group_new_tutors_added", (group) => {
    if (!group) return;
    setConversation(group);
  });
  return () => socket.off("admin_tutor_group_new_tutors_added");
}
/**
 *
 * @param {any} socket - Socket
 * @param {string} userId - userId
 * @param {Object} conversation - conversation
 * @param {Function} setConversation - a setConversation function to update covnersation
 * @param {Function} conditionalCallback - a conditionalCallback function to run for that admin which is got deleted
 */
function handleSocketOnTutorGotDeleted(
  socket,
  userId,
  conversation,
  setConversation,
  conditionalCallback
) {
  if (!socket || !setConversation || !userId) return;
  socket.on("admin_tutor_group_tutor_got_deleted", ({ group_id, tutor_id }) => {
    if (!group_id || !tutor_id) return;
    if (conversation?._id !== group_id) return;
    if (tutor_id === userId) {
      conditionalCallback();
    } else {
      setConversation((prev) => ({
        ...prev,
        tutorParticipants: prev?.tutorParticipants?.filter(
          (tutor) => tutor?._id !== tutor_id
        ),
      }));
    }
  });
  return () => socket.off("admin_tutor_group_tutor_got_deleted");
}
/**
 *
 * @param {any} socket - Socket
 * @param {Object} conversation - conversation
 * @param {Function} conditionalCallback - a conditionalCallback function to run for that admin which is got deleted
 */
function handleSocketOnGroupGotDeleted(
  socket,
  conversation,
  conditionalCallback
) {
  if (!socket) return;
  socket.on("admin_tutor_group_got_deleted", (group_id) => {
    if (!group_id) return;
    if (conversation?._id === group_id) {
      // DO: redirect to group list page
      conditionalCallback();
    }
  });
  return () => socket.off("admin_tutor_group_got_deleted");
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
      // const { messageType, senderId, groupId } = req.body;
      formData = {
        messageType: "Text",
        senderId: user?._id,
        groupId: conversation?._id,
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
          groupId: conversation._id,
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
      ? `/admin-tutor-group-message/reply-message?replyMessageId=${replyMessage._id}`
      : "/admin-tutor-group-message/send-message";
    if (replyMessage) {
      url = `/admin-tutor-group-message/reply-message?replyMessageId=${replyMessage._id}`;
    } else {
      url = "/admin-tutor-group-message/send-message";
    }
    const { data: newMessages } = await api.post(url, formData, {
      headers: {
        "Content-Type":
          messageType === MESSAGE_TYPE.text
            ? "application/json"
            : "multipart/form-data",
      },
    });
    setMessages((prev) => [...newMessages, ...prev]);
    socket.emit("admin_tutor_group_send_message", newMessages);
    socket.emit("admin_tutor_group_update_latest_message", {
      group_id: conversation?._id,
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
          group_id: conversationId,
          message_id: messageId,
          message_sender_id: senderId,
        };
        const res = await api.post("/admin-tutor-group-message/read-message", {
          messageId: messageId,
          readUserId: readUserId,
        });
        if (res.data) {
          finalCallback({
            message: sm_message,
            message_read_user: res.data,
          });
          socket.emit("admin_tutor_group_read_message", {
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
      const res = await api.post("/admin-tutor-group-message/react-message", {
        messageId: messageId,
        reactionUserId: userId,
        reaction,
      });
      socket.emit("admin_tutor_group_reaction_added_to_message", {
        group_id: conversationId,
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
      group_id: conversationId,
      deleteType: "for-me",
      deleteFor: userId,
      deleteMessageIds: selectedMessages.map((msg) => msg?._id),
    };
    try {
      const res = await api.post(
        "/admin-tutor-group-message/delete-messages-for-me",
        {
          messageIds: data.deleteMessageIds,
          deletedForUserId: data.deleteFor,
        }
      );
      if (res.data?.acknowledged) {
        socket.emit("admin_tutor_group_delete_messages", data);
        socket.emit("admin_tutor_group_update_latest_message", {
          group_id: conversationId,
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
      group_id: conversationId,
      deleteType: "for-everyone",
      deleteFor: userId,
      deleteMessageIds: selectedMessages.map((msg) => msg?._id),
    };
    try {
      const res = await api.post(
        "/admin-tutor-group-message/delete-messages-for-everyone",
        {
          messageIds: data.deleteMessageIds,
        }
      );
      if (res.data?.acknowledged) {
        socket.emit("admin_tutor_group_delete_messages", data);
        socket.emit("admin_tutor_group_update_latest_message", {
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

const AdminTutorGroupChat = () => {
  const navigate = useNavigate();
  const { userData: user, socket } = useContext(userContext);

  const pageRef = useRef(1);
  const limitRef = useRef(15);
  const mouseOverTimeoutRef = useRef();
  const searchTimeoutRef = useRef();

  const [searchText, setSearchText] = useState("");
  const [searchedConversations, setSearchedConversations] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isNextDataFetching, setIsNextDataFetching] = useState(false);
  const [isLastConversation, setIsLastConversation] = useState(false);
  const [userSelectionModal, setUserSelectionModal] = useState(false);

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
          user?._id
        );
        if (conversations != []) setAllConversations(conversations);
      } catch (err) {
        console.log(
          "Error occured while fetching admin-tutor-group conversations: ",
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
    if (socket && user) {
      socket.on("admin_tutor_group_new_group_created", (newCreatedGroup) => {
        let newCreatedGroupAdminParticipants =
          newCreatedGroup?.adminParticipants?.map((item) => item?._id);
        let newCreatedGroupTutorParticipants =
          newCreatedGroup?.tutorParticipants?.map((item) => item?._id);
        if (
          newCreatedGroupAdminParticipants?.includes(user?._id) ||
          newCreatedGroupTutorParticipants?.includes(user?._id)
        ) {
          setAllConversations((prev) => [newCreatedGroup, ...prev]);
        }
      });
      socket.on("admin_tutor_group_new_admins_added", (group) => {
        if (!group) return;
        let isUserAdded = group?.adminParticipants?.find(
          (admin) => admin?._id === user?._id
        );
        if (isUserAdded) {
          setAllConversations((prev) => uniqBy([group, ...prev], "_id"));
        }
      });

      socket.on(
        "admin_tutor_group_admin_got_deleted",
        ({ group_id, admin_id }) => {
          if (!group_id || !admin_id) return;
          if (admin_id === user?._id) {
            const updatedConversations = allConversations.filter(
              (item) => item?._id !== group_id
            );
            setAllConversations(updatedConversations);
          }
        }
      );

      socket.on("admin_tutor_group_new_tutors_added", (group) => {
        if (!group) return;
        let isUserAdded = group?.tutorParticipants?.find(
          (tutor) => tutor?._id === user?._id
        );
        if (isUserAdded) {
          setAllConversations((prev) => uniqBy([group, ...prev], "_id"));
        }
      });

      socket.on(
        "admin_tutor_group_tutor_got_deleted",
        ({ group_id, tutor_id }) => {
          if (!group_id || !tutor_id) return;
          if (tutor_id === user?._id) {
            const updatedConversations = allConversations.filter(
              (item) => item?._id !== group_id
            );
            setAllConversations(updatedConversations);
          }
        }
      );

      socket.on("admin_tutor_group_got_deleted", (group_id) => {
        if (!group_id) return;
        const updatedConversations = allConversations.filter(
          (item) => item?._id !== group_id
        );
        setAllConversations(updatedConversations);
      });
    }
    return () => {
      if (socket) {
        socket.off("admin_tutor_group_new_group_created");
        // socket.off("admin_tutor_group_new_admins_added");
      }
    };
  }, [socket, user, allConversations]);

  function handleForwardMessage(message) {
    return allConversations;
    console.log(message);
  }

  useEffect(() => {
    if (socket) {
      socket.on("admin_tutor_group_recieve_latest_message", async (data) => {
        const { group_id, latestMessage } = data;
        const latestConversation = allConversations.find(
          (item) => item?._id === group_id
        );
        if (!latestConversation) {
          let fetchedLatestConversation = await getAllConversations(1, 1);
          setAllConversations((prev) => [
            ...fetchedLatestConversation,
            ...prev,
          ]);
        } else {
          let updatedConversation = { ...latestConversation, latestMessage };
          let filterData = allConversations.filter(
            (item) => item?._id !== group_id
          );
          setAllConversations([updatedConversation, ...filterData]);
        }
      });

      socket.on(
        "admin_tutor_group_name_updated",
        ({ group_id, updatedGroupName }) => {
          if (!group_id || !updatedGroupName) return;
          let updatedConversation = allConversations.find(
            (item) => item?._id === group_id
          );
          updatedConversation = {
            ...updatedConversation,
            groupName: updatedGroupName,
          };
          let filterData = allConversations.filter(
            (item) => item?._id !== group_id
          );
          setAllConversations([updatedConversation, ...filterData]);
        }
      );
      socket.on(
        "admin_tutor_group_description_updated",
        ({ group_id, updatedGroupDescription }) => {
          if (!group_id || !updatedGroupDescription) return;
          let updatedConversation = allConversations.find(
            (item) => item?._id === group_id
          );
          updatedConversation = {
            ...updatedConversation,
            groupDescription: updatedGroupDescription,
          };
          let filterData = allConversations.filter(
            (item) => item?._id !== group_id
          );
          setAllConversations([updatedConversation, ...filterData]);
        }
      );
    }
    return () => {
      if (socket) {
        socket.off("admin_tutor_group_recieve_latest_message");
        // socket.off("admin_tutor_group_name_updated");
        // socket.off("admin_tutor_group_description_updated");
      }
    };
  }, [socket, allConversations]);

  const handleSearchTextChange = useCallback(
    (text) => {
      if (!user) return;
      // setLoading((prev) => ({ ...prev, isSearchedDataLoading: true }));
      setSearchText(text);
      const searchedData = allConversations.filter((item) =>
        item?.groupName?.toLowerCase().includes(text?.toLowerCase())
      );
      setSearchedConversations(searchedData);
    },
    [user, allConversations]
  );

  const handleUserSelectionModal = async () => {
    setUserSelectionModal(!userSelectionModal);
  };

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
        user?._id
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

  const handleOnEndReachedTutors = useCallback(async () => {
    console.log("Handle on end working");
    // if (isNextDataFetching || isLastConversation || !user) {
    //     return;
    // }
    // try {
    //     setIsNextDataFetching(true);
    //     pageRef.current += 1;
    //     const newConversations = await getAllTuto(pageRef.current, limitRef.current, user?._id);
    //     if (newConversations.length === 0) {
    //         setIsLastConversation(true);
    //         return;
    //     }
    //     let uniqueConversations = uniqBy([...allConversations, ...newConversations], "_id");
    //     setAllConversations(uniqueConversations);
    // } catch (err) {
    //     console.log("Error occured while fetching new conversations: ", err);
    // } finally {
    //     setIsNextDataFetching(false);
    // }
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
      <GroupChatListCard
        listUser={conversation}
        latestMessage={conversation.latestMessage}
        onClick={() => handleNavigate(conversation)}
        activeUser={selectedConversation}
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
          <h5>Admin Tutor Groups</h5>
          {(user?.userType === "Super-Admin" || user?.userType === "Admin") && (
            <button
              type="button"
              className={chatStyles.createGroupBtn}
              onClick={handleUserSelectionModal}
            >
              <FiEdit />
            </button>
          )}
        </div>
        <ChatSearch
          onTextChange={handleSearchTextChange}
          placeholder="Search a group"
        />
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
              onEndReached={handleOnEndReached}
              ListEmptyComponent={() => (
                <EmptyChatList
                  message={`Conversation not found of name: '${searchText}'`}
                />
              )}
            />
          )
        ) : (
          <ChatNavigationList
            data={allConversations}
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
          chatType: CHAT_TYPE.adminTutorGroupChat,
          selectedConversation,
          setSelectedConversation,
          Message: AdminTutorGroupMessage,
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
          handleSocketOnUpdateGroupName,
          handleSocketOnUpdateGroupDescription,
          handleSocketOnNewAdminsAdded,
          handleSocketOnAdminGotDeleted,
          handleSocketOnGroupGotDeleted,
          handleSocketOnTutorGotDeleted,
          handleSocketOnNewTutorsAdded,
          handleSendNotificationToGroupParticipants,
          handleForwardMessage,
          handleSendForwardMessage,
        }}
      />
      <div>
        {userSelectionModal && (
          <CreateAdminTutorGroup
            closeModal={handleUserSelectionModal}
            onEndReached={handleOnEndReachedTutors}
          />
        )}
      </div>
    </div>
  );
};

AdminTutorGroupChat.propTypes = {
  user: PropTypes.object,
};

export default AdminTutorGroupChat;
