import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import styles from "../../../styles/dashboard.module.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { TutorSidebar } from "../left_sidebar/TutorSidebar";
import userContext from "../../../context/userContext";
import unsplashImages from "../../../assets/backgrounds/unsplash_backgrounds";

export const TutorBlocked = () => {
  const navigate = useNavigate();
  const [isSidebarCollapse, setIsSidebarCollapse] = useState(false);
  const { userData } = useContext(userContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallWindow, setIsSmallWindow] = useState(false);
  const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
  const [currentBg, setCurrentBg] = useState(
    unsplashImages[Math.floor(Math.random() * unsplashImages.length - 1)]
  );

  // useEffect(() => {
  //     console.log("userData", userData);
  //     if (userData.isReviewed === false) {
  //         navigate("/tutor/dashboard/review");
  //     }
  // }, [userData]);

  useLayoutEffect(() => {
    if (windowInnerWidth < 990 && windowInnerWidth > 768) {
      setIsSidebarCollapse(true);
    } else {
      setIsSidebarCollapse(false);
    }
    const handleWindowInnerWidth = (e) => {
      setWindowInnerWidth(e.target.innerWidth);
    };
    window.addEventListener("resize", handleWindowInnerWidth);

    return () => {
      window.removeEventListener("resize", handleWindowInnerWidth);
    };
  }, [windowInnerWidth]);

  useEffect(() => {
    if (windowInnerWidth <= 768) {
      setIsSmallWindow(true);
    } else {
      setIsSmallWindow(false);
    }
  }, [windowInnerWidth]);
  return (
    <div className="outletContainer">
      <h4>You are blocked by Admin. Contact admin to unblock</h4>

      {/* <TutorSidebar
                isSidebarCollapse={isSidebarCollapse}
                setIsSidebarCollapse={setIsSidebarCollapse}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isSmallWindow={isSmallWindow}
            /> */}
      {/* <div className={styles.historyButtonsWrapper}>
                <button className={styles.previousButton} title="Go back" onClick={() => navigate(-1)}>
                    <BsArrowLeftShort />
                </button>
                <button className={styles.previousButton} title="Go next" onClick={() => navigate(1)}>
                    <BsArrowRightShort />
                </button>
            </div>
            <div className={styles.sidebarHeader}>
                <div className={styles.left}>
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <AiOutlineMenu />
                    </button>
                    
                </div>
            </div>
            <div className={styles.mainDetailWrapper} style={{ left: isSidebarCollapse ? "90px" : "280px" }}>
                <Outlet />
            </div> */}
    </div>
  );
};

export default TutorBlocked;
