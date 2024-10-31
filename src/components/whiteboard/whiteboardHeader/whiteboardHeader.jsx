import React, { useContext, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { BoardContext } from "../../../context/boardContext";
import styles from "./whiteBoardHeader.module.css";
// import { URL } from "../../context/appContext";
import BoardUserList from "./boardUserList";
import ChatBox from "../chats/chatBox";
import PeerProvider from "../../../context/peerContext";
import api from "../../../services/api";
import { BsFillChatLeftDotsFill } from "react-icons/bs";

const WhiteboardHeader = () => {
  const { user } = useContext(AppContext);
  const { whiteboard } = useContext(BoardContext);
  const [showChatBox, setShowChatBox] = useState(false);

  // function addUser() {
  //     let email = prompt("Enter Email");
  //     console.log(email, whiteboard, user);
  //     if (email) {
  //         // fetch(URL + "whiteboard/addUser", {
  //         //     method: "PATCH",
  //         //     headers: {
  //         //         "Content-Type": "application/json",
  //         //     },
  //         //     body: JSON.stringify({
  //         //         boardId: whiteboard._id,
  //         //         userEmail: email,
  //         //     }),
  //         // })
  //         api.patch('whiteboard/addUser', {
  //             boardId: whiteboard._id,
  //             userEmail: email,
  //         })
  //             .then((res) => {
  //                 if (res.status === 200) {
  //                     alert("User Added");
  //                 }
  //                 console.log(res.data)

  //             })
  //             // .then((data) => {
  //             //     console.log(data);
  //             // })
  //             .catch((err) => {
  //                 console.error("Error adding user: ", err);
  //                 alert("Something went wrong!");
  //             });
  //     }
  // }

  return (
    <div className={styles.header}>
      <h4>{whiteboard?.name}</h4>
      <div className={styles.box2}>
        {/* <h4 style={{ marginRight: '20px' }}>{user.name}</h4> */}
        {/* <button
                    style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        border: "2px solid blueviolet",
                        cursor: "pointer",
                    }}
                    onClick={addUser}
                >
                    Add User
                </button> */}
        <BoardUserList />
        <button
          style={
            showChatBox
              ? {
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "var(--primary-50)",
                  color: "var(--primary-400)",
                }
              : {}
          }
          onClick={() => setShowChatBox((prv) => !prv)}
        >
          <BsFillChatLeftDotsFill />
        </button>
        <PeerProvider>{showChatBox && <ChatBox />}</PeerProvider>
      </div>
    </div>
  );
};

export default WhiteboardHeader;
