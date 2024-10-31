import React, { useEffect } from 'react'
import ResetPasswordForm from '../components/auth/ResetPasswordForm'
import { useParams } from 'react-router-dom'
import { Helmet } from "react-helmet";
import reset_passwords_keywords from '../seo/login/password_reset.js/reset_password';

const ResetPassword = () => {

    const { token1, token2, token3 } = useParams()

    const authToken = `${token1}.${token2}.${token3}`

    return (
        <div>
            <Helmet>
                <title>Reset Password</title>
                <meta description="Register as a Student for exploring new way of education" />
                <meta name="description" content="Register as a Student for exploring new way of education" />
                <meta name="keywords" content={reset_passwords_keywords} />
            </Helmet>
            <ResetPasswordForm authToken={authToken} />
        </div>
    )
}

export default ResetPassword
