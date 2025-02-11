import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../../../../../styles/ChatAdmin.module.scss";
import Chatter from "./Chatter";
import userdefault from "../../../../../../assets/defaultImage.jpg";
import { BiSend } from "react-icons/bi";
import api, { getAccessToken } from "../../../../../../services/api";
import MainChat from "../../../../../chatComponents/MainChat";
import { RiAttachment2, RiCloseLine } from "react-icons/ri";
import {
  IoAddOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoSend,
  IoVideocamOutline,
  IoArrowBack,
} from "react-icons/io5";
import { AiOutlineSearch, AiOutlineCamera } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "../../../../../../hooks/useClickOutside";
import ForwardModal from "../../../../../chatComponents/ForwardModal";
import AllUsersCard from "../../../../../chatComponents/AllUsersCard";
import VideoState from "../../../../../../context/VideoState";
import styled from "styled-components";
import Video from "../../../../../Video/Video";
import Options from "../../../../../options/Options";
import { CgMailForward } from "react-icons/cg";
import userContext from "../../../../../../context/userContext";
import { BsFillCameraVideoFill, BsFillTelephoneFill } from "react-icons/bs";
import ReplyModal from "../../../../../chatComponents/ReplyModal";
import CameraComponent from "../../../../../chatComponents/CameraComponent";

