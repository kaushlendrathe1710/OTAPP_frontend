import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import { BoardContext } from "../../../context/boardContext";
import userContext from "../../../context/userContext";
import AskVisibilityModel from "../utils/askVisibilityModel";
import styles from "./boardCard.module.css";

export default function BoardCard({ board, setPage }) {
  const { setWhiteboard, whiteboard } = useContext(BoardContext);
  // const { setUser, user } = useContext(AppContext);
  const userCtx = useContext(userContext);
  const user = userCtx?.userData;
  const setUser = userCtx?.setUserData;

  const navigate = useNavigate();

  const [openModel, setOpenModel] = useState(false);

  const boardCardClick = () => {
    // console.log("usertype", user);
    if (user.userType === "Super-Admin") {
      setOpenModel(true);
    } else {
      handleVisibleClick();
    }
  };

  function handleVisibleClick() {
    // boardCardClick()
    setUser((prv) => ({ ...prv, visible: true }));
    // setPage("whiteboard");
    setWhiteboard(board);
    navigate(board._id);
    // console.log("board", board);
  }
  function handleInvisibleClick() {
    // boardCardClick()
    setUser((prv) => ({ ...prv, visible: false }));
    // setPage("whiteboard");
    // console.log("board", board);
    navigate(board._id);
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
