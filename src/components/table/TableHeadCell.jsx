import React from "react";
import styles from "../../styles/table.module.scss";

const TableHeadCell = (props) => {
  const { children, style } = props;
  return (
    <div style={style} className={styles.TableHeadCell} {...props}>
      {children}
    </div>
  );
};

export default TableHeadCell;
