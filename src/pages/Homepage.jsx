import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Header } from "../components/header/Header";
import { Hero } from "../components/hero/Hero";
import styles from "../styles/homepage.module.scss";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import communityImg from "../assets/img/3 User.png";
import chatImg from "../assets/img/Chat.png";
import documentImg from "../assets/img/Document.png";
import paperImg from "../assets/img/Paper.png";
import profileImg from "../assets/img/Profile.png";
import timeCircleImg from "../assets/img/Time Circle.png";
import videoImg from "../assets/img/Video.png";
import whiteboardImg from "../assets/img/Whiteboard.png";
import projectIllus from "../assets/illus/Project-review.png";
import personalizedTutoringImg from "../assets/illus/personalized-tutoring.png";
import onlineTutorsImg from "../assets/illus/online-tutors.png";
import teamCollabImg from "../assets/illus/team-collab.png";
import authStyles from "../styles/auth.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  contactUsLinks,
  followUsLinks,
  Footer,
} from "../components/footer/Footer";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const serviceCards = [
  {
    heading: "Online Whiteboard",
    desc: "Make idea explanation simple in the classroom by using a free interactive whiteboard.",
    img: whiteboardImg,
    bg: "linear-gradient(135deg, #AA14F0 0%, #FF9529 100%)",
  },
  {
    heading: "Video/Audio meetings",
    desc: "Audio-video meetings can help you forge wonderful connections.",
    img: videoImg,
    bg: "linear-gradient(135deg, #6B6BF8 0%, #F86BDF 100%)",
  },
  {
    heading: "Chat with experts",
    desc: "Instantly resolve your doubt by chatting with professionals.",
    img: chatImg,
    bg: "linear-gradient(135deg, #3D10BD 0%, #62BDFF 100%)",
  },
  {
    heading: "Project review",
    desc: `Review your project with industry experts.Use industry experts as
    a resource to help you review your project.`,
    img: paperImg,
    bg: "linear-gradient(135deg, #93F9B9 0%, #1D976C 100%)",
  },
  {
    heading: "Online courses",
    desc: `Online courses which will provide an better way of learning anything and from anywhere.`,
    img: documentImg,
    bg: "#4791FF",
  },
  {
    heading: "Expert teachers",
    desc: `Get 24*7 online help from the respective teachers on your doubt.`,
    img: profileImg,
    bg: "#9747FF",
  },
  {
    heading: "Community",
    desc: `Get the opportunity to enroll into the India's best education community and get all your doubts and queries cleared.`,
    img: communityImg,
    bg: "#FFAA47",
  },
  {
    heading: "24/7 Support",
    desc: `Get 24*7 online help from the respective teachers on your doubt.`,
    img: timeCircleImg,
    bg: "#3BE041",
  },
];

