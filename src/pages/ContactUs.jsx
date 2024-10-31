import React, { useState } from "react";
import { motion } from "framer-motion";

import { Header } from "../components/header/Header";
import styles from "../styles/about.module.scss";

import contactStyles from "../styles/contact.module.scss";

import glassStyles from "../styles/glass.module.scss";
import groupChatStyles from "../styles/groupChat.module.scss";
import EducationIllus from "../assets/illus/education_girl_books.svg";
import { Footer } from "../components/footer/Footer";
import { FaQuora } from "react-icons/fa";
import { RiFacebookLine, RiPinterestLine } from "react-icons/ri";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsLinkedin } from "react-icons/bs";
import api, { getAccessToken } from "../services/api";
import { toast } from "react-hot-toast";

export const followUsLinks = [
  {
    id: 1,
    label: "Quora",
    link: "https://www.quora.com/profile/Mymegaminds",
    Icon: () => <FaQuora />,
  },
  {
    id: 2,
    label: "Pinterest",
    link: "https://www.pinterest.com/mymegaminds_/",
    Icon: () => <RiPinterestLine />,
  },
  {
    id: 3,
    label: "Instagram",
    link: "https://www.instagram.com/mymegaminds_/",
    Icon: () => <AiOutlineInstagram />,
  },
  {
    id: 4,
    label: "Facebook",
    link: "https://www.facebook.com/profile.php?id=100091606811083&is_tour_dismissed=true",
    Icon: () => <RiFacebookLine />,
  },
  {
    id: 5,
    label: "Linkedin",
    link: "https://www.linkedin.com/company/mymegaminds",
    Icon: () => <BsLinkedin />,
  },
];

