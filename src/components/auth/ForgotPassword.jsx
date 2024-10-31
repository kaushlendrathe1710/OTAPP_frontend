import React, { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import styles from "../../styles/auth.module.scss";
import api from '../../services/api';
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import { Helmet } from "react-helmet";
import change_passwords_keywords from '../../seo/login/password_reset.js/change_password';

export const ForgotPassword = () => {

  const [userType, setUserType] = useState("")
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email"),
    }),
    onSubmit: ({ email }) => {
      setLoading(true)
      handleForgotPassword(email, userType);
    },
  });

  const handleForgotPassword = async (email, userType) => {
    const data = {
      email,
      userType
    }
    try {
      const res = await api.post('/user/forgot-password/send-link', data)
      setLoading(false)
      toast.success(res.data.message, {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--success-color)" },
      });
    } catch (err) {
      setLoading(false)
      const error = err?.response
      let message = ""
      if (error) {
        if (error.status === 422) {
          const len = error.data.validationError.length
          error.data.validationError.forEach((item, i) => message += `${item.message}${i + 1 != len ? " , " : " ."}`)
        }
        else if (error.status === 403) {
          message = error.data.message
        }
        else if (error.status === 409) {
          message = error.data.message
        }
        else if (error.status === 404) {
          message = error.data.message
        }
      }
      if (message) {
        toast.error(message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        })
      } else {
        toast.error(err.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        })
      }
    }
  }

  const handelRadioInput = (e) => {
    setUserType(e.target.value)
  }

  return (
    <>
    <Helmet>
        <title>Forgot Password</title>
        <meta description="forgetting passcodes"/>
        <meta name="description" content="forgot passcodes" />
        <meta name="keywords" content={change_passwords_keywords} />
        <meta name="OG:Description" content="forgot Passcodes" />
      </Helmet>
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
                Forgot password
              </h3>
              <p>
                Please enter your email address and we will send you a reset password link.
              </p>
            </div>
          </div>
          <div className={styles.registerFormContainer}>
            <div className={styles.registerFormWrapper}>
              <div className={styles.registerForm}>
                <form onSubmit={formik.handleSubmit}>
                  <div className={styles.inputCon}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Email"
                      // autoFocus
                      className={
                        formik.errors.email &&
                        formik.touched.email &&
                        styles.errorBorder
                      }
                    // required
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <div className={styles.inputError}>
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.userTypeBox}>
                    <div className={styles.userTypeRadio}>
                      <label
                        className={styles.radioLabel}
                        htmlFor="student"
                      >
                        Student
                      </label>
                      <input
                        value="Student"
                        id='student'
                        required={userType === "Tutor" ? false : true}
                        onChange={handelRadioInput}
                        name="userType"
                        className={styles.radioInput}
                        type="radio" />
                    </div>
                    <div className={styles.userTypeRadio}>
                      <label
                        className={styles.radioLabel}
                        htmlFor="tutor"
                      >
                        Tutor
                      </label>
                      <input
                        value="Tutor"
                        id='tutor'
                        required={userType === "Student" ? false : true}
                        onChange={handelRadioInput}
                        name='userType'
                        className={styles.radioInput}
                        type="radio" />
                    </div>
                  </div>
                  <button type="submit" className="btnPrimary btn--large">
                    Get password reset link
                  </button>
                </form>
              </div>
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
  )
}
