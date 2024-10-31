import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { BsCheck2 } from "react-icons/bs";
import api, { getAccessToken } from "../../services/api";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import styles from "../../styles/payments.module.scss";
import { Loader1 } from "../../components/Loaders/Loader1";

async function getPaymentIntent(paymentIntentId) {
  const res = await api.get(
    `/payment/get-payment-intent?paymentIntentId=${paymentIntentId}`,
    {
      headers: {
        Authorization: getAccessToken(),
      },
    }
  );
  return res.data;
}

const PaymentIntentSuccess = () => {
  const { paymentIntentId } = useParams();

  const { data, isError, isLoading } = useQuery({
    queryFn: async () => await getPaymentIntent(paymentIntentId),
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

  if (isError || !data) {
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
            <span>{data?.id.slice(3)}</span>
          </div>
          <div>
            <b>Name:</b>
            <span>{data?.metadata.name}</span>
          </div>
          <div>
            <b>Email:</b>
            <span>{data?.metadata.email}</span>
          </div>
          <div>
            <b>Amount Paid:</b>
            <span>
              {data?.amount_received / 100 + " " + data?.currency.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentIntentSuccess;
