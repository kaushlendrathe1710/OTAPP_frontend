import React from 'react';
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import StripeForm from './stripeForm';
import glassStyles from "../../../../../styles/glass.module.scss";

const PUBLIC_KEY = "pk_test_51KGoIISGTsXVITx3weqlrhL5Vtlhr1vtvL0DDSyXIlkZxtvfVORU4SxPzw7RV39wot7IKGag5g1HeJe45yyTfPQg00imjVHLWd"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

const containerStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    width: '100%',
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '100'
}

const StripeContainer = ({ handlePayment, handleSubmitProject }) => {

    const modalRef = useClickOutside(handleCloseModal);

    function handleCloseModal() {
        // setIsPayNowAndLaterModalOpen(false);
      }

    return (
        <div className={`${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}`} >
            <div className={styles.modalBoxWrapper} ref={modalRef}>
                <Elements stripe={stripeTestPromise}>
                    <StripeForm handlePayment={handlePayment} handleSubmitProject={handleSubmitProject} />
                </Elements>
            </div>
        </div>

    )
}

export default StripeContainer;
