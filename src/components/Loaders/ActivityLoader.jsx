import React from "react";
import Lottie from "lottie-react";
import loaderData from "../../assets/lotties/activity-loader.json";
import styles from "../../styles/loaders.module.scss";

export const ActivityLoader = ({ size = 100 }) => {
  return (
    <div className={styles.activityLoader}>
      <Lottie
        animationData={loaderData}
        loop
        style={{ width: size, height: Math.round(size / 2) }}
      />
    </div>
  );
};
