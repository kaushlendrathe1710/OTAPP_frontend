import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { Loader1 } from "../components/Loaders/Loader1";
import { Whiteboard } from "../components/whiteboard/Whiteboard";
import userContext from "../context/userContext";
import { useWhiteboard } from "../context/WhiteboardContext";
import studentStyles from "../styles/student.module.scss";
import utilStyles from "../styles/utils.module.scss";

export const WhiteboardRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  //   const location = window.location;

  const userData = useContext(userContext)?.userData;
  const socket = useContext(userContext)?.socket;
  const setCurrentRoomId = useWhiteboard()?.setCurrentRoomId;

  const [loading, setLoading] = useState(true);

  const whiteboard = useWhiteboard();

  useEffect(() => {
    if (userData) {
      // console.log("roomId: " + roomId);
      setCurrentRoomId(roomId);
      // whiteboard?.setJoinedUsers((prev) => [...prev, { ...userData }]);

      let data = { roomId: roomId, userData: userData?.name };
      socket?.emit("wb-userJoined", data);
    }
  }, [userData, socket]);

  useEffect(() => {
    // console.log("whiteboard", whiteboard);

    socket?.on("wb-userIsJoined", (data) => {
      if (data.success) {
        // whiteboard?.setJoinedUsers([]);
        whiteboard?.setJoinedUsers(data?.users);
      } else {
        console.log("*user joining error*");
      }
    });

    socket?.on("wb-allUsers", (users) => {
      // whiteboard?.setJoinedUsers([]);
      whiteboard?.setJoinedUsers(users);
      toast.success(`${users[users.length - 1].userData} joined`);
      // console.log("users: ", users);
    });

    return () => {
      socket?.off("wb-allUsers");
      socket?.off("wb-userIsJoined");
    };
    // whiteboard?.joinedUsers
  }, []);

  useEffect(() => {
    console.log("joined users: ", whiteboard?.joinedUsers);
  }, [whiteboard?.joinedUsers]);

  if (!userData)
    return (
      <div className={studentStyles.loaderWrapper}>
        <div>
          <h2 className={utilStyles.headingLg}>Login to join whiteboard</h2>
          <br />
          <Link
            to="/"
            className="btnDark btn--medium"
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            Login
          </Link>
        </div>
      </div>
    );

  return (
    <div>
      {/* <h1>Room: {roomId}</h1> */}
      <Whiteboard />
    </div>
  );
};
