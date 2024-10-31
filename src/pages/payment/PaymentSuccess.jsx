import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { BsCheck2 } from "react-icons/bs";
import api, { getAccessToken } from "../../services/api";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import styles from "../../styles/payments.module.scss";
import { Loader1 } from "../../components/Loaders/Loader1";

async function verifyAndUpdatePaymentLinkStatus(bcryptPaymentLinkId) {
  const res = await api.patch(
    `/payment/update-payment-link-paid-status?bcryptPaymentLinkId=${bcryptPaymentLinkId}`
  );
  return res.data;
}

const PaymentSuccess = () => {
  const { bcryptPaymentLinkId } = useParams();

  const { data, isError, isLoading } = useQuery({
    queryFn: async () =>
      await verifyAndUpdatePaymentLinkStatus(bcryptPaymentLinkId),
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.page}>
          <Loader1 />
          <p>Verifying Payment...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!bcryptPaymentLinkId || isError || !data?.success) {
    return (
      <>
        <Header />
        <div className={styles.page}>
          <h3>
            Your payment id is invalid or didn't exist. Please contact us.
          </h3>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.checkWrapper}>
          <BsCheck2 color="white" />
        </div>
        <h2>Payment Successful</h2>
        <p>
          Thank you for your payment. Your transaction has been processed
          successfully.
        </p>
        <div className={styles.paymentInfo}>
          <div>
            <b>Payment ID:</b>
            <span>{data?.id.slice(5)}</span>
          </div>
          <div>
            <b>Name:</b>
            <span>{data.metadata.name}</span>
          </div>
          <div>
            <b>Email:</b>
            <span>{data.metadata.email}</span>
          </div>
          <div>
            <b>Amount Paid:</b>
            <span>
              {data.metadata.amount / 100 +
                " " +
                data.metadata.currency.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
