import React from 'react';
import styles from "../../styles/table.module.scss";

const TableWrapper = ({children, width, height, minHeight, maxHeight, marginTop}) => {
    const propStyles = {
        width: width || "100%",
        height: height || "100%",
        minHeight: minHeight || "70vh",
        maxHeight: maxHeight || "90vh",
        marginTop: marginTop || "2rem",
    }
  return (
    <div style={propStyles} className={styles.TableWrapper}>{children}</div>
  )
}
export default TableWrapper;