import React, { useContext, useState, useEffect } from "react";
import styles from "../../../../../styles/personalDetails.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import utilStyles from "../../../../../styles/utils.module.scss";
import toast from "react-hot-toast";
import userContext from "../../../../../context/userContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import "yup-phone";
import { useWindowWidth } from "../../../../../hooks/useWindowWidth";
import api, { getAccessToken } from "../../../../../services/api";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";
import CountryCode from "../../../../dropDown/CountryCode";
import { CountrySelect } from "../../../../dropDown/CountrySelect";
import { validatePhoneNumber } from "../../../../../lib/validatePhoneNumber";

const PersonalDetails = () => {
  const user = useContext(userContext);
  const userData = user?.userData;
  const setUserData = user?.setUserData;
  // console.log("user: ", user);
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();

  const [isAnyPersonalDetailChanged, setIsAnyPersonalDetailChanged] =
    useState(false);
  const [isPersonalDetailEditable, setIsPersonalDetailEditable] =
    useState(false);

  const [phoneCountryData, setPhoneCountryData] = useState(
    userData?.phoneCountry || null
  );
  const [whatsappCountryData, setWhatsappCountryData] = useState(
    userData?.whatsappCountry || null
  );

  const [isPhoneNumberValidate, setIsPhoneNumberValidate] = useState(true);
  const [isWhatsappNumberValidate, setIsWhatsappNumberValidate] =
    useState(true);

  const btnSizeClass = windowWidth > 360 ? "btn--medium" : "btn--small";

  const personalDetailFormik = useFormik({
    initialValues: {
      name: userData?.name || "",
      phoneNumber: userData?.phoneNumber || "",
      whatsappNumber: userData?.whatsappNumber || "",
      phoneCountry: phoneCountryData?._id || "",
      whatsappCountry: whatsappCountryData?._id || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(3, "Name must includes minimum 3 letters"),
    }),
    onSubmit: (values) => {
      if (!isPhoneNumberValidate) {
        toast.error("Phone number must be valid", { duration: 4000 });
        return;
      }
      if (!isWhatsappNumberValidate) {
        toast.error("Whatsapp number must be valid", { duration: 4000 });
        return;
      }
      let data = { ...values, id: userData?._id };
      // console.log("values: ", data);

      api
        .patch("/admin/update-personal-detail", data, {
          headers: {
            Authorization: getAccessToken(),
          },
        })
        .then((res) => {
          // console.log("res: ",res.data);
          setUserData(res.data);
          setIsPersonalDetailEditable(false);
          toast.success("Personal details updated successfully", {
            duration: 4000,
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message || "Something went wrong", {
            duration: 4000,
          });
        });
      // setIsPersonalDetailEditable(false);
    },
  });

  function handleCancel() {
    // personalDetailFormik.setErrors({});
    setIsPersonalDetailEditable(false);
    setPhoneCountryData(userData?.phoneCountry || null);
    setWhatsappCountryData(userData?.whatsappCountry || null);

    setTimeout(() => {
      setIsPhoneNumberValidate(true);
      setIsWhatsappNumberValidate(true);
      // console.log("MY TURNNNNNNNNNNNNNNN");
    }, 100);

    personalDetailFormik.setFieldValue(
      "phoneCountry",
      userData?.phoneCountry?._id || ""
    );
    personalDetailFormik.setFieldValue(
      "whatsappCountry",
      userData?.whatsappCountry?._id || ""
    );
  }

  useEffect(() => {
    // console.log("userData: ", userData)
    personalDetailFormik.setFieldValue("name", userData?.name);
    personalDetailFormik.setFieldValue("phoneNumber", userData?.phoneNumber);
    personalDetailFormik.setFieldValue(
      "whatsappNumber",
      userData?.whatsappNumber
    );

    setPhoneCountryData(userData?.phoneCountry);
    setWhatsappCountryData(userData?.whatsappCountry);
  }, [userData]);

  useEffect(() => {
    personalDetailFormik.setFieldValue(
      "phoneCountry",
      phoneCountryData?._id || ""
    );
    // validate phone number strictly in the given region with custom error message
    if (personalDetailFormik.touched.phoneNumber) {
      const isValidate = validatePhoneNumber(
        personalDetailFormik.values.phoneNumber,
        phoneCountryData?.countryCode,
        phoneCountryData?.phoneCode
      );
      setIsPhoneNumberValidate(isValidate);
      console.log("IS VALIDATE: ", isValidate);
    }
  }, [personalDetailFormik.values.phoneNumber, phoneCountryData]);

  useEffect(() => {
    personalDetailFormik.setFieldValue(
      "whatsappCountry",
      whatsappCountryData?._id || ""
    );
    if (personalDetailFormik.touched.whatsappNumber) {
      const isValidate = validatePhoneNumber(
        personalDetailFormik.values.whatsappNumber,
        whatsappCountryData?.countryCode,
        whatsappCountryData?.phoneCode
      );
      setIsWhatsappNumberValidate(isValidate);
      console.log("IS VALIDATE: ", isValidate);
    }
  }, [personalDetailFormik.values.whatsappNumber, whatsappCountryData]);

  return (
    <div className="outletContainer">
      <div className={styles.sectionWrapper}>
        <h2 className={utilStyles.headingMd}>Personal Details</h2>
        <div className={styles.formWrapper}>
          <form
            onSubmit={personalDetailFormik.handleSubmit}
            onReset={personalDetailFormik.handleReset}
          >
            <div className={styles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  readOnly={!isPersonalDetailEditable}
                  value={personalDetailFormik.values.name}
                  onChange={personalDetailFormik.handleChange}
                  onBlur={
                    isPersonalDetailEditable
                      ? personalDetailFormik.handleBlur
                      : undefined
                  }
                  placeholder="Enter name here"
                  className={
                    personalDetailFormik.errors.name &&
                    personalDetailFormik.touched.name &&
                    glassStyles.errorBorder
                  }
                />
                {personalDetailFormik.errors.name &&
                  personalDetailFormik.touched.name && (
                    <div className={glassStyles.error}>
                      {personalDetailFormik.errors.name}
                    </div>
                  )}
              </div>
            </div>
            <div className={styles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="phoneNumber">Phone number</label>
                <div data-type="phone-wrapper">
                  <CountrySelect
                    data={phoneCountryData}
                    setData={setPhoneCountryData}
                    disabled={!isPersonalDetailEditable}
                    handleChange={() =>
                      personalDetailFormik.setFieldTouched("phoneNumber", true)
                    }
                  />
                  <input
                    type="phoneNumber"
                    name="phoneNumber"
                    id="phoneNumber"
                    readOnly={!isPersonalDetailEditable}
                    value={personalDetailFormik.values.phoneNumber}
                    onChange={personalDetailFormik.handleChange}
                    onBlur={
                      isPersonalDetailEditable
                        ? personalDetailFormik.handleBlur
                        : undefined
                    }
                    placeholder="Enter phone number here"
                    className={
                      personalDetailFormik.errors.phoneNumber &&
                      personalDetailFormik.touched.phoneNumber &&
                      glassStyles.errorBorder
                    }
                  />
                </div>
                {!isPhoneNumberValidate ? (
                  <div className={glassStyles.error}>
                    {"Phone number must be valid"}
                  </div>
                ) : null}
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="whatsappNumber">Whatsapp number</label>
                <div data-type="phone-wrapper">
                  <CountrySelect
                    data={whatsappCountryData}
                    setData={setWhatsappCountryData}
                    disabled={!isPersonalDetailEditable}
                    handleChange={() =>
                      personalDetailFormik.setFieldTouched(
                        "whatsappNumber",
                        true
                      )
                    }
                  />
                  <input
                    type="whatsappNumber"
                    name="whatsappNumber"
                    id="whatsappNumber"
                    readOnly={!isPersonalDetailEditable}
                    value={personalDetailFormik.values.whatsappNumber}
                    onChange={personalDetailFormik.handleChange}
                    onBlur={
                      isPersonalDetailEditable
                        ? personalDetailFormik.handleBlur
                        : undefined
                    }
                    placeholder="Enter whatsapp number here"
                    className={
                      personalDetailFormik.errors.whatsappNumber &&
                      personalDetailFormik.touched.whatsappNumber &&
                      glassStyles.errorBorder
                    }
                  />
                </div>
                {!isWhatsappNumberValidate ? (
                  <div className={glassStyles.error}>
                    {"Whatsapp number must be valid"}
                  </div>
                ) : null}
              </div>
            </div>
            {isPersonalDetailEditable ? (
              <div className={styles.btnsWrapper}>
                <button
                  type="submit"
                  className={`btnPrimary ${btnSizeClass}`}
                  // disabled={!isAnyPersonalDetailChanged}
                >
                  Save changes
                </button>
                <button
                  type="reset"
                  className={`btnNeutral ${btnSizeClass}`}
                  // disabled={!isAnyPersonalDetailChanged}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.btnsWrapper}>
                <div
                  style={{ cursor: "pointer" }}
                  className={`btnPrimary ${btnSizeClass}`}
                  onClick={() => setIsPersonalDetailEditable(true)}
                >
                  <AiFillEdit /> Edit
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <div style={{ marginTop: "1rem" }} className={styles.sectionWrapper}>
        <h2 className={utilStyles.headingMd}>Privacy Details</h2>
        <div className={styles.changeBtnsWrapper}>
          <button
            type="button"
            className={styles.changeButton}
            onClick={() => navigate("change-password")}
          >
            <MdLock /> Change Passowrd
          </button>
          <button
            type="button"
            className={styles.changeButton}
            // onClick={() => navigate("change-password")}
          >
            <MdEmail /> Change Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
