import React, { useContext, useEffect } from "react";
import styles from "../../../../styles/dashboard.module.scss";
import utilStyles from "../../../../styles/utils.module.scss";
import { NavCard } from "../NavCard";
import { linksArr } from "../../left_sidebar/AdminSidebar";
import userContext from "../../../../context/userContext";
import toast from "react-hot-toast";
// import userContext from "../../../../context/userContext";

import api, { getAccessToken, SOCKET_BASE_URL } from "../../../../services/api";

// import { DashboardHeader } from "../Dashboardheader";

export const AdminHome = () => {
    const { userData, socket } = useContext(userContext);

    return (
        <div className="outletContainer">
            {" "}
            {/* <DashboardHeader userData={userData} /> */}
            <h2 className={utilStyles.headingLg}>👋 Hello Admin!</h2>
            <section className={styles.navCardsWrapper}>
                {linksArr.map(({ id, path, label, Icon, hasChild, nestedRoutes }) => {
                    return <NavCard key={id} id={id} path={path} label={label} Icon={Icon} hasChild={hasChild} nestedRoutes={nestedRoutes} routesFor="admin" />;
                })}
            </section>
        </div>
    );
};