export const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitTime, setSubmitTime] = useState(null);

  const handleSubmit = async () => {
    if (!isSubmitted || (submitTime && Date.now() - submitTime >= 600000)) {
      const res = await api.post(
        "/query/create",
        {
          name,
          email,
          query: message,
        },
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );

      if (res.status === 200) {
        toast.success("Query submitted Successfully");
      }
      setIsSubmitted(true);
      setSubmitTime(Date.now());
    } else {
      toast.error("Please wait for 10 minutes before submitting again.");
    }

    setName("");
    setEmail("");
    setMessage("");
  };

  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(""); // Clear the error message on input change
  };

  let initialAnimation = { y: 80, opacity: 0 };
  let whileInViewAnimation = { y: 0, opacity: 1 };
  let transition = { type: "keyframes", duration: 0.75 };
  return (
    <>
      <Header />
      <div className={styles.aboutPage}>
        <div className={styles.bgCurveGradientWrapper}>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FA4D56" d="M42.8,-75.4C54.2,-67.5,61.3,-53.5,65.5,-39.9C69.6,-26.4,70.7,-13.2,73.4,1.6C76.1,16.3,80.5,32.7,75.7,45C70.9,57.4,56.8,65.7,42.7,68.8C28.5,71.9,14.3,69.6,1.9,66.4C-10.5,63.1,-21,58.9,-32.7,54.4C-44.4,49.9,-57.2,45.2,-67,36.1C-76.8,27,-83.5,13.5,-85.8,-1.4C-88.2,-16.2,-86.3,-32.4,-77.1,-42.6C-67.9,-52.7,-51.5,-56.7,-37.4,-63.1C-23.4,-69.4,-11.7,-78.1,2,-81.5C15.7,-85,31.4,-83.2,42.8,-75.4Z" transform="translate(100 100)" />
          </svg>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FA4D56" d="M42.8,-75.4C54.2,-67.5,61.3,-53.5,65.5,-39.9C69.6,-26.4,70.7,-13.2,73.4,1.6C76.1,16.3,80.5,32.7,75.7,45C70.9,57.4,56.8,65.7,42.7,68.8C28.5,71.9,14.3,69.6,1.9,66.4C-10.5,63.1,-21,58.9,-32.7,54.4C-44.4,49.9,-57.2,45.2,-67,36.1C-76.8,27,-83.5,13.5,-85.8,-1.4C-88.2,-16.2,-86.3,-32.4,-77.1,-42.6C-67.9,-52.7,-51.5,-56.7,-37.4,-63.1C-23.4,-69.4,-11.7,-78.1,2,-81.5C15.7,-85,31.4,-83.2,42.8,-75.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <motion.div initial={initialAnimation} whileInView={whileInViewAnimation} viewport={{ once: true }} transition={transition} className={styles.headingWrapper}>
          <h1>Contact us</h1>
        </motion.div>
        <motion.h3 initial={initialAnimation} whileInView={whileInViewAnimation} viewport={{ once: true }} transition={{ ...transition, delay: 0.3 }} className={styles.h3}>
          <h2>Have any queries?</h2>
          <h4>
            Feel free to reach out to us for any questions or concerns you may have. <br />
            We're here to help!
          </h4>
        </motion.h3>
        <motion.p initial={initialAnimation} whileInView={whileInViewAnimation} viewport={{ once: true }} transition={{ ...transition, delay: 0.3 }} className={styles.para}></motion.p>
        <motion.div initial={initialAnimation} whileInView={whileInViewAnimation} viewport={{ once: true }} transition={{ ...transition, delay: 0.3 }} className={styles.illusWrapper}>
          <div className={contactStyles.contactUsPage}>
            <div className={`${contactStyles.contactForm}`} style={{ background: "linear-gradient(135deg, #ffeeff, #e4f1ff)" }}>
              <div className={groupChatStyles.groupCreateFormContainer}>
                <div className={glassStyles.inputWrapper}>
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter Your Name" />
                </div>
                <div className={glassStyles.inputWrapper}>
                  <label htmlFor="email">Email: </label>
                  {/* <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter Your Email" /> */}
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={validateEmail} // Validate email on blur (when the input loses focus)
                    required
                    placeholder="Enter Your Email"
                  />
                  {emailError && <div className="error">{emailError}</div>}
                </div>
                <div className={glassStyles.inputWrapper}>
                  <label htmlFor="message">Message:</label>
                  <textarea id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Enter Your Message"></textarea>
                </div>
                <button type="submit" className="btnPrimary btn--large" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>

            <div className={contactStyles.contactDetails}>
              <div className={contactStyles.contactInfo}>
                <div className={contactStyles.contactInfoItem}>
                  <motion.p initial={initialAnimation} whileInView={whileInViewAnimation} viewport={{ once: true }} transition={{ ...transition, delay: 0.3 }} className={styles.para}>
                    <span>Phone: </span>
                    <br />
                    <span>
                      <a href="tel:+917481020076">+91 7481020076</a>
                    </span>
                  </motion.p>
                </div>
                <div className={contactStyles.contactInfoItem}>
                  <motion.p initial={initialAnimation} whileInView={whileInViewAnimation} viewport={{ once: true }} transition={{ ...transition, delay: 0.3 }} className={styles.para}>
                    <span>Email: </span>
                    <br />
                    <span>
                      <a href="mailto:tutoring@mymegaminds.com">tutoring@mymegaminds.com</a>
                    </span>
                  </motion.p>
                </div>
                <div className={contactStyles.contactInfoItem}>
                  <motion.p initial={initialAnimation} whileInView={whileInViewAnimation} viewport={{ once: true }} transition={{ ...transition, delay: 0.3 }} className={styles.para}>
                    <span>Office Address: </span>
                    <br />
                    <span style={{ color: "#555" }}> Set No 2 Dawlish Apartment, Dilshant Estate, Kuftadhar, Shimla, Himachal Pradesh 171003</span>
                  </motion.p>
                </div>
                <div className={contactStyles.socialMedia}>
                  <motion.p initial={initialAnimation} whileInView={whileInViewAnimation} viewport={{ once: true }} transition={{ ...transition, delay: 0.3 }} className={styles.para}>
                    <h3>Follow us: </h3>
                  </motion.p>

                  {/* <a href="[Facebook Page URL]">Facebook</a>
              <a href="[Twitter Profile URL]">Twitter</a>
              <a href="[LinkedIn Profile URL]">LinkedIn</a>
              <a href="[Instagram Profile URL]">Instagram</a> */}
                </div>
              </div>

              <div className={contactStyles.companylinks}>
                {followUsLinks.map(({ id, label, link, Icon }) => {
                  return (
                    <a href={link} key={id}>
                      <Icon />
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};
