import React, { useContext, useEffect, useRef, useState } from "react";
import userdefault from "../../../../assets/defaultImage.jpg";
import { BiSend } from "react-icons/bi";
import {
  BsFillCameraVideoFill,
  BsFillTelephoneFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import api, { SOCKET_BASE_URL } from "../../../../services/api";
import { io } from "socket.io-client";
import stylesAdmin from "../../../../styles/AdminChat.module.scss";
import styles from "../../../../styles/ChatAdmin.module.scss";
import MainChat from "./MainChat";
import { RiAttachment2, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import {
  IoAddOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoSend,
  IoVideocamOutline,
} from "react-icons/io5";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { FcDocument } from "react-icons/fc";
import userContext from "../../../../context/userContext";
import {
  getConversation,
  getMessages,
  getMessagesOnScroll,
  handelInputChange,
  removeSocketListeners,
  sendMessage,
  socketListeners,
} from "./logic";

const SubAdminChat = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [conversation, setConversation] = useState();
  const [typing, setTyping] = useState(false);
  const [typingTimeout, settypingTimeout] = useState(null);
  const { userData } = useContext(userContext);
  const pageRef = useRef(1);
  const limitRef = useRef(21);
  const [isLastChat, setIsLastChat] = useState(false);
  const [adminSubAdminRoom, setSubAdminSubAdminRoom] = useState();

  const [attachmentFiles, setAttachmentFiles] = useState([]);
  let defaultActiveFile =
    attachmentFiles.length !== 0 ? attachmentFiles[0] : null;
  const [isAttachmentPreviewAvailable, setIsAttachmentPreviewAvailable] =
    useState(attachmentFiles.length !== 0 ? true : false);
  const [activeAttachmentFile, setActiveAttachmentFile] =
    useState(defaultActiveFile);
  const [isAttachmentMenuActive, setIsAttachmentMenuActive] = useState(false);

  const [reply, setReply] = useState();

  const attachmentMenuRef = useClickOutside(() =>
    setIsAttachmentMenuActive(false)
  );

  useEffect(() => {
    setSocket(io(SOCKET_BASE_URL));
    if (userData?._id) {
      getConversation(userData, setConversation);
    }
  }, [userData?._id]);

  useEffect(() => {
    socketListeners(
      socket,
      adminSubAdminRoom,
      userData,
      setSubAdminSubAdminRoom,
      setMessages,
      setTyping
    );

    return () => {
      console.log("removed");
      removeSocketListeners(socket, userData);
    };
  }, [socket]);

  const handelEnterKey = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      sendMessage(
        attachmentFiles,
        userData,
        conversation,
        setMsg,
        msg,
        reply,
        setReply,
        setMessages,
        socket,
        adminSubAdminRoom
      );
    }
  };

  function handleScroll(e) {
    if (isLastChat) return;
    if (e.target.scrollTop == 0) {
      pageRef.current = pageRef.current + 1;
      getMessagesOnScroll(
        pageRef,
        limitRef,
        conversation,
        setMessages,
        setIsLastChat
      );
    }
  }

  useEffect(() => {
    if (conversation) getMessages(conversation, limitRef, setMessages);
  }, [conversation]);

  useEffect(() => {
    if (attachmentFiles.length === 1) {
      setActiveAttachmentFile(attachmentFiles[0]);
    }
    if (attachmentFiles.length > 0) {
      setIsAttachmentPreviewAvailable(true);
    }
  }, [attachmentFiles]);

  return (
    <>
      <div className={stylesAdmin.SubAdminChatWrapper}>
        <div className={stylesAdmin.WrapperHeader}>
          <div className={stylesAdmin.adminContainer}>
            <img
              className={stylesAdmin.adminImage}
              src={userdefault}
              alt="admin"
            />
            <div>
              <h3>SubAdmin</h3>
              {typing && <p>Typing...</p>}
            </div>
          </div>
          <div className={stylesAdmin.CommunicationContainer}>
            <BsFillCameraVideoFill className={stylesAdmin.Icons} />
            <BsFillTelephoneFill className={stylesAdmin.Icons} />
            <BsThreeDotsVertical className={stylesAdmin.Icons} />
          </div>
        </div>
        <div onScroll={handleScroll} className={stylesAdmin.mainChatContainer}>
          {messages.length !== 0 &&
            messages?.map((msg) => {
              return (
                <MainChat
                  key={msg._id}
                  msg={msg}
                  messages={messages}
                  setMessages={setMessages}
                  setReply={setReply}
                />
              );
            })}
        </div>
        <div className={stylesAdmin.footer}>
          <button
            onClick={() => setIsAttachmentMenuActive(!isAttachmentMenuActive)}
            className={styles.attachmentButton}
          >
            <RiAttachment2 />
          </button>
          <input
            value={msg}
            onKeyDown={handelEnterKey}
            onChange={(e) =>
              handelInputChange(
                e,
                socket,
                setMsg,
                settypingTimeout,
                setTimeout,
                typingTimeout,
                adminSubAdminRoom,
                userData
              )
            }
            placeholder="Enter Message"
            className={stylesAdmin.InputMsg}
            type="text"
          />
          <button
            onClick={() =>
              sendMessage(
                attachmentFiles,
                userData,
                conversation,
                setMsg,
                msg,
                reply,
                setReply,
                setMessages,
                socket,
                adminSubAdminRoom
              )
            }
            className={styles.inputBtn}
          >
            <BiSend />
          </button>
          <AnimatePresence>
            {isAttachmentMenuActive && !isAttachmentPreviewAvailable && (
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
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* // preview of upload attachment  */}
        {isAttachmentPreviewAvailable && (
          <div className={stylesAdmin.attachmentPreviewWrapper}>
            <div className={stylesAdmin.header}>
              <button
                className={stylesAdmin.closeButton}
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
              <div className={stylesAdmin.itemPreviewAndInputWrapper}>
                <div className={stylesAdmin.itemPreviewWrapper}>
                  <img src={activeAttachmentFile.imgSrc} alt="preview image" />
                </div>
                <div className={stylesAdmin.previewItemInput}>
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
              <div className={stylesAdmin.emptyItemPreviewWrapper}>
                <h3>Please select an image to preview</h3>
              </div>
            )}

            <div className={stylesAdmin.itemPreviewSwitcher}>
              {attachmentFiles.length !== 0 &&
                attachmentFiles?.map((file, i) => {
                  return (
                    <div
                      key={i}
                      className={`${stylesAdmin.smallItemBoxPreview} ${
                        activeAttachmentFile === file &&
                        stylesAdmin.smallItemBoxPreviewActive
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
                        className={stylesAdmin.removeAttachmentButton}
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
              <button className={stylesAdmin.inputButton}>
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
                className={stylesAdmin.sendButton}
                onClick={() => {
                  sendMessage(
                    attachmentFiles,
                    userData,
                    conversation,
                    setMsg,
                    msg,
                    reply,
                    setReply,
                    setMessages,
                    socket,
                    adminSubAdminRoom
                  );
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
          <div className={stylesAdmin.ReplyContainer}>
            <div className={stylesAdmin.replyInfo}>
              {userData._id === reply.sender ? <h3>You</h3> : <h3>SubAdmin</h3>}
              {reply.messageType === "File" ? (
                <>
                  <p>File</p>
                  {reply.fileContent.fileExtension.toLowerCase() === "pdf" ? (
                    <BsFillFileEarmarkPdfFill
                      className={styles.replyfileShow}
                    />
                  ) : reply.fileContent.fileExtension.toLowerCase() ===
                    "docx" ? (
                    <FcDocument className={styles.replyfileShow} />
                  ) : reply.fileContent.fileExtension.toLowerCase() ===
                      "jpeg" ||
                    reply.fileContent.fileExtension.toLowerCase() === "jpg" ||
                    reply.fileContent.fileExtension.toLowerCase() === "png" ? (
                    <img src={reply.fileContent.fileUrl} alt="" />
                  ) : (
                    <CgFileDocument className={styles.replyfileShow} />
                  )}
                </>
              ) : (
                <p>{reply.textContent}</p>
              )}
            </div>
            <button
              onClick={() => {
                setReply("");
              }}
              className={stylesAdmin.replyCancle}
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SubAdminChat;
