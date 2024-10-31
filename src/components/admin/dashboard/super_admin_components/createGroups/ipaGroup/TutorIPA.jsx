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

const TutorIPA = ({ tutorIPAInfo, Data }) => {
  // console.log(tutorIPAInfo);
  const [ipaData, setIpaData] = useState({
    groupName: tutorIPAInfo.groupName,
    description: tutorIPAInfo.groupDescription,
    admin_ids: tutorIPAInfo.admins,
    tutor_ids: tutorIPAInfo.tutors,
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
  const [allTutors, setAllTutors] = useState([]);
  const [selectedSubAdmins, setSelectedSubAdmins] = useState([]);
  const [selectedTutors, setSelectedTutors] = useState([]);
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
    fetchAllTutors();
  }, []);

  const fetchAllTutors = async () => {
    const res = await api.get("/tutor/get-all-in-admin-with-name-id", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    setAllTutors(
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
    var ele = document.getElementById("Modal2");
    ele.style.display = "none";
  };
  // console.log(Data);
  const handelFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      group_id: tutorIPAInfo._id,
      // groupName: ipaData.groupName,
      // groupDescription: ipaData.description,
      user_ids: selectedTutors.map((item) => item.id),
      admin_ids: selectedSubAdmins.map((item) => item.id),
      type: "tutor_ipa",
    };

    console.log(data);

    try {
      const res = await api.put("/ipa-group/update", data, {
        headers: {
          Authorization: getAccessToken(),
        },
      });
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
      {/* <div className={`${styles.IPAWrapper}  ${toggleForm === true && styles.toggleClass}`} id="Modal2">
                <div className={styles.IPAContainer}> */}
      {/* <button onClick={() => change("none")} className={`${styles.btnClose} ${styles.CountryBtnClose}`}>
                        &times;
                    </button> */}
      {/* <h5>Tutor IPA</h5> */}
      <form>
        <div className={styles.ipaFormContainer} style={{ margin: "10px" }}>
          <label htmlFor="groupName">Group Name</label>
          <input
            // disabled
            name="groupName"
            onChange={handelInputChange}
            value={
              targetInput === "groupName" && onChange === true
                ? groupINfo.groupName
                : tutorIPAInfo.groupName
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
                : tutorIPAInfo.groupDescription
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
          <label htmlFor="groupName">Tutors</label>
          <Select
            isMulti
            value={selectedTutors}
            onChange={(value) => setSelectedTutors(value)}
            options={allTutors}
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

export default TutorIPA;
