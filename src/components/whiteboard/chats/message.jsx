import React, { useContext } from "react";
import { AppContext } from "../../../context/appContext";
import userContext from "../../../context/userContext";
import styles from "./message.module.css";

const Message = ({ message }) => {
    // const { user } = useContext(AppContext);
    const userCtx = useContext(userContext);
    const user = userCtx.userData;

    let mine = user?._id === message.userId;
    let mineMsgClass = mine ? styles.myMsg : "";

    return (
        <div className={styles.msgParent} style={mine ? { alignItems: "flex-end" } : {}}>
            <p className={styles.username}>{message?.userName}</p>
            <div className={`${styles.msg} ${mineMsgClass}`}>
                <p>{message.msgText}</p>
            </div>
        </div>
    );
};

export default Message;
