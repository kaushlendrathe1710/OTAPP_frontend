import React from 'react'
import { Login } from '../components/auth/Login'
import { Helmet } from "react-helmet";
import admin_login_keywords from '../seo/login/admin_login';


export const LoginAdmin = () => {
  return (
    <div>
      <Helmet>
        <title>MyMegaminds</title>
        <meta type="description" content="Register as a Student for exploring new way of education" />
        <meta name="keywords" content={admin_login_keywords} />
      </Helmet>
        <Login formFor="admin" />
    </div>
  )
}
