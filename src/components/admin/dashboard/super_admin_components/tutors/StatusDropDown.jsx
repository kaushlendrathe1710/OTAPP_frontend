import React, { useState } from "react";
import styles from "../../../../../styles/Payment.module.scss";

const StatusDropDown = ({ currentStatus, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState(currentStatus);

  const handleSelect = (e) => {
    const status = e.target.value;
    console.log(currentStatus, status);
    if (status !== currentStatus) {
      setNewStatus(status);
      setShowModal(true);
    }
  };

  const handleConfirm = async () => {
    let ans = await onChange(newStatus);
    // console.log(ans);
    // if (ans) {
    //   setNewStatus(newStatus);
    // } else {
    //   setNewStatus(currentStatus);
    // }
    setShowModal(false);
  };

  const handleCancel = () => {
    setNewStatus(currentStatus);
    setShowModal(false);
  };

  return (
    <div className={styles.dropdownContainer}>
      <select
        className={styles.dropdown}
        value={newStatus}
        onChange={handleSelect}
      >
        <option value="Paid">Paid</option>
        <option value="Un-Paid">Un-Paid</option>
      </select>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to change the status?</p>
            <button className={styles.modalButton} onClick={handleConfirm}>
              Yes
            </button>
            <button className={styles.modalButton} onClick={handleCancel}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropDown;
