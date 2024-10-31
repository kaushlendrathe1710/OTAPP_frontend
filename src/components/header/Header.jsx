import React, { useState, useLayoutEffect, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BsInfoCircle, BsChevronDown } from "react-icons/bs";
import { FaUserTie, FaUserEdit } from "react-icons/fa";
import { AiOutlineRead, AiOutlineHome, AiOutlineMenu, AiFillProject } from "react-icons/ai";
import { MdOutlineLibraryBooks, MdWorkOutline, MdAssignment } from "react-icons/md";
import styles from "../../styles/header.module.scss";

const { log } = console;

export const navLinks = [
  {
    id: 1,
    path: "/",
    label: "Home",
    Icon: () => <AiOutlineHome />,
    hasChild: false,
  },
  {
    id: 2,
    path: "/about",
    label: "About",
    Icon: () => <BsInfoCircle />,
    hasChild: false,
  },
  {
    id: 3,
    path: undefined,
    label: "Services",
    Icon: () => <MdOutlineLibraryBooks />,
    hasChild: true,
    nestedRoutes: [
      {
        path: "/services/online-tutoring-services",
        label: "Online Tutoring Services",
        Icon: FaUserTie,
      },
      {
        path: "/services/online-homework-help",
        label: "Online Homework Help",
        Icon: FaUserEdit,
      },
      {
        path: "/services/assignment-help",
        label: "Assignment Help",
        Icon: MdAssignment,
      },
      {
        path: "/services/project-management-services-from-megamind",
        label: "Project Management",
        Icon: AiFillProject,
      },
    ],
  },
  {
    id: 4,
    path: "/career",
    label: "Careers",
    Icon: () => <MdWorkOutline />,
    hasChild: false,
  },
  {
    id: 5,
    path: "/blog",
    label: "Blog",
    Icon: () => <AiOutlineRead />,
    hasChild: false,
  },
];

