import React, { useRef, useEffect, useState, useContext } from "react";
import styles from "../../styles/ChatAdmin.module.scss";
import { VscReply, VscChevronDown } from "react-icons/vsc";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineDelete, AiOutlineDownload } from "react-icons/ai";
import { useClickOutside } from "../../hooks/useClickOutside";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import Taggedmsg from "./Taggedmsg";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { CgFileDocument, CgMailForward } from "react-icons/cg";
import { FcDocument } from "react-icons/fc";
import moment from "moment";
import userContext from "../../context/userContext";
import convertSize from "convert-size";

const MainChat = ({
  msg,
  messages,
  setMessages,
  setReply,
  setForwardMsg,
  forwardMsg,
  setForwardState,
  forwardState,
  conversationBetween,
}) => {
  // let user = JSON.parse(localStorage.getItem("User"));
  // console.log(msg, messages, setMessages, setReply, setForwardMsg, forwardMsg, setForwardState, forwardState, conversationBetween);
  const [isMsgMenuActive, setIsMsgMenuActive] = useState(false);
  const [checkedMsg, setCheckedMsg] = useState(false);
  const { userData } = useContext(userContext);

  const scrollToMessage = useRef(null);

  const scrollToLastMessage = () => {
    scrollToMessage.current.scrollIntoView({ behaviour: "smooth" });
  };
  useEffect(() => {
    scrollToLastMessage();
  }, [msg]);

  const msgMenuRef = useClickOutside(() => setIsMsgMenuActive(false));

  const handleDeleteMsg = async (conversationId, messageId) => {
    try {
      let res;
      if (conversationBetween === "admin-student") {
        res = await api.delete(
          `/admin-student-message/delete-message?conversation_id=${conversationId}&message_id=${messageId}`
        );
      } else if (conversationBetween === "admin-tutor") {
        res = await api.delete(
          `/admin-tutor-message/delete-message?conversation_id=${conversationId}&message_id=${messageId}`
        );
      } else if (conversationBetween === "admin-admin") {
        res = await api.delete(
          `/admin-admin-message/delete-message?conversation_id=${conversationId}&message_id=${messageId}`
        );
      } else if (conversationBetween === "admin-group") {
        res = await api.delete(
          `/admin-group-message/delete?conversation_id=${conversationId}&message_id=${messageId}`
        );
      }
      if (res.data.message) {
        let mapped = messages.map((msg) => {
          return msg._id === messageId
            ? { ...msg, isDeleted: true }
            : { ...msg };
        });
        setMessages(mapped);
        toast.success("Message deleted successfully.", {
          position: "top-right",
        });
      }
    } catch (e) {
      toast.error("Message is not deleted.", {
        position: "top-right",
      });
    }
  };

  const handelForwardChange = (e, msg) => {
    setCheckedMsg(e.currentTarget.checked);
    if (e.currentTarget.checked === true) {
      setForwardMsg(forwardMsg.concat(msg));
    } else if (e.currentTarget.checked === false) {
      let unselectMessage = forwardMsg.filter((data) => {
        return data._id !== msg._id;
      });
      setForwardMsg(unselectMessage);
    }
  };

  return (
    <>
      <p
        style={{
          alignSelf: userData?._id === msg.sender ? "flex-end" : "flex-start",
          fontSize: "15px",
          margin: "5px 0px 0px 0px",
        }}
      >
        {msg?.Admin === undefined ? "" : msg.Admin.name}
      </p>

      <div
        className={`${styles.parentDivMessageContainer} ${
          userData?._id === msg.sender &&
          styles.parentDivMessageContainersenderMessage
        }`}
      >
        {forwardState === true && msg.isDeleted === false && (
          <div className={styles.checkBoxContainer}>
            <input
              type="checkbox"
              value={checkedMsg || ""}
              checked={msg.isChecked}
              onChange={(e) => handelForwardChange(e, msg)}
            />
          </div>
        )}
        <div
          ref={scrollToMessage}
          key={msg._id}
          className={`${styles.ConversationMsg} ${
            userData?._id === msg.sender
              ? styles.senderMessage
              : styles.recivedMessage
          }`}
        >
          {msg.isForwarded === true && msg.isDeleted === false && (
            <p
              style={{
                color: "white",
                fontSize: "12px",
                background: "var(--primary-600)",
                padding: "5px 10px",
                borderRadius: "5px",
                margin: "0 0 5px 0",
              }}
            >
              Forwarded.
            </p>
          )}

          {msg.isDeleted ? (
            <p>
              <i>This message was deleted.</i>
            </p>
          ) : msg.messageType === "File" ? (
            <>
              {msg.replyOn !== null && (
                <Taggedmsg userData={userData} msg={msg} />
              )}
              <div className={styles.fileWrapper}>
                {msg.fileContent.fileExtension.toLowerCase() === "pdf" ? (
                  <div className={styles.pdfContainer}>
                    <div>
                      <BsFillFileEarmarkPdfFill className={styles.pdfIcon} />
                      <p>{msg.fileContent.fileName}</p>
                    </div>
                    <p>{`Size: ${convertSize(msg.fileContent.fileSize)}`}</p>
                  </div>
                ) : msg.fileContent.fileExtension.toLowerCase() === "docx" ? (
                  <div className={styles.pdfContainer}>
                    <div>
                      <FcDocument className={styles.pdfIcon} />
                      <p>{msg.fileContent.fileName}</p>
                    </div>
                    <p>{`Size: ${convertSize(msg.fileContent.fileSize)}`}</p>
                  </div>
                ) : msg.fileContent.fileExtension.toLowerCase() === "jpeg" ||
                  msg.fileContent.fileExtension.toLowerCase() === "jpg" ||
                  msg.fileContent.fileExtension.toLowerCase() === "png" ? (
                  <>
                    <img
                      src={msg.fileContent.fileUrl}
                      alt={msg.fileContent.fileName}
                      className={styles.imageData}
                    />
                    <p
                      style={{
                        color: "white",
                        position: "absolute",
                        top: "15px",
                        left: "20px",
                        background: "black",
                        padding: "0px 7px",
                        borderRadius: "5px",
                      }}
                    >
                      {`Size: ${convertSize(msg.fileContent.fileSize)}`}
                    </p>
                  </>
                ) : (
                  <div className={styles.pdfContainer}>
                    <div>
                      <CgFileDocument className={styles.pdfIcon} />
                      <p>{msg.fileContent.fileName}</p>
                    </div>
                    <p>{`Size: ${convertSize(msg.fileContent.fileSize)}`}</p>
                  </div>
                )}
                <p>{msg.fileContent.textContent}</p>
              </div>
            </>
          ) : msg.messageType === "Text" ? (
            <>
              {msg.replyOn !== null && (
                <Taggedmsg userData={userData} msg={msg} />
              )}
              <p>{msg.textContent}</p>
            </>
          ) : null}

          {msg.isDeleted === false && (
            <button
              className={`${styles.msgMenuBtn} ${
                userData?._id === msg.sender && styles.msgMenuSenderBtn
              } ${isMsgMenuActive && styles.activeMsgMenuBtn}`}
              onClick={() => setIsMsgMenuActive(!isMsgMenuActive)}
            >
              <VscChevronDown />
            </button>
          )}

          <AnimatePresence>
            {isMsgMenuActive && (
              <motion.div
                //   key="actionMenu"
                ref={msgMenuRef}
                className={`${styles.msgActionsWrapper} ${
                  userData?._id === msg.sender && styles.msgSenderActionsWrapper
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                transition={{ type: "spring", bounce: 0.25 }}
              >
                <button
                  onClick={() => {
                    setReply(msg);
                    setIsMsgMenuActive(false);
                  }}
                >
                  <VscReply />
                  Reply
                </button>
                <button
                  onClick={() => {
                    setIsMsgMenuActive(false);
                    navigator.clipboard.writeText(msg.textContent);
                    toast.success("Message copied", {
                      position: "top-right",
                    });
                  }}
                >
                  <IoCopyOutline />
                  Copy
                </button>
                {msg.sender === userData?._id && (
                  <button
                    onClick={() => {
                      handleDeleteMsg(msg.conversation, msg._id);
                      setIsMsgMenuActive(false);
                    }}
                  >
                    <AiOutlineDelete />
                    Delete
                  </button>
                )}
                {msg.messageType === "File" && (
                  <button onClick={() => setIsMsgMenuActive(false)}>
                    <a
                      href={msg.fileContent.fileUrl}
                      download={msg.fileContent.fileName}
                    >
                      <AiOutlineDownload />
                      Download
                    </a>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMsgMenuActive(false);
                    setForwardState(true);
                  }}
                >
                  <CgMailForward />
                  Forward
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <p
            style={{
              alignSelf: "flex-end",
              marginRight: "-25px",
              fontSize: "13px",
            }}
          >
            {moment(msg.createdAt).format("LT")}
          </p>
        </div>
      </div>
      {/* <p style={{ alignSelf: userData?._id === msg.sender ? "flex-end" : "flex-start", fontSize: "13px" }}>{new Date(msg.createdAt).toDateString()}</p> */}
    </>
  );
};

export default MainChat;
