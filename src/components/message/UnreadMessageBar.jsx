import React, { memo } from "react";
import styles from "../../styles/message.module.scss";

export const UNREAD_MESSAGE_BAR_HEIGHT = 40;

export const UnreadMessageBar = memo(({ unreadMessagesCount = 0 }) => {
  return (
    <div className={styles.unreadMessageBarContainer}>
      <div className={styles.unreadMessageBar}>
        <i>
          {unreadMessagesCount} Unread{" "}
          {unreadMessagesCount > 1 ? "messages" : "message"}
        </i>
      </div>
    </div>
  );
});
