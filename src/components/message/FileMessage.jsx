import React, { memo, useContext, useRef } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { MessageMediaViewModalContext } from "../../context/MessageMediaViewModalContext";
import {
  videoFileExtensions,
  imageFileExtensions,
  audioFileExtensions,
} from "../../../constants/helpers";
import formatFileSize from "../../lib/formatFileSize";
import DocumentTypeIcon from "../DocumentTypeIcon";
import sliceText from "../../lib/sliceText";
import styles from "../../styles/message.module.scss";

const FileMessage = ({ fileContent, isOwnMessage = false }) => {
  const { hanldeShowMessageMediaViewModal } = useContext(
    MessageMediaViewModalContext
  );
  const ref = useRef(null);

  function onMediaFileClick() {
    const { top, left } = ref.current.getBoundingClientRect();
    hanldeShowMessageMediaViewModal({
      top: top,
      left: left,
      fileContent,
      isOwnMessage,
    });
  }
  return imageFileExtensions.includes(
    fileContent?.fileExtension?.toLowerCase()
  ) ? (
    <div className={styles.mediaFileMessage} onClick={onMediaFileClick}>
      <img
        ref={ref}
        src={fileContent.fileUrl}
        width={280}
        height={270}
        alt="image"
        loading="lazy"
      />
    </div>
  ) : videoFileExtensions.includes(
      fileContent?.fileExtension?.toLowerCase()
    ) ? (
    <div className={styles.mediaFileMessage} onClick={onMediaFileClick}>
      <div className={styles.thumbnailWrapper}>
        <img
          ref={ref}
          src={fileContent?.thumbnail}
          width={280}
          height={270}
          alt="thumbnail"
          loading="lazy"
        />
        <div className={styles.playIconWrapper}>
          <BsFillPlayFill size={44} fill="white" />
        </div>
      </div>
    </div>
  ) : (
    // : audioFileExtensions.includes(
    //     fileContent?.fileExtension?.toLowerCase()
    //   ) ? (
    //   <div className={styles.audioFileMessage}>Audio file</div>
    // )
    <a href={fileContent?.fileUrl} download={true} className={styles.defaultFileMessageWrapper} title="Download file">
      <div className={styles.defaultFileMessage}>
        <div className={styles.left}>
          <DocumentTypeIcon documentType={fileContent?.fileExtension} />
        </div>
        <div className={styles.right}>
          <b title={fileContent?.originalFileName}>
            {sliceText(fileContent?.originalFileName, 18)}
          </b>
          <span>
            {formatFileSize(fileContent?.fileSize)},{" "}
            {fileContent?.fileExtension?.toUpperCase()} Document
          </span>
        </div>
      </div>
    </a>
  );
};

export default memo(FileMessage);

{
  /* <video
  ref={ref}
  // src={fileContent?.fileUrl}
  width={280}
  height={270}
  // autoPlay={false}
  // muted
  controls
  preload="metadata"
>
  <source src={`${fileContent?.fileUrl}#t=0.5`} type={fileContent?.fileType} />
</video>; */
}
