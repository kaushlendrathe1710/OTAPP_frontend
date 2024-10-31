import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import glassStyles from "../../../../../styles/glass.module.scss";
import { MdDelete } from "react-icons/md";

export const UploadReceiptModal = ({ setIsUploadReceiptModalOpen }) => {
  const modalRef = useClickOutside(handleCloseModal);
  const statusArr = ["Un-Paid", "Paid"];

  const formik = useFormik({
    initialValues: {
      documents: [],
      description: "",
      status: "",
    },
    validationSchema: Yup.object({
      documents: Yup.array()
        .min(1, "Must upload minimum one document")
        .required("Document is required"),
      description: Yup.string().required("Description is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
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
    setIsUploadReceiptModalOpen(false);
  }
  return (
    <div
      className={`${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}`}
    >
      <div
        style={{
          maxWidth: "600px",
          minHeight: "fit-content",
          padding: ".5rem .5rem 1.5rem .5rem",
        }}
        className={glassStyles.modalBoxWrapper}
        ref={modalRef}
      >
        <div className={glassStyles.header}>
          <h3>Upload Receipt</h3>
        </div>
        <div className={glassStyles.formWrapper} style={{ marginTop: ".5rem" }}>
          <form onSubmit={formik.handleSubmit}>
            <div className={glassStyles.uploadWrapper}>
              <h4>Upload Receipt Documents</h4>
              <div className={glassStyles.uploadButton}>
                Upload documents
                <input
                  type="file"
                  name="documents"
                  id="documents"
                  accept="image/*, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf"
                  multiple
                  title="Add file"
                  onChange={(e) => {
                    if (e.target.files.length !== 0) {
                      let supportingDocsNamesArr = formik.values.documents?.map(
                        ({ name }) => {
                          return name;
                        }
                      );
                      if (
                        supportingDocsNamesArr.includes(e.target.files[0].name)
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
                          "documents",
                          formik.values.documents.concat(e.target.files[0])
                        );
                      }
                    }
                    // console.log("files: ", e.target.files);
                  }}
                />
              </div>
              {formik.touched.documents && formik.errors.documents ? (
                <div className={glassStyles.error}>
                  {formik.errors.documents}
                </div>
              ) : null}
              {/* <h4>Selected files</h4> */}
              {formik.values.documents.length !== 0 &&
                formik.values.documents?.map(({ name, size }, i) => {
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
                          let filterArr = formik.values.documents?.filter(
                            ({ name: fname }) => {
                              return fname !== name;
                            }
                          );
                          formik.setFieldValue("documents", filterArr);
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
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                name="description"
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
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="status">Status</label>
              <select
                name="status"
                id="status"
                defaultValue={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.status &&
                  formik.touched.status &&
                  glassStyles.errorBorder
                }
              >
                <option value="">Select status</option>
                {statusArr.map((value, i) => {
                  return (
                    <option
                      key={i}
                      value={value}
                      //  selected={formik.values.englishLevel === value}
                    >
                      {value}
                    </option>
                  );
                })}
              </select>
              {formik.errors.status && formik.touched.status && (
                <div className={glassStyles.error}>{formik.errors.status}</div>
              )}
            </div>
            <button type="submit" className="btnPrimary btn--medium">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
