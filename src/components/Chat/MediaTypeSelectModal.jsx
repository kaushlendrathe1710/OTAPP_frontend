import React, { memo, useContext } from "react";
import { motion } from "framer-motion";
import {
  IoDocumentTextOutline,
  IoImageOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import chatStyles from "../../styles/chat.module.scss";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ChatSendingDataPreviewModalContext } from "../../context/ChatSendingDataPreviewModalContext";

const MediaTypeSelectModal = ({
  visibility = false,
  handleClose = () => {},
  handleSendMessage = () => {},
}) => {
  const attachmentMenuRef = useClickOutside(handleClose);
  const {
    handleShowChatSendingDataPreviewModal,
    handleUpdateActiveAttachmentFile,
  } = useContext(ChatSendingDataPreviewModalContext);

  /**
   *
   * @param {InputEvent} e
   */
  const handleSelectFiles = (e) => {
    if (e.target.files[0]) {
      let newSelectedFiles = Array.from(e.target.files).map((file) => {
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          fileUrl: URL.createObjectURL(file),
          file: file,
          caption: "",
        };
      });
      handleShowChatSendingDataPreviewModal({
        attachmentFiles: newSelectedFiles,
        activeAttachmentFile: newSelectedFiles[0],
        handleSendMessageClick: handleSendMessage,
      });
      handleClose();
    }
  };

  return (
    visibility && (
      <motion.div
        ref={attachmentMenuRef}
        className={chatStyles.attachmentMenuWrapper}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.25 }}
      >
        <label htmlFor="attachments">
          <IoImageOutline />
          Image
          <input
            type="file"
            id="attachments"
            accept="image/*"
            multiple
            title="Add file"
            onChange={handleSelectFiles}
          />
        </label>
        <label htmlFor="attachmentsVideo">
          <IoVideocamOutline />
          Video
          <input
            type="file"
            id="attachmentsVideo"
            multiple
            title="Add file"
            onChange={handleSelectFiles}
          />
        </label>
        <label htmlFor="attachmentsDocs">
          <IoDocumentTextOutline />
          Document
          <input
            type="file"
            id="attachmentsDocs"
            multiple
            title="Add file"
            onChange={handleSelectFiles}
          />
        </label>
      </motion.div>
    )
  );
};

export default memo(MediaTypeSelectModal);
