import React from "react";
import { Footer } from "../components/footer/Footer";
import { Header } from "../components/header/Header";
import styles from "../styles/Policypage.module.scss";

export const RefundPolicy = () => {
  return (
    <div>
      <Header />
      <div className={styles.policyContainer}>
        <h2>Refund/Cancellation Policy</h2>
        <br />
        <p>
          At Mymegaminds, we are committed to providing our customers with the
          highest level of satisfaction. If for any reason you are not satisfied
          with your purchase, we offer the following Refund/Cancellation Policy.
        </p>
        <h4>Refunds</h4>
        <p>
          If you are not satisfied with your purchase, you may request a full
          refund within 7 days of the purchase date. To
          request a refund, please contact us at +91 9650503696.
          Refunds will be processed within 7 days of receipt of
          the request.
        </p>
        <h4>Cancellations</h4>
        <p>
          If you need to cancel your order, please contact us as soon as
          possible at +91 7481020076. If your order has not yet
          been processed, we will cancel the order and issue a full refund. If
          your order has been processed, we may not be able to cancel it, but
          you may be eligible for a refund under our Refunds policy.
        </p>
        <h4>Exceptions</h4>
        <p>
          This Refund/Cancellation Policy does not apply to certain products or
          services, such as digital products or services delivered
          electronically. For these products and services, all sales are final
          and no refunds will be issued.
        </p>
        <h4>Changes to this Policy</h4>
        <p>
          We may update this Refund/Cancellation Policy from time to time to
          reflect changes in our practices or to comply with legal requirements.
          We will notify you of any material changes to this Policy by posting
          the updated policy on our website. Your continued use of our services
          after the effective date of any changes to this Policy constitutes
          your acceptance of the changes.
        </p>
        <h4>Contact Information</h4>
        <p>
          If you have any questions about this Refund/Cancellation Policy or our
          information practices, please contact us at +91 7481020076.
        </p>
      </div>
      <Footer />
    </div>
  );
};
