import React from "react";
import styles from "../../styles/auth.module.scss";

export const Stepper = ({ activeIndex }) => {
  return (
    <div className={styles.stepperWrapper}>
      <div className={`${styles.index1}  ${activeIndex >= 1 && styles.indexFill}`}>1</div>
      <div className={`${styles.index2}  ${activeIndex >= 2 && styles.indexFill}`}>2</div>
      <span
        className={styles.formProgress}
        style={{ width: activeIndex == 2 && "100%" }}
      ></span>
      <span className={styles.progressBackground}></span>
    </div>
  );
};
