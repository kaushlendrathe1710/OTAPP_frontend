import React from "react";
import styles from "../../styles/ChatAdmin.module.scss";
import user from "../../assets/defaultImage.jpg";

const AllUsersCard = ({
  data,
  getConversation,
  setClickedButton,
  setToggleClass,
  conversation,
}) => {
  const setUserData = () => {
    console.log("data: ", data);
    getConversation(data._id);
    setClickedButton("RecentChat");
    setToggleClass(true);
  };
  // console.log(data);

  return (
    <div onClick={setUserData} className={styles.sideUserMainCard}>
      <div
        style={{
          backgroundColor: `${
            data?.onlineStatus === true ? "#4bb543" : "rgb(221, 95, 95)"
          }`,
        }}
        className={styles.onlineStatus}
      >
        {data?.onlineStatus === true ? "Active" : "InActive"}
      </div>
      <div className={styles.userInfo}>
        <img className={styles.UserImage} src={user} alt="userImage" />
        <div className={styles.nameLastMsg}>
          <h4>
            {data?.name}
            {data?.groupName}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default AllUsersCard;
