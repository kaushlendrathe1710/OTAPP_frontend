import React, { useContext, memo, useState, useEffect } from "react";
import moment from "moment/moment";
import { TbChecks } from "react-icons/tb";
import { MessageReadInfoModalContext } from "../../context/MessageReadInfoModalContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import styles from "../../styles/message.module.scss";

const MODAL_HEIGHT = 170; // keep 10px more than original
const MODAL_WIDTH = 220; // "  "  "  "  "
const GUTTER_SIZE = 8;
const PADDING = 12;
const REACTION_HEIGHT = 40;

function getModalHeight(totalReactions) {
    return totalReactions * (REACTION_HEIGHT + GUTTER_SIZE) + PADDING + 10;
}

export const MessageReadInfoModal = () => {
    const { options, hanldeCloseMessageReadInfoModal } = useContext(MessageReadInfoModalContext);
    const { top, left, isOwnMessage, readBy } = options;
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const modalRef = useClickOutside(hanldeCloseMessageReadInfoModal);

    const [correctPostion, setCorrectPostion] = useState({
        top: top,
        left: left,
    });

    useEffect(() => {
        if (options) {
            let MODAL_HEIGHT = getModalHeight(readBy.length);
            let fromTop = top;
            let fromLeft = left;
            let newTop = top;
            let newLeft = left;
            if (windowHeight - fromTop < MODAL_HEIGHT) {
                newTop = windowHeight - MODAL_HEIGHT;
            }
            if (windowWidth - fromLeft < MODAL_WIDTH) {
                newLeft = windowWidth - MODAL_WIDTH;
            }
            setCorrectPostion((prev) => ({ top: newTop, left: newLeft }));
        }
    }, [options]);
    return (
        top &&
        left &&
        readBy.length > 0 && (
            <div ref={modalRef} style={{ top: correctPostion?.top, left: correctPostion?.left }} className={styles.messageReactionInfoModalWrapper}>
                {readBy.map((readBy, i) => {
                    return (
                        <div key={i} className={styles.reactionWrapper}>
                            <span>
                                <TbChecks color="var(--success-500)" size={16} />
                            </span>
                            <div>
                                <h6>
                                    {readBy?.readBy?.name ||
                                        readBy?.readByAdmin?.name ||
                                        readBy?.readByQuickChatUser?.phoneNumber ||
                                        readBy?.readByStudent?.name ||
                                        readBy?.readByTutor?.name ||
                                        "No name"}
                                </h6>
                                <span>{moment(readBy?.readAt).calendar()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    );
};
