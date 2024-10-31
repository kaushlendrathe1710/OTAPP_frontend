import React from "react";
import Lottie from "lottie-react";
import DefaultChatAnimationJSON from "../../assets/lotties/default-chat-animation.json";
import chatStyles from "../../styles/chat.module.scss";

const DefaultMainChatIndex = () => {
  return (
    <div className={`${chatStyles.defaultChatDetailContainer} ${chatStyles.bgBlur}`}>
      {/* <div> */}
      <Lottie
        animationData={DefaultChatAnimationJSON}
        loop
        style={{ width: 160, filter: "hue-rotate(45deg)" }}
      />
      <p>
        To initiate a conversation with any chat participant, simply click on
        their name. Also, you can use the <b>search field</b> to find users to chat with
        by entering their names.
      </p>
      {/* </div> */}
    </div>
  );
};

export default DefaultMainChatIndex;
