import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import styles from "../../../styles/dashboard.module.scss";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const NavCard = ({ id, path, label, Icon, hasChild, nestedRoutes }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  const cardVariants = {
    visible: (id) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: id * 0.05,
        type: "spring",
      },
    }),
    hidden: {
      opacity: 0,
      y: 50,
    },
  };

  let newPath = `/tutor/${path}`;
  return (
    <motion.div
      ref={ref}
      custom={id}
      animate={controls}
      initial="hidden"
      variants={cardVariants}
      className={styles.navCardWrapper}
    >
      {!hasChild ? (
        <Link to={newPath}>
          <div className={styles.cardHeader}>
            {/* <Icon /> */}
            <div>{label}</div>
          </div>
        </Link>
      ) : (
        <div className={styles.cardHeader}>
          {/* <Icon /> */}
          <div>{label}</div>
        </div>
      )}
      <div className={styles.cardFooter}>
        {!hasChild ? (
          <div>
            <h6>Go to:</h6>
            <Link to={newPath}>
              <BsArrowRight /> <span>{label}</span>
            </Link>
          </div>
        ) : (
          <div>
            <h6>Go to: </h6>
            {nestedRoutes.map(({ id, path, label }) => {
              let newPath = `/tutor/${path}`;
              return (
                <Link key={id} to={newPath}>
                  <BsArrowRight /> <span>{label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
