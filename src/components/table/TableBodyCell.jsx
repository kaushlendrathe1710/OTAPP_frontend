import React from 'react';
import styles from "../../styles/table.module.scss";

const TableBodyCell = ({ children, customStyles }) => {
  return (
    <div style={customStyles} className={styles.TableBodyCell}>{children}</div>
  )
}

export default TableBodyCell;