import React, { useEffect, useState } from "react";
import styles from "../../styles/chatComponents.module.scss";
import defaultimage from "../../assets/defaultImage.jpg";
import api, { getAccessToken } from "../../services/api";
import { IoSend } from "react-icons/io5";
import { toast } from "react-hot-toast";

const ForwardModal = ({
  userData,
  forwardMsg,
  setForwardMsg,
  forwardModalState,
  setForwardModalState,
  project,
  socket,
  conversationBetween,
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [tempUser, setTempUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [projectStatus, setProjectStatus] = useState([]);

  const getAllUsers = async () => {
    let res;
    if (conversationBetween === "admin-student") {
      res = await api.get(
        `/student/get-all-students-in-admin?page=${1}&limit=${10}`,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
    } else if (conversationBetween === "admin-admin") {
      res = await api.get(
        `/admin/get-all-in-admin-with-name-id?page=${1}&limit=${10}`,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
    } else if (conversationBetween === "admin-tutor") {
      res = await api.get(
        `/tutor/get-all-tutors-in-admin?page=${1}&limit=${10}`,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
    } else if (conversationBetween === "admin-student-project") {
      try {
        // res = await api.get(`/student/get-all-students-in-admin?page=${1}&limit=${10}`, {
        //     headers: {
        //         Authorization: getAccessToken(),
        //     },
        // });
        setProjectStatus(true);
        res = await api.post(
          "/admin-tutor-conversations/single-Pconversation",
          {
            tutorId: userData?._id,
            project: project,
          }
        );

        var result = [];
        console.log(res.data);
        result[0] = res.data;
        const newData = result.map((item) => {
          return {
            ...item,
            isChecked: false,
          };
        });

        setTempUser(result);

        setAllUsers(result);

        return;
        // for (var i in res.data) result[0];
      } catch (e) {
        console.log(e);
      }
    } else if (conversationBetween === "admin-group") {
      res = await api.get("admin-group/get-all-groups?page=1&limit=10", {
        header: { Authorization: getAccessToken() },
      });
      console.log(res);
    }

    // console.log(res.data);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  function handelChange(index) {
    const tempData = [];
    allUsers.map((item, i) => {
      if (index === i) {
        if (item.isChecked === true) {
          tempData.push({ ...item, isChecked: false });
        } else {
          tempData.push({ ...item, isChecked: true });
        }
      } else {
        if (item.isChecked === true) {
          tempData.push({ ...item, isChecked: true });
        } else {
          tempData.push({ ...item, isChecked: false });
        }
      }
    });
    let selectedStudentsName;
    tempData.forEach((item) => {
      if (item.isChecked === true) {
        selectedStudentsName.push(item.name);
      }
      if (projectStatus) {
        selectedStudentsName.push(item.projectId);
      }
    });

    setSelectedUser(selectedStudentsName);
    // console.log(tempData);
    setAllUsers(tempData);
  }

  const handelForward = async () => {
    let user_ids = [];
    allUsers.forEach((item) => {
      if (item.isChecked === true) {
        user_ids.push(item._id);
      }
    });

    let messageData = forwardMsg.map((item) => {
      if (item.messageType == "Text") {
        return {
          messageType: "Text",
          textContent: item.textContent,
        };
      } else {
        return {
          messageType: "File",
          fileContent: item.fileContent,
        };
      }
    });

    let res;
    if (
      conversationBetween === "admin-student" ||
      conversationBetween === "admin-student-project"
    ) {
      const data = {
        student_ids: user_ids,
        sender: userData._id,
        messageData,
      };

      res = await api.post("/admin-student-message/forward-message", data);

      user_ids.forEach((item, i) => {
        let msg_to_be_forwarded = res.data.slice(
          i * user_ids.length,
          user_ids.length * (i + 1)
        );
        socket.emit("student_admin_send_message", {
          room_id: item,
          data: msg_to_be_forwarded,
        });
      });
    } else if (conversationBetween === "admin-admin") {
      const data = {
        admin_ids: user_ids,
        sender: userData._id,
        messageData,
      };

      res = await api.post("/admin-admin-message/forward-message", data);

      user_ids.forEach((item, i) => {
        let msg_to_be_forwarded = res.data.slice(
          i * user_ids.length,
          user_ids.length * (i + 1)
        );
        socket.emit("admin_admin_send_message", {
          room_id: item,
          data: msg_to_be_forwarded,
        });
      });
    } else if (conversationBetween === "admin-tutor") {
      const data = {
        tutor_ids: user_ids,
        sender: userData._id,
        messageData,
      };

      res = await api.post("/admin-tutor-message/forward-message", data);

      user_ids.forEach((item, i) => {
        let msg_to_be_forwarded = res.data.slice(
          i * user_ids.length,
          user_ids.length * (i + 1)
        );
        socket.emit("tutor_admin_send_message", {
          room_id: item,
          data: msg_to_be_forwarded,
        });
      });
    } else if (conversationBetween === "admin-student-project") {
      console.log(project);
      let formData = {
        messageType: "Text",
        senderId: userData._id,
        conversationId: project,
        content: {
          textContent: messageData,
        },
      };

      responseData = await api.post(
        "/admin-student-message/send-message",
        formData
      );
      console.log(responseData);
    }

    toast.success("Message Forwarded Successfully", {
      position: "top-right",
    });
    setForwardMsg([]);
    setForwardModalState(false);
    setSelectedUser([]);
    setAllUsers(tempUser);
  };

  return (
    <div
      className={`${styles.forwardParentWrapper} ${
        forwardModalState === true && styles.toggleforwardParentWrapper
      }`}
    >
      <div className={styles.ForwardWrapper}></div>
      <div className={styles.ForwardContainer}>
        <div className={styles.ForwardContainerHeader}>
          <button
            onClick={() => {
              setForwardModalState(false);
            }}
            className={styles.closeForwardBtn}
          >
            &times;
          </button>
          <h6>Forward To</h6>
          <div className={styles.forwardActionContainer}>
            <label htmlFor="forward">Select All</label>
            <input
              type="checkbox"
              name="forward"
              id="forward"
              value={""}
              onChange={(e) => {
                setAllUsers((prev) =>
                  prev.map((item) => {
                    if (e.target.checked) {
                      setSelectedUser((prev) => [...prev, item.name]);
                    } else {
                      setSelectedUser([]);
                    }
                    return { ...item, isChecked: e.target.checked };
                  })
                );
              }}
            />
          </div>
        </div>
        <div className={styles.mainContainer}>
          {allUsers.map((info, i) => {
            return (
              <div key={info._id} className={styles.usersContainer}>
                <div className={styles.userInfo}>
                  <img src={defaultimage} alt="user image" />
                  <h6>
                    {info.name === undefined ? info.projectId : info.name}
                  </h6>
                </div>
                <input
                  type="checkbox"
                  checked={info.isChecked}
                  value={info.name || ""}
                  onChange={() => handelChange(i)}
                />
              </div>
            );
          })}
        </div>
        {selectedUser.length > 0 && (
          <div className={styles.forwardFooter}>
            <div className={styles.nameContainer}>
              {selectedUser.map((data, i) => {
                console.log(selectedUser);
                return <h5 key={i}>{i <= 3 ? data + "," : "..."}</h5>;
              })}
            </div>

            <button onClick={handelForward}>
              <IoSend />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForwardModal;
