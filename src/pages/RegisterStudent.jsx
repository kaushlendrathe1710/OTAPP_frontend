import React from 'react'
import { Helmet } from "react-helmet";
import { Register } from '../components/auth/Register'
import student_register_keyworkds from '../seo/register/student_keywords'

export const RegisterStudent = () => {
  return (
    <>
      <Helmet>
        <title>MyMegaminds</title>
        <meta description="Register as a Student for exploring new way of education"/>
        <meta name="description" content="Register as a Student for exploring new way of education" />
        <meta name="keywords" content={student_register_keyworkds} />
      </Helmet>
      <Register formFor="student" />
    </>
  )
}
