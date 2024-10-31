import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import userContext from "../../context/userContext";
import api, { getAccessToken } from "../../services/api";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import styles from "../../styles/personalDetails.module.scss";
import glassStyles from "../../styles/glass.module.scss";
import utilStyles from "../../styles/utils.module.scss";

export const ChangeEmail = ({ formFor, redirectTo }) => {
  const user = useContext(userContext);
  const userData = user?.userData;
  // console.log("user: ", userData);
  const windowWidth = useWindowWidth();

  const btnSizeClass = windowWidth > 360 ? "btn--medium" : "btn--small";

  const formik = useFormik({
    initialValues: {
      email: userData?.email || "",
    },
  });

  return (
    <div className={styles.sectionWrapper}>
      <h2 className={utilStyles.headingMd}>Change email</h2>
      <div className={styles.formWrapper}>
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <div className={styles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your registered email"
                className={
                  formik.errors.email &&
                  formik.touched.email &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.email && formik.touched.email && (
                <div className={glassStyles.error}>{formik.errors.email}</div>
              )}
            </div>
          </div>
          <div style={{ flexDirection: "row" }} className={styles.btnsWrapper}>
            <button type="submit" className={`btnPrimary ${btnSizeClass}`}>
              Save email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
