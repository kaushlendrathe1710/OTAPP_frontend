import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillFile, AiOutlineDownload } from "react-icons/ai";
import glassStyles from "../../../styles/glass.module.scss";
import { useSubmitProjectFeedbackMutation } from "./Project.hooks";
import moment from "moment";

const ProjectFeedbackModal = ({
  open = false,
  setOpen,
  project: propProject,
}) => {
  const project = React.useMemo(() => {
    return propProject;
  }, [propProject]);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent" style={{ maxWidth: "768px" }}>
          <Dialog.Title className="DialogTitle">Provide Feedback</Dialog.Title>
          <FeedbackForm project={project} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const FeedbackForm = ({ project: propProject }) => {
  const project = React.useMemo(() => {
    return propProject;
  }, [propProject]);

  const submitProjectFeedbackMutation = useSubmitProjectFeedbackMutation({
    oldProject: project,
  });

  const formik = useFormik({
    initialValues: {
      feedback: "",
    },
    validationSchema: Yup.object({
      feedback: Yup.string().required("Please provide feedback"),
    }),
    onSubmit: (values) => {
      submitProjectFeedbackMutation.mutate({ feedback: values.feedback });
    },
  });

  return (
    <div className={glassStyles.tutorSubmissionViewWrapper}>
      <div className={glassStyles.filesWrapper}>
        {project?.tutorSubmittedFiles.map((file, i) => {
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
                          file?.uploadedByTutor?.name}
                      </span>
                    </div>
                  </span>
                  <AiOutlineDownload />
                </a>
              </React.Fragment>
            )
          );
        })}
      </div>
      <div className={glassStyles.changesWrapper}>
        <h4>Changes</h4>
        <p>{project?.changes}</p>
      </div>
      <br />
      <form onSubmit={formik.handleSubmit}>
        <div className={glassStyles.inputWrapper}>
          <label htmlFor="feedback">Feedback</label>
          <textarea
            name="feedback"
            id="feedback"
            placeholder="Write feedback here"
            defaultValue={formik.values.feedback}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.errors.feedback &&
              formik.touched.feedback &&
              glassStyles.errorBorder
            }
          ></textarea>
          {formik.errors.feedback && formik.touched.feedback && (
            <div className={glassStyles.error}>{formik.errors.feedback}</div>
          )}
        </div>
      </form>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          marginTop: "1rem",
        }}
      >
        <button
          className="btnSuccess btn--small"
          onClick={formik.handleSubmit}
          disabled={submitProjectFeedbackMutation.isLoading}
        >
          {submitProjectFeedbackMutation.isLoading ? "Submitting" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ProjectFeedbackModal;
