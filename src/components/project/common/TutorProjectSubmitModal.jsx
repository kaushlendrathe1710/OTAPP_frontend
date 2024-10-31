import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDelete, MdInfo } from "react-icons/md";
import { acceptalbeDocTypes } from "../../../../constants/helpers";
import glassStyles from "../../../styles/glass.module.scss";
import { useTutorSubmitProjectMutation } from "./Project.hooks";

const TutorProjectSubmitModal = ({
  open = false,
  setOpen,
  isResubmission = false,
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
          <Dialog.Title className="DialogTitle">Submit Assignment</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Upload assignment guidelines and supporting documents
          </Dialog.Description>
          <Form project={project} isResubmission={isResubmission} onSuccess={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Form = ({ project, isResubmission = false, onSuccess = () => {} }) => {
  const tutorSubmitProjectMutation = useTutorSubmitProjectMutation({
    oldProject: project,
    onSuccess,
  });

  const formik = useFormik({
    initialValues: {
      files: [],
      changes: isResubmission ? project?.changes || "" : "",
    },
    validationSchema: Yup.object({
      files: Yup.array()
        .min(1, "Please add at least one doc.")
        .required("Please add assignment submission docs."),
      changes: Yup.string().required("Please add submission reason."),
    }),
    onSubmit: (values) => {
      tutorSubmitProjectMutation.mutate({ values });
    },
  });
  return (
    <div className={glassStyles.formWrapper}>
      <form onSubmit={formik.handleSubmit}>
        <div className={glassStyles.uploadWrapper}>
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
                  let filesNamesArr = formik.values.files.map(({ name }) => {
                    return name;
                  });
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
              }}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.files && formik.touched.files ? (
            <div className={glassStyles.error}>{formik.errors.files}</div>
          ) : null}
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
                      //   console.log("deleted", filterArr);
                    }}
                  >
                    <MdDelete />
                  </button>
                </div>
              );
            })}
        </div>
        <div className={glassStyles.inputWrapper}>
          <label htmlFor="changes">Overview</label>
          <textarea
            name="changes"
            id="changes"
            placeholder="Write overview here"
            is-long="true"
            defaultValue={formik.values.changes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.errors.changes &&
              formik.touched.changes &&
              glassStyles.errorBorder
            }
          ></textarea>
          {formik.errors.changes && formik.touched.changes && (
            <div className={glassStyles.error}>{formik.errors.changes}</div>
          )}
        </div>
        <button
          type="submit"
          className="btnPrimary btn--medium"
          disabled={tutorSubmitProjectMutation.isLoading}
        >
          {tutorSubmitProjectMutation.isLoading ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default TutorProjectSubmitModal;
