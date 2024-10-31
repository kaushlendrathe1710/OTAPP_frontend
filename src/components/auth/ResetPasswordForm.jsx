import React, { useState } from 'react'
import { useFormik } from "formik";
import styles from "../../styles/auth.module.scss";
import * as Yup from "yup";
import api from '../../services/api';
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import { useNavigate, Link } from 'react-router-dom';

const ResetPasswordForm = ({ authToken }) => {

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const passwordDetails = useFormik({
        initialValues: {
            password: "",
            confirm_password: ""
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, "Password is too short - should be 8 chars minimum.")
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                )
                .required("Please enter your password"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Please confirm your password"),
        }),
        onSubmit: async ({ password }) => {
            setLoading(true)
            const data = {
                password: password,
                token: authToken
            }

            try {
                const res = await api.post('user/forgot-password/reset-password', data)
                setLoading(false)
                toast.success(res.data.message, {
                    duration: 4000,
                    position: "top-center",
                    style: { border: "2px solid var(--success-color)" },
                });
                navigate('/')
            } catch (err) {
                setLoading(false)
                const error = err?.response
                let message = ""
                if (error) {
                    message = "Invalid Url"
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
        },
    });

    return (
        <>
            <div
                className={styles.registerPageWrapper}
                style={{ paddingTop: '50px' }}
            >
                <div className={styles.registerOption}>
                    <Link to="/" className="logo">
                        <h2 style={{fontWeight: '800'}}>Megamind</h2>
                    </Link>
                    <h3 >Please Enter Your New Password</h3>
                </div>

                <div
                    style={{ width: '400px', height: 'inherit' }}
                    className={styles.registerFormContainer}
                >
                    <form onSubmit={passwordDetails.handleSubmit}>
                        <div
                            style={{ marginTop: '20px', marginBottom: '20px' }}
                            className={styles.inputCon}
                        >
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={passwordDetails.values.password}
                                onChange={passwordDetails.handleChange}
                                onBlur={passwordDetails.handleBlur}
                                placeholder="Password"
                                className={
                                    passwordDetails.errors.password &&
                                    passwordDetails.touched.password &&
                                    styles.errorBorder
                                }
                                autoComplete="true"
                            // required
                            />
                            {passwordDetails.errors.password &&
                                passwordDetails.touched.password ? (
                                <div className={styles.inputError}>
                                    {passwordDetails.errors.password}
                                </div>
                            ) : null}
                            <ul>
                                <p>Password must include:</p>
                                <li>Minimum 8 letters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One special case character</li>
                                <li>One number</li>
                            </ul>
                        </div>
                        <div
                            style={{ marginTop: '20px', marginBottom: '20px' }}
                            className={styles.inputCon}
                        >
                            <label htmlFor="confirm_password">Confirm password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                value={passwordDetails.values.confirm_password}
                                onChange={passwordDetails.handleChange}
                                onBlur={passwordDetails.handleBlur}
                                placeholder="Confirm password"
                                className={
                                    passwordDetails.errors.confirm_password &&
                                    passwordDetails.touched.confirm_password &&
                                    styles.errorBorder
                                }
                                autoComplete="true"
                            // required
                            />
                            {passwordDetails.errors.confirm_password &&
                                passwordDetails.touched.confirm_password ? (
                                <div className={styles.inputError}>
                                    {passwordDetails.errors.confirm_password}
                                </div>
                            ) : null}
                        </div>
                        <button
                            style={{ marginTop: '20px', marginBottom: '20px' }}
                            type="submit"
                            className="btnPrimary btn--large">
                            Continue
                        </button>
                    </form>
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

export default ResetPasswordForm
