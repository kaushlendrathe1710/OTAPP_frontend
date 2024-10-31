import React from 'react';
import Backdrop from './backdrop';
import styles from './modal.module.css';

const Modal = ({ children, style, setOpenModal }) => {



    return (
        <div className={styles.modalBox} style={style}>
            <Backdrop setOpenModal={setOpenModal} />
            <div className={styles.modalBody}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
