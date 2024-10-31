import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/ChatAdmin.module.scss";
import RecentUsers from "../chatComponents/RecentUsers";
import userdefault from "../../assets/defaultImage.jpg";
import { BiSend } from "react-icons/bi";
import api, { getAccessToken, SOCKET_BASE_URL } from "../../services/api";
import MainChat from "../chatComponents/MainChat";
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
import { useClickOutside } from "../../hooks/useClickOutside";
import AllUsersCard from "../chatComponents/AllUsersCard";
import { CgMailForward } from "react-icons/cg";
import userContext from "../../context/userContext";
import { BsFillCameraVideoFill, BsFillTelephoneFill } from "react-icons/bs";
// import CameraComponent from "../../../../../chatComponents/CameraComponent";

const TutorGroupChat = () => {
  const [recentChatUsers, setRecentChatUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  // const [socket, setSocket] = useState();
  const [conversation, setConversation] = useState();
  const [typing, setTyping] = useState(false);
  const [typingTimeout, settypingTimeout] = useState(null);
  // let user = JSON.parse(localStorage.getItem("User"));
  const { userData, socket } = useContext(userContext);
  // const userData = user
  // console.log(userData);
  const pageRef = useRef(1);
  const limitRef = useRef(21);
  const [isLastChat, setIsLastChat] = useState(false);

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
  const [groupDropDown, setGroupDropDown] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupTutorRoom, setGroupTutorRoom] = useState();

  const [cameraState, setCameraState] = useState(false);
  const [fileData, setFileData] = useState([]);

  const attachmentMenuRef = useClickOutside(() =>
    setIsAttachmentMenuActive(false)
  );

  const getRecentChats = async () => {
    const res = await api.get("tutor-group/get-all-groups?page=1&limit=10", {
      header: { Authorization: getAccessToken() },
    });
    if (!res.data.length) {
      setClickedButton("AllGroup");
    } else {
      setClickedButton("RecentChat");
    }
    setRecentChatUsers(res.data);
  };

  useEffect(() => {
    getRecentChats();
  }, []);

  // const getConversation = async (groupId) => {

  //     try {

  //       const { data } = await api.get(
  //         "/group/get-single-group",
  //         {
  //             groupId,
  //         },
  //       );
  //       setMessages(data);
  //       setLoading(false);

  //       socket.emit("join chat", selectedChat._id);
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   };
  // const getGroups = async () => {
  //     const res = await api.get(
  //         `/group/get-all-groups-in-tutor?page=${1}&limit=${10}`, {
  //         headers: {
  //             Authorization: getAccessToken()
  //         }
  //     }
  //     );
  //     setAllGroups(res.data);
  // };

  // useEffect(() => {
  //     getGroups();
  // }, []);

  const inputRef = useRef();
  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  function joinRoom(groupId) {
    inputRef?.current?.focus();

    socket.emit("admin_admin_group_join", {
      group_id: groupId,
      user: userData,
    });
  }

  async function getConversation(groupId) {
    // console.log(groupId)
    joinRoom(groupId);
    setIsLastChat(false);
    pageRef.current = 1;
    const data = await api
      .get(
        "/tutor-group/get-single-group",
        {
          params: {
            query: groupId,
          },
        },
        { headers: { Authorization: getAccessToken() } }
      )
      .catch((err) => {
        console.log("final checking to tutor group error", err);
      });
    let ndata = data.data;
    console.log("data    ", data);
    let is_conversation_exist = recentChatUsers.some(
      (item) => item._id === ndata._id
    );
    console.log(is_conversation_exist);
    if (!is_conversation_exist) {
      setRecentChatUsers((prev) => [...prev, ndata]);
    }
    // console.log(data);
    setConversation(ndata);
  }

  async function sendMessage() {
    let formData;

    if (attachmentFiles.length) {
      console.log("user data \n\n\n", userData, "\n\n\n\n");
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
        console.log(userData);
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
        `/tutor-group-message/reply?message_id=${reply._id}`,
        formData,
        {
          headers: { Authorization: getAccessToken() },
        }
      );
      setMessages((prev) => [...prev, ...data]);
      socket.emit("admin_admin_group_send_message", {
        room_id: groupTutorRoom,
        data,
      });
    } else {
      const { data } = await api.post("/tutor-group-message/send", formData, {
        headers: { Authorization: getAccessToken() },
      });
      setMessages((prev) => [...prev, ...data]);
      socket.emit("admin_admin_group_send_message", {
        room_id: groupTutorRoom,
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

    socket.emit("admin_admin_group_typing_started", groupTutorRoom);

    if (typingTimeout) clearTimeout(typingTimeout);

    settypingTimeout(
      setTimeout(() => {
        socket.emit("admin_admin_group_typing_stopped", groupTutorRoom);
      }, 1000)
    );
  };

  async function getMessages() {
    // console.log("      conversation     ",conversation._id)
    let { data } = await api.get(
      `/tutor-group-message/get?conversationId=${
        conversation._id
      }&page=${1}&limit=${limitRef.current}`
    );
    data = data.reverse();
    setMessages(data);
  }

  async function getMessagesOnScroll() {
    let { data } = await api.get(
      `/tutor-group-message/get?conversationId=${conversation._id}&page=${pageRef.current}&limit=${limitRef.current}`,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    data = data.reverse();
    if (data.length === 0) setIsLastChat(true);
    setMessages((prev) => [...data, ...prev]);
  }

  useEffect(() => {
    if (conversation) {
      // console.log(conversation);
      getMessages();
    }
  }, [conversation]);

  useEffect(() => {
    if (socket) {
      socket.on("admin_admin_group_room_joined", (data) => {
        setGroupTutorRoom(data);
      });
      socket.on("admin_admin_group_recieve_message", (data) => {
        setMessages((prev) => [...prev, ...data]);
      });
      socket.on("admin_admin_group_typing_started_from_server", () => {
        s;
        setTyping(true);
      });
      socket.on("admin_admin_group_typing_stopped_from_server", () => {
        setTyping(false);
      });
      socket.on("admin_admin_group_get_online_user", (data) => {
        setRecentChatUsers((prev) =>
          prev.map((item) => {
            if (item?.group?._id === data) {
              return {
                ...item,
                group: {
                  ...item.group,
                  onlineStatus: true,
                },
              };
            }
            return item;
          })
        );
        setAllGroups((prev) =>
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
      socket.on("admin_admin_group_get_offline_user", (data) => {
        setRecentChatUsers((prev) =>
          prev.map((item) => {
            if (item?.group?._id === data) {
              return {
                ...item,
                group: {
                  ...item.group,
                  onlineStatus: false,
                },
              };
            }
            return item;
          })
        );
        setAllGroups((prev) =>
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
      return item.groupName.toLowerCase().includes(searchValue);
    }
  });

  const allGroupData = groups.filter((item) => {
    if (searchValue === "") {
      return item;
    } else {
      console.log(item._id);
      return item;
    }
  });

  const fetchGroups = async (group) => {
    if (group === "Student Groups") {
      const res = await api.get(
        `/student-group/get-all-groups?page=1&limit=10`,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
      setGroups(res.data);
    } else if (group === "Tutor Groups") {
      const res = await api.get(`/tutor-group/get-all-groups?page=1&limit=10`, {
        headers: {
          Authorization: getAccessToken(),
        },
      });
      setGroups(res.data);
      console.log(res.data);
    } else if (group === "Tutor Groups") {
      const res = await api.get(`/tutor-group/get-all-groups?page=1&limit=10`, {
        headers: {
          Authorization: getAccessToken(),
        },
      });
      setGroups(res.data);
      console.log(res.data);
    } else {
      const res = await api.get(`/ipa-group/get-all-groups?page=1&limit=10`, {
        headers: {
          Authorization: getAccessToken(),
        },
      });
      setGroups(res.data);
      console.log(res.data);
    }
  };

  const handelGroups = (e) => {
    // setTargetGroup(e.target.innerHTML)
    fetchGroups(e.target.innerHTML);
    setGroupDropDown(false);
  };

  return (
    // <div className={styles.mainContainer}>
    //   <div className={styles.leftSide}>

    //   </div>
    //   <div className={styles.rightSide}>

    //   </div>
    // </div>
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
              disabled={recentChatUsers.length <= 0}
              onClick={() => {
                handelClick("RecentChat");
                setGroupDropDown(false);
              }}
              className={`${styles.selectionContainerBtn} ${
                clickedButton === "RecentChat" &&
                styles.toggleselectionContainerBtn
              }`}
            >
              Recent Chats
            </button>
            <button
              onClick={() => {
                handelClick("groups");
                setGroupDropDown(true);
              }}
              className={`${styles.selectionContainerBtn} ${
                clickedButton === "groups" && styles.toggleselectionContainerBtn
              }`}
            >
              Groups ▼
            </button>
          </div>
          {groupDropDown === true && (
            <div className={styles.groupContainer}>
              <button onClick={handelGroups}>Group Groups</button>
              <button onClick={handelGroups}>Tutor Groups</button>
              <button onClick={handelGroups}>Tutor Groups</button>
              <button onClick={handelGroups}>IPA Groups</button>
            </div>
          )}
          <div className={styles.SideUserContainer}>
            {clickedButton === "RecentChat"
              ? recentData?.length <= 0
                ? "No Record Found"
                : recentData?.map((data) => {
                    return (
                      <RecentUsers
                        key={data._id}
                        data={data}
                        setConversation={setConversation}
                        conversation={conversation}
                        joinRoom={joinRoom}
                        setToggleClass={setToggleClass}
                      />
                    );
                  })
              : allGroupData?.length <= 0
              ? "No Record Found"
              : allGroupData.map((data) => {
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
          {conversation?.groupName && (
            <div className={styles.rightSideHeader}>
              <div className={styles.UserInfo}>
                <img src={userdefault} alt="" />
                <div>
                  <h3>{conversation?.groupName}</h3>
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
          <div onScroll={handleScroll} className={styles.conversationContainer}>
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
                    conversationBetween={"tutor-group"}
                  />
                );
              })
            )}
          </div>
          {conversation?.groupName && (
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
                                    groupName: e.target.files[0].groupName,
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
                                    groupName: e.target.files[0].groupName,
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
                                    groupName: e.target.files[0].groupName,
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
                          return activeAttachmentFile.groupName ===
                            file.groupName
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
                              ({ groupName: fName }) => {
                                return fName !== file.groupName;
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
                          groupName: e.target.files[0].groupName,
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
          {/* {reply && (
            <ReplyModal
              reply={reply}
              userData={userData}
              setReply={setReply}
            />
          )} */}
        </div>
      </div>
      {/* <ForwardModal
        forwardMsg={forwardMsg}
        setForwardMsg={setForwardMsg}
        forwardModalState={forwardModalState}
        setForwardModalState={setForwardModalState}
        socket={socket}
        userData={userData}
        conversationBetween={"tutor-group"}
      /> */}
    </>
  );
};

export default TutorGroupChat;