export const Header = ({ isCareersPage }) => {
  const [addBoxShadow, setAddBoxShadow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sideNavServicesDropdownVisibility, setSideNavServicesDropdownVisibility] = useState(false);

  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.onscroll = () => {
      if (window.scrollY > 40) {
        setAddBoxShadow(true);
      } else {
        setAddBoxShadow(false);
      }
    };
  }, [window.scrollY]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  let activeStyle = {
    color: "var(--primary-color)",
  };

  return (
    <div
      className={styles.headerWrapper}
      style={{
        boxShadow: addBoxShadow ? "0 1px 1rem 0 rgba(0,0,0, 0.05)" : "none",
        background: addBoxShadow ? "white" : isCareersPage && !addBoxShadow ? "rgba(0,0,0, 0.15)" : "transparent",
        backdropFilter: isCareersPage && !addBoxShadow && "blur(12px)",
      }}
    >
      <header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <nav className="">
            {navLinks.map(({ id, path, label, Icon, hasChild, nestedRoutes = [] }) => {
              return !hasChild ? (
                <NavLink to={path} key={id} style={({ isActive }) => (isActive ? activeStyle : isCareersPage && !addBoxShadow ? { color: "var(--gray-100)" } : { color: "" })}>
                  {/* <Icon /> */}
                  <span>{label}</span>
                </NavLink>
              ) : (
                <a key={id} href="#" className={styles.nestedRoutesContainer}>
                  <div className={styles.nestedRoutesLabel}>
                    <span>{label}</span>
                    <BsChevronDown />
                  </div>

                  <ul className={styles.nestedRoutes}>
                    {nestedRoutes.map(({ path, label, Icon }, i) => {
                      return (
                        <NavLink to={path} key={path}>
                          <span>
                            <Icon />
                          </span>
                          <span>{label}</span>
                        </NavLink>
                      );
                    })}
                  </ul>
                </a>
              );
            })}
          </nav>
          <NavLink to="/contact-us" className="btnPrimary btn--large">
            <button className="btnPrimary btn--large">Contact us</button>
            <button
              className={styles.hamMenu}
              onClick={() => navigate("/contact-us")}
              style={{
                color: isCareersPage && !addBoxShadow ? "white" : "var(--gray-900)",
              }}
            >
              <AiOutlineMenu />
            </button>
          </NavLink>
        </div>
      </header>

      <div className={styles.sideNavbar} style={{ top: isSidebarOpen ? "0" : "-100vh" }}>
        <header>
          <div className="logoWrapper">
            <svg width="112" height="113" viewBox="0 0 112 113" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_191_683)">
                <path
                  d="M1.40597 82.7015C0.799774 81.1209 -1.03376 75.6459 0.78204 71.3549L46.6428 97.8327C46.8767 97.9682 47.1422 98.0396 47.4125 98.0396C47.6829 98.0396 47.9484 97.9682 48.1823 97.8327L112 60.9875V71.9737L47.4128 109.263L1.40597 82.7015V82.7015ZM0.891707 42.3264C-0.453226 46.4186 0.96124 51.9309 1.46851 53.6482L47.4128 80.174L112 42.8841V31.895L48.1823 68.7407C47.9484 68.8762 47.6829 68.9476 47.4125 68.9476C47.1422 68.9476 46.8767 68.8762 46.6428 68.7407L0.891707 42.3264ZM62.3508 33.2913C61.5019 33.8107 60.3002 33.2983 60.0865 32.3281L58.7775 27.0379L48.859 26.2203C48.5322 26.1931 48.2226 26.0622 47.9754 25.8468C47.7282 25.6313 47.5561 25.3426 47.4844 25.0226C47.4126 24.7027 47.4449 24.3681 47.5765 24.0678C47.708 23.7674 47.9321 23.5169 48.2159 23.3527L74.2475 8.32273L66.3044 3.73727L3.25677 40.1363L47.4128 65.6303L110.461 29.2285L89.9233 17.3719L62.3508 33.2913V33.2913ZM61.501 25.2245L62.5841 29.6018L86.8433 15.5953L77.3256 10.1003L54.0203 23.5561L60.1332 24.0601C60.4543 24.0868 60.7589 24.2135 61.0043 24.4224C61.2496 24.6312 61.4233 24.9118 61.501 25.2245V25.2245ZM112 46.4433L48.1823 83.2885C47.9484 83.4241 47.6829 83.4954 47.4125 83.4954C47.1422 83.4954 46.8767 83.4241 46.6428 83.2885L0.782974 56.8113C-1.03283 61.0999 0.796974 66.5711 1.40457 68.1564L47.4128 94.7191L112 57.4301V46.4433Z"
                  fill="url(#paint0_linear_191_683)"
                />
              </g>
              <defs>
                <linearGradient id="paint0_linear_191_683" x1="-2.13701e-07" y1="3.39656" x2="112" y2="109.603" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFAA47" />
                  <stop offset="1" stopColor="#BA3FF3" />
                </linearGradient>
                <clipPath id="clip0_191_683">
                  <rect width="112" height="112" fill="white" transform="translate(0 0.5)" />
                </clipPath>
              </defs>
            </svg>
            <h3>Meestudy</h3>
          </div>
          <button className={styles.closeMenu} onClick={() => setIsSidebarOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.6585 4.92888C18.049 4.53836 18.6822 4.53835 19.0727 4.92888C19.4632 5.3194 19.4632 5.95257 19.0727 6.34309L13.4158 12L19.0727 17.6568C19.4632 18.0473 19.4632 18.6805 19.0727 19.071C18.6822 19.4615 18.049 19.4615 17.6585 19.071L12.0016 13.4142L6.34481 19.071C6.3387 19.0771 6.33254 19.0831 6.32632 19.089C5.93455 19.4614 5.31501 19.4554 4.93059 19.071C4.6377 18.7781 4.56447 18.3487 4.71092 17.9876C4.75973 17.8672 4.83296 17.7544 4.93059 17.6568L10.5874 12L4.93059 6.34314C4.54006 5.95262 4.54006 5.31945 4.93059 4.92893C5.32111 4.5384 5.95428 4.5384 6.3448 4.92893L12.0016 10.5857L17.6585 4.92888Z" fill="black" />
            </svg>
          </button>
        </header>
        <div className={styles.navWrapper}>
          <nav className="">
            {navLinks.map(({ id, path, label, Icon, hasChild, nestedRoutes = [] }) => {
              return !hasChild ? (
                <NavLink to={path} key={id} style={({ isActive }) => (isActive ? activeStyle : { color: "" })}>
                  <Icon />
                  <span>{label}</span>
                </NavLink>
              ) : (
                <a
                  key={id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    tabIndex={0}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setSideNavServicesDropdownVisibility((prev) => !prev)}
                  >
                    <span>{label}</span>
                    <BsChevronDown />
                  </div>

                  {sideNavServicesDropdownVisibility && (
                    <ul
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginTop: "1rem",
                      }}
                    >
                      {nestedRoutes.map(({ path, label, Icon }, i) => {
                        return (
                          <NavLink to={path} key={path} style={{ display: "flex", alignItems: "center" }}>
                            <span>
                              <Icon size={18} />
                            </span>
                            <span style={{ fontSize: "0.95rem" }}>{label}</span>
                          </NavLink>
                        );
                      })}
                    </ul>
                  )}
                </a>
              );
            })}
          </nav>
          <button className="btnPrimary btn--large">Contact us</button>
        </div>
      </div>
    </div>
  );
};