export const Homepage = () => {
  const navigate = useNavigate();
  const contactSectionRef = useRef();
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

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(4, "Your name must include 4 letters or more")
        .required("Please enter your name"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email"),
      message: Yup.string().required("Please enter your message"),
    }),
    onSubmit: (values) => {
      let mailData = {
        to: "kaushakhilish@gmail.com",
        subject: "QUERY RAISED",
        discdescription: "Query Raised by ",
        description: values.message,
        titlemail: "Query Raised",
        maillink: values.name,
        hrefmail: "https://www.mymegaminds.com/",
        emaillinkmsg: values.message,
        descriptiontitlemail: values.email,
      };
      axios
        .post(`https://mail-server-fh46.onrender.com/users`, mailData)
        .then(() => {
          toast.success("Email submitted successfully", { duration: 3000 });
          handleReset();
        })
        .catch((e) => toast.error("Something went wrong\nPleas try again"));
    },
  });
  function handleReset() {
    formik.handleReset();
  }

  return (
    <div>
      <Header />
      <Hero />
      {/* Services section  */}
      <section className={styles.servicesSection}>
        <div className={styles.heading}>
          <h1>
            Why <span>Megamind</span> education?
          </h1>
          <p>
            If You are planning for a year, sow rice. If you are planning for a
            decade, plant trees. If you are planning for a lifetime, educate
            people.
          </p>
        </div>
        <div className={styles.servicesWrapper}>
          {serviceCards.map(({ heading, desc, img, bg }, i) => {
            return (
              <ServiceCard
                key={i}
                heading={heading}
                desc={desc}
                img={img}
                bg={bg}
                i={i}
              />
            );
          })}
        </div>
      </section>
      {/* Project review section  */}
      <div className={styles.projectSectionWrapper}>
        <section className={styles.projectReviewSection}>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
            className={styles.left}
          >
            <img
              src={projectIllus}
              width={600}
              height="auto"
              alt="project review illus"
            />
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
            className={styles.right}
          >
            <h2>Project Review</h2>
            <p>
              Get started for all the information you need as we provide you
              with tutorials for almost all the topics and subjects 24X7
              anywhere and anytime.
            </p>
            <p>
              We cover a wide variety of essays, artiles and reports on simple
              subjects to Accounts, finance, Marketing B-plans, Case Studies and
              technical expertise like autoCAD, Matlab etc.
            </p>
            <div className={styles.buttonsWrapper}>
              <button className="btnPrimary btn--medium">Get quote</button>
              <button className="btnNeutral btn--medium">Signup now</button>
            </div>
          </motion.div>
        </section>
      </div>
      {/* Personalized services section  */}
      <div className={styles.personalizedServicesSectionWrapper}>
        <section className={styles.projectReviewSection}>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
            className={styles.left}
          >
            <img
              src={personalizedTutoringImg}
              width={700}
              height="auto"
              alt="personalized service illus"
              style={{ borderRadius: "1rem" }}
            />
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
            className={styles.right}
          >
            <h2>Personalized Online Tutoring Services</h2>
            <p>
              Our <b>online tutoring services</b> are customized to meet your
              specific requirements. In a variety of topics, including math,
              science, English, social studies, and more, we provide
              individualized lesson plans. Our <b>online tutors</b> are here to
              assist you whether you require <b>homework help</b>,{" "}
              <b>assignment help</b>, or simply further instruction in a
              particular subject. You will receive the assistance you require
              when you require it thanks to our{" "}
              <b>one-on-one tutoring sessions</b>.
            </p>
            <p>
              Our <b>online tutors</b> have years of expertise in their
              disciplines and are well-versed in the requirements and curricula
              of academic institutions. They will clear up any questions you
              have, aid in your knowledge, and provide you the direction you
              need to succeed in your studies.
            </p>
            <p>
              We are aware that every student is different, with distinct
              learning preferences, objectives, and difficulties. We tailor our{" "}
              <b>tutoring services</b> to your unique needs because of this.
              Together, you and one of our instructors will determine your
              strengths and weaknesses and create a plan that fits your learning
              style and speed. Sessions can be scheduled at your convenience,
              and you can continue working with the same <b>tutor</b> throughout
              your academic career.
            </p>
          </motion.div>
        </section>
      </div>
      {/* Expert tutors section  */}
      <div
        className={styles.personalizedServicesSectionWrapper}
        style={{ marginTop: "1rem !important" }}
      >
        <section
          className={`${styles.projectReviewSection} ${styles.expertTutorSection}`}
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
            className={styles.left}
          >
            <img
              src={onlineTutorsImg}
              width={700}
              height="auto"
              alt="personalized service illus"
              style={{ borderRadius: "1rem" }}
            />
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
            className={styles.right}
          >
            <h2>Expert Online Tutors at Affordable Prices</h2>

            <p>
              We at mymegaminds think that all students should have access to
              high-quality education. We charge reasonable fees for our{" "}
              <b>online tutoring services</b> because of this, we have
              affordable prices and flexible payment plans to meet any budget.
              For added savings, we occasionally offer discounts and other
              special deals.
            </p>

            <p>
              We are proud of our team of knowledgeable <b>online tutors</b>{" "}
              that are enthusiastic about instructing and guiding students to
              success. They are chosen via a thorough screening process, and
              they have teaching experience as well as subject-specific
              knowledge. Using the most recent techniques and technology, our
              instructors are qualified and trained to conduct successful online
              tutoring sessions. They will give you honest feedback and
              dependable information as well as help.
            </p>
          </motion.div>
        </section>
      </div>
      {/* Why choose mymegamind education */}
      <div className={styles.whyChooseUsSectionWrapper}>
        <h2>Why Choose Mymegaminds?</h2>

        <ul>
          <li>Experienced tutors with subject-specific expertise</li>
          <li>Flexible scheduling to fit your busy lifestyle</li>
          <li>Customized lesson plans tailored to your individual needs</li>
          <li>Competitive pricing and flexible payment options</li>
          <li>24/7 support for all your academic needs</li>
          <li>Secure and user-friendly online tutoring platform</li>
          <li>Satisfaction guarantee</li>
        </ul>
      </div>

      {/* Our mission and values */}
      <div className={styles.ourValuesSectionWrapper}>
        <h2>Our Mission and Values</h2>
        <div>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
          >
            We recognize that you have a wide range of choices for{" "}
            <b>online tutoring services</b>. We work hard to provide a quality
            teaching experience that goes above and beyond what you anticipate
            because of this. You can effortlessly connect with your{" "}
            <b>online tutor</b> using our user-friendly{" "}
            <b>online tutoring platform</b> and access course materials at any
            time, anywhere. To answer any technological issues or worries you
            might have, we provide support around-the-clock.
          </motion.p>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
          >
            <img src={teamCollabImg} width={400} alt="Team collaboration" />
            <p>
              We are certain that our tutoring services will assist you in
              achieving your academic objectives and raising your grade point
              average. We provide a satisfaction guarantee as a result.we'll
              work with you to make things right if you're not satisfied with
              your tutoring experience. we value your opinions and are dedicated
              to enhancing our offerings constantly.
            </p>
          </motion.div>

          <motion.p
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
          >
            So, mymegaminds is the only place to turn if you're looking for
            trustworthy online tutoring services. Our knowledgeable tutors are
            available to support your academic success and help you meet your
            academic objectives. Contact us!
          </motion.p>
        </div>
      </div>

      {/* Join us section  */}
      <div className={styles.sectionWrapper}>
        <section className={styles.joinSection}>
          <div className={styles.left}>
            <h2>Join us now</h2>
            <p>
              Be a learner ,Be a reader; be a writer, Be an exceptional . Join
              our family, through mock quiz, tutorials and professional chat get
              educated anytime, anywhere and save those little bucks in your
              pockets.
            </p>
          </div>
          <div className={styles.right}>
            <button className="btnPrimary btn--large" onClick={()=>navigate("/homework-assignment-project")}>Join us</button>
          </div>
        </section>
      </div>
      {/* Contact form section  */}
      <div ref={contactSectionRef} className={styles.contactSectionWrapper}>
        <div className={styles.contactHeading}>
          <h1>Contact Us</h1>
          <p>Any question or remarks? Just write us a message!</p>
        </div>
        <section className={styles.contactSection}>
          <div className={styles.left}>
            <div>
              {/* <h3>Get in touch</h3> */}
              <p>Get in contact. We would be delighted to assist you.</p>
            </div>
            <div className={styles.formWrapper}>
              <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <div className={authStyles.inputCon}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="name"
                    name="name"
                    id="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Name"
                    className={
                      formik.errors.name &&
                      formik.touched.name &&
                      authStyles.errorBorder
                    }
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <div className={authStyles.inputError}>
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
                <div className={authStyles.inputCon}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Email"
                    className={
                      formik.errors.email &&
                      formik.touched.email &&
                      authStyles.errorBorder
                    }
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <div className={authStyles.inputError}>
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
                <div className={authStyles.inputCon}>
                  <label htmlFor="message">Meassage</label>
                  <textarea
                    name="message"
                    id="message"
                    cols="30"
                    rows="10"
                    placeholder="Write your message here"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.errors.message &&
                      formik.touched.message &&
                      authStyles.errorBorder
                    }
                  ></textarea>
                  {formik.errors.message && formik.touched.message ? (
                    <div className={authStyles.inputError}>
                      {formik.errors.message}
                    </div>
                  ) : null}
                </div>
                <div className={styles.authButtonsWrapper}>
                  <button
                    type="submit"
                    className={`btnPrimary ${buttonSizeClasses}`}
                  >
                    Submit
                  </button>
                  <button
                    type="reset"
                    className={`btnNeutral ${buttonSizeClasses}`}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className={styles.right}>
            <motion.div
              initial={{ y: -400, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                duration: 2.5,
                bounce: 0.5,
                delay: 0.2,
              }}
              viewport={{ once: true }}
              className={styles.circle1}
            ></motion.div>
            <motion.div
              initial={{ y: -400, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                duration: 2.5,
                bounce: 0.5,
                delay: 0.4,
              }}
              viewport={{ once: true }}
              className={styles.circle2}
            ></motion.div>
            <div className={styles.rightHead}>
              <h3>Contact Information</h3>
              <p>
                Fill up the form and our Team will get back to you within 24
                hours.
              </p>
            </div>
            <div className={styles.contactsWrapper}>
              {contactUsLinks.map(({ id, label, link, FilledIcon, type }) => {
                return type !== "free" ? (
                  <a
                    href={`${
                      type === "email"
                        ? `mailto:${link}`
                        : type === "tel" && `tel:${link}`
                    }`}
                    key={id}
                    className={styles.contactLink}
                  >
                    <FilledIcon />
                    {label}
                  </a>
                ) : (
                  <p key={id} className={styles.contactLink}>
                    <FilledIcon /> {label}
                  </p>
                );
              })}
            </div>
            <div className={styles.socialsWrapper}>
              {followUsLinks.map(({ id, label, link, Icon }) => {
                return (
                  <a href={link} title={label} key={id}>
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

function ServiceCard({ heading, desc, img, bg, i }) {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  const cardVariants = {
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
      },
    }),
    hidden: { opacity: 0, y: 100 },
  };
  return (
    <motion.div
      ref={ref}
      custom={i}
      animate={controls}
      initial="hidden"
      variants={cardVariants}
      className={styles.serviceCard}
    >
      <div
        className={styles.icon}
        style={{
          background: bg,
        }}
      >
        <img src={img} width={42} height={42} alt="service img" />
      </div>
      <h4>{heading}</h4>
      <p>{desc}</p>
    </motion.div>
  );
}
