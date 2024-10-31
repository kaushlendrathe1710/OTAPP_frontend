import React, { useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/hero.module.scss";
import youngStudentImg from "../../assets/img/young-student.png";
import { motion } from "framer-motion";
import chatImg from "../../assets/img/Chat.png";
import whiteboardImg from "../../assets/img/Whiteboard.png";
import videoImg from "../../assets/img/Video.png";
import communityImg from "../../assets/img/3 User.png";

const { log } = console;

export const Hero = () => {
  const [buttonSizeClasses, setButtonSizeClasses] = useState("btn--large");

  useLayoutEffect(() => {
    window.onresize = () => {
      if (window.innerWidth > 920) {
        setButtonSizeClasses("btn--large");
      } else {
        setButtonSizeClasses("btn--medium");
      }
    };
  }, [window.innerWidth]);

  return (
    <>
      <div className={styles.squareTexture}></div>
      <div className={styles.squareTexture2}></div>
      <div className={styles.c1Texture}></div>
      <div className={styles.c2Texture}></div>
      <div className={styles.c3Texture}></div>
      <section className={styles.heroWrapper}>
        <motion.div
          initial={{ y: 100, opacity: 0.5 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 1 }}
          className={styles.left}
        >
          <h1>
            Welcome to <span>Mymegaminds:</span> Your Trusted Online Tutors
          </h1>
          <p>
            For students in the USA, UK, Canada, and UAE, Megaminds offers
            professional <b>online tutoring services</b>. our team of
            knowledgeable <b>online tutors</b> is dedicated to providing you
            with specialized assistance. As a result, you will be able to
            succeed academically.
          </p>
          <div className={styles.buttonsWrapper}>
            {/* <Link to="/login/admin" className="btnText">
              <button className="btnGhost btn--large">Login as admin</button>
            </Link> */}
            <Link to="/register/student" className="btnText">
              <button className={`btnPrimary ${buttonSizeClasses}`}>
                Register as Student
              </button>
            </Link>
            <Link to="/register/tutor" className="btnText">
              <button className={`btnPrimary ${buttonSizeClasses}`}>
                Register as tutor
              </button>
            </Link>
            <Link to="/login/student" className="btnText">
              <button className={`btnSecondary ${buttonSizeClasses}`}>
                Login as student
              </button>
            </Link>
            <Link to="/login/tutor" className="btnText">
              <button className={`btnSecondary ${buttonSizeClasses}`}>
                Login as tutor
              </button>
            </Link>
          </div>
        </motion.div>
        <div className={styles.right}>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1 }}
            className={`${styles.highlight} ${styles.highlight1}`}
          >
            <div className={styles.iconWrapper}>
              <img src={whiteboardImg} alt="highlight service" />
            </div>
            <h5>
              Online <span>Whiteboard</span>
            </h5>
          </motion.div>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1, delay: 0.5 }}
            className={`${styles.highlight} ${styles.highlight2}`}
          >
            <div className={styles.iconWrapper}>
              <img src={chatImg} alt="highlight service" />
            </div>
            <h5>
              Chat <span>with experts</span>
            </h5>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1 }}
            className={`${styles.highlight} ${styles.highlight3}`}
          >
            <div className={styles.iconWrapper}>
              <img src={videoImg} alt="highlight service" />
            </div>
            <h5>
              Live <span>Video classes</span>
            </h5>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1, delay: 0.25 }}
            className={`${styles.highlight} ${styles.highlight4}`}
          >
            <div className={styles.iconWrapper}>
              <img src={communityImg} alt="highlight service" />
            </div>
            <h5>
              Best <span>community</span>
            </h5>
          </motion.div>
          <motion.div
            className={styles.imgWrapper}
            initial={{ y: 100, opacity: 0.5 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1 }}
          >
            <img
              src={youngStudentImg}
              width={580}
              height="auto"
              alt="Online learning image"
            />
            <motion.div
              initial={{ x: -100, opacity: 0.5 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1 }}
              className={styles.bgCircle1}
            ></motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0.5 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1 }}
              className={styles.bgCircle2}
            ></motion.div>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0.5 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1, delay: 0.25 }}
            className={styles.pattren}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </motion.div>
        </div>
      </section>
    </>
  );
};
