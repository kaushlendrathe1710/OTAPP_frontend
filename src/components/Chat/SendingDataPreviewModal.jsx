import React, { memo, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiSend } from "react-icons/fi";
import { ChatSendingDataPreviewModalContext } from "../../context/ChatSendingDataPreviewModalContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import { uniqBy } from "lodash";
import { ActivityLoader } from "../Loaders/ActivityLoader";
import {
  audioFileExtensions,
  imageFileExtensions,
  videoFileExtensions,
} from "../../../constants/helpers";
import chatStyles from "../../styles/chat.module.scss";
import messageStyles from "../../styles/message.module.scss";
import DocumentTypeIcon from "../DocumentTypeIcon";
import formatFileSize from "../../lib/formatFileSize";
import Waveform from "../audio/Waveform";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

const MODAL_HEIGHT = 480;
const CHAT_INPUT_HEIGHT = 40;

const SendingDataPreviewModal = ({}) => {
  const {
    options,
    handleCloseChatSendingDataPreviewModal,
    handleUpdateAttachmentFiles,
    handleUpdateActiveAttachmentFile,
    setIsLoading,
  } = useContext(ChatSendingDataPreviewModalContext);
  const {
    top,
    left,
    width,
    attachmentFiles,
    activeAttachmentFile,
    isLoading,
    handleSendMessageClick,
  } = options;
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const modalRef = useClickOutside(
    isLoading ? () => {} : handleModalOutsideClick
  );
  const [correctPostion, setCorrectPostion] = useState({
    top: top,
    left: left,
  });

  const [activeAttachmentFileState, setActiveAttachmentFileState] =
    useState(activeAttachmentFile);
  useEffect(() => {
    if (attachmentFiles.length === 0) {
      handleCloseChatSendingDataPreviewModal();
    }
  }, [attachmentFiles]);

  useEffect(() => {
    setActiveAttachmentFileState(activeAttachmentFile);
  }, [activeAttachmentFile]);

  useEffect(() => {
    if (options) {
      let fromTop = top;
      let fromLeft = left;
      let newTop = top;
      let newLeft = left;
      //   if (windowHeight - fromTop < MODAL_HEIGHT) {
      //     newTop = windowHeight - MODAL_HEIGHT;
      //   }
      if (windowWidth <= width) {
        newLeft = 0;
      } else if (windowWidth - fromLeft < width) {
        newLeft = windowWidth - (width + 20);
      }
      setCorrectPostion((prev) => ({ top: newTop, left: newLeft }));
    }
  }, [options, windowWidth]);

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
      let uniqueFiles = uniqBy(
        [...attachmentFiles, ...newSelectedFiles],
        "name"
      );
      handleUpdateAttachmentFiles(uniqueFiles);
      handleUpdateActiveAttachmentFile(
        uniqueFiles[Math.max(0, attachmentFiles.length)] || uniqueFiles[0]
      );
      //   setAttachmentFiles((prev) => [...prev, ...newSelectedFiles]);
      //   setActiveAttachmentFile(newSelectedFiles[0]);
    }
  };

  const handleOnCaptionChange = (caption) => {
    handleUpdateActiveAttachmentFile({ ...activeAttachmentFileState, caption });
    let updatedFilesWithCaption = attachmentFiles.map((file) => {
      return file?.name === activeAttachmentFileState?.name
        ? { ...file, caption }
        : file;
    });
    handleUpdateAttachmentFiles(updatedFilesWithCaption);
  };
  const handleRemoveFile = (removedFile) => {
    let removedFileIndex = attachmentFiles.findIndex(
      (file) => file?.name === removedFile?.name
    );
    let filterFiles = attachmentFiles.filter(
      (file) => file?.name !== removedFile?.name
    );
    handleUpdateAttachmentFiles(filterFiles);
    console.log("removedFileIndex: ", removedFileIndex);
    if (
      removedFile?.name === activeAttachmentFileState?.name &&
      filterFiles.length > 0
    ) {
      let nextActiveAttachmentFile =
        filterFiles[Math.max(0, removedFileIndex - 1)] || filterFiles[0];
      console.log("nextActiveAttachmentFile: ", nextActiveAttachmentFile);
      handleUpdateActiveAttachmentFile(nextActiveAttachmentFile);
      setActiveAttachmentFileState(nextActiveAttachmentFile);
    }
  };

  const handleSendClick = async () => {
    if (attachmentFiles.length === 0) return;
    setIsLoading(true);
    try {
      await handleSendMessageClick(attachmentFiles);
    } catch (err) {
      console.log("This error occured while sending media messages: ", err);
    } finally {
      setIsLoading(false);
      handleCloseChatSendingDataPreviewModal();
    }
  };

  function handleModalOutsideClick() {
    if (window.confirm("Discard unsent message? ")) {
      handleUpdateAttachmentFiles([]);
      handleUpdateActiveAttachmentFile(null);
    } else {
      console.log("no");
    }
  }
  return (
    attachmentFiles.length !== 0 && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.25 }}
        className={chatStyles.sendingDataPreviewModalContainer}
      >
        {isLoading && (
          <div className={chatStyles.loadingLayer}>
            <ActivityLoader size={180} />
            <h5>Sending messages, please wait...</h5>
          </div>
        )}
        <div
          ref={modalRef}
          style={{
            top: top - (MODAL_HEIGHT - CHAT_INPUT_HEIGHT) || "",
            bottom: !top ? "12px" : "",
            left: correctPostion.left || "",
            width,
          }}
          className={chatStyles.sendingDataPreviewModal}
        >
          {/* active attachment file preview */}
          <div className={chatStyles.filePreviewWrapper}>
            {imageFileExtensions.includes(
              activeAttachmentFile?.name?.split(".").pop()
            ) ? (
              <img
                src={activeAttachmentFileState?.fileUrl}
                alt="Preview file"
              />
            ) : videoFileExtensions.includes(
                activeAttachmentFile?.name?.split(".").pop()
              ) ? (
              <video controls preload="metadata">
                <source
                  src={`${activeAttachmentFile?.fileUrl}`}
                  type={activeAttachmentFile?.type}
                />
              </video>
            ) : audioFileExtensions.includes(
                activeAttachmentFile?.name?.split(".").pop()
              ) ? (
              <Waveform url={activeAttachmentFile?.fileUrl} width={380} />
            ) : (
              <div className={chatStyles.defaultFileWrapper}>
                <div className={chatStyles.defaultFile}>
                  <div className={chatStyles.left}>
                    <DocumentTypeIcon
                      documentType={activeAttachmentFile?.name
                        ?.split(".")
                        .pop()}
                      docuemntSvgSize={74}
                      docuemntSvgColor="var(--gray-800)"
                      width={74}
                      height={70}
                    />
                  </div>
                  <div className={chatStyles.right}>
                    <b>{activeAttachmentFile?.name}</b>
                    <span>
                      {formatFileSize(activeAttachmentFile?.size)},{" "}
                      {activeAttachmentFile?.name
                        ?.split(".")
                        .pop()
                        ?.toUpperCase()}{" "}
                      Document
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={chatStyles.captionWrapper}>
            <input
              type="text"
              value={activeAttachmentFileState?.caption}
              onChange={(e) => handleOnCaptionChange(e.target.value)}
              placeholder="Caption (optional)"
            />
          </div>
          <div className={chatStyles.footer}>
            <div className={chatStyles.previewFilesNavigation}>
              {attachmentFiles.map((file) => {
                return (
                  <div
                    key={file?.name}
                    role="button"
                    tabIndex={0}
                    className={chatStyles.file}
                    data-active={file?.name === activeAttachmentFileState?.name}
                    onClick={() => {
                      handleUpdateActiveAttachmentFile(file);
                    }}
                  >
                    {imageFileExtensions.includes(
                      file?.name?.split(".").pop()
                    ) ? (
                      <img src={file?.fileUrl} alt="Preview file" />
                    ) : videoFileExtensions.includes(
                        file?.name?.split(".").pop()
                      ) ? (
                      <video preload="metadata">
                        <source src={`${file?.fileUrl}`} type={file?.type} />
                      </video>
                    ) : (
                      <div className={chatStyles.defaultFileWrapper}>
                        <div className={chatStyles.defaultFile}>
                          <div className={chatStyles.left}>
                            <DocumentTypeIcon
                              documentType={file?.name?.split(".").pop()}
                              docuemntSvgSize={44}
                              docuemntSvgColor="var(--gray-600)"
                              docuemntSvgStrokeWidth={0}
                              width={44}
                              height={40}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <button onClick={() => handleRemoveFile(file)}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className={chatStyles.optionsWrapper}>
              <button className={chatStyles.addFile} title="Add file">
                <label htmlFor="attachmentsDocs">
                  <FiPlus size={24} />
                  <input
                    type="file"
                    id="attachmentsDocs"
                    multiple
                    title="Add file"
                    onChange={handleSelectFiles}
                  />
                </label>
              </button>
              <button
                className={chatStyles.send}
                title="Send"
                onClick={handleSendClick}
              >
                <FiSend size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  );
};

export default memo(SendingDataPreviewModal);
