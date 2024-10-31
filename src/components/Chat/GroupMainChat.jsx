import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { uniqBy } from "lodash";
import { IoIosArrowRoundDown, IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { HiArrowDown } from "react-icons/hi2";
import toast from "react-hot-toast";
import {
  AiOutlineAudio,
  AiOutlineDelete,
  AiOutlinePause,
} from "react-icons/ai";
import groupUsersImg from "../../assets/img/group-users.png";
import { MessageContextMenuModalContext } from "../../context/MessageContextMenuModalContext";
import { getMessageHeight } from "../../lib/getMessageHeight";
import { getMessageOffset } from "../../lib/getMessageOffset";
import EmptyChatMessagesList from "./EmptyChatMessagesList";
import api, { getAccessToken } from "../../services/api";

import userContext from "../../context/userContext";
import DeletedMessage, {
  DELETED_MESSAGE_HEIGHT,
} from "../message/DeletedMessage";
import { UNREAD_MESSAGE_BAR_HEIGHT } from "../message/UnreadMessageBar";
import { ChatMediaTypeSelectModal } from ".";
import usePosition from "../../hooks/usePosition";
import { ChatSendingDataPreviewModalContext } from "../../context/ChatSendingDataPreviewModalContext";
import { ActivityLoader } from "../Loaders/ActivityLoader";
import Waveform from "../audio/Waveform";
import {
  AUDIO_RECORDING_TYPE,
  CHAT_TYPE,
  MESSAGE_TYPE,
} from "../../../constants/helpers";
import ReplyMessage from "../message/ReplyMessage";
import EditGroupModal from "./EditGroupDetailModal";
import chatStyles from "../../styles/chat.module.scss";
import ForwardModal from "./ForwardModal";

import { MESSAGE_HEADER_VIEW_HEIGHT } from "../message/MessageHeaderView";
import EditAdminTutorGroupDetailModal from "../createGroupModals/EditAdminTutorGroupDetailModal";
import EditAdminStudentGroupDetailModal from "../createGroupModals/EditAdminStudentGroupDetailModal";
import EditIPAStudentGroupDetailModal from "../createGroupModals/EditIPAStudentGroupDetailModal";
import EditIPATutorGroupDetailModal from "../createGroupModals/EditIPATutorGroupDetailModal";

import { createChatMessageNotificationData } from "../../lib/notification";
import sendNotificationsWithExpo from "../../lib/sendNotificationsWithExpo";
import { CHAT_SCREENS } from "../../../constants/chat";
import { USER_TYPES } from "../../../constants/user";
import { NOTIFICATION_TYPES } from "../../../constants/notification";

const GroupMainChat = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const {
    chatType,
    selectedConversation,
    setSelectedConversation,
    Message,
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
    handleSocketOnUpdateGroupName,
    handleSocketOnUpdateGroupDescription,
    handleSocketOnNewAdminsAdded,
    handleSocketOnAdminGotDeleted,
    handleSocketOnGroupGotDeleted,
    handleSocketOnTutorGotDeleted,
    handleSocketOnStudentGotDeleted,
    handleSocketOnNewTutorsAdded,
    handleSocketOnNewStudentsAdded,
    handleSendNotificationToGroupParticipants,
    handleForwardMessage,
    handleSendForwardMessage,
  } = useOutletContext();

  const { userData: user, socket } = useContext(userContext);
  const { hanldeCloseMessageContextMenuModal } = useContext(
    MessageContextMenuModalContext
  );
  const { handleUpdateModalPosition } = useContext(
    ChatSendingDataPreviewModalContext
  );

  const variableSizeListRef = useRef();
  const variableSizeListOuterRef = useRef();
  const pageRef = useRef(1);
  const limitRef = useRef(25);
  const textInputRef = useRef();
  const typingTimeoutRef = useRef(null);
  const attachmentButtonRef = useRef(null);
  const mediaRecorder = useRef(null);

  const [loading, setLoading] = useState({
    isMessageSendLoading: false,
    isMessagesLoadingOnMount: false,
    isMoreMessagesFetching: false,
  });
  const [conversation, setConversation] = useState(
    selectedConversation || null
  );
  const [messages, setMessages] = useState([]);
  const [inputTextMessage, setInputTextMessage] = useState("");
  const [isLastChat, setIsLastChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
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
  const [userSelectionModal, setUserSelectionModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [checkboxes, setCheckBoxes] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);

  const [users, setUsers] = useState([]);

  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [replyMessage, setReplyMessage] = useState(null);
  const [unReadOnGoingMessages, setUnReadOnGoingMessages] = useState([]);

  const [forwardModal, setforwardModal] = useState(false);
  const [forwardMessage, setforwardMessage] = useState([]);

  const headerUserName = useMemo(() => {
    return conversation?.groupName;
  }, [conversation]);

  const groupParticipants = useMemo(() => {
    let participants = [];
    if (!conversation) {
      return participants;
    }
    if (chatType === CHAT_TYPE.adminAdminGroupChat) {
      participants = conversation?.adminParticipants || [];
    } else if (chatType === CHAT_TYPE.adminTutorGroupChat) {
      participants = [
        ...conversation?.adminParticipants,
        ...(conversation?.tutorParticipants || []),
      ];
    } else if (chatType === CHAT_TYPE.adminStudentGroupChat) {
      participants = [
        ...conversation?.adminParticipants,
        ...(conversation?.studentParticipants || []),
      ];
    } else if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      participants = [
        ...conversation?.adminParticipants,
        ...(conversation?.tutorParticipants || []),
      ];
    } else if (chatType === CHAT_TYPE.ipaStudentGroupChat) {
      participants = [
        ...conversation?.adminParticipants,
        ...(conversation?.studentParticipants || []),
      ];
    }
    return participants;
  }, [conversation]);

  const userExpoPushTokens = useMemo(() => {
    if (groupParticipants?.length === 0 || !user?._id) return [];
    let tokens = [];
    groupParticipants.forEach((participant) => {
      if (participant._id !== user?._id && participant.expoPushToken) {
        tokens.push(participant.expoPushToken);
      }
    });
    return tokens;
  }, [user?._id, groupParticipants]);

  const screenData = useMemo(() => {
    if (chatType === CHAT_TYPE.adminAdminGroupChat) {
      return {
        chatScreen: CHAT_SCREENS.adminAdminGroupChat.chatScreen,
        listScreen: CHAT_SCREENS.adminAdminGroupChat.listScreen,
        infoScreen: CHAT_SCREENS.adminAdminGroupChat.infoScreen,
        isSingleChat: CHAT_SCREENS.adminAdminGroupChat.isSingleChat,
      };
    } else if (chatType === CHAT_TYPE.adminTutorGroupChat) {
      return {
        chatScreen: CHAT_SCREENS.adminTutorGroupChat.chatScreen,
        listScreen: CHAT_SCREENS.adminTutorGroupChat.listScreen,
        infoScreen: CHAT_SCREENS.adminTutorGroupChat.infoScreen,
        isSingleChat: CHAT_SCREENS.adminTutorGroupChat.isSingleChat,
      };
    } else if (chatType === CHAT_TYPE.adminStudentGroupChat) {
      return {
        chatScreen: CHAT_SCREENS.adminStudentGroupChat.chatScreen,
        listScreen: CHAT_SCREENS.adminStudentGroupChat.listScreen,
        infoScreen: CHAT_SCREENS.adminStudentGroupChat.infoScreen,
        isSingleChat: CHAT_SCREENS.adminStudentGroupChat.isSingleChat,
      };
    } else if (chatType === CHAT_TYPE.ipaStudentGroupChat) {
      return {
        chatScreen: CHAT_SCREENS.ipaStudentGroupChat.chatScreen,
        listScreen:
          user?.userType === USER_TYPES.admin ||
          user?.userType === USER_TYPES.superAdmin
            ? CHAT_SCREENS.ipaGroups.listScreen
            : CHAT_SCREENS.ipaStudentGroupChat.listScreen,
        infoScreen: CHAT_SCREENS.ipaStudentGroupChat.infoScreen,
        isSingleChat: CHAT_SCREENS.ipaStudentGroupChat.isSingleChat,
      };
    } else if (chatType === CHAT_TYPE.ipaTutorGroupChat) {
      return {
        chatScreen: CHAT_SCREENS.ipaTutorGroupChat.chatScreen,
        listScreen:
          user?.userType === USER_TYPES.admin ||
          user?.userType === USER_TYPES.superAdmin
            ? CHAT_SCREENS.ipaGroups.listScreen
            : CHAT_SCREENS.ipaTutorGroupChat.listScreen,
        infoScreen: CHAT_SCREENS.ipaTutorGroupChat.infoScreen,
        isSingleChat: CHAT_SCREENS.ipaTutorGroupChat.isSingleChat,
      };
    }
  }, [chatType, user?.userType]);

  useEffect(() => {
    handleUpdateModalPosition({
      top: attachmentButtonTop,
      left: attachmentButtonLeft,
    });
  }, [attachmentButtonTop, attachmentButtonLeft]);

  useEffect(() => {
    textInputRef.current?.focus();
    let canFetchNextMessagesTimeout;
    (async function () {
      setLoading((prev) => ({ ...prev, isMessagesLoadingOnMount: true }));
      if (!conversationId || !user?._id) {
        return;
      }
      try {
        pageRef.current = 1;
        setIsLastChat(false);
        setMessages([]);
        setOneTimeSkipMessagesCount(0);
        setCanFetchNextMessages(false);
        setUnreadMessagesCount(0);
        setFirstUnreadMessage(null);
        setUnReadOnGoingMessages([]);
        const conversation = await getSingleConversation(
          conversationId,
          user?.userType,
          chatType
        );
        setConversation(conversation);
        setSelectedConversation(conversation);
        if (conversation && user) {
          let { unReadMessages, unReadMessagesCount: unreadMessagesCount } =
            await fetchUnreadMessages(conversation?._id, user?._id, chatType);
          console.log("Fetched Unread Messages", unReadMessages);
          if (unreadMessagesCount > 0) {
            setFirstUnreadMessage(unReadMessages[unreadMessagesCount - 1]);
            setUnreadMessagesCount(unreadMessagesCount);
            if (unreadMessagesCount < limitRef.current) {
              // then fetch more messages to reach the limit
              console.log(chatType, "in group main chat");
              const { data: moreMessages } = await fetchMessages(
                conversation?._id,
                pageRef.current,
                limitRef.current - unreadMessagesCount,
                unreadMessagesCount,
                chatType
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
              setInitialScrollOffset(0);
              setMessages(unReadMessages);
            }
          } else {
            const { data } = await fetchMessages(
              conversation?._id,
              pageRef.current,
              limitRef.current,
              0,
              chatType
            );
            setInitialScrollOffset(getMessageOffset(data, data.length - 1));
            setMessages(data);
            console.log("messages: ", data);
          }
        }
      } catch (err) {
        console.log(
          "An error occured while fetching single conversation: ",
          err
        );
      } finally {
        setLoading((prev) => ({ ...prev, isMessagesLoadingOnMount: false }));
        canFetchNextMessagesTimeout = setTimeout(
          () => setCanFetchNextMessages(true),
          2000
        );
      }
    })();
    return () => clearTimeout(canFetchNextMessagesTimeout);
  }, [conversationId, user]);

  useEffect(() => {
    if (socket && user && conversation) {
      handleSocketEmitUserJoinConversation(
        user,
        socket,
        conversation,
        chatType
      );
    }
    return () => {
      if (socket && user && conversation) {
        handleSocketEmitUserLeaveConversation(
          user,
          socket,
          conversation,
          chatType
        );
      }
      setCheckBoxes(false);
    };
  }, [socket, user, conversation]);

  useEffect(() => {
    let socketOffRecieveMessages = () => {};
    let socketOffGroupGotDeleted = () => {};
    if (socket && conversation) {
      socketOffRecieveMessages = handleSocketOnRecieveMessages(
        socket,
        conversation?._id,
        setMessages,
        (newUnreadOnGoingMessages) => {
          setUnReadOnGoingMessages((prev) => [
            ...prev,
            ...newUnreadOnGoingMessages,
          ]);
        },
        chatType
      );

      socketOffGroupGotDeleted = handleSocketOnGroupGotDeleted(
        socket,
        conversation,
        () => {
          hanldeCloseMessageContextMenuModal();
          let url = window.location.href;
          if (url.includes("admin-admin")) {
            navigate(`/${user?.userType}/admin-admin-group-chat`);
          } else if (url.includes("admin-tutor")) {
            navigate(`/${user?.userType}/admin-tutor-group-chat`);
          } else if (url.includes("admin-student")) {
            navigate(`/${user?.userType}/admin-student-group-chat`);
          } else if (url.includes("ipa-student")) {
            navigate(`/${user?.userType}/ipa-group-chat`);
          }
        }
      );
    }
    return () => {
      socketOffRecieveMessages();
    };
  }, [socket, conversation]);

  useEffect(() => {
    let socketOffReadMessages = () => {};
    let socketOffDeleteMessages = () => {};
    let socketOffUpdateGroupName = () => {};
    let socketOffUpdateGroupDescription = () => {};
    let socketOffNewAdminsAdded = () => {};
    let socketOffNewTutorsAdded = () => {};
    let socketOffNewStudentsAdded = () => {};
    if (socket) {
      if (user?._id) {
        socketOffReadMessages = handleSocketOnReadMessages(
          socket,
          user?._id,
          setMessages,
          chatType
        );
      }
      socketOffDeleteMessages = handleSocketOnDeleteMessages(
        socket,
        setMessages,
        chatType
      );
      socketOffUpdateGroupName = handleSocketOnUpdateGroupName(
        socket,
        setConversation,
        chatType
      );
      socketOffUpdateGroupDescription = handleSocketOnUpdateGroupDescription(
        socket,
        setConversation,
        chatType
      );
      socketOffNewAdminsAdded = handleSocketOnNewAdminsAdded(
        socket,
        setConversation,
        chatType
      );
      if (handleSocketOnNewTutorsAdded) {
        socketOffNewTutorsAdded = handleSocketOnNewTutorsAdded(
          socket,
          setConversation,
          chatType
        );
      }
      if (handleSocketOnNewStudentsAdded) {
        socketOffNewStudentsAdded = handleSocketOnNewStudentsAdded(
          socket,
          setConversation,
          chatType
        );
      }
    }

    return () => {
      socketOffReadMessages();
      socketOffDeleteMessages();
      // socketOffUpdateGroupName();
      // socketOffUpdateGroupDescription();
    };
  }, [socket]);

  useEffect(() => {
    let socketOffAdminGotDeleted = () => {};
    if (socket && conversation && user) {
      socketOffAdminGotDeleted = handleSocketOnAdminGotDeleted(
        socket,
        user?._id,
        conversation,
        setConversation,
        () => {
          hanldeCloseMessageContextMenuModal();
          let url = window.location.href;
          if (url.includes("admin-admin")) {
            navigate(`/${user?.userType}/admin-admin-group-chat`);
          } else if (url.includes("admin-tutor")) {
            navigate(`/${user?.userType}/admin-tutor-group-chat`);
          } else if (url.includes("admin-student")) {
            navigate(`/${user?.userType}/admin-student-group-chat`);
          } else if (url.includes("ipa-student")) {
            navigate(`/${user?.userType}/ipa-group-chat`);
          }
        },
        chatType
      );
    }
  }, [socket, conversation, user]);

  useEffect(() => {
    let socketOffTutorGotDeleted = () => {};
    if (socket && conversation && user && handleSocketOnTutorGotDeleted) {
      socketOffTutorGotDeleted = handleSocketOnTutorGotDeleted(
        socket,
        user?._id,
        conversation,
        setConversation,
        () => {
          hanldeCloseMessageContextMenuModal();
          navigate(`/${user?.userType}/admin-tutor-group-chat`);
        },
        chatType
      );
    }
  }, [socket, conversation, user]);

  useEffect(() => {
    let socketOffStudentGotDeleted = () => {};
    if (socket && conversation && user && handleSocketOnStudentGotDeleted) {
      socketOffStudentGotDeleted = handleSocketOnStudentGotDeleted(
        socket,
        user?._id,
        conversation,
        setConversation,
        () => {
          hanldeCloseMessageContextMenuModal();
          let url = window.location.href;
          if (url.includes("admin-student")) {
            navigate(`/${user?.userType}/admin-student-group-chat`);
          } else if (url.includes("ipa-student")) {
            navigate(`/${user?.userType}/ipa-group-chat`);
          }
        },
        chatType
      );
    }
  }, [socket, conversation, user]);

  useEffect(() => {
    let socketOffUserReactedMessage = () => {};
    if (socket) {
      socketOffUserReactedMessage = handleSocketOnUserReactedMessage(
        socket,
        messages,
        setMessages,
        chatType
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
        handleSocketOnUserStartTypingFromServer(
          socket,
          typingUsers,
          setTypingUsers,
          chatType
        );
      socketOffUserStoppedTypingFromServer =
        handleSocketOnUserStoppedTypingFromServer(
          socket,
          setTypingUsers,
          chatType
        );
    }

    return () => {
      socketOffUserStartTypingFromServer();
      socketOffUserStoppedTypingFromServer();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [typingUsers, socket]);

  useEffect(() => {
    if (user && socket && conversation) {
      if (isTyping) {
        console.log("user typing socket emit")
        handleSocketEmitUserStartTyping(user, socket, conversation, chatType);
      } else {
        handleSocketEmitUserStoppedTyping(user, socket, conversation, chatType);
      }
    }
    return () => {
      if (socket && user) {
        handleSocketEmitUserStoppedTyping(user, socket, conversation, chatType);
      }
    };
  }, [isTyping, conversation, user]);

  const handleMessageTextChange = useCallback(
    (text) => {
      setInputTextMessage(text);
      setIsTyping(text !== "");
      console.log("typing user: ", text !== "")

      clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        console.log("user typing stopped")
        handleSocketEmitUserStoppedTyping(user, socket, conversation, chatType);
      }, 1000);
    },
    [socket, user, conversation]
  );

  const handleSendMessageWrapper = useCallback(async () => {
    if (!inputTextMessage) {
      return;
    }
    let text = inputTextMessage;
    setInputTextMessage("");
    setLoading((prev) => ({ ...prev, isMessageSendLoading: true }));
    try {
      const newMessages = await handleSendMessage(
        replyMessage,
        text,
        setMessages,
        user,
        conversation,
        socket,
        MESSAGE_TYPE.text,
        chatType
      );
      setReplyMessage(null);
      variableSizeListRef.current?.scrollToItem(messages?.length, "end");
      if (newMessages.length > 0) {
        let to = groupParticipants.map((participant) => participant._id);
        let title = conversation?.groupName;
        let desc = "You have a new message.";
        let data = {
          conversation_id: conversation?._id,
          chatType: chatType,
          messages: newMessages,
        };
        let notificationData = createChatMessageNotificationData(
          to,
          title,
          desc,
          data
        );
        handleSendNotificationToGroupParticipants(socket, notificationData);
        sendNotificationsWithExpo({
          to: userExpoPushTokens,
          title: conversation?.groupName,
          body: newMessages[0]?.textContent,
          data: {
            type: NOTIFICATION_TYPES.chat,
            screenData: screenData,
            chatData: {
              conversation_id: conversation?._id,
              chatType: chatType,
            },
          },
        });
      }
    } catch (err) {
      console.log("An error occured while sending message: ", err);
    } finally {
      setLoading((prev) => ({ ...prev, isMessageSendLoading: false }));
    }
  }, [
    inputTextMessage,
    user,
    conversation,
    socket,
    groupParticipants,
    userExpoPushTokens,
    screenData,
  ]);

  const handleEnterKeyPress = async (e) => {
    if (e.keyCode === 13) {
      await handleSendMessageWrapper();
    }
  };

  const handleMediaSendMessage = async (content) => {
    setLoading((prev) => ({ ...prev, isMessageSendLoading: true }));
    try {
      const newMessages = await handleSendMessage(
        replyMessage,
        content,
        setMessages,
        user,
        conversation,
        socket,
        MESSAGE_TYPE.file,
        chatType
      );
      setReplyMessage(null);
      variableSizeListRef.current?.scrollToItem(messages?.length, "end");
      if (newMessages.length > 0) {
        let to = groupParticipants.map((participant) => participant._id);
        let title = conversation?.groupName;
        let desc = "You have a new message.";
        let data = {
          conversation_id: conversation?._id,
          chatType: chatType,
          messages: newMessages,
        };
        let notificationData = createChatMessageNotificationData(
          to,
          title,
          desc,
          data
        );
        handleSendNotificationToGroupParticipants(socket, notificationData);
        await sendNotificationsWithExpo({
          to: userExpoPushTokens,
          title: conversation?.groupName,
          body: `📁 File message ${
            newMessages[0]?.fileContent?.textContent || ""
          }`,
          data: {
            type: NOTIFICATION_TYPES.chat,
            screenData: screenData,
            chatData: {
              conversation_id: conversation?._id,
              chatType: chatType,
            },
          },
        });
      }
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
      const newMessages = await handleSendMessage(
        replyMessage,
        content,
        setMessages,
        user,
        conversation,
        socket,
        MESSAGE_TYPE.voice,
        chatType
      );
      handleDiscardRecording();
      setReplyMessage(null);
      variableSizeListRef.current?.scrollToItem(messages?.length, "end");
      if (newMessages.length > 0) {
        let to = groupParticipants.map((participant) => participant._id);
        let title = conversation?.groupName;
        let desc = "You have a new message.";
        let data = {
          conversation_id: conversation?._id,
          chatType: chatType,
          messages: newMessages,
        };
        let notificationData = createChatMessageNotificationData(
          to,
          title,
          desc,
          data
        );
        handleSendNotificationToGroupParticipants(socket, notificationData);
        await sendNotificationsWithExpo({
          to: userExpoPushTokens,
          title: conversation?.groupName,
          body: `🎤 Voice message`,
          data: {
            type: NOTIFICATION_TYPES.chat,
            screenData: screenData,
            chatData: {
              conversation_id: conversation?._id,
              chatType: chatType,
            },
          },
        });
      }
    } catch (err) {
      console.log("An error occured while sending voice message: ", err);
    } finally {
      setLoading((prev) => ({ ...prev, isMessageSendLoading: false }));
    }
  };

  const handleCheckboxes = useCallback(() => {
    hanldeCloseMessageContextMenuModal();
    setCheckBoxes(true);
  });

  const handleCloseForward = useCallback(() => {
    setSelectedMessages([]);
    console.log(selectedMessages);
    setCheckBoxes(false);
  }, []);

  const handleForwardMessageModal = useCallback((message) => {
    setSelectedMessages(
      selectedMessages.filter((msg) => msg.selected === true)
    );

    console.log(selectedMessages);
    selectedMessages.map((msg) => {
      if (msg.selected === true) {
        console.log(msg);
      }
    });

    setforwardModal(true);
    let users = handleForwardMessage(message);
    setUsers(users);

    setforwardMessage(selectedMessages);
    setSelectedMessages([]);
    // // setUsers(conversation?.adminParticipants);
    setCheckBoxes(false);
    // hanldeCloseMessageContextMenuModal();
  });

  const handleCancelForwardModal = () => {
    setforwardModal(false);
  };

  const handleReplyMessage = useCallback((message) => {
    setReplyMessage(message);
    textInputRef.current?.focus();
    hanldeCloseMessageContextMenuModal();
  }, []);
  const handleCopyMessage = useCallback(async (textContent) => {
    if (!textContent) {
      return new Error("Text content is empty");
    }
    await navigator.clipboard.writeText(textContent);
    hanldeCloseMessageContextMenuModal();
  }, []);

  const handleListOnScroll = async (e) => {
    const { scrollDirection, scrollOffset } = e;
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
          oneTimeSkipMessagesCount,
          chatType
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

  const handleUserSelectionModal = () => {
    setUsers(conversation?.adminParticipants);
    setUserSelectionModal(!userSelectionModal);
  };
  const handleGroupUpdateModal = async () => {
    // setSelectedUsers([]);
    const res = await api.get(`/admin/get-all-admin/${1}`);
    // console.log(res.data);
    setUsers(res.data);
    setIsUpdate(true);
    // console.log(conversation);
    // setUsers(conversation?.adminParticipants);
    setUserSelectionModal(!userSelectionModal);
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
  const handleSave = async (e) => {
    // console.log(selectedUsers);
    let data = {
      groupName: e.groupName,
      groupDescription: e.groupDescription,
      adminParticipants: e.adminParticipants,
      createdBy: conversation.createdBy._id,
    };

    const res = await api.put(
      `/admin-admin-group-conversation/update/`,
      { ...data, group_id: conversation._id },
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    toast.success("Group Edit Successfully", {
      duration: 4000,
      position: "top-center",
      style: { border: "2px solid var(--success-color)" },
    });
    console.log(res.data);
    setUserSelectionModal(false);

    setConversation(res.data);
    // Handle saving selected users here
  };
  const handleUserSelect = (event) => {
    console.log(event);
    // const userId = event.target.value;
    if (!event.checked) {
      event.checked = true;
      setSelectedUsers([...selectedUsers, event]);
    } else {
      // console.log(selectedUsers.filter((user) => console.log(user.id)));
      event.checked = false;
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser !== event)
      );
      // setSelectedUsers(selectedUsers.filter((user) => user.id !== event.id));
    }
  };

  const handleScrollToBottom = useCallback(() => {
    variableSizeListRef.current?.scrollToItem(messages.length - 1);
  }, [messages]);

  const handleRemoveReadMessageFromUnreadOnGoingMessages = useCallback(
    ({ message, message_read_user }) => {
      console.log(
        "message_read_user: ",
        message_read_user,
        "CHAT TYPE: ",
        chatType,
        "message: ",
        message
      );
      let readUserId =
        chatType === CHAT_TYPE.adminAdminGroupChat
          ? message_read_user?.readBy?._id
          : message_read_user?.readBy;
      if (readUserId === user?._id) {
        setUnReadOnGoingMessages((prev) =>
          prev.filter(
            (unReadOnGoingMsg) => unReadOnGoingMsg?._id !== message?.message_id
          )
        );
      }
    },
    [user]
  );

  const Row = memo(({ index: i, style, data: arr }) => {
    let message = arr[i];
    let isMessageDeletedForMe = message?.deletedFor?.includes(user?._id)
      ? true
      : false;
    let isMessageDeletedForEveryone = message?.isDeletedForEveryone;
    if (isMessageDeletedForEveryone || isMessageDeletedForMe) {
      return (
        <DeletedMessage
          chatType={chatType}
          message={message}
          ref={variableSizeListOuterRef}
          unreadMessagesCount={unreadMessagesCount}
          handleMessageRead={handleMessageRead}
          handleMessageReadFinalCallback={
            handleRemoveReadMessageFromUnreadOnGoingMessages
          }
          unreadMessage={firstUnreadMessage}
          previousMessageSender={i === 0 ? "" : arr[i - 1]?.sender}
          userId={user?._id}
          style={{
            ...style,
          }}
        />
      );
    }
    return (
      <Message
        key={i}
        chatType={chatType}
        group={conversation}
        unreadMessagesCount={unreadMessagesCount}
        unreadMessage={firstUnreadMessage}
        message={message}
        previousMessageSender={i === 0 ? "" : arr[i - 1]?.sender}
        handleForwardMessage={handleCheckboxes}
        handleForwardMessageModal={handleForwardMessageModal}
        handleReplyMessage={handleReplyMessage}
        handleCopyMessage={handleCopyMessage}
        selectedMessages={selectedMessages}
        handleMessageRead={handleMessageRead}
        handleMessageReadFinalCallback={
          handleRemoveReadMessageFromUnreadOnGoingMessages
        }
        handleAddReactionToMessage={handleAddReactionToMessage}
        handleDeleteMessagesForMe={handleDeleteMessagesForMe}
        handleDeleteMessagesForEveryone={handleDeleteMessagesForEveryone}
        forwardModal={checkboxes}
        style={{
          ...style,
        }}
        ref={variableSizeListOuterRef}
      />
    );
  }, areEqual);

  const itemSize = (index) => {
    let message = [...messages].reverse()[index];
    let isMessageDeletedForMe = message?.deletedFor?.includes(user?._id)
      ? true
      : false;
    let isMessageDeletedForEveryone = message?.isDeletedForEveryone
      ? true
      : false;
    let additionalHeight =
      message?._id === firstUnreadMessage?._id ? UNREAD_MESSAGE_BAR_HEIGHT : 0;
    return isMessageDeletedForEveryone || isMessageDeletedForMe
      ? DELETED_MESSAGE_HEIGHT + additionalHeight
      : getMessageHeight(message, 50) +
          additionalHeight +
          MESSAGE_HEADER_VIEW_HEIGHT;
  };

  return (
    <div className={chatStyles.chatDetailContainer}>
      <div className={chatStyles.header}>
        <div className={chatStyles.avatar}>
          <img src={groupUsersImg} alt="user image" />
        </div>
        <div className={chatStyles.metaInfoWrapper}>
          <h5 style={{ cursor: "pointer" }} onClick={handleGroupUpdateModal}>
            {conversation?.groupName || headerUserName}
          </h5>
          {typingUsers.length > 0 && <p>Typing...</p>}
        </div>
      </div>
      <div className={chatStyles.chatMessagesContainer}>
        {/* <div className={chatStyles.chatMessagesList}> */}
        {messages.length !== 0 ? (
          <AutoSizer>
            {({ height, width }) => {
              return (
                // <div className={chatStyles.chatMessagesList}>
                <VariableSizeList
                  className={chatStyles.variableSizeList}
                  outerRef={variableSizeListOuterRef}
                  ref={variableSizeListRef}
                  height={height}
                  itemCount={messages.length}
                  width={width}
                  overscanCount={10}
                  initialScrollOffset={Math.max(
                    0,
                    initialScrollOffset - height
                  )}
                  itemSize={itemSize}
                  itemData={[...messages].reverse()}
                  style={{
                    maxWidth: "960px",
                    marginTop: "0.5rem",
                    paddingBottom: "1rem",
                  }}
                  itemKey={(index, data) => data[index]?._id}
                  onScroll={handleListOnScroll}
                >
                  {Row}
                </VariableSizeList>
                // </div>
              );
            }}
          </AutoSizer>
        ) : (
          <EmptyChatMessagesList />
        )}
      </div>
      {checkboxes && (
        <div className={chatStyles.buttonContainer}>
          <button onClick={handleCloseForward}>Cancel</button>
          <button onClick={handleForwardMessageModal}>Forward</button>
        </div>
      )}
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
            >
              <AiOutlineDelete style={{ fill: "var(--danger-400)" }} />
            </button>
            {audioUrl ? (
              <Waveform
                url={audioUrl}
                isOwnMessage={true}
                height={44}
                width={425}
                showPlaybackRate={false}
                waveColor="#ccc"
                micButtonSize={44}
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
              handleClose={() => setMediaTypeSelectModalVisibility(false)}
              handleSendMessage={handleMediaSendMessage}
            />
            <button
              ref={attachmentButtonRef}
              onClick={() => setMediaTypeSelectModalVisibility((prev) => !prev)}
            >
              <IoIosAttach fill="var(--gray-700)" />
            </button>
            <div className={chatStyles.chatInput}>
              <input
                ref={textInputRef}
                type="text"
                placeholder="Type a message"
                value={inputTextMessage}
                onChange={(e) => handleMessageTextChange(e.target.value)}
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
              <button className={chatStyles.micBtn} onClick={stopRecording}>
                <AiOutlinePause />
              </button>
            ) : !isRecording && !audioUrl ? (
              <button className={chatStyles.micBtn} onClick={startRecording}>
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
      {unReadOnGoingMessages.length > 0 && (
        <button
          className={chatStyles.bottomUnReadMessagesIndicator}
          onClick={handleScrollToBottom}
        >
          <IoIosArrowRoundDown size={32} color="var(--gray-800)" />
          <b>{unReadOnGoingMessages.length}</b>
        </button>
      )}
      <div>
        {forwardModal && (
          <ForwardModal
            message={forwardMessage}
            users={users}
            onCancel={handleCancelForwardModal}
            conversation={conversation}
            chatType={chatType}
            handleSendForwardMessage={handleSendForwardMessage}
            socket={socket}
            user={user?._id}
          />
        )}

        {userSelectionModal && chatType === CHAT_TYPE.ipaStudentGroupChat && (
          <EditIPAStudentGroupDetailModal
            users={users}
            getSingleConversation={getSingleConversation}
            conversation={conversation}
            setSelectedUsers={setSelectedUsers}
            selectedUsers={selectedUsers}
            closeModal={handleUserSelectionModal}
            handleUserSelect={handleUserSelect}
            handleSave={handleSave}
            isUpdate={isUpdate}
          />
        )}
        {userSelectionModal &&
          !conversation?.tutorParticipants &&
          chatType === CHAT_TYPE.adminAdminGroupChat && (
            <EditGroupModal
              users={users}
              getSingleConversation={getSingleConversation}
              conversation={conversation}
              setSelectedUsers={setSelectedUsers}
              selectedUsers={selectedUsers}
              closeModal={handleUserSelectionModal}
              handleUserSelect={handleUserSelect}
              handleSave={handleSave}
              isUpdate={isUpdate}
            />
          )}
        {userSelectionModal &&
          conversation?.tutorParticipants &&
          chatType === CHAT_TYPE.adminTutorGroupChat && (
            <EditAdminTutorGroupDetailModal
              users={users}
              getSingleConversation={getSingleConversation}
              conversation={conversation}
              setSelectedUsers={setSelectedUsers}
              selectedUsers={selectedUsers}
              closeModal={handleUserSelectionModal}
              handleUserSelect={handleUserSelect}
              handleSave={handleSave}
              isUpdate={isUpdate}
            />
          )}

        {userSelectionModal &&
          conversation?.studentParticipants &&
          chatType === CHAT_TYPE.adminStudentGroupChat && (
            <EditAdminStudentGroupDetailModal
              users={users}
              getSingleConversation={getSingleConversation}
              conversation={conversation}
              setSelectedUsers={setSelectedUsers}
              selectedUsers={selectedUsers}
              closeModal={handleUserSelectionModal}
              handleUserSelect={handleUserSelect}
              handleSave={handleSave}
              isUpdate={isUpdate}
            />
          )}

        {userSelectionModal && chatType === CHAT_TYPE.ipaTutorGroupChat && (
          <EditIPATutorGroupDetailModal
            users={users}
            getSingleConversation={getSingleConversation}
            conversation={conversation}
            setSelectedUsers={setSelectedUsers}
            selectedUsers={selectedUsers}
            closeModal={handleUserSelectionModal}
            handleUserSelect={handleUserSelect}
            handleSave={handleSave}
            isUpdate={isUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default memo(GroupMainChat);
