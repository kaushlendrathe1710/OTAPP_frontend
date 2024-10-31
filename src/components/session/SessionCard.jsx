import React from "react";
import styles from "../../styles/session.module.scss";

export const SessionCard = ({ imgUrl }) => {
  return (
    <div className={styles.sessionCard}>
      <div className={styles.wImg}>
        <img
          src={imgUrl || "https://img.icons8.com/ios/300/null/whiteboard.png"}
          alt="session image"
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.pImg}>
          <img
            src={
              "https://img.icons8.com/material-sharp/48/null/user.png"
            }
            alt="w img"
          />
        </div>
        <div className={styles.info}>
          <h4 className={styles.title}>Session Title</h4>
          <p className={styles.date}>26 Jan, 2023</p>
        </div>
      </div>
    </div>
  );
};
