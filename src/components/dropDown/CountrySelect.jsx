import React, { useState, useRef } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { useQuery } from "react-query";
import { useClickOutside } from "../../hooks/useClickOutside";
import api from "../../services/api";
import glassStyles from "../../styles/glass.module.scss";

export const CountrySelect = ({
  setData,
  data,
  disabled,
  handleChange = () => {},
}) => {
  const { data: allCountriesData = [] } = useQuery(
    "all-countries",
    async () => {
      const res = await api.get("/country/get-all");
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const buttonRef = useRef();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const countriesRef = useClickOutside(
    () => setIsDropdownOpen(false),
    buttonRef
  );

  const handleSelectCountry = (country) => {
    setIsDropdownOpen(false);
    setData(country);
    handleChange();
    console.log("selec: ", country);
  };

  return (
    <div className={glassStyles.countrySelectWrapper}>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={disabled}
      >
        {data?.phoneCode || "Code"} <MdArrowDropDown />
      </button>
      {isDropdownOpen ? (
        <div
          ref={countriesRef}
          style={{ left: buttonRef.current.clientWidth + 5 || "" }}
          className={glassStyles.countriesWrapper}
        >
          {allCountriesData?.map((item, i) => {
            return (
              <button
                type="button"
                key={i}
                onClick={() => handleSelectCountry(item)}
              >
                <span>({item?.phoneCode})</span> {item?.country}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
