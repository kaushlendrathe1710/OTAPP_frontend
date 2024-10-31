import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { NavLink } from "react-router-dom";
import styles from "../../../styles/leftsidebar.module.scss";
import {
  BsFillGridFill,
  BsFillCalendarFill,
  BsFillPersonFill,
  BsMapFill,
  BsChevronRight,
  BsFillChatDotsFill,
} from "react-icons/bs";
import { FaUserTie, FaUserGraduate, FaUserPlus, FaUsers } from "react-icons/fa";
import { RiSearch2Fill, RiTestTubeFill, RiAddCircleFill } from "react-icons/ri";
import { AiFillProject, AiOutlineClose } from "react-icons/ai";
import { GoGraph } from "react-icons/go";
import { MdGroups, MdPayments } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { NavItem } from "./NavItem";
import { useClickOutside } from "../../../hooks/useClickOutside";
import userContext from "../../../context/userContext";
import { CgNotes } from "react-icons/cg";

export const linksArr = [
  {
    id: 1,
    path: "home",
    label: "Dashboard",
    Icon: () => <BsFillGridFill />,
    hasChild: false,
  },
  {
    id: 2,
    path: "session-shedule",
    label: "Session Shedule",
    Icon: () => <BsFillCalendarFill />,
    hasChild: false,
  },
  {
    id: 3,
    path: "personal-details",
    label: "Personal Details",
    Icon: () => <BsFillPersonFill />,
    hasChild: false,
  },
  {
    id: 4,
    path: "quick-chat",
    label: "Quick Chat",
    Icon: () => <BsFillChatDotsFill />,
    hasChild: false,
  },
  // TODO: uncomment this when chat will implemented properly
  // {
  //   id: 5,
  //   path: undefined,
  //   label: "Chats",
  //   Icon: () => <MdGroups />,
  //   hasChild: true,
  //   nestedRoutes: [
  //     {
  //       id: "g2",
  //       path: "admin-tutor-group-chat",
  //       label: "Tutor Groups",
  //       Icon: false,
  //       hasChild: false,
  //     },
  //     {
  //       id: "g3",
  //       path: "admin-admin-group-chat",
  //       label: "Admin Groups",
  //       Icon: false,
  //       hasChild: false,
  //     },
  //     {
  //       id: "g4",
  //       path: "ipa-group-chat",
  //       label: "IPA Groups",
  //       Icon: false,
  //       hasChild: false,
  //     },
  //     {
  //       id: "g5",
  //       path: "admin-admin-chat",
  //       label: "Chat With Admin",
  //       Icon: false,
  //       hasChild: false,
  //     },

  //     {
  //       id: "g7",
  //       path: "admin-tutor-chat",
  //       label: "Chat With Tutor",
  //       Icon: false,
  //       hasChild: false,
  //     },
  //   ],
  // },
  {
    id: 6,
    path: undefined,
    label: "Tutor",
    Icon: () => <FaUserTie />,
    hasChild: true,
    nestedRoutes: [
      {
        id: "t1",
        path: "approved-tutors",
        label: "Approved Tutors",
        Icon: false,
        hasChild: false,
      },
      {
        id: "t2",
        path: "rejected-tutors",
        label: "Rejected Tutors",
        Icon: false,
        hasChild: false,
      },
      {
        id: "t3",
        path: "registered-unapproved-tutors",
        label: "Registered-Unapproved Tutors",
        Icon: false,
        hasChild: false,
      },
      {
        id: "t4",
        path: "unregistered-nonverified-email-tutors",
        label: "Unregistered-nonverified-email Tutors",
        Icon: false,
        hasChild: false,
      },
      {
        id: "t5",
        path: "blocked-tutors",
        label: "Blocked Tutors",
        Icon: false,
        hasChild: false,
      },
      {
        id: "t6",
        path: "tutors-payment",
        label: "Payment",
        Icon: false,
        hasChild: false,
      },
      {
        id: "t7",
        path: "tutors-session-history",
        label: "Session History",
        Icon: false,
        hasChild: false,
      },
      {
        id: "t8",
        path: "coadmin-tutor-chat",
        label: "Chat With Tutor",
        Icon: false,
        hasChild: false,
      },
    ],
  },
  {
    id: 7,
    path: "maps",
    label: "Maps",
    Icon: () => <BsMapFill />,
    hasChild: false,
  },

  {
    id: 8,
    path: "query",
    label: "Query",
    Icon: () => <RiSearch2Fill />,
    hasChild: false,
  },
  {
    id: 9,
    path: "test-results",
    label: "Test Results",
    Icon: () => <RiTestTubeFill />,
    hasChild: false,
  },
  {
    id: 10,
    path: "all-projects",
    label: "All Projects",
    Icon: () => <AiFillProject />,
    hasChild: false,
  },
  {
    id: 11,
    path: "payments",
    label: "Payments",
    Icon: () => <MdPayments />,
    hasChild: false,
  },
  {
    id: 14,
    path: "whiteboard",
    label: "Whiteboard",
    Icon: () => <CgNotes />,
    hasChild: true,
    nestedRoutes: [
      {
        id: "17-1",
        path: "whiteboard/play_board",
        label: "View Whiteboard",
        Icon: false,
        hasChild: true,
      },
      {
        id: "17-2",
        path: "whiteboard_sessions",
        label: "Sessions",
        Icon: false,
        hasChild: false,
      },
    ],
  },
];

