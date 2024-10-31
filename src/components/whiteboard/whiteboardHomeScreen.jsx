import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardContextProvider, { BoardContext } from "../../context/boardContext";
import userContext from "../../context/userContext";
import { WhiteboardProvider } from "../../context/WhiteboardContext";
import glass from "../../styles/glass.module.scss";
import AppContextProvider from "./playboard/context/appContext";
import Playboard from "./playboard/playboard";
import NewWhiteboardSession from "./sessions/newSession/newWhiteboardSession";
import SessionsHistory from "./sessions/sessionHistory/sessionsHistory";
import UpcommingSessions from "./sessions/upcommingSessions/upcommingSessions";
import AskVisibilityModel from "./utils/askVisibilityModel";
// import Whiteboard from './whiteboard';
import styles from "./whiteboardHomeScreen.module.css";

const WhiteboardHomeScreen = () => {
  const [currentTab, setCurrentTab] = useState("upcomming_sessions");
  const [openModel, setOpenModel] = useState(false);

  const userCtx = useContext(userContext);
  const user = userCtx?.userData;
  const setUser = userCtx?.setUserData;
  const thisUserType = user?.userType;

  const { setWhiteboard } = useContext(BoardContext);

  const navigate = useNavigate();

  // console.log('user', userCtx)

  const joinClickHandler = (board) => {
    // console.log("usertype", user);
    if (user.userType === "Super-Admin" || user.userType === "Admin") {
      setOpenModel(true);
    } else {
      handleVisibleClick(board);
    }
  };

  function handleVisibleClick(board) {
    // boardCardClick()
    // console.log(board)
    setUser((prv) => ({ ...prv, visible: true }));
    // setPage("whiteboard");
    setWhiteboard(board);
    navigate("../whiteboard/" + board._id);
    // console.log("board", board);
  }

  //making admin not show in the active users list
  function handleInvisibleClick(board) {
    // boardCardClick()
    setUser((prv) => ({ ...prv, visible: false }));
    // setPage("whiteboard");
    // console.log("board", board);
    navigate("../whiteboard/" + board._id);
    setWhiteboard(board);
  }

  // function viewWhitboardClickHandler() {
  //     setCurrentTab('view_whiteboard')
  // }
  function upCommingSessionClickHandler() {
    setCurrentTab("upcomming_sessions");
  }
  function sessionHistoryClickHandler() {
    setCurrentTab("session_history");
  }
  function newSessionClickHandler() {
    setCurrentTab("new_session");
  }
  return (
    <div className="outletContainer">
      <div className={styles.header}>
        {/* <h2 className={styles.heading}>Whiteboard</h2> */}
        <div
          style={{ marginTop: 0, marginRight: "140px" }}
          className={glass.tabsWrapper}
        >
          {/* <div onClick={viewWhitboardClickHandler}
                        className={`${glass.tab} ` + (currentTab === 'view_whiteboard' ? `${glass.activeTab}` : '')}>
                        View Whiteboard
                    </div> */}
          {(thisUserType === "Admin" || thisUserType === "Super-Admin") && (
            <div
              onClick={newSessionClickHandler}
              className={
                `${glass.tab} ` +
                (currentTab === "new_session" ? `${glass.activeTab}` : "")
              }
            >
              Create Session
            </div>
          )}
          <div
            onClick={upCommingSessionClickHandler}
            className={
              `${glass.tab} ` +
              (currentTab === "upcomming_sessions" ? `${glass.activeTab}` : "")
            }
          >
            Upcomming sessions
          </div>
          <div
            onClick={sessionHistoryClickHandler}
            className={
              `${glass.tab} ` +
              (currentTab === "session_history" ? `${glass.activeTab}` : "")
            }
          >
            Session History
          </div>
        </div>
      </div>
      <div className={styles.screenBody}>
        {/* {currentTab === 'view_whiteboard'
                    && <AppContextProvider>
                        <BoardContextProvider>
                            <Playboard />
                        </BoardContextProvider>
                    </AppContextProvider>
                } */}
        {currentTab === "upcomming_sessions" && (
          <UpcommingSessions joinClickHandler={joinClickHandler} />
        )}
        {currentTab === "session_history" && (
          <SessionsHistory joinClickHandler={joinClickHandler} />
        )}
        {currentTab === "new_session" &&
          (thisUserType === "Admin" || thisUserType === "Super-Admin") && (
            <NewWhiteboardSession />
          )}
      </div>
      <AskVisibilityModel
        open={openModel}
        setOpen={setOpenModel}
        handleVisibleClick={handleVisibleClick}
        handleInvisibleClick={handleInvisibleClick}
      />
    </div>
  );
};

export default WhiteboardHomeScreen;
