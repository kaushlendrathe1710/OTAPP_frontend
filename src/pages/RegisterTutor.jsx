import React from 'react'
import { Register } from '../components/auth/Register'
import { Helmet } from "react-helmet";
import tutor_register_keyworkds from '../seo/register/tutor_keywords'

export const RegisterTutor = () => {
  return (
    <div>
      <Helmet>
        <title>MyMegaminds</title>
        <meta name="description" content="Register as a Tutor" />
        <meta name="keywords" content={tutor_register_keyworkds} />
      </Helmet>
      <Register formFor="tutor" />
    </div>
  )
}
