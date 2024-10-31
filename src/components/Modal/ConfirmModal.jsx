import React, { useEffect } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import glassStyles from "../../styles/glass.module.scss";
import styles from "../../styles/modal.module.scss";

export const ConfirmModal = ({
  clickedUserDetail,
  setIsConfirmModalOpen,
  successCallback,
  refetch,
}) => {
  let { userType, _id } = clickedUserDetail;
  const handleSuccessCallback = () => {
    if (refetch && typeof refetch === "function") {
      successCallback(_id, refetch);
    } else {
      successCallback(_id);
    }
    setIsConfirmModalOpen(false);
  };
  const handleCloseModal = () => {
    setIsConfirmModalOpen(false);
    console.log("No, keep it");
  };

  const modalRef = useClickOutside(handleCloseModal);

  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);
  return (
    <div
      className={`${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}`}
    >
      <div className={styles.modalBoxWrapper} ref={modalRef}>
        <div>
          <h3>Are you sure to delete {userType}?</h3>
          <p>{userType} will be permanently deleted.</p>
        </div>
        <div>
          <button
            className="btnDanger btn--medium"
            onClick={handleSuccessCallback}
          >
            Yes, Delete it
          </button>
          <button className="btnInfo btn--medium" onClick={handleCloseModal}>
            No, keep it
          </button>
        </div>
      </div>
    </div>
  );
};
