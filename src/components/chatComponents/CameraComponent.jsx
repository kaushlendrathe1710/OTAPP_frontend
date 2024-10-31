import React from 'react'
import styles from '../../styles/chatComponents.module.scss'
import Camera from '../camera/Camera'

const CameraComponent = ({ setCameraState, setAttachmentFiles , setFileData }) => {
    return (
        <div className={styles.camera}>
            <div className={styles.header}>
                <button onClick={() => setCameraState(false)}>&times;</button>
                <h3>Take Photo</h3>
            </div>
            <Camera setAttachmentFiles={setAttachmentFiles} setFileData={setFileData} />
        </div>
    )
}

export default CameraComponent
