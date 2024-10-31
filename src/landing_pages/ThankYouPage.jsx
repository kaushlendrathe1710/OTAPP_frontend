import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactCanvasConfetti from "react-canvas-confetti";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import styles from "../styles/landingPages.module.scss";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

const ThankYouPage = () => {
  const refConfetti = useRef();
  const [searchParams] = useSearchParams();
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    refConfetti.current?.confetti({
      particleCount: 500,
      spread: 500,
    });
  }, []);
  return (
    <>
      <Helmet>
        <title>Thank You for Choosing MegaMinds!</title>
      </Helmet>
      <ReactCanvasConfetti
        ref={refConfetti}
        colors={["#aa14f0", "#dc9ff9", "#70c86a", "#ff5722", "#f86bdf"]}
        width={width}
        height={height}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        zIndex={9999999999999}
      />
      <Header />
      <div className={styles.thankYouWrapper}>
        <h1>Thank You for Choosing MegaMinds!</h1>
        <p>
          Thank you for filling out our form and expressing interest in our
          online tutoring services. Our team will review your information and
          contact you shortly to schedule your first session. In the meantime,
          please feel free to explore our website and learn more about our
          personalized approach to learning.
        </p>
        <p>
          At MegaMinds, we believe that every student has the potential to
          succeed, and we're here to help you unlock your full potential. Our
          expert tutors are dedicated to providing customized support and
          guidance to help you achieve your academic goals.
        </p>
        <p>
          Thank you for choosing MegaMinds, and we look forward to working with
          you!
        </p>
      </div>
      <Footer />
    </>
  );
};

export default ThankYouPage;
