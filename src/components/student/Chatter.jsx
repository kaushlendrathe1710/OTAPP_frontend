import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/ChatAdmin.module.scss";
import glass from "../../styles/glass.module.scss";
// import { Button } from "antd";

import api, { getAccessToken, SOCKET_BASE_URL } from "../../services/api";

import toast from "react-hot-toast";

import userContext from "../../context/userContext";
// import CameraComponent from "../../../../../chatComponents/CameraComponent";

const Chatter = () => {
  const [recentChatUsers, setRecentChatUsers] = useState([]);

  // let user = JSON.parse(localStorage.getItem("User"));
  const { userData, socket } = useContext(userContext);
  // const userData = user

  const [Students, setGroupStudentRoom] = useState();
  const [Admins, setGroupAdminRoom] = useState();
  const [data, setData] = useState();
  const [conversation, setConversation] = useState();

  const getData = async () => {
    const res = await api.get("/chatter-convo/get-all-sub-conversations", {
      header: { Authorization: getAccessToken() },
    });
    setConversation(res.data);
    // console.log(conversation);
  };

  useEffect(() => {
    getData();
  }, []);

  const getStudents = async () => {
    const res1 = await api.get("student/get-all-in-admin-forFilter", {
      header: { Authorization: getAccessToken() },
    });
    const res2 = await api.get("admin/get-all-admin/Sub-Admin", {
      header: { Authorization: getAccessToken() },
    });
    // res1 = res1.data;
    setGroupStudentRoom(res1.data);
    setGroupAdminRoom(res2.data);
    var res3 = [{}];
    var res4 = [{}];
    Admins.map((item, index) => {
      res4[index] = item;
    });

    var Chatterdata = [];

    Students.map((item, index) => {
      res3[index] = item;
    });
    setData(res3);
    const res5 = res3.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });

    const res6 = res4.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    // console.log(res5);
    for (let i = 0, j = 0; i < res5.length; i++, j++) {
      if (j == res6.length) {
        j = 0;
      }
      const data = {
        groupName: `Chatter ${i}`,
        groupDescription: "Chatter",
        student_ids: [res5[i]._id],
        admin_ids: [res6[j]._id],
      };

      try {
        // joinRoom(res5[i]._id)
        // setIsLastChat(false);
        // pageRef.current = 1;
        const { data } = await api.post(
          "/chatter-convo/get-subAdmin-conversation",
          {
            studentId: res5[i]._id,
            subAdmin: res6[i]._id,
          }
        );
        let is_conversation_exist = recentChatUsers.some(
          (item) => item._id === data._id
        );
        if (!is_conversation_exist) {
          setRecentChatUsers((prev) => [...prev, data]);
        }
        Chatterdata[i] = data[0];
        // console.log(data);

        toast.success("Group Created SuccessFully", {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
      } catch (err) {
        const error = err?.response;
        let message = "";
        if (error) {
          if (error.status === 422) {
            const len = error.data.validationError.length;
            error.data.validationError.forEach(
              (item, i) =>
                (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
            );
          } else if (error.status === 403) {
            message = error.data.message;
          } else if (error.status === 409) {
            message = error.data.message;
          }
        }
        if (message) {
          toast.error(message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          });
        } else {
          toast.error(err.message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          });
        }
      }
    }
    // setConversation(Chatterdata);
  };
  // console.log(conversation);

  // const handelSearch = () => {
  // console.log(conversation);
  // };

  return (
    <>
      <div className={styles.AllCountryRelatedWrapper}>
        <h2 style={{ textAlign: "center" }}>Chatters</h2>
        <div className={styles.topContainer}>
          <button onClick={getStudents} className={styles.createCountryButton}>
            + Create Group
          </button>
        </div>
        <div className={glass.tableWrapper}>
          <table className={glass.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>S No.</th>
                <th>Student</th>
                <th>Chatter</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {conversation?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.student.name}</td>
                    <td>{item.subAdmin.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Chatter;
