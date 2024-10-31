import React, {
  useCallback,
  useState,
  memo,
  useEffect,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/homepage.module.scss";
import VerifyUser from "./VerifyUser";
import MainChat from "./MainChat";
import api from "../../services/api";
import { Loader1 } from "../Loaders/Loader1";
import { QuickChatUserContext } from "../../context/QuickChatUserContext";

const USER_TYPES = {
  tutor: "Tutor",
  student: "Student",
};

const QuickChat = ({ visibility = false }) => {
  const { quickChatUser, setQuickChatUser, isAuthLoading } =
    useContext(QuickChatUserContext);
  const [userType, setUserType] = useState(
    sessionStorage.getItem("home-chat-user-type")
  );
  const [isContinue, setIsContinue] = useState(false);

  const handleSelectUserType = useCallback((userType) => {
    setUserType(userType);
  }, []);

  const handleContinue = useCallback(() => {
    if (!userType) {
      return;
    }
    sessionStorage.setItem("home-chat-user-type", userType);
    setIsContinue(true);
  }, [userType]);

  const handleSaveQuickChatUser = useCallback((user) => {
    setQuickChatUser(user);
  }, []);

  return (
    <AnimatePresence>
      {visibility ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, x: 100, y: 100 }}
          animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, x: 100, y: 100 }}
          transition={{ type: "spring", duration: 0.7 }}
          className={styles.homeChatModalContainer}
        >
          {isAuthLoading ? (
            <Loader1 />
          ) : quickChatUser !== null ? (
            <MainChat user={quickChatUser} />
          ) : !isContinue ? (
            <div className={styles.userDescribeContainer}>
              <div>
                <h3>Which describes you best?</h3>
                <p>This will help us personalize your experience.</p>
              </div>
              <div>
                <button
                  className={styles.userSelectBtn}
                  onClick={() => handleSelectUserType(USER_TYPES.student)}
                  data-select={userType === USER_TYPES.student}
                >
                  <img src="https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/32/null/external-student-modern-education-and-knowledge-power-flatart-icons-lineal-color-flatarticons.png" />
                  I am a Student
                </button>
                <button
                  className={styles.userSelectBtn}
                  onClick={() => handleSelectUserType(USER_TYPES.tutor)}
                  data-select={userType === USER_TYPES.tutor}
                >
                  <img src="https://img.icons8.com/external-nawicon-flat-nawicon/32/null/external-teacher-back-to-school-nawicon-flat-nawicon.png" />
                  I am a Tutor
                </button>
                <button
                  className="btnPrimary btn--medium"
                  onClick={handleContinue}
                  disabled={!userType}
                  style={{ marginTop: "0.5rem" }}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <VerifyUser userType={userType} getUser={handleSaveQuickChatUser} />
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default memo(QuickChat);
