import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../../../styles/ratecalculator.module.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export const CountryCard = ({ countryCode, country }) => {
	let path = `${country.toLowerCase()}-${countryCode.toLowerCase()}`;
	return (
		<div className="outletContainer">
			<Link to={path} className={styles.countryCard}>
				<span className={`fi fi-${countryCode.toLowerCase().slice(0, 2)}`}></span>
				<h3>{country}</h3>
			</Link>
		</div>
	);
};
