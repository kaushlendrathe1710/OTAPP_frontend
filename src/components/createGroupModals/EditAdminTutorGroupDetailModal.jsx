import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  memo,
  useRef,
} from "react";
import toast from "react-hot-toast";
import { useClickOutside } from "../../hooks/useClickOutside";
import userContext from "../../context/userContext";
import styles from "../../styles/createGroupModal.module.scss";
import glassStyles from "../../styles/glass.module.scss";
import groupChatStyles from "../../styles/groupChat.module.scss";
import chatStyles from "../../styles/chat.module.scss";
import AddUserCard from "../Chat/AddUserCard";
import List from "../list/List";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import api from "../../services/api";
import { useQuery } from "react-query";
import AddAdmins from "../list/AddAdmins";
import { useNavigate } from "react-router-dom";
import AddTutors from "../list/AddTutors";

function EditGroupModal({
  group,
  conversation: initialConversation,
  getSingleConversation = () => {},
  users,
  onSave,
  closeModal,
  handleSave,
}) {
  const navigate = useNavigate();
  const { userData: user, socket } = useContext(userContext);
  const modalRef = useRef();
  const [selectedUserType, setSelectedUserType] = useState("admin");

  const canEditGroup =
    user.userType === "Super-Admin" || user.userType === "Admin" ? true : false;

  const { data } = useQuery({
    queryKey: ["admin-tutor-group-conversation", initialConversation?._id],
    queryFn: () => getSingleConversation(initialConversation?._id),
    refetchOnWindowFocus: false,
  });

  const [conversation, setConversation] = useState(initialConversation);
  const [loading, setLoading] = useState({
    isGroupNameUpdating: false,
    isGroupDescriptionUpdating: false,
    isRemovingAdmin: false,
    isDeletingGroup: false,
  });
  const [groupMetaValues, setGroupMetaValues] = useState({
    groupName: conversation?.groupName,
    groupDescription: conversation?.groupDescription,
    canEditGroupName: false,
    canEditGroupDescription: false,
  });
  const [addAdminsModalVisibility, setAddAdminsModalVisibility] =
    useState(false);
  const [addTutorsModalVisibility, setAddTutorsModalVisibility] =
    useState(false);
  const [alreadySelectedAdminIds, setAlreadySelectedAdminIds] = useState([]);
  const [alreadySelectedTutorIds, setAlreadySelectedTutorIds] = useState([]);

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

  useEffect(() => {
    if (data) {
      setConversation(data);
      setAlreadySelectedAdminIds(data?.adminParticipants?.map((a) => a._id));
      setAlreadySelectedTutorIds(data?.tutorParticipants?.map((a) => a._id));
    }

    return () => {
      setAddAdminsModalVisibility(false);
      setAddTutorsModalVisibility(false);
    };
  }, [data]);

  useEffect(() => {
    if (initialConversation) {
      setConversation(initialConversation);
      setGroupMetaValues((prev) => ({
        ...prev,
        groupName: initialConversation.groupName,
        groupDescription: initialConversation.groupDescription,
      }));
      setAlreadySelectedAdminIds(
        initialConversation?.adminParticipants?.map((a) => a._id)
      );
      setAlreadySelectedTutorIds(
        initialConversation?.tutorParticipants?.map((a) => a._id)
      );
    }
  }, [initialConversation]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGroupMetaValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const onUserTypeSelected = (userType) => {
    console.log(userType);
    setSelectedUserType(userType);
    // if (userType === "admin") {
    // } else {
    //     setSelectedUserType("tutorParticipants");
    // }
    // if (userType === "admin") {
    //     setfilteredUsers(allAdmins);
    // } else if (userType === "tutor") {
    //     setfilteredUsers(allTutors);
    // }
  };

  const handleUpdateGroupName = useCallback(async () => {
    if (!conversation) return;
    if (groupMetaValues.groupName === conversation.groupName) {
      setGroupMetaValues((prev) => ({
        ...prev,
        canEditGroupName: false,
      }));
      return;
    }
    if (groupMetaValues.groupName.length < 3)
      return toast.error("Group name must be atleast 3 characters long");
    try {
      setLoading((prev) => ({ ...prev, isGroupNameUpdating: true }));
      // in data we get the updated group name
      const { data: updatedGroupName } = await api.patch(
        `/admin-tutor-group-conversation/update-group-name`,
        {
          group_id: conversation._id,
          groupName: groupMetaValues.groupName,
        }
      );
      socket.emit("admin_tutor_group_name_update", {
        group_id: conversation._id,
        updatedGroupName,
      });
      setConversation((prev) => ({ ...prev, groupName: updatedGroupName }));
      setGroupMetaValues((prev) => ({
        ...prev,
        canEditGroupName: false,
        groupName: updatedGroupName,
      }));
    } catch (error) {
      console.log("this error occured while updating group name: ", error);
      toast.error("Something went wrong while updating group name");
    } finally {
      setLoading((prev) => ({ ...prev, isGroupNameUpdating: false }));
    }
  }, [groupMetaValues, conversation]);

  const handleUpdateGroupDescription = useCallback(async () => {
    if (!conversation) return;
    if (groupMetaValues.groupDescription === conversation.groupDescription) {
      setGroupMetaValues((prev) => ({
        ...prev,
        canEditGroupDescription: false,
      }));
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, isGroupDescriptionUpdating: true }));
      // in data we get the updated group description
      const { data: updatedGroupDescription } = await api.patch(
        `/admin-tutor-group-conversation/update-group-description`,
        {
          group_id: conversation._id,
          groupDescription: groupMetaValues.groupDescription,
        }
      );
      socket.emit("admin_tutor_group_description_update", {
        group_id: conversation._id,
        updatedGroupDescription,
      });
      setConversation((prev) => ({
        ...prev,
        groupDescription: updatedGroupDescription,
      }));
      setGroupMetaValues((prev) => ({
        ...prev,
        canEditGroupDescription: false,
        groupDescription: updatedGroupDescription,
      }));
    } catch (error) {
      console.log(
        "this error occured while updating group description: ",
        error
      );
      toast.error("Something went wrong while updating group description");
    } finally {
      setLoading((prev) => ({ ...prev, isGroupDescriptionUpdating: false }));
    }
  }, [groupMetaValues, conversation]);

  const handleAddAdmins = useCallback(
    async (selectedAdmins = []) => {
      if (!conversation) return;
      try {
        setLoading((prev) => ({ ...prev, isAddingAdmins: true }));
        const { data: updatedGroup } = await api.post(
          `/admin-tutor-group-conversation/add-admins`,
          {
            group_id: conversation._id,
            admin_ids: selectedAdmins.map((a) => a._id),
          }
        );
        socket.emit("admin_tutor_group_add_new_admins", updatedGroup);
        setConversation(updatedGroup);
        setAddAdminsModalVisibility(false);
      } catch (error) {
        console.log("this error occured while adding admins: ", error);
        toast.error("Something went wrong while adding admins");
      } finally {
        setLoading((prev) => ({ ...prev, isAddingAdmins: false }));
      }
    },
    [conversation]
  );
  const handleAddTutors = useCallback(
    async (selectedTutors = []) => {
      if (!conversation) return;
      try {
        console.log("Add tutors", selectedTutors);
        setLoading((prev) => ({ ...prev, isAddingTutors: true }));
        const { data: updatedGroup } = await api.post(
          `/admin-tutor-group-conversation/add-tutors`,
          {
            group_id: conversation._id,
            tutor_ids: selectedTutors.map((a) => a._id),
          }
        );
        socket.emit("admin_tutor_group_add_new_tutors", updatedGroup);
        setConversation(updatedGroup);
        setAddTutorsModalVisibility(false);
      } catch (error) {
        console.log("this error occured while adding admins: ", error);
        toast.error("Something went wrong while adding admins");
      } finally {
        setLoading((prev) => ({ ...prev, isAddingTutors: false }));
      }
    },
    [conversation]
  );

  const handleRemoveAdmin = useCallback(
    async (admin) => {
      if (!conversation) return;

      if (admin.userType == "Tutor") {
        try {
          setLoading((prev) => ({ ...prev, isRemovingTutor: true }));
          const { data } = await api.patch(
            `/admin-tutor-group-conversation/remove-tutor`,
            {
              group_id: conversation._id,
              tutor_id: admin._id,
            }
          );
          socket.emit("admin_tutor_group_delete_tutor", {
            group_id: conversation._id,
            tutor_id: admin._id,
          });
        } catch (error) {
          console.log("this error occured while removing admin: ", error);
          toast.error("Something went wrong while removing admin");
        } finally {
          setLoading((prev) => ({ ...prev, isRemovingTutor: false }));
        }
      } else {
        try {
          setLoading((prev) => ({ ...prev, isRemovingAdmin: true }));
          const { data } = await api.patch(
            `/admin-tutor-group-conversation/remove-admin`,
            {
              group_id: conversation._id,
              admin_id: admin._id,
            }
          );
          socket.emit("admin_tutor_group_delete_admin", {
            group_id: conversation._id,
            admin_id: admin._id,
          });
        } catch (error) {
          console.log("this error occured while removing admin: ", error);
          toast.error("Something went wrong while removing admin");
        } finally {
          setLoading((prev) => ({ ...prev, isRemovingAdmin: false }));
        }
      }
      console.log(admin);
    },
    [conversation]
  );
  const handleRemoveTutor = useCallback(
    async (tutor) => {
      if (!conversation) return;
      try {
        setLoading((prev) => ({ ...prev, isRemovingTutor: true }));
        const { data } = await api.patch(
          `/admin-tutor-group-conversation/remove-tutor`,
          {
            group_id: conversation._id,
            tutor_id: tutor._id,
          }
        );
        socket.emit("admin_tutor_group_delete_admin", {
          group_id: conversation._id,
          tutor_id: tutor._id,
        });
      } catch (error) {
        console.log("this error occured while removing admin: ", error);
        toast.error("Something went wrong while removing admin");
      } finally {
        setLoading((prev) => ({ ...prev, isRemovingTutor: false }));
      }
    },
    [conversation]
  );

  const handleDeleteGroup = useCallback(async () => {
    if (!conversation) return;

    try {
      if (window.confirm("Are you sure you want to delete this group?")) {
        setLoading((prev) => ({ ...prev, isDeletingGroup: true }));
        const { data } = await api.patch(
          `/admin-tutor-group-conversation/delete`,
          {
            group_id: conversation._id,
          }
        );
        socket.emit("admin_tutor_group_delete_group", conversation._id);
        toast.success("Group deleted successfully");
      }
    } catch (error) {
      console.log("this error occured while deleting group: ", error);
      toast.error("Something went wrong while deleting group");
    } finally {
      setLoading((prev) => ({ ...prev, isDeletingGroup: false }));
    }
  }, [conversation]);

  const renderItem = ({ item, index, data }) => {
    return (
      <AddUserCard
        listUser={item}
        showCheckbox={false}
        showRemoveBtn={
          canEditGroup &&
          item?.userType !== "Super-Admin" &&
          item?._id !== user._id
        }
        onRemoveBtnClick={() => handleRemoveAdmin(item)}
        disabledRemoveBtn={loading.isRemovingAdmin}
      />
    );
  };

  function keyExtractor({ item, index }) {
    return item._id;
  }

  return (
    <>
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
            <h2 className={styles.modalTitle}>{conversation?.groupName}</h2>
            <button className="btnDark btn--small" onClick={closeModal}>
              Close
            </button>
          </div>
          <div className={groupChatStyles.groupCreateFormContainer}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                value={groupMetaValues.groupName}
                onChange={handleInputChange}
                readOnly={
                  !groupMetaValues.canEditGroupName ||
                  loading.isGroupNameUpdating
                }
              />
              {canEditGroup && (
                <button
                  data-icon-type="top-right"
                  onClick={() =>
                    groupMetaValues.canEditGroupName
                      ? handleUpdateGroupName()
                      : setGroupMetaValues((prev) => ({
                          ...prev,
                          canEditGroupName: !prev.canEditGroupName,
                        }))
                  }
                  disabled={loading.isGroupNameUpdating}
                >
                  {!groupMetaValues.canEditGroupName ? (
                    <AiOutlineEdit />
                  ) : (
                    "Done"
                  )}
                </button>
              )}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="description">Description</label>
              <textarea
                id="groupDescription"
                name="groupDescription"
                value={groupMetaValues.groupDescription}
                onChange={handleInputChange}
                readOnly={
                  !groupMetaValues.canEditGroupDescription ||
                  loading.isGroupDescriptionUpdating
                }
              ></textarea>
              {canEditGroup && (
                <button
                  data-icon-type="top-right"
                  onClick={() =>
                    groupMetaValues.canEditGroupDescription
                      ? handleUpdateGroupDescription()
                      : setGroupMetaValues((prev) => ({
                          ...prev,
                          canEditGroupDescription:
                            !prev.canEditGroupDescription,
                        }))
                  }
                  disabled={loading.isGroupDescriptionUpdating}
                >
                  {!groupMetaValues.canEditGroupDescription ? (
                    <AiOutlineEdit />
                  ) : (
                    "Done"
                  )}
                </button>
              )}
            </div>
          </div>
          <div className={styles.modalField}>
            {/* <div className={styles.adminTypeSelection}> */}
            <div className={styles.buttonsWrapper}>
              {canEditGroup && (
                <>
                  <button
                    className="btnSecondary btn--medium"
                    onClick={() => setAddAdminsModalVisibility(true)}
                  >
                    Add Admins
                  </button>
                  <button
                    className="btnSecondary btn--medium"
                    onClick={() => setAddTutorsModalVisibility(true)}
                  >
                    Add Tutors
                  </button>
                </>
              )}
            </div>
            {/* </div> */}
            <div className={chatStyles.tabsContainer}>
              <button
                key={1}
                className={chatStyles.tab}
                data-active={selectedUserType === "admin"}
                onClick={() => onUserTypeSelected("admin")}
              >
                Admins
              </button>
              <button
                key={2}
                className={chatStyles.tab}
                data-active={selectedUserType === "tutor"}
                onClick={() => onUserTypeSelected("tutor")}
              >
                Tutors
              </button>
            </div>

            <List
              className={styles.userList}
              data={
                selectedUserType === "admin"
                  ? conversation.adminParticipants
                  : selectedUserType === "tutor"
                  ? conversation.tutorParticipants
                  : []
              }
              renderItem={renderItem}
              // onEndReached={onEndReached}
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
              bottomPadding={0}
            />

            {/* <h3 style={{ fontSize: "1.25rem", marginTop: "0.75rem" }}>Admins</h3>
                        <List
                            className={styles.userList}
                            data={conversation?.adminParticipants}
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
                                        End of users
                                    </p>
                                );
                            }}
                            bottomPadding={0}
                        /> */}

            {canEditGroup && (
              <button
                className="btnDanger btn--small"
                onClick={handleDeleteGroup}
                // disabled={disabledRemoveBtn}
              >
                <AiOutlineDelete />
                Delete Group
              </button>
            )}
          </div>
        </div>

        {addAdminsModalVisibility && (
          <AddAdmins
            visibility={addAdminsModalVisibility}
            handleCloseModal={() => setAddAdminsModalVisibility(false)}
            alreadySelectedAdminIds={alreadySelectedAdminIds}
            onAddAdminsClick={handleAddAdmins}
            chatType={"admin-tutor-group"}
          />
        )}
        {addTutorsModalVisibility && (
          <AddTutors
            visibility={addTutorsModalVisibility}
            handleCloseModal={() => setAddTutorsModalVisibility(false)}
            alreadySelectedAdminIds={alreadySelectedTutorIds}
            onAddTutorsClick={handleAddTutors}
          />
        )}
      </div>
    </>
  );
}
export default memo(EditGroupModal);
