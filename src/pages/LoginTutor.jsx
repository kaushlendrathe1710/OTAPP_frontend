import React from 'react'
import { Helmet } from "react-helmet";

import { Login } from '../components/auth/Login'
import tutor_login_keywords from '../seo/login/tutor_login';

export const LoginTutor = () => {
  return (
    <div>
      <Helmet>
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <title>MyMegaminds</title>
        <meta type="description" content="Register as a Student for exploring new way of education" />
        <meta name="keywords" content={tutor_login_keywords} />
      </Helmet>
        <Login formFor="tutor" />
    </div>
  )
}
