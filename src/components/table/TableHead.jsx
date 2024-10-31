import React from "react";
import styles from "../../styles/table.module.scss";

const TableHead = ({ children, width, height, style }) => {
  const propStyles = {
    width: width || "100%",
    height: height || "64px",
  };
  return <div style={{...propStyles, ...style}} className={styles.TableHead}>{children}</div>;
};

export default TableHead;