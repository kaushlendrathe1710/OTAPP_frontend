import React, { useContext, useEffect, useState } from "react";
import userContext from "../../../context/userContext";
import { WhiteboardDashboardContentext } from "../../../context/whiteboardDashboardContentext";
import api from "../../../services/api";
import Playboard from "../Whiteboard";
// import Playboard from '../playboard copy/playboard';
import PlayboardWrapper from "../playboard copy/playboardWrapper";
import TabsContainer from "./tabsContainer";
import styles from "./whiteboard_dashboard.module.css";
import BoardContextProvider from "../../../context/boardContext";
import Whiteboard from "../Whiteboard";

const tabs = [
  {
    _id: "1",
    name: "Whiteboard1",
  },
  {
    _id: "2",
    name: "Whiteboard2",
  },
  {
    _id: "3",
    name: "Whiteboard3",
  },
];

const WhiteboardDashboard = () => {
  const {
    whiteboardList,
    setWhiteboardList,
    currentTabIndex,
    setCurrentTabIndex,
  } = useContext(WhiteboardDashboardContentext);

  const userCtx = useContext(userContext);

  // console.log('list', whiteboardList)
  // async function fetchAllSessions() {
  //     const userData = userCtx.userData;
  //     console.log(userData)
  //     let userId = userData?._id, userType = userData?.userType;
  //     const res = await api.get(`whiteboard/all?userId=${userId}&userType=${userType}`)
  //     console.log('sessions', res);
  //     setWhiteboardList(res.data);
  // }
  // useEffect(() => {
  //     fetchAllSessions()
  //     return () => { };
  // }, [userCtx]);

  return (
    <div className={styles.dashboardContainer}>
      <TabsContainer
        currentTabIndex={currentTabIndex}
        setCurrentTabIndex={setCurrentTabIndex}
        whiteboardList={whiteboardList}
        setWhiteboardList={setWhiteboardList}
      />
      {whiteboardList?.map((board, i) => {
        return currentTabIndex == i ? (
          <React.Fragment key={board._id}>
            {/* <PlayboardWrapper>
                                <Playboard />
                            </PlayboardWrapper> */}
            <BoardContextProvider>
              <Whiteboard />
            </BoardContextProvider>
          </React.Fragment>
        ) : (
          <React.Fragment key={board._id}>
            {/* <PlayboardWrapper>
                                <Playboard style={{ display: 'none' }}/>
                            </PlayboardWrapper> */}
            <BoardContextProvider>
              <Whiteboard style={{ display: "none" }} />
            </BoardContextProvider>
          </React.Fragment>
        );
      })}

      {/* <PlayboardWrapper>
                <Playboard />
            </PlayboardWrapper> */}
    </div>
  );
};

export default WhiteboardDashboard;
