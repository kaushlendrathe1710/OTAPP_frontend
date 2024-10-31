import React from "react";
import { motion } from "framer-motion";

import { Header } from "../components/header/Header";
import styles from "../styles/about.module.scss";
import EducationIllus from "../assets/illus/education_girl_books.svg";
import { Footer } from "../components/footer/Footer";

export const About = () => {
  let initialAnimation = { y: 80, opacity: 0 };
  let whileInViewAnimation = { y: 0, opacity: 1 };
  let transition = { type: "keyframes", duration: 0.75 };
  return (
    <>
      <Header />
      <div className={styles.aboutPage}>
        <div className={styles.bgCurveGradientWrapper}>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#FA4D56"
              d="M42.8,-75.4C54.2,-67.5,61.3,-53.5,65.5,-39.9C69.6,-26.4,70.7,-13.2,73.4,1.6C76.1,16.3,80.5,32.7,75.7,45C70.9,57.4,56.8,65.7,42.7,68.8C28.5,71.9,14.3,69.6,1.9,66.4C-10.5,63.1,-21,58.9,-32.7,54.4C-44.4,49.9,-57.2,45.2,-67,36.1C-76.8,27,-83.5,13.5,-85.8,-1.4C-88.2,-16.2,-86.3,-32.4,-77.1,-42.6C-67.9,-52.7,-51.5,-56.7,-37.4,-63.1C-23.4,-69.4,-11.7,-78.1,2,-81.5C15.7,-85,31.4,-83.2,42.8,-75.4Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#FA4D56"
              d="M42.8,-75.4C54.2,-67.5,61.3,-53.5,65.5,-39.9C69.6,-26.4,70.7,-13.2,73.4,1.6C76.1,16.3,80.5,32.7,75.7,45C70.9,57.4,56.8,65.7,42.7,68.8C28.5,71.9,14.3,69.6,1.9,66.4C-10.5,63.1,-21,58.9,-32.7,54.4C-44.4,49.9,-57.2,45.2,-67,36.1C-76.8,27,-83.5,13.5,-85.8,-1.4C-88.2,-16.2,-86.3,-32.4,-77.1,-42.6C-67.9,-52.7,-51.5,-56.7,-37.4,-63.1C-23.4,-69.4,-11.7,-78.1,2,-81.5C15.7,-85,31.4,-83.2,42.8,-75.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <motion.div
          initial={initialAnimation}
          whileInView={whileInViewAnimation}
          viewport={{ once: true }}
          transition={transition}
          className={styles.headingWrapper}
        >
          <h1>About us</h1>
        </motion.div>
        <motion.h3
          initial={initialAnimation}
          whileInView={whileInViewAnimation}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.3 }}
          className={styles.h3}
        >
          Welcome to Mymegaminds, an online tutoring company dedicated to
          helping students achieve academic success.
        </motion.h3>
        <motion.p
          initial={initialAnimation}
          whileInView={whileInViewAnimation}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.5 }}
          className={styles.para}
        >
          We offer a platform where students can upload their assignments and
          our highly qualified tutors will complete the assignments on their
          behalf. Our tutors are experts in their respective fields and are
          committed to delivering high-quality work within the given timeframe.
        </motion.p>
        <motion.p
          initial={initialAnimation}
          whileInView={whileInViewAnimation}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.75 }}
          className={styles.para}
        >
          At Mymegaminds, we understand the challenges that students face when
          it comes to completing assignments and achieving academic success. We
          aim to provide a solution that not only helps students complete their
          assignments but also helps them understand the subject matter. Our
          tutors take the time to explain concepts and provide guidance to
          ensure that students have a clear understanding of the work completed.
        </motion.p>

        <div className={styles.lastAboutWrapper}>
          <img src={EducationIllus} alt="Education illustration" />
          <div>
            <motion.p
              initial={initialAnimation}
              whileInView={whileInViewAnimation}
              viewport={{ once: true }}
              transition={transition}
              className={styles.para}
            >
              We strive to provide our students with an exceptional experience,
              and we continuously work to improve our services. Our team is
              dedicated to ensuring that our students receive the highest level
              of support and assistance.
            </motion.p>
            <motion.p
              initial={initialAnimation}
              whileInView={whileInViewAnimation}
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.35 }}
              className={styles.para}
            >
              Thank you for considering Mymegaminds as your online tutoring
              partner. We look forward to helping you achieve academic success.
            </motion.p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
