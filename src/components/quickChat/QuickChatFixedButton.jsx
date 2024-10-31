import React, { memo, useContext } from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import Lottie from "lottie-react";
import { QuickChatUserContext } from "../../context/QuickChatUserContext";
import chatBubblesJson from "../../assets/lotties/quick-chat-bubble.json";
import styles from "../../styles/quickChat.module.scss";

const QuickChatFixedButton = () => {
  const { isQuickChatVisible, setIsQuickChatVisible } =
    useContext(QuickChatUserContext);

  return (
    <div className={styles.quickChatFixedButtonContainer}>
      <a
        className={styles.quickChatFixedButton}
        href="https://wa.me/+917481020076?text=Hi"
        target="_blank"
        // onClick={() => setIsQuickChatVisible(!isQuickChatVisible)}
      >
        <IoLogoWhatsapp size={24} color="#fff" />

        {/* {isQuickChatVisible ? (
          <IoClose size={24} color="var(--gray-50)" />
        ) : (
          <Lottie
            animationData={chatBubblesJson}
            loop
            style={{ width: "44px", height: "44px" }}
          />
        )} */}
        {/* <span>{isQuickChatVisible ? "Close Chat" : "Ready to Chat?"}</span> */}
        <span>{"Chat on WhatsApp"}</span>
      </a>
    </div>
  );
};

export default memo(QuickChatFixedButton);
