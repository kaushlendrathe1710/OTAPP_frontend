import api from "../../../../services/api";
import { toast } from "react-hot-toast";

async function getConversation(userData, setConversation, project) {
  if (project) {
    const { data } = await api.post(
      "/admin-student-conversations/single-Pconversation",
      {
        studentId: userData?._id,
        project: project,
      }
    );
    console.log(project);
    setConversation(data);
  } else {
    const { data } = await api.post(
      "/admin-student-conversations/single-conversation",
      {
        studentId: userData?._id,
      }
    );
    console.log(project, data);
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
  studentAdminRoom
) {
  setMsg(e.target.value);

  socket.emit("student_admin_typing_started", studentAdminRoom);

  if (typingTimeout) clearTimeout(typingTimeout);

  settypingTimeout(
    setTimeout(() => {
      socket.emit("student_admin_typing_stopped", studentAdminRoom);
    }, 1000)
  );
}

function socketListeners(
  socket,
  studentAdminRoom,
  userData,
  setStudentAdminRoom,
  setMessages,
  setTyping,
  conversation
) {
  if (socket) {
    // studentAdminRoom === undefined &&
    console.log(conversation?._id, studentAdminRoom);
    socket.emit("student_admin_room_join", conversation?._id);

    socket.on("student_admin_room_joined", (data) => {
      setStudentAdminRoom(data);
      // setAdminVideoId(studentAdminRoom);
    });

    socket.on("student_admin_recieve_message", (data) => {
      console.log(data);
      setMessages((prev) => [...prev, ...data]);
    });
    // socket.on("student_admin_recieve_message", (data) => {
    //     console.log(data);
    //     setMessages((prev) => [...prev, ...data]);
    // });
    socket.on("student_admin_typing_started_from_server", () => {
      setTyping(true);
    });
    socket.on("student_admin_typing_stopped_from_server", () => {
      setTyping(false);
    });
  }
}

function removeSocketListeners(socket) {
  if (socket) {
    socket.off("student_admin_room_joined");
    socket.off("student_admin_recieve_message");
    socket.off("student_admin_typing_started_from_server");
    socket.off("student_admin_typing_stopped_from_server");
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
  studentAdminRoom
) {
  let formData;
  console.log("send message");

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
        senderId: userData?._id,
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
      `/admin-student-message/reply-message?message_id=${reply._id}`,
      formData
    );
  } else {
    responseData = await api.post(
      "/admin-student-message/send-message",
      formData
    );
  }
  setMessages((prev) => [...prev, ...responseData.data]);
  // socket.emit("admin_student_video_join", studentAdminRoom);
  socket.emit("student_admin_send_message", {
    room_id: conversation?._id,
    data: responseData.data,
  });
}

async function getMessages(conversation, limitRef, setMessages) {
  let { data } = await api.get(
    `/admin-student-message/get-messages?conversationId=${
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
    `/admin-student-message/get-messages?conversationId=${conversation._id}&page=${pageRef.current}&limit=${limitRef.current}`
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
      `/admin-student-message/delete-message?conversation_id=${conversationId}&message_id=${messageId}`
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
