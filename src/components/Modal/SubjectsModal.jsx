import React, { useEffect, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import glassStyles from "../../styles/glass.module.scss";
import styles from "../../styles/modal.module.scss";
import api, { getAccessToken } from "../../services/api";

export const SubjectsModal = ({
	clickedUserDetail,
	setIsConfirmModalOpen,
	successCallback,
	refetch,
	setClickedUserDetails,
}) => {
	// console.log("clickedUserDetail", clickedUserDetail);
	let { userType, _id, subjects } = clickedUserDetail;

	const [allSubjects, setAllSubjects] = useState([]);

	const handleApproveSubject = async (index, status) => {
		// const subject = subjects[index];
		console.log(status);
		const subjectId = index;
		const body = {
			tutorId: clickedUserDetail?._id,
			subjectId: index,
			status: status == "Approve" ? true : false,
		};

		console.log("body", body);

		const res = await api.post("/tutor/approve-subject", body, {
			headers: getAccessToken(),
		});
		setClickedUserDetails(res.data);
		// setIsConfirmModalOpen(false);

		setAllSubjects(res.data.verifiedSubjects);

		console.log("body", res.data);
		try {
		} catch (error) {
			console.log("error", error);
		}
	};

	const handleSuccessCallback = () => {
		if (refetch && typeof refetch === "function") {
			successCallback(_id, refetch);
		} else {
			successCallback(_id);
		}
		setIsConfirmModalOpen(false);
	};
	const handleCloseModal = () => {
		setIsConfirmModalOpen(false);
		console.log("No, keep it");
	};

	const modalRef = useClickOutside(handleCloseModal);

	useEffect(() => {
		let data = [];

		console.log("clickedUserDetail", clickedUserDetail);

		if (clickedUserDetail?.verifiedSubjects?.length > 0) {
			setAllSubjects(clickedUserDetail?.verifiedSubjects);
		} else {
			let dem;
			console.log("subjects", subjects);
			subjects?.map((subject) => {
				console.log("subject", subject);
				dem = {
					name: subject,
					verified: true,
				};

				data.push(dem);
			});
			setAllSubjects(data);
		}

		console.log("subjects", subjects);
	}, []);
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
			<div className={glassStyles.modalWrapper}>
				<div ref={modalRef} className={glassStyles.tableModalBoxWrapper}>
					<div className={glassStyles.tableWrapper}>
						<table className={glassStyles.table} id="jobTable">
							<thead>
								<tr>
									<th>Sr. No</th>
									<th>Subject</th>
									<th>Status</th>
									{clickedUserDetail?.verifiedSubjects.length > 0 ? <th>Action</th> : null}
									{/* <th>Action</th> */}
								</tr>
							</thead>
							<tbody>
								{allSubjects?.map((subject, index) => {
									return (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>{subject.name}</td>
											<td>{subject.verified ? "Approved" : "Un-Approved"}</td>

											{clickedUserDetail?.verifiedSubjects.length > 0 ? (
												<td>
													{subject.verified ? (
														<button
															className="btnDanger btn--small"
															type="primary"
															onClick={() => handleApproveSubject(subject.name, "UnApprove")}
														>
															Un-Approve
														</button>
													) : (
														<button
															className="btnSuccess btn--small"
															type="primary"
															onClick={() => handleApproveSubject(subject.name, "Approve")}
														>
															Approve
														</button>
													)}
												</td>
											) : null}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			{/* <div className={styles.modalBoxWrapper} ref={modalRef}>
				<div>
					<h3>Subjects</h3>
					<p>
						{subjects.map((subject, index) => {
							if (typeof subject === "object" && subject.hasOwnProperty("verified")) {
								// Render subject with status and approval button
								const { _id, verified, ...subjectData } = subject;
								const subjectName = Object.values(subjectData)
									.filter((prop) => typeof prop === "string")
									.join("");
								return (
									<div style={{ display: "flex", alignItems: "center" }}>
										<span key={index} style={{ marginRight: "5%" }}>
											{index + 1}) {subjectName} (Status: {verified ? "Approved" : "Pending"})
										</span>
										<button
											className="btnSuccess btn--medium"
											type="primary"
											onClick={() => handleApproveSubject(subject?._id)}
										>
											Approve
										</button>
									</div>
								);
							} else {
								// Render subject without status and approval button
								return (
									<span key={index} style={{ marginRight: "5%" }}>
										{index + 1}) {subject}
									</span>
								);
							}
						})}
					</p>
				</div>
				<div>
					<button className="btnInfo btn--medium" onClick={handleCloseModal}>
						Close
					</button>
				</div>
			</div> */}
		</>
	);
};
