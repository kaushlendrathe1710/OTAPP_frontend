import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import glassStyles from "../../../../../styles/glass.module.scss";
import { useQuery } from "react-query";
import axios from "axios";
import CountryCode from "../../../../dropDown/CountryCode";
import { getInputOnlyDateFormat } from "../../../../../lib/getInputDateTimeFormat";
import api, { getAccessToken } from "../../../../../services/api";
import { toast } from "react-hot-toast";

export const LinkGenerationEditModal = ({
  setIsLinkGenerationEditModalOpen,
  clickedPaymentLinkDetails,
  refetch,
}) => {
  let {
    amount,
    currency,
    name,
    email,
    title,
    description,
    createdFor: editLinkFor,
  } = clickedPaymentLinkDetails.metadata;

  let { id } = clickedPaymentLinkDetails;
  const modalRef = useClickOutside(handleCloseModal);

  const [currencies, setCurrencies] = useState([]);

  const { data } = useQuery("countries", async () => {
    const res = await axios.get("https://restcountries.com/v3.1/all");
    return res.data;
  });

  useEffect(() => {
    if (data) {
      let extractCurrencies = data?.map((country) => {
        let currency = "";
        for (const key in country.currencies) {
          currency = key;
        }
        return currency;
      });
      setCurrencies(Array.from(new Set(extractCurrencies)));
      // console.log("data: ", Array.from(new Set(extractCurrencies)));
      // console.log("data: ",extractCurrencies);
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {
      name: name,
      email: email,
      amount: amount / 100,
      currency: currency,
      title: title,
      description: description,
      createdFor: editLinkFor,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(3, "Title must included minimum 3 letters"),
      name: Yup.string()
        .required("Name is required")
        .min(3, "Name must included minimum 3 letters"),
      email: Yup.string().email().required("Email is required"),
      amount: Yup.number()
        .required("Amount is required")
        .min(1, "Minimum value will be 1"),
      currency: Yup.string().required("Currency is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      let newValues = {
        amount: values.amount,
        currency: values.currency,
        title: values.title,
        description: values.description,
        name: values.name,
        email: values.email,
        createdFor: values.createdFor,
      };
      console.log(newValues, id);
      api
        .patch(`/payment/update-payment-link?paymentLinkId=${id}`, newValues, {
          headers: {
            Authorization: getAccessToken(),
          },
        })
        .then((res) => {
          toast.success("Payment link updated successfully");
          refetch();
          console.log("res: ", res.data);
          handleCloseModal();
        })
        .catch((e) => {
          toast.error("Something went wrong\nPlease try again", {
            duration: 4000,
          });
          console.log(e);
        });
    },
  });

  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);
  function handleCloseModal() {
    setIsLinkGenerationEditModalOpen(false);
  }
  return (
    <div className={`${glassStyles.modalWrapper}`}>
      <div
        style={{
          maxWidth: "540px",
          minHeight: "fit-content",
          padding: ".5rem 1rem 1.5rem 1rem",
        }}
        className={glassStyles.modalBoxWrapper}
        ref={modalRef}
      >
        <div className={glassStyles.header}>
          <h3>Edit link for {editLinkFor}</h3>
        </div>
        <div className={glassStyles.formWrapper} style={{ marginTop: ".5rem" }}>
          <form onSubmit={formik.handleSubmit}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Enter ${editLinkFor} name`}
                className={
                  formik.errors.name &&
                  formik.touched.name &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.name && formik.touched.name ? (
                <div className={glassStyles.error}>{formik.errors.name}</div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Enter ${editLinkFor} email`}
                className={
                  formik.errors.email &&
                  formik.touched.email &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.email && formik.touched.email ? (
                <div className={glassStyles.error}>{formik.errors.email}</div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Enter payment amount`}
                className={
                  formik.errors.amount &&
                  formik.touched.amount &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.amount && formik.touched.amount ? (
                <div className={glassStyles.error}>{formik.errors.amount}</div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="currency">Currency</label>
              <select
                type="number"
                id="currency"
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Select currency`}
                className={
                  formik.errors.currency &&
                  formik.touched.currency &&
                  glassStyles.errorBorder
                }
              >
                <option value="">Select currency</option>
                {currencies.length > 0 ? (
                  currencies?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option value="">Unable to fetch currencies</option>
                )}
              </select>
              {formik.errors.currency && formik.touched.currency ? (
                <div className={glassStyles.error}>
                  {formik.errors.currency}
                </div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formik.values.title}
                placeholder="Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.title && formik.touched.title ? (
                <div className={glassStyles.error}>{formik.errors.title}</div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Type description here`}
                className={
                  formik.errors.description &&
                  formik.touched.description &&
                  glassStyles.errorBorder
                }
              ></textarea>
              {formik.errors.description && formik.touched.description ? (
                <div className={glassStyles.error}>
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
            <button type="submit" className="btnPrimary btn--large">
              Update Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
