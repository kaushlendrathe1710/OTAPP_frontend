import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import styles from "../../../../styles/dashboard.module.scss";
import utilStyles from "../../../../styles/utils.module.scss";
import { NavCard } from "../NavCard";
import { linksArr } from "../../left_sidebar/SubAdminSidebar";
import userContext from "../../../../context/userContext";
import toast from "react-hot-toast";

import api, { getAccessToken, SOCKET_BASE_URL } from "../../../../services/api";

const CoAdminHome = () => {
    const { userData, socket } = useContext(userContext);

    return (
        <div className="outletContainer">
            <h2 className={utilStyles.headingLg}>👋 Hello Sub-Admin!</h2>
            <section className={styles.navCardsWrapper}>
                {linksArr.map(({ id, path, label, Icon, hasChild, nestedRoutes }) => {
                    return <NavCard key={id} id={id} path={path} label={label} Icon={Icon} hasChild={hasChild} nestedRoutes={nestedRoutes} routesFor="sub-admin" />;
                })}
            </section>
        </div>
    );
};

export default CoAdminHome;
