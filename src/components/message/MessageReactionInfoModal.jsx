import React, { useContext, memo, useState, useEffect } from "react";
import moment from "moment/moment";
import { MessageReactionInfoModalContext } from "../../context/MessageReactionInfoModalContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import styles from "../../styles/message.module.scss";
import userContext from "../../context/userContext";

const MODAL_HEIGHT = 170; // keep 10px more than original
const MODAL_WIDTH = 220; // "  "  "  "  "
const GUTTER_SIZE = 8;
const PADDING = 12;
const REACTION_HEIGHT = 40;

function getModalHeight(totalReactions) {
  return totalReactions * (REACTION_HEIGHT + GUTTER_SIZE) + PADDING + 10;
}

export const MessageReactionInfoModal = memo(() => {
  const { options, hanldeCloseMessageReactionInfoModal } = useContext(
    MessageReactionInfoModalContext
  );
  const { top, left, isOwnMessage, reactions } = options;

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const modalRef = useClickOutside(hanldeCloseMessageReactionInfoModal);

  const [correctPostion, setCorrectPostion] = useState({
    top: top,
    left: left,
  });

  useEffect(() => {
    if (options) {
      let MODAL_HEIGHT = getModalHeight(reactions.length);
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
    reactions.length > 0 && (
      <div
        ref={modalRef}
        style={{ top: correctPostion?.top, left: correctPostion?.left }}
        className={styles.messageReactionInfoModalWrapper}
      >
        {reactions.map((reaction, i) => {
          return (
            <div key={i} className={styles.reactionWrapper}>
              <span>{reaction?.reaction}</span>
              <div>
                <h6>
                  {reaction?.reactionUser?.name ||
                    reaction?.reactionByAdmin?.name ||
                    reaction?.reactionByQuickChatUser?.phoneNumber ||
                    "No name"}
                </h6>
                <span>{moment(reaction?.updatedAt).calendar()}</span>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
});
