import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowWidth } from "../../../../../hooks/useWindowWidth";
import {
	TableBodyCell,
	TableBodyWrapper,
	TableColumn,
	TableHead,
	TableHeadCell,
	TableRow,
	TableWrapper,
} from "../../../../table";
import utilStyles from "../../../../../styles/utils.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import studentStyles from "../../../../../styles/student.module.scss";
import { useQuery } from "react-query";
import api, { getAccessToken } from "../../../../../services/api";
import { Loader1 } from "../../../../Loaders/Loader1";

export default function TutorPayment() {
	const navigate = useNavigate();
	async function fetchWeeklyPayment() {
		const res = await api.get("/payment/get-all-tutor-paymetn-weekly", {
			headers: {
				Authorization: getAccessToken(),
			},
		});
		// console.log("weekly payment: ", res.data);
		return res.data;
	}

	const { data, refetch, isLoading, isError } = useQuery(
		"weekly-tutors-payments",
		() => {
			return fetchWeeklyPayment();
		},
		{
			refetchOnWindowFocus: false,
		}
	);

	useEffect(() => {
		console.log(data);
	}, [data]);

	const windowWidth = useWindowWidth();

	if (isLoading)
		return (
			<div className={studentStyles.loaderWrapper}>
				<Loader1 />
			</div>
		);
	if (isError)
		return (
			<div className={studentStyles.loaderWrapper}>
				<div>
					<h2>{isError?.message || "Some error occured."}</h2>
					<br />
					<Link to={-1} className="btnDark btn--medium">
						Go back
					</Link>
				</div>
			</div>
		);
	return (
		<div className="outletContainer">
			<h2 className={utilStyles.headingLg}>Tutors Payments</h2>
			<TableWrapper>
				<TableHead>
					<TableColumn>
						<TableHeadCell>Tutor Name</TableHeadCell>
					</TableColumn>
					<TableColumn>
						<TableHeadCell>Email</TableHeadCell>
					</TableColumn>
					{windowWidth > 600 ? (
						<TableColumn>
							<TableHeadCell>Phone number</TableHeadCell>
						</TableColumn>
					) : null}
					<TableColumn customStyles={{ width: "120%" }}>
						<TableHeadCell>Actions</TableHeadCell>
					</TableColumn>
				</TableHead>
				<TableBodyWrapper>
					{data && data.length > 0 ? (
						data?.map((obj, i) => {
							if (obj.tutorId) {
								const { name, phoneNumber, email, _id } = obj?.tutorId;
								return (
									<TableRow key={i}>
										<TableColumn>
											<TableBodyCell>{name}</TableBodyCell>
										</TableColumn>
										<TableColumn>
											<TableBodyCell>{email}</TableBodyCell>
										</TableColumn>
										{windowWidth > 600 ? (
											<TableColumn>
												<TableBodyCell>{phoneNumber}</TableBodyCell>
											</TableColumn>
										) : null}
										<TableColumn customStyles={{ width: "120%" }}>
											<TableBodyCell>
												<button className="btnDark btn--small" onClick={() => navigate(`${_id}`)}>
													View
												</button>
											</TableBodyCell>
										</TableColumn>
									</TableRow>
								);
							} else {
								return null;
							}
						})
					) : (
						<span className={glassStyles.insideTableLoaderWrapper}>
							<h2>No data available</h2>
						</span>
					)}
				</TableBodyWrapper>
			</TableWrapper>
		</div>
	);
}
