import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/footer.module.scss";
import { Logo, navLinks } from "../header/Header";
import { AiOutlineMail, AiOutlineInstagram } from "react-icons/ai";
import { BsTelephone, BsFillTelephoneFill, BsLinkedin } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { FaQuora } from "react-icons/fa";
import {
  RiFacebookLine,
  RiArrowRightLine,
  RiPinterestLine,
} from "react-icons/ri";
import { MdMail, MdLocationOn } from "react-icons/md";

export const contactUsLinks = [
  {
    id: 1,
    label: "Tutoring@mymegaminds.com",
    link: "tutoring@mymegaminds.com",
    Icon: () => <AiOutlineMail />,
    FilledIcon: () => <MdMail />,
    type: "email",
  },
  {
    id: 2,
    label: "+91 7481020076",
    link: "+917481020076",
    Icon: () => <BsTelephone />,
    FilledIcon: () => <BsFillTelephoneFill />,
    type: "tel",
  },
  {
    id: 3,
    label: "India",
    link: undefined,
    Icon: () => <SlLocationPin />,
    FilledIcon: () => <MdLocationOn />,
    type: "free",
  },
];
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

export const legalLinks = [
  {
    id: 1,
    label: "Privacy Policy",
    link: "/privacy-policy",
    Icon: () => <RiArrowRightLine />,
  },
  {
    id: 2,
    label: "Terms & Conditions",
    link: "/terms-conditions",
    Icon: () => <RiArrowRightLine />,
  },
  {
    id: 3,
    label: "Refund/Cancellation policy",
    link: "/refund-policy",
    Icon: () => <RiArrowRightLine />,
  },
];

export const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <footer className={styles.footerWrapper}>
        <div className={styles.footerUpperWrapper}>
          <div className={styles.companyAbout}>
            <Logo />
            <p>
              Education is smart enough to change the human mind positively. It
              is all about academic excellence and cultural diversity.
            </p>
          </div>
          <div className={styles.companyLinks}>
            <h3>Company</h3>
            {navLinks.map(
              ({ id, path, label, Icon, hasChild, nestedRoutes = [] }) => {
                return !hasChild ? (
                  <Link to={path} key={id}>
                    {/* <Icon /> */}
                    {label}
                  </Link>
                ) : (
                  nestedRoutes.map(({ path, label, Icon }) => {
                    return (
                      <Link to={path} key={path}>
                        {/* <Icon /> */}
                        {label}
                      </Link>
                    );
                  })
                );
              }
            )}
          </div>
          <div className={styles.companyLinks}>
            <h3>Follow us</h3>
            {followUsLinks.map(({ id, label, link, Icon }) => {
              return (
                <a href={link} key={id}>
                  <Icon />
                  {label}
                </a>
              );
            })}
          </div>
          <div className={styles.companyLinks}>
            <h3>Contact us</h3>
            {contactUsLinks.map(({ id, link, label, Icon, type }) => {
              return type !== "free" ? (
                <a
                  href={`${
                    type === "email"
                      ? `mailto:${link}`
                      : type === "tel" && `tel:${link}`
                  }`}
                  key={id}
                >
                  <Icon />
                  {label}
                </a>
              ) : (
                <p key={id}>
                  <Icon /> {label}
                </p>
              );
            })}
          </div>
          <div className={styles.companyLinks}>
            <h3>Legal</h3>
            {legalLinks.map(({ id, link, label, Icon }) => {
              return (
                <Link to={link} key={id}>
                  {/* <Icon /> */}
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className={styles.copyrightSection}>
          <div>Copyright &copy; 2022 Mymegaminds</div>
          <div>All Rights reserved</div>
        </div>
      </footer>
    </div>
  );
};
