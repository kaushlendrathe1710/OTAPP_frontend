import React from 'react';
import styles from "../../styles/table.module.scss";

const TableColumn = ({ children, customStyles, width }) => {
  return (
    <div style={{...customStyles, width}} className={styles.TableColumn}>{children}</div>
  )
}

export default TableColumn