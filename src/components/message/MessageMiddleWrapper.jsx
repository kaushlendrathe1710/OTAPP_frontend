import React, { memo, useCallback, useContext, useEffect } from "react";
import { MessageReactionInfoModalContext } from "../../context/MessageReactionInfoModalContext";

import styles from "../../styles/message.module.scss";
import MessageToggleReactions from "./MessageToggleReactions";

const MessageMiddleWrapper = ({
    message,
    reactions = [],
    messageMiddleWrapperMaxWidth = "auto",
    isOwnMessage = false,
    isPreviousMessageSenderSame = false,
    onRightClick = () => {},
    handleClickedReaction,
    children,
    isSelectionOn,
    handleForwardMessageSelection,
}) => {
    const { hanldeShowMessageReactionInfoModal } = useContext(MessageReactionInfoModalContext);

    const onReactionsClick = useCallback(
        (e) => {
            hanldeShowMessageReactionInfoModal({
                top: e.clientY,
                left: e.clientX,
                isOwnMessage,
                reactions,
            });
        },
        [hanldeShowMessageReactionInfoModal]
    );
    return (
        <div
            style={{
                display: "flex",
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                marginBottom: reactions.length > 0 ? "1.2rem" : "",
                alignSelf: isOwnMessage && !isNaN(messageMiddleWrapperMaxWidth) && "flex-end",
            }}
        >
            <div className="checkbox">{isSelectionOn && <input type="checkbox" name={message?._id} id={message?._id} onChange={(e) => handleForwardMessageSelection(e, message)} />}</div>
            {isOwnMessage && <MessageToggleReactions isOwnMessage={isOwnMessage} handleClickedReaction={handleClickedReaction} />}
            <div
                className={styles.messageMiddleWrapper}
                data-own-message={isOwnMessage}
                data-previous-message-sender-same={isPreviousMessageSenderSame}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onRightClick(e);
                }}
                style={{ maxWidth: messageMiddleWrapperMaxWidth }}
            >
                <div>{children}</div>

                {reactions.length > 0 && (
                    <div className={styles.reactionsContainer} data-own-message={isOwnMessage} onClick={onReactionsClick}>
                        {reactions.slice(0, 4).map((reaction, i) => {
                            return <span key={i}>{reaction?.reaction}</span>;
                        })}
                        {reactions.length > 4 && <span>{`+${reactions.length - 4}`} </span>}
                    </div>
                )}
            </div>
            {!isOwnMessage && <MessageToggleReactions isOwnMessage={isOwnMessage} handleClickedReaction={handleClickedReaction} />}
        </div>
    );
};

export default memo(MessageMiddleWrapper);
