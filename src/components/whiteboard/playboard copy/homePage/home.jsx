import React, { useContext, useEffect } from "react";
import { BoardContext } from "../context/boardContext";
import { AppContext, URL } from "../context/appContext";
import BoardCard from "./boardCard";
import styles from "./home.module.css";

const Home = ({ setPage }) => {
  const { allWhiteboards, setAllWhiteboards } = useContext(BoardContext);
  const { user } = useContext(AppContext);

  async function getBoards() {
    if (user._id) {
      try {
        let res = await fetch(URL + "whiteboard/all/?userId=" + user._id);
        let data = await res.json();
        console.log("data", data);
        setAllWhiteboards(data);
      } catch (err) {
        console.error("Error getting Boards", err);
      }
    }
  }

  useEffect(() => {
    getBoards();
  }, []);

  function createNewBoard() {
    let boardName = prompt("Give a name to the board!");
    let createdBy = user;

    if (boardName && createdBy) {
      fetch(URL + "whiteboard/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createdBy: createdBy,
          boardName: boardName,
          users: [createdBy],
        }),
      })
        .then((res) => {
          console.log("res", res);
          if (res.status === 200) {
            return res.json();
          }
        })
        .then((data) => {
          console.log(data);
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
      {user.role === "admin" && (
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
