import React, { memo, useContext, useState } from "react";
import { VscSmiley } from "react-icons/vsc";
import { MessageReactionsMenuModalContext } from "../../context/MessageReactionsMenuModalContext";
import { useClickOutside } from "../../hooks/useClickOutside";

import styles from "../../styles/message.module.scss";

const MessageToggleReactions = ({
  isOwnMessage,
  handleClickedReaction = () => {},
}) => {
  const {
    hanldeShowMessageReactionsMenuModal,
    hanldeCloseMessageReactionsMenuModal,
  } = useContext(MessageReactionsMenuModalContext);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const reactionsRef = useClickOutside(hanldeCloseReactionModal);
  function hanldeCloseReactionModal() {
    setReactionModalVisible(false);
  }

  function hanldeReaction(reaction) {
    handleClickedReaction(reaction);
    hanldeCloseMessageReactionsMenuModal();
  }
  function hanldeOpenReactionModal(e) {
    setReactionModalVisible(true);
    hanldeShowMessageReactionsMenuModal({
      top: e.clientY,
      left: e.clientX,
      hanldeReaction,
    });
  }
  return (
    <div
      ref={reactionsRef}
      className={styles.messageToggleReactions}
      data-own-message={isOwnMessage}
    >
      {!reactionModalVisible && (
        <button
          className={styles.reactionToggleBtn}
          onClick={hanldeOpenReactionModal}
          data-own-message={isOwnMessage}
        >
          <VscSmiley size={20} color={"var(--gray-600)"} />
        </button>
      )}
    </div>
  );
};

export default memo(MessageToggleReactions);
