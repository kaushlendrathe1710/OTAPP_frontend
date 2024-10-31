import React from 'react';
import styles from './thread.module.css';

const Thread = ({userName, lastMsg}) => {
    return (
        <div className={styles.thread}>
            <h5 className={styles.userName}>{userName}</h5>
            <p className={styles.lastMsg}>{lastMsg}</p>
        </div>
    );
}

export default Thread;
