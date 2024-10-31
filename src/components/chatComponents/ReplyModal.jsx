import React from 'react'
import styles from '../../styles/ChatAdmin.module.scss'
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { FcDocument } from "react-icons/fc";

const ReplyModal = ({ reply, userData, setReply }) => {

    let replyFrom

    if (reply?.fromStudent) {
        replyFrom = reply?.fromStudent
    } else if (reply?.fromAdmin) {
        replyFrom = reply?.fromAdmin
    } else if (reply?.fromTutor) {
        replyFrom = reply?.fromTutor
    }

    return (
        <div className={styles.ReplyContainer}>
            <div className={styles.replyInfo}>
                {userData?._id === reply.sender ? <h3>You</h3> : <h3>{replyFrom?.name}</h3>}
                {reply.messageType === "File" ?
                    <>
                        <p>File</p>
                        {reply.fileContent.fileExtension.toLowerCase() === "pdf" ? (
                            <BsFillFileEarmarkPdfFill className={styles.replyfileShow} />
                        ) : reply.fileContent.fileExtension.toLowerCase() === "docx" ? (
                            <FcDocument className={styles.replyfileShow} />
                        ) : reply.fileContent.fileExtension.toLowerCase() === "jpeg" || reply.fileContent.fileExtension.toLowerCase() === "jpg" || reply.fileContent.fileExtension.toLowerCase() === "png" ? (
                            <img src={reply.fileContent.fileUrl} alt="" />
                        ) : <CgFileDocument className={styles.replyfileShow} />
                        }
                    </> :
                    <p>{reply.textContent}</p>}
            </div>
            <button
                onClick={() => { setReply('') }}
                className={styles.replyCancle}
            >
                &times;
            </button>
        </div>
    )
}

export default ReplyModal
