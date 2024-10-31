import React, { useEffect, useState } from 'react'
import styles from '../../../../../../styles/GroupInfo.module.scss'
import ListOfParticipants from '../ListOfParticipants'

const AdminGroupInfo = ({ setToggleInfo, toggleInfo, singleGroupInfo }) => {

    const [clickedInfo, setClickedInfo] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.getElementById("mainSidebar").style.zIndex = "0";
        document.getElementById("mainSidebarButton").style.zIndex = "0";
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
            document.getElementById("mainSidebar").style.zIndex = "100";
            document.getElementById("mainSidebarButton").style.zIndex = "101";
        };
    }, []);

    const handleOpenModal = (data) => {
        setClickedInfo(data);
        setIsModalOpen(true);
    }

    return (
        <>
            <div className={`${styles.infoWrapper} ${toggleInfo === false && styles.closeInfoWrapper}`}>
                <button className={styles.closeModalBtn} onClick={() => setToggleInfo(false)}>
                    &times;
                </button>
                <div className={styles.infoContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <th>Group Name</th>
                                <td>{singleGroupInfo?.groupName}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>{singleGroupInfo?.isActive === true ? "Active" : "In Active"}</td>
                            </tr>
                            <tr>
                                <th>No. Of Participants</th>
                                <td>{singleGroupInfo?.admins?.length}</td>
                            </tr>
                            <tr>
                                <th>Admins</th>
                                <td>{singleGroupInfo?.admins?.length}</td>
                            </tr>
                            <tr>
                                <th>Admins Names</th>
                                <td>{singleGroupInfo?.admins?.map((item, index) => {
                                    return (
                                        <p key={item._id}>
                                            {index <= 4 && item.name }
                                        </p>
                                    )
                                })}
                                    {singleGroupInfo?.admins?.length > 5 && (
                                        <p className={styles.viewAll} onClick={() => handleOpenModal(singleGroupInfo?.admins)}>
                                            view all {singleGroupInfo?.admins?.length} Participants
                                        </p>
                                    )}
                                </td>
                            </tr>
                            <tr className={styles.lastElement}>
                                <th>Description</th>
                                <td>{singleGroupInfo?.groupDescription}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {isModalOpen && <ListOfParticipants clickedInfo={clickedInfo} setIsModalOpen={setIsModalOpen} />}
            </div>
        </>
    )
}

export default AdminGroupInfo