export function Logo() {
  return (
    <Link to="/" className="logoWrapper" onClick={() => window.scrollTo(0, 0)}>
      <svg width="112" height="113" viewBox="0 0 112 113" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_191_683)">
          <path
            d="M1.40597 82.7015C0.799774 81.1209 -1.03376 75.6459 0.78204 71.3549L46.6428 97.8327C46.8767 97.9682 47.1422 98.0396 47.4125 98.0396C47.6829 98.0396 47.9484 97.9682 48.1823 97.8327L112 60.9875V71.9737L47.4128 109.263L1.40597 82.7015V82.7015ZM0.891707 42.3264C-0.453226 46.4186 0.96124 51.9309 1.46851 53.6482L47.4128 80.174L112 42.8841V31.895L48.1823 68.7407C47.9484 68.8762 47.6829 68.9476 47.4125 68.9476C47.1422 68.9476 46.8767 68.8762 46.6428 68.7407L0.891707 42.3264ZM62.3508 33.2913C61.5019 33.8107 60.3002 33.2983 60.0865 32.3281L58.7775 27.0379L48.859 26.2203C48.5322 26.1931 48.2226 26.0622 47.9754 25.8468C47.7282 25.6313 47.5561 25.3426 47.4844 25.0226C47.4126 24.7027 47.4449 24.3681 47.5765 24.0678C47.708 23.7674 47.9321 23.5169 48.2159 23.3527L74.2475 8.32273L66.3044 3.73727L3.25677 40.1363L47.4128 65.6303L110.461 29.2285L89.9233 17.3719L62.3508 33.2913V33.2913ZM61.501 25.2245L62.5841 29.6018L86.8433 15.5953L77.3256 10.1003L54.0203 23.5561L60.1332 24.0601C60.4543 24.0868 60.7589 24.2135 61.0043 24.4224C61.2496 24.6312 61.4233 24.9118 61.501 25.2245V25.2245ZM112 46.4433L48.1823 83.2885C47.9484 83.4241 47.6829 83.4954 47.4125 83.4954C47.1422 83.4954 46.8767 83.4241 46.6428 83.2885L0.782974 56.8113C-1.03283 61.0999 0.796974 66.5711 1.40457 68.1564L47.4128 94.7191L112 57.4301V46.4433Z"
            fill="url(#paint0_linear_191_683)"
          />
        </g>
        <defs>
          <linearGradient id="paint0_linear_191_683" x1="-2.13701e-07" y1="3.39656" x2="112" y2="109.603" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFAA47" />
            <stop offset="1" stopColor="#BA3FF3" />
          </linearGradient>
          <clipPath id="clip0_191_683">
            <rect width="112" height="112" fill="white" transform="translate(0 0.5)" />
          </clipPath>
        </defs>
      </svg>
      <h3>Mymegaminds</h3>
    </Link>
  );
}
