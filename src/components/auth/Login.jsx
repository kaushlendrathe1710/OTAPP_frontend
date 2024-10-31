import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/auth.module.scss";
import api, { getAccessToken } from "../../services/api";
import userContext from "../../context/userContext";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";

const { log } = console;

export const Login = ({ formFor }) => {
  const { setUserData, socket } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email"),
      password: Yup.string().required("Please enter your password"),
    }),
    onSubmit: ({ email, password }) => {
      setLoading(true);
      if (formFor === "student") {
        handleStudentSubmit(email, password);
      } else if (formFor === "tutor") {
        handleTutorSubmit(email, password);
      } else if (formFor === "admin") {
        handleAdminSubmit(email, password);
      }
    },
  });
  useEffect(() => {
    return () => {
      localStorage.removeItem("requestedUrl");
    };
  }, []);
  //tutor login
  async function handleTutorSubmit(emailvalue, passwordvalue) {
    // log(emailvalue, passwordvalue);
    const data = {
      email: emailvalue,
      password: passwordvalue,
    };
    let err = [];
    for (const i in data) {
      if (data[i] === "") {
        err.push(`${i} cannot be empty`);
      }
    }

    if (err.length) {
      toast.error(err, {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--danger-color)" },
      });
      return;
    }

    try {
      const { data: resData } = await api.post("/tutor/login", data);

      localStorage.setItem("access_token", resData.access_token);

      const res = await api.get("/user/me", {
        headers: {
          Authorization: getAccessToken(),
        },
      });

      if (res.data) {
        setUserData(res.data);
        setLoading(false);
        toast.success("logged in successfully", {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
        var path = localStorage.getItem("requestedUrl");
        socket.emit("tutor_admin_go_online", res.data?._id);
        navigateTo(path || "/tutor");
        // navigateTo("/tutor");
        return;
      }
    } catch (err) {
      setLoading(false);
      const error = err?.response;
      let message = "";
      if (error) {
        if (error.status === 401) message = error.data.message;
        else if (error.status === 422) {
          const len = error.data.validationError.length;
          error.data.validationError.forEach(
            (item, i) =>
              (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
          );
        } else if (error.status === 403) {
          message = error.data.message;
        }
      }
      if (message) {
        // alert(message);
        toast.error(message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      } else {
        // alert(err.message);
        toast.error(err.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      }
    }
  }
  //admin login
  async function handleAdminSubmit(emailvalue, passwordvalue) {
    const data = {
      email: emailvalue,
      password: passwordvalue,
    };
    let err = [];
    for (const i in data) {
      if (data[i] === "") {
        err.push(`${i} cannot be empty`);
      }
    }

    if (err.length) {
      // alert(err);
      toast.error(err, {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--danger-color)" },
      });
      return;
    }

    try {
      const { data: resData } = await api.post("/admin/login", data);

      localStorage.setItem("access_token", resData.access_token);

      const res = await api.get("/user/me", {
        headers: {
          Authorization: getAccessToken(),
        },
      });

      if (res.data) {
        setUserData(res.data);
        // setUser(res.data);
        setLoading(false);
        toast.success("logged in successfully", {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
        var path = localStorage.getItem("requestedUrl");

        if (res.data.userType === "Super-Admin") {
          navigateTo(path || "/Super-admin");
        } else if (res.data.userType === "Co-Admin") {
          navigateTo(path || "/Co-admin");
        } else if (res.data.userType === "Sub-Admin") {
          navigateTo(path || "/Sub-admin");
        } else if (res.data.userType === "Admin") {
          navigateTo(path || "/Admin");
        }

        return;
      }

      // emptyField();
    } catch (err) {
      setLoading(false);
      const error = err?.response;
      let message = "";
      if (error) {
        if (error.status === 401) message = error.data.message;
        else if (error.status === 422) {
          const len = error.data.validationError.length;
          error.data.validationError.forEach(
            (item, i) =>
              (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
          );
        } else if (error.status === 403) {
          message = error.data.message;
        }
      }
      if (message) {
        // alert(message);
        toast.error(message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      } else {
        // alert(err.message);
        toast.error(err.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      }
    }
  }
  async function handleStudentSubmit(emailvalue, passwordvalue) {
    const data = {
      email: emailvalue,
      password: passwordvalue,
    };
    let err = [];
    for (const i in data) {
      if (data[i] === "") {
        err.push(`${i} cannot be empty`);
      }
    }

    if (err.length) {
      // alert(err);
      toast.error(err, {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--danger-color)" },
      });
      return;
    }

    try {
      const { data: resData } = await api.post("/student/login", data);

      localStorage.setItem("access_token", resData.access_token);

      const res = await api.get("/user/me", {
        headers: {
          Authorization: getAccessToken(),
        },
      });

      if (res.data) {
        setUserData(res.data);
        setLoading(false);
        toast.success("logged in successfully", {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
        var path = localStorage.getItem("requestedUrl");
        socket.emit("student_admin_go_online", res.data?._id);
        navigateTo(path || "/student");
        return;
      }
    } catch (err) {
      setLoading(false);
      const error = err?.response;
      let message = "";
      if (error) {
        if (error.status === 401) message = error.data.message;
        else if (error.status === 422) {
          const len = error.data.validationError.length;
          error.data.validationError.forEach(
            (item, i) =>
              (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
          );
        } else if (error.status === 403) {
          message = error.data.message;
        }
      }
      if (message) {
        // alert(message);
        toast.error(message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      } else {
        // alert(err.message);
        toast.error(err.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--danger-color)" },
        });
      }
    }
  }

  return (
    <>
      <div className={styles.registerPageWrapper}>
        <div className={styles.blobWrapper1}>
          <div className="blob"></div>
        </div>
        <div className={styles.blobWrapper2}>
          <div className="blob"></div>
        </div>
        <div className={styles.registerPage}>
          <div
            className={styles.registerHeader}
            style={{
              paddingTop:
                formFor === "Admin" || formFor === "admin" ? "0" : "4rem",
            }}
          >
            <Link to="/" className="logo">
              <h2>Megamind</h2>
            </Link>
            <div className={styles.registerOption}>
              <h3>
                Log in as a{" "}
                {formFor === "student"
                  ? "Student"
                  : formFor === "tutor"
                  ? "Tutor"
                  : formFor === "admin" && "Admin"}
              </h3>
              <p>Let the Hardwork and Prosperity reach you</p>
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
                  <div className={styles.inputCon}>
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Password"
                      className={
                        formik.errors.password &&
                        formik.touched.password &&
                        styles.errorBorder
                      }
                      autoComplete="true"
                      // required
                    />
                    {formik.errors.password && formik.touched.password ? (
                      <div className={styles.inputError}>
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>
                  <Link
                    // to="/forgot-password"
                    to={
                      formFor === "Admin" || formFor === "admin"
                        ? "/admin-forgot-password"
                        : "/forgot-password"
                    }
                    className={styles.forgotPassword}
                  >
                    Forgot Password ?
                  </Link>
                  <button type="submit" className="btnPrimary btn--large">
                    Log in
                  </button>
                </form>
              </div>
              {formFor !== "admin" && (
                <div className={styles.orSepration}>
                  <span>Or</span>
                  <hr />
                </div>
              )}
            </div>
            {formFor !== "admin" && (
              <div className={styles.loginOption}>
                <p>
                  You do not have an account?{" "}
                  {formFor === "student" ? (
                    <Link to="/register/student">Register</Link>
                  ) : formFor === "tutor" ? (
                    <Link to="/register/tutor">Register</Link>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            )}
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
  );
};
