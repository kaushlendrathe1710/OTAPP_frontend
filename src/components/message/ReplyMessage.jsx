import React, { memo } from "react";
import PropTypes from "prop-types";
import { MESSAGE_TYPE } from "../../../constants/helpers";
import sliceText from "../../lib/sliceText";
import styles from "../../styles/message.module.scss";

export const REPLY_MESSAGE_HEIGHT = 72;

const ReplyMessage = ({ replyMessage, onReplyMessageClick = ()=>{} }) => {
  return (
    <div
      className={styles.replyMessageContainer}
      style={{ height: REPLY_MESSAGE_HEIGHT }}
      onClick={()=>onReplyMessageClick(replyMessage)}
    >
      <div className={styles.replyMessage}>
        <div className={styles.replyMessageHeader}>
          <b>
            {replyMessage?.fromAdmin?.name ||
              replyMessage?.fromQuickChatUser?.phoneNumber ||
              "No name"}
          </b>
        </div>
        <div className={styles.replyMessageContent}>
          <p>
            {sliceText(
              replyMessage?.textContent ||
                (replyMessage?.fileContent?.textContent !== "" &&
                  `📁 ${replyMessage?.fileContent?.textContent}`) ||
                (replyMessage?.messageType === MESSAGE_TYPE.file &&
                  "📁 File message") ||
                (replyMessage?.messageType === MESSAGE_TYPE.voice &&
                  "🎤 Voice message") ||
                "",
              40
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

ReplyMessage.propTypes = {
  replyMessage: PropTypes.object.isRequired,
};

export default memo(ReplyMessage);
