import React, { useEffect } from "react";
import { VscClose } from "react-icons/vsc";
import styles from "../../../../../styles/applicants.module.scss";

export const JobApplicantModal = ({ setIsModalOpen, applicantDetail }) => {
  const {
    name,
    email,
    phoneNumber,
    whatsappNumber,
    downloadUrl,
    isHired,
    aboutQuestion,
  } = applicantDetail;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={styles.modalWrapper}
      id="applicantModal"
      initial={{ opacity: 0, y: -200, }}
      animate={{ opacity: 1, y: 0, }}
      exit={{ opacity: 0, y: 400, scale: 0.995 }}
      transition={{ type: "spring", bounce: 0.45, duration: 0.8 }}
    >
      <div className={styles.modalBoxWrapper}>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{email}</td>
            </tr>
            <tr>
              <th>Phone number</th>
              <td>{phoneNumber}</td>
            </tr>
            <tr>
              <th>Whatsapp number</th>
              <td>{whatsappNumber}</td>
            </tr>
            <tr>
              <th>Hired Status</th>
              <td>{isHired}</td>
            </tr>
            <tr>
              <th>Hired Reason</th>
              <td>{aboutQuestion}</td>
            </tr>
            <tr>
              <th>Resume</th>
              <td>
                <a href={downloadUrl} className="btnDark btn--small">
                  Download Resume
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <button className={styles.modalCloseButton} onClick={handleCloseModal}>
          <VscClose />
        </button>
      </div>
    </div>
  );
};
