import React, { useContext, useState, useEffect, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";

import Peer from "simple-peer";

import { AppContext, URL } from "../../../context/appContext";
import { BoardContext } from "../../../context/boardContext";
import { SocketContext } from "../../../context/socketProvider";
import styles from "./chatBox.module.css";
import Message from "./message";
import CallingBox from "./callingBox";
import PeerProvider, { PeerContext } from "../../../context/peerContext";
import IncommingCall from "./incommingCall";
import userContext from "../../../context/userContext";
import api from "../../../services/api";
import { BsTelephonePlus, BsCameraVideo } from "react-icons/bs";

const ChatBox = () => {
	const [showMsg, setShowMsg] = useState(true);
	const [messages, setMessages] = useState([]);
	const [callingBoxOpen, setCallingBoxOpen] = useState(false);

	const userCtx = useContext(userContext);
	const socket = userCtx?.socket;
	const socketId = socket.id;
	const user = userCtx.userData;

	const { whiteboard } = useContext(BoardContext);

	const {
		stream,
		setStream,
		receivingCall,
		setReceivingCall,
		caller,
		setCaller,
		callerSignal,
		setCallerSignal,
		callAccepted,
		setCallAccepted,
		idToCall,
		setIdToCall,
		callEnded,
		setCallEnded,
		otherUsername,
		setOtherUsername,
	} = useContext(PeerContext);

	const myAudio = useRef();
	const userAudio = useRef();
	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();
	const msgContainerRef = useRef();

	useEffect(() => {
		socket?.on("WB_new_message", () => {
			getMessages();
			msgContainerRef.current?.scrollTo(5000, 0);
		});

		socket?.on("WB_callUser", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setOtherUsername(data?.name);
			setCallerSignal(data.signal);
			startStream();
		});

		return () => {
			socket?.removeListener("WB_new_message");
			socket?.removeListener("WB_callUser");
		};
	}, [socket]);

	useEffect(() => {
		getMessages();
		return () => {};
	}, []);

	function getMessages() {
		api
			.get("whiteboard/messages/" + whiteboard._id)
			.then((res) => {
				setMessages(res.data);
			})
			.catch((err) => console.error("Error getting Message: ", err));
	}

	function sendMessage(e) {
		e.preventDefault();
		let msgInput = e.target[0];
		let msgText = msgInput.value;

		let msg = {
			userId: user._id,
			userName: user?.name,
			msgText: msgText,
		};

		if (msgText && msg && whiteboard && user) {
			api
				.post("whiteboard/messages", {
					boardId: whiteboard._id,
					message: msg,
				})
				.then((res) => {
					if (res.data.modifiedCount === 1) {
						socket?.emit("WB_new_message", { roomId: whiteboard._id });
						getMessages();
					}
				})
				.catch((err) => {
					console.error("Error in Message: ", err);
				});
		}
		msgInput.value = "";
	}

	function callButtonClickHandler() {
		startStream();
		setCallingBoxOpen(true);
	}

	function handleCallClick() {
		callUser(idToCall);
	}

	function handleCallCancelClick() {
		setCallingBoxOpen(false);
		leaveCall();
	}

	function startStream() {
		if (navigator.mediaDevices) {
			if (!window.localStream) {
				navigator.mediaDevices
					.getUserMedia({
						video: true,
						audio: true,
					})
					.then((strm) => {
						window.localStream = strm;
						setStream(strm);
						myVideo.current.srcObject = strm;
					});
			}
		}
	}

	const callUser = (id) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream,
		});
		connectionRef.current = peer;

		peer.on("signal", (data) => {
			socket.emit("WB_callUser", {
				userToCall: idToCall,
				signalData: data,
				from: socketId,
				name: user?.name,
			});
		});

		peer.on("stream", (stream) => {
			if (stream) {
				userVideo.current.srcObject = stream;
			}
		});

		socket.on("WB_callAccepted", (data) => {
			setCallAccepted(true);
			setOtherUsername(data?.name);
			connectionRef.current.signal(data.signal);
		});

		socket.on("WB_callEnded", () => {
			if (connectionRef.current) {
				connectionRef.current.destroy();
			}
			reFreshPeerConnection();
		});
	};

	const answerCall = () => {
		setCallAccepted(true);
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream,
		});

		peer.on("signal", (data) => {
			socket.emit("WB_answerCall", {
				signal: data,
				to: caller,
				name: user?.name,
			});
		});

		peer.on("stream", (stream) => {
			if (stream) {
				userVideo.current.srcObject = stream;
			}
		});

		peer.on("error", (err) => {
			console.log("on error", err);
		});

		peer.signal(callerSignal);
		connectionRef.current = peer;

		socket.on("WB_callEnded", () => {
			if (connectionRef.current) {
				connectionRef.current.destroy();
			}
			reFreshPeerConnection();
		});
	};

	const leaveCall = () => {
		if (connectionRef.current) {
			connectionRef.current.destroy();
		}
		socket.emit("WB_callEnded", { to: idToCall || caller });
		reFreshPeerConnection();
	};

	function reFreshPeerConnection() {
		window.localStream?.getTracks().forEach(function (track) {
			track.stop();
		});
		stream?.getTracks().forEach(function (track) {
			track.stop();
		});

		socket?.removeListener("WB_callEnded");

		setReceivingCall(false);
		setCallAccepted(false);
		setCallEnded(false);
		setOtherUsername("");
		connectionRef.current = null;
		setCallingBoxOpen(false);

		window.localStream = null;
		setStream(null);
	}

	useEffect(() => {
		msgContainerRef.current?.scrollTo(0, msgContainerRef.current.scrollHeight);
	}, [messages]);

	return (
		<div className={styles.chatBox}>
			<header>
				<h4>Chat Box</h4>
				<button type="button" onClick={callButtonClickHandler} className={styles.callBtn}>
					<BsTelephonePlus color="purple" />
				</button>
				<button type="button" onClick={callButtonClickHandler} className={styles.callBtn}>
					<BsCameraVideo color="purple" />
				</button>
			</header>
			{showMsg && (
				<div className={styles.msgContainer} ref={msgContainerRef}>
					{messages?.map((msg) => (
						<Message key={msg.time} message={msg} />
					))}
				</div>
			)}
			<form onSubmit={sendMessage} className={styles.inputBox}>
				<input placeholder="Enter Message" type="text" />
				<button type="submit" className={styles.sendBtn}>
					<AiOutlineSend color="purple" style={{ marginLeft: "3px" }} />
				</button>
			</form>
			<div style={{ display: "none" }}>
				<div>
					<h4 style={{ textAlign: "center", marginTop: "5px" }}>{user?.name}</h4>
					<video width={160} height={120} playsInline ref={myVideo} autoPlay muted />
				</div>
				<div>
					<h4 style={{ textAlign: "center", marginTop: "5px" }}>{otherUsername}</h4>
					<video width={160} height={120} playsInline ref={userVideo} autoPlay />
				</div>
			</div>
			{!receivingCall && !callEnded && (
				<CallingBox
					open={callingBoxOpen}
					setOpen={setCallingBoxOpen}
					handleCallClick={handleCallClick}
					handleCallCancelClick={handleCallCancelClick}
					leaveCall={leaveCall}
					stream={myVideo}
				/>
			)}
			{(receivingCall || callAccepted) && !callEnded && (
				<IncommingCall
					receivingCall={receivingCall}
					setReceivingCall={setReceivingCall}
					answerCall={answerCall}
					leaveCall={leaveCall}
					userVideo={userVideo}
					myVideo={myVideo}
				/>
			)}
		</div>
	);
};

export default ChatBox;
