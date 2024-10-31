import React, { useEffect } from "react";
import { useQuery } from "react-query";
import api from "../../../../../services/api";
import styles from "../../../../../styles/ratecalculator.module.scss";
import utilStyles from "../../../../../styles/utils.module.scss";
import { CountryCard } from "./CountryCard";

const ProjectRateCalculator = () => {
	async function getCountrycode() {
		const res = await api.get("/country/get-all");
		return res.data;
	}
	const { data } = useQuery("countries", getCountrycode);

	useEffect(() => {
		console.log(data);
	}, [data]);
	return (
		<div className="outletContainer" style={{ left: "280px !important" }}>
			<h2 className={utilStyles.headingLg}>Project Rate Calculator</h2>
			<div className={styles.countriesWrapper}>
				{data?.map(({ country, countryCode }, i) => {
					return <CountryCard key={i} countryCode={countryCode} country={country} />;
				})}
			</div>
		</div>
	);
};

export default ProjectRateCalculator;
