import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import personalizedTutoringImg from "../../assets/illus/personalized-tutoring.png";
import scheduleMeetingSvgIllus from "../../assets/illus/schedule_meeting.svg";
import affordablePricingSvgIllus from "../../assets/illus/undraw_savings.svg";
import styles from "../../styles/services.module.scss";

export const OnlineTutoringServices = () => {
  let initialAnimation = { y: 80, opacity: 0 };
  let whileInViewAnimation = { y: 0, opacity: 1 };
  let transition = { type: "keyframes", duration: 0.75 };
  return (
    <>
      <Helmet>
        <title>
          Online Tutoring Services | One-on-One Tutoring | Expert Tutors - My
          Mega Mind
        </title>
        <meta
          title="desc"
          content="Looking for online tutoring services to help you with your studies?
          Our expert tutors can provide one-on-one tutoring in any subject,
          including math tutoring, organic chemistry tutoring, online math
          tutor, java tutors and more. Get personalized help from experienced
          tutors today."
        />
      </Helmet>
      <Header />
      <div className={styles.pageWrapper}>
        <motion.h1
          initial={initialAnimation}
          whileInView={whileInViewAnimation}
          viewport={{ once: true }}
          transition={transition}
        >
          Online Tutoring Services
        </motion.h1>
        <section className={styles.firstSection}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeading}
          >
            Expert Online Tutoring Services
          </motion.h2>

          <motion.p
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            Looking for expert online tutoring services to help you excel
            academically? Look no further than our one-on-one tutoring services!
            Our expert tutors provide personalized tutoring to students of all
            ages and academic levels, helping them achieve their academic goals
            and boost their grades.
          </motion.p>

          <motion.div
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <img
              src={personalizedTutoringImg}
              width={700}
              height="auto"
              alt="personalized service illus"
              style={{ borderRadius: "1rem" }}
            />
            <div>
              <h3>Personalized One-on-One Tutoring</h3>

              <p>
                At our tutoring service, we believe in the power of one-on-one
                tutoring. Unlike group tutoring sessions, one-on-one tutoring
                allows our expert tutors to focus exclusively on your needs,
                helping you learn more effectively and efficiently. Our tutors
                work with you to identify your strengths and weaknesses, develop
                a personalized learning plan, and provide ongoing support and
                guidance to help you achieve academic success.
              </p>
            </div>
          </motion.div>

          <motion.h3
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            Expert Tutors in Any Subject
          </motion.h3>

          <motion.p
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            At our tutoring service, we offer one-on-one tutoring in any subject
            you need help with. From <b>math tutoring</b> and{" "}
            <b>organic chemistry tutoring</b> to <b>java tutors</b> and{" "}
            <b>English tutor online</b>, we have expert tutors who can help you
            master any subject. Whether you need help with homework, test prep,
            or just want to improve your overall understanding of a subject, our
            tutors are here to help.
          </motion.p>
        </section>
        <section className={styles.listSection}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeading}
          >
            Online Tutoring for School and College Students
          </motion.h2>
          <motion.ul
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <li>One-on-one online tutoring sessions</li>
            <li>Personalized attention and tailored instruction</li>
            <li>
              Tutoring in a wide range of subjects, including math, science,
              English, and more
            </li>
            <li>
              Tutoring available for students of all ages and academic levels
            </li>
          </motion.ul>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeading}
          >
            Test Preparation Services
          </motion.h2>
          <motion.ul
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <li>
              Test preparation services for a variety of standardized tests,
              including the SAT, ACT, GRE, GMAT, and more
            </li>
            <li>
              Experienced tutors who will work with you to identify areas of
              weakness and develop a study plan
            </li>
            <li>Targeted instruction to help you improve your scores</li>
            <li>
              Approach your exam with confidence and achieve your best possible
              results
            </li>
          </motion.ul>
        </section>
        <section className={styles.thirdSection}>
          <motion.div
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <img
              src={scheduleMeetingSvgIllus}
              alt="Flexible Shedule illustration"
            />
            <div>
              <h2 className={styles.gradientHeading}>Flexible Scheduling</h2>
              <p>
                We understand that students have busy schedules, which is why we
                offer flexible scheduling options to fit your needs. Our tutors
                are available to meet with you online at a time that works best
                for you. We also offer weekend and evening sessions to
                accommodate students who have other commitments during the day.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <img
              src={affordablePricingSvgIllus}
              alt="Affordable Pricing illustration"
            />
            <div>
              <h2 className={styles.gradientHeading}>Affordable Pricing</h2>
              <p>
                We believe that everyone should have access to high-quality
                tutoring services without breaking the bank. That's why we offer
                affordable pricing options to fit your budget. We also offer
                discounts for bulk purchases of tutoring sessions, so you can
                save even more on your tutoring services.
              </p>
            </div>
          </motion.div>
        </section>
        <section className={styles.listSection}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeading}
          >
            Benefits of One-on-One Tutoring
          </motion.h2>

          <motion.ul
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <li>
              <b>Personalized attention:</b> One-on-one tutoring allows our
              tutors to focus exclusively on your needs, providing personalized
              attention and support.
            </li>
            <li>
              <b>Flexible scheduling:</b> Our tutors work around your schedule,
              making it easy to fit tutoring sessions into your busy life.
            </li>
            <li>
              <b>Improved academic performance:</b> With personalized tutoring
              and support, our students see significant improvements in their
              grades and academic performance.
            </li>
            <li>
              <b>Confidence and motivation:</b> Our tutors not only help
              students improve their academic performance, but also boost their
              confidence and motivation to succeed.
            </li>
          </motion.ul>
        </section>
        <section className={styles.lastSection}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeading}
          >
            Get Started with Our Online Tutoring Services
          </motion.h2>

          <motion.p
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            Ready to boost your academic performance with our expert online
            tutoring services? Getting started is easy!
          </motion.p>

          <motion.ol
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <li>Visit our website and sign up for an account.</li>
            <li>
              Choose the subject you need help with and select a tutor who fits
              your needs.
            </li>
            <li>
              Schedule your tutoring session at a time that works for you.
            </li>
            <li>
              Get personalized one-on-one tutoring and support from an expert
              tutor.
            </li>
          </motion.ol>
          <motion.button
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className="btnPrimary btn--large"
          >
            Get started Now
          </motion.button>
        </section>
      </div>
      <Footer />
    </>
  );
};
