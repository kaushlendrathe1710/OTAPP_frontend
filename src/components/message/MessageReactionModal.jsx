import React, { memo, useState, useEffect, useContext } from "react";
import { MessageReactionsMenuModalContext } from "../../context/MessageReactionsMenuModalContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

import styles from "../../styles/message.module.scss";

const MODAL_HEIGHT = 60; // keep 10px more than original
const MODAL_WIDTH = 330; // "  "  "  "  "

let allEmojis = ["👌", "👍", "😊", "🥰", "🙏", "😍", "💜"];

export const MessageReactionModal = memo(() => {
  const {
    options,
    hanldeShowMessageReactionsMenuModal,
    hanldeCloseMessageReactionsMenuModal,
  } = useContext(MessageReactionsMenuModalContext);

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const modalRef = useClickOutside(hanldeCloseMessageReactionsMenuModal);

  const [correctPostion, setCorrectPostion] = useState({
    top: options?.top,
    left: options?.left,
  });

  useEffect(() => {
    if (options) {
      let fromTop = options?.top - MODAL_HEIGHT;
      let fromLeft = options?.left - MODAL_WIDTH/2;
      let newTop = fromTop;
      let newLeft = fromLeft;
      if (windowWidth - fromLeft < MODAL_WIDTH) {
        newLeft = windowWidth - MODAL_WIDTH;
      }
      setCorrectPostion((prev) => ({ top: newTop, left: newLeft }));
    }
  }, [options]);
  return (
    options !== null && (
      <div
        ref={modalRef}
        className={styles.messageReactionsContainer}
        style={{ top: correctPostion?.top, left: correctPostion?.left }}
      >
        {allEmojis.map((rc, i) => {
          return <button key={i} onClick={()=>options?.hanldeReaction(rc)}>{rc}</button>;
        })}
      </div>
    )
  );
});
