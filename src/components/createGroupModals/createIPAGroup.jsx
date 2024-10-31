import React, { useState, useEffect, memo, useContext } from "react";
import { toast } from "react-hot-toast";
import { useClickOutside } from "../../hooks/useClickOutside";
import AddUserCard from "../Chat/AddUserCard";
import List from "../list/List";
import userContext from "../../context/userContext";
import chatStyles from "../../styles/chat.module.scss";
import api from "../../services/api";
import styles from "../../styles/createGroupModal.module.scss";
import glassStyles from "../../styles/glass.module.scss";
import groupChatStyles from "../../styles/groupChat.module.scss";
import { useQuery } from "react-query";

async function fetch_all_admins_by_userTypes(from) {
  let url = `/admin/get-all-admins-by-usertypes?userTypesArray=Super-Admin,Admin`;
  const res = await api.get(url);
  return res.data;
}
async function fetch_all_students() {
  let url = `/student/get-all-in-admin-with-name-id`;
  const res = await api.get(url);
  return res.data;
}

const CreateIPAGroup = ({ closeModal, onEndReached }) => {
  const { userData: user, socket } = useContext(userContext);

  const modalRef = useClickOutside(closeModal);

  const [allAdmins, setAllAdmins] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [studentGroupDescription, setstudentGroupDescription] = useState("");
  const [tutorGroupDescription, settutorGroupDescription] = useState("");
  const [loading, setLoading] = useState({ isNewGroupCreating: false });
  const [selectedUserType, setSelectedUserType] = useState("admin");
  const [filteredUsers, setfilteredUsers] = useState(allAdmins);

  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  const { data: admins } = useQuery({
    queryKey: "allAdmins",
    queryFn: () => fetch_all_admins_by_userTypes(),
    refetchOnWindowFocus: false,
  });
  const { data: students } = useQuery({
    queryKey: "allStudents",
    queryFn: () => fetch_all_students(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (admins?.length > 0) {
      let modifiedAdmins = admins.map((admin) => ({
        ...admin,
        isSelected:
          admin.userType === "Super-Admin" ||
          admin.userType === "Admin" ||
          user._id === admin._id
            ? true
            : false,
      }));
      let modifiedStudents = students?.map((student) => ({
        ...student,
        isSelected: false,
      }));
      let selectedAdmins = modifiedAdmins.filter((item) => item.isSelected);
      setSelectedAdmins(selectedAdmins);
      setAllAdmins(modifiedAdmins);
      setfilteredUsers(modifiedAdmins);
      setAllStudents(modifiedStudents);
    }
  }, [admins, students]);

  const handleToggleSelectUser = (paramsUser) => {
    if (
      paramsUser?.userType === "Super-Admin" ||
      paramsUser?.userType === "Admin" ||
      paramsUser?.userType === "Co-Admin" ||
      paramsUser?.userType === "Sub-Admin"
    ) {
      const mapped = allAdmins.map((item) =>
        paramsUser._id === item._id
          ? { ...item, isSelected: !item.isSelected }
          : item
      );
      let selectedAdmins = mapped.filter((item) => item.isSelected);
      setSelectedAdmins(selectedAdmins);
      setAllAdmins(mapped);
      setfilteredUsers(mapped);
    } else {
      const mapped = allStudents.map((item) =>
        paramsUser._id === item._id
          ? { ...item, isSelected: !item.isSelected }
          : item
      );
      let selectedStudents = mapped.filter((item) => item.isSelected);
      setSelectedStudents(selectedStudents);
      setAllStudents(mapped);
      setfilteredUsers(mapped);
    }
    // console.log(mapped);
    // console.log(allAdmins);
    // getSelectedData(selectedAdmins);
  };

  // const handleToggleSelectUser = (paramsUser) => {
  //     const mapped = allUsers.map((item) => (paramsUser._id === item._id ? { ...item, isSelected: !item.isSelected } : item));
  //     let selectedAdmins = mapped.filter((item) => item.isSelected);
  //     setSelectedUsers(selectedAdmins);
  //     setAllUsers(mapped);
  //     // getSelectedData(selectedAdmins);
  // };

  const onUserTypeSelected = (userType) => {
    console.log(userType);
    setSelectedUserType(userType);
    if (userType === "admin") {
      setfilteredUsers(allAdmins);
    } else if (userType === "student") {
      setfilteredUsers(allStudents);
    }
  };

  // const filteredUsers = allAdmins.filter((user) => {
  //     if (selectedUserType === "admin") {
  //         return user.userType === "Super-Admin";
  //     } else if (selectedUserType === "student") {
  //         return user.role === "student";
  //     }
  //     return false;
  // });

  const handleCreateGroup = async () => {
    if (!groupName && !studentGroupDescription && !tutorGroupDescription) {
      toast.error("Please fill the group name and description");
    } else if (!groupName) {
      toast.error("Please fill the group name");
    } else if (!studentGroupDescription && !tutorGroupDescription) {
      toast.error("Please fill the group Description");
    } else {
      if (selectedAdmins.length < 2) {
        toast.error("Select minimum two participants");
      } else {
        let adminParticipants = selectedAdmins.map((admin) => admin._id);
        let studentParticipants = selectedStudents.map(
          (student) => student._id
        );
        const data = {
          groupName: groupName,
          ipaStudentGroupDescription: studentGroupDescription,
          ipaTutorGroupDescription: tutorGroupDescription,
          adminParticipants: adminParticipants,
          createdBy: user?._id,
        };
        try {
          setLoading((prev) => ({ ...prev, isNewGroupCreating: true }));
          const res = await api.post("/ipa-group/create", data);
          socket.emit("ipa_create_new_group", res.data);
          toast.success("Group created successfully");
          closeModal();
        } catch (err) {
          console.log(
            "This error occured while creating a admin-admin-group",
            err
          );
          toast.error(
            "Something went wrong while creating a group, please try again later"
          );
        } finally {
          setLoading((prev) => ({ ...prev, isNewGroupCreating: false }));
        }
      }
    }
  };

  const renderItem = ({ item, index, data }) => {
    return (
      <AddUserCard
        listUser={item}
        isSelected={item?.isSelected}
        showCheckbox={true}
        showRemoveBtn={false}
        onClick={() =>
          item.userType === "Super-Admin" || user._id === item._id
            ? () => {}
            : handleToggleSelectUser(item)
        }
        onRemoveBtnClick={() => console.log("remove clicked")}
      />
    );
  };

  function keyExtractor({ item, index }) {
    return item._id;
  }

  return (
    <div className={`${glassStyles.modalWrapper}`}>
      <div
        style={{
          maxWidth: "620px",
          padding: "1rem 1.2rem 1.5rem 1.25rem",
        }}
        className={glassStyles.modalBoxWrapper}
        ref={modalRef}
      >
        <div className={styles.header}>
          <h2 className={styles.modalTitle}>Create Group</h2>
          <button className="btnDark btn--small" onClick={closeModal}>
            Close
          </button>
        </div>
        <div className={groupChatStyles.groupCreateFormContainer}>
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="groupName">Group Name:</label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              placeholder="Enter Group Name"
            />
          </div>
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="studentGroupDescription">
              Student Group Description:
            </label>
            <textarea
              id="studentGroupDescription"
              name="studentGroupDescription"
              value={studentGroupDescription}
              onChange={(e) => setstudentGroupDescription(e.target.value)}
              required
              placeholder="Enter Group Description"
            ></textarea>
          </div>
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="tutorGroupDescription">
              Tutor Group Description:
            </label>
            <textarea
              id="tutorGroupDescription"
              name="tutorGroupDescription"
              value={tutorGroupDescription}
              onChange={(e) => settutorGroupDescription(e.target.value)}
              required
              placeholder="Enter Group Description"
            ></textarea>
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <div className={chatStyles.tabsContainer}>
            <button
              key={1}
              className={chatStyles.tab}
              data-active={selectedUserType === "admin"}
              onClick={() => onUserTypeSelected("admin")}
            >
              Admins
            </button>
          </div>
        </div>
        {filteredUsers.length > 0 ? (
          <List
            className={styles.userList}
            data={filteredUsers}
            renderItem={renderItem}
            onEndReached={onEndReached}
            keyExtractor={keyExtractor}
            itemSize={60}
            ListFooterComponent={() => {
              return (
                <p
                  style={{
                    fontSize: "0.875rem",
                    textAlign: "center",
                    marginTop: "0.75rem",
                  }}
                >
                  End of users
                </p>
              );
            }}
            maxHeight={"300px !important"}
            style={{ maxHeight: "300px !important" }}
            bottomPadding={0}
          />
        ) : (
          <p>No users found.</p>
        )}

        {/* <ul className={styles.userList}> */}
        {/* Make a option for user to select between admins and students and then render list component accordingly  */}

        {/* <h3 style={{ fontSize: "1.25rem", marginTop: "0.75rem" }}>Admins</h3>

                <List
                    className={styles.userList}
                    data={allAdmins}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    itemSize={60}
                    ListFooterComponent={() => {
                        return (
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    textAlign: "center",
                                    marginTop: "0.75rem",
                                }}
                            >
                                End of admins
                            </p>
                        );
                    }}
                    bottomPadding={0}
                /> */}
        <div className={styles.modalActions}>
          <button
            className="btnDanger btn--medium"
            onClick={closeModal}
            disabled={loading.isNewGroupCreating}
          >
            Cancel
          </button>
          <button
            className="btnPrimary btn--medium"
            onClick={handleCreateGroup}
            disabled={loading.isNewGroupCreating}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(CreateIPAGroup);
