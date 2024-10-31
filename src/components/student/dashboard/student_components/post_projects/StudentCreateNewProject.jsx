import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDelete, MdInfo } from "react-icons/md";
import { toast } from "react-hot-toast";
import api, { getAccessToken } from "../../../../../services/api";
import userContext from "../../../../../context/userContext";
import { StudentModal } from "./StudentModal";
import { acceptalbeDocTypes } from "../../../../../../constants/helpers";
import styles from "../../../../../styles/student.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";

import PaymentModal from "./paymentModal";
import { useStudentCreateNewProjectMutation } from "../../../../project/common/Project.hooks";

// kunal handle function
// let ratesObj = [
//   { 500: 50 }, // 0-500 - 50
//   { 1100: 20 }, //501-1100->> 600  -20rs/word
//   { 1500: 10 },//1101-1500->>400    10rs/word
//   { 2000: 7 },//1501-2000->500     7rs /word
//   { "@": 5 },//4000-2000-> 2000   5rs/word
// ];
// 4000 : 28550
export function rateCalculator(input, ratesObj) {
  if (ratesObj.length === 0) {
    return 0;
  }
  // console.log(input, " ", ratesObj);

  let words = input;
  let allotedprice = 0;
  let rates = ratesObj;

  console.log(rates.length);

  // console.log(Object.keys(rates[0])[0]);
  if (0 < words && words <= Object.keys(rates[0])[0]) {
    allotedprice = Object.values(rates[0])[0];
    // console.log(allotedprice);
  } else if (words > Object.keys(rates[0])[0]) {
    for (let i = 1; i <= rates.length - 2; i++) {
      // console.log(i)
      if (
        Object.keys(rates[i - 1])[0] < words &&
        words <= Object.keys(rates[i])[0]
      ) {
        const newWord = words - Object.keys(rates[i - 1])[0];
        // console.log(Object.keys(rates[i])[0],rates[i])
        allotedprice = allotedprice + newWord * Object.values(rates[i])[0];
        // console.log(allotedprice);
      }
      // console.log(Object.keys(rates[i])[0])
      if (words > Object.keys(rates[i])[0]) {
        allotedprice =
          allotedprice +
          (Object.keys(rates[i])[0] - Object.keys(rates[i - 1])[0]) *
            Object.values(rates[i])[0];
      } else {
        // console.log("1");
      }
    }
    if (words > Object.keys(rates[rates.length - 1])[0]) {
      const newWord = words - Object.keys(rates[rates.length - 1])[0];
      // console.log(Object.keys(rates[i])[0],rates[i])
      allotedprice =
        allotedprice + newWord * Object.values(rates[rates.length - 1])[0];
      // console.log(allotedprice);
    }

    allotedprice = allotedprice + Object.values(rates[0])[0];
  }

  // console.log(allotedprice);
  return allotedprice;

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------
}

export function convertObjStrValueToNumber(arr) {
  if (arr.length === 0) return [];
  let newArr = arr?.map((obj) => {
    let newKey = 0;
    let newValue = 0;
    for (let key in obj) {
      newKey = Number(key);
      newValue = Number(obj[key]);
    }
    return { key: newKey, keyValueObj: { [newKey]: newValue } };
  });
  let sortArr = newArr
    .sort((a, b) => a.key - b.key)
    .map((obj) => obj.keyValueObj);
  return sortArr;
}

