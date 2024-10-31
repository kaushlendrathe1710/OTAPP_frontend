import React, { useState, useEffect, memo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import styles from "../../styles/homepage.module.scss";
import glassStyles from "../../styles/glass.module.scss";
import { CountrySelect } from "../dropDown/CountrySelect";
import { validatePhoneNumber } from "../../lib/validatePhoneNumber";
import { firebaseAuth } from "../../services/firebase.config";
import { Loader1 } from "../Loaders/Loader1";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

let toastOptions = { position: "top-center", duration: 5000 };

const NEED_HELP_OPTIONS = [
  "Homework help",
  "Assignment help",
  "Essay help",
  "Project help",
  "Desertion writing",
];

const VerifyUser = ({
  userType,
  getUser = () => {},
  showLabeling = true,
  otpSendButtonText = "Send OTP via SMS",
  contentContainerStyle = {},
  studentLandingPageForm = false,
}) => {
  const navigate = useNavigate();
  const [phoneCountryData, setPhoneCountryData] = useState(null);
  const [isPhoneNumberValidate, setIsPhoneNumberValidate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [inputOtp, setInputOtp] = useState("");

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      phoneCountry: phoneCountryData?._id || "",
      fullName: "",
      email: "",
      needHelp: NEED_HELP_OPTIONS[0] || "",
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string().required(),
      fullName: studentLandingPageForm
        ? Yup.string().required("Your name is required")
        : Yup.string(),
      email: studentLandingPageForm
        ? Yup.string().email().required("Email is Required")
        : Yup.string(),
      needHelp: studentLandingPageForm
        ? Yup.string().required("Feild is required")
        : Yup.string(),
    }),
    onSubmit: async (values) => {
      if (!isPhoneNumberValidate || !values.phoneNumber) {
        toast.error("Phone number must be valid", toastOptions);
        return;
      }
      if (userType === "Student" && studentLandingPageForm) {
        setIsSendOtpLoading(true);
        try {
          const { data } = await api.get(
            `/lead-user/check-user-already-exist?phoneNumber=${values.phoneNumber}&userType=${userType}`
          );
          if (data?.isAlreadyExist) {
            toast.error(
              "A user already exist with this phone number, Please try another phone number.",
              toastOptions
            );
            return;
          } else {
            await handleSendOTP();
          }
        } catch (err) {
          console.log(
            "this error occured while chekcing user already exist or not: ",
            err
          );
        } finally {
          setIsSendOtpLoading(false);
        }
      } else {
        await handleSendOTP();
      }
    },
  });
  useEffect(() => {
    formik.setFieldValue("phoneCountry", phoneCountryData?._id || "");
    if (formik.touched.phoneNumber) {
      const isValidate = validatePhoneNumber(
        formik.values.phoneNumber,
        phoneCountryData?.countryCode,
        phoneCountryData?.phoneCode
      );
      setIsPhoneNumberValidate(isValidate);
    }
  }, [formik.values.phoneNumber, phoneCountryData]);

  function onCaptchVerify() {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "send-otp-button",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // handleSendOTP();
          },
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          },
        },
        firebaseAuth
      );
    } catch (err) {
      console.error("An error occured while generating captacha: ", err);
    }
  }

  async function handleSendOTP() {
    setIsSendOtpLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = `${phoneCountryData?.phoneCode}${formik.values.phoneNumber}`;
    try {
      window.confirmationResult = await signInWithPhoneNumber(
        firebaseAuth,
        phoneNumber,
        appVerifier
      );
      setShowOtpInput(true);
      toast.success("OTP sended successfully", toastOptions);
    } catch (error) {
      let errorMessage = "";
      if (error?.code == "auth/too-many-requests") {
        errorMessage = "Too many request, please try again after 2-3 mins";
      } else {
        errorMessage = "Something went wrong, Reload the page.";
      }
      toast.error(errorMessage, toastOptions);
      console.error(
        "An Error occured while sending sms using firebase: ",
        error
      );
    } finally {
      window.recaptchaVerifier.render().then(function (widgetId) {
        grecaptcha.reset(widgetId);
      });
      setIsSendOtpLoading(false);
    }
  }
  async function handleResendOtp() {
    handleSendOTP();
  }

  async function handleVerifyOTP() {
    if (!inputOtp) {
      return;
    }
    setIsLoading(true);
    try {
      const result = await window.confirmationResult.confirm(inputOtp);
      // User verified successfully
      await saveUser();
      toast.success("Thanks for verifying.", toastOptions);
    } catch (error) {
      window.recaptchaVerifier.render().then(function (widgetId) {
        grecaptcha.reset(widgetId);
      });
      let errorMessage = "";
      if (error?.code === "auth/code-expired") {
        errorMessage = "OTP is expired.";
      } else if (error?.code == "auth/invalid-verification-code") {
        errorMessage = "Invalid verification code";
      } else if (error?.code == "auth/too-many-requests") {
        errorMessage =
          "Too many request, please try again after 2-3 mins or Reload the page.";
      } else {
        errorMessage = "Something went wrong, Reload the page.";
      }
      toast.error(errorMessage, toastOptions);
      console.error(
        "An Error occured while verifying otp using firebase: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }
  async function saveUser() {
    try {
      const { data } = await api.post("/quick-chat/create-user", {
        userType,
        phoneNumber: formik.values.phoneNumber,
        phoneCountry: formik.values.phoneCountry,
      });
      const { user, access_token } = data;

      if (userType === "Student" && studentLandingPageForm) {
        const { data } = await api.post("/lead-user/create", {
          name: formik.values.fullName,
          email: formik.values.email,
          userType: "Student",
          phoneNumber: formik.values.phoneNumber,
          phoneCountry: formik.values.phoneCountry,
          needHelp: formik.values.needHelp,
        });
        if (data?.isAlreadyExist) {
          toast.error(
            "A user already exist with this phone number, Try again.",
            toastOptions
          );
          setShowOtpInput(false);
          setInputOtp("");
          for (const key in formik.values) {
            if (Object.hasOwnProperty.call(formik.values, key)) {
              formik.setFieldValue(key, formik.values[key]);
            }
          }
          formik.setFieldValue("phoneNumber", "");
        } else {
          sessionStorage.setItem("quick-chat-user-access-token", access_token);
          getUser(user);
          navigate(`/thank-you?utm_source=student-landing-page`);
        }
      } else {
        sessionStorage.setItem("quick-chat-user-access-token", access_token);
        getUser(user);
      }
    } catch (err) {
      toast.error(
        `Error: ${err?.response?.data?.message || "Something went wrong."}`,
        toastOptions
      );
      console.error("An Error occured while saving user into db: ", err);
    }
  }
  return (
    <div style={contentContainerStyle} className={styles.verificationForm}>
      {showLabeling && !studentLandingPageForm && (
        <>
          <h3>Hi {userType}</h3>
          <h4>Please verify your identity</h4>
        </>
      )}
      {!showOtpInput ? (
        <form
          onSubmit={formik.handleSubmit}
          style={{ gap: studentLandingPageForm ? "0.75rem" : "" }}
        >
          {studentLandingPageForm && (
            <>
              <div className={glassStyles.inputWrapper}>
                {showLabeling && <label htmlFor="fullName">Full name</label>}
                <input
                  type="text"
                  id="fullName"
                  value={formik.values.fullName}
                  placeholder="Enter your full name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.fullName &&
                    formik.touched.fullName &&
                    glassStyles.errorBorder
                  }
                />
              </div>
              <div className={glassStyles.inputWrapper}>
                {showLabeling && <label htmlFor="email">Email</label>}
                <input
                  type="text"
                  id="email"
                  value={formik.values.email}
                  placeholder="Email address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.email &&
                    formik.touched.email &&
                    glassStyles.errorBorder
                  }
                />
              </div>
              <div className={glassStyles.inputWrapper}>
                {showLabeling && (
                  <label htmlFor="needHelp">How can we help you?</label>
                )}
                <select
                  type="text"
                  id="needHelp"
                  value={formik.values.needHelp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="How can we help you?"
                  className={
                    formik.errors.needHelp &&
                    formik.touched.needHelp &&
                    glassStyles.errorBorder
                  }
                >
                  <optgroup label="How can we help you?">
                    {NEED_HELP_OPTIONS.map((value, i) => {
                      return (
                        <option key={i} value={value}>
                          {value}
                        </option>
                      );
                    })}
                  </optgroup>
                </select>
              </div>
            </>
          )}
          <div className={glassStyles.inputWrapper}>
            {showLabeling && <label htmlFor="phoneNumber">Phone number</label>}
            <div data-type="phone-wrapper">
              <CountrySelect
                data={phoneCountryData}
                setData={setPhoneCountryData}
                handleChange={() => formik.setFieldTouched("phoneNumber", true)}
              />
              <input
                type="phoneNumber"
                name="phoneNumber"
                id="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                placeholder="Enter mobile number"
                className={
                  formik.errors.phoneNumber &&
                  formik.touched.phoneNumber &&
                  glassStyles.errorBorder
                }
              />
            </div>
            {!isPhoneNumberValidate ? (
              <div className={glassStyles.error}>
                {"Phone number must be valid"}
              </div>
            ) : null}
            <p style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
              We’ll send an OTP for verification
            </p>
          </div>
          <button
            id="send-otp-button"
            type="submit"
            className="btnPrimary btn--medium btn--full"
            disabled={isSendOtpLoading}
            //   onClick={() => handleSelectUserType(USER_TYPES.tutor)}
          >
            {isSendOtpLoading && <Loader1 size={24} />}
            {otpSendButtonText}
          </button>
        </form>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className={glassStyles.inputWrapper}>
            {showLabeling && <label htmlFor="inputOtp">OTP</label>}
            <input
              type="text"
              name="inputOtp"
              id="inputOtp"
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
              placeholder="Enter OTP"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btnPrimary btn--medium btn--full"
            onClick={handleVerifyOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader1 size={24} /> <span>Verifying</span>
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
          <button
            type="button"
            className="btnText"
            onClick={handleResendOtp}
            disabled={isSendOtpLoading}
            id="send-otp-button"
          >
            {isSendOtpLoading && <Loader1 size={18} />}
            Resend OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default memo(VerifyUser);
