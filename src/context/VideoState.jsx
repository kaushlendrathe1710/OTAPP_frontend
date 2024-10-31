import React, { useState, useContext, useEffect, useRef } from "react";
import VideoContext from "./VideoContext";
import { io } from "socket.io-client";
import Peer from "simple-peer";
// import { message } from "antd";
import userContext from "./userContext";
import api, { getAccessToken, SOCKET_BASE_URL } from "../services/api";

// const SERVER_URL = "http://localhost:5000/";

// const URL = "http://admin.localhost:5173/";

// export const socket = io(SOCKET_BASE_URL);

const VideoState = ({ children }) => {
  const { userData, socket } = useContext(userContext);
  // console.log(userContext);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [chat, setChat] = useState([]);
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [conversation, setConversation] = useState("");

  const [userName, setUserName] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [myVdoStatus, setMyVdoStatus] = useState(true);
  const [userVdoStatus, setUserVdoStatus] = useState();
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [userMicStatus, setUserMicStatus] = useState();
  const [msgRcv, setMsgRcv] = useState("");
  const [screenShare, setScreenShare] = useState(false);
  const [users, setUsers] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const screenTrackRef = useRef();
  let count = 0;
  if (count == 0) {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: false })
      .then((currentStream) => {
        setStream(currentStream);
        count = count + 1;
        // console.log(count=count+1);
        if (localStorage.getItem("video")) {
          while (myVideo.current.srcObject == null) {
            window.localStream = currentStream;
            console.log(localStream);
            myVideo.current.srcObject = currentStream;
            console.log(count);
          }
        } else {
          navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((currentStream) => {
              const stream = currentStream;
              stopMediaStream(currentStream);
              stream.getTracks().forEach((track) => console.log(track));
            });
        }
        // console.log(myVideo.current.srcObject);
      });
  }

  useEffect(() => {
    if (localStorage.getItem("name")) {
      // setName(localStorage.getItem("name"));
    }
    // console.log("socket         ", socket);

    try {
      socket.on("me", (id) => {
        setMe(id);
        console.log(id);
      });
      socket.on("conversationn", (id) => {
        setConversation(id);
      });
    } catch (e) {
      console.log(e);
    }
    socket.on("endCall", () => {
      window.location.reload();
    });

    socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
      if (currentMediaStatus != null || currentMediaStatus != []) {
        switch (type) {
          case "video":
            setUserVdoStatus(currentMediaStatus);
            break;
          case "mic":
            setUserMicStatus(currentMediaStatus);
            break;
          default:
            setUserMicStatus(currentMediaStatus[0]);
            setUserVdoStatus(currentMediaStatus[1]);
            break;
        }
      }
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      console.log("call user: ", from);
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on("msgRcv", ({ name, msg: value, sender }) => {
      setMsgRcv({ value, sender });
      setTimeout(() => {
        setMsgRcv({});
      }, 2000);
    });

    socket.on("users", (users) => {
      setUsers(users);
      console.log(users);
    });
  }, []);

  // useEffect(() => {
  //   console.log(chat);
  // }, [chat]);
  // console.log(me);

  // const answerCall = () => {
  //     setCallAccepted(true);

  //     const peer = new Peer({ initiator: false, trickle: false, stream });
  //     peer.on("signal", (data) => {
  //         socket.emit("amswercall", { signal: data, to: call.from });
  //     });
  //     peer.on("stream", (currentStream) => {
  //         userVideo.current.srcObject = currentStream;
  //     });
  //     peer.signal(call.signal);
  //     console.log(peer);
  //     connectionRef.current = peer;
  // };

  // const callUser = (id) => {
  //     const peer = new Peer({ initiator: true, trickle: false, stream });
  //     peer.on("signal", (data) => {
  //         socket.emit("calluser", { userToCall: id, signalData: data, from: me, name });
  //     });
  //     peer.on("stream", (currentStream) => {
  //         userVideo.current.srcObject = currentStream;
  //     });

  //     socket.on("callaccepted", (signal) => {
  //         setCallAccepted(true);
  //         peer.signal(signal);
  //     });
  //     console.log(callAccepted);
  //     connectionRef.current = peer;
  // };

  // async function makeCall() {
  //     const configuration = {
  //         iceServers: [
  //             {
  //                 urls: ["turn:13.250.13.83:3478?transport=udp"],
  //                 username: "YzYNCouZM1mhqhmseWk6",
  //                 credential: "YzYNCouZM1mhqhmseWk6",
  //             },
  //         ],
  //     };
  //     const peerConnection = new RTCPeerConnection(configuration);
  //     const peer = new Peer({ initiator: false, trickle: false, stream, configuration });

  //     socket.emit("updateMyMedia", {
  //         type: "both",
  //         currentMediaStatus: [myMicStatus, myVdoStatus],
  //     });

  //     peer.on("signal", (data) => {
  //         socket.emit("answerCall", {
  //             signal: data,
  //             to: call.from,
  //             userName: name,
  //             type: "both",
  //             myMediaStatus: [myMicStatus, myVdoStatus],
  //         });
  //     });

  //     peer.on("stream", (currentStream) => {
  //         userVideo.current.srcObject = currentStream;
  //     });

  //     peer.signal(call.signal);
  //     const offer = await peerConnection.createOffer();
  //     await peerConnection.setLocalDescription(offer);
  //     peer.send({ offer: offer });
  // }

  const sendMessage = async () => {
    let formData;

    console.log("idhar");
    let text = `Id to join video call ${me.id} `;
    // setMsg("");
    formData = {
      messageType: "Text",
      senderId: userData._id,
      conversationId: conversation.id,
      content: {
        textContent: text,
      },
    };

    // messageType: "Text",
    //             senderId: userData._id,
    //             conversationId: conversation._id,
    //             content: {
    //                 textContent: text,
    //             },

    console.log(conversation);
    try {
      const { data } = await api.post(
        "/admin-admin-message/send-message",
        formData
      );
    } catch (e) {
      console.log(e);
    }
    try {
      const { data } = await api.post(
        "/admin-student-message/send-message",
        formData
      );
    } catch (e) {
      console.log(e);
    }
    try {
      const responseData = await api.post(
        "/admin-student-message/send-message",
        formData
      );
    } catch (e) {
      console.log(e);
    }
    try {
      const { data } = await api.post("/admin-group-message/send", formData);
    } catch (e) {}
    // setMessages((prev) => [...prev, ...data]);
    // socket.emit("admin_admin_send_message", { room_id: adminAdminRoom, data });
  };

  const answerCall = () => {
    setCallAccepted(true);

    setOtherUser(call.from);
    let config = {
      iceServers: [
        {
          urls: ["turn:13.250.13.83:3478?transport=udp"],
          username: "YzYNCouZM1mhqhmseWk6",
          credential: "YzYNCouZM1mhqhmseWk6",
        },
      ],
    };

    const peer = new Peer({ initiator: false, trickle: false, stream, config });

    // })
    socket.emit("updateMyMedia", {
      type: "both",
      currentMediaStatus: [myMicStatus, myVdoStatus],
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: call.from,
        userName: name,
        type: "both",
        myMediaStatus: [myMicStatus, myVdoStatus],
      });
      console.log("peer data", data);
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    // makeCall();

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          {
            urls: ["turn:13.250.13.83:3478?transport=udp"],
            username: "YzYNCouZM1mhqhmseWk6",
            credential: "YzYNCouZM1mhqhmseWk6",
          },
        ],
      },
    });
    setOtherUser(id);
    console.log(id);
    // console.log("me ", me, " id ", id);
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me.id,
        name,
      });
      console.log(me);
    });
    socket.on("conversationn", (id) => {
      setConversation(id);
      console.log(conversation);
    });
    if (id == "") {
      sendMessage();
    } else {
      console.log("Empty hai");
    }
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccept", (signal) => {
      console.log(signal);

      setCallAccepted(true);
      // setUserName(username);
      peer.signal(signal.signal);
      // console.log(peer);
      socket.emit("updateMyMedia", {
        type: "both",
        currentMediaStatus: [myMicStatus, myVdoStatus],
      });

      console.log(peer);
      connectionRef.current = peer;
      console.log(connectionRef.current);
    });
  };

  // const startWebCam = () => {
  //     const that = this;
  //     navigator.mediaDevices
  //         .getUserMedia({
  //             audio: true,
  //             video: true,
  //         })
  //         .then((stream) => {
  //             that.setState({ localStream: stream });
  //         });
  // };

  const stopWebCam = () => {
    const mediaStream = myVideo.current.srcObject;

    // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
    const tracks = mediaStream.getTracks();
    tracks[1].stop();
    console.log(tracks);
  };

  const updateVideo = () => {
    setMyVdoStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "video",
        currentMediaStatus: !currentStatus,
      });
      // if (currentStatus) {
      //     stopWebCam(true);
      // } else {
      // }
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const updateMic = () => {
    setMyMicStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "mic",
        currentMediaStatus: !currentStatus,
      });
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  //SCREEN SHARING
  const handleScreenSharing = () => {
    // if (!myVdoStatus) {
    //     message.error("Turn on your video to share the content", 2);
    //     return;
    // }

    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((currentStream) => {
          const screenTrack = currentStream.getTracks()[0];

          // replaceTrack (oldTrack, newTrack, oldStream);
          connectionRef.current.replaceTrack(
            connectionRef.current.streams[0]
              .getTracks()
              .find((track) => track.kind === "video"),
            screenTrack,
            stream
          );

          // Listen click end
          screenTrack.onended = () => {
            connectionRef.current.replaceTrack(
              screenTrack,
              connectionRef.current.streams[0]
                .getTracks()
                .find((track) => track.kind === "video"),
              stream
            );

            myVideo.current.srcObject = stream;
            setScreenShare(false);
          };

          myVideo.current.srcObject = currentStream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        })
        .catch((error) => {
          console.log("No stream for sharing");
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  //full screen
  const fullScreen = (e) => {
    const elem = e.target;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();
    socket.emit("endCall", { id: otherUser });
    window.location.reload();
  };

  const leaveCall1 = () => {
    socket.emit("endCall", { id: otherUser });
  };
  const sendMsg = (value) => {
    socket.emit("msgUser", { name, to: otherUser, msg: value, sender: name });
    let msg = {};
    msg.msg = value;
    msg.type = "sent";
    msg.timestamp = Date.now();
    msg.sender = name;
    setChat([...chat, msg]);
  };

  return (
    <VideoContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        sendMsg,
        msgRcv,
        chat,
        setChat,
        setMsgRcv,
        setOtherUser,
        leaveCall1,
        userName,
        myVdoStatus,
        setMyVdoStatus,
        userVdoStatus,
        setUserVdoStatus,
        updateVideo,
        myMicStatus,
        userMicStatus,
        updateMic,
        screenShare,
        handleScreenSharing,
        fullScreen,
        users,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoState;
