import React, { useContext, useEffect, useState } from "react";
import SingleUserChatMessage from "../message/SingleUserChatMessage";
import { CHAT_TYPE } from "../../../constants/helpers";

import {
  AdminStudentChat_getSingleConversation,
  AdminStudentChat_fetchMessages,
  AdminStudentChat_fetchUnreadMessages,
  AdminStudentChat_handleAddReactionToMessage,
  AdminStudentChat_handleDeleteMessagesForEveryone,
  AdminStudentChat_handleDeleteMessagesForMe,
  AdminStudentChat_handleMessageRead,
  AdminStudentChat_handleSendMessage,
  AdminStudentChat_handleSendNotificationToGroupParticipants,
  AdminStudentChat_handleSocketEmitUserJoinConversation,
  AdminStudentChat_handleSocketEmitUserLeaveConversation,
  AdminStudentChat_handleSocketEmitUserStartTyping,
  AdminStudentChat_handleSocketEmitUserStoppedTyping,
  AdminStudentChat_handleSocketOnDeleteMessages,
  AdminStudentChat_handleSocketOnReadMessages,
  AdminStudentChat_handleSocketOnRecieveMessages,
  AdminStudentChat_handleSocketOnUserReactedMessage,
  AdminStudentChat_handleSocketOnUserStartTypingFromServer,
  AdminStudentChat_handleSocketOnUserStoppedTypingFromServer,
} from "./AdminStudentChat";
import userContext from "../../context/userContext";
import chatStyles from "../../styles/chat.module.scss";
import api from "../../services/api";
import { Outlet, useNavigate } from "react-router-dom";

const StudentChatWithAdmin = () => {
  const navigate = useNavigate();
  const { userData: user } = useContext(userContext);

  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    if (user) {
      (async function () {
        const { data } = await api.get(
          `/admin-student-conversation/get-conversation-by-studentId?studentId=${user?._id}`
        );
        setSelectedConversation(data);
        navigate(`${data?._id}`);
        console.log("conversation: ", data);
      })();
    }
  }, [user]);

  return (
    <div className={chatStyles.chatContainer}>
      <Outlet
        context={{
          chatType: CHAT_TYPE.adminStudentSingleChat,
          selectedConversation,
          setSelectedConversation,
          Message: SingleUserChatMessage,
          getSingleConversation: AdminStudentChat_getSingleConversation,
          fetchMessages: AdminStudentChat_fetchMessages,
          fetchUnreadMessages: AdminStudentChat_fetchUnreadMessages,
          handleSendMessage: AdminStudentChat_handleSendMessage,
          handleMessageRead: AdminStudentChat_handleMessageRead,
          handleAddReactionToMessage:
            AdminStudentChat_handleAddReactionToMessage,
          handleDeleteMessagesForMe: AdminStudentChat_handleDeleteMessagesForMe,
          handleDeleteMessagesForEveryone:
            AdminStudentChat_handleDeleteMessagesForEveryone,
          handleSocketEmitUserJoinConversation:
            AdminStudentChat_handleSocketEmitUserJoinConversation,
          handleSocketEmitUserLeaveConversation:
            AdminStudentChat_handleSocketEmitUserLeaveConversation,
          handleSocketEmitUserStartTyping:
            AdminStudentChat_handleSocketEmitUserStartTyping,
          handleSocketEmitUserStoppedTyping:
            AdminStudentChat_handleSocketEmitUserStoppedTyping,
          handleSocketOnUserStartTypingFromServer:
            AdminStudentChat_handleSocketOnUserStartTypingFromServer,
          handleSocketOnUserStoppedTypingFromServer:
            AdminStudentChat_handleSocketOnUserStoppedTypingFromServer,
          handleSocketOnRecieveMessages:
            AdminStudentChat_handleSocketOnRecieveMessages,
          handleSocketOnReadMessages:
            AdminStudentChat_handleSocketOnReadMessages,
          handleSocketOnUserReactedMessage:
            AdminStudentChat_handleSocketOnUserReactedMessage,
          handleSocketOnDeleteMessages:
            AdminStudentChat_handleSocketOnDeleteMessages,
          handleSendNotificationToGroupParticipants:
            AdminStudentChat_handleSendNotificationToGroupParticipants,
        }}
      />
    </div>
  );
};

export default StudentChatWithAdmin;
