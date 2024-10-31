import React from 'react';
import styles from './buttonBoxLayout.module.css'

const ButtonBoxLayout = (props) => {
    return (
        <div className={styles.buttonBox}>
            {props.children}
        </div>
    );
}

export default ButtonBoxLayout;
