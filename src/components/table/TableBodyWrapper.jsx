import React from 'react';
import styles from "../../styles/table.module.scss";

const TableBodyWrapper = ({ children, width, height, positionTop, style, onScroll = ()=>{} }) => {
    const propStyles = {
        width: width || "100%",
        height: height || "",
        top: positionTop || "64px",
      };
  return (
    <div style={{...propStyles, ...style}} className={styles.TableBodyWrapper} onScroll={onScroll}>{children}</div>
  )
}

export default TableBodyWrapper