export const CoAdminSidebar = ({
  isSidebarCollapse,
  setIsSidebarCollapse,
  isSidebarOpen,
  setIsSidebarOpen,
  isSmallWindow,
}) => {
  const [allNavLinks, setAllNavLinks] = useState(linksArr);
  const [isSidebarManuallyCollapse, setIsSidebarManuallyCollapse] =
    useState(true);
  const { logout } = useContext(userContext);

  useLayoutEffect(() => {
    if (window.innerWidth < 990 && window.innerWidth > 768) {
      setIsSidebarManuallyCollapse(false);
    }
  }, []);

  const handleSidebarCollapse = () => {
    setIsSidebarManuallyCollapse(!isSidebarManuallyCollapse);
    setIsSidebarCollapse(!isSidebarCollapse);
  };

  const handleOnMouseEnterSidebar = () => {
    if (!isSidebarManuallyCollapse && !isSmallWindow) {
      setIsSidebarCollapse(false);
    }
  };
  const handleOnMouseLeaveSidebar = () => {
    if (!isSidebarManuallyCollapse && !isSmallWindow) {
      setIsSidebarCollapse(true);
    }
  };

  // const sidebarRef = useRef();
  const sidebarRef = useClickOutside(() => setIsSidebarOpen(false));

  // useEffect(()=>{

  // },[])

  return (
    <>
      <button
        id="mainSidebarButton"
        className={styles.sidebarToggleButton}
        onClick={handleSidebarCollapse}
        style={{
          left: isSidebarCollapse ? "calc(90px - 24px)" : "calc(280px - 24px)",
        }}
      >
        <BsChevronRight
          style={{
            transform: isSidebarCollapse ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
      </button>
      <div
        ref={sidebarRef}
        id="mainSidebar"
        className={styles.sidebarWrapper}
        style={{
          width: isSidebarCollapse && !isSmallWindow ? "90px" : "280px",
          left:
            isSidebarOpen && isSmallWindow
              ? "0%"
              : !isSidebarOpen && isSmallWindow
              ? "-100%"
              : "0",
        }}
        onMouseEnter={handleOnMouseEnterSidebar}
        onMouseLeave={handleOnMouseLeaveSidebar}
      >
        {window.innerWidth > 768 ? (
          <NavLink
            to="home"
            className={styles.logoWrapper}
            style={{
              width: isSidebarCollapse ? "56px" : "",
              padding: isSidebarCollapse ? "0" : "",
              justifyContent: isSidebarCollapse ? "center" : "flex-start",
            }}
          >
            <svg
              width="112"
              height="113"
              viewBox="0 0 112 113"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_191_683)">
                <path
                  d="M1.40597 82.7015C0.799774 81.1209 -1.03376 75.6459 0.78204 71.3549L46.6428 97.8327C46.8767 97.9682 47.1422 98.0396 47.4125 98.0396C47.6829 98.0396 47.9484 97.9682 48.1823 97.8327L112 60.9875V71.9737L47.4128 109.263L1.40597 82.7015V82.7015ZM0.891707 42.3264C-0.453226 46.4186 0.96124 51.9309 1.46851 53.6482L47.4128 80.174L112 42.8841V31.895L48.1823 68.7407C47.9484 68.8762 47.6829 68.9476 47.4125 68.9476C47.1422 68.9476 46.8767 68.8762 46.6428 68.7407L0.891707 42.3264ZM62.3508 33.2913C61.5019 33.8107 60.3002 33.2983 60.0865 32.3281L58.7775 27.0379L48.859 26.2203C48.5322 26.1931 48.2226 26.0622 47.9754 25.8468C47.7282 25.6313 47.5561 25.3426 47.4844 25.0226C47.4126 24.7027 47.4449 24.3681 47.5765 24.0678C47.708 23.7674 47.9321 23.5169 48.2159 23.3527L74.2475 8.32273L66.3044 3.73727L3.25677 40.1363L47.4128 65.6303L110.461 29.2285L89.9233 17.3719L62.3508 33.2913V33.2913ZM61.501 25.2245L62.5841 29.6018L86.8433 15.5953L77.3256 10.1003L54.0203 23.5561L60.1332 24.0601C60.4543 24.0868 60.7589 24.2135 61.0043 24.4224C61.2496 24.6312 61.4233 24.9118 61.501 25.2245V25.2245ZM112 46.4433L48.1823 83.2885C47.9484 83.4241 47.6829 83.4954 47.4125 83.4954C47.1422 83.4954 46.8767 83.4241 46.6428 83.2885L0.782974 56.8113C-1.03283 61.0999 0.796974 66.5711 1.40457 68.1564L47.4128 94.7191L112 57.4301V46.4433Z"
                  fill="url(#paint0_linear_191_683)"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_191_683"
                  x1="-2.13701e-07"
                  y1="3.39656"
                  x2="112"
                  y2="109.603"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFAA47" />
                  <stop offset="1" stopColor="#BA3FF3" />
                </linearGradient>
                <clipPath id="clip0_191_683">
                  <rect
                    width="112"
                    height="112"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            {!isSidebarCollapse && <h3>Meestudy</h3>}
          </NavLink>
        ) : (
          <div className={styles.headerWrapper}>
            <NavLink
              to="home"
              className={styles.logoWrapper}
              style={{
                width: isSidebarCollapse ? "56px" : "",
                padding: isSidebarCollapse ? "0" : "",
                justifyContent: isSidebarCollapse ? "center" : "flex-start",
              }}
            >
              <svg
                width="112"
                height="113"
                viewBox="0 0 112 113"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_191_683)">
                  <path
                    d="M1.40597 82.7015C0.799774 81.1209 -1.03376 75.6459 0.78204 71.3549L46.6428 97.8327C46.8767 97.9682 47.1422 98.0396 47.4125 98.0396C47.6829 98.0396 47.9484 97.9682 48.1823 97.8327L112 60.9875V71.9737L47.4128 109.263L1.40597 82.7015V82.7015ZM0.891707 42.3264C-0.453226 46.4186 0.96124 51.9309 1.46851 53.6482L47.4128 80.174L112 42.8841V31.895L48.1823 68.7407C47.9484 68.8762 47.6829 68.9476 47.4125 68.9476C47.1422 68.9476 46.8767 68.8762 46.6428 68.7407L0.891707 42.3264ZM62.3508 33.2913C61.5019 33.8107 60.3002 33.2983 60.0865 32.3281L58.7775 27.0379L48.859 26.2203C48.5322 26.1931 48.2226 26.0622 47.9754 25.8468C47.7282 25.6313 47.5561 25.3426 47.4844 25.0226C47.4126 24.7027 47.4449 24.3681 47.5765 24.0678C47.708 23.7674 47.9321 23.5169 48.2159 23.3527L74.2475 8.32273L66.3044 3.73727L3.25677 40.1363L47.4128 65.6303L110.461 29.2285L89.9233 17.3719L62.3508 33.2913V33.2913ZM61.501 25.2245L62.5841 29.6018L86.8433 15.5953L77.3256 10.1003L54.0203 23.5561L60.1332 24.0601C60.4543 24.0868 60.7589 24.2135 61.0043 24.4224C61.2496 24.6312 61.4233 24.9118 61.501 25.2245V25.2245ZM112 46.4433L48.1823 83.2885C47.9484 83.4241 47.6829 83.4954 47.4125 83.4954C47.1422 83.4954 46.8767 83.4241 46.6428 83.2885L0.782974 56.8113C-1.03283 61.0999 0.796974 66.5711 1.40457 68.1564L47.4128 94.7191L112 57.4301V46.4433Z"
                    fill="url(#paint0_linear_191_683)"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_191_683"
                    x1="-2.13701e-07"
                    y1="3.39656"
                    x2="112"
                    y2="109.603"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFAA47" />
                    <stop offset="1" stopColor="#BA3FF3" />
                  </linearGradient>
                  <clipPath id="clip0_191_683">
                    <rect
                      width="112"
                      height="112"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              {!isSidebarCollapse && <h3>Meestudy</h3>}
            </NavLink>
            <button onClick={() => setIsSidebarOpen(false)}>
              <AiOutlineClose />
            </button>
          </div>
        )}

        <div className={styles.navWrapper}>
          {allNavLinks.map(
            ({ id, path, label, Icon, hasChild, nestedRoutes }, i) => {
              return (
                <NavItem
                  key={id}
                  id={id}
                  i={i}
                  path={path}
                  label={label}
                  Icon={Icon}
                  hasChild={hasChild}
                  nestedRoutes={nestedRoutes}
                  isSidebarCollapse={isSidebarCollapse}
                  setAllNavLinks={setAllNavLinks}
                  isSmallWindow={isSmallWindow}
                />
              );
            }
          )}
        </div>
        <button
          onClick={() => logout()}
          className={styles.logoutButton}
          title="Log out"
        >
          <FiLogOut />
          {!isSidebarCollapse && <span>Log out</span>}
        </button>
      </div>
    </>
  );
};
