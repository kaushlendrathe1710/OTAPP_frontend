import React, { useState, useEffect, useContext } from "react";
import glassStyles from "../../../../../styles/glass.module.scss";
import utilStyles from "../../../../../styles/utils.module.scss";
import styles from "../../../../../styles/student.module.scss";
import { useQuery } from "react-query";
import api, { getAccessToken } from "../../../../../services/api";
import { Loader1 } from "../../../../Loaders/Loader1";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { ConfirmModal } from "../../../../Modal/ConfirmModal";
import { toast } from "react-hot-toast";
import { Create_CoAdmin_SubAdmin as EditAdminModal } from "./Create_CoAdmin_SubAdmin";
import userContext from "../../../../../context/userContext";

const TABS = [
	{
		label: "All",
		value: "all",
	},
	{
		label: "Super-Admin",
		value: "super-admin",
	},
	{
		label: "Admin",
		value: "admin",
	},
	{
		label: "Co-Admin",
		value: "co-admin",
	},
	{
		label: "Sub-Admin",
		value: "sub-admin",
	},
];

export const ViewAllAdmins = ({ isAdminComponent }) => {
	const [currentActiveTab, setCurrentActiveTab] = useState(TABS[0].label);
	async function fetchAdmins(tab) {
		const res = await api.get(`/admin/get-all-admin/${tab}`, {
			headers: {
				Authorization: getAccessToken(),
			},
		});
		console.log(res.data);
		return res.data;
	}

	const { userData } = useContext(userContext);

	const { data, isLoading, isError, isRefetching, refetch } = useQuery(
		["allAdmins", currentActiveTab],
		() => {
			return fetchAdmins(currentActiveTab);
		},
		{
			refetchOnWindowFocus: false,
		}
	);

	const [currentlyMappedAdmins, setCurrentlyMappedAdmins] = useState([]);
	const [allAdmins, setAllAdmins] = useState([]);
	const [isTableScrolled, setIsTableScrolled] = useState(false);
	// search states
	const [searchInput, setSearchInput] = useState("");
	// modal states
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [clickedUserDetail, setClickedUserDetail] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const handleEdit = (user) => {
		setClickedUserDetail(user);
		setIsEditModalOpen(!isEditModalOpen);
	};

	useEffect(() => {
		if (currentActiveTab.toLowerCase() === "all") {
			setAllAdmins(data);
		}
		setCurrentlyMappedAdmins(data);
	}, [data]);

	useEffect(() => {
		refetch();
	}, [currentActiveTab]);

	useEffect(() => {
		function getSearchedAdmins() {
			const filterDataByAdminName = allAdmins?.filter(({ name }) => {
				return name.toLowerCase().includes(searchInput);
			});
			const filterDataByEmail = allAdmins?.filter(({ email }) => {
				return email.toLowerCase().includes(searchInput);
			});
			const filterDataByUserType = allAdmins?.filter(({ userType }) => {
				return userType.toLowerCase().includes(searchInput);
			});
			const filterDataByWhatsappNumber = allAdmins?.filter(({ whatsappNumber }) => {
				return whatsappNumber.toLowerCase().includes(searchInput);
			});
			const filterDataByPhoneNumber = allAdmins?.filter(({ phoneNumber }) => {
				return phoneNumber.toLowerCase().includes(searchInput);
			});
			let allConcatData = filterDataByAdminName
				.concat(filterDataByEmail)
				.concat(filterDataByUserType)
				.concat(filterDataByWhatsappNumber)
				.concat(filterDataByPhoneNumber);
			const allFilterData = Array.from(new Set(allConcatData));
			// console.log("allFilterData: ", allFilterData);
			setCurrentlyMappedAdmins(allFilterData);
		}
		if (searchInput !== "") {
			getSearchedAdmins();
		} else {
			setCurrentlyMappedAdmins(data);
		}
	}, [searchInput, data]);

	const handleDeleteAdmin = (_id) => {
		// console.log(`admin id: ${id}`);
		api
			.delete(`/admin/delete-permanently?admin_id=${_id}`)
			.then(() => {
				refetch();
				toast.success("Admin deleted successfully", {
					duration: 4000,
				});
			})
			.catch((e) => {
				console.log(e);
				toast.error("Something went wrong\nPlease try again", {
					duration: 4000,
				});
			});
	};

	const handleUpdateAdmin = (data) => {
		// update the admin where admin._id == data._id

		setCurrentlyMappedAdmins((prev) => {
			return prev.map((admin) => {
				if (admin._id === data._id) {
					return data;
				}
				return admin;
			});
		});
	};

	if (isLoading)
		return (
			<div className={styles.loaderWrapper}>
				<Loader1 />
			</div>
		);
	if (isError)
		return (
			<div className={styles.loaderWrapper}>
				<div>
					<h2>{isError?.message || "Some error occured."}</h2>
					<br />
					<Link to={-1} className="btnDark btn--medium">
						Go back
					</Link>
				</div>
			</div>
		);

	const handleConfirmModal = (userDetail) => {
		setClickedUserDetail(userDetail);
		setIsConfirmModalOpen(true);
	};

	return (
		<div className="outletContainer">
			{isEditModalOpen && (
				<EditAdminModal
					user={clickedUserDetail}
					isEdit={true}
					setIsEditModalOpen={setIsEditModalOpen}
					successCallback={handleUpdateAdmin}
				/>
			)}
			{isConfirmModalOpen && (
				<ConfirmModal
					clickedUserDetail={clickedUserDetail}
					setIsConfirmModalOpen={setIsConfirmModalOpen}
					successCallback={handleDeleteAdmin}
				/>
			)}

			<h2 className={utilStyles.headingLg}>All Admins</h2>
			<header className={glassStyles.tabsWrapper}>
				{TABS.map(({ label, value }, i) => {
					return (
						<div
							key={i}
							className={`${glassStyles.tab} ${
								currentActiveTab === label && glassStyles.activeTab
							}`}
							title={label}
							onClick={() => setCurrentActiveTab(label)}
						>
							{label}
						</div>
					);
				})}
			</header>
			<div className={glassStyles.searchSection}>
				<div>
					<h3 className={glassStyles.totalCountHeading}>
						Total {currentActiveTab.toLowerCase() === "all" ? "All Admins" : `${currentActiveTab}`}:{" "}
						{currentlyMappedAdmins?.length}
					</h3>
				</div>
				<div className={`${glassStyles.inputWrapper} ${glassStyles.searchWrapper}`}>
					<input
						type="text"
						placeholder="Search here"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<button title="Search">
						<BiSearch />
					</button>
				</div>
			</div>
			{/* // table wrapper */}
			<div
				className={glassStyles.tableWrapper}
				onScroll={(e) => {
					if (e.target.scrollTop > 0) {
						setIsTableScrolled(true);
					} else {
						setIsTableScrolled(false);
					}
				}}
				is-table-long="true"
			>
				<table className={glassStyles.table} id="jobTable">
					<thead className={`${isTableScrolled && glassStyles.scrolledTableHead}`}>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Phone number</th>
							<th>Whatsapp number</th>
							<th>Admin type</th>
							{isAdminComponent ? null : <th>Actions</th>}
						</tr>
					</thead>
					<tbody>
						{isRefetching ? (
							<span className={glassStyles.insideTableLoaderWrapper}>
								<Loader1 />
							</span>
						) : currentlyMappedAdmins?.length !== 0 ? (
							currentlyMappedAdmins?.map((userDetail, i) => {
								let { name, email, phoneNumber, whatsappNumber, userType, _id } = userDetail;
								return (
									<tr key={i}>
										<td>{name}</td>
										<td>{email}</td>
										<td>{phoneNumber}</td>
										<td>{whatsappNumber === "" ? phoneNumber : whatsappNumber}</td>
										<td>{userType}</td>
										{isAdminComponent ? null : (
											<td aria-controls="actions">
												{userData.userType === "Super-Admin" ? (
													<button
														className="btnInfo btn--small"
														onClick={() => handleEdit(userDetail)}
													>
														Edit
													</button>
												) : null}

												<button
													className="btnDanger btn--small"
													onClick={() => handleConfirmModal(userDetail)}
												>
													Delete
												</button>
											</td>
										)}
									</tr>
								);
							})
						) : (
							<span className={glassStyles.insideTableLoaderWrapper}>
								<h2>0 Admin</h2>
							</span>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
