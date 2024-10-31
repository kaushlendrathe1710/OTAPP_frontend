import React, { useContext, useCallback, useEffect } from "react";
import VerifyUser from "../quickChat/VerifyUser";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import userContext from "../../context/userContext";
import { QuickChatUserContext } from "../../context/QuickChatUserContext";
import glassStyles from "../../styles/glass.module.scss";

const LeadUserPopup = ({ popupCloseCallback = () => {} }) => {
  const { userData: loggedUser } = useContext(userContext);
  const { quickChatUser, setQuickChatUser } = useContext(QuickChatUserContext);
  const { width } = useWindowDimensions();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSaveQuickChatUser = useCallback((user) => {
    setQuickChatUser(user);
    popupCloseCallback();
  }, []);

  if (quickChatUser || loggedUser) {
    popupCloseCallback();
  }

  return (
    <div
      className={glassStyles.modalWrapper}
      style={{
        backdropFilter: "blur(10px) saturate(120%)",
      }}
    >
      <div
        className={glassStyles.modalBoxWrapper}
        style={{
          maxWidth: "600px",
          minHeight: "fit-content",
          background: "linear-gradient(135deg, #ffeeff, #e4f1ff)",
          marginTop: "4rem",
          padding: "0.5rem 0.5rem 1.5rem 0.5rem",
        }}
      >
        <div className={glassStyles.header}>
          <h3
            style={{
              fontSize: "1.95rem",
              fontWeight: "800",
              color: "var(--primary-500)",
            }}
          >
            Join us
          </h3>
          <button className="btnDark btn--small" onClick={popupCloseCallback}>
            Close
          </button>
        </div>
        <div className={glassStyles.formWrapper}>
          <h3 style={{ marginBottom: "0.75rem", fontSize: "1.45rem" }}>
            Hi Student
          </h3>
          <VerifyUser
            studentLandingPageForm={true}
            userType={"Student"}
            getUser={handleSaveQuickChatUser}
            showLabeling={true}
            otpSendButtonText="Free Assistance"
            contentContainerStyle={{ padding: width < 425 ? "0" : "" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadUserPopup;
