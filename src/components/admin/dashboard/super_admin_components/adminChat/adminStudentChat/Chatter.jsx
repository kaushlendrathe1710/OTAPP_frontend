import React from "react";
import styles from "../../../../../../styles/ChatAdmin.module.scss";
import defaultImage from "../../../../../../assets/defaultImage.jpg";

const Chatter = ({
  data,
  conversation,
  setConversation,
  joinRoom,
  setToggleClass,
}) => {
  let user;
  // console.log(data);
  if (data?.student) {
    user = data.student;
  } else if (data[0]?.student) {
    user = data[0].student;
  } else if (data?.tutor) {
    user = data.tutor;
  } else if (data?.admin) {
    user = data.admin;
  } else if (data?.admins) {
    user = data;
  } else if (data?.studentIpa) {
    user = data.studentIpa;
  } else {
    // user = data;
  }
  // console.log(user);

  const setUserData = () => {
    // console.log(user._id , "<<<in recent user")
    if (user === undefined) {
    } else {
      if (user._id) {
        joinRoom(user._id);
      } else if (user.data._id) {
        joinRoom(user._id);
      } else if (user.student_ipa._id) {
        console.log("Here  ");
        joinRoom(user.student_ipa._id);
      }
      setConversation(data);
      setToggleClass(true);
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
          {" "}
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
                {/* {user?..groupName} */}
                {user?.name}
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

export default Chatter;
