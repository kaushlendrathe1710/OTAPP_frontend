import React from "react";
import Lottie from "lottie-react";
import DefaultChatAnimationJSON from "../../assets/lotties/default-chat-animation.json";
import chatStyles from "../../styles/chat.module.scss";

const EmptyChatMessagesList = ({ message }) => {
  return (
    <div className={chatStyles.defaultChatDetailContainer}>
      <Lottie
        animationData={DefaultChatAnimationJSON}
        loop
        style={{ width: 160, filter: "hue-rotate(45deg)" }}
      />
      <p>
        {message ||
          `Chat conversation is empty.`}
      </p>
    </div>
  );
};

export default EmptyChatMessagesList;
