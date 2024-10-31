import React, { useState, useEffect } from "react";
import api from "../../services/api";
import styles from "../../styles/auth.module.scss";

const CountryCode = ({ data, setData, height }) => {
  const [togglePhoneCode, setTogglePhoneCode] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [codeDropDownBtnState, setCodeDropDownBtnState] = useState("code");

  useEffect(() => {
    async function getCountrycode() {
      const res = await api.get("/country/get-all");
      console.log(res.data)
      setAllCountries(res.data);
    }
    getCountrycode();
  }, []);

  const handelCountryCode = (e, id, country) => {
    let code = e.target.value;
    // setCountryCode(code)
    let name = e.target.innerHTML;
    let codeName = name.slice(name.indexOf("(") + 1, name.indexOf(")"));
    let countryName = name.slice(0, name.indexOf("("));
    const countryCode = country?.countryCode;
    setTogglePhoneCode(false);
    setCodeDropDownBtnState(codeName);
    setData({ countryName, code, id, countryCode });
  };

  const toggleCountryCode = () => {
    togglePhoneCode === true
      ? setTogglePhoneCode(false)
      : setTogglePhoneCode(true);
  };

  return (
    <>
      <button
        style={{ height: height || "100%" }}
        type="button"
        onClick={toggleCountryCode}
        className={styles.countryCodeBtn}
      >
        {data !== "" ? (
          <>
            {codeDropDownBtnState}▼
            <br />
            {data?.code}
          </>
        ) : (
          "code ▼"
        )}
      </button>
      <div
        style={{ display: `${togglePhoneCode === true ? "flex" : "none"}` }}
        className={styles.codeInputBtnContainer}
      >
        {allCountries.map((country) => {
          return (
            <button
              type="button"
              value={country.phoneCode}
              onClick={(e) => handelCountryCode(e, country._id, country)}
              key={country._id}
              className={styles.codeInputBtn}
            >
              {`${country.country}(${country.countryCode})`}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default CountryCode;
