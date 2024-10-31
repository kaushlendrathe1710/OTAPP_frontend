import React from "react";
import { IoReturnUpForward } from "react-icons/io5";
import styles from "../../styles/message.module.scss";

export const MESSAGE_HEADER_VIEW_HEIGHT = 16;

const MessageHeaderView = ({ senderName = "Unkown", isForwarded = false }) => {
  return (
    <div className={styles.messageHeaderView}>
      <b>{senderName}</b> {isForwarded && <i> <IoReturnUpForward size={12} /> Forwarded</i>}
    </div>
  );
};

export default MessageHeaderView;
