import { useContext, useState } from "react";
import { AppContext } from "../context/appContext";
import { BoardContext } from "../context/boardContext";
import AskVisibilityModel from "../utils/askVisibilityModel";
import styles from "./boardCard.module.css";

export default function BoardCard({ board, setPage }) {
  const { setWhiteboard } = useContext(BoardContext);
  const { setUser, user } = useContext(AppContext);
  const [openModel, setOpenModel] = useState(false);

  const boardCardClick = () => {
    console.log("usertype", user);
    if (user.role === "admin") {
      setOpenModel(true);
    } else {
      handleVisibleClick();
    }
  };

  function handleVisibleClick() {
    // boardCardClick()
    setUser((prv) => ({ ...prv, visible: true }));
    setPage("whiteboard");
    console.log("board", board);
    setWhiteboard(board);
  }
  function handleInvisibleClick() {
    // boardCardClick()
    setUser((prv) => ({ ...prv, visible: false }));
    setPage("whiteboard");
    console.log("board", board);
    setWhiteboard(board);
  }

  return (
    <>
      <div className={styles.boardCard} onClick={boardCardClick}>
        <h2>{board.name}</h2>
      </div>
      <AskVisibilityModel
        open={openModel}
        setOpen={setOpenModel}
        handleVisibleClick={handleVisibleClick}
        handleInvisibleClick={handleInvisibleClick}
      />
    </>
  );
}
