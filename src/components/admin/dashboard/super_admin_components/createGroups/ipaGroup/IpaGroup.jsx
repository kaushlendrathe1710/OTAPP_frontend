import React, { useContext, useState } from "react";
import styles from "../../../../../../styles/addData.module.scss";
import glass from "../../../../../../styles/glass.module.scss";
import api, { getAccessToken } from "../../../../../../services/api";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { fetchIPAGroups, handleFetchedStudentGroups, onError } from "./logic";
import StudentIPA from "./StudentIPA";
import TutorIPA from "./TutorIPA";
import userContext from "../../../../../../context/userContext";

const IpaGroup = () => {
  const [toggleForm, setToggleForm] = useState(false);
  const [searchGroup, setSearchGroup] = useState("");
  const [groupINfo, setGroupInfo] = useState({
    groupName: "",
    studentDescription: "",
    tutorDescription: "",
  });
  const [allIPAGroups, setAllIPAGroups] = useState([]);
  const { userData } = useContext(userContext);
  const [studentIPAInfoModal, setStudentIPAInfoModal] = useState(false);
  const [tutorIPAInfoModal, setTutorIPAInfoModal] = useState(false);
  const [studentIPAInfo, setStudentIPAInfo] = useState("");
  const [StudentIPAGroupID, setStudentIPAGroupID] = useState("");
  const [tutorIPAInfo, setTutorIPAInfo] = useState("");

  useQuery("get-ipa-groups", fetchIPAGroups, {
    onSuccess: ({ data }) => handleFetchedStudentGroups(data, setAllIPAGroups),
    refetchOnWindowFocus: false,
    onError,
  });

  const handelForm = () => {
    toggleForm === true ? setToggleForm(false) : setToggleForm(true);
  };

  const handleToggle = (e) => {
    console.log(e);
    studentIPAInfoModal === true
      ? setStudentIPAInfoModal(false)
      : setStudentIPAInfoModal(true);
    tutorIPAInfoModal === true
      ? setTutorIPAInfoModal(false)
      : setTutorIPAInfoModal(true);
  };

  if (studentIPAInfoModal) {
    var ele = document.getElementById("Modal");
    // ele.style.display = "inline";
  }

  const handelFormData = (e) => {
    setGroupInfo({ ...groupINfo, [e.target.name]: e.target.value });
  };

  const handelFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      groupName: groupINfo.groupName,
      ipaTutorGroupDescription: groupINfo.tutorDescription,
      ipaStudentGroupDescription: groupINfo.studentDescription,
      createdBy: userData._id,
      adminParticipants: [userData._id],
    };

    try {
      const res = await api.post("/ipa-group/create", data, {
        headers: {
          Authorization: getAccessToken(),
        },
      });
      setAllIPAGroups(allIPAGroups.concat(res.data));
      setToggleForm(false);
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
  };

  const handelSearch = (e) => {
    setSearchGroup(e.target.value);
  };

  var data = allIPAGroups.filter((x) => {
    if (searchGroup === "") {
      return x;
    } else {
      return x.student_ipa.groupName.toLowerCase().includes(searchGroup);
    }
  });

  var data = allIPAGroups.filter((x) => {
    if (searchGroup === "") {
      return x;
    } else {
      return x.tutor_ipa.groupName.toLowerCase().includes(searchGroup);
    }
  });

  return (
    <>
      <div className={styles.AllCountryRelatedWrapper}>
        <h2 style={{ textAlign: "center" }}>Create IPA Group</h2>
        <div className={styles.topContainer}>
          <div className={styles.searchContainer}>
            <label htmlFor="searchGroup">Search:</label>
            <input
              onChange={handelSearch}
              value={searchGroup}
              placeholder="Search Group"
              className={styles.searchCountry}
              type="text"
            />
          </div>
          <button onClick={handelForm} className={styles.createCountryButton}>
            + Create Group
          </button>
        </div>
        <div className={glass.tableWrapper}>
          <table className={glass.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>S No.</th>
                <th>IPA Student</th>
                <th>IPA Tutor</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td
                      onClick={() => {
                        setStudentIPAInfoModal(true);
                        setStudentIPAGroupID(item.student_ipa);
                        setStudentIPAInfo(item?.student_ipa);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {item.student_ipa?.groupName}
                    </td>
                    <td
                      onClick={() => {
                        setTutorIPAInfoModal(true);
                        setTutorIPAInfo(item?.tutor_ipa);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {item.tutor_ipa?.groupName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className={`${styles.createFormMainContainer} ${
          toggleForm === true && styles.toggleClass
        }`}
      >
        <div className={styles.createdCountryWrapper}></div>
        <button
          onClick={() => setToggleForm(false)}
          className={`${styles.btnClose} ${styles.CountryBtnClose}`}
        >
          &times;
        </button>
        <div
          className={`${styles.formCountryContainer} ${styles.formContainer}`}
        >
          <form onSubmit={handelFormSubmit} className={styles.entryForm}>
            <h2>Create Group</h2>
            <div className={styles.inputContainer}>
              <label htmlFor="groupName">Group Name</label>
              <input
                required
                onChange={handelFormData}
                name="groupName"
                value={groupINfo.groupName}
                type="text"
                placeholder="Enter Group Name"
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="description">IPA Student Description</label>
              <textarea
                onChange={handelFormData}
                value={groupINfo.studentDescription}
                name="studentDescription"
                id="description"
                placeholder="Description"
                rows="4"
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="description">IPA Tutor Description</label>
              <textarea
                onChange={handelFormData}
                value={groupINfo.tutorDescription}
                name="tutorDescription"
                id="description"
                placeholder="Description"
                rows="4"
              />
            </div>
            <button className={styles.btnAdd} type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      {studentIPAInfoModal && (
        <StudentIPA
          studentIPAInfo={studentIPAInfo}
          ID={StudentIPAGroupID}
          handleToggle={true}
        />
      )}

      {tutorIPAInfoModal && <TutorIPA tutorIPAInfo={tutorIPAInfo} />}
    </>
  );
};

export default IpaGroup;
