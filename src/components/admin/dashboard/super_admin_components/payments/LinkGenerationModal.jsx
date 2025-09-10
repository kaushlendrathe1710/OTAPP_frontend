import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "yup-phone";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import glassStyles from "../../../../../styles/glass.module.scss";
import { useQuery } from "react-query";
import axios from "axios";
import CountryCode from "../../../../dropDown/CountryCode";
import api, { getAccessToken } from "../../../../../services/api";
import { toast } from "react-hot-toast";
import { CountrySelect } from "../../../../dropDown/CountrySelect";
import { validatePhoneNumber } from "../../../../../lib/validatePhoneNumber";

export const LinkGenerationModal = ({
  setIsLinkGenerationModalOpen,
  generateLinkFor,
  refetch,
  setCurrentlyMappedPaymentLinksData,
}) => {
  const modalRef = useClickOutside(handleCloseModal);

  const [currencies, setCurrencies] = useState([]);
  const [phoneCountryData, setPhoneCountryData] = useState(null);

  const [isPhoneNumberValidate, setIsPhoneNumberValidate] = useState(true);

  const [isWhatsappNumberValidate, setIsWhatsappNumberValidate] =
    useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (data && data.currencies) {
      console.log("Setting currencies:", data.currencies);
      setCurrencies(data.currencies);
    } else if (countriesError) {
      console.log("Using fallback currencies due to API error");
      setCurrencies(fallbackCurrencies);
    }
  }, [data, countriesError]);

  function formatPhoneNumber(phoneNumber = "07719784210", countryObj) {
    let newPhoneNumber =
      phoneNumber.indexOf("0") === 0 ? phoneNumber.slice(1) : phoneNumber;

    if (countryObj) {
      let code = countryObj?.code || "";
      let phoneNumberWithCountryCode = `${code}${newPhoneNumber}`;
      return phoneNumberWithCountryCode;
    } else {
      return newPhoneNumber;
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      amount: "",
      phoneNumber: "",
      currency: "",
      description: "",

      policy_name: generateLinkFor,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(3, "Name must included minimum 3 letters"),
      email: Yup.string().email().required("Email is required"),
      // phoneNumber: Yup.string()
      //   .phone(
      //     phoneCountryData?.phoneCode || "",
      //     true,
      //     "Phone number must be a valid phone number."
      //   )
      //   .required("Phone number is required"),
      amount: Yup.number()
        .required("Amount is required")
        .min(1, "Minimum value will be 1"),
      currency: Yup.string().required("Currency is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      if (!isPhoneNumberValidate) {
        toast.error("Phone number must be valid", { duration: 4000 });
        return;
      }

      if (isSubmitting) {
        return; // Prevent multiple submissions
      }

      setIsSubmitting(true);

      let newValues = {
        amount: values.amount,
        currency: values.currency,
        description: values.description,
        name: values.name,
        email: values.email,
        title: `${values.policy_name} Payment Link`,
        createdFor: values.policy_name,
        contact: formatPhoneNumber(values.phoneNumber, phoneCountryData),
      };
      // console.log(newValues);
      api
        .post("/payment/create-payment-link", newValues, {
          headers: {
            Authorization: getAccessToken(),
          },
        })
        .then((res) => {
          console.log("Payment link created:", res.data);
          toast.success("Payment link generated successfully", {
            duration: 4000,
          });

          // Close modal first
          handleCloseModal();

          // Refetch the main data to get updated list
          refetch();

          // Also update the local state immediately for better UX
          if (res.data) {
            // Transform the response to match the expected format for LinkGeneration component
            const newPaymentLink = {
              id: res.data.id,
              url: res.data.url,
              active: res.data.active,
              metadata: {
                name: res.data.metadata?.name || values.name,
                email: res.data.metadata?.email || values.email,
                amount: res.data.amount || 0,
                currency: res.data.currency || "USD",
                createdFor: res.data.metadata?.createdFor || values.policy_name,
                paid: "false", // New links are not paid yet
              },
              created: res.data.created,
              ...res.data,
            };

            setCurrentlyMappedPaymentLinksData((prev) => [
              newPaymentLink,
              ...prev,
            ]);
          }

          setIsSubmitting(false);
        })
        .catch((e) => {
          console.error("Error creating payment link:", e);
          toast.error("Failed to create payment link. Please try again.", {
            duration: 4000,
          });
          setIsSubmitting(false);
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
    setIsLinkGenerationModalOpen(false);
  }

  useEffect(() => {
    // validate phone number strictly in the given region with custom error message
    if (formik.touched.phoneNumber) {
      const isValidate = validatePhoneNumber(
        formik.values.phoneNumber,
        phoneCountryData?.countryCode,
        phoneCountryData?.phoneCode
      );
      setIsPhoneNumberValidate(isValidate);
      console.log("IS VALIDATE: ", isValidate);
    }
  }, [formik.values.phoneNumber, phoneCountryData]);
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
          <h3>Generate Link for {generateLinkFor}</h3>
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
                placeholder={`Enter ${generateLinkFor} name`}
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
                placeholder={`Enter ${generateLinkFor} email`}
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
                {/* <CountryCode
                  height={48}
                  data={phoneCountryData}
                  setData={setPhoneCountryData}
                /> */}
                <CountrySelect
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
              {/* {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                <div className={glassStyles.error}>
                  {formik.errors.phoneNumber}
                </div>
              ) : null} */}
              {!isPhoneNumberValidate ? (
                <div className={glassStyles.error}>
                  {"Phone number must be valid"}
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
            <button
              type="submit"
              className="btnPrimary btn--large"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Generate Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
