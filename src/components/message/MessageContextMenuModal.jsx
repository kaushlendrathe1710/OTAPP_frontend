import React, { useContext, useState, useEffect } from "react";
import { IoReturnUpForwardOutline } from "react-icons/io5";
import { HiOutlineReply } from "react-icons/hi";
import { Delete, DeleteFour, Copy } from "@icon-park/react";

import { MessageContextMenuModalContext } from "../../context/MessageContextMenuModalContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import styles from "../../styles/message.module.scss";

const MODAL_HEIGHT = 170; // keep 10px more than original
const MODAL_WIDTH = 190; // "  "  "  "  "

export const MessageContextMenuModal = () => {
    const { options, hanldeCloseMessageContextMenuModal, hanldeShowMessageContextMenuModal } = useContext(MessageContextMenuModalContext);
    const { top, left, isOwnMessage, handleForwardMessage, handleDeleteMessageForMe, handleDeleteMessageForEveryone, handleCopyMessage, handleReplyMessage } = options;

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const modalRef = useClickOutside(hanldeCloseMessageContextMenuModal);

    const [correctPostion, setCorrectPostion] = useState({
        top: top,
        left: left,
    });

    useEffect(() => {
        if (options) {
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
        left && (
            <div ref={modalRef} style={{ top: correctPostion?.top, left: correctPostion?.left }} className={styles.messageContextMenuModalWrapper}>
                <button onClick={handleReplyMessage}>
                    <HiOutlineReply size={18} color={"var(--gray-700)"} />
                    Reply
                </button>
                <button onClick={handleCopyMessage}>
                    <Copy theme="outline" size={18} fill={"#666666"} /> Copy
                </button>
                <button onClick={handleForwardMessage}>
                    <IoReturnUpForwardOutline size={18} color={"var(--gray-700)"} />
                    Forward
                </button>
                <button onClick={handleDeleteMessageForMe}>
                    <DeleteFour theme="outline" size={18} fill={"#666666"} /> Delete for me
                </button>
                {isOwnMessage && (
                    <button style={{ color: "var(--danger-400)" }} onClick={handleDeleteMessageForEveryone}>
                        <Delete theme="outline" size={18} fill={"var(--danger-300)"} />
                        Delete for everyone
                    </button>
                )}
            </div>
        )
    );
};
