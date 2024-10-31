import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import mathematicsIllus from "../../assets/illus/undraw_mathematics.svg";
import scienceIllus from "../../assets/illus/undraw_science.svg";
import styles from "../../styles/services.module.scss";

export const OnlineHomeworkHelp = () => {
  let initialAnimation = { y: 80, opacity: 0 };
  let whileInViewAnimation = { y: 0, opacity: 1 };
  let transition = { type: "keyframes", duration: 0.75 };
  return (
    <>
      <Helmet>
        <title>
          Online Homework Help - Get Math, Economics, and More Homework Help
          Online
        </title>
        <meta
          title="desc"
          content="Looking for online homework help? Our website provides reliable and affordable services for all your homework needs. Get math homework help, economics homework help, and more from our expert online homework helpers. Improve your grades and get the assistance you need with our dedicated online homework help website."
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
          Online Homework Help Services
        </motion.h1>
        <motion.p
          initial={initialAnimation}
          whileInView={whileInViewAnimation}
          viewport={{ once: true }}
          transition={transition}
        >
          Are you struggling with your homework and looking for online homework
          help? You've come to the right place! Our team of expert online
          homework helpers is here to assist you with your math homework,
          economics homework, and more. We offer 24/7 online homework help
          services to ensure you get the help you need when you need it.
        </motion.p>
        <div className={styles.helpSection}>
          <motion.div
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <img src={mathematicsIllus} alt="Mathematics illustration" />
            <div>
              <h2 className={styles.gradientHeadingSm}>
                Math Homework Help Online
              </h2>
              <p>
                If you're struggling with math homework, don't worry - our
                online math homework helpers are here to help you. Our team of
                expert math tutors can assist you with any math problem, from
                basic arithmetic to calculus and beyond. We can help you
                understand the concepts behind the problems, walk you through
                solutions step-by-step, and provide you with additional practice
                problems to help you master the material.
              </p>
            </div>
          </motion.div>
          <div>
            <motion.h2
              initial={initialAnimation}
              whileInView={whileInViewAnimation}
              viewport={{ once: true }}
              transition={transition}
              className={styles.gradientHeadingSm}
            >
              Economics Homework Help Online
            </motion.h2>
            <p>
              Our online homework helpers also offer expert economics homework
              help. Whether you're struggling with microeconomics,
              macroeconomics, or econometrics, our team of expert economics
              tutors can help you. We can assist you with problem sets, case
              studies, essays, and more. We can also help you understand the key
              economic concepts and theories behind your homework problems.
            </p>
          </div>
          <motion.div
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <img src={scienceIllus} alt="Science illustration" />
            <div>
              <h2 className={styles.gradientHeadingSm}>
                Science Homework Help
              </h2>
              <p>
                Our online science tutors offer science homework help in various
                subjects, including chemistry, physics, and biology. We provide
                assistance with homework, projects, and research papers. Our
                science homework helpers are experienced professionals who can
                provide quality solutions to complex problems.
              </p>
            </div>
          </motion.div>
          <div>
            <motion.h2
              initial={initialAnimation}
              whileInView={whileInViewAnimation}
              viewport={{ once: true }}
              transition={transition}
              className={styles.gradientHeadingSm}
            >
              Other Homework Help Services
            </motion.h2>
            <motion.ol
              initial={initialAnimation}
              whileInView={whileInViewAnimation}
              viewport={{ once: true }}
              transition={transition}
            >
              <li>
                <b>English homework:</b> Need help understanding Shakespeare or
                analyzing a novel? Our online English tutors can provide you
                with insights and guidance on literature analysis, writing
                techniques, and more.
              </li>
              <li>
                <b>Science homework:</b> Whether it's biology, chemistry, or
                physics, our online science tutors can help you understand
                complex scientific concepts and guide you through experiments
                and homework assignments.
              </li>
              <li>
                <b>History homework:</b> Our online history tutors can help you
                understand the events and trends that shaped the world we live
                in today, and assist you with essays and research papers.
              </li>
              <li>
                <b>Computer science homework:</b> If you're struggling with
                coding or programming, our online computer science tutors can
                help you understand programming languages, algorithms, data
                structures, and more.
              </li>
              <li>
                <b>Accounting homework:</b> Whether it's basic accounting
                principles or advanced financial analysis, our online accounting
                tutors can help you understand the intricacies of the subject
                and guide you through homework assignments and exams.
              </li>
            </motion.ol>
          </div>
        </div>

        <div className={styles.lastSection}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeadingSm}
          >
            Languages: 
          </motion.h2>
          <motion.ol
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <li>
              <b>Spanish homework:</b> Need help mastering the Spanish language?
              Our online Spanish tutors can help you improve your speaking,
              reading, writing, and comprehension skills.
            </li>
            <li>
              <b>French homework:</b> From grammar to pronunciation, our online
              French tutors can help you with all aspects of the French language
              and culture.
            </li>
            <li>
              <b>German homework:</b> If you need help with German grammar or
              vocabulary, our online German tutors can provide you with
              personalized assistance and guidance.
            </li>
            <li>
              <b>Chinese homework:</b> Our online Chinese tutors can help you
              master the Chinese language, including pronunciation, grammar, and
              character recognition.
            </li>
            <li>
              <b>Test preparation:</b> In addition to homework help, we offer
              online test preparation services to help you ace your exams. From
              SATs to GREs, our online tutors can provide you with tips,
              practice tests, and personalized feedback to help you achieve your
              best score.
            </li>
          </motion.ol>
        </div>

        <div className={styles.lastSection}>
          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeadingSm}
          >
            Homework Help for All Academic Levels
          </motion.h2>
          <motion.p
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            At Megaminds, we provide homework help for all academic levels,
            including high school, college, and university. Our online homework
            helpers are experienced professionals who can provide personalized
            assistance to students of all academic levels. We ensure that
            students receive high-quality solutions that guarantee high grades
          </motion.p>

          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeadingSm}
          >
            Why Choose Our Online Homework Help Services?
          </motion.h2>
          <motion.ul
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            <li>
              24/7 availability: Our online homework helpers are available 24/7
              to assist you, no matter when you need help.
            </li>
            <li>
              Expert help: Our team of online homework helpers consists of
              experts in their respective fields who are dedicated to helping
              you succeed.
            </li>
            <li>
              Customized solutions: We tailor our online homework help services
              to your individual needs and learning style, ensuring that you get
              the most out of our services.
            </li>
            <li>
              Affordable prices: We offer competitive pricing for our online
              homework help services, ensuring that you get expert help at an
              affordable price.
            </li>
          </motion.ul>

          <motion.h2
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
            className={styles.gradientHeadingSm}
            style={{ marginBottom: "1rem" }}
          >
            {" "}
            Get Help Today{" "}
          </motion.h2>
          <motion.p
            initial={initialAnimation}
            whileInView={whileInViewAnimation}
            viewport={{ once: true }}
            transition={transition}
          >
            Don't struggle with your homework alone - get expert online homework
            help today! Our team of expert online homework helpers is here to
            assist you with your math homework, economics homework, and more.
            Contact us today to get started!
          </motion.p>
        </div>
      </div>
      <Footer />
    </>
  );
};
