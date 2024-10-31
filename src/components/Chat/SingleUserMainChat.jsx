import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { uniqBy } from "lodash";
import { IoIosArrowRoundDown, IoIosAttach } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";

import chatUserImg from "../../assets/img/chat-user.png";
import { MessageContextMenuModalContext } from "../../context/MessageContextMenuModalContext";
import { getMessageHeight } from "../../lib/getMessageHeight";
import { getMessageOffset } from "../../lib/getMessageOffset";
import EmptyChatMessagesList from "./EmptyChatMessagesList";
import userContext from "../../context/userContext";
import DeletedMessage, { DELETED_MESSAGE_HEIGHT } from "../message/DeletedMessage";
import { UNREAD_MESSAGE_BAR_HEIGHT } from "../message/UnreadMessageBar";
import { ChatMediaTypeSelectModal } from ".";
import chatStyles from "../../styles/chat.module.scss";
import usePosition from "../../hooks/usePosition";
import { ChatSendingDataPreviewModalContext } from "../../context/ChatSendingDataPreviewModalContext";
import { AiOutlineAudio, AiOutlineDelete, AiOutlinePause } from "react-icons/ai";
import { ActivityLoader } from "../Loaders/ActivityLoader";
import Waveform from "../audio/Waveform";
import { AUDIO_RECORDING_TYPE, CHAT_TYPE, MESSAGE_TYPE } from "../../../constants/helpers";
import ReplyMessage from "../message/ReplyMessage";
import { createChatMessageNotificationData } from "../../lib/notification";
import ForwardModal from "./ForwardModal";
import sendNotificationsWithExpo from "../../lib/sendNotificationsWithExpo";
import { USER_TYPES } from "../../../constants/user";
import api from "../../services/api";
import { CHAT_SCREENS } from "../../../constants/chat";
import { NOTIFICATION_TYPES } from "../../../constants/notification";
import InformationModal from "./InformationModal";

async function getAllAdminsWithExpoPushTokens() {
	const { data } = await api.get("/admin/get-all-admins-expo-push-tokens");
	console.log(data);
	return data;
}

