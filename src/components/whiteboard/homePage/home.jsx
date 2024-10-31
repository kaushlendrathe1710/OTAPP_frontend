import React, { useContext, useEffect } from "react";
import { BoardContext } from "../../../context/boardContext";
import { AppContext, URL } from "../../../context/appContext";
import BoardCard from "./boardCard";
import styles from "./home.module.css";
import userContext from "../../../context/userContext";
import api from "../../../services/api";

const Home = ({ setPage }) => {
  const { allWhiteboards, setAllWhiteboards } = useContext(BoardContext);
  // const { user } = useContext(AppContext);
  const userCtx = useContext(userContext);

  // console.log('userrrr', userCtx)
  const user = userCtx.userData;

  async function getBoards() {
    if (user?._id) {
      try {
        // let res = await fetch(URL + "whiteboard/all/?userId=" + user._id);
        let res = await api.get("whiteboard/all/?userId=" + user?._id);
        // let data = await res.json();
        // console.log("data", res.data);
        setAllWhiteboards(res.data);
        // setAllWhiteboards(data);
      } catch (err) {
        console.error("Error getting Boards", err);
      }
    }
  }

  useEffect(() => {
    getBoards();
  }, [userCtx?.userData]);

  function createNewBoard() {
    let boardName = prompt("Give a name to the board!");
    let createdBy = user;

    if (boardName && createdBy) {
      api
        .post("whiteboard/create", {
          createdBy: createdBy,
          boardName: boardName,
          users: [createdBy],
        })
        // fetch(URL + "whiteboard/create", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         createdBy: createdBy,
        //         boardName: boardName,
        //         users: [createdBy],
        //     }),
        // })
        // .then((res) => {
        //     console.log("res", res);
        //     if (res.status === 200) {
        //         // return res.json();
        //     }
        // })
        .then((res) => {
          // console.log(res.data);
          getBoards();
        })
        .catch((err) => console.log("Error Creating board", err));
    }
  }

  return (
    <div className={styles.home}>
      <h1 style={{ marginBottom: "50px", color: "white" }}>
        Welcome {user?.name}
      </h1>
      {/* {user?.userType === "admin" && ( */}
      {(user?.userType === "Super-Admin" || user?.userType === "Admin") && (
        <button onClick={createNewBoard} className={styles.creaWhiteboardBtn}>
          Create New Whiteboard!
        </button>
      )}
      {allWhiteboards &&
        allWhiteboards.map((brd) => {
          return <BoardCard setPage={setPage} key={brd._id} board={brd} />;
        })}
    </div>
  );
};

export default Home;
