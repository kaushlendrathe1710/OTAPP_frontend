import { useContext, useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import api, { BASE_URL, getAccessToken } from "../../../../../services/api";
import userContext from "../../../../../context/userContext";

// let URL = "https://stripetest-xzcr.onrender.com"
let URL = BASE_URL;

function Payment({ totalAmount, assignmentTitle, handleSubmit, currency }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const user = useContext(userContext)
  const userData = user?.userData;

  useEffect(() => {
    // fetch(URL+"/payment/payment-config").then(async (r) => {
    //   const { publishableKey } = await r.json();
    //   setStripePromise(loadStripe(publishableKey));
    // });
  }, []);

  useEffect(() => {
    // fetch(URL + "/payment/create-payment-intent", {
    //   method: "POST",
    //   body: JSON.stringify({

    //   }),
    // }).then(async (result) => {
    //   var { clientSecret } = await result.json();
    //   setClientSecret(clientSecret);
    // });
    if (totalAmount && currency) {
      api
        .get("payment/payment-config", {
          headers: {
            Authorization: getAccessToken(),
          },
        })
        .then((res) => {
          const { publishableKey } = res.data;
          setStripePromise(loadStripe(publishableKey));
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .post(
          "payment/create-payment-intent",
          {
            name: userData.name,
            email: userData.email,
            currency: currency,
            amount: totalAmount * 100,
          },
          {
            headers: {
              Authorization: getAccessToken(),
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            let { clientSecret, id } = res.data;
            // console.log('clientSec', clientSecret)
            setClientSecret(clientSecret);
            setPaymentIntentId(id)
          }
        });
    } else {
      console.log("currency or amount not defined");
    }
  }, []);

  return (
    <>
      <h3>{assignmentTitle}</h3>
      <h5 style={{marginBottom: "1rem", marginTop: "0.5rem"}}>
        Amount: &nbsp;&nbsp;
        <span style={{ color: "#555", fontWeight: "bold" }}>
          {totalAmount} {currency}
        </span>
      </h5>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            currency={currency}
            paymentIntentId={paymentIntentId}
            handleSubmitProject={handleSubmit}
          />
        </Elements>
      )}
    </>
  );
}

export default Payment;
