import React, { forwardRef, memo } from "react";
import styles from "../../styles/message.module.scss";

export const MessageWrapper = forwardRef(({ children, isOwnMessage = false, style, isSelectionOn }, ref) => {
    return (
        <div ref={ref} style={style} className={`${styles.messageMainWrapper} ${isOwnMessage ? styles.ownMessage : ""}`} data-reaction-show={isSelectionOn}>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>{children}</div>
        </div>
    );
});

export default memo(MessageWrapper);
