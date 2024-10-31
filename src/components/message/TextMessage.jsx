import React, { memo } from 'react';
import styles from "../../styles/message.module.scss";


const TextMessage = ({text, isOwnMessage}) => {
  return (
    <p className={styles.messageText} data-own-message={isOwnMessage}>
        {text}
    </p>
  )
}

export default memo(TextMessage);