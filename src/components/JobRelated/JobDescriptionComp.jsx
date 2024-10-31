import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "../../styles/jobcard.module.scss";
import authStyles from "../../styles/auth.module.scss";
import api from "../../services/api";
import { MdAccessTimeFilled, MdLocationPin } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { Loader1 } from "../Loaders/Loader1";
import CountryCode from "../dropDown/CountryCode";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { Footer } from "../footer/Footer";
import toast from "react-hot-toast";

countries.registerLocale(en);

const JobDescriptionComp = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [phoneCountryData, setPhoneCountryData] = useState(null);
  const [whatsappCountryData, setWhatsappountryData] = useState(null);

  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await api.get(`/job/get-all-jobs-in-application-details/${id}`);
    setData(res.data);
    // console.log(res.data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    let countriesObj = countries.getNames("en", { select: "official" });
    let countriesArr = Object.entries(countriesObj).map(([key, value]) => {
      return {
        value: key,
        label: value,
      };
    });

    setAllCountries(countriesArr);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      country: "",
      phoneNumber: "",
      resume: null,
      whatsappNumber: "",
      hireReason: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter your name"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email address"),
      country: Yup.string().required("Please select your country"),
      phoneNumber: Yup.string().required("Phone number is required"),
      whatsappNumber: Yup.string().required("Whatsapp number is required"),
      resume: Yup.mixed().required("Resume is required"),
      hireReason: Yup.string().required("Hiring reason is required"),
    }),
    onSubmit: async (values) => {
      try {
        // console.log(values);
        const { name, email, hireReason, resume, whatsappNumber, phoneNumber } =
          values;
        const data = {
          file: resume,
          aboutQuestion: hireReason,
          job: id,
          phoneNumber: phoneNumber,
          whatsappNumber: whatsappNumber,
          email: email,
          name: name,
          whatsappCountry: whatsappCountryData.id,
          phoneCountry: phoneCountryData.id,
        };
        const formData = new FormData();
        for (let d in data) {
          console.log(d, ":", data[d]);
          formData.append(d, data[d]);
        }

        const res = await api.post("/job-application/create", formData);
        toast.success(
          res.data.message +
            ". \n You will recieve e-mail/call from us if you are found worthy for it.\n Thanks for applying...",
          {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--success-color)" },
          }
        );
      } catch (err) {
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
    },
  });

  return loading ? (
    <div className={styles.loaderWrapper}>
      <Loader1 />
    </div>
  ) : (
    <>
      <div className={styles.jobPageContainer}>
        <div className={styles.jobWrapper}>
          {data.map(
            ({
              _id,
              jobName,
              jobDescription,
              jobRole,
              experience,
              salary,
              jobLocation,
              vacanciesNumber,
            }) => {
              return (
                <div key={_id}>
                  <div className={styles.jobDescription}>
                    <h2>{jobName}</h2>
                    <p>{jobDescription}</p>
                  </div>
                  <div className={styles.jobInfoList}>
                    <div className={styles.jobInfo}>
                      <MdLocationPin />
                      <span style={{ textTransform: "capitalize" }}>
                        {jobLocation}
                      </span>
                    </div>
                    {/* <div className={styles.jobInfoList}> */}
                    <div className={styles.jobInfo}>
                      <h6>Role:</h6>
                      <h5>{jobRole}</h5>
                    </div>
                    <div className={styles.jobInfo}>
                      <h6>Experience:</h6>
                      <h5>{experience}</h5>
                    </div>
                    {/* </div> */}
                  </div>

                  <div className={styles.salaryWrapper}>
                    <h4>Salary:</h4>
                    <h3>Rs. {salary}</h3>
                  </div>
                  <div className={styles.countWrapper}>
                    <p>Total Vacancies:</p>
                    <span>{vacanciesNumber}</span>
                  </div>
                </div>
              );
            }
          )}
          <div className={styles.formWrapper}>
            <h3>Kindly fill out the form below.</h3>
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.contactInfoForm}>
                <h4>Personal Information</h4>
                <div className={authStyles.inputCon}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="name"
                    placeholder="Enter your name"
                    className={`${
                      formik.errors.name &&
                      formik.touched.name &&
                      authStyles.errorBorder
                    }`}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className={authStyles.inputError}>
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
                <div className={authStyles.inputCon}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="email"
                    placeholder="Enter your email"
                    className={`${
                      formik.errors.email &&
                      formik.touched.email &&
                      authStyles.errorBorder
                    }`}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className={authStyles.inputError}>
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
                <div className={authStyles.inputCon}>
                  <label htmlFor="country">Country</label>
                  <select
                    name="country"
                    id="country"
                    onChange={formik.handleChange}
                    value={formik.values.country}
                    onBlur={formik.handleBlur}
                    placeholder="Select your country"
                    className={`${
                      formik.errors.country &&
                      formik.touched.country &&
                      authStyles.errorBorder
                    }`}
                  >
                    <option value="">{"Select your country"}</option>;
                    {allCountries.map(({ value, label }) => {
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  {formik.touched.country && formik.errors.country ? (
                    <div className={authStyles.inputError}>
                      {formik.errors.country}
                    </div>
                  ) : null}
                </div>
                <div className={authStyles.inputCon}>
                  <label htmlFor="phoneNumber">Phone number</label>
                  <div className={authStyles.countryCodeInput}>
                    <CountryCode
                      data={phoneCountryData}
                      setData={setPhoneCountryData}
                    />
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Phone number"
                      // autoFocus
                      className={
                        formik.errors.phoneNumber &&
                        formik.touched.phoneNumber &&
                        styles.errorBorder
                      }
                      // required
                    />
                  </div>
                  {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                    <div className={authStyles.inputError}>
                      {formik.errors.phoneNumber}
                    </div>
                  ) : null}
                </div>
                <div className={authStyles.inputCon}>
                  <label htmlFor="whatsappNumber">Whatsapp number</label>
                  <div className={authStyles.countryCodeInput}>
                    <CountryCode
                      data={whatsappCountryData}
                      setData={setWhatsappountryData}
                    />
                    <input
                      type="tel"
                      name="whatsappNumber"
                      id="whatsappNumber"
                      value={formik.values.whatsappNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Whatsapp number"
                      // autoFocus
                      className={
                        formik.errors.whatsappNumber &&
                        formik.touched.whatsappNumber &&
                        authStyles.errorBorder
                      }
                      // required
                    />
                  </div>
                  {formik.errors.whatsappNumber &&
                  formik.touched.whatsappNumber ? (
                    <div className={authStyles.inputError}>
                      {formik.errors.whatsappNumber}
                    </div>
                  ) : null}
                </div>
                <div className={styles.contactInfoForm}>
                  <h4>Resume</h4>
                  <p>
                    Upload your resume from your device. Acceptable formats are
                    .doc, .docx or .pdf{" "}
                  </p>
                  <div className={styles.resumeInput}>
                    <button className={styles.resumeInputButton}>
                      <BsUpload />
                      <span>Upload file from device</span>
                      <input
                        type="file"
                        name="resume"
                        id="resume"
                        placeholder="Choose file"
                        accept=".doc, .docx, .pdf"
                        onChange={(e) => {
                          formik.setFieldValue("resume", e.target.files[0]);
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </button>
                    {/* <span>{!formik.errors.resume && formik
                    .touched.resume && formik.values.resume.name}</span> */}
                    <span>
                      {formik.touched.resume && formik.values.resume?.name}
                    </span>
                    {formik.errors.resume && formik.touched.resume ? (
                      <div className={authStyles.inputError}>
                        {formik.errors.resume}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className={styles.contactInfoForm}>
                  <div className={authStyles.inputCon}>
                    <label htmlFor="hireReason">
                      Why should you be hired for this role?
                    </label>
                    <textarea
                      name="hireReason"
                      id="hireReason"
                      // cols="30"
                      // rows="10"
                      placeholder="Write your message here"
                      value={formik.values.hireReason}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.errors.hireReason &&
                        formik.touched.hireReason &&
                        authStyles.errorBorder
                      }
                    ></textarea>
                    {formik.errors.hireReason && formik.touched.hireReason ? (
                      <div className={authStyles.inputError}>
                        {formik.errors.hireReason}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    onClick={formik.handleSubmit}
                    className="btnPrimary btn--large"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobDescriptionComp;
