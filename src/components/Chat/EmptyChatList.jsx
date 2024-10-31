import React, { memo } from "react";
import styles from "../../styles/chat.module.scss";
import doubleChatImg from "../../assets/img/double-chats.png";

const EmptyChatList = ({ message }) => {
  return (
    <div className={styles.emptyChatList}>
      <img src={doubleChatImg} width={80} />
      <div>
        <p>{message || "Conversation list is empty."}</p>
      </div>
    </div>
  );
};

export default memo(EmptyChatList);
