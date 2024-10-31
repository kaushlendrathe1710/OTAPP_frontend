import React from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { FcDocument } from 'react-icons/fc';
import styles from './documentCard.module.css'

const DocumentCard = () => {
    return (
        <div className={styles.documentCard}>
            <FcDocument /> <h5 style={{margin: '0px 10px', minWidth: '60px'}}>Document File Name</h5> <AiOutlineDownload />
        </div>
    );
}

export default DocumentCard;
