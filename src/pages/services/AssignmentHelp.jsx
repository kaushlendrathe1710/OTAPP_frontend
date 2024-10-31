import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import educationIllus from "../../assets/illus/education_girl_books.svg";
import styles from "../../styles/services.module.scss";
import { Link } from "react-router-dom";

const GETTING_STARTED_WITH_MEGAMINDS_ASSIGNMENT_HELP_STEPS = [
  {
    step: "Place Your Order",
    description: `Visit our website and fill out the order form. Provide us with all the necessary details about your assignment, including the topic, academic level, deadline, and any other specific instructions. Our writers will use this information to craft a top-quality and custom assignment that meets all your requirements.`,
  },
  {
    step: "Make Payment",
    description: `Once you have placed your order, you will receive a price quote for the assignment. Make payment using any of our secure payment methods, and we will assign the task to one of our expert writers immediately.`,
  },
  {
    step: "Wait for Delivery",
    description: `After making payment, sit back and relax as our writers work on your assignment. We guarantee to deliver your assignment before the deadline to give you enough time to review it and request any revisions if necessary.`,
  },
];
const BETTER_ASSIGNMENTS = [
  {
    title: "Originality",
    description: `We write all assignments from scratch and ensure that they are unique and plagiarism-free. We also use advanced plagiarism detection software to guarantee the originality of our work.`,
  },
  {
    title: "Quality",
    description: `We have a team of experienced and qualified writers who are dedicated to ensuring that you get top-quality assignments. We conduct thorough research and follow all your instructions to ensure that we deliver assignments that meet your expectations.`,
  },
  {
    title: "Timeliness",
    description: `We understand the importance of meeting deadlines, and we guarantee to deliver your assignment before the deadline. This gives you enough time to review the assignment and request any revisions if necessary.`,
  },
  {
    title: "Affordability",
    description: `We offer competitive prices for all our assignment help services without compromising on quality. We understand that most students operate on a tight budget, and we don't want to strain your finances.`,
  },
];

export const AssignmentHelp = () => {
  let initialAnimation = { y: 80, opacity: 0 };
  let whileInViewAnimation = { y: 0, opacity: 1 };
  let transition = { type: "keyframes", duration: 0.75 };
  return (
    <>
      <Helmet>
        <title>
          Top-Quality and Affordable Assignment Help Services | Megaminds
        </title>
        <meta
          title="desc"
          content="Struggling with academic assignments? Get expert help from Megaminds. Our experienced writers provide top-quality and affordable assignment help services, including essay writing, research paper writing, and more. Place your order today and get the best grades in your assignments."
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
          Get Top-Quality Assignment Help from Megaminds
        </motion.h1>
        <motion.p
          initial={initialAnimation}
          whileInView={whileInViewAnimation}
          viewport={{ once: true }}
          transition={transition}
        >
          As a student, it can be overwhelming to manage all your academic
          assignments while trying to balance your personal life, work, and
          other activities. At Megaminds, we understand how challenging this can
          be, which is why we offer top-quality assignment help services to
          students worldwide.
        </motion.p>

        <div className={styles.helpSection} style={{ marginTop: "5rem" }}>
          <motion.div
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <img src={educationIllus} alt="Education illustration" />
            <div>
              <h2 className={styles.gradientHeadingSm}>
                Why Choose Megaminds for Your Assignment Help?
              </h2>
              <p>
                There are several reasons why you should choose Megaminds for
                your assignment help needs. First, we have a team of experienced
                and qualified writers who are dedicated to ensuring you get the
                best grades in your assignments. Our writers hold advanced
                degrees in various fields, and they have years of experience
                helping students with their assignments.
              </p>
            </div>
          </motion.div>
          <motion.div className={styles.paragraphsContainer}>
            <p>
              Second, we offer a wide range of assignment help services,
              including essay writing, research paper writing, term paper
              writing, dissertation writing, case study analysis, and more.
              Whatever your assignment needs are, we have got you covered.
            </p>
            <p>
              Third, we guarantee top-quality and original work. Our writers
              write all assignments from scratch and ensure that they are unique
              and plagiarism-free. We also use advanced plagiarism detection
              software to ensure that all our assignments are 100% original.
            </p>
            <p>
              Fourth, we offer affordable prices for all our assignment help
              services. We understand that most students operate on a tight
              budget, and we don't want to strain your finances. That's why we
              offer competitive prices for all our services without compromising
              on quality.
            </p>
          </motion.div>
        </div>
        <div className={styles.helpSection} style={{ marginTop: "8rem" }}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeading}
          >
            How to Get Started with Megaminds Assignment Help?
          </motion.h2>
          <p style={{ marginTop: "1rem" }}>
            Getting started with Megaminds assignment help is easy and
            straightforward. Here are the simple steps you need to follow:
          </p>
          <motion.div className={styles.stepsContainer}>
            {GETTING_STARTED_WITH_MEGAMINDS_ASSIGNMENT_HELP_STEPS.map(
              ({ step, description }, index) => (
                <div key={index} className={styles.step}>
                  <h3>{`${index + 1}` + step}</h3>
                  <p>{description}</p>
                </div>
              )
            )}
          </motion.div>
        </div>

        <div className={styles.helpSection} style={{ marginTop: "6rem" }}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeading}
          >
            How Our Assignments Are Better?
          </motion.h2>
          <p style={{ marginTop: "1rem" }}>
            At Megaminds, we pride ourselves on offering top-quality assignments
            that are better than those of our competitors. Here's how our
            assignments are better:
          </p>
          <motion.div className={styles.betterAssignmentsContainer}>
            {BETTER_ASSIGNMENTS.map(({ title, description }, index) => (
              <div key={index} className={styles.betterAssignment}>
                <b>{title}:</b>
                <p>{description}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className={styles.helpSection} style={{ marginTop: "6rem" }}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeading}
          >
            Conclusion
          </motion.h2>
          <p style={{ marginTop: "1rem" }}>
            If you're struggling with your assignments, don't stress. Megaminds
            are here to help you. We offer top-quality and affordable assignment
            help services to students worldwide. Our team of experienced and
            qualified writers is dedicated to ensuring that you get the best
            grades in your assignments. Place your order today and experience
            the difference.
          </p>
          <p style={{ marginTop: "1rem" }}>
            Follow us on{" "}
            <a
              href="https://www.instagram.com/mymegaminds_/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#f50057", fontWeight: 500 }}
            >
              Instagram
            </a>
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <b>Also see:</b>
          <div
            style={{ display: "flex", gap: "0.5rem 2rem", flexWrap: "wrap" }}
          >
            <Link
              to={"/services/online-tutoring-services"}
              style={{ color: "var(--info-500)" }}
            >
              Online Tutoring Services
            </Link>
            <Link
              to={"/services/online-homework-help"}
              style={{ color: "var(--info-500)" }}
            >
              Online Homework Help
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
