import {PaymentElement, AddressElement, PaymentRequestButtonElement} from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import styles from './checkoutForm.module.css';
import userContext from "../../../../../context/userContext";


// let PaymentElement = strp.PaymentElement;
// let AddressElement = strp.AddressElement;

export default function CheckoutForm({handleSubmitProject, currency, paymentIntentId}) {
  const stripe = useStripe();
  const elements = useElements();

  const user = useContext(userContext);
  const userData = user?.userData;

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    let successUrl = `${window.location.origin}/payment/pi/s/${paymentIntentId}`
    const { error, paymentIntent } = await stripe.confirmPayment({

      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: successUrl,
      },
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment Status: ' + paymentIntent.status + "!");
      handleSubmitProject(true);
    }else{
      setMessage('Unexpected State')
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <AddressElement options={{mode: 'billing'}} />
      {/* {(currency != 'INR') && <AddressElement options={{mode: 'billing'}} />} */}
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submitPaymentBtn" className={styles.submitPaymentBtn}>
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
