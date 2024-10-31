import React, { useContext, useState, useEffect, useRef } from "react";

import Peer from "simple-peer";

import { AppContext, URL } from "../context/appContext";
import { BoardContext } from "../context/boardContext";
import { SocketContext } from "../context/socketProvider";
// import { MsgContext } from '../context/msgContext';
import styles from "./chatBox.module.css";
import Message from "./message";
import { BsTelephone } from "react-icons/bs";
import CallingBox from "./callingBox";
import PeerProvider, { PeerContext } from "../context/peerContext";
import IncommingCall from "./incommingCall";

const ChatBox = () => {
  const [showMsg, setShowMsg] = useState(true);
  const [messages, setMessages] = useState([]);
  const [callingBoxOpen, setCallingBoxOpen] = useState(false);

  // const { socket, socketId } = useContext(SocketContext);
  const { whiteboard } = useContext(BoardContext);
  // const { user } = useContext(AppContext)
  const user = {
    _id: "1",
    name: "You",
  };
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

  // const myAudio = useRef();
  // const userAudio = useRef();
  // const connectionRef = useRef();

  // useEffect(() => {
  //     socket?.on('new_message', () => {
  //         getMessages()
  //     })

  //     //voice calling
  //     socket?.on("callUser", (data) => {
  //         setReceivingCall(true)
  //         setCaller(data.from)
  //         // setName(data.name)
  //         setOtherUsername(data.name)
  //         setCallerSignal(data.signal)
  //         startStream()
  //     })
  //     return () => {
  //         socket?.removeListener('new_message');
  //         socket?.removeListener('callUser');
  //     }
  // }, [socket])

  useEffect(() => {
    // getMessages()
    return () => {};
  }, []);

  // function getMessages() {
  //     fetch(URL + 'whiteboard/messages/' + whiteboard._id)
  //         .then(res => res.json())
  //         .then(data => {
  //             // console.log('messages', data)
  //             setMessages(data)
  //         }).catch(err => console.error('Error getting Message: ', err))
  // }

  function sendMessage(e) {
    e.preventDefault();
    // console.log(e)
    let msgText = e.target[0].value;
    let msg = {
      _id: Math.random(),
      userId: user._id,
      userName: user.name,
      msgText: msgText,
      time: Date.now(),
    };

    setMessages((prv) => [...prv, msg]);

    // console.log(msg, whiteboard, user)
    // if (msg && whiteboard && user) {
    //     fetch(URL + 'whiteboard/messages', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             boardId: whiteboard._id,
    //             message: msg,
    //         })
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log('msg sent', data)
    //             if (data.modifiedCount === 1) {
    //                 socket?.emit('new_message', { roomId: whiteboard._id })
    //                 getMessages();
    //             }
    //         })
    //         .catch(err => { console.error('Error in Message: ', err) })
    // }
    e.target[0].value = "";
  }

  // function callButtonClickHandler() {
  //     startStream()
  //     setCallingBoxOpen(true)
  //     console.log('socketId', socketId)
  // }

  // function handleCallClick() {
  //     // setCallingBoxOpen(false)
  //     callUser(idToCall)
  // }

  // function handleCallCancelClick() {
  //     setCallingBoxOpen(false)
  //     leaveCall()
  // }

  // function startStream() {
  //     // if (!stream && navigator.mediaDevices) {
  //     if (navigator.mediaDevices) {
  //         if (!window.localStream && !stream) {
  //             navigator.mediaDevices.getUserMedia({
  //                 audio: true
  //             }).then((strm) => {
  //                 // if(!stream){
  //                 // alert('start stream')
  //                 console.log('start stream', strm)
  //                 window.localStream = strm
  //                 setStream(strm)
  //                 // }
  //                 if (myAudio.current) {
  //                     myAudio.current.srcObject = strm
  //                 }
  //                 console.log('STREAM start stream', stream)
  //             })
  //         }
  //     }

  // }

  // const callUser = (id) => {
  //     console.log('utc', idToCall, socketId, user.name)
  //     const peer = new Peer({
  //         initiator: true,
  //         trickle: false,
  //         stream: stream
  //     })
  //     connectionRef.current = peer
  //     peer.on("signal", (data) => {
  //         socket.emit("callUser", {
  //             userToCall: idToCall,
  //             signalData: data,
  //             from: socketId,
  //             name: user.name
  //         })
  //     })
  //     peer.on("stream", (stream) => {
  //         if (stream) {
  //             userAudio.current.srcObject = stream
  //         }
  //     })
  //     peer.on("error", (err) => {
  //         console.log('on error', err)
  //     })
  //     socket.on("callAccepted", (data) => {
  //         setCallAccepted(true)
  //         setOtherUsername(data.name)
  //         // peer.signal(data.signal)
  //         connectionRef.current.signal(data.signal)
  //     })
  //     socket.on("callEnded", (data) => {
  //         if (connectionRef.current) {
  //             connectionRef.current.destroy()
  //         }
  //         console.log('call Ended')
  //         // setReceivingCall(false)
  //         // setCallAccepted(false)
  //         // setCallEnded(false)
  //         // setOtherUsername('')
  //         // // connectionRef.current = null;
  //         // setCallingBoxOpen(false)

  //         reFreshPeerConnection()
  //     })

  //     // peer._debug = console.log
  // }

  // const answerCall = () => {
  //     setCallAccepted(true)
  //     const peer = new Peer({
  //         initiator: false,
  //         trickle: false,
  //         stream: stream
  //     })
  //     peer.on("signal", (data) => {
  //         socket.emit("answerCall", { signal: data, to: caller, name: user.name })
  //     })
  //     peer.on("stream", (stream) => {
  //         if (stream) {
  //             userAudio.current.srcObject = stream
  //         }
  //     })
  //     peer.on("error", (err) => {
  //         console.log('on error', err)
  //     })
  //     peer.signal(callerSignal)
  //     connectionRef.current = peer

  //     socket.on("callEnded", (data) => {
  //         if (connectionRef.current) {
  //             connectionRef.current.destroy([(errr) => console.log(errr)])
  //         }
  //         console.log('call Ended')
  //         reFreshPeerConnection()
  //     })

  //     // peer._debug = console.log
  // }

  // const leaveCall = () => {
  //     if (connectionRef.current) {
  //         connectionRef.current.destroy((errr) => console.log(errr))
  //     }
  //     // setCallEnded(true)
  //     // setCallAccepted(false);
  //     // setReceivingCall(false)
  //     let callId = idToCall || caller;
  //     console.log('cllId', callId)
  //     socket.emit('callEnded', { to: callId })

  //     reFreshPeerConnection()
  // }

  // function reFreshPeerConnection() {
  //     console.log('close Stream')
  //     window.localStream?.getTracks().forEach(function (track) {
  //         track.stop();
  //     });
  //     stream?.getTracks().forEach(function (track) {
  //         track.stop();
  //     });
  //     socket?.removeListener('callEnded');
  //     // socket?.removeListener('callAccepted');
  //     // socket?.removeListener('callUser');
  //     socket?.removeListener('answerCall');

  //     setReceivingCall(false)
  //     setCallAccepted(false)
  //     setCallEnded(false)
  //     setOtherUsername('')
  //     connectionRef.current = null;
  //     setCallingBoxOpen(false)
  //     // setStream();
  //     console.log('STREAM', stream)

  //     window.localStream = null;
  //     setStream(null)
  // }

  useEffect(() => {
    // console.log('callingBoxOPen', callingBoxOpen)
    // if (callingBoxOpen) {
    //     startStream()
    // } else {
    //     console.log('%cStopping media stream', 'color: green; background: yellow; font-size: 16px')
    //     stream?.getTracks().forEach(function (track) {
    //         track.stop();
    //     });
    // }
  }, [callingBoxOpen]);
  useEffect(() => {
    // console.log('connectionRef', connectionRef.current)
    // startStream()
    // return () => {
    //     stream.getTracks().forEach(function (track) {
    //         track.stop();
    //     });
    // }
  }, []);

  return (
    <div className={styles.chatBox}>
      <header>
        <h4>Chat Box</h4>
      </header>
      {/* {!showMsg && <ThreadList  />} */}
      {showMsg && (
        <div className={styles.msgContainer}>
          {messages?.map((msg) => (
            <Message key={msg.time} message={msg} />
          ))}
        </div>
      )}

      <form onSubmit={sendMessage} className={styles.inputBox}>
        {/* <BsTelephone 
                // onClick={callButtonClickHandler} 
                className={styles.callBtn} /> */}
        <input placeholder="Enter Message" type="text" />
        <button className={styles.sendBtn}>Send</button>
      </form>

      {/* <div>
                {<div>
                    <h4 style={{ textAlign: 'center', marginTop: '5px' }}>{user.name}</h4>
                    <audio width={'100%'} controls playsInline 
                    // ref={myAudio} 
                    autoPlay muted />
                </div>}
                {<div>
                    <h4 style={{ textAlign: 'center', marginTop: '5px' }}>{otherUsername}</h4>
                    <audio width={'100%'} controls playsInline 
                    // ref={userAudio} 
                    autoPlay />
                </div>}
            </div> */}

      {/* {(!receivingCall && !callEnded) && <CallingBox open={callingBoxOpen} setOpen={setCallingBoxOpen}
                handleCallClick={handleCallClick} 
                handleCallCancelClick={handleCallCancelClick}
                leaveCall={leaveCall}
            />} */}

      {/* {(receivingCall || callAccepted) && (!callEnded) && <IncommingCall receivingCall={receivingCall}
                setReceivingCall={setReceivingCall} answerCall={answerCall} leaveCall={leaveCall} />} */}
    </div>
  );
};

export default ChatBox;
