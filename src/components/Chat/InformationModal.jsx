import React, { useEffect, useState, useContext, useCallback, memo, useRef } from "react";
import toast from "react-hot-toast";
import { useClickOutside } from "../../hooks/useClickOutside";
import userContext from "../../context/userContext";
import styles from "../../styles/createGroupModal.module.scss";
import glassStyles from "../../styles/glass.module.scss";
import groupChatStyles from "../../styles/groupChat.module.scss";
import AddUserCard from "./AddUserCard";
import List from "../list/List";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import api from "../../services/api";
import { useQuery } from "react-query";
import AddAdmins from "../list/AddAdmins";
import { useNavigate } from "react-router-dom";

function InformationModal({ handleClose, user }) {
	const modalRef = useRef();

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

	return (
		<>
			<div className={`${glassStyles.modalWrapper}`} style={{ height: "fit-content" }}>
				<div
					style={{
						maxWidth: "620px",
						padding: "1rem 1.2rem 1.5rem 1.25rem",
						maxHeight: "20vh !important",
					}}
					className={glassStyles.modalBoxWrapper}
					ref={modalRef}
				>
					<div className={styles.header}>
						<h2 className={styles.modalTitle}>{user?.userType} Info</h2>
						<button className="btnDark btn--small" onClick={handleClose}>
							Close
						</button>
					</div>
					<div className={styles.userInfo}>
						<p>
							<strong>Name:</strong> {user?.name}
						</p>
						<p>
							<strong>Email:</strong> {user?.email}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
export default memo(InformationModal);
