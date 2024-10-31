import React from 'react'
import styles from '../../styles/ChatAdmin.module.scss'
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { FcDocument } from "react-icons/fc";

const Taggedmsg = ({ userData, msg }) => {

    let user

    if (msg?.replyOn?.fromStudent) {
        user = msg.replyOn?.fromStudent
    }
    else if (msg?.replyOn?.fromTutor) {
        user = msg.replyOn?.fromTutor
    }
    else if (msg?.replyOn?.fromAdmin) {
        user = msg.replyOn?.fromAdmin
    }

    return (
        <div className={`${styles.tagContainer} ${msg.sender === userData?._id && styles.tagContainerSender}`}>
            {msg.replyOn?.messageType === "Text" ? (
                <>
                    {msg.replyOn?.sender === userData?._id ? <h6>You</h6> : <h6>{user?.name}</h6>}
                    <p>{msg.replyOn?.textContent}</p>
                </>
            ) : (
                <div className={styles.replyOnFile}>
                    <div>
                        {msg.replyOn?.sender === userData?._id ? <h6>You</h6> : <h6>{user?.name}</h6>}
                        <p>File</p>
                    </div>
                    {msg.replyOn?.fileContent.fileExtension.toLowerCase() === "pdf" ? (
                        <BsFillFileEarmarkPdfFill className={styles.taggedFile} />
                    ) : msg.replyOn?.fileContent.fileExtension.toLowerCase() === "docs" ? (
                        <FcDocument className={styles.taggedFile} />
                    ) : msg.replyOn?.fileContent.fileExtension.toLowerCase() === "jpeg" || msg.replyOn?.fileContent.fileExtension.toLowerCase() === "jpg" || msg.replyOn?.fileContent.fileExtension.toLowerCase() === "png" ? (
                        <img src={msg.replyOn?.fileContent.fileUrl} alt="" />
                    ) : <CgFileDocument className={styles.taggedFile} />
                    }
                </div>
            )}
        </div>
    )
}

export default Taggedmsg
