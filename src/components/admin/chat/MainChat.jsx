import React, { useRef, useEffect, useState, useContext } from 'react'
import stylesStudent from '../../../../styles/StudentChat.module.scss'
import { motion, AnimatePresence } from "framer-motion";
import styles from '../../../../styles/ChatAdmin.module.scss'
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { VscReply, VscChevronDown } from "react-icons/vsc";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineDelete, AiOutlineDownload } from "react-icons/ai";
import { toast } from "react-hot-toast";
import Taggedmsg from '../../../chatComponents/Taggedmsg';
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { FcDocument } from "react-icons/fc";
import userContext from '../../../../context/userContext';
import moment from 'moment';
import convertSize from "convert-size";
import { handleDeleteMsg } from './logic';

const MainChat = ({ msg, messages, setMessages, setReply }) => {
  const { userData } = useContext(userContext)
  const scrollToMessage = useRef(null);

  const [isMsgMenuActive, setIsMsgMenuActive] = useState(false);

  const scrollToLastMessage = () => {
    scrollToMessage.current.scrollIntoView({ behaviour: "smooth" });
  };
  useEffect(() => {
    scrollToLastMessage();
  }, [msg]);

  const msgMenuRef = useClickOutside(() => setIsMsgMenuActive(false));

  

  return (
    <>
      <div
        style={{ margin: '5px 0px' }}
        ref={scrollToMessage}
        className={`${styles.ConversationMsg} ${userData._id === msg.sender ? styles.senderMessage : styles.recivedMessage
          }`}
      >
        {msg.isDeleted ? (
          <p>
            <i>This message was deleted.</i>
          </p>
        ) : msg.messageType === "File" ? (
          <>
            {msg.replyOn !== null && <Taggedmsg userData={userData} msg={msg} />}
            <div className={stylesStudent.fileWrapper}>
              {msg.fileContent.fileExtension.toLowerCase() === "pdf" ? (
                <div className={styles.pdfContainer}>
                  <div>
                    <BsFillFileEarmarkPdfFill className={styles.pdfIcon} />
                    <p>{msg.fileContent.fileName}</p>
                  </div>
                  <p>
                    {`Size: ${convertSize(msg.fileContent.fileSize)}`}
                  </p>
                </div>
              ) : msg.fileContent.fileExtension.toLowerCase() === "docx" ? (
                <div className={styles.pdfContainer}>
                  <div>
                    <FcDocument className={styles.pdfIcon} />
                    <p>{msg.fileContent.fileName}</p>
                  </div>
                  <p>
                    {`Size: ${convertSize(msg.fileContent.fileSize)}`}
                  </p>
                </div>
              ) : msg.fileContent.fileExtension.toLowerCase() === "jpeg" || msg.fileContent.fileExtension.toLowerCase() === "jpg" || msg.fileContent.fileExtension.toLowerCase() === "png" ? (
                <>
                  <img
                    src={msg.fileContent.fileUrl}
                    alt={msg.fileContent.fileName}
                    className={styles.imageData}
                  />
                  <p
                    style={{ color: 'white', position: 'absolute', top: '15px', left: '20px', background: "black", padding: '0px 7px', borderRadius: '5px' }}
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
                  <p>
                    {`Size: ${convertSize(msg.fileContent.fileSize)}`}
                  </p>
                </div>
              )
              }
              <p>{msg.fileContent.textContent}</p>
            </div>
          </>
        ) : msg.messageType === "Text" ? (
          <>
            {msg.replyOn !== null && <Taggedmsg userData={userData} msg={msg} />}
            <p style={{ fontWeight: '500' }}>{msg.textContent}</p>
          </>
        ) : null}

        {msg.isDeleted === false && (
          <button
            className={`${styles.msgMenuBtn} ${userData._id === msg.sender && styles.msgMenuSenderBtn
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
              className={`${styles.msgActionsWrapper} ${userData._id === msg.sender && styles.msgSenderActionsWrapper
                }`}
              // style={{ display: isMsgMenuActive ? "flex" : "none" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ type: "spring", bounce: 0.25 }}
            >
              <button
                onClick={() => {
                  setReply(msg)
                }}
              >
                <VscReply />
                Reply
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(msg.textContent);
                  toast.success("Message copied", {
                    position: "top-right",
                  });
                }}
              >
                <IoCopyOutline />
                Copy
              </button>
              {msg.sender === userData._id && (
                <button
                  onClick={() => {
                    handleDeleteMsg(msg.conversation, msg._id ,messages , setMessages)
                  }}
                >
                  <AiOutlineDelete />
                  Delete
                </button>
              )}
              {msg.messageType === "File" && <button>
                <a
                  href={msg.fileContent.fileUrl}
                  download={msg.fileContent.fileName}
                >
                  <AiOutlineDownload />
                  Download
                </a>
              </button>}
            </motion.div>
          )}
        </AnimatePresence>
        <p style={{ alignSelf: "flex-end", marginRight: "-25px", fontSize: "13px" }} >{moment(msg.createdAt).format('LT')}</p>
      </div>

      <p style={{ alignSelf: userData._id === msg.sender ? "flex-end" : "flex-start", fontSize: "13px" }} >{new Date(msg.createdAt).toDateString()}</p>
    </>
  )
}

export default MainChat;
