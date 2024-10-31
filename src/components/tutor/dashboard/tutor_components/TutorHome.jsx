import React from "react";
import styles from "../../../../styles/dashboard.module.scss";
import utilStyles from "../../../../styles/utils.module.scss";
import { NavCard } from "../NavCard";
import { linksArr } from "../../left_sidebar/TutorSidebar";

export const TutorHome = () => {
  return (
    <div className="outletContainer">
      <h2 className={utilStyles.headingLg}>👋 Hello Tutor!</h2>
      <section className={styles.navCardsWrapper}>
        {linksArr.map(
          ({ id, path, label, Icon, hasChild, nestedRoutes }, i) => {
            return (
              <NavCard
                key={id}
                id={i}
                path={path}
                label={label}
                Icon={Icon}
                hasChild={hasChild}
                nestedRoutes={nestedRoutes}
              />
            );
          }
        )}
      </section>
    </div>
  );
};
