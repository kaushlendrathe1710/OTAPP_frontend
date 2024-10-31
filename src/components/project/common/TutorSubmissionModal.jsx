import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AiFillFile, AiOutlineDownload } from "react-icons/ai";
import { MdDelete, MdInfo } from "react-icons/md";
import { acceptalbeDocTypes } from "../../../../constants/helpers";
import {
  useAcceptTutorProjectMutation,
  useRejectTutorProjectMutation,
} from "./Project.hooks";
import glassStyles from "../../../styles/glass.module.scss";
import moment from "moment";

const TutorSubmissionModal = ({
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
          <Dialog.Title className="DialogTitle">Guidelines</Dialog.Title>
          <TutorSubmissionForm project={project} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const TutorSubmissionForm = ({ project: propProject }) => {
  const project = React.useMemo(() => {
    return propProject;
  }, [propProject]);
  const [submissionReview, setSubmissionReview] = React.useState("");
  const [supportingDocs, setSupportingDocs] = React.useState([]);

  const acceptTutorProjectMutation = useAcceptTutorProjectMutation({
    oldProject: project,
  });
  const rejectTutorProjectMutation = useRejectTutorProjectMutation({
    oldProject: project,
  });

  const handleOnAcceptBtnClick = () => {
    acceptTutorProjectMutation.mutate({ submissionReview, supportingDocs });
  };
  const handleOnRejectBtnClick = () => {
    rejectTutorProjectMutation.mutate({ submissionReview });
  };

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
      <div
        className={glassStyles.uploadWrapper}
        style={{ paddingBottom: "1rem" }}
      >
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
                let supportingDocsNamesArr = supportingDocs?.map(({ name }) => {
                  return name;
                });
                if (supportingDocsNamesArr.includes(e.target.files[0].name)) {
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
                  setSupportingDocs((prev) => [...prev, e.target.files[0]]);
                }
              }
            }}
          />
        </div>
        {supportingDocs?.length !== 0 &&
          supportingDocs?.map(({ name, size }, i) => {
            let sizeInKb = size / 1000;
            let sizeInMb = size / 1000000;
            return (
              <div className={glassStyles.selectedFile} key={i}>
                <div>
                  <h6>{name.length > 20 ? `${name.slice(0, 20)}...` : name}</h6>
                  <span>
                    {sizeInMb >= 1
                      ? `${sizeInMb.toString().slice(0, 5)} MB`
                      : `${sizeInKb.toString().slice(0, 5)} KB`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    let filterArr = supportingDocs?.filter(
                      ({ name: fname }) => {
                        return fname !== name;
                      }
                    );
                    setSupportingDocs(filterArr);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            );
          })}
      </div>
      <div className={glassStyles.changesWrapper}>
        <h4>Changes</h4>
        <p>{project?.changes}</p>
      </div>
      <br />
      <div className={glassStyles.inputWrapper}>
        <label htmlFor="submissionReview">Review</label>
        <textarea
          name="submissionReview"
          id="submissionReview"
          placeholder="Write review here"
          is-long="true"
          value={submissionReview}
          onChange={(e) => setSubmissionReview(e.target.value)}
        ></textarea>
      </div>
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
          onClick={handleOnAcceptBtnClick}
          disabled={acceptTutorProjectMutation.isLoading}
        >
          {acceptTutorProjectMutation.isLoading ? "Accepting" : "Accept"}
        </button>
        <button
          className="btnDanger btn--small"
          onClick={handleOnRejectBtnClick}
          disabled={rejectTutorProjectMutation.isLoading}
        >
          {rejectTutorProjectMutation.isLoading ? "Rejecting" : "Reject"}
        </button>
      </div>
    </div>
  );
};

export default TutorSubmissionModal;
