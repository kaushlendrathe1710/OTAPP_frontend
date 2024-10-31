import React, { useState, useEffect } from "react";
import styles from "../../../../../../styles/addData.module.scss";
import glass from "../../../../../../styles/glass.module.scss";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiFillEdit,
  AiTwotoneDelete,
} from "react-icons/ai";
import api, { getAccessToken } from "../../../../../../services/api";
import Delete from "../Delete";
import toast from "react-hot-toast";
import Select from "react-select";
import { useQuery } from "react-query";
import {
  fetchCoAdmins,
  fetchStudentGroups,
  fetchStudents,
  fetchSubAdmins,
  handleFetchedData,
  handleFetchedStudentGroups,
  onError,
} from "../TutorGroup/logic";
import { BsInfoLg } from "react-icons/bs";
import GroupInfo from "../GroupInfo";

const TutorGroups = () => {
  const [toggleForm, setToggleForm] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);
  const [searchGroup, setSearchGroup] = useState("");
  const [deleteData, setDeleteData] = useState({
    header: "",
    name: "",
    id: "",
  });
  const [groupINfo, setGroupInfo] = useState({
    groupName: "",
    description: "",
    action: "",
    id: "",
  });
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [selectedSubAdmins, setSelectedSubAdmins] = useState([]);
  const [selectedCoAdmins, setSelectedCoAdmins] = useState([]);
  const [allTutorGroups, setAllTutorGroups] = useState([]);
  const [singleGroupInfo, setSingleGroupInfo] = useState();
  const [groupType, setGroupType] = useState("");

  const { data: allTutors } = useQuery(
    "get-tutors-with-name-id",
    fetchStudents,
    {
      refetchOnWindowFocus: false,
      onError,
      select: handleFetchedData,
    }
  );

  const { data: allSubAdmins } = useQuery(
    "get-sub-admins-with-name-id",
    fetchSubAdmins,
    {
      refetchOnWindowFocus: false,
      onError,
      select: handleFetchedData,
    }
  );

  const { data: allCoAdmins } = useQuery(
    "get-co-admins-with-name-id",
    fetchCoAdmins,
    {
      refetchOnWindowFocus: false,
      onError,
      select: handleFetchedData,
    }
  );

  useQuery("get-tutor-groups", fetchStudentGroups, {
    onSuccess: ({ data }) =>
      handleFetchedStudentGroups(data, setAllTutorGroups),
    refetchOnWindowFocus: false,
    onError,
  });

  const handelForm = () => {
    toggleForm === true ? setToggleForm(false) : setToggleForm(true);
  };

  const handelFormData = (e) => {
    setGroupInfo({ ...groupINfo, [e.target.name]: e.target.value });
  };

  const handelFormSubmit = async (e) => {
    e.preventDefault();

    const data = {
      groupName: groupINfo.groupName,
      groupDescription: groupINfo.description,
      tutor_ids: selectedTutors.map((item) => item.id),
      admin_ids: [
        ...selectedSubAdmins.map((item) => item.id),
        ...selectedCoAdmins.map((item) => item.id),
      ],
    };

    if (groupINfo.action === "edit") {
      try {
        const res = await api.put(
          `/tutor-group/update/`,
          { ...data, group_id: groupINfo.id },
          {
            headers: {
              Authorization: getAccessToken(),
            },
          }
        );
        toast.success("Group Edit Successfully", {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
        setToggleForm(false);
        setGroupInfo({ groupName: "", description: "", action: "", id: "" });
        const updatedData = allTutorGroups.map((item) => {
          if (groupINfo.id === item._id) {
            return {
              ...item,
              ...res.data,
            };
          } else {
            return item;
          }
        });
        setAllTutorGroups(updatedData);
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
    } else {
      try {
        const res = await api.post("/tutor-group/create", data, {
          headers: {
            Authorization: getAccessToken(),
          },
        });
        setAllTutorGroups(allTutorGroups.concat(res.data));
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
    }
  };

  const handelSearch = (e) => {
    setSearchGroup(e.target.value);
  };

  const data = allTutorGroups.filter((x) => {
    if (searchGroup === "") {
      return x;
    } else {
      return x.groupName.toLowerCase().includes(searchGroup);
    }
  });

  const editDataAction = (id, groupName, groupDescription, admins, tutors) => {
    setGroupInfo({
      groupName: groupName,
      description: groupDescription,
      id: id,
      action: "edit",
    });
    // console.log(admins)
    let sub_admins = [];
    let co_admins = [];
    admins.forEach((item) => {
      if (item.userType === "Co-Admin") {
        co_admins.push({ label: item.name, value: item.name, id: item._id });
      } else if (item.userType === "Sub-Admin") {
        sub_admins.push({ label: item.name, value: item.name, id: item._id });
      }
    });
    setSelectedSubAdmins(sub_admins);
    setSelectedCoAdmins(co_admins);
    setSelectedTutors(
      tutors.map((item) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      }))
    );
    setToggleForm(true);
  };

  const handelCloseModal = () => {
    setToggleForm(false);
    setGroupInfo({ groupName: "", description: "" });
    setSelectedTutors([]);
    setSelectedSubAdmins([]);
    setSelectedCoAdmins([]);
  };

  const toggleDeleteWrapper = (id, groupName) => {
    setDeleteData({
      header: "tutor Group",
      name: groupName,
      id: id,
    });
    setToggleDelete(true);
  };

  const toggleActiveInactive = async (id) => {
    const res = await api.patch(
      "/tutor-group/active-inactive",
      { group_id: id },
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    const updatedData = allTutorGroups.map((item) => {
      if (id === item._id) {
        return {
          ...item,
          isActive: !item.isActive,
        };
      } else {
        return item;
      }
    });
    setAllTutorGroups(updatedData);
    toast.success(res.data.message, {
      duration: 4000,
      position: "top-center",
      style: { border: "2px solid var(--success-color)" },
    });
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Create Tutor Group</h2>
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
      {/* <div className={styles.mainContainer}> */}
      <div className={glass.tableWrapper}>
        <table className={glass.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>S No.</th>
              <th>Group Name</th>
              <th>State</th>
              <th>Members</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {data.map((item, index) => {
              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.groupName}</td>
                  <td>{item.isActive === true ? "Active" : "Inactive"}</td>
                  <td>{item.admins?.length + item.tutors?.length}</td>
                  <td>
                    {item.isActive === true ? (
                      <abbr title="Hide">
                        <AiFillEye
                          onClick={() => toggleActiveInactive(item._id)}
                          className={styles.actionIcons}
                        />
                      </abbr>
                    ) : (
                      <abbr title="Unhide">
                        <AiFillEyeInvisible
                          onClick={() => toggleActiveInactive(item._id)}
                          className={styles.actionIcons}
                        />
                      </abbr>
                    )}
                    <abbr title="Edit">
                      <AiFillEdit
                        onClick={() =>
                          editDataAction(
                            item._id,
                            item.groupName,
                            item.groupDescription,
                            item.admins,
                            item.tutors
                          )
                        }
                        className={styles.actionIcons}
                      />
                    </abbr>
                    <abbr title="Delete">
                      <AiTwotoneDelete
                        onClick={() =>
                          toggleDeleteWrapper(item._id, item.groupName)
                        }
                        className={`${styles.actionIcons} ${styles.trash}`}
                      />
                    </abbr>
                    <abbr title="Info">
                      <BsInfoLg
                        onClick={() => {
                          setToggleInfo(true);
                          setSingleGroupInfo(item);
                          setGroupType("Tutor Group");
                        }}
                        className={styles.actionIcons}
                      />
                    </abbr>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className={`${styles.createFormMainContainer} ${
          toggleForm === true && styles.toggleClass
        }`}
      >
        <div className={styles.createdCountryWrapper}></div>
        <button
          onClick={handelCloseModal}
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
              <label htmlFor="description">Description</label>
              <textarea
                onChange={handelFormData}
                value={groupINfo.description}
                name="description"
                id="description"
                placeholder="Description"
                rows="4"
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="students">Tutors</label>
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
            <div className={styles.inputContainer}>
              <label htmlFor="sub-admins">Sub-Admins</label>
              <Select
                isMulti
                value={selectedSubAdmins}
                onChange={(value) => setSelectedSubAdmins(value)}
                options={allSubAdmins}
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

            <div className={styles.inputContainer}>
              <label htmlFor="sub-admins">Co-Admins</label>
              <Select
                isMulti
                value={selectedCoAdmins}
                onChange={(value) => setSelectedCoAdmins(value)}
                options={allCoAdmins}
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
            <button className={styles.btnAdd} type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      <Delete
        valueProp={allTutorGroups}
        setValueProp={setAllTutorGroups}
        setToggleDelete={setToggleDelete}
        toggleDelete={toggleDelete}
        data={deleteData}
      />
      {toggleInfo && (
        <GroupInfo
          setSingleGroupInfo={setSingleGroupInfo}
          singleGroupInfo={singleGroupInfo}
          setToggleInfo={setToggleInfo}
          toggleInfo={toggleInfo}
          groupType={groupType}
        />
      )}
    </>
  );
};

export default TutorGroups;
