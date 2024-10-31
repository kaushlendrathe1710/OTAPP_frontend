import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import styles from "../../../styles/leftsidebar.module.scss";
import { BsChevronDown } from "react-icons/bs";
import { motion } from "framer-motion";

export const NavItem = ({
  id,
  path,
  label,
  Icon,
  hasChild,
  nestedRoutes,
  isSidebarCollapse,
  setAllNavLinks,
  i,
  isSmallWindow,
}) => {
  const [isNavLinkCollapse, setIsNavLinkCollapse] = useState(true);
  const [isNestedRouteActive, setIsNestedRouteActive] = useState(false);

  const handleLinkCollapse = () => {
    setIsNavLinkCollapse(!isNavLinkCollapse);
  };

  useEffect(() => {
    function checkIsNestedRouteActive() {
      if (hasChild) {
        let nestedRoutesPaths = nestedRoutes?.map(({ path }) => {
          return path;
        });
        let startIndexOfActivePath = location.pathname.lastIndexOf("/");
        let activePath = location.pathname.slice(startIndexOfActivePath + 1);
        if (nestedRoutesPaths?.includes(activePath)) {
          setIsNestedRouteActive(true);
        } else {
          setIsNestedRouteActive(false);
          setIsNavLinkCollapse(true);
        }
      } else {
        setIsNestedRouteActive(false);
      }
    }
    checkIsNestedRouteActive();
  }, [location.pathname]);

  // let activeStyle = {
  //   color: "var(--gray-950)",
  //   backgroundColor: "rgba(0,0,0, 0.05)",
  // };
  let activeStyle = {
    color: "white",
    backgroundColor: "var(--primary-500)",
  };

  let collpaseNavItemStyle = {
    justifyContent: "center",
    width: "3rem",
    height: "3rem",
    padding: 0,
  };

  return !hasChild ? (
    <NavLink
      to={path}
      key={id}
      className={styles.linkWrapper}
      style={({ isActive }) =>
        isActive && !isSidebarCollapse
          ? activeStyle
          : isActive && isSidebarCollapse
          ? { ...activeStyle, ...collpaseNavItemStyle }
          : isSidebarCollapse
          ? collpaseNavItemStyle
          : undefined
      }
      title={label}
    >
      <div className={styles.svgWrapper}>
        <Icon />
      </div>
      {!isSidebarCollapse && !isSmallWindow ? (
        <span>{label}</span>
      ) : isSidebarCollapse && !isSmallWindow ? null : (
        <span>{label}</span>
      )}
    </NavLink>
  ) : (
    <motion.div
      key={id}
      className={styles.linkItemWrapper}
      style={{
        height: isNavLinkCollapse ? "3rem" : "fit-content",
        // color: isNestedRouteActive ? "var(--gray-950)" : "",
      }}
      title={label}
    >
      <motion.div
        className={styles.linkItem}
        style={{
          // color: isNavLinkCollapse ? "var(--gray-950)" : "var(--gray-700)",
          color: isNestedRouteActive ? "white" : "",
          backgroundColor: isNestedRouteActive ? "var(--primary-500)" : "",
          // backgroundColor: isNestedRouteActive
          //   ? "rgba(0,0,0, 0.05)"
          //   : isNavLinkCollapse
          //   ? ""
          //   : "rgba(0,0,0,0.05)",
          width: isSidebarCollapse ? "3rem" : "",
          height: isSidebarCollapse ? "3rem" : "",
          justifyContent: isSidebarCollapse ? "center" : "",
          padding: isSidebarCollapse ? "0" : "",
        }}
        onClick={handleLinkCollapse}
      >
        <div className={styles.left}>
          <div className={styles.svgWrapper}>
            <Icon />
          </div>
          {!isSidebarCollapse && !isSmallWindow ? (
            <span>{label}</span>
          ) : isSidebarCollapse && !isSmallWindow ? null : (
            <span>{label}</span>
          )}
        </div>
        {!isSidebarCollapse && !isSmallWindow ? (
          <div className={styles.right}>
            <BsChevronDown />
          </div>
        ) : isSidebarCollapse && !isSmallWindow ? null : (
          <div className={styles.right}>
            <BsChevronDown />
          </div>
        )}
      </motion.div>

      {/* // nested routes */}
      {!isSidebarCollapse && (
        <motion.div className={`${styles.nestedRoutesWrapper}`}>
          {nestedRoutes.map(({ id, path, label, hasChild }) => {
            return (
              <NavLink
                key={id}
                to={path}
                className={styles.nestedRoute}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                title={label}
              >
                {label}
              </NavLink>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};
