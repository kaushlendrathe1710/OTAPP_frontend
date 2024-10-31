import React, { useState, useEffect, useContext } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import "yup-phone";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/auth.module.scss";
import api, { getAccessToken } from "../../services/api";
import { Stepper } from "./Stepper";
import Select from "react-select";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import "react-phone-input-2/lib/style.css";
import CountryCode from "../dropDown/CountryCode";
import { validatePhoneNumber } from "../../lib/validatePhoneNumber";

export const Register = ({ formFor }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [basicDetails, setBasicDetails] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [phoneCountryData, setPhoneCountryData] = useState(null);
  const [whatsappCountryData, setWhatsappountryData] = useState(null);
  const [isPhoneNumberValidate, setIsPhoneNumberValidate] = useState(true);
  const [isWhatsappNumberValidate, setIsWhatsappNumberValidate] =
    useState(true);

  useEffect(() => {
    async function getSubjects() {
      const res = await api.get("/subject/get-all");
      const data = res.data;

      setSubjects(
        data.map((item) => {
          return { label: item.subjectName, value: item.subjectName };
        })
      );
    }
    getSubjects();
  }, []);

  const BasicDetailsFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Please enter your name")
        .min(4, "Your name must contains 4 letters")
        .max(50, "Your name should not be more than 50 letters"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email"),
      password: Yup.string()
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        )
        .required("Please enter your password"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: (values) => {
      setBasicDetails(values);
      handleContinue();
    },
  });
  const PersonalDetailsFormik =
    formFor === "student"
      ? useFormik({
          initialValues: {
            phoneNumber: "",
            whatsappNumber: "",
            country: "",
          },
          onSubmit: (values) => {
            setLoading(true);
            const { name, email, password, confirm_password } = basicDetails;
            let { phoneNumber, whatsappNumber } = values;
            let country = phoneCountryData?.countryName;
            phoneNumber = `${phoneCountryData?.code}${phoneNumber}`;
            whatsappNumber = `${whatsappCountryData?.code}${whatsappNumber}`;
            handleStudentSubmit(
              name,
              email,
              password,
              confirm_password,
              phoneNumber,
              whatsappNumber,
              country
            );
          },
        })
      : formFor === "tutor" &&
        useFormik({
          initialValues: {
            phoneNumber: "",
            whatsappNumber: "",
            subjects: [],
          },
          validationSchema: Yup.object({
            subjects: Yup.array()
              .required("Please select your subject")
              .min(1, "Please select at least one subject"),
          }),
          onSubmit: (values) => {
            setLoading(true);
            const { name, email, password, confirm_password } = basicDetails;
            let { phoneNumber, whatsappNumber, subjects } = values;
            let country = phoneCountryData?.countryName;
            phoneNumber = `${phoneCountryData?.code}${phoneNumber}`;
            whatsappNumber = `${whatsappCountryData?.code}${whatsappNumber}`;
            handleTutorSubmit(
              name,
              email,
              password,
              confirm_password,
              phoneNumber,
              whatsappNumber,
              country,
              subjects
            );
          },
        });

  useEffect(() => {
    PersonalDetailsFormik.setFieldValue(
      "phoneCountry",
      phoneCountryData?._id || ""
    );
    // validate phone number strictly in the given region with custom error message
    if (PersonalDetailsFormik.touched.phoneNumber) {
      const isValidate = validatePhoneNumber(
        PersonalDetailsFormik.values.phoneNumber,
        phoneCountryData?.countryCode,
        phoneCountryData?.code
      );
      setIsPhoneNumberValidate(isValidate);
      console.log("IS VALIDATE: ", isValidate);
    }
  }, [PersonalDetailsFormik.values.phoneNumber, phoneCountryData]);

  useEffect(() => {
    PersonalDetailsFormik.setFieldValue(
      "whatsappCountry",
      whatsappCountryData?._id || ""
    );
    if (PersonalDetailsFormik.touched.whatsappNumber) {
      const isValidate = validatePhoneNumber(
        PersonalDetailsFormik.values.whatsappNumber,
        whatsappCountryData?.countryCode,
        whatsappCountryData?.code
      );
      setIsWhatsappNumberValidate(isValidate);
      console.log("IS VALIDATE: ", isValidate);
    }
  }, [PersonalDetailsFormik.values.whatsappNumber, whatsappCountryData]);

  async function handleTutorSubmit(
    name,
    email,
    password,
    confirm_password,
    phoneNumber,
    whatsappNumber,
    country,
    subjects
  ) {
    // tutor submit fn

    console.log(phoneCountryData);
    if (phoneCountryData?.id == null || whatsappCountryData?.id == null) {
      setLoading(false);
      toast.error("Please select your country code", {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--danger-color)" },
      });
      return;
    }

    let newSubjects = subjects.map((item) => {
      return {
        name: item,
        verified: false,
      };
    });

    console.log(newSubjects);

    const data = {
      name: name,
      email: email,
      password: password,
      confirm_password: confirm_password,
      phoneNumber: phoneNumber,
      whatsappNumber: whatsappNumber,
      country: country,
      phoneCountry: phoneCountryData.id,
      whatsappCountry: whatsappCountryData.id,
      subjects: subjects, //to be changed to array
      verifiedSubjects: newSubjects,
    };
    let err = [];
    for (const i in data) {
      if (data[i] === "") {
        err.push(`${i} cannot be empty`);
      }
    }

    if (err.length) {
      toast.error(err, {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--danger-color)" },
      });
      return;
    }

    console.log(data);

    try {
      const res = await api.post("/tutor/register", data);
      setLoading(false);
      toast.success(res.data.message, {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--success-color)" },
      });
      navigate("/");
    } catch (err) {
      setLoading(false);
      const error = err?.response;
      let message = "";
      if (error) {
        if (error.status === 422) {
          const len = error.data.validationError.length;
          error.data.validationError.forEach(
            (item, i) =>
              (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
          );
        } else if (error.status === 403) {
          message = error.data.message;
        } else if (error.status === 409) {
          message = error.data.message;
        }
      }
      if (message) {
        toast.error(message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      } else {
        toast.error(err.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      }
    }
  }

  async function handleStudentSubmit(
    name,
    email,
    password,
    confirm_password,
    phoneNumber,
    whatsappNumber,
    country
  ) {
    console.log(phoneCountryData);
    if (phoneCountryData?.id == null || whatsappCountryData?.id == null) {
      setLoading(false);
      toast.error("Please select your country code", {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--danger-color)" },
      });
      return;
    }

    const data = {
      name: name,
      email: email,
      password: password,
      confirm_password: confirm_password,
      phoneNumber: phoneNumber,
      whatsappNumber: whatsappNumber,
      country: country,
      phoneCountry: phoneCountryData.id,
      whatsappCountry: whatsappCountryData.id,
    };
    let err = [];
    for (const i in data) {
      if (data[i] === "") {
        err.push(`${i} cannot be empty`);
      }
    }

    if (err.length) {
      toast.error(err, {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--danger-color)" },
      });
      return;
    }

    try {
      const res = await api.post("/student/register", data);
      setLoading(false);
      toast.success(res.data.message, {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--success-color)" },
      });
      navigate("/");
    } catch (err) {
      setLoading(false);
      const error = err?.response;
      let message = "";
      if (error) {
        if (error.status === 422) {
          const len = error.data.validationError.length;
          error.data.validationError.forEach(
            (item, i) =>
              (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
          );
        } else if (error.status === 403) {
          message = error.data.message;
        } else if (error.status === 409) {
          message = error.data.message;
        }
      }
      if (message) {
        toast.error(message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      } else {
        toast.error(err.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      }
    }
  }

  const handleContinue = () => {
    setActiveIndex((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (activeIndex > 1) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className={styles.registerPageWrapper}>
        <div className={styles.blobWrapper1}>
          <div className="blob"></div>
        </div>
        <div className={styles.blobWrapper2}>
          <div className="blob"></div>
        </div>
        <div className={styles.registerPage}>
          <div className={styles.registerHeader}>
            <Link to="/" className="logo">
              <h2>Megamind</h2>
            </Link>
            <div className={styles.registerOption}>
              <h3>
                Register as a{" "}
                {formFor === "student"
                  ? "Student"
                  : formFor === "tutor"
                  ? "Tutor"
                  : ""}
              </h3>
              {formFor === "tutor" ? (
                <p>
                  A good teacher is like a candle—it consumes itself to light
                  the way for others.
                </p>
              ) : (
                <p>
                  “Education is the passport to the future, for tomorrow belongs
                  to those who prepare for it today.” —Malcolm X
                </p>
              )}
            </div>
          </div>
          <div className={styles.registerFormContainer}>
            <Stepper activeIndex={activeIndex} />
            <div className={styles.registerFormWrapper}>
              <div className={styles.registerForm}>
                {/* BasicDetails Form */}
                {activeIndex === 1 && (
                  <form onSubmit={BasicDetailsFormik.handleSubmit}>
                    <div className={styles.inputCon}>
                      <label htmlFor="name">Name</label>
                      <input
                        type="name"
                        name="name"
                        id="name"
                        value={BasicDetailsFormik.values.name}
                        onChange={BasicDetailsFormik.handleChange}
                        onBlur={BasicDetailsFormik.handleBlur}
                        placeholder="Name"
                        // autoFocus
                        className={
                          BasicDetailsFormik.errors.name &&
                          BasicDetailsFormik.touched.name &&
                          styles.errorBorder
                        }
                        // required
                      />
                      {BasicDetailsFormik.errors.name &&
                      BasicDetailsFormik.touched.name ? (
                        <div className={styles.inputError}>
                          {BasicDetailsFormik.errors.name}
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.inputCon}>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={BasicDetailsFormik.values.email}
                        onChange={BasicDetailsFormik.handleChange}
                        onBlur={BasicDetailsFormik.handleBlur}
                        placeholder="Email"
                        // autoFocus
                        className={
                          BasicDetailsFormik.errors.email &&
                          BasicDetailsFormik.touched.email &&
                          styles.errorBorder
                        }
                        // required
                      />
                      {BasicDetailsFormik.errors.email &&
                      BasicDetailsFormik.touched.email ? (
                        <div className={styles.inputError}>
                          {BasicDetailsFormik.errors.email}
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.inputCon}>
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={BasicDetailsFormik.values.password}
                        onChange={BasicDetailsFormik.handleChange}
                        onBlur={BasicDetailsFormik.handleBlur}
                        placeholder="Password"
                        className={
                          BasicDetailsFormik.errors.password &&
                          BasicDetailsFormik.touched.password &&
                          styles.errorBorder
                        }
                        autoComplete="true"
                        // required
                      />
                      {BasicDetailsFormik.errors.password &&
                      BasicDetailsFormik.touched.password ? (
                        <div className={styles.inputError}>
                          {BasicDetailsFormik.errors.password}
                        </div>
                      ) : null}
                      <ul>
                        <p>Password must include:</p>
                        <li>Minimum 8 letters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One special case character</li>
                        <li>One number</li>
                      </ul>
                    </div>
                    <div className={styles.inputCon}>
                      <label htmlFor="confirm_password">Confirm password</label>
                      <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        value={BasicDetailsFormik.values.confirm_password}
                        onChange={BasicDetailsFormik.handleChange}
                        onBlur={BasicDetailsFormik.handleBlur}
                        placeholder="Confirm password"
                        className={
                          BasicDetailsFormik.errors.confirm_password &&
                          BasicDetailsFormik.touched.confirm_password &&
                          styles.errorBorder
                        }
                        autoComplete="true"
                        // required
                      />
                      {BasicDetailsFormik.errors.confirm_password &&
                      BasicDetailsFormik.touched.confirm_password ? (
                        <div className={styles.inputError}>
                          {BasicDetailsFormik.errors.confirm_password}
                        </div>
                      ) : null}
                    </div>
                    <button type="submit" className="btnPrimary btn--large">
                      Continue
                    </button>
                  </form>
                )}

                {/* Personal Details Form  */}
                {activeIndex == 2 && (
                  <form onSubmit={PersonalDetailsFormik.handleSubmit}>
                    <div className={styles.inputCon}>
                      <label htmlFor="phoneNumber">Phone number</label>
                      <div className={styles.countryCodeInput}>
                        <CountryCode
                          data={phoneCountryData}
                          setData={setPhoneCountryData}
                        />
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={PersonalDetailsFormik.values.phoneNumber}
                          onChange={PersonalDetailsFormik.handleChange}
                          onBlur={PersonalDetailsFormik.handleBlur}
                          placeholder="Phone number"
                          // autoFocus
                          className={
                            PersonalDetailsFormik.errors.phoneNumber &&
                            PersonalDetailsFormik.touched.phoneNumber &&
                            styles.errorBorder
                          }
                          // required
                        />
                      </div>
                      {!isPhoneNumberValidate ? (
                        <div className={styles.inputError}>
                          {"Phone number must be valid"}
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.inputCon}>
                      <label htmlFor="whatsappNumber">Whatsapp number</label>
                      <div className={styles.countryCodeInput}>
                        <CountryCode
                          data={whatsappCountryData}
                          setData={setWhatsappountryData}
                        />
                        <input
                          type="text"
                          name="whatsappNumber"
                          id="whatsappNumber"
                          value={PersonalDetailsFormik.values.whatsappNumber}
                          onChange={PersonalDetailsFormik.handleChange}
                          onBlur={PersonalDetailsFormik.handleBlur}
                          placeholder="Whatsapp number"
                          // autoFocus
                          className={
                            PersonalDetailsFormik.errors.whatsappNumber &&
                            PersonalDetailsFormik.touched.whatsappNumber &&
                            styles.errorBorder
                          }
                          // required
                        />
                      </div>
                      {!isWhatsappNumberValidate ? (
                        <div className={styles.inputError}>
                          {"Whatsapp number must be valid"}
                        </div>
                      ) : null}
                    </div>
                    {formFor === "tutor" && (
                      <div className={styles.inputCon}>
                        <label htmlFor="subjects">Subjects</label>
                        <Select
                          isMulti
                          name="subjects"
                          id="subjects"
                          inputId="subjects"
                          options={subjects}
                          onChange={(values) => {
                            PersonalDetailsFormik.setFieldValue(
                              "subjects",
                              values.map((subject) => {
                                return subject.value;
                              })
                            );
                          }}
                          // className="basic-multi-select"
                          // classNamePrefix="select"
                          value={subjects.filter(
                            (option) =>
                              PersonalDetailsFormik.values.subjects.indexOf(
                                option.value
                              ) >= 0
                          )}
                          onBlur={PersonalDetailsFormik.handleBlur}
                          isClearable={true}
                          isSearchable={true}
                          isDisabled={false}
                          styles={{
                            control: (baseStyles, state) => {
                              return {
                                ...baseStyles,
                                border: state.isFocused
                                  ? "2px solid var(--primary-500) !important"
                                  : PersonalDetailsFormik.errors.subjects
                                  ? "2px solid var(--danger-200) !important"
                                  : "2px solid var(--gray-100) !important",
                                borderRadius: "1rem",
                              };
                            },
                          }}
                        />
                        {PersonalDetailsFormik.errors.subjects &&
                        PersonalDetailsFormik.touched.subjects ? (
                          <div className={styles.inputError}>
                            {PersonalDetailsFormik.errors.subjects}
                          </div>
                        ) : null}
                      </div>
                    )}
                    <div className={styles.buttonsWrapper}>
                      <button type="submit" className="btnPrimary btn--large">
                        Register
                      </button>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="btnNeutral btn--large"
                      >
                        Go back
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <div className={styles.orSepration}>
                <span>Or</span>
                <hr />
              </div>
            </div>
            <div className={styles.loginOption}>
              <p>
                Already have an account?{" "}
                {formFor === "student" ? (
                  <Link to="/login/student">Login</Link>
                ) : formFor === "tutor" ? (
                  <Link to="/login/tutor">Login</Link>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.footerWrapper}>
          <footer>
            <div className="logo">Megamind</div>
            <p>Copyright &copy; Megamind 2022 | All rights reserved</p>
          </footer>
        </div>
      </div>
      {loading && <Spinner msg="Please Wait for Server Response..." />}
    </>
  );
};