const SingleUserMainChat = () => {
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
		handleSendNotificationToGroupParticipants,
		handleForwardMessage,
		handleSendForwardMessage,
	} = useOutletContext();
	const { userData: user, socket } = useContext(userContext);
	const { hanldeCloseMessageContextMenuModal } = useContext(MessageContextMenuModalContext);
	const { handleUpdateModalPosition } = useContext(ChatSendingDataPreviewModalContext);

	const variableSizeListRef = useRef();
	const variableSizeListOuterRef = useRef();
	const textInputRef = useRef();
	const pageRef = useRef(1);
	const limitRef = useRef(25);
	const typingTimeoutRef = useRef(null);
	const attachmentButtonRef = useRef(null);
	const mediaRecorder = useRef(null);

	const [loading, setLoading] = useState({
		isMessageSendLoading: false,
		isMessagesLoadingOnMount: false,
		isMoreMessagesFetching: false,
	});
	const [conversation, setConversation] = useState(selectedConversation);
	const [selectedConversationId, setSelectedConversationId] = useState();
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
	const [mediaTypeSelectModalVisibility, setMediaTypeSelectModalVisibility] = useState(false);
	const { top: attachmentButtonTop, left: attachmentButtonLeft } = usePosition(attachmentButtonRef);
	const [users, setUsers] = useState([]);
	const [selectedMessages, setSelectedMessages] = useState([]);

	const [checkboxes, setCheckBoxes] = useState(false);

	const [infoModal, setInfoModal] = useState(false);
	const [infoUser, setInfoUser] = useState();

	const [forwardModal, setforwardModal] = useState(false);
	const [forwardMessage, setforwardMessage] = useState([]);

	const [audioBlob, setAudioBlob] = useState(null);
	const [audioUrl, setAudioUrl] = useState(null);
	const [isRecording, setIsRecording] = useState(false);

	const [replyMessage, setReplyMessage] = useState(null);
	const [unReadOnGoingMessages, setUnReadOnGoingMessages] = useState([]);

	const [forwardMessageIds, setForwardMessageIds] = useState([]);

	useEffect(() => {
		console.log(conversation);
	}, [conversation]);

	const headerUserName = useMemo(() => {
		if (!conversation || !user) return "Loading...";
		let userType = user?.userType;
		let finalDisplayName = undefined;
		if (chatType === CHAT_TYPE.quickChat) {
			finalDisplayName =
				conversation?.admin?.name ||
				conversation?.quickChatUser?.phoneNumber + ` - ${conversation?.quickChatUser?.userType}`;

			setInfoUser(conversation?.quickChatUser);
		} else if (chatType === CHAT_TYPE.adminAdminSingleChat) {
			finalDisplayName =
				user?._id === conversation?.admin1?._id
					? conversation?.admin2?.name
					: conversation?.admin1?.name;

			setInfoUser(
				user?._id === conversation?.admin1?._id ? conversation?.admin2 : conversation?.admin1
			);
		} else if (chatType === CHAT_TYPE.adminTutorSingleChat) {
			finalDisplayName = userType === USER_TYPES.tutor ? "Tutor" : conversation?.tutor?.name;
			setInfoUser(conversation?.tutor);
		} else if (chatType === CHAT_TYPE.adminStudentSingleChat) {
			finalDisplayName = user?.userType === "Student" ? "Admin" : conversation?.student?.name;
			setInfoUser(conversation?.student);
		}
		return finalDisplayName;
	}, [conversation, user]);

	const notificationTo = useMemo(async () => {
		const userType = user?.userType;
		if (!conversation || !chatType || !user?._id || !userType) return [];
		let isAdmin;
		switch (userType) {
			case USER_TYPES.superAdmin:
			case USER_TYPES.admin:
			case USER_TYPES.coAdmin:
			case USER_TYPES.subAdmin:
				isAdmin = true;
				break;
			case USER_TYPES.tutor:
			case USER_TYPES.student:
				isAdmin = false;
				break;
			default:
				isAdmin = false;
		}
		if (isAdmin) {
			if (chatType === CHAT_TYPE.quickChat) {
				return [conversation?.quickChatUser?._id];
			} else if (chatType === CHAT_TYPE.adminAdminSingleChat) {
				if (!user) return [];
				return user?._id === conversation?.admin1?._id
					? [conversation?.admin2?._id]
					: [conversation?.admin1?._id];
			} else if (
				chatType === CHAT_TYPE.adminTutorSingleChat ||
				chatType === CHAT_TYPE.tutorSingleChat
			) {
				return [conversation?.tutor?._id];
			} else if (chatType === CHAT_TYPE.adminStudentSingleChat) {
				return [conversation?.student?._id];
			}
		} else {
			const admins = await getAllAdminsWithExpoPushTokens();
			if (chatType === CHAT_TYPE.quickChat) {
				return ["6419f243ae740a82a33b30c8"];
			} else if (chatType === CHAT_TYPE.adminTutorSingleChat) {
				const filterAdmins = admins?.filter((admin) => admin.userType !== USER_TYPES.subAdmin);
				return filterAdmins?.map((admin) => admin._id) || [];
			} else if (chatType === CHAT_TYPE.adminStudentSingleChat) {
				const filterAdmins = admins?.filter((admin) => admin.userType !== USER_TYPES.coAdmin);
				return filterAdmins?.map((admin) => admin._id) || [];
			}
		}
	}, [conversation, user?._id, chatType, user?.userType]);

	const userExpoPushTokens = useMemo(async () => {
		const userType = user?.userType;
		if (!conversation || !chatType || !user?._id || !userType) return [];
		let isAdmin;
		switch (userType) {
			case USER_TYPES.superAdmin:
			case USER_TYPES.admin:
			case USER_TYPES.coAdmin:
			case USER_TYPES.subAdmin:
				isAdmin = true;
				break;
			case USER_TYPES.tutor:
			case USER_TYPES.student:
				isAdmin = false;
				break;
			default:
				isAdmin = false;
		}
		if (isAdmin) {
			if (chatType === CHAT_TYPE.adminAdminSingleChat) {
				console.log(
					user?._id === conversation?.admin1?._id
						? conversation?.admin2?.expoPushToken
							? [conversation?.admin2?.expoPushToken]
							: []
						: conversation?.admin1?.expoPushToken
						? [conversation?.admin1?.expoPushToken]
						: []
				);
				return user?._id === conversation?.admin1?._id
					? conversation?.admin2?.expoPushToken
						? [conversation?.admin2?.expoPushToken]
						: []
					: conversation?.admin1?.expoPushToken
					? [conversation?.admin1?.expoPushToken]
					: [];
			} else if (chatType === CHAT_TYPE.adminTutorSingleChat) {
				return conversation?.tutor?.expoPushToken ? [conversation?.tutor?.expoPushToken] : [];
			} else if (chatType === CHAT_TYPE.adminStudentSingleChat) {
				return conversation?.student?.expoPushToken ? [conversation?.student?.expoPushToken] : [];
			}
		} else {
			const adminsWithExpoPushTokens = await getAllAdminsWithExpoPushTokens();
			if (chatType === CHAT_TYPE.adminTutorSingleChat) {
				const adminsWithExpoPushTokens = await getAllAdminsWithExpoPushTokens();
				const filterAdmins = adminsWithExpoPushTokens?.filter(
					(admin) => admin.userType !== USER_TYPES.subAdmin
				);
				return filterAdmins?.map((admin) => admin.expoPushToken) || [];
			} else if (chatType === CHAT_TYPE.adminStudentSingleChat) {
				const filterAdmins = adminsWithExpoPushTokens?.filter(
					(admin) => admin.userType !== USER_TYPES.coAdmin
				);
				return filterAdmins?.map((admin) => admin.expoPushToken) || [];
			}
		}

		return [];
	}, [conversation, user?._id, user?.userType, chatType]);

	const expoNotificationTitle = useMemo(() => {
		const userType = user?.userType;
		if (!conversation?._id || !chatType || !user?._id || !userType) return "";
		let isAdmin;
		switch (userType) {
			case USER_TYPES.superAdmin:
			case USER_TYPES.admin:
			case USER_TYPES.coAdmin:
			case USER_TYPES.subAdmin:
				isAdmin = true;
				break;
			case USER_TYPES.tutor:
			case USER_TYPES.student:
				isAdmin = false;
				break;
			default:
				isAdmin = false;
		}
		if (isAdmin) {
			if (chatType === CHAT_TYPE.adminAdminSingleChat) {
				return user?.name;
			} else if (chatType === CHAT_TYPE.adminTutorSingleChat) {
				return "Admin";
			} else if (chatType === CHAT_TYPE.adminStudentSingleChat) {
				return "Admin";
			}
		} else {
			return user?.name;
		}

		return user?.name;
	}, [conversation?._id, user?._id, user?.userType, user?.name, chatType]);

	const screenData = useMemo(() => {
		if (chatType === CHAT_TYPE.adminAdminSingleChat) {
			return {
				chatScreen: CHAT_SCREENS.adminAdminSingleChat.chatScreen,
				listScreen: CHAT_SCREENS.adminAdminSingleChat.listScreen,
				isSingleChat: CHAT_SCREENS.adminAdminSingleChat.isSingleChat,
			};
		} else if (chatType === CHAT_TYPE.adminTutorSingleChat) {
			return {
				chatScreen: CHAT_SCREENS.adminTutorSingleChat.chatScreen,
				listScreen: CHAT_SCREENS.adminTutorSingleChat.listScreen,
				isSingleChat: CHAT_SCREENS.adminTutorSingleChat.isSingleChat,
			};
		} else if (chatType === CHAT_TYPE.adminStudentSingleChat) {
			return {
				chatScreen: CHAT_SCREENS.adminStudentSingleChat.chatScreen,
				listScreen: CHAT_SCREENS.adminStudentSingleChat.listScreen,
				isSingleChat: CHAT_SCREENS.adminStudentSingleChat.isSingleChat,
			};
		}
	}, [chatType]);

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
				console.log("conversationId", conversationId);
				const conversation = await getSingleConversation(
					chatType === CHAT_TYPE.adminTutorSingleChat
						? selectedConversation?.tutor?._id
						: conversationId
				);
				setConversation(conversation);
				setSelectedConversation(conversation);
				if (conversation && user) {
					let { unReadMessages, unReadMessagesCount: unreadMessagesCount } =
						await fetchUnreadMessages(conversation?._id, user?._id);
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
							let offset = getMessageOffset([...finalMessages].reverse(), moreMessages.length - 1);
							setInitialScrollOffset(offset);
							setMessages(finalMessages);
						} else if (unreadMessagesCount === limitRef.current) {
							setMessages(unReadMessages);
						} else {
							let extraFetchedMessagesCount = unreadMessagesCount - limitRef.current;
							let extraFetchedPagesCount = Math.floor(extraFetchedMessagesCount / limitRef.current);
							pageRef.current = pageRef.current + extraFetchedPagesCount;
							setOneTimeSkipMessagesCount(
								extraFetchedMessagesCount - extraFetchedPagesCount * limitRef.current
							);
							setInitialScrollOffset(0);
							setMessages(unReadMessages);
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
				console.log("An error occured while fetching single conversation: ", err);
			} finally {
				setLoading((prev) => ({ ...prev, isMessagesLoadingOnMount: false }));
				canFetchNextMessagesTimeout = setTimeout(() => setCanFetchNextMessages(true), 2000);
			}
		})();
		return () => clearTimeout(canFetchNextMessagesTimeout);
	}, [conversationId, user]);

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
		setSelectedMessages(selectedMessages.filter((msg) => msg.selected === true));

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
		setCheckBoxes(false);
		// // setUsers(conversation?.adminParticipants);
		// hanldeCloseMessageContextMenuModal();
	});

	const handleCancelForwardModal = () => {
		setforwardModal(false);
		setforwardMessage(message);
	};

	useEffect(() => {
		let socketOffRecieveMessages = () => {};
		let socketOffReadMessages = () => {};
		let socketOffDeleteMessages = () => {};
		if (socket) {
			if (conversation) {
				socketOffRecieveMessages = handleSocketOnRecieveMessages(
					socket,
					conversation?._id,
					setMessages,
					(newUnreadOnGoingMessages) => {
						setUnReadOnGoingMessages((prev) => [...prev, ...newUnreadOnGoingMessages]);
					}
				);
			}
			if (user?._id) {
				socketOffReadMessages = handleSocketOnReadMessages(socket, user?._id, setMessages);
			}
			socketOffDeleteMessages = handleSocketOnDeleteMessages(socket, setMessages);
		}
		if (socket && user && conversation) {
			handleSocketEmitUserJoinConversation(user, socket, conversation);
		}
		return () => {
			socketOffRecieveMessages();
			socketOffReadMessages();
			socketOffDeleteMessages();
			if (socket && user && conversation) {
				handleSocketEmitUserLeaveConversation(user, socket, conversation);
			}
			setCheckBoxes(false);
		};
	}, [socket, user, conversation]);

	useEffect(() => {
		let socketOffUserReactedMessage = () => {};
		if (socket) {
			socketOffUserReactedMessage = handleSocketOnUserReactedMessage(socket, messages, setMessages);
		}
		return () => {
			socketOffUserReactedMessage();
		};
	}, [socket, messages]);

	useEffect(() => {
		let socketOffUserStartTypingFromServer = () => {};
		let socketOffUserStoppedTypingFromServer = () => {};
		if (socket) {
			socketOffUserStartTypingFromServer = handleSocketOnUserStartTypingFromServer(
				socket,
				typingUsers,
				setTypingUsers
			);
			socketOffUserStoppedTypingFromServer = handleSocketOnUserStoppedTypingFromServer(
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
		if (user && socket && conversation) {
			if (isTyping) {
				handleSocketEmitUserStartTyping(user, socket, conversation);
			} else {
				handleSocketEmitUserStoppedTyping(user, socket, conversation);
			}
		}
		return () => {
			if (socket && user) {
				handleSocketEmitUserStoppedTyping(user, socket, conversation);
			}
		};
	}, [isTyping, conversation, user]);

	const handleMessageTextChange = useCallback(
		(text) => {
			setInputTextMessage(text);
			setIsTyping(text !== "");

			clearTimeout(typingTimeoutRef.current);

			typingTimeoutRef.current = setTimeout(() => {
				setIsTyping(false);
				handleSocketEmitUserStoppedTyping(user, socket, conversation);
			}, 1000);
		},
		[socket, user, conversation]
	);

	const message = [...messages].reverse()[0];
	const isForwarded = forwardMessageIds.includes(message?._id);

	function handleForwardButtonClick() {
		setForwardMessageIds((prevIds) =>
			isForwarded ? prevIds?.filter((id) => id !== message?._id) : [...prevIds, message?._id]
		);
	}

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
				MESSAGE_TYPE.text
			);
			setReplyMessage(null);
			variableSizeListRef.current?.scrollToItem(messages?.length, "end");
			if (newMessages.length > 0) {
				let to = notificationTo;
				let title = user?.name;
				let desc = "You have a new message.";
				let data = {
					conversation_id: conversation?._id,
					chatType: chatType,
					messages: newMessages,
				};
				let notificationData = createChatMessageNotificationData(to, title, desc, data);
				// handleSendNotificationToGroupParticipants(socket, notificationData);
				const message = {
					to: await userExpoPushTokens,
					title: expoNotificationTitle,
					body: newMessages[0]?.textContent,
					data: {
						type: NOTIFICATION_TYPES.chat,
						screenData: screenData,
						chatData: {
							conversation_id: conversation?._id,
							chatType: chatType,
						},
					},
					sound: "default",
					priority: "high",
				};

				console.log("message", message);

				const notification = await api.post("/notification/send-notifications", message);

				console.log("notification", notification);
				// sendNotificationsWithExpo({
				//   to: userExpoPushTokens,
				//   title: expoNotificationTitle,
				//   body: newMessages[0]?.textContent,
				//   data: {
				//     type: NOTIFICATION_TYPES.chat,
				//     screenData: screenData,
				//     chatData: {
				//       conversation_id: conversation?._id,
				//       chatType: chatType,
				//     },
				//   },
				// });
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
		chatType,
		notificationTo,
		expoNotificationTitle,
		screenData,
		userExpoPushTokens,
		replyMessage,
		messages,
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
				MESSAGE_TYPE.file
			);
			setReplyMessage(null);
			variableSizeListRef.current?.scrollToItem(messages?.length, "end");
			if (newMessages.length > 0) {
				let to = notificationTo;
				let title = user?.name;
				let desc = "You have a new message.";
				let data = {
					conversation_id: conversation?._id,
					chatType: chatType,
					messages: newMessages,
				};
				let notificationData = createChatMessageNotificationData(to, title, desc, data);
				handleSendNotificationToGroupParticipants(socket, notificationData);
				await sendNotificationsWithExpo({
					to: userExpoPushTokens,
					title: expoNotificationTitle,
					body: `📁 File message ${newMessages[0]?.fileContent?.textContent || ""}`,
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
				MESSAGE_TYPE.voice
			);
			handleDiscardRecording();
			setReplyMessage(null);
			variableSizeListRef.current?.scrollToItem(messages?.length, "end");
			if (newMessages.length > 0) {
				let to = notificationTo;
				let title = user?.name;
				let desc = "You have a new message.";
				let data = {
					conversation_id: conversation?._id,
					chatType: chatType,
					messages: newMessages,
				};
				let notificationData = createChatMessageNotificationData(to, title, desc, data);
				handleSendNotificationToGroupParticipants(socket, notificationData);
				await sendNotificationsWithExpo({
					to: userExpoPushTokens,
					title: expoNotificationTitle,
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

	const handleReplyMessage = useCallback((message) => {
		textInputRef.current.focus();
		setReplyMessage(message);
		hanldeCloseMessageContextMenuModal();
	}, []);
	const handleCopyMessage = useCallback(async (textContent) => {
		if (!textContent) {
			return new Error("Text content is empty");
		}
		await navigator.clipboard.writeText(textContent);
		hanldeCloseMessageContextMenuModal();
	}, []);

	const handleListOnScroll = async ({ scrollDirection, scrollOffset }) => {
		if (scrollDirection === "backward" && scrollOffset < 500) {
			if (loading.isMoreMessagesFetching || isLastChat || !canFetchNextMessages) {
				return;
			}
			// fetch more messages
			console.log("fetching more messages...");
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
				console.log("An error occured while fetching more messages on scroll to top: ", error);
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

	const handleScrollToReplyMessage = useCallback(
		(replyMessage) => {
			return;
			let reversedMessages = [...messages].reverse();
			let index = reversedMessages.findIndex((message) => message._id === replyMessage._id);
			if (index === -1) return;
			let scrollOffset = getMessageOffset(reversedMessages, index);
			console.log("scroll offset: ", scrollOffset);
			variableSizeListRef.current?.scrollTo(scrollOffset);
		},
		[messages]
	);

	const handleScrollToBottom = useCallback(() => {
		variableSizeListRef.current?.scrollToItem(messages.length - 1);
	}, [messages]);

	const handleRemoveReadMessageFromUnreadOnGoingMessages = useCallback(
		({ message, message_read_user }) => {
			let readByUserId =
				chatType === CHAT_TYPE.adminAdminSingleChat
					? message_read_user?.readBy?._id
					: message_read_user?.readBy;
			if (readByUserId === user?._id) {
				setUnReadOnGoingMessages((prev) =>
					prev.filter((unReadOnGoingMsg) => unReadOnGoingMsg?._id !== message?.message_id)
				);
			}
		},
		[user]
	);

	const handelForwardChange = (e, msg) => {
		console.log(msg);
		// setCheckedMsg(e.currentTarget.checked);
		// if (e.currentTarget.checked === true) {
		//     setForwardMsg(forwardMsg.concat(msg));
		// } else if (e.currentTarget.checked === false) {
		//     let unselectMessage = forwardMsg.filter((data) => {
		//         return data._id !== msg._id;
		//     });
		//     setForwardMsg(unselectMessage);
		// }
	};

	const handleInformationModal = () => {
		setInfoModal(!infoModal);
	};

	const itemSize = (index) => {
		let message = [...messages].reverse()[index];
		let isMessageDeletedForMe = message?.deletedFor?.includes(user?._id) ? true : false;
		let isMessageDeletedForEveryone = message?.isDeletedForEveryone ? true : false;
		let additionalHeight = message?._id === firstUnreadMessage?._id ? UNREAD_MESSAGE_BAR_HEIGHT : 0;
		return isMessageDeletedForEveryone || isMessageDeletedForMe
			? DELETED_MESSAGE_HEIGHT + additionalHeight
			: getMessageHeight(message, 50) + additionalHeight;
	};

	const Row = memo(({ index: i, style, data: arr }) => {
		let message = arr[i];
		let isMessageDeletedForMe = message?.deletedFor?.includes(user?._id) ? true : false;
		let isMessageDeletedForEveryone = message?.isDeletedForEveryone;
		if (isMessageDeletedForEveryone || isMessageDeletedForMe) {
			return (
				<DeletedMessage
					chatType={chatType}
					message={message}
					ref={variableSizeListOuterRef}
					unreadMessagesCount={unreadMessagesCount}
					handleMessageRead={handleMessageRead}
					handleMessageReadFinalCallback={handleRemoveReadMessageFromUnreadOnGoingMessages}
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
				unreadMessagesCount={unreadMessagesCount}
				unreadMessage={firstUnreadMessage}
				message={message}
				previousMessageSender={i === 0 ? "" : arr[i - 1]?.sender}
				handleForwardMessage={handleCheckboxes}
				handleForwardMessageModal={handleForwardMessageModal}
				handleReplyMessage={handleReplyMessage}
				handleCopyMessage={handleCopyMessage}
				handleMessageRead={handleMessageRead}
				selectedMessages={selectedMessages}
				setSelectedMessages={setSelectedMessages}
				handleMessageReadFinalCallback={handleRemoveReadMessageFromUnreadOnGoingMessages}
				handleAddReactionToMessage={handleAddReactionToMessage}
				handleDeleteMessagesForMe={handleDeleteMessagesForMe}
				handleDeleteMessagesForEveryone={handleDeleteMessagesForEveryone}
				onReplyMessageClick={handleScrollToReplyMessage}
				forwardModal={checkboxes}
				style={{
					...style,
				}}
				ref={variableSizeListOuterRef}
			/>
		);
	}, areEqual);

	return (
		<div className={chatStyles.chatDetailContainer}>
			<div className={chatStyles.header}>
				<div className={chatStyles.avatar}>
					<img src={chatUserImg} alt="user image" />
				</div>
				<div className={chatStyles.metaInfoWrapper} onClick={handleInformationModal}>
					<h5>{headerUserName || "No name"}</h5>
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
									initialScrollOffset={Math.max(0, initialScrollOffset - height)}
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
			{replyMessage && (
				<div className={chatStyles.sendReplyMessage}>
					<ReplyMessage replyMessage={replyMessage} />
					<button onClick={() => setReplyMessage(null)}>
						<IoCloseOutline size={24} />
					</button>
				</div>
			)}
			{checkboxes && (
				<div className={chatStyles.buttonContainer}>
					<button onClick={handleCloseForward}>Cancel</button>
					<button onClick={handleForwardMessageModal}>Forward</button>
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
			{unReadOnGoingMessages.length > 0 && (
				<button className={chatStyles.bottomUnReadMessagesIndicator} onClick={handleScrollToBottom}>
					<IoIosArrowRoundDown size={32} color="var(--gray-800)" />
					<b>{unReadOnGoingMessages.length}</b>
				</button>
			)}
			{infoModal && <InformationModal handleClose={handleInformationModal} user={infoUser} />}
		</div>
	);
};

export default memo(SingleUserMainChat);
