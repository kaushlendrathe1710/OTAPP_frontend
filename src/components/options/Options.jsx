import React, { useState, useContext, useEffect, useRef } from "react";
// import { Input, button, Tooltip, Modal, message } from "antd";
import Phone from "../../assets/assests/phone.gif";
import Teams from "../../assets/assests/teams.mp3";
import * as classes from "./Options.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import VideoContext from "../../context/VideoContext";
import userContext from "../../context/userContext";
import Hang from "../../assets/assests/hang.svg";
// import { TwitterIcon, TwitterSharebutton, WhatsappSharebutton, WhatsappIcon, FacebookIcon, FacebookSharebutton } from "react-share";
// import { UserOutlined, CopyOutlined, InfoCircleOutlined, PhoneOutlined } from "@ant-design/icons";
// import { socket } from "../../context/VideoState";

const Options = () => {
  const [idToCall, setIdToCall] = useState("");
  // const { userData } = useContext(userContext);
  const { userData, socket } = useContext(userContext);
  // console.log(userData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const Audio = useRef();
  const [Vusers, setusers] = useState([]);
  // console.log()
  const [callAccept, setCallAccept] = useState(false);
  const {
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
    otherUser,
    setOtherUser,
    leaveCall1,
    users,
  } = useContext(VideoContext);
  // console.log("callAccepted", callAccepted);

  useEffect(() => {
    if (isModalVisible) {
      Audio?.current?.play();
    } else Audio?.current?.pause();
  }, [isModalVisible]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    leaveCall1();
    // window.location.reload();
  };
  // console.log(call.isReceivingCall);
  useEffect(() => {
    // if (callAccepted) {
    //     setCallAccept(false);
    //     setIsModalVisible(true);
    //     setOtherUser(call.from);
    // } else
    setName(userData?.name);
    socket.on("conversationIdn", (id, len) => {
      setusers(id);
    });

    for (let data in Vusers.channels) {
      if (Vusers.channels[data].userData == userData?._id) {
        continue;
      }
      console.log(Vusers.channels[data].isCallAccepted);
      if (call.isReceivingCall && !Vusers.channels[data].isCallAccepted) {
        setCallAccept(false);
        setIsModalVisible(true);
        setOtherUser(call.from);
        // callAccepted = false;
      } else if (!Vusers.channels[data].isCallAccepted) {
      } else {
        setCallAccept(true);
        setIsModalVisible(false);
      }
    }

    // console.log(users);
    console.log(call.from);
    // if (users != undefined && call?.from != undefined) {
    //     if (call?.from in users) {
    //         console.log(call?.from);
    //     } else {
    //         console.log("Not in the list");
    //         setCallAccept(false);
    //         setIsModalVisible(true);
    //         setOtherUser(call.from);
    //     }
    // }
  }, [call.isReceivingCall]);

  return (
    <div className={classes.options}>
      <div style={{ marginBottom: "0.5rem" }}>
        {/* <h2>Account Info</h2> */}
        {/* <Input
                    size="large"
                    placeholder="Your name"
                    prefix={<UserOutlined />}
                    maxLength={15}
                    suffix={<small>{name.length}/15</small>}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        localStorage.setItem("name", e.target.value);
                    }}
                    className={classes.inputgroup}
                /> */}

        <div className={classes.share_options}>
          Id generated: {me.id}
          <br />
          {/* <CopyToClipboard text={me.id}>
                        <button type="primary" icon={<CopyOutlined />} className={classes.btn} tabIndex="0" onClick={() => message.success("Code copied successfully!")}>
                            Copy
                        </button>
                    </CopyToClipboard> */}
        </div>
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2>Make a call</h2>

        <input
          placeholder="Enter code to call"
          size="large"
          className={classes.inputgroup}
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
          // prefix={<UserOutlined className="site-form-item-icon" />}
        />

        {callAccepted && !callEnded ? (
          <button
            variant="contained"
            onClick={leaveCall}
            className={classes.hang}
            tabIndex="0"
          >
            <img src={Hang} alt="hang up" style={{ height: "15px" }} />
            &nbsp; Hang up
          </button>
        ) : (
          <>
            <button
              type="primary"
              // icon={<PhoneOutlined />}
              onClick={() => {
                if (name.length) callUser(idToCall);
                else callUser(idToCall);
              }}
              className={classes.btn}
              tabIndex="0"
            >
              Call
            </button>
          </>
        )}
      </div>

      {call.isReceivingCall && !callAccept && (
        <>
          <audio src={Teams} loop ref={Audio} />
          {/* <Modal title="Incoming Call" visible={isModalVisible} onOk={() => showModal(false)} onCancel={handleCancel} footer={null}>
                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <h1>
                                {call.name} is calling you: <img src={Phone} alt="phone ringing" className={classes.phone} style={{ display: "inline-block" }} />
                            </h1>
                        </div>
                        <div className={classes.btnDiv}>
                            <button
                                variant="contained"
                                className={classes.answer}
                                color="#29bb89"
                                icon={<PhoneOutlined />}
                                onClick={() => {
                                    answerCall();
                                    Audio.current.pause();
                                }}
                                tabIndex="0"
                            >
                                Answer
                            </button>
                            <button
                                variant="contained"
                                className={classes.decline}
                                icon={<PhoneOutlined />}
                                onClick={() => {
                                    setIsModalVisible(false);
                                    Audio.current.pause();
                                }}
                                tabIndex="0"
                            >
                                Decline
                            </button>
                        </div>
                    </Modal> */}
        </>
      )}
    </div>
  );
};

export default Options;