const AdminStudentChat = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [recentChatUsers, setRecentChatUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  // const [socket, setSocket] = useState();
  const [conversation, setConversation] = useState();
  const [typing, setTyping] = useState(false);
  const [typingTimeout, settypingTimeout] = useState(null);
  // let user = JSON.parse(localStorage.getItem("User"));
  const { userData, socket } = useContext(userContext);
  // console.log(userData);
  const pageRef = useRef(1);
  const limitRef = useRef(21);
  const [isLastChat, setIsLastChat] = useState(false);
  const [studentAdminRoom, setStudentAdminRoom] = useState();
  const [adminVideoId, setAdminVideoId] = useState("");

  const [attachmentFiles, setAttachmentFiles] = useState([]);
  let defaultActiveFile =
    attachmentFiles.length !== 0 ? attachmentFiles[0] : null;
  const [activeAttachmentFile, setActiveAttachmentFile] =
    useState(defaultActiveFile);
  const [isAttachmentMenuActive, setIsAttachmentMenuActive] = useState(false);
  const [isAttachmentPreviewAvailable, setIsAttachmentPreviewAvailable] =
    useState(attachmentFiles.length !== 0 ? true : false);

  const [reply, setReply] = useState();
  const [forwardMsg, setForwardMsg] = useState([]);
  const [forwardModalState, setForwardModalState] = useState(false);
  const [forwardState, setForwardState] = useState(false);
  const [clickedButton, setClickedButton] = useState("");
  const [toggleClass, setToggleClass] = useState(false);
  const [searchState, setSearchState] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [videoCall, setVideoCall] = useState(false);

  const [cameraState, setCameraState] = useState(false);
  const [fileData, setFileData] = useState([]);
  const inputRef = useRef();
  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const attachmentMenuRef = useClickOutside(() =>
    setIsAttachmentMenuActive(false)
  );

  const getRecentChats = async () => {
    // const res = await api.get("admin-student-conversations/get-all-sub-conversations?page=1&limit=10");
    try {
      const res = await api.get(
        "/admin-student-conversations/get-all-sub-conversations",
        {
          params: {
            query: userData._id,
          },
        }
      );
      // console.log(res);
      setRecentChatUsers(res.data);
    } catch (e) {
      console.log(e);
    }
    setClickedButton("RecentChat");

    // if (!res.data.length) {
    //     setClickedButton("AllStudent");
    // } else {
    //     setClickedButton("RecentChat");
    // }
  };

  useEffect(() => {
    getRecentChats();
  }, []);

  const getStudents = async () => {
    const res = await api.get(
      `/student/get-all-students-in-admin?page=${1}&limit=${10}`,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    setAllStudents(res.data);
  };

  useEffect(() => {
    getStudents();
  }, []);

  function handleVideo() {
    console.log(adminVideoId);

    if (videoCall) {
      setVideoCall(false);
      localStorage.setItem("video", false);
    } else {
      socket.emit("videoCall", adminVideoId);
      localStorage.setItem("video", false);

      socket.emit("conversation", conversation._id);

      socket.on("me", (id) => {
        setAdminVideoId(id);
        // localStorage.setItem("videoid", id.id);
      });
      setVideoCall(true);
    }
  }

  function joinRoom(studentId) {
    setAdminVideoId(studentId);
    inputRef?.current?.focus();

    socket.emit("admin_student_video_join", studentId);

    socket.emit("student_admin_room_join", studentId);
  }

  async function getConversation(studentId) {
    joinRoom(studentId);
    setIsLastChat(false);
    pageRef.current = 1;
    const { data } = await api.post(
      "/admin-student-conversations/single-conversation",
      {
        studentId,
      }
    );
    let is_conversation_exist = recentChatUsers.some(
      (item) => item._id === data._id
    );
    if (!is_conversation_exist) {
      setRecentChatUsers((prev) => [...prev, data]);
    }
    setConversation(data);
  }

  async function sendMessage() {
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
          conversationId: conversation._id,
          content: {
            textContent: text,
          },
        };
      }
    }

    if (reply) {
      setReply();
      const { data } = await api.post(
        `/admin-student-message/reply-message?message_id=${reply._id}`,
        formData
      );
      setMessages((prev) => [...prev, ...data]);
      socket.emit("student_admin_send_message", {
        room_id: studentAdminRoom,
        data,
      });
    } else {
      const { data } = await api.post(
        "/admin-student-message/send-message",
        formData
      );
      setMessages((prev) => [...prev, ...data]);
      socket.emit("student_admin_send_message", {
        room_id: studentAdminRoom,
        data,
      });
    }
    getRecentChats();
  }

  const handelEnterKey = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      sendMessage();
    }
  };

  const handelChange = (e) => {
    setMsg(e.target.value);

    socket.emit("student_admin_typing_started", studentAdminRoom);

    if (typingTimeout) clearTimeout(typingTimeout);

    settypingTimeout(
      setTimeout(() => {
        socket.emit("student_admin_typing_stopped", studentAdminRoom);
      }, 1000)
    );
  };

  async function getMessages() {
    let { data } = await api.get(
      `/admin-student-message/get-messages?conversationId=${
        conversation._id
      }&page=${1}&limit=${limitRef.current}`
    );
    data = data.reverse();
    setMessages(data);
  }

  async function getMessagesOnScroll() {
    let { data } = await api.get(
      `/admin-student-message/get-messages?conversationId=${conversation._id}&page=${pageRef.current}&limit=${limitRef.current}`
    );
    data = data.reverse();
    if (data.length === 0) setIsLastChat(true);
    setMessages((prev) => [...data, ...prev]);
  }

  useEffect(() => {
    if (conversation) {
      getMessages();
    }
  }, [conversation]);

  useEffect(() => {
    if (socket) {
      socket.on("student_admin_room_joined", (data) => {
        setStudentAdminRoom(data);
      });
      socket.on("student_admin_recieve_message", (data) => {
        setMessages((prev) => [...prev, ...data]);
      });
      socket.on("student_admin_typing_started_from_server", () => {
        setTyping(true);
      });
      socket.on("student_admin_typing_stopped_from_server", () => {
        setTyping(false);
      });
      socket.on("student_admin_get_online_user", (data) => {
        setRecentChatUsers((prev) =>
          prev.map((item) => {
            if (item?.student?._id === data) {
              return {
                ...item,
                student: {
                  ...item.student,
                  onlineStatus: true,
                },
              };
            }
            return item;
          })
        );
        setAllStudents((prev) =>
          prev.map((item) => {
            if (item?._id === data) {
              return {
                ...item,
                onlineStatus: true,
              };
            }
            return item;
          })
        );
      });
      socket.on("student_admin_get_offline_user", (data) => {
        setRecentChatUsers((prev) =>
          prev.map((item) => {
            if (item?.student?._id === data) {
              return {
                ...item,
                student: {
                  ...item.student,
                  onlineStatus: false,
                },
              };
            }
            return item;
          })
        );
        setAllStudents((prev) =>
          prev.map((item) => {
            if (item?._id === data) {
              return {
                ...item,
                onlineStatus: false,
              };
            }
            return item;
          })
        );
      });
    }
  }, [socket]);

  function handleScroll(e) {
    if (isLastChat) return;
    if (e.target.scrollTop == 0) {
      pageRef.current = pageRef.current + 1;
      getMessagesOnScroll();
    }
  }

  useEffect(() => {
    if (attachmentFiles.length === 1) {
      setActiveAttachmentFile(attachmentFiles[0]);
    }
    if (attachmentFiles.length > 0) {
      setIsAttachmentPreviewAvailable(true);
    }
  }, [attachmentFiles]);

  function handleButtonClick(val) {
    setClickedButton(val);
  }

  function handelClick(val) {
    handleButtonClick(val);
  }

  const handelSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const recentData = recentChatUsers.filter((item) => {
    if (searchValue === "") {
      return item;
    } else {
      return item.student.name.toLowerCase().includes(searchValue);
    }
  });

  const allStudentData = allStudents.filter((item) => {
    if (searchValue === "") {
      return item;
    } else {
      return item.name.toLowerCase().includes(searchValue);
    }
  });

  return (
    <>
      <div className={styles.mainChatContainer}>
        <div
          className={`${styles.leftSideBar} ${
            toggleClass === true && styles.mobileView
          }`}
        >
          <div className={styles.leftSideHeader}>
            <h3>Chat</h3>
            <div className={styles.searchContainer}>
              {searchState === true && (
                <input
                  onChange={handelSearch}
                  placeholder="search"
                  type="text"
                />
              )}
              {searchState === true ? (
                <button
                  onClick={() => {
                    setSearchState(false);
                    setSearchValue("");
                  }}
                >
                  &times;
                </button>
              ) : (
                <AiOutlineSearch
                  onClick={() => setSearchState(true)}
                  className={styles.searchIcon}
                />
              )}
            </div>
          </div>
          <div className={styles.selectionContainer}>
            <button
              // disabled={recentChatUsers.length <= 0}
              onClick={() => handelClick("RecentChat")}
              className={`${styles.selectionContainerBtn} ${
                clickedButton === "RecentChat" &&
                styles.toggleselectionContainerBtn
              }`}
            >
              My Chats
            </button>
            <button
              onClick={() => handelClick("AllStudent")}
              className={`${styles.selectionContainerBtn} ${
                clickedButton === "AllStudent" &&
                styles.toggleselectionContainerBtn
              }`}
            >
              All Students
            </button>
          </div>
          <div className={styles.SideUserContainer}>
            {clickedButton === "RecentChat"
              ? recentData?.length <= 0
                ? "No Record Found"
                : recentData?.map((data) => {
                    return (
                      <Chatter
                        key={data._id}
                        data={data}
                        setConversation={setConversation}
                        conversation={conversation}
                        joinRoom={joinRoom}
                        setToggleClass={setToggleClass}
                      />
                    );
                  })
              : allStudentData?.length <= 0
              ? "No Record Found"
              : allStudentData.map((data) => {
                  return (
                    <AllUsersCard
                      key={data._id}
                      data={data}
                      getConversation={getConversation}
                      conversation={conversation}
                      setClickedButton={setClickedButton}
                      setRecentChatUsers={setRecentChatUsers}
                      setToggleClass={setToggleClass}
                    />
                  );
                })}
          </div>
        </div>
        <div
          className={`${styles.rightSideBar} ${
            toggleClass === false && styles.rightSideMobileView
          }`}
        >
          {conversation?.student.name && (
            <div className={styles.rightSideHeader}>
              <div className={styles.UserInfo}>
                <img src={userdefault} alt="" />
                <div>
                  <h3>{conversation?.student.name}</h3>
                  {typing && <p>Typing...</p>}
                </div>
              </div>
              <div className={styles.CommunicationContainer}>
                {toggleClass === true && (
                  <IoArrowBack
                    onClick={() => setToggleClass(false)}
                    className={styles.BackArrow}
                  />
                )}
                <BsFillCameraVideoFill className={styles.Icons} />
                <BsFillTelephoneFill className={styles.Icons} />
              </div>
            </div>
          )}
          {videoCall === true ? (
            <>
              <VideoState>
                <div className="App" style={{ height: "100%", width: "100%" }}>
                  <Video />
                  <Options />
                </div>
              </VideoState>

              {/* <Main /> */}
            </>
          ) : (
            <div
              onScroll={handleScroll}
              className={styles.conversationContainer}
            >
              {cameraState === true ? (
                <CameraComponent
                  setFileData={setFileData}
                  setCameraState={setCameraState}
                  setAttachmentFiles={setAttachmentFiles}
                />
              ) : (
                messages.length !== 0 &&
                messages?.map((msg) => {
                  return (
                    <MainChat
                      key={msg._id}
                      msg={msg}
                      messages={messages}
                      setMessages={setMessages}
                      setReply={setReply}
                      reply={reply}
                      setForwardMsg={setForwardMsg}
                      forwardMsg={forwardMsg}
                      setForwardState={setForwardState}
                      forwardState={forwardState}
                      conversationBetween={"admin-student"}
                    />
                  );
                })
              )}
            </div>
          )}
          {conversation?.student.name && (
            <div className={styles.footerContainer}>
              {forwardState === true ? (
                <div className={styles.forwardDataToModal}>
                  <button
                    onClick={() => {
                      setForwardState(false);
                      setForwardMsg([]);
                    }}
                    className={styles.closeForward}
                  >
                    &times;
                  </button>
                  <div className={styles.selectedNumberContainer}>
                    <h6>{forwardMsg?.length}</h6>
                    <h6>Selected</h6>
                  </div>
                  <button
                    disabled={forwardMsg.length <= 0}
                    onClick={() => {
                      setForwardModalState(true);
                      setForwardState(false);
                    }}
                    className={styles.forwardMsgBtn}
                  >
                    <CgMailForward />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() =>
                      setIsAttachmentMenuActive(!isAttachmentMenuActive)
                    }
                    className={styles.attachmentButton}
                  >
                    <RiAttachment2 />
                  </button>
                  <input
                    value={msg}
                    onKeyDown={handelEnterKey}
                    onChange={handelChange}
                    placeholder="Enter Message"
                    className={styles.InputMsg}
                    type="text"
                    ref={inputRef}
                    autoFocus
                  />{" "}
                  <button onClick={sendMessage} className={styles.inputBtn}>
                    <BiSend />
                  </button>
                  <AnimatePresence>
                    {isAttachmentMenuActive &&
                      !isAttachmentPreviewAvailable && (
                        <motion.div
                          ref={attachmentMenuRef}
                          className={styles.attachmentMenuWrapper}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 50, scale: 0.8 }}
                          transition={{ type: "spring", bounce: 0.25 }}
                        >
                          <label htmlFor="attachments">
                            <IoImageOutline />
                            Image
                            <input
                              type="file"
                              id="attachments"
                              accept="image/*"
                              multiple
                              title="Add file"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  let attachmentFile = {
                                    name: e.target.files[0].name,
                                    type: e.target.files[0].type,
                                    size: e.target.files[0].size,
                                    lastModified:
                                      e.target.files[0].lastModified,
                                    imgSrc: URL.createObjectURL(
                                      e.target.files[0]
                                    ),
                                    file: e.target.files[0],
                                    caption: "",
                                  };
                                  setAttachmentFiles((prev) => [
                                    ...prev,
                                    attachmentFile,
                                  ]);
                                  setActiveAttachmentFile(attachmentFile);
                                }
                              }}
                            />
                          </label>
                          <label htmlFor="attachmentsVideo">
                            <IoVideocamOutline />
                            Video
                            <input
                              type="file"
                              id="attachmentsVideo"
                              multiple
                              title="Add file"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  let attachmentFile = {
                                    name: e.target.files[0].name,
                                    type: e.target.files[0].type,
                                    size: e.target.files[0].size,
                                    lastModified:
                                      e.target.files[0].lastModified,
                                    imgSrc: URL.createObjectURL(
                                      e.target.files[0]
                                    ),
                                    file: e.target.files[0],
                                    caption: "",
                                  };
                                  setAttachmentFiles((prev) => [
                                    ...prev,
                                    attachmentFile,
                                  ]);
                                  setActiveAttachmentFile(attachmentFile);
                                }
                              }}
                            />
                          </label>
                          <label htmlFor="attachmentsDocs">
                            <IoDocumentTextOutline />
                            Document
                            <input
                              type="file"
                              id="attachmentsDocs"
                              multiple
                              title="Add file"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  let attachmentFile = {
                                    name: e.target.files[0].name,
                                    type: e.target.files[0].type,
                                    size: e.target.files[0].size,
                                    lastModified:
                                      e.target.files[0].lastModified,
                                    imgSrc: URL.createObjectURL(
                                      e.target.files[0]
                                    ),
                                    file: e.target.files[0],
                                    caption: "",
                                  };
                                  setAttachmentFiles((prev) => [
                                    ...prev,
                                    attachmentFile,
                                  ]);
                                  setActiveAttachmentFile(attachmentFile);
                                }
                              }}
                            />
                          </label>
                          {/* <button
                          onClick={() => setCameraState(true)
                            //close modal
                          }
                        >
                          <AiOutlineCamera />
                          Camera
                        </button> */}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </>
              )}
            </div>
          )}
          {/* // preview of upload attachment  */}
          {isAttachmentPreviewAvailable && (
            <div className={styles.attachmentPreviewWrapper}>
              <div className={styles.header}>
                <button
                  className={styles.closeButton}
                  title="Close"
                  onClick={() => {
                    if (confirm("Are you sure to close this modal?")) {
                      setActiveAttachmentFile(null);
                      setAttachmentFiles([]);
                      setIsAttachmentPreviewAvailable(false);
                    }
                  }}
                >
                  <RiCloseLine />
                </button>
              </div>
              {activeAttachmentFile ? (
                <div className={styles.itemPreviewAndInputWrapper}>
                  <div className={styles.itemPreviewWrapper}>
                    <img
                      src={activeAttachmentFile.imgSrc}
                      alt="preview image"
                    />
                  </div>
                  <div className={styles.previewItemInput}>
                    <input
                      type="text"
                      value={activeAttachmentFile.caption}
                      onChange={(e) => {
                        let caption = e.target.value;
                        setActiveAttachmentFile({
                          ...activeAttachmentFile,
                          caption,
                        });
                        let mapped = attachmentFiles.map((file) => {
                          return activeAttachmentFile.name === file.name
                            ? { ...file, caption }
                            : file;
                        });
                        setAttachmentFiles(mapped);
                      }}
                      placeholder="Type caption here"
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.emptyItemPreviewWrapper}>
                  <h3>Please select an image to preview</h3>
                </div>
              )}

              <div className={styles.itemPreviewSwitcher}>
                {attachmentFiles.length !== 0 &&
                  attachmentFiles?.map((file, i) => {
                    return (
                      <div
                        key={i}
                        className={`${styles.smallItemBoxPreview} ${
                          activeAttachmentFile === file &&
                          styles.smallItemBoxPreviewActive
                        }`}
                      >
                        <img
                          src={file.imgSrc}
                          alt="preview"
                          onClick={() => {
                            setActiveAttachmentFile(file);
                          }}
                        />
                        <button
                          className={styles.removeAttachmentButton}
                          title="Remove"
                          onClick={() => {
                            let filterFiles = attachmentFiles.filter(
                              ({ name: fName }) => {
                                return fName !== file.name;
                              }
                            );

                            setAttachmentFiles(filterFiles);

                            if (activeAttachmentFile === file) {
                              setActiveAttachmentFile(filterFiles[0]);
                            }
                          }}
                        >
                          <RiCloseLine />
                        </button>
                      </div>
                    );
                  })}
                <button className={styles.inputButton}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    title="Add file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        let attachmentFile = {
                          name: e.target.files[0].name,
                          type: e.target.files[0].type,
                          size: e.target.files[0].size,
                          lastModified: e.target.files[0].lastModified,
                          imgSrc: URL.createObjectURL(e.target.files[0]),
                          file: e.target.files[0],
                          caption: "",
                        };
                        setAttachmentFiles((prev) => [...prev, attachmentFile]);
                        setActiveAttachmentFile(attachmentFile);
                      }
                    }}
                  />
                  <IoAddOutline />
                </button>
                <button
                  className={styles.sendButton}
                  onClick={() => {
                    sendMessage();
                    setAttachmentFiles([]);
                    setIsAttachmentPreviewAvailable(false);
                  }}
                  title="Send"
                >
                  <IoSend />
                </button>
              </div>
            </div>
          )}
          {reply && (
            <ReplyModal reply={reply} userData={userData} setReply={setReply} />
          )}
        </div>
      </div>
      <ForwardModal
        forwardMsg={forwardMsg}
        setForwardMsg={setForwardMsg}
        forwardModalState={forwardModalState}
        setForwardModalState={setForwardModalState}
        socket={socket}
        userData={userData}
        conversationBetween={"admin-student"}
      />
    </>
  );
};

export default AdminStudentChat;
