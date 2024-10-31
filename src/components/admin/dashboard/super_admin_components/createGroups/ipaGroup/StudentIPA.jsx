import React, { useEffect, useState } from "react";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiFillEdit,
  AiTwotoneDelete,
} from "react-icons/ai";
import { BsInfoLg } from "react-icons/bs";
import styles from "../../../../../../styles/ipaGroup.module.scss";
import Select from "react-select";
import api, { getAccessToken } from "../../../../../../services/api";
import toast from "react-hot-toast";

const StudentIPA = ({ studentIPAInfo, Data }) => {
  // console.log(studentIPAInfo);
  const [ipaData, setIpaData] = useState({
    groupName: studentIPAInfo.groupName,
    description: studentIPAInfo.groupDescription,
    admin_ids: studentIPAInfo.admins,
    student_ids: studentIPAInfo.students,
  });
  const [onChange, setOnChange] = useState(false);
  const [targetInput, setTargetInput] = useState("");
  const [allAdmins, setAllAdmins] = useState([]);
  const [groupINfo, setGroupInfo] = useState({
    groupName: "",
    description: "",
    action: "",
    stu_id: "",
    subAd_id: "",
  });
  const [allStudents, setAllStudents] = useState([]);
  const [selectedSubAdmins, setSelectedSubAdmins] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [toggleForm, setToggleForm] = useState(false);
  const [NID, SETID] = useState([]);
  // console.log(ID);
  // SETID(ID);

  // useEffect(() => {
  //     document.getElementById("mainSidebar").style.zIndex = "0";
  //     document.getElementById("mainSidebarButton").style.zIndex = "0";
  //     document.body.style.overflow = "hidden";

  //     return () => {
  //         document.body.style.overflow = "auto";
  //         document.getElementById("mainSidebar").style.zIndex = "100";
  //         document.getElementById("mainSidebarButton").style.zIndex = "101";
  //     };
  // }, []);

  const fetchAllAdmins = async () => {
    const res = await api.get("/admin/get-all-in-admin-with-name-id", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    setAllAdmins(
      res.data.map((item) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      }))
    );
  };

  useEffect(() => {
    fetchAllAdmins();
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    const res = await api.get("/student/get-all-in-admin-with-name-id", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    setAllStudents(
      res.data.map((item) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      }))
    );
  };

  const handelInputChange = (e) => {
    setOnChange(true);
    setTargetInput(e.target.name);
    setIpaData({ ...ipaData, [e.target.name]: e.target.value });
    setGroupInfo({ ...groupINfo, [e.target.name]: e.target.value });
  };
  const handelForm = () => {
    toggleForm === true ? setToggleForm(false) : setToggleForm(true);
  };

  const change = (e) => {
    var ele = document.getElementById("Modal");
    ele.style.display = "none";
  };
  // console.log(Data);
  const handelFormSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    const data = {
      group_id: studentIPAInfo._id,
      // groupName: ipaData.groupName,
      // groupDescription: ipaData.description,
      user_ids: selectedStudents.map((item) => item.id),
      type: "student_ipa",
      admin_ids: selectedSubAdmins.map((item) => item.id),
      // type: "student_ipa",
    };

    console.log(data);

    try {
      const res = await api.put("/ipa-group/update", data, {
        headers: {
          Authorization: getAccessToken(),
        },
      });
      console.log(res);
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
          console.log(error);
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

  return (
    <>
      {/* <div className={`${styles.IPAWrapper}  ${toggleForm === true && styles.toggleClass}`} id="Modal">
                <div className={styles.IPAContainer}> */}
      {/* <button onClick={() => change("none")} className={`${styles.btnClose} ${styles.CountryBtnClose}`}>
                        &times;
                    </button> */}
      <form>
        <div
          className={styles.IPAWrapper.ipaFormContainer}
          style={{ margin: "10px" }}
        >
          <label htmlFor="groupName">Group Name</label>
          <input
            // disabled
            name="groupName"
            onChange={handelInputChange}
            value={
              targetInput === "groupName" && onChange === true
                ? groupINfo.groupName
                : studentIPAInfo.groupName
            }
            type="text"
          />
        </div>
        <div className={styles.ipaFormContainer} style={{ margin: "10px" }}>
          <label htmlFor="groupName">Group Description</label>
          <input
            // disabled
            name="description"
            onChange={handelInputChange}
            value={
              targetInput === "description" && onChange === true
                ? groupINfo.description
                : studentIPAInfo.groupDescription
            }
            type="text"
          />
        </div>
        <div className={styles.ipaFormContainer} style={{ margin: "10px" }}>
          <label htmlFor="groupName">Admins</label>
          <Select
            isMulti
            value={selectedSubAdmins}
            onChange={(value) => setSelectedSubAdmins(value)}
            options={allAdmins}
            styles={{
              control: (baseStyles, state) => {
                return {
                  ...baseStyles,
                  borderRadius: "1.5rem",
                };
              },
            }}
          />
        </div>
        <div className={styles.ipaFormContainer} style={{ margin: "10px" }}>
          <label htmlFor="groupName">Students</label>
          <Select
            isMulti
            value={selectedStudents}
            onChange={(value) => setSelectedStudents(value)}
            options={allStudents}
            styles={{
              control: (baseStyles, state) => {
                return {
                  ...baseStyles,
                  borderRadius: "1.5rem",
                };
              },
            }}
          />
        </div>
        <button
          onClick={handelFormSubmit}
          style={{ margin: "10px" }}
          type="primary"
        >
          Submit
        </button>
      </form>
      {/* </div>
            </div> */}
    </>
  );
};

export default StudentIPA;
