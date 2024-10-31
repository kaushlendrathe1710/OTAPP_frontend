import React from 'react';
import styles from "../../styles/loaders.module.scss";

export const Loader1 = ({size = 48}) => {
  return (
    <span className={styles.loader1} style={{width: size, height: size}}></span>
  )
}
