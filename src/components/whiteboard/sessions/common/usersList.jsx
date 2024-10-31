import React, { useState, useEffect } from "react";
import api, { getAccessToken } from "../../../../services/api";
import styles from "./usersList.module.css";

const users = [
  {
    _id: Math.random(),
    name: "Amit arya",
    email: "amit@gmail.com",
    userType: "admin",
  },
  {
    _id: Math.random(),
    name: "Amit arya",
    email: "amit@gmail.com",
    userType: "tutor",
  },
  {
    _id: Math.random(),
    name: "Amit arya",
    email: "amit@gmail.com",
    userType: "student",
  },
];

const UsersList = ({ userType, setParticipents }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      let page = 1,
        limit = 100;

      if (userType === "student") {
        const res = await api.get(
          `/student/get-all-in-admin-to-View?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: getAccessToken(),
            },
          }
        );
        // console.log(res.data)
        setList(res.data.students);
        setFilteredList(res.data.students);
        setLoading(false);
      } else if (userType === "tutor") {
        const res = await api.get(
          "/tutor/get-all-approved-tutorList-for-filter?page=1&limit=100",
          {
            headers: {
              Authorization: getAccessToken(),
            },
          }
        );
        // console.log(res.data);
        if (res.data) {
          setList(res?.data);
          setFilteredList(res?.data);
          setLoading(false);
        }
      } else if (userType === "admin") {
        const res = await api.get(`/admin/get-all-admin/All`, {
          headers: {
            Authorization: getAccessToken(),
          },
        });

        // console.log(res.data);
        if (res.data) {
          setList(res?.data);
          setFilteredList(res?.data);
          setLoading(false);
        }
      }
    }
    fetchUser();
    setLoading(true);
    return () => {};
  }, []);

  function listItemCheckHandler(e, user) {
    // console.log(e.target.checked)
    let seleted = e.target.checked;
    if (seleted) {
      // console.log(user)
      setParticipents((prv) => [...prv, user]);
    } else {
      setParticipents((prv) => {
        let users = prv.filter((prvv) => prvv._id !== user._id);
        return users;
      });
    }
  }

  function searchUser(e) {
    let searchTerm = e.target.value;
    // console.log(searchTerm)
    if (searchTerm.length > 1) {
      setFilteredList(
        list.filter((item) => {
          if (
            item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.email?.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return true;
          }
          return false;
        })
      );
    } else {
      setFilteredList(list);
    }
  }

  return (
    <div
      style={{ display: "block", width: "100%" }}
      className={styles.container}
    >
      <input
        onInput={searchUser}
        className={styles.userSearch}
        type="search"
        placeholder="Search User"
      />
      <ul className={styles.usersList}>
        {loading && (
          <p style={{ margin: "50px", textAlign: "center" }}>Loading...</p>
        )}
        {filteredList?.map((item) => (
          <li key={item._id}>
            <label>
              <input
                onChange={(e) => listItemCheckHandler(e, item)}
                type="checkbox"
              />
              <p>{item.name}</p>
              <p>{item.email}</p>
              <p>{item.userType}</p>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

const containerStyle = {
  width: "100%",
  display: "block",
};

export default UsersList;
