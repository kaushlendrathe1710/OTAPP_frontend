import api from "../../../../../services/api";
import { toast } from "react-hot-toast";

async function getConversation(userData, setConversation, project) {
  if (project) {
    const { data } = await api.post(
      "/admin-tutor-conversations/single-Pconversation",
      {
        tutorId: userData?._id,
        project: project,
      }
    );
    console.log(project);
    setConversation(data);
  } else {
    const { data } = await api.post(
      "/admin-tutor-conversations/single-conversation",
      {
        tutorId: userData?._id,
        project: project,
      }
    );
    console.log(data._id);
    setConversation(data);
  }
}

function handelInputChange(
  e,
  socket,
  setMsg,
  settypingTimeout,
  setTimeout,
  typingTimeout,
  tutorAdminRoom
) {
  setMsg(e.target.value);

  socket.emit("tutor_admin_typing_started", tutorAdminRoom);

  if (typingTimeout) clearTimeout(tutorAdminRoom);

  settypingTimeout(
    setTimeout(() => {
      socket.emit("tutor_admin_typing_stopped", tutorAdminRoom);
    }, 1000)
  );
}

function socketListeners(
  socket,
  tutorAdminRoom,
  userData,
  setTutorAdminRoom,
  setMessages,
  setTyping,
  conversation
) {
  if (socket) {
    // tutorAdminRoom === undefined &&
    socket.emit("admin_tutor_join_conversation", {
      conversation_id: conversation?._id,
      userData,
    });

    socket.on("admin_tutor_joined_conversation", (data) => {
      console.log(data);
      setTutorAdminRoom(conversation?._id);
    });

    socket.on("admin_tutor_recieve_message", (data) => {
      console.log("receive message", data);
      setMessages((prev) => [...prev, ...data.data]);
    });
    socket.on("tutor_admin_typing_started_from_server", () => {
      setTyping(true);
    });
    socket.on("tutor_admin_typing_stopped_from_server", () => {
      setTyping(false);
    });
  }
}

function removeSocketListeners(socket, userData) {
  if (socket) {
    socket.off("tutor_admin_room_joined");
    socket.off("tutor_admin_recieve_message");
    socket.off("tutor_admin_typing_started_from_server");
    socket.off("tutor_admin_typing_stopped_from_server");
  }
}

async function sendMessage(
  attachmentFiles,
  userData,
  conversation,
  setMsg,
  msg,
  reply,
  setReply,
  setMessages,
  socket,
  tutorAdminRoom
) {
  let formData;

  if (attachmentFiles.length) {
    const data = {
      messageType: "File",
      senderId: userData._id,
      conversationId: conversation._id,
      fileText: JSON.stringify(
        attachmentFiles.map((item) => {
          return {
            textContent: item.caption,
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
  } else {
    let text = msg;
    setMsg("");
    if (!text) {
      alert("Message cant be empty !!");
    } else {
      formData = {
        messageType: "Text",
        senderId: userData._id,
        conversationId: conversation?._id,
        content: {
          textContent: text,
        },
      };
    }
  }

  let responseData;

  if (reply) {
    setReply();
    responseData = await api.post(
      `/admin-tutor-message/reply-message?message_id=${reply._id}`,
      formData
    );
  } else {
    responseData = await api.post(
      "/admin-tutor-message/send-message",
      formData
    );
  }
  setMessages((prev) => [...prev, ...responseData.data]);
  // console.log(responseData.data[0].conversation);
  socket.emit("admin_tutor_send_message", { data: responseData.data });
}

async function getMessages(conversation, limitRef, setMessages) {
  let { data } = await api.get(
    `/admin-tutor-message/get-messages?conversationId=${
      conversation._id
    }&page=${1}&limit=${limitRef.current}`
  );
  data = data.reverse();

  setMessages(data);
}

async function getMessagesOnScroll(
  pageRef,
  limitRef,
  conversation,
  setMessages,
  setIsLastChat
) {
  let { data } = await api.get(
    `/admin-tutor-message/get-messages?conversationId=${conversation._id}&page=${pageRef.current}&limit=${limitRef.current}`
  );
  data = data.reverse();
  if (data.length === 0) setIsLastChat(true);
  setMessages((prev) => [...data, ...prev]);
}

const handleDeleteMsg = async (
  conversationId,
  messageId,
  messages,
  setMessages
) => {
  try {
    const res = await api.delete(
      `/admin-tutor-message/delete-message?conversation_id=${conversationId}&message_id=${messageId}`
    );
    if (res.data.message) {
      let mapped = messages.map((msg) => {
        return msg._id === messageId ? { ...msg, isDeleted: true } : { ...msg };
      });
      setMessages(mapped);
      toast.success("Message deleted successfully.", {
        position: "top-right",
      });
    }
  } catch (e) {
    toast.error("Message is not deleted.", {
      position: "top-right",
    });
  }
};

export {
  getConversation,
  handelInputChange,
  socketListeners,
  removeSocketListeners,
  sendMessage,
  getMessages,
  getMessagesOnScroll,
  handleDeleteMsg,
};
