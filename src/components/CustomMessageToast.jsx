import { memo } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

import styles from "../styles/toast.module.scss";
import sliceText from "../lib/sliceText";

function CustomMessageToast({
  t,
  title = "New Message",
  description = "A new message",
  redirectLink,
}) {
  const navigate = useNavigate();

  const handleViewBtn = () => {
    navigate(redirectLink);
    toast.dismiss(t.id);
  };
  return (
    <div
      className={`${styles.customChatMessageToast} ${
        t.visible ? styles.slideLeft : styles.slideRight
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 12 12"
        className={styles.icon}
      >
        <path
          fill="currentColor"
          d="M1 6a5 5 0 1 1 2.59 4.382l-1.944.592a.5.5 0 0 1-.624-.624l.592-1.947A4.98 4.98 0 0 1 1 6Zm3-.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5ZM4.5 7a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2Z"
        ></path>
      </svg>
      <div className={styles.metaData}>
        <h5 className={styles.toastTitle}>{sliceText(title, 16)}</h5>
        <p className={styles.toastDescription}>{description}</p>
      </div>
      <div className={styles.toastActions}>
        <button
          className="btnPrimary btn--small"
          onClick={handleViewBtn}
        >
          View
        </button>
        <button
          className={styles.dismissBtn}
          onClick={() => toast.dismiss(t.id)}
        >
          <VscClose />
        </button>
      </div>
    </div>
  );
}

export default memo(CustomMessageToast);
