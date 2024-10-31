import React from 'react';
import styles from "../../styles/table.module.scss";

const TableRow = ({ children, customStyles }) => {
  return (
    <div style={customStyles} className={styles.TableRow}>{children}</div>
  )
}

export default TableRow