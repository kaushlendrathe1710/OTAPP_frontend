import React, { useContext, useState, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { uniqBy } from "lodash";
import { AiFillFile, AiOutlineDownload } from "react-icons/ai";
import { MdCancel, MdDelete } from "react-icons/md";
import userContext from "../../../context/userContext";
import { useProjectRates } from "../../../hooks/useProjectRates";
import { useCoAdmins } from "../../../hooks/useAdmins";
import { useSubjects } from "../../../hooks/useSubjects";
import {
  useProjectFileDeleteMutation,
  useUpdateProjectInAdminForModalMutation,
} from "./Project.hooks";
import { rateCalculator } from "../../student/dashboard/student_components/post_projects/StudentCreateNewProject";
import { acceptalbeDocTypes } from "../../../../constants/helpers";
import { ProjectActions } from "./ProjectActions";
import { USER_TYPES } from "../../../../constants/user";
import { getInputFullDateTimeFormat } from "../../../lib/getInputDateTimeFormat";
import glassStyles from "../../../styles/glass.module.scss";
import studentStyles from "../../../styles/student.module.scss";

const AssignmentModal = ({
  open,
  setOpen,
  project: propProject,
  onProjectUpdateSuccess = () => {},
}) => {
  const project = useMemo(() => {
    return propProject;
  }, [propProject]);
  const { userData: user } = useContext(userContext);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content
          className="DialogContent"
          style={{ maxWidth: "1280px" }}
        >
          <Dialog.Title className="DialogTitle">
            {user.userType === USER_TYPES.tutor ||
            user.userType === USER_TYPES.student
              ? "Project details"
              : "Edit project"}
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
            {user.userType === USER_TYPES.tutor ||
            user.userType === USER_TYPES.student
              ? "You don't have permission to edit project details."
              : "Make changes to project here. Click update when you're done."}
          </Dialog.Description>
          {project && (
            <AssignmentForm
              project={project}
              onProjectUpdateSuccess={onProjectUpdateSuccess}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const wordSelectionArr = [
  { label: "No of Pages", value: "numberOfPages" },
  { label: "No of Words", value: "numberOfWords" },
];
const englishLevelArr = ["Basic", "Intermediate", "Professional"];
const referencingStyleArr = ["Apa", "Harvard", "Chicago", "MLA", "Others"];
const statusArr = ["Un-Paid", "Paid"];
const mailOptions = [
  { label: "To All Tutors", selected: true },
  { label: "To Specific Tutors", selected: false },
];

const orderStatusArr = [
  {
    label: "New Assignment",
    value: "newAssignment",
  },
  {
    label: "Approved",
    value: "adminApproved",
  },
  {
    label: "Broadcasted",
    value: "coAdminApproved",
  },
  {
    label: "Assigned",
    value: "assigned",
  },
  {
    label: "Completed",
    value: "assignmentSubmitted",
  },
  {
    label: "Accepted",
    value: "submissionAccepted",
  },
  {
    label: "Rejected",
    value: "submissionRejected",
  },
  {
    label: "Cancelled",
    value: "adminRejected",
  },
];

export const AssignmentForm = ({
  project: propProject,
  onProjectUpdateSuccess = () => {},
}) => {
  const project = useMemo(() => {
    return propProject;
  }, [propProject]);
  const {
    assignmentId,
    assignmentTitle,
    assignmentPrice,
    subject,
    deadline,
    orderStatus,
    description,
    additionalNotes,
    createdAt,
    assignedTo,
    tutorPayment,
    sPayment,
    assignedCoAdmin,
    feedbackReview,
    status,
    englishLevel,
    referencingStyle,
    numberOfPages,
    numberOfSlides,
    numberOfWords,
    Miscellaneous,
    downloadUrl,
    files,
  } = project;
  const { userData: user } = useContext(userContext);
  const { data: projectRates = [] } = useProjectRates({ project });
  const { data: subjects = [] } = useSubjects();
  const { data: coAdminsArr = [] } = useCoAdmins();
  // const { data: appliedTutors = [] } = useProjectAppliedTutors({ project });
  const appliedTutors = uniqBy(project?.appliedTutors || [], "_id");
  const updateProjectMutation = useUpdateProjectInAdminForModalMutation({
    oldProject: project,
    onSuccess: onProjectUpdateSuccess,
  });
  const deleteFileInProjectMutation = useProjectFileDeleteMutation({
    oldProject: project,
  });

  const [toSendAllTutors, setToSendAllTutors] = useState(true);

  const [pagesRate, setPagesRate] = useState([]);
  const [wordsRate, setWordsRate] = useState([]);
  const [slidesRate, setSlidesRate] = useState([]);
  const [pagesOrWordsAmount, setPagesOrWordsAmount] = useState(0);
  const [slidesAmount, setSlidesAmount] = useState(0);

  const [wordSelectedValue, setWordSelectedValue] = useState(
    numberOfWords > 0 ? wordSelectionArr[1].value : wordSelectionArr[0].value
  );

  const [isAnyFormikStateChanged, setIsAnyFormikStateChanged] = useState(false);

  const previewFiles = useMemo(() => {
    if (files) {
      return [...files];
    } else {
      return [];
    }
  }, [files]);

  const formik = useFormik({
    initialValues: {
      assignmentId: assignmentId || "",
      assignmentTitle: assignmentTitle || "",
      subject: subject || "",
      documentType: [...project?.documentType],
      englishLevel: englishLevel || "Basic",
      referencingStyle: referencingStyle || "Apa",
      deadline: deadline || "",
      createdAt: createdAt || "",
      description: description || "",
      supportingDocs: [],
      additionalNotes: additionalNotes || "",
      amount: "",
      assignedCoAdmin:
        assignedCoAdmin?.length > 0
          ? assignedCoAdmin[assignedCoAdmin.length - 1]?._id
          : "" || "",
      assignTo: assignedTo?._id || "",
      tutorPayment: Number(tutorPayment) || Number("0"),
      feedbackReview: feedbackReview || "",
      status: status || "Un-Paid",
      orderStatus: orderStatus || "Rejected",
      assignmentPrice: Number(assignmentPrice) || Number("0"),
      sPayment: Number(sPayment) || Number("0"),
      numberOfSlides: numberOfSlides,
      numberOfPages: numberOfPages,
      numberOfWords: numberOfWords,
      Miscellaneous: Miscellaneous,
      downloadUrl: downloadUrl,
    },
    validationSchema: Yup.object({
      assignmentTitle: Yup.string().required("Assignment title is required"),
      subject: Yup.string().required("Please select your subject"),
      documentType: Yup.array()
        .required("Please select document type")
        .min(1, "Please select at least one document type"),
      englishLevel: Yup.string().required("Please select english level"),
      referencingStyle: Yup.string().required(
        "Please select referencing style"
      ),
      deadline: Yup.string().required("Please select deadline of assignment"),
      createdAt: Yup.string(),
      description: Yup.string().required("Description is required"),
      additionalNotes: Yup.string(),
      tutorPayment: Yup.number(),
      feedbackReview: Yup.string(),
      assignedCoAdmin:
        user?.userType === USER_TYPES.coAdmin ||
        user?.userType === USER_TYPES.subAdmin
          ? Yup.string()
          : Yup.string().when("orderStatus", {
              is: (value) =>
                value !== "newAssignment" && value !== "adminRejected",
              then: Yup.string().required("Field is required"),
              otherwise: Yup.string(),
            }),
      sPayment: Yup.number().required("S Payment is required"),
      assignmentPrice: Yup.number(),
    }),
    onSubmit: (values) => {
      if (isAnyFormikStateChanged) {
        updateProjectMutation.mutate({ values });
      }
    },
  });

  useEffect(() => {
    if (numberOfWords > 0) {
      setWordSelectedValue(wordSelectionArr[1].value);
    } else if (numberOfPages > 0) {
      setWordSelectedValue(wordSelectionArr[0].value);
    }
  }, []);

  useEffect(() => {
    if (projectRates) {
      let currencyKey = projectRates[0]?.projectRate.currency;
      let projectRate = projectRates[0]?.projectRate;
      let str_pagesRates = projectRate?.pagesRate;
      let str_wordsRates = projectRate?.wordsRate;
      let str_slidesRates = projectRate?.slidesRate;
      let str_miscellaneousRates = projectRate?.miscellaneousRate;

      setPagesRate(convertObjStrValueToNumber(str_pagesRates));
      setWordsRate(convertObjStrValueToNumber(str_wordsRates));
      setSlidesRate(convertObjStrValueToNumber(str_slidesRates));
    }
  }, [projectRates]);
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
    // --
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
    wordsRate,
    pagesRate,
    slidesRate,
  ]);
  useEffect(() => {
    formik.setFieldValue("sPayment", pagesOrWordsAmount + slidesAmount);
  }, [pagesOrWordsAmount, slidesAmount]);

  useEffect(() => {
    let formikInitialValues = formik.initialValues;
    let formikChangedValues = formik.values;

    let state = false;
    for (let key in formikChangedValues) {
      if (formikChangedValues[key] !== formikInitialValues[key]) {
        state = true;
      }
    }
    setIsAnyFormikStateChanged(state);
  }, [formik.values]);

  const handleFileDelete = (fileUrl) => {
    deleteFileInProjectMutation.mutate({ project, fileUrl });
  };

  return (
    <div>
      <div className={glassStyles.formWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="assignmentId">Assignment id</label>
              <input
                type="text"
                id="assignmentId"
                value={formik.values.assignmentId}
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
                defaultValue={formik.values.assignmentTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter assignment title here"
                readOnly={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
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
          </div>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="subject">Subject</label>
              <select
                name="subject"
                id="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                className={
                  formik.errors.subject &&
                  formik.touched.subject &&
                  glassStyles.errorBorder
                }
              >
                <option value="">Select your subject</option>
                {subjects?.map(({ value }) => {
                  return (
                    <option key={value} value={value}>
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
                    disabled={
                      user?.userType === USER_TYPES.tutor ||
                      user?.userType === USER_TYPES.student
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultChecked={project.documentType.includes("word")}
                  />
                  <label htmlFor="word">Word</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="documentType"
                    id="ppt"
                    value="ppt"
                    disabled={
                      user?.userType === USER_TYPES.tutor ||
                      user?.userType === USER_TYPES.student
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultChecked={project.documentType.includes("ppt")}
                  />
                  <label htmlFor="ppt">PPT</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="documentType"
                    id="excel"
                    value="excel"
                    disabled={
                      user?.userType === USER_TYPES.tutor ||
                      user?.userType === USER_TYPES.student
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultChecked={project.documentType.includes("excel")}
                  />
                  <label htmlFor="excel">Excel</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="documentType"
                    id="miscellaneous"
                    value="miscellaneous"
                    disabled={
                      user?.userType === USER_TYPES.tutor ||
                      user?.userType === USER_TYPES.student
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultChecked={project.documentType.includes(
                      "miscellaneous"
                    )}
                  />
                  <label htmlFor="miscellaneous">Miscellaneous</label>
                </div>
              </div>
              {formik.errors.documentType && formik.touched.documentType && (
                <div className={glassStyles.error}>
                  {formik.errors.documentType}
                </div>
              )}
              <div className={studentStyles.documentAllConditionsWrapper}>
                {formik.values.documentType.includes("word") ? (
                  <div className={studentStyles.wordConditionWrapper}>
                    <select
                      name="wordSelection"
                      id="wordSelection"
                      disabled={
                        user?.userType === USER_TYPES.tutor ||
                        user?.userType === USER_TYPES.student
                      }
                      onChange={(e) => {
                        formik.setFieldValue("numberOfPages", 0);
                        formik.setFieldValue("numberOfWords", 0);
                        setWordSelectedValue(e.target.value);
                      }}
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
                      readOnly={
                        user?.userType === USER_TYPES.tutor ||
                        user?.userType === USER_TYPES.student
                      }
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
                  <div className={studentStyles.wordConditionWrapper}>
                    <label htmlFor="numberOfSlides">Number of Slides:</label>
                    <input
                      type="number"
                      id="numberOfSlides"
                      name="numberOfSlides"
                      value={formik.values.numberOfSlides}
                      readOnly={
                        user?.userType === USER_TYPES.tutor ||
                        user?.userType === USER_TYPES.student
                      }
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
                  <div className={studentStyles.wordConditionWrapper}>
                    <label htmlFor="Miscellaneous">
                      Miscellaneous document:
                    </label>
                    <input
                      style={{ maxWidth: "425px", width: "100%" }}
                      type="text"
                      id="Miscellaneous"
                      name="Miscellaneous"
                      value={formik.values.Miscellaneous}
                      readOnly={
                        user?.userType === USER_TYPES.tutor ||
                        user?.userType === USER_TYPES.student
                      }
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
            </div>
          </div>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="englishLevel">English Level</label>
              <select
                name="englishLevel"
                id="englishLevel"
                value={formik.values.englishLevel}
                disabled={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.englishLevel &&
                  formik.touched.englishLevel &&
                  glassStyles.errorBorder
                }
              >
                {englishLevelArr.map((value, i) => {
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              {formik.errors.englishLevel && formik.touched.englishLevel && (
                <div className={glassStyles.error}>
                  {formik.errors.englishLevel}
                </div>
              )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="referencingStyle">Referencing Style</label>
              <select
                name="referencingStyle"
                id="referencingStyle"
                value={formik.values.referencingStyle}
                disabled={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.referencingStyle &&
                  formik.touched.referencingStyle &&
                  glassStyles.errorBorder
                }
              >
                {referencingStyleArr.map((value, i) => {
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              {formik.errors.referencingStyle &&
                formik.touched.referencingStyle && (
                  <div className={glassStyles.error}>
                    {formik.errors.referencingStyle}
                  </div>
                )}
            </div>
          </div>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="deadline">Deadline <span>{getInputFullDateTimeFormat(deadline)}</span></label>
              <input
                type="datetime-local"
                name="deadline"
                id="deadline"
                value={formik.values.deadline}
                readOnly={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
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
              <label htmlFor="createdAt">Upload date <span>{getInputFullDateTimeFormat(createdAt)}</span></label>
              <input
                type="datetime-local"
                name="createdAt"
                id="createdAt"
                value={formik.values.createdAt}
                readOnly
                className={
                  formik.errors.createdAt &&
                  formik.touched.createdAt &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.createdAt && formik.touched.createdAt && (
                <div className={glassStyles.error}>
                  {formik.errors.createdAt}
                </div>
              )}
            </div>
          </div>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                is-long="true"
                value={formik.values.description}
                readOnly={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Write description here"
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
              <div className={glassStyles.tutorSubmissionViewWrapper}>
                <h3>Guidelines</h3>
                <div className={glassStyles.filesWrapper}>
                  {previewFiles?.map((file, i) => {
                    return (
                      file?.fileUrl && (
                        <React.Fragment key={i}>
                          <a
                            href={file?.fileUrl?.replace("otapp", "megaminds")}
                            title={file?.fileName}
                            className={glassStyles.file}
                          >
                            {file?.uploadedAt && (
                              <span className={glassStyles.uploadTime}>
                                {moment(file?.uploadedAt).calendar()}
                              </span>
                            )}
                            <span>
                              <AiFillFile />
                              <div>
                                <span>
                                  {file?.fileName?.length < 12
                                    ? file?.fileName
                                    : file?.fileName?.slice(0, 12) + "..."}
                                </span>
                                <span>
                                  {file?.uploadedByAdmin?.name ||
                                    file?.uploadedByStudent?.name}
                                </span>
                              </div>
                            </span>
                            <AiOutlineDownload />
                          </a>
                          {user?.userType === USER_TYPES.tutor ||
                          user?.userType === USER_TYPES.student ? null : (
                            <span>
                              <MdCancel
                                style={{
                                  marginLeft: "-20px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  handleFileDelete(file?._id);
                                }}
                              />
                            </span>
                          )}
                        </React.Fragment>
                      )
                    );
                  })}
                </div>
              </div>
              <h4>Upload Assignment guidelines and Supporting Docs</h4>
              {user?.userType === USER_TYPES.tutor ||
              user?.userType === USER_TYPES.student ? null : (
                <div className={glassStyles.uploadButton}>
                  Upload documents
                  <input
                    type="file"
                    name="supportingDocs"
                    id="supportingDocs"
                    accept={acceptalbeDocTypes}
                    multiple
                    title="Add file"
                    onChange={(e) => {
                      if (e.target.files.length !== 0) {
                        let supportingDocsNamesArr =
                          formik.values.supportingDocs.map(({ name }) => {
                            return name;
                          });
                        if (
                          supportingDocsNamesArr.includes(
                            e.target.files[0].name
                          )
                        ) {
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
                            "supportingDocs",
                            formik.values.supportingDocs.concat(
                              e.target.files[0]
                            )
                          );
                        }
                      }
                    }}
                  />
                </div>
              )}
              {/* <h4>Selected files</h4> */}
              {formik.values.supportingDocs.length !== 0 &&
                formik.values.supportingDocs?.map(({ name, size }, i) => {
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
                          let filterArr = formik.values.supportingDocs?.filter(
                            ({ name: fname }) => {
                              return fname !== name;
                            }
                          );
                          formik.setFieldValue("supportingDocs", filterArr);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="assignedCoAdmin">Assign Co-Admin</label>
              <select
                name="assignedCoAdmin"
                id="assignedCoAdmin"
                multiple={false}
                disabled={
                  user?.userType === USER_TYPES.subAdmin ||
                  user?.userType === USER_TYPES.coAdmin ||
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                value={formik.values.assignedCoAdmin}
                onChange={(e) => {
                  let selectedCoAdminId = e.target.value;
                  const filterCoAdmin = coAdminsArr.filter(
                    ({ _id }) => _id === selectedCoAdminId
                  );
                  let name = "";
                  let email = "";
                  let phoneNumber = "";
                  let _id = "";
                  if (filterCoAdmin.length > 0) {
                    name = filterCoAdmin[0].name;
                    email = filterCoAdmin[0].email;
                    phoneNumber = filterCoAdmin[0].phoneNumber;
                    _id = filterCoAdmin[0]._id;
                  }
                  formik.setFieldValue("assignedCoAdmin", selectedCoAdminId);
                }}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.assignedCoAdmin &&
                  formik.touched.assignedCoAdmin &&
                  glassStyles.errorBorder
                }
              >
                <option value="">Assign Co-Admin</option>
                {coAdminsArr?.map(({ name, _id }) => {
                  return (
                    <option key={_id} value={_id}>
                      {name}
                    </option>
                  );
                })}
              </select>
              {formik.errors.assignedCoAdmin &&
                formik.touched.assignedCoAdmin && (
                  <div className={glassStyles.error}>
                    {formik.errors.assignedCoAdmin}
                  </div>
                )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="assignTo">Assign to</label>
              <select
                name="assignTo"
                id="assignTo"
                multiple={false}
                value={formik.values.assignTo}
                disabled={
                  user?.userType === USER_TYPES.subAdmin ||
                  user?.userType === USER_TYPES.coAdmin ||
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                onChange={(e) => {
                  let selectedAppliedTutor = e.target.value;
                  formik.setFieldValue("assignTo", selectedAppliedTutor);
                }}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.assignTo &&
                  formik.touched.assignTo &&
                  glassStyles.errorBorder
                }
              >
                <option value="">Assign Tutor</option>
                {appliedTutors?.map(({ name, _id }) => {
                  return (
                    <option key={_id} value={_id}>
                      {name}
                    </option>
                  );
                })}
              </select>
              {formik.errors.assignTo && formik.touched.assignTo && (
                <div className={glassStyles.error}>
                  {formik.errors.assignTo}
                </div>
              )}
            </div>
          </div>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.bigInputWrapper}>
              {user?.userType === USER_TYPES.student ? null : (
                <div className={glassStyles.inputWrapper}>
                  <label htmlFor="tutorPayment">Tutor Payment</label>
                  <input
                    type="number"
                    name="tutorPayment"
                    id="tutorPayment"
                    value={formik.values.tutorPayment}
                    readOnly={
                      user?.userType === USER_TYPES.tutor ||
                      user?.userType === USER_TYPES.student
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Tutor Payment"
                    className={
                      formik.errors.tutorPayment &&
                      formik.touched.tutorPayment &&
                      glassStyles.errorBorder
                    }
                  />
                  {formik.errors.tutorPayment &&
                    formik.touched.tutorPayment && (
                      <div className={glassStyles.error}>
                        {formik.errors.tutorPayment}
                      </div>
                    )}
                </div>
              )}
              {user?.userType === USER_TYPES.tutor ||
              user?.userType === USER_TYPES.student ? null : (
                <div className={glassStyles.inputWrapper}>
                  <label htmlFor="sPayment">S Payment</label>
                  <input
                    type="number"
                    name="sPayment"
                    id="sPayment"
                    value={formik.values.sPayment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="S payment"
                    className={
                      formik.errors.sPayment &&
                      formik.touched.sPayment &&
                      glassStyles.errorBorder
                    }
                  />
                  {formik.errors.sPayment && formik.touched.sPayment && (
                    <div className={glassStyles.error}>
                      {formik.errors.sPayment}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="feedbackReview">Feedback review</label>
              <textarea
                name="feedbackReview"
                id="feedbackReview"
                is-long="true"
                value={formik.values.feedbackReview}
                readOnly={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Write feedback here"
                className={
                  formik.errors.feedbackReview &&
                  formik.touched.feedbackReview &&
                  glassStyles.errorBorder
                }
              ></textarea>
              {formik.errors.feedbackReview &&
                formik.touched.feedbackReview && (
                  <div className={glassStyles.error}>
                    {formik.errors.feedbackReview}
                  </div>
                )}
            </div>
          </div>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="additionalNotes">Additional notes</label>
              <textarea
                name="additionalNotes"
                id="additionalNotes"
                placeholder="Write additional notes here"
                defaultValue={formik.values.additionalNotes}
                readOnly={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
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
              <label htmlFor="status">Status</label>
              <select
                name="status"
                id="status"
                defaultValue={formik.values.status}
                disabled={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.status &&
                  formik.touched.status &&
                  glassStyles.errorBorder
                }
              >
                {statusArr.map((value) => {
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              {formik.errors.status && formik.touched.status && (
                <div className={glassStyles.error}>{formik.errors.status}</div>
              )}
            </div>
            {user?.userType === USER_TYPES.tutor ||
            user?.userType === USER_TYPES.student ? null : (
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="status">Send Mails To </label>
                <select
                  name="status"
                  id="status"
                  defaultValue={mailOptions[0].selected}
                  onChange={(e) => setToSendAllTutors(e.target.value)}
                >
                  {mailOptions.map((option, i) => {
                    return (
                      <option key={i} value={option.selected}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
          <div className={glassStyles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="orderStatus">Assignment Status</label>
              <select
                name="orderStatus"
                id="orderStatus"
                defaultValue={formik.values.orderStatus}
                disabled={
                  user?.userType === USER_TYPES.tutor ||
                  user?.userType === USER_TYPES.student
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.orderStatus &&
                  formik.touched.orderStatus &&
                  glassStyles.errorBorder
                }
              >
                {orderStatusArr.map(({ value, label }, i) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
              {formik.errors.orderStatus && formik.touched.orderStatus && (
                <div className={glassStyles.error}>
                  {formik.errors.orderStatus}
                </div>
              )}
            </div>
          </div>
          {user?.userType === USER_TYPES.tutor ||
          user?.userType === USER_TYPES.student ? null : (
            <div className={glassStyles.btnsWrapper}>
              <button
                style={{ width: "fit-content" }}
                type="submit"
                className="btnPrimary btn--small"
                disabled={updateProjectMutation.isLoading}
              >
                {updateProjectMutation.isLoading ? "Updating" : "Update"}
              </button>
              <ProjectActions
                row={{ original: project }}
                toSendAllTutors={toSendAllTutors}
                forModal={true}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;

function convertObjStrValueToNumber(arr) {
  if (!arr || arr?.length === 0) return [];
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
