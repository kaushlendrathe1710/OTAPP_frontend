import React, { useState, useEffect, useContext } from "react";
import styles from "./sessionsHistory.module.css";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import {
	TableBodyCell,
	TableBodyWrapper,
	TableHead,
	TableHeadCell,
	TableRow,
	TableWrapper,
} from "../../../table";
import ParticipentsList from "./participentsList";
import api from "../../../../services/api";
import userContext from "../../../../context/userContext";
import moment from "moment";
import { BoardContext } from "../../../../context/boardContext";
import AddUser from "../common/addUser";
import { WhiteboardDashboardContentext } from "../../../../context/whiteboardDashboardContentext";
import { toast } from "react-hot-toast";

const SessionsHistory = ({ joinClickHandler }) => {
	const { userData } = useContext(userContext);
	const { whiteboard, setWhiteboard } = useContext(BoardContext);

	const [sessionsList, setSessionsList] = useState([]);
	const [selectedSession, setSelectedSession] = useState([]);
	const [openAddUserModal, setOpenAddUserModal] = useState(false);

	const { whiteboardList, setWhiteboardList, currentTabIndex, setCurrentTabIndex } = useContext(
		WhiteboardDashboardContentext
	);

	async function fetchAllSessions() {
		let userId = userData._id,
			userType = userData.userType;
		const res = await api.get(`whiteboard/all?userId=${userId}&userType=${userType}`);
		// console.log('sessions', res);
		setSessionsList(res.data);
	}
	useEffect(() => {
		fetchAllSessions();
		return () => {};
	}, []);

	async function sessionDeleteHandler(boardId) {
		let sure = confirm("Are you sure you want to delete this session?");

		if (sure) {
			const res = await api.delete(`whiteboard/${boardId}`);
			if (res.status === 200 && res.data.deletedCount === 1) {
				fetchAllSessions();
			}
		}
	}

	function joinButtonClickHanlder(ses) {
		//setting the whiteboard in whiteboardContext
		setWhiteboard(ses);
		let tabExist = whiteboardList.filter((tab) => tab._id === ses._id); //if
		if (tabExist.length > 0) {
			joinClickHandler(ses);
			setCurrentTabIndex((prv) => {
				//finding the index of clicked whiteboard/session in whitboardList
				for (let i = 0; i < whiteboardList.length; i++) {
					let tab = whiteboardList[i];
					if (ses._id === tab._id) return i;
				}
			});
			return; //whiteboard is already open
		}
		//setting the whiteboardList, currentTab in whiteboardDashboardContext
		setWhiteboardList((prv) => [...prv, ses]);
		setCurrentTabIndex((prv) => ++prv);
		joinClickHandler(ses);
	}

	function handleShare(ses) {
		const url = `${window.location.origin}/whiteboard/${ses._id}`;

		if (url.includes("admin")) {
			const newUrl = url.replace("admin.", "");
			navigator.clipboard.writeText(newUrl);
			toast.success("Link copied to clipboard");
			return;
		}
	}

	function addUserClickHanlder(ses) {
		setOpenAddUserModal((prv) => !prv);
		setSelectedSession(ses);
	}

	return (
		<div className={styles.upcommingSessions}>
			<div style={{ padding: 5 }} className={styles.row}>
				<h3 className={styles.heading}>Upcomming Sessions</h3>
				{/* <div className={styles.row}>
                    <button className={styles.createSessionBtn}>New Session <FiPlusCircle style={{ marginLeft: 10 }} /></button>
                </div> */}
			</div>
			<div>
				<TableWrapper marginTop={"5px"}>
					<TableHead style={{ justifyContent: "space-between", padding: "2%" }}>
						<TableHeadCell style={{ minWidth: "25%" }}>Session Name</TableHeadCell>
						<TableHeadCell style={{ minWidth: "25%" }}>Duration</TableHeadCell>
						<TableHeadCell style={{ minWidth: "25%" }}>Participents</TableHeadCell>
						<TableHeadCell style={{ minWidth: "25%" }}>Actions</TableHeadCell>
					</TableHead>
					<TableBodyWrapper>
						{sessionsList?.map((ses) => (
							<TableRow
								key={ses._id}
								customStyles={{
									justifyContent: "space-between",
									padding: "0 2%",
								}}
							>
								<TableBodyCell customStyles={{ minWidth: "25%" }}>{ses.name}</TableBodyCell>
								<TableBodyCell customStyles={{ minWidth: "25%" }}>
									{moment(ses.startTimeStamp).format("h:mm a")}-{" "}
									{moment(ses.endTimeStamp).format("h:mm a")}
								</TableBodyCell>
								<TableBodyCell customStyles={{ minWidth: "25%" }}>
									<ParticipentsList
										stt={ses.startTimeStamp}
										sesId={ses._id}
										participentsList={ses.participents}
									/>
								</TableBodyCell>
								<TableBodyCell customStyles={{ minWidth: "25%" }}>
									<button
										onClick={() => joinButtonClickHanlder(ses)}
										className={styles.actionButton}
									>
										Join
									</button>
									{(userData?.userType === "Super-Admin" || userData?.userType === "Admin") && (
										<>
											<button
												onClick={() => addUserClickHanlder(ses)}
												className={styles.actionButton}
											>
												Add Users
											</button>
											<button
												onClick={() => sessionDeleteHandler(ses._id)}
												style={{ background: "var(--danger-300)" }}
												className={styles.actionButton}
											>
												Delete
											</button>
											<button
												className={styles.actionButton}
												onClick={() => {
													handleShare(ses);
												}}
											>
												Share
											</button>
										</>
									)}
								</TableBodyCell>
							</TableRow>
						))}
					</TableBodyWrapper>
				</TableWrapper>
			</div>

			{openAddUserModal && (
				<AddUser
					refresh={fetchAllSessions}
					selectedSession={selectedSession}
					setOpenModal={setOpenAddUserModal}
				/>
			)}
		</div>
	);
};

export default SessionsHistory;
