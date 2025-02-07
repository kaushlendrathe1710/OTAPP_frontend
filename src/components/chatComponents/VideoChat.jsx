import api, { SOCKET_BASE_URL } from "../../services/api";
import React, { useEffect, useRef, useState } from "react";
// import { CopyToClipboard } from "react-copy-to-clipboard"
// import Peer from "simple-peer";
import io from "socket.io-client";

function VideoChat() {
  console.log("Video chat");
  return <div>Hello</div>;
  // const [me, setMe] = useState("");
  // const [stream, setStream] = useState();
  // const [receivingCall, setReceivingCall] = useState(false);
  // const [caller, setCaller] = useState("");
  // const [socket, setSocket] = useState();
  // const [callerSignal, setCallerSignal] = useState();
  // const [callAccepted, setCallAccepted] = useState(false);
  // const [idToCall, setIdToCall] = useState("");
  // const [callEnded, setCallEnded] = useState(false);
  // const [name, setName] = useState("");
  // const myVideo = useRef();
  // const userVideo = useRef();
  // const connectionRef = useRef();
  // useEffect(() => {
  //     setSocket(io(SOCKET_BASE_URL));
  //     if (userData?._id) {
  //         getConversation(userData, setConversation);
  //     }
  // }, [userData?._id]);
  // useEffect(() => {
  //     socketListeners(socket, adminAdminRoom, userData, setAdminAdminRoom, setMessages, setTyping);
  //     return () => {
  //         console.log("removed");
  //         removeSocketListeners(socket, userData);
  //     };
  // }, [socket]);
  // useEffect(() => {
  //     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  //         setStream(stream);
  //         myVideo.current.srcObject = stream;
  //     });
  //     socket.on("me", (id) => {
  //         setMe(id);
  //     });
  //     socket.on("callUser", (data) => {
  //         setReceivingCall(true);
  //         setCaller(data.from);
  //         setName(data.name);
  //         setCallerSignal(data.signal);
  //     });
  // }, []);
  // const callUser = (id) => {
  //     const peer = new Peer({
  //         initiator: true,
  //         trickle: false,
  //         stream: stream,
  //     });
  //     peer.on("signal", (data) => {
  //         socket.emit("callUser", {
  //             userToCall: id,
  //             signalData: data,
  //             from: me,
  //             name: name,
  //         });
  //     });
  //     peer.on("stream", (stream) => {
  //         userVideo.current.srcObject = stream;
  //     });
  //     socket.on("callAccepted", (signal) => {
  //         setCallAccepted(true);
  //         peer.signal(signal);
  //     });
  //     connectionRef.current = peer;
  // };
  // const answerCall = () => {
  //     setCallAccepted(true);
  //     const peer = new Peer({
  //         initiator: false,
  //         trickle: false,
  //         stream: stream,
  //     });
  //     peer.on("signal", (data) => {
  //         socket.emit("answerCall", { signal: data, to: caller });
  //     });
  //     peer.on("stream", (stream) => {
  //         userVideo.current.srcObject = stream;
  //     });
  //     peer.signal(callerSignal);
  //     connectionRef.current = peer;
  // };
  // const leaveCall = () => {
  //     setCallEnded(true);
  //     connectionRef.current.destroy();
  // };
  // return (
  //     <>
  //         <h1 style={{ textAlign: "center", color: "#fff" }}>Zoomish</h1>
  //         <div className="container">
  //             <div className="video-container">
  //                 <div className="video">{stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}</div>
  //                 <div className="video">{callAccepted && !callEnded ? <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> : null}</div>
  //             </div>
  //             <div className="myId">
  //                 <input id="filled-basic" label="Name" variant="filled" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: "20px" }} />
  //                 <input id="filled-basic" label="ID to call" variant="filled" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
  //                 <div className="call-button">
  //                     {callAccepted && !callEnded ? (
  //                         <button variant="contained" color="secondary" onClick={leaveCall}>
  //                             End Call
  //                         </button>
  //                     ) : (
  //                         <button color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
  //                             <PhoneIcon fontSize="large" />
  //                         </button>
  //                     )}
  //                     {idToCall}
  //                 </div>
  //             </div>
  //             <div>
  //                 {receivingCall && !callAccepted ? (
  //                     <div className="caller">
  //                         <h1>{name} is calling...</h1>
  //                         <button variant="contained" color="primary" onClick={answerCall}>
  //                             Answer
  //                         </button>
  //                     </div>
  //                 ) : null}
  //             </div>
  //         </div>
  //     </>
  // );
}

export default VideoChat;
