import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/ChatAdmin.module.scss";
import defaultImage from "../../assets/defaultImage.jpg";
import userContext from "../../context/userContext";

const RecentUsers = ({
  data,
  conversation,
  setConversation,
  joinRoom,
  setToggleClass,
  getConversation,
}) => {
  let user;
  // console.log(conversation);
  const [name, setName] = useState("");
  const { userData, socket } = useContext(userContext);

  // console.log(data);
  if (data?.student == null && data?.chatName == "Student_Admin_Conversation") {
    // console.log(null);
    // continue;
    user = undefined;
  } else {
    if (data?.username) {
      // console.log(null);
      user = data;
    } else if (data[0]) {
      // console.log(null);
      user = data[0].admin;
    } else if (data?.student) {
      // console.log(null);
      user = data.student;
    } else if (data[0]?.student) {
      // console.log(null);
      user = data[0].student;
    } else if (data?.tutor) {
      // console.log(null);
      user = data.tutor;
    } else if (data?.admin) {
      user = data.admin;
    } else if (data?.admins) {
      user = data;
    } else if (data?.data?.studentIpa) {
      user = data?.data.studentIpa;
    } else if (data?.data?.tutorIpa) {
      user = data?.data?.tutorIpa;
    } else {
      console.log(data);
      user = data;
    }
  }
  // console.log(userData?.name);
  const setData = () => {
    // localStorage.setItem("username", userData?.name);
    // console.log(user);
    // console.log(user?.username == userData?.name, " ", user?.username, " ", userData?.name);

    if (user?.username == undefined && user?.adminName == undefined) {
      setName(user?.name);
      // console.log(user);
    } else if (user?.username == userData?.name) {
      setName(user?.adminName);
      // console.log(name);
    } else if (user?.adminName == userData?.name) {
      setName(user?.username);
      // console.log(name);
    } else if (user?.admin?.name) {
      setName(user?.admin?.name);
      // console.log(user?.admin?.name);
    }
    // console.log(name);
  };
  // console.log
  useEffect(() => {
    setData();
  }, []);

  const setUserData = () => {
    let user;
    console.log("here");
    if (data?.student) {
      user = data.student;
    } else if (data?.tutor) {
      user = data.tutor;
    } else if (data?.admin) {
      user = data;
    } else if (data?.admins) {
      user = data;
    } else if (data?.data?.studentIpa) {
      user = data?.data.studentIpa;
    } else if (data?.data?.tutorIpa) {
      user = data?.data?.tutorIpa;
    } else {
      user = data;
    }

    if (user) {
      if (user?.admin) {
        console.log(data);
        setConversation(data);
        setToggleClass(true);
        if (user?.user == userData?._id) {
          console.log(user.admin?._id);
          getConversation(user?.admin._id);
        } else {
          console.log("gyugugyuguyguy giuuiubbibi", user?._id);
          getConversation(user?.user);
        }
      } else {
        console.log(data);
        setConversation(data);
        setToggleClass(true);
        getConversation(user?._id);
      }
    } else {
      throw new Error("Not getting data while click on recent chat user list.");
    }
  };

  // console.log(user);
  return (
    <div
      onClick={setUserData}
      className={styles.sideUserMainCard}
      style={{
        backgroundColor:
          conversation?._id === data._id ? "rgba(255, 255, 255, 0.5)" : "",
      }}
    >
      {user !== undefined && (
        <>
          <div
            style={{
              backgroundColor: `${
                user?.onlineStatus === true ? "#4bb543" : "rgb(221, 95, 95)"
              }`,
            }}
            className={styles.onlineStatus}
          >
            {user?.onlineStatus === true ? "Active" : "InActive"}
          </div>
          <div className={styles.userInfo}>
            <img
              className={styles.UserImage}
              src={defaultImage}
              alt="userImage"
            />
            <div className={styles.nameLastMsg}>
              <h4>
                {user?.groupName}
                {/* {console.log(user)} */}
                {/* {user?.admin?.name} */}
                {name}
                {/* {user?.username === userData?.name ? user?.adminName : user?.username} */}
                {/* {user?.adminName} */}
              </h4>
              {/* <h4>{data._id}</h4> */}
              {/* <h4>{user._id===data._id ? "True" : "False"}</h4> */}
              {data?.latestMessage && (
                <p>
                  {data?.latestMessage?.messageType === "File"
                    ? "File"
                    : data?.latestMessage?.textContent?.length < 10
                    ? data?.latestMessage?.textContent
                    : data?.latestMessage?.textContent?.slice(0, 10) + "..."}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentUsers;
