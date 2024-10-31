import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import studentStyles from "../../../../../styles/student.module.scss";
import styles from "../../../../../styles/ratecalculator.module.scss";
import { EditableTable } from "./EditableTable";
import { useQuery } from "react-query";
import api, { getAccessToken } from "../../../../../services/api";
import { Loader1 } from "../../../../Loaders/Loader1";
import { MdLibraryAdd } from "react-icons/md";
import { toast } from "react-hot-toast";
import axios from "axios";
import utilStyles from "../../../../../styles/utils.module.scss";

const RateCalculatorByCountry = () => {
	const { countryAndCode } = useParams();
	let country = countryAndCode.slice(0, countryAndCode.lastIndexOf("-"));
	let countryCode = countryAndCode.slice(countryAndCode.lastIndexOf("-") + 1);

	useEffect(() => {
		console.log(`country: ${country}\ncode: ${countryCode}`);
	}, []);

	const { data, isLoading, isError, refetch, isRefetching } = useQuery(
		"project-rates",
		async () => {
			const res = await api.get("/project-rate/get-all?page=1&limit=25", {
				headers: {
					Authorization: getAccessToken(),
				},
			});
			// let {projectRates, projectRatesCount} = res.data;
			// console.log(res.data);
			return res.data;
		},
		{
			refetchOnWindowFocus: false,
		}
	);

	const [currentCountryData, setCurrentCountryData] = useState(null);
	const [currentCountryAllProjectRatesValues, setCurrentCountryAllProjectRatesValues] = useState(
		[]
	);
	const [currentCountryAllProjectRatesKeys, setCurrentCountryAllProjectRatesKeys] = useState([]);
	const [currency, setCurrency] = useState("");
	const [projectRateId, setProjectRateId] = useState("");
	const [countryId, setCountryId] = useState("");

	// for updating data with original key
	const [keysOriginalNames, setKeysOriginalNames] = useState([]);

	// error handling states
	const [isDataAvailable, setIsDataAvailable] = useState(true);

	useEffect(() => {
		if (data) {
			console.log("data: ", data);
			let filterCountryData = data?.projectRates?.filter(({ country: arrCountry }) => {
				return arrCountry.toLowerCase() === country;
			});
			console.log("filterCountryData: ", filterCountryData[0]);
			if (!filterCountryData[0]) {
				setIsDataAvailable(false);
			} else {
				setCountryId(filterCountryData[0]._id);
				if (!filterCountryData[0]?.projectRate) {
					setIsDataAvailable(false);
				} else {
					setIsDataAvailable(true);
					const { currency, _id } = filterCountryData[0]?.projectRate;
					setCurrency(currency);
					setProjectRateId(_id);
					let miscellaneousRate = filterCountryData[0]?.projectRate?.miscellaneousRate || [];
					let pagesRate = filterCountryData[0]?.projectRate?.pagesRate || [];
					let slidesRate = filterCountryData[0]?.projectRate?.slidesRate || [];
					let wordsRate = filterCountryData[0]?.projectRate?.wordsRate || [];
					let newRatesObj = {
						wordsRate,
						pagesRate,
						slidesRate,
						miscellaneousRate,
					};
					let ratesKeysArray = [];
					let ratesOriginalKeysArray = [];
					const ratesValuesArray = [];
					for (let key in newRatesObj) {
						// console.log(key);
						let newKeyName = key.slice(0, key.indexOf("R"));
						ratesKeysArray.push(newKeyName);
						ratesValuesArray.push(newRatesObj[key]);
						ratesOriginalKeysArray.push(key);
					}
					// console.log("rates values arr: ", ratesValuesArray);
					// console.log("rates keys arr: ", ratesKeysArray);
					setKeysOriginalNames(ratesOriginalKeysArray);
					setCurrentCountryAllProjectRatesKeys(ratesKeysArray);
					setCurrentCountryAllProjectRatesValues(ratesValuesArray);
					// setCurrentCountryData(filterCountryData[0]);
				}
			}
		}
	}, [data]);

	async function getCurrencyByCountryCode() {
		let url = `https://restcountries.com/v3.1/alpha/${countryCode}`;
		const res = await axios.get(url);
		const data = res.data; // return country array
		let countryObj = data[0];
		let currencyObj = countryObj.currencies;
		let currencyKey = Object.keys(currencyObj)[0];
		console.log("key: ", currencyKey);
		setCurrency(currencyKey);
	}
	useEffect(() => {
		getCurrencyByCountryCode();
	}, []);

	const handleCreateProjectRate = () => {
		let data = {
			miscellaneousRate: [
				{
					2: 23,
				},
			],
			pagesRate: [
				{
					5: 3,
				},
			],
			slidesRate: [
				{
					7: 2,
				},
			],
			wordsRate: [
				{
					8: 9,
				},
			],
			currency,
			country_id: countryId,
		};
		console.log(data);
		api
			.post(`/project-rate/create`, data, {
				headers: {
					Authorization: getAccessToken(),
				},
			})
			.then((res) => {
				toast.success("Data created successfully", {
					duration: 4000,
				});
				refetch();
				console.log(res);
			})
			.catch((e) => {
				console.log(e);
				toast.error("Something went wrong\nPlease try again", {
					duration: 4000,
				});
			});
	};

	if (isLoading || isRefetching)
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

	if (!isDataAvailable)
		return (
			<div className={studentStyles.loaderWrapper}>
				<div>
					<h2>
						Currently data is not available for{" "}
						<span className={`fi fi-${countryCode.toLowerCase().slice(0, 2)}`}></span>{" "}
						<span style={{ textTransform: "capitalize" }}>{country}</span>
					</h2>
					<button
						className="btnPrimary btn--large"
						style={{ width: "100%", margin: "1rem 0", marginTop: "2rem" }}
						onClick={handleCreateProjectRate}
					>
						<MdLibraryAdd />
						Create Data
					</button>
					<br />
					<Link to={-1} className="btnDark btn--medium">
						Go back
					</Link>
				</div>
			</div>
		);
	return (
		<div className="outletContainer">
			<h2 className={utilStyles.headingLg}>
				<span className={`fi fi-${countryCode.toLowerCase().slice(0, 2)}`}></span>{" "}
				{countryCode.toUpperCase()} Rate Calculator
			</h2>
			<div className={styles.rateTablesWrapper}>
				{currentCountryAllProjectRatesValues?.map((value, i) => {
					// get current key of value(like words, pages, slides)
					let currentValueKey = currentCountryAllProjectRatesKeys[i];
					let originalKey = keysOriginalNames[i];
					return (
						<EditableTable
							key={i}
							originalKey={originalKey}
							currentValueKey={currentValueKey}
							ratesValuesArray={value}
							currency={currency}
							projectRateId={projectRateId}
							refetch={refetch}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default RateCalculatorByCountry;