export const StudentCreateNewProject = () => {
  const navigate = useNavigate();
  const { userData } = useContext(userContext);

  const studentCreateNewProjectMutation = useStudentCreateNewProjectMutation({
    onSuccess: () => {
      toast.success("Project created successfully.");
      navigate("/student/home");
    },
  });

  let countryId = userData?.phoneCountry._id;

  useEffect(() => {
    if (userData) {
      localStorage.setItem("countryId", userData?.phoneCountry._id);
    }
  }, [userData]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = React.useState(false);
  const [subjects, setSubjects] = useState([]);
  const styleArr = ["Apa", "Harvard", "Chicago", "MLA", "Others"];
  const wordSelectionArr = [
    { label: "No of Pages", value: "numberOfPages" },
    { label: "No of Words", value: "numberOfWords" },
  ];

  const [pagesRate, setPagesRate] = useState([]);
  const [wordsRate, setWordsRate] = useState([]);
  const [slidesRate, setSlidesRate] = useState([]);
  const [miscellaneousRate, setMiscellaneousRate] = useState([]);

  const [pagesOrWordsAmount, setPagesOrWordsAmount] = useState(0);
  const [slidesAmount, setSlidesAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currency, setCurrency] = useState("");

  const { data: projectRates } = useQuery("project-rates", async () => {
    if (!countryId) {
      countryId = localStorage.getItem("countryId");
    }
    const res = await api.get(
      `project-rate/get-all-country-with-id?country_id=${countryId}`,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    return res.data;
  });

  const [isAnyWordSelected, setIsAnyWordSelected] = useState(false);
  const [wordSelectedValue, setWordSelectedValue] = useState(
    wordSelectionArr[0].value
  );
  const [isPPTSelected, setIsPPTSelected] = useState(false);
  const [isMiscellaneouSelected, setIsMiscellaneousSelected] = useState(false);
  const [isExcelSelected, setIsExcelSelected] = useState(false);

  const formik = useFormik({
    initialValues: {
      assignmentTitle: "",
      subject: "",
      documentType: [],
      englishLevel: "",
      style: "Apa",
      deadline: "",
      description: "",
      additionalNotes: "",
      amount: "0",
      files: [],
      numberOfSlides: 0,
      numberOfPages: 0,
      numberOfWords: 0,
      Miscellaneous: "",
      sPayment: 0,
      status: "Un-Paid",
    },
    validationSchema: Yup.object().shape({
      assignmentTitle: Yup.string().required("Assignment title is required"),
      subject: Yup.string().required("Please select your subject"),
      documentType: Yup.array()
        .min(1, "Please select at least one document type")
        .required("Please select document type"),
      englishLevel: Yup.string().required("Please select english level"),
      style: Yup.string().required("Please select referencing style"),
      deadline: Yup.string().required("Please select deadline of assignment"),
      description: Yup.string().required("Description is required"),
      additionalNotes: Yup.string(),
      files: Yup.array(),
      amount: Yup.string(),
      status: Yup.string(),
    }),
    onSubmit: (values) => {
      handlePayNowAndLaterModal();
    },
  });

  useEffect(() => {
    if (projectRates) {
      let currencyKey = projectRates[0]?.projectRate.currency;
      let projectRate = projectRates[0]?.projectRate;
      let str_pagesRates = projectRate?.pagesRate;
      let str_wordsRates = projectRate?.wordsRate;
      let str_slidesRates = projectRate?.slidesRate;
      let str_miscellaneousRates = projectRate?.miscellaneousRate;

      setCurrency(currencyKey);
      setPagesRate(convertObjStrValueToNumber(str_pagesRates));
      setWordsRate(convertObjStrValueToNumber(str_wordsRates));
      setSlidesRate(convertObjStrValueToNumber(str_slidesRates));
      setMiscellaneousRate(convertObjStrValueToNumber(str_miscellaneousRates));
    }
  }, [projectRates, totalAmount]);

  useEffect(() => {
    let nPages = formik.values.numberOfPages;
    let nWords = formik.values.numberOfWords;
    let nSlides = formik.values.numberOfSlides;
    if (wordSelectedValue === "numberOfPages" && pagesRate.length !== 0) {
      let amount = rateCalculator(nPages, pagesRate);
      setPagesOrWordsAmount(amount);
    } else if (
      wordSelectedValue === "numberOfWords" &&
      wordsRate.length !== 0
    ) {
      let amount = rateCalculator(nWords, wordsRate);
      setPagesOrWordsAmount(amount);
    } else {
      setPagesOrWordsAmount(0);
    }
    if (nSlides > 0 && slidesRate.length !== 0) {
      let amount = rateCalculator(nSlides, slidesRate);
      setSlidesAmount(amount);
    } else {
      setSlidesAmount(0);
    }
  }, [
    formik.values.numberOfPages,
    formik.values.numberOfSlides,
    formik.values.numberOfWords,
  ]);

  useEffect(() => {
    setTotalAmount(pagesOrWordsAmount + slidesAmount);
    formik.setFieldValue("sPayment", pagesOrWordsAmount + slidesAmount);
  }, [pagesOrWordsAmount, slidesAmount]);

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

  useEffect(() => {
    formik.setFieldValue("numberOfPages", 0);
    formik.setFieldValue("numberOfWords", 0);
    setPagesOrWordsAmount(0);
  }, [wordSelectedValue]);

  useEffect(() => {
    if (formik.values.documentType.includes("ppt")) {
      setIsPPTSelected(true);
    } else {
      setIsPPTSelected(false);
    }

    if (formik.values.documentType.includes("word")) {
      setIsAnyWordSelected(true);
    } else {
      setIsAnyWordSelected(false);
    }
    if (formik.values.documentType.includes("excel")) {
      setIsExcelSelected(true);
    } else {
      setIsExcelSelected(false);
    }
  }, [formik.values.documentType]);

  async function handleSubmit(paymentStatus) {
    if (paymentStatus) {
      formik.values.status = "Paid";
    }
    let values = formik.values;
    await studentCreateNewProjectMutation.mutateAsync({ values });
  }

  function handlePayNowAndLaterModal() {
    setIsStudentModalOpen(true);
  }

  async function handlePayment() {
    setIsStudentModalOpen(false);
    setIsPaymentModalOpen(true);
  }

  return (
    <div className="outletContainer">
      <PaymentModal
        open={isPaymentModalOpen}
        setOpen={setIsPaymentModalOpen}
        currency={currency}
        handleSubmit={handleSubmit}
        totalAmount={totalAmount}
        assignmentTitle={formik?.values?.assignmentTitle}
      />
      <StudentModal
        open={isStudentModalOpen}
        setOpen={setIsStudentModalOpen}
        handleSubmit={handleSubmit}
        handlePayment={handlePayment}
      />
      <section className={styles.postProjectSection}>
        <h4>Create new assignment</h4>
        <div className={styles.formWrapper}>
          <form onSubmit={formik.handleSubmit}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="assignment-id">Assignment id</label>
              <input
                type="text"
                id="assignment-id"
                // disabled
                readOnly
                placeholder="It will generate automatically"
              />
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="assignmentTitle">Assignment title</label>
              <input
                type="text"
                name="assignmentTitle"
                id="assignmentTitle"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter assignment title here"
                className={
                  formik.errors.assignmentTitle &&
                  formik.touched.assignmentTitle &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.assignmentTitle &&
                formik.touched.assignmentTitle && (
                  <div className={glassStyles.error}>
                    {formik.errors.assignmentTitle}
                  </div>
                )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="subject">Subjects</label>
              <select
                name="subject"
                id="subject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.subject &&
                  formik.touched.subject &&
                  glassStyles.errorBorder
                }
              >
                <option value="">Select your subject</option>
                {subjects.map(({ value }, i) => {
                  return (
                    <option key={i} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              {formik.errors.subject && formik.touched.subject && (
                <div className={glassStyles.error}>{formik.errors.subject}</div>
              )}
            </div>
            <div className={glassStyles.checkboxWrapper}>
              <h4>Document Type</h4>
              <div className={glassStyles.flexWrapper}>
                <div>
                  <input
                    type="checkbox"
                    name="documentType"
                    id="word"
                    value="word"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="word">Word</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="documentType"
                    id="ppt"
                    value="ppt"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="ppt">PPT</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="documentType"
                    id="excel"
                    value="excel"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="excel">Excel</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="documentType"
                    id="miscellaneous"
                    value="miscellaneous"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="miscellaneous">Miscellaneous</label>
                </div>
              </div>
              {formik.errors.documentType && formik.touched.documentType && (
                <div className={glassStyles.error}>
                  {formik.errors.documentType}
                </div>
              )}
            </div>
            <div className={styles.documentAllConditionsWrapper}>
              {formik.values.documentType.includes("word") ? (
                <div className={styles.wordConditionWrapper}>
                  <select
                    name="wordSelection"
                    id="wordSelection"
                    onChange={(e) => setWordSelectedValue(e.target.value)}
                  >
                    {wordSelectionArr.map(({ value, label }) => {
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor={wordSelectedValue}>
                    {
                      wordSelectionArr.filter(
                        ({ value }) => value === wordSelectedValue
                      )[0].label
                    }
                    :
                  </label>
                  <input
                    type="number"
                    id={wordSelectedValue}
                    name={wordSelectedValue}
                    value={formik.values[wordSelectedValue]}
                    placeholder={
                      wordSelectionArr.filter(
                        ({ value }) => value === wordSelectedValue
                      )[0].label
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors[wordSelectedValue] &&
                      formik.touched[wordSelectedValue] &&
                      glassStyles.errorBorder
                    }
                  />
                  {formik.errors[wordSelectedValue] &&
                    formik.touched[wordSelectedValue] && (
                      <div className={glassStyles.error}>
                        {formik.errors[wordSelectedValue]}
                      </div>
                    )}
                </div>
              ) : null}
              {formik.values.documentType.includes("ppt") ? (
                <div className={styles.wordConditionWrapper}>
                  <label htmlFor="numberOfSlides">Number of Slides:</label>
                  <input
                    type="number"
                    id="numberOfSlides"
                    name="numberOfSlides"
                    value={formik.values.numberOfSlides}
                    placeholder={`Number of slides`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.numberOfSlides &&
                      formik.touched.numberOfSlides &&
                      glassStyles.errorBorder
                    }
                  />
                  {formik.errors.numberOfSlides &&
                    formik.touched.numberOfSlides && (
                      <div className={glassStyles.error}>
                        {formik.errors.numberOfSlides}
                      </div>
                    )}
                </div>
              ) : null}
              {formik.values.documentType.includes("miscellaneous") ? (
                <div className={styles.wordConditionWrapper}>
                  <label htmlFor="Miscellaneous">Miscellaneous document:</label>
                  <input
                    style={{ maxWidth: "425px", width: "100%" }}
                    type="text"
                    id="Miscellaneous"
                    name="Miscellaneous"
                    value={formik.values.Miscellaneous}
                    placeholder={`Write miscellaneous document type`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.Miscellaneous &&
                      formik.touched.Miscellaneous &&
                      glassStyles.errorBorder
                    }
                  />
                  {formik.errors.Miscellaneous &&
                    formik.touched.Miscellaneous && (
                      <div className={glassStyles.error}>
                        {formik.errors.Miscellaneous}
                      </div>
                    )}
                </div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="englishLevel">English Level</label>
              <select
                name="englishLevel"
                id="englishLevel"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.englishLevel &&
                  formik.touched.englishLevel &&
                  glassStyles.errorBorder
                }
              >
                <option value="">Please select english level</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="professional">Professional</option>
              </select>
              {formik.errors.englishLevel && formik.touched.englishLevel && (
                <div className={glassStyles.error}>
                  {formik.errors.englishLevel}
                </div>
              )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="style">Referencing Style</label>
              <select
                name="style"
                id="style"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.style &&
                  formik.touched.style &&
                  glassStyles.errorBorder
                }
              >
                {styleArr.map((value, i) => {
                  return (
                    <option key={i} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              {formik.errors.style && formik.touched.style && (
                <div className={glassStyles.error}>{formik.errors.style}</div>
              )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="deadline">Deadline</label>
              <input
                type="datetime-local"
                name="deadline"
                id="deadline"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.deadline &&
                  formik.touched.deadline &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.deadline && formik.touched.deadline && (
                <div className={glassStyles.error}>
                  {formik.errors.deadline}
                </div>
              )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder="Write description here"
                is-long="true"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.description &&
                  formik.touched.description &&
                  glassStyles.errorBorder
                }
              ></textarea>
              {formik.errors.description && formik.touched.description && (
                <div className={glassStyles.error}>
                  {formik.errors.description}
                </div>
              )}
            </div>
            <div className={glassStyles.uploadWrapper}>
              <h4>Upload Assignment guidelines and Supporting Docs</h4>
              <div className={glassStyles.uploadButton}>
                Upload documents
                <input
                  type="file"
                  name="files"
                  id="files"
                  accept={acceptalbeDocTypes}
                  multiple
                  title="Add file"
                  onChange={(e) => {
                    if (e.target.files.length !== 0) {
                      let filesNamesArr = formik.values.files.map(
                        ({ name }) => {
                          return name;
                        }
                      );
                      if (filesNamesArr.includes(e.target.files[0].name)) {
                        toast("File already added", {
                          position: "top-center",
                          duration: 3000,
                          icon: <MdInfo fill="var(--warning-500)" />,
                          style: {
                            padding: ".5rem 1rem",
                            backgroundColor: "white",
                            borderRadius: ".75rem",
                            border: "2px solid var(--warning-300)",
                          },
                        });
                      } else {
                        formik.setFieldValue(
                          "files",
                          formik.values.files.concat(e.target.files[0])
                        );
                      }
                    }
                    // console.log("files: ", e.target.files);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.errors.files && formik.touched.files && (
                <div className={glassStyles.error}>{formik.errors.files}</div>
              )}
              {/* <h4>Selected files</h4> */}
              {formik.values.files.length !== 0 &&
                formik.values.files?.map(({ name, size }, i) => {
                  let sizeInKb = size / 1000;
                  let sizeInMb = size / 1000000;
                  return (
                    <div className={glassStyles.selectedFile} key={i}>
                      <div>
                        <h6>
                          {name.length > 20 ? `${name.slice(0, 20)}...` : name}
                        </h6>
                        <span>
                          {sizeInMb >= 1
                            ? `${sizeInMb.toString().slice(0, 5)} MB`
                            : `${sizeInKb.toString().slice(0, 5)} KB`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          let filterArr = formik.values.files?.filter(
                            ({ name: fname }) => {
                              return fname !== name;
                            }
                          );
                          formik.setFieldValue("files", filterArr);
                          // console.log("deleted", filterArr);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  );
                })}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                name="additionalNotes"
                id="additionalNotes"
                placeholder="Addtional notes is optional"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.additionalNotes &&
                  formik.touched.additionalNotes &&
                  glassStyles.errorBorder
                }
              ></textarea>
              {formik.errors.additionalNotes &&
                formik.touched.additionalNotes && (
                  <div className={glassStyles.error}>
                    {formik.errors.additionalNotes}
                  </div>
                )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder={`Total amount: ${totalAmount} ${
                  isExcelSelected ? "+ contact admin for excel rates" : ""
                } ${
                  isMiscellaneouSelected
                    ? `+ contact admin for ${
                        formik.values.Miscellaneous || "Misc."
                      } rates`
                    : ""
                } `}
                // disabled
                readOnly
                value={`Total amount: ${totalAmount} ${
                  isExcelSelected ? "+ contact admin for excel rates" : ""
                } ${
                  isMiscellaneouSelected
                    ? `+ contact admin for ${
                        formik.values.Miscellaneous || "Misc."
                      } rates`
                    : ""
                } `}
              />
            </div>
            <button type="submit" className="btnPrimary btn--medium">
              Submit
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
