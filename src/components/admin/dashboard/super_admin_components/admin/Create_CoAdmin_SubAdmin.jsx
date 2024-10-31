import React, { useContext, useEffect, useState } from "react";
import styles from "../../../../../styles/CreateAdmin.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import utilStyles from "../../../../../styles/utils.module.scss";
import toast from "react-hot-toast";
import userContext from "../../../../../context/userContext";
import CountryCode from "../../../../dropDown/CountryCode";
import api from "../../../../../services/api";

export const Create_CoAdmin_SubAdmin = ({
	isAdminComponent,
	isEdit = false,
	setIsEditModalOpen,
	user,
	successCallback,
}) => {
	const { userData } = useContext(userContext);
	const [createData, setCreateData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phoneNumber: "",
		userType: "",
	});
	const [phoneCountryData, setPhoneCountryData] = useState("");

	useEffect(() => {
		console.log(user);
		if (user) {
			setCreateData({
				name: user.name,
				email: user.email,
				password: user.password,
				confirmPassword: user.password,
				phoneNumber: user.phoneNumber,
				userType: user.userType,
			});
			setPhoneCountryData(user.phoneCountry);
		}
	}, [user]);

	const handelInputChanged = (e) => {
		setCreateData({ ...createData, [e.target.name]: e.target.value });
	};

	const handelFormSubmit = async (e) => {
		e.preventDefault();
		if (isEdit) {
			const fieldsToCheck = ["name", "email", "userType", "phoneNumber"];
			const changedData = {};

			const isPasswordChanged = createData.password !== user.password;

			fieldsToCheck.forEach((field) => {
				if (createData[field] !== user[field] && createData[field] !== undefined) {
					changedData[field] = createData[field];
				}
			});

			if (Object.keys(changedData).length === 0 && !isPasswordChanged) {
				toast.success(`No changes were made`, {
					duration: 4000,
					position: "top-center",
					style: { border: "2px solid var(--success-color)" },
				});
				setIsEditModalOpen(false);
				return;
			}

			const data = {
				...changedData,
				isPasswordChanged,
				admin_id: user._id,
			};

			console.log(data);
			try {
				const res = await api.post(`/admin/update`, data);
				successCallback(res.data);
				toast.success(`Admin updated successfully`, {
					duration: 4000,
					position: "top-center",
					style: { border: "2px solid var(--success-color)" },
				});
				setIsEditModalOpen(false);
			} catch (err) {
				const error = err?.response;
				let message = "";

				if (error) {
					if (error.status === 422) {
						message = error.data.validationError.map((item) => item.msg).join(", ");
					} else if (error.status === 500) {
						message = error.data.message;
					}
				}
				toast.error(message, {
					duration: 4000,
					position: "top-center",
					style: { border: "2px solid var(--danger-color)" },
				});
			}
		} else {
			if (createData.password !== createData.confirmPassword) {
				toast.error("Password Didn't Match", {
					duration: 4000,
					position: "top-center",
					style: { border: "2px solid var(--danger-color)" },
				});
			} else {
				const data = {
					name: createData.name,
					email: createData.email,
					password: createData.password,
					phoneNumber: createData.phoneNumber,
					userType: createData.userType,
					phoneCountry: phoneCountryData.id,
					whatsappCountry: "",
					whatsappNumber: "",
				};

				try {
					const res = await api.post("/admin/create", data);

					toast.success(`${res.data?.userType} created successfully`, {
						duration: 4000,
						position: "top-center",
						style: { border: "2px solid var(--success-color)" },
					});
					setCreateData({
						name: "",
						email: "",
						password: "",
						confirmPassword: "",
						phoneNumber: "",
						userType: "",
					});
					setPhoneCountryData("");
				} catch (err) {
					// setLoading(false)
					const error = err?.response;
					let message = "";
					if (error) {
						if (error.status === 422) {
							const len = error.data.validationError.length;
							error.data.validationError.forEach(
								(item, i) => (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
							);
						} else if (error.status === 403) {
							message = error.data.message;
						} else if (error.status === 409) {
							message = error.data.message;
						}
					}
					if (message) {
						toast.error(message, {
							duration: 4000,
							position: "top-center",
							style: { border: "2px solid var(--danger-color)" },
						});
					} else {
						toast.error(err.message, {
							duration: 4000,
							position: "top-center",
							style: { border: "2px solid var(--danger-color)" },
						});
					}
				}
			}
		}
	};

	return (
		<div className={isEdit ? `${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}` : ""}>
			{!isEdit && (
				<div className={styles.headerWrapper}>
					<h2 className={utilStyles.headingLg}>Create_CoAdmin_SubAdmin</h2>
				</div>
			)}

			<div className={styles.createCoAdminFormWrapper}>
				{isEdit && (
					<div
						className={styles.header}
						style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
					>
						<h3 className={styles.modalTitle}>Edit Admin</h3>
						<button className="btnDark btn--small" onClick={() => setIsEditModalOpen(false)}>
							Close
						</button>
					</div>
				)}
				<form onSubmit={handelFormSubmit}>
					<div className={glassStyles.inputWrapper}>
						<label htmlFor="name">Name</label>
						<input
							required
							value={createData.name}
							name="name"
							id="name"
							onChange={handelInputChanged}
							placeholder="Enter Name"
							type="text"
						/>
					</div>
					<div className={glassStyles.inputWrapper}>
						<label htmlFor="email">Email</label>
						<input
							required
							value={createData.email}
							name="email"
							id="email"
							onChange={handelInputChanged}
							placeholder="Enter Email"
							type="email"
						/>
					</div>
					<div className={glassStyles.inputWrapper}>
						<label htmlFor="password">Password</label>
						<input
							required
							value={createData.password}
							name="password"
							id="password"
							onChange={handelInputChanged}
							placeholder="Enter Password"
							type="password"
						/>
					</div>
					<div className={glassStyles.inputWrapper}>
						<label htmlFor="confirmPassword">Confirm Password</label>
						<input
							required
							value={createData.confirmPassword}
							name="confirmPassword"
							id="confirmPassword"
							onChange={handelInputChanged}
							placeholder="Confirm Password"
							type="password"
						/>
					</div>
					<div className={styles.countryCodeInputContainer}>
						<label htmlFor="phoneNumber">Mobile Number</label>
						<div className={`${styles.countryCodeInput}`}>
							<CountryCode data={phoneCountryData} setData={setPhoneCountryData} />
							<input
								required
								value={createData.phoneNumber}
								name="phoneNumber"
								id="phoneNumber"
								onChange={handelInputChanged}
								placeholder="Enter Mobile Number"
								type="text"
							/>
						</div>
					</div>
					<div className={styles.inputContainerRadio}>
						<label htmlFor="name">Admin Type</label>
						<div className={styles.radioInput}>
							<div>
								<label htmlFor="Co-Admin">Co-Admin</label>
								<input
									required
									checked={createData.userType === "Co-Admin"}
									value="Co-Admin"
									name="userType"
									onChange={handelInputChanged}
									type="radio"
								/>
							</div>
							<div>
								<label htmlFor="Co-Admin">Sub-Admin</label>
								<input
									required
									checked={createData.userType === "Sub-Admin"}
									value="Sub-Admin"
									name="userType"
									onChange={handelInputChanged}
									type="radio"
								/>
							</div>
							{userData?.userType === "Super-Admin" && !isAdminComponent && (
								<div>
									<label htmlFor="Co-Admin">Admin</label>
									<input
										required
										checked={createData.userType === "Admin"}
										value="Admin"
										name="userType"
										onChange={handelInputChanged}
										type="radio"
									/>
								</div>
							)}
						</div>
					</div>
					<div className={styles.inputContainer}>
						<button className="btnPrimary btn--large">Submit</button>
					</div>
				</form>
			</div>
		</div>
	);
};
