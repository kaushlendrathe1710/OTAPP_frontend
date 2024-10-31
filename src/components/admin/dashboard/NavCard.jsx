import React from "react";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import styles from "../../../styles/dashboard.module.scss";

export const NavCard = ({
  id,
  path,
  label,
  Icon,
  hasChild,
  nestedRoutes,
  routesFor,
}) => {
  let newPath = `/${routesFor}/${path}`;
  return (
    <div className={styles.navCardWrapper}>
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
              let newPath = `/${routesFor}/${path}`;
              return (
                <Link key={id} to={newPath}>
                  <BsArrowRight /> <span>{label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
