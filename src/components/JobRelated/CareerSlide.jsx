import React from 'react';
import { motion } from "framer-motion";
import styles from "../../styles/careers.module.scss";

export const CareerSlide = ({ heading, desc, redirectLink, bgImg}) => {
  return (
    <div className={styles.slideWrapper}>
            <div className={styles.sliderContent}>
              <motion.h1
                initial={{ y: -100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.35 }}
                // viewport={{once: true}}
              >
                {heading}
              </motion.h1>
              <motion.p
                initial={{ y: -100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.35,
                  delay: 0.2,
                }}
                // viewport={{once: true}}
              >
                {desc}
              </motion.p>
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.35,
                  delay: 0.4,
                }}
                // viewport={{once: true}}
              >
                <button className="btnPrimary btn--large">Apply now</button>
              </motion.div>
            </div>
            <div className={styles.bgImg}>
              <img src={bgImg} alt="apply for react job" />
            </div>
          </div>
  )
}
