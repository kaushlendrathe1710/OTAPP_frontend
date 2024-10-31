import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import styles from "../../../styles/dashboardHeader.module.scss";
import userContext from "../../../context/userContext";

export const DashboardHeader = ({ userData }) => {
  // const { socket, userData } = useContext(userContext);
  console.log(userData);

  // const handle = () => {
  // };
  return (
    <header className={styles.header}>
      <div className={styles.bgChangeWrapper}>
        <button className="btnNeutral btn--small" onClick={handle}>
          Change background
        </button>
      </div>
    </header>
  );
};
