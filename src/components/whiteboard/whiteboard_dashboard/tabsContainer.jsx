import React, { useContext, useState, useEffect } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./tabsContainer.module.css";
import { RxCross2 } from "react-icons/rx";
import { BoardContext } from "../../../context/boardContext";
import api from "../../../services/api";

const TabsContainer = ({
  whiteboardList,
  currentTabIndex,
  setCurrentTabIndex,
  setWhiteboardList,
}) => {
  const navigate = useNavigate();
  const { boardId } = useParams();

  const { setWhiteboard } = useContext(BoardContext);

  const selecteTabStyle = {
    backgroundColor: "var(--primary-200)",
  };

  useEffect(() => {
    if (whiteboardList.length === 0) {
      navigate("../whiteboard/whiteboard_sessions");
      // api.get(`whiteboard/${boardId}`)
      // .then((res) => {
      //     console.log('fetchBoard', res)
      //     if (res.data.shapes) {
      //         setWhiteboardList(prv => [res.data])
      //         setCurrentTabIndex(0)
      //     }
      // })
      // .catch((err) => console.error(err));
    }
    return () => {};
  }, []);

  function tabClickHandler(i) {
    setCurrentTabIndex(i);
    navigate("../whiteboard/" + whiteboardList[i]._id);
    // setWhiteboard(whiteboardList[currentTabIndex]);
  }

  function addWhiteboardClickHandler() {
    navigate("../whiteboard/" + "whiteboard_sessions");
  }

  function closeTab(tab, i) {
    setWhiteboardList((prv) =>
      prv.filter((list) => {
        console.log(list, tab);
        return list._id != tab._id;
      })
    );
    if (i > 0) {
      setCurrentTabIndex(i - 1);
      navigate("../whiteboard/" + whiteboardList[i - 1]._id);
    } else if (i === 0) {
      setCurrentTabIndex(-1);
    }
    if (whiteboardList.length < 2) {
      navigate("../whiteboard/whiteboard_sessions");
    }
  }

  return (
    <div className={styles.tabsContainer}>
      {whiteboardList.map((tab, i) => (
        <div
          key={tab._id}
          onClick={(e) => tabClickHandler(i)}
          style={currentTabIndex === i ? selecteTabStyle : {}}
          className={
            `${styles.tab} ` + (currentTabIndex === i ? styles.active : "")
          }
        >
          {tab.name}{" "}
          <span
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab, i);
            }}
            className={styles.cross}
          >
            <RxCross2 />
          </span>
        </div>
      ))}
      <div
        onClick={addWhiteboardClickHandler}
        className={styles.addWhiteboardBtn}
      >
        <IoIosAddCircleOutline />
      </div>
    </div>
  );
};

export default TabsContainer;
