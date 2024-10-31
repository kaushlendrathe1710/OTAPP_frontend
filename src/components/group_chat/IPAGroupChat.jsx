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

import IPAStudentGroupMessage from "../message/IPAStudentGroupMessage";
import api, { getAccessToken } from "../../services/api";
import { ChatNavigationList, ChatSearch, EmptyChatList } from "../Chat";
import { ActivityLoader } from "../Loaders/ActivityLoader";
import userContext from "../../context/userContext";
import { toast } from "react-hot-toast";
import { playMessageSendSound } from "../../lib/playMessageSendSound";
import { CHAT_TYPE, MESSAGE_TYPE } from "../../../constants/helpers";
import { CreateIPAGroup } from "../createGroupModals";
import GroupChatListCard from "../Chat/GroupChatListCard";
import chatStyles from "../../styles/chat.module.scss";
import { FiEdit } from "react-icons/fi";

async function getAllConversations(page = 1, limit = 15, user_id) {
  if (!user_id) return [];
  const res = await api.get(
    `/ipa-group/get-all-groups?page=${page}&limit=${limit}`
  );
  // console.log(res.data);
  let data = [];
  res.data.map((group) => {
    data.push(group["student_ipa"]);
    data.push(group["tutor_ipa"]);
    // console.log(group);
  });
  return data;
}
async function getSingleConversation(conversationId, userType, chatType) {
  if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
    const res = await api.get(
      `/ipa-group/get-single-group?query=${conversationId}&type=${"tutor_ipa"}`
    );
    return res.data;
  } else {
    const res = await api.get(
      `/ipa-group/get-single-group?query=${conversationId}&type=${"student_ipa"}`
    );
    return res.data;
  }
  // const res = await api.get(`/ipa-group/get-single-group?query=${conversationId}&type=${"student_ipa"}`);
  // return res.data;
}
async function fetchMessages(
  conversation_id,
  page,
  limit,
  customSkip = 0,
  chatType
) {
  if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
    const res = await api.get(
      `/ipa-tutor-group-message/get-messages?groupId=${conversation_id}&page=${page}&limit=${limit}&customSkip=${customSkip}`
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
  } else {
    const res = await api.get(
      `/ipa-student-group-message/get-messages?groupId=${conversation_id}&page=${page}&limit=${limit}&customSkip=${customSkip}`
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

  // const res = await api.get(`/ipa-student-group-message/get-messages?groupId=${conversation_id}&page=${page}&limit=${limit}&customSkip=${customSkip}`);
  // return res.data?.length === limit
  //     ? {
  //           data: res.data,
  //           nextPage: page + 1,
  //       }
  //     : {
  //           data: res.data,
  //           nextPage: undefined,
  //       };
}
async function fetchUnreadMessages(conversationId, userId, chatType) {
  if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
    const res = await api.get(
      `/ipa-tutor-group-message/get-unread-messages?groupId=${conversationId}&userId=${userId}`
    );
    const { unReadMessages, totalUnReadMessages } = res.data;
    return { unReadMessages, unReadMessagesCount: totalUnReadMessages };
  } else {
    const res = await api.get(
      `/ipa-student-group-message/get-unread-messages?groupId=${conversationId}&userId=${userId}`
    );
    const { unReadMessages, totalUnReadMessages } = res.data;
    return { unReadMessages, unReadMessagesCount: totalUnReadMessages };
  }
}
/**
 *
 * @param {Object} user - User info object
 * @param {any} socket - Socket
 * @param {Object} conversation - Conversation info object
 */
function handleSocketEmitUserJoinConversation(
  user,
  socket,
  conversation,
  chatType
) {
  if (user && socket && conversation) {
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      socket.emit("ipa_tutor_group_join", {
        group_id: conversation?._id,
        user,
      });
    } else {
      socket.emit("ipa_student_group_join", {
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
function handleSocketEmitUserLeaveConversation(
  user,
  socket,
  conversation,
  chatType
) {
  if (user && socket && conversation) {
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      socket.emit("ipa_tutor_group_leave", {
        group_id: conversation?._id,
        user,
      });
    } else {
      socket.emit("ipa_student_group_leave", {
        group_id: conversation?._id,
        user: { _id: user?._id, name: user?.name },
      });
    }
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
  setTypingUsers,
  chatType
) {
  if (socket) {
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      socket.on(
        "ipa_tutor_group_user_start_typing_from_server",
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
      return () => socket.off("ipa_tutor_group_user_start_typing_from_server");
    } else {
      socket.on(
        "ipa_student_group_user_start_typing_from_server",
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
      return () =>
        socket.off("ipa_student_group_user_start_typing_from_server");
    }
  }
}

/**
 *
 * @param {any} socket - Socket
 * @param {Function} setTypingUsers - Funciton to update typing users state
 */
function handleSocketOnUserStoppedTypingFromServer(
  socket,
  setTypingUsers,
  chatType
) {
  if (socket) {
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      socket.on(
        "ipa_tutor_group_user_stopped_typing_from_server",
        ({ group_id, user: typingUser }) => {
          setTypingUsers((prev) =>
            prev.filter((tUser) => tUser?._id !== typingUser?._id)
          );
        }
      );
      return () =>
        socket.off("ipa_tutor_group_user_stopped_typing_from_server");
    } else {
      socket.on(
        "ipa_student_group_user_stopped_typing_from_server",
        ({ group_id, user: typingUser }) => {
          setTypingUsers((prev) =>
            prev.filter((tUser) => tUser?._id !== typingUser?._id)
          );
        }
      );
      return () =>
        socket.off("ipa_student_group_user_stopped_typing_from_server");
    }
  }
}
/**
 *
 * @param {Object} user - User info object
 * @param {any} socket - Socket
 * @param {Object} conversation - Conversation info object
 */
function handleSocketEmitUserStartTyping(user, socket, conversation, chatType) {
  if (user && socket && conversation) {
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      socket.emit("ipa_tutor_group_user_start_typing", {
        group_id: conversation?._id,
        user: { _id: user?._id, name: user?.name },
      });
    } else {
      socket.emit("ipa_student_group_user_start_typing", {
        group_id: conversation?._id,
        user: { _id: user?._id, name: user?.name },
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
function handleSocketEmitUserStoppedTyping(
  user,
  socket,
  conversation,
  chatType
) {
  if (user && socket && conversation) {
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      socket.emit("ipa_tutor_group_user_stopped_typing", {
        group_id: conversation?._id,
        user: { _id: user?._id, name: user?.name },
      });
    } else {
      socket.emit("ipa_student_group_user_stopped_typing", {
        group_id: conversation?._id,
        user: { _id: user?._id, name: user?.name },
      });
    }
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
  finalCallback,
  chatType
) {
  if (socket) {
    // socket.on("ipa_tutor_group_recieve_message", async (messages) => {
    //     console.log(messages);
    // });
    socket.on("ipa_tutor_group_recieve_message", async (messages) => {
      if (messages[0]?.conversation === conversationId) {
        setMessages((prev) => [...messages, ...prev]);
        finalCallback(messages);
      }
    });
    socket.on("ipa_student_group_recieve_message", async (messages) => {
      if (messages[0]?.conversation === conversationId) {
        setMessages((prev) => [...messages, ...prev]);
        finalCallback(messages);
      }
    });
    return () => {
      socket.off("ipa_tutor_group_recieve_message");
      socket.off("ipa_student_group_recieve_message");
    };
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {string} userId - user id
 *  @param {Function} setMessages - Funciton to update messages state
 */
function handleSocketOnReadMessages(socket, userId, setMessages, chatType) {
  if (socket && userId) {
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      socket.on(
        "ipa_tutor_group_reads_the_message",
        ({ message, message_read_user }) => {
          // In "message" you only got: group_id, message_id and message_sender_id
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
      return () => socket.off("ipa_tutor_group_reads_the_message");
    } else {
      socket.on(
        "ipa_student_group_reads_the_message",
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
      return () => socket.off("ipa_student_group_reads_the_message");
    }
  }
}

/**
 *
 * @param {any} socket - Socket
 * @param {Array} messages - Array of all messages
 *  @param {Function} setMessages - Funciton to update messages state
 */
function handleSocketOnUserReactedMessage(
  socket,
  messages,
  setMessages,
  chatType
) {
  if (socket && messages) {
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      socket.on("ipa_tutor_group_message_reaction_updated", (data) => {
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
              item?.reactionUser?._id === reactionUser?._id
                ? reactionData
                : item
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
      return () => socket.off("ipa_tutor_group_message_reaction_updated");
    } else {
      socket.on("ipa_student_group_message_reaction_updated", (data) => {
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
              item?.reactionUser?._id === reactionUser?._id
                ? reactionData
                : item
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

      return () => socket.off("ipa_student_group_message_reaction_updated");
    }
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setMessages - a setMessages function to update messsages
 */
function handleSocketOnDeleteMessages(socket, setMessages, chatType) {
  if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
    socket.on("ipa_tutor_group_delete_these_messgaes", (data) => {
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
    return () => socket.off("ipa_tutor_group_delete_these_messgaes");
  } else {
    socket.on("ipa_student_group_delete_these_messgaes", (data) => {
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
    return () => socket.off("ipa_student_group_delete_these_messgaes");
  }
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setConversation - a setConversation function to update covnersation
 */
function handleSocketOnUpdateGroupName(socket, setConversation, chatType) {
  if (!socket || !setConversation) return;

  socket.on("ipa_group_name_updated", ({ group_id, updatedGroupName }) => {
    if (!group_id || !updatedGroupName) return;
    setConversation((prev) => ({ ...prev, groupName: updatedGroupName }));
  });
  return () => socket.off("ipa_group_name_updated");
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setConversation - a setConversation function to update covnersation
 */
function handleSocketOnUpdateGroupDescription(socket, setConversation) {
  if (!socket || !setConversation) return;
  socket.on(
    "ipa_group_description_updated",
    ({ group_id, updatedGroupDescription }) => {
      if (!group_id || !updatedGroupDescription) return;
      setConversation((prev) => ({
        ...prev,
        groupDescription: updatedGroupDescription,
      }));
    }
  );
  return () => socket.off("ipa_group_description_updated");
}
/**
 *
 * @param {any} socket - Socket
 * @param {Function} setConversation - a setConversation function to update covnersation
 */
function handleSocketOnNewAdminsAdded(socket, setConversation, chatType) {
  if (!socket || !setConversation) return;
  if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
    socket.on("ipa_tutor_group_new_admins_added", (group) => {
      if (!group) return;
      setConversation(group);
    });
    return () => socket.off("ipa_tutor_group_new_admins_added");
  } else {
    socket.on("student_ipa_group_new_admins_added", (group) => {
      if (!group) return;
      setConversation(group);
    });
    return () => socket.off("student_ipa_group_new_admins_added");
  }
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
  conditionalCallback,
  chatType
) {
  if (!socket || !setConversation || !userId) return;
  if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
    socket.on("ipa_tutor_group_admin_got_deleted", ({ group_id, admin_id }) => {
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
    return () => socket.off("ipa_tutor_group_admin_got_deleted");
  } else {
    socket.on(
      "ipa_student_group_admin_got_deleted",
      ({ group_id, admin_id }) => {
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
      }
    );
    return () => socket.off("ipa_student_group_admin_got_deleted");
  }
}

/**
 *
 * @param {any} socket - Socket
 * @param {string} userId - userId
 * @param {Object} conversation - conversation
 * @param {Function} setConversation - a setConversation function to update covnersation
 * @param {Function} conditionalCallback - a conditionalCallback function to run for that admin which is got deleted
 */
function handleSocketOnStudentGotDeleted(
  socket,
  userId,
  conversation,
  setConversation,
  conditionalCallback
) {
  if (!socket || !setConversation || !userId) return;
  socket.on(
    "ipa_student_group_student_got_deleted",
    ({ group_id, student_id }) => {
      if (!group_id || !student_id) return;
      if (conversation?._id !== group_id) return;
      if (student_id === userId) {
        conditionalCallback();
      } else {
        setConversation((prev) => ({
          ...prev,
          studentParticipants: prev?.studentParticipants?.filter(
            (student) => student?._id !== student_id
          ),
        }));
      }
    }
  );
  return () => socket.off("ipa_student_group_student_got_deleted");
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
  socket.on("ipa_student_group_got_deleted", (group_id) => {
    if (!group_id) return;
    if (conversation?._id === group_id) {
      // DO: redirect to group list page
      conditionalCallback();
    }
  });
  return () => socket.off("ipa_student_group_got_deleted");
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
  messageType,
  chatType
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
    console.log(chatType);
    if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      let url = replyMessage
        ? `/ipa-tutor-group-message/reply-message?replyMessageId=${replyMessage._id}`
        : "/ipa-tutor-group-message/send-message";
      if (replyMessage) {
        url = `/ipa-tutor-group-message/reply-message?replyMessageId=${replyMessage._id}`;
      } else {
        url = "/ipa-tutor-group-message/send-message";
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
      socket.emit("ipa_tutor_group_send_message", newMessages);
      socket.emit("ipa_tutor_group_update_latest_message", {
        group_id: conversation?._id,
        latestMessage: newMessages[newMessages?.length - 1],
      });
      await playMessageSendSound();
      return newMessages;
    } else {
      let url = replyMessage
        ? `/ipa-student-group-message/reply-message?replyMessageId=${replyMessage._id}`
        : "/ipa-student-group-message/send-message";
      if (replyMessage) {
        url = `/ipa-student-group-message/reply-message?replyMessageId=${replyMessage._id}`;
      } else {
        url = "/ipa-student-group-message/send-message";
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
      socket.emit("ipa_student_group_send_message", newMessages);
      socket.emit("ipa_student_group_update_latest_message", {
        group_id: conversation?._id,
        latestMessage: newMessages[newMessages?.length - 1],
      });
      await playMessageSendSound();
      return newMessages;
    }

    //   setAttachmentFiles([]);
    //   await handleSendNotificationToAllGroupMembers(newMessages);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
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

function separatePeopleByGroups(users) {
  const students = [];
  const tutors = [];

  for (let i = 0; i < users.length; i++) {
    if (users[i]?.tutorParticipants) {
      tutors.push(users[i]?._id);
    } else if (users[i]?.studentParticipants) {
      students.push(users[i]?._id);
    }
  }

  return [students, tutors];
}

async function handleSendForwardMessage(message, selectedUsers, socket, user) {
  const [students, tutors] = separatePeopleByGroups(selectedUsers);
  console.log("students: ", students, "tutors: ", tutors);
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

  if (students.length) {
    console.log("Students: ", students);
    const res = await api.post("/ipa-student-group-message/forward-messages", {
      conversationIds: students,
      messagesData: updateSelectedMessagesData,
    });

    selectedUsers?.forEach((groupId) => {
      const forwardMessages = res.data?.filter(
        (msg) => msg?.conversation === groupId?._id
      );
      socket.emit("ipa_student_group_send_message", forwardMessages);
      socket.emit("ipa_student_group_update_latest_message", {
        group_id: groupId?._id,
        latestMessage: forwardMessages[forwardMessages.length - 1],
      });
    });
  }
  if (tutors.length) {
    const res = await api.post("/ipa-tutor-group-message/forward-messages", {
      conversationIds: tutors,
      messagesData: updateSelectedMessagesData,
    });
    selectedUsers?.forEach((groupId) => {
      const forwardMessages = res.data?.filter(
        (msg) => msg?.conversation === groupId?._id
      );
      socket.emit("ipa_tutor_group_send_message", forwardMessages);
      socket.emit("ipa_tutor_group_update_latest_message", {
        group_id: groupId?._id,
        latestMessage: forwardMessages[forwardMessages.length - 1],
      });
    });
  }

  return;
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
  finalCallback,
  chatType
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
        console.log(CHAT_TYPE.ipaTutorGroupChat === chatType);
        if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
          const res = await api.post("/ipa-tutor-group-message/read-message", {
            messageId: messageId,
            readUserId: readUserId,
          });
          if (res.data) {
            finalCallback({
              message: sm_message,
              message_read_user: res.data,
            });
            socket.emit("ipa_tutor_group_read_message", {
              message: sm_message,
              message_read_user: res.data,
            });
          }
        } else {
          const res = await api.post(
            "/ipa-student-group-message/read-message",
            {
              messageId: messageId,
              readUserId: readUserId,
            }
          );
          if (res.data) {
            finalCallback({
              message: sm_message,
              message_read_user: res.data,
            });
            socket.emit("ipa_student_group_read_message", {
              message: sm_message,
              message_read_user: res.data,
            });
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}

/**
 *
 * @param {any} socket - Socket
 * @param {Function} setConversation - a setConversation function to update covnersation
 */
function handleSocketOnNewStudentsAdded(socket, setConversation) {
  if (!socket || !setConversation) return;
  socket.on("student_ipa_group_new_students_added", (group) => {
    if (!group) return;
    setConversation(group);
  });
  return () => socket.off("student_ipa_group_new_students_added");
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
  conversationId,
  chatType
) {
  if (reaction && socket && messageId && userId && conversationId) {
    try {
      if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
        const res = await api.post("/ipa-tutor-group-message/react-message", {
          messageId: messageId,
          reactionUserId: userId,
          reaction,
        });
        socket.emit("ipa_tutor_group_reaction_added_to_message", {
          group_id: conversationId,
          message_id: messageId,
          reactionData: res.data,
        });
      } else {
        const res = await api.post("/ipa-student-group-message/react-message", {
          messageId: messageId,
          reactionUserId: userId,
          reaction,
        });
        socket.emit("ipa_student_group_reaction_added_to_message", {
          group_id: conversationId,
          message_id: messageId,
          reactionData: res.data,
        });
      }
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
  finalCallback = () => {},
  chatType
) {
  if (socket && conversationId && userId && selectedMessages) {
    let data = {
      group_id: conversationId,
      deleteType: "for-me",
      deleteFor: userId,
      deleteMessageIds: selectedMessages.map((msg) => msg?._id),
    };
    try {
      if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
        const res = await api.patch(
          "/ipa-tutor-group-message/delete-messages-for-me",
          {
            messageIds: data.deleteMessageIds,
            deletedForUserId: data.deleteFor,
          }
        );
        if (res.data?.acknowledged) {
          socket.emit("ipa_tutor_group_delete_messages", data);
          socket.emit("ipa_tutor_group_update_latest_message", {
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
      } else {
        const res = await api.patch(
          "/ipa-student-group-message/delete-messages-for-me",
          {
            messageIds: data.deleteMessageIds,
            deletedForUserId: data.deleteFor,
          }
        );
        if (res.data?.acknowledged) {
          socket.emit("ipa_student_group_delete_messages", data);
          socket.emit("ipa_student_group_update_latest_message", {
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
  finalCallback = () => {},
  chatType
) {
  if (socket && conversationId && userId && selectedMessages) {
    let data = {
      group_id: conversationId,
      deleteType: "for-everyone",
      deleteFor: userId,
      deleteMessageIds: selectedMessages.map((msg) => msg?._id),
    };
    try {
      if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
        const res = await api.patch(
          "/ipa-tutor-group-message/delete-messages-for-everyone",
          {
            messageIds: data.deleteMessageIds,
          }
        );
        if (res.data?.acknowledged) {
          socket.emit("ipa_tutor_group_delete_messages", data);
          socket.emit("ipa_tutor_group_update_latest_message", {
            conversation_id: conversationId,
            latestMessage: {
              ...selectedMessages[selectedMessages?.length - 1],
              isDeletedForEveryone: true,
            },
          });
        }
      } else {
        const res = await api.patch(
          "/ipa-student-group-message/delete-messages-for-everyone",
          {
            messageIds: data.deleteMessageIds,
          }
        );
        if (res.data?.acknowledged) {
          socket.emit("ipa_student_group_delete_messages", data);
          socket.emit("ipa_student_group_update_latest_message", {
            conversation_id: conversationId,
            latestMessage: {
              ...selectedMessages[selectedMessages?.length - 1],
              isDeletedForEveryone: true,
            },
          });
        }
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

const IPAStudentGroupChat = () => {
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
          "Error occured while fetching admin-admin-group conversations: ",
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
      socket.on("ipa_new_group_created", (newCreatedGroup) => {
        console.log(newCreatedGroup?.student_ipa, "user Id", user);
        let newCreatedGroupAdminParticipants =
          newCreatedGroup?.student_ipa?.adminParticipants?.map((item) => item);

        console.log(
          newCreatedGroupAdminParticipants,
          "newCreatedGroupAdminParticipants"
        );

        if (newCreatedGroupAdminParticipants?.includes(user?._id)) {
          // console.log("conversation ", allConversations)
          setAllConversations((prev) => [newCreatedGroup?.tutor_ipa, ...prev]);
          setAllConversations((prev) => [
            newCreatedGroup?.student_ipa,
            ...prev,
          ]);
          console.log("conversation ", allConversations);
        }
      });
      socket.on("student_ipa_group_new_admins_added", (group) => {
        if (!group) return;
        let isUserAdded = group?.adminParticipants?.find(
          (admin) => admin?._id === user?._id
        );
        if (isUserAdded) {
          setAllConversations((prev) => uniqBy([group, ...prev], "_id"));
        }
      });

      socket.on(
        "ipa_student_group_admin_got_deleted",
        ({ group_id, admin_id }) => {
          if (!group_id || !admin_id) return;
          if (admin_id === user?._id) {
            console.log(group_id, "group_id");
            const updatedConversations = allConversations.filter(
              (item) => item?._id !== group_id
            );
            setAllConversations(updatedConversations);
          }
        }
      );

      socket.on("student_ipa_group_new_students_added", (group) => {
        if (!group) return;
        let isUserAdded = group?.studentParticipants?.find(
          (student) => student?._id === user?._id
        );
        if (isUserAdded) {
          setAllConversations((prev) => uniqBy([group, ...prev], "_id"));
        }
      });

      socket.on(
        "ipa_student_group_student_got_deleted",
        ({ group_id, student_id }) => {
          if (!group_id || !student_id) return;
          if (student_id === user?._id) {
            const updatedConversations = allConversations.filter(
              (item) => item?._id !== group_id
            );
            setAllConversations(updatedConversations);
          }
        }
      );
    }
    return () => {
      if (socket) {
        socket.off("ipa_new_group_created");
        // socket.off("admin_admin_group_new_admins_added");
      }
    };
  }, [socket, user, allConversations]);

  function handleForwardMessage(message) {
    return allConversations;
    console.log(message);
  }

  useEffect(() => {
    if (socket) {
      socket.on("ipa_student_group_recieve_latest_message", async (data) => {
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

      socket.on("ipa_tutor_group_recieve_latest_message", async (data) => {
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

      socket.on("ipa_group_name_updated", ({ group_id, updatedGroupName }) => {
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
      });
      socket.on(
        "ipa_group_description_updated",
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
        socket.off("ipa_student_group_recieve_latest_message");
        socket.off("ipa_tutor_group_recieve_latest_message");
        // socket.off("admin_admin_group_name_updated");
        // socket.off("admin_admin_group_description_updated");
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

  const handleNavigate = useCallback((conversation) => {
    setSelectedConversation(conversation);
    navigate(`${conversation._id}`);
  }, []);

  const renderItem = ({ item: conversation, index, data }) => {
    return (
      <GroupChatListCard
        listUser={conversation}
        latestMessage={conversation?.latestMessage}
        onClick={() => handleNavigate(conversation)}
        activeUser={selectedConversation}
      />
    );
  };

  function keyExtractor({ item, index }) {
    return item?._id;
  }

  return (
    <div className={chatStyles.chatContainer}>
      <div className={chatStyles.chatSidebar}>
        <div className={chatStyles.header}>
          <h5>IPA Student Groups</h5>
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
              // onEndReached={handleOnEndReached}
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
          chatType: selectedConversation?.studentParticipants
            ? CHAT_TYPE.ipaStudentGroupChat
            : CHAT_TYPE.ipaTutorGroupChat,
          selectedConversation,
          setSelectedConversation,
          Message: IPAStudentGroupMessage,
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
          handleSocketOnStudentGotDeleted,
          handleSocketOnNewStudentsAdded,
          handleSendNotificationToGroupParticipants,
          handleForwardMessage,
          handleSendForwardMessage,
        }}
      />
      <div>
        {userSelectionModal && (
          <CreateIPAGroup closeModal={handleUserSelectionModal} />
        )}
      </div>
      <div></div>
    </div>
  );
};

IPAStudentGroupChat.propTypes = {
  user: PropTypes.object,
};

export default IPAStudentGroupChat;
