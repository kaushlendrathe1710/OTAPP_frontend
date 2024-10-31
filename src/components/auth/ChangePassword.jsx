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
import { useNavigate } from "react-router-dom";

export const ChangePassword = ({ formFor, redirectTo }) => {
  const user = useContext(userContext);
  const userData = user?.userData;
  //   console.log("user: ", userData);
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();

  function generateCustomRedirectURL(userType) {
    if (!userType) {
      return "/";
    }
    let url = `/${userType.toLowerCase()}/personal-details`;
    return url;
  }

  function getPatchURLByUserType(userType) {
    let url = ``;
    switch (userType.toLowerCase()) {
      case "super-admin" || "admin" || "sub-admin" || "co-admin":
        url = `/admin/reset-password`;
        break;
      case "tutor":
        url = `/tutor/update-tutor-password`;
        break;
      case "student":
        url = `/student/update-student-password`;
        break;
      default:
        url = ``;
    }
    return url;
  }

  const btnSizeClass = windowWidth > 360 ? "btn--medium" : "btn--small";

  const passwordFormik = useFormik({
    initialValues: {
      email: userData?.email || "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        )
        .required("New password is required"),
      confirmNewPassword: Yup.string()
        .required("Confirm new password is required")
        .oneOf([Yup.ref("newPassword")], "New password must match"),
    }),
    onSubmit: (values) => {
      //   console.log("values: ", values);
      handleUpdatePassword(values);
    },
    onReset: () => {
      //   setIsPasswordEditable(false);
    },
  });

  function handleUpdatePassword(values) {
    let patchUrl = getPatchURLByUserType(userData?.userType);
    // console.log("url: ", patchUrl);
    api
      .patch(
        patchUrl,
        {
          email: values.email,
          password: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      )
      .then((res) => {
        console.log("res", res.data);
        navigate(redirectTo || generateCustomRedirectURL(userData?.userType));
        passwordFormik.handleReset();
        toast.success("Password updated succesfully", { duration: 6000 });
      })
      .catch((e) => {
        console.log(e.response.data.message);
        if (e.response.data.message === "Email or password is incorrect") {
          toast.error("Old password doesn't match", { duration: 4000 });
        } else {
          toast.error("Something went wrong.", { duration: 4000 });
        }
      });
  }
  return (
    <div className={styles.sectionWrapper}>
      <h2 className={utilStyles.headingMd}>Change passowrd</h2>
      <div className={styles.formWrapper}>
        <form
          onSubmit={passwordFormik.handleSubmit}
          onReset={passwordFormik.handleReset}
        >
          <div className={styles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={passwordFormik.values.email}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                placeholder="Enter your registered email"
                className={
                  passwordFormik.errors.email &&
                  passwordFormik.touched.email &&
                  glassStyles.errorBorder
                }
              />
              {passwordFormik.errors.email && passwordFormik.touched.email && (
                <div className={glassStyles.error}>
                  {passwordFormik.errors.email}
                </div>
              )}
            </div>
          </div>
          <div className={styles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                value={passwordFormik.values.oldPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                placeholder="Enter old password"
                className={
                  passwordFormik.errors.oldPassword &&
                  passwordFormik.touched.oldPassword &&
                  glassStyles.errorBorder
                }
              />
              {passwordFormik.errors.oldPassword &&
                passwordFormik.touched.oldPassword && (
                  <div className={glassStyles.error}>
                    {passwordFormik.errors.oldPassword}
                  </div>
                )}
            </div>
          </div>
          <div className={styles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={passwordFormik.values.newPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                placeholder="Enter new password"
                className={
                  passwordFormik.errors.newPassword &&
                  passwordFormik.touched.newPassword &&
                  glassStyles.errorBorder
                }
              />
              {passwordFormik.errors.newPassword &&
                passwordFormik.touched.newPassword && (
                  <div className={glassStyles.error}>
                    {passwordFormik.errors.newPassword}
                  </div>
                )}
            </div>
          </div>
          <div className={styles.bigInputWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                id="confirmNewPassword"
                value={passwordFormik.values.confirmNewPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                placeholder="Confirm new password"
                className={
                  passwordFormik.errors.confirmNewPassword &&
                  passwordFormik.touched.confirmNewPassword &&
                  glassStyles.errorBorder
                }
              />
              {passwordFormik.errors.confirmNewPassword &&
                passwordFormik.touched.confirmNewPassword && (
                  <div className={glassStyles.error}>
                    {passwordFormik.errors.confirmNewPassword}
                  </div>
                )}
            </div>
          </div>
          <div style={{ flexDirection: "row" }} className={styles.btnsWrapper}>
            <button type="submit" className={`btnPrimary ${btnSizeClass}`}>
              Save password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
