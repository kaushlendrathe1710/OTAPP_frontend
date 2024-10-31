import React, { memo, useContext } from "react";
import { motion } from "framer-motion";
import { useClickOutside } from "../../hooks/useClickOutside";
import { MessageMediaViewModalContext } from "../../context/MessageMediaViewModalContext";
import {
  imageFileExtensions,
  videoFileExtensions,
} from "../../../constants/helpers";
import styles from "../../styles/message.module.scss";

const MESSAGE_IMAGE_WIDTH = 280;

const MessageMediaViewModal = () => {
  const { options, hanldeCloseMessageMediaViewModal } = useContext(
    MessageMediaViewModalContext
  );
  const { top, left, fileContent } = options;
  const modalRef = useClickOutside(hanldeCloseMessageMediaViewModal);

  let initial = {
    y: top,
    x: Math.max(0, left - MESSAGE_IMAGE_WIDTH * 3.5),
    width: MESSAGE_IMAGE_WIDTH,
    height: MESSAGE_IMAGE_WIDTH,
  };
  return (
    fileContent && (
      <div className={styles.messageMediaViewModalContainer}>
        <motion.div
          ref={modalRef}
          initial={{ ...initial }}
          animate={{ x: 0, y: 0, scale: 1, width: "", height: "" }}
          transition={{
            type: "spring",
            bounce: 0.05,
            duration: 0.75,
          }}
          className={styles.modalView}
        >
          {imageFileExtensions.includes(fileContent?.fileExtension) ? (
            <img src={fileContent?.fileUrl} alt="message media view" />
          ) : videoFileExtensions.includes(fileContent?.fileExtension) ? (
            <video controls preload="metadata">
              <source
                src={`${fileContent?.fileUrl}`}
                type={fileContent?.fileType}
              />
            </video>
          ) : null}
        </motion.div>
      </div>
    )
  );
};

export default memo(MessageMediaViewModal);
