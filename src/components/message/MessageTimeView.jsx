import React, { memo, useCallback, useContext } from "react";
import moment from "moment/moment";
import { TbChecks, TbCheck } from "react-icons/tb";
import styles from "../../styles/message.module.scss";
import { MessageReadInfoModalContext } from "../../context/MessageReadInfoModalContext";

const MessageTimeView = ({
  isOwnMessage = false,
  sendTime = Date.now(),
  messageReadStatus = "delivered",
  readBy = [],
  disableMessageSeenClick = false,
}) => {
  const { hanldeShowMessageReadInfoModal } = useContext(
    MessageReadInfoModalContext
  );
  const onChecksClick = useCallback(
    (e) => {
      hanldeShowMessageReadInfoModal({
        top: e.clientY,
        left: e.clientX,
        isOwnMessage,
        readBy,
      });
    },
    [hanldeShowMessageReadInfoModal]
  );
  return (
    <div className={styles.messageTimeView} data-own-message={isOwnMessage}>
      <p title={moment(sendTime).format("LLL")}>
        {moment(sendTime).format("LT")}
      </p>
      {!isOwnMessage ? null : messageReadStatus === "delivered" ? (
        <TbCheck color="var(--gray-600)" size={16} />
      ) : (
        <TbChecks
          color={
            messageReadStatus === "readed-by-all"
              ? "var(--success-500)"
              : "var(--gray-600)"
          }
          size={16}
          role="button"
          onClick={disableMessageSeenClick ? () => {} : onChecksClick}
          cursor={!disableMessageSeenClick ? "pointer" : undefined}
        />
      )}
    </div>
  );
};

export default memo(MessageTimeView);
