import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import glassStyles from "../../../../../styles/glass.module.scss";
import { useQuery } from "react-query";
import axios from "axios";
import CountryCode from "../../../../dropDown/CountryCode";
import { getInputOnlyDateFormat } from "../../../../../lib/getInputDateTimeFormat";
import api, { getAccessToken } from "../../../../../services/api";
import { toast } from "react-hot-toast";

export const LinkGenerationEditModal = ({
  setIsLinkGenerationEditModalOpen,
  clickedPaymentLinkDetails,
  refetch,
}) => {
  let { amount, currency, expire_by, reminder_enable, description, id } =
    clickedPaymentLinkDetails;

  let { name, email, contact } = clickedPaymentLinkDetails.customer;
  let editLinkFor = clickedPaymentLinkDetails?.notes.policy_name;
  const modalRef = useClickOutside(handleCloseModal);

  const [currencies, setCurrencies] = useState([]);
  const [phoneCountryData, setPhoneCountryData] = useState("");

  // Fallback currency list
  const fallbackCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "SEK",
    "NZD",
    "MXN",
    "SGD",
    "HKD",
    "NOK",
    "TRY",
    "RUB",
    "INR",
    "BRL",
    "ZAR",
    "KRW",
    "AED",
    "SAR",
    "QAR",
    "KWD",
    "BHD",
    "OMR",
    "JOD",
    "LBP",
    "EGP",
    "ILS",
    "THB",
    "MYR",
    "IDR",
    "PHP",
    "VND",
    "PKR",
    "BDT",
    "LKR",
    "NPR",
    "MMK",
  ];

  const {
    data,
    isLoading: isCountriesLoading,
    error: countriesError,
  } = useQuery(
    "currencies",
    async () => {
      try {
        // Try multiple APIs as fallbacks
        const apis = [
          "https://api.exchangerate-api.com/v4/latest/USD",
          "https://api.fxratesapi.com/latest",
          "https://restcountries.com/v3.1/all",
        ];

        for (const apiUrl of apis) {
          try {
            console.log(`Trying API: ${apiUrl}`);
            const res = await axios.get(apiUrl, { timeout: 5000 });

            if (
              apiUrl.includes("exchangerate-api") ||
              apiUrl.includes("fxratesapi")
            ) {
              // These APIs return currency rates directly
              const currencyCodes = Object.keys(res.data.rates || res.data);
              const allCurrencies = ["USD", ...currencyCodes].sort();
              console.log("Currencies from rates API:", allCurrencies);
              return { currencies: allCurrencies };
            } else if (apiUrl.includes("restcountries")) {
              // REST Countries API
              if (res.data && Array.isArray(res.data)) {
                let extractCurrencies = res.data
                  .filter(
                    (country) =>
                      country.currencies &&
                      typeof country.currencies === "object"
                  )
                  .map((country) => {
                    let currency = "";
                    if (country.currencies) {
                      for (const key in country.currencies) {
                        currency = key;
                        break;
                      }
                    }
                    return currency;
                  })
                  .filter((currency) => currency && currency.length > 0);

                const uniqueCurrencies = Array.from(
                  new Set(extractCurrencies)
                ).sort();
                console.log("Currencies from countries API:", uniqueCurrencies);
                return { currencies: uniqueCurrencies };
              }
            }
          } catch (apiError) {
            console.warn(`API ${apiUrl} failed:`, apiError.message);
            continue; // Try next API
          }
        }

        // If all APIs fail, throw error to trigger fallback
        throw new Error("All currency APIs failed");
      } catch (error) {
        console.error("Error fetching currencies:", error);
        throw error;
      }
    },
    {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // console.log("expire by: ", expire_by)

  useEffect(() => {
    if (data && data.currencies) {
      console.log("Setting currencies:", data.currencies);
      setCurrencies(data.currencies);
    } else if (countriesError) {
      console.log("Using fallback currencies due to API error");
      setCurrencies(fallbackCurrencies);
    }
  }, [data, countriesError]);

  const formik = useFormik({
    initialValues: {
      name: name,
      email: email,
      amount: amount / 100,
      phoneNumber: contact,
      currency: currency,
      description: description,
      expiredDate: expire_by !== 0 ? getInputOnlyDateFormat(expire_by) : 0,
      policy_name: clickedPaymentLinkDetails?.notes.policy_name,
      reminder_enable: reminder_enable,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(3, "Name must included minimum 3 letters"),
      email: Yup.string().email().required("Email is required"),
      phoneNumber: Yup.string()
        .phone(
          phoneCountryData,
          true,
          "Phone number must be a valid phone number."
        )
        .required("Phone number is required"),
      amount: Yup.number()
        .required("Amount is required")
        .min(1, "Minimum value will be 1"),
      currency: Yup.string().required("Currency is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      let newValues = {
        amount: values.amount,
        currency: values.currency,
        description: values.description,
        cust_name: values.name,
        cust_email: values.email,
        cust_contact: values.phoneNumber,
        policy_name: values.policy_name,
        expireBy:
          values.expiredDate === 0
            ? expire_by
            : new Date(values.expiredDate).getTime(),
        countryCode: phoneCountryData,
        reminder_enable: values.reminder_enable,
      };
      console.log(newValues);
      api
        .patch(`/payment/payment-link-update?paymentLinkId=${id}`, newValues, {
          headers: {
            Authorization: getAccessToken(),
          },
        })
        .then((res) => {
          toast.success("Payment link updated successfully");
          refetch();
          console.log("res: ", res.data);
          handleCloseModal();
        })
        .catch((e) => {
          toast.error("Something went wrong\nPlease try again", {
            duration: 4000,
          });
          console.log(e);
        });
    },
  });

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
  function handleCloseModal() {
    setIsLinkGenerationEditModalOpen(false);
  }
  return (
    <div className={`${glassStyles.modalWrapper}`}>
      <div
        style={{
          maxWidth: "540px",
          minHeight: "fit-content",
          padding: ".5rem 1rem 1.5rem 1rem",
        }}
        className={glassStyles.modalBoxWrapper}
        ref={modalRef}
      >
        <div className={glassStyles.header}>
          <h3>Edit link for {editLinkFor}</h3>
        </div>
        <div className={glassStyles.formWrapper} style={{ marginTop: ".5rem" }}>
          <form onSubmit={formik.handleSubmit}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Enter ${editLinkFor} name`}
                className={
                  formik.errors.name &&
                  formik.touched.name &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.name && formik.touched.name ? (
                <div className={glassStyles.error}>{formik.errors.name}</div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Enter ${editLinkFor} email`}
                className={
                  formik.errors.email &&
                  formik.touched.email &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.email && formik.touched.email ? (
                <div className={glassStyles.error}>{formik.errors.email}</div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <CountryCode
                  height={48}
                  data={phoneCountryData}
                  setData={setPhoneCountryData}
                />
                <input
                  style={{ width: "100%" }}
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter phone number"
                  className={
                    formik.errors.phoneNumber &&
                    formik.touched.phoneNumber &&
                    glassStyles.errorBorder
                  }
                />
              </div>
              {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                <div className={glassStyles.error}>
                  {formik.errors.phoneNumber}
                </div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Enter payment amount`}
                className={
                  formik.errors.amount &&
                  formik.touched.amount &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.amount && formik.touched.amount ? (
                <div className={glassStyles.error}>{formik.errors.amount}</div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="currency">Currency</label>
              <select
                type="number"
                id="currency"
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Select currency`}
                className={
                  formik.errors.currency &&
                  formik.touched.currency &&
                  glassStyles.errorBorder
                }
              >
                <option value="">Select currency</option>
                {isCountriesLoading ? (
                  <option value="" disabled>
                    Loading currencies...
                  </option>
                ) : countriesError ? (
                  <option value="" disabled>
                    Error loading currencies
                  </option>
                ) : currencies.length > 0 ? (
                  currencies?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No currencies available
                  </option>
                )}
              </select>
              {formik.errors.currency && formik.touched.currency ? (
                <div className={glassStyles.error}>
                  {formik.errors.currency}
                </div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="expiredDate">Expiry date</label>
              <input
                type="date"
                name="expiredDate"
                id="expiredDate"
                value={formik.values.expiredDate}
                placeholder="Enter expired date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Type description here`}
                className={
                  formik.errors.description &&
                  formik.touched.description &&
                  glassStyles.errorBorder
                }
              ></textarea>
              {formik.errors.description && formik.touched.description ? (
                <div className={glassStyles.error}>
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
            <div className={glassStyles.checkboxWrapper}>
              <div className={glassStyles.flexWrapper}>
                <div>
                  <input
                    type="checkbox"
                    name="reminder_enable"
                    id="reminder_enable"
                    // value={formik.values.reminder_enable}
                    checked={formik.values.reminder_enable}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="reminder_enable">Reminder</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btnPrimary btn--large">
              Update Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};