import React, { useEffect, useState } from "react";
import styles from "../../styles/ForwardModal.module.scss";
import { CHAT_TYPE } from "../../../constants/helpers";
import api from "../../services/api";

const ForwardModal = ({
  message,
  users,
  onCancel,
  conversation,
  chatType,
  handleSendForwardMessage,
  socket,
  user,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState(user);

  const handleUserClick = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((c) => c !== user));
    } else {
      console.log(user);
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  useEffect(() => {
    // if (conversation) {
    //     setSelectedUsers(conversation?.adminParticipants);
    //     setSelectedUsers([...selectedUsers, ...conversation?.studentParticipants]);
    // }
    console.log(users);
  }, [message, conversation, users]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredContacts = users?.filter((user) => {
    let fullName = "";
    if (user?.groupName) {
      fullName = user?.groupName;
    } else if (user?.tutor?.name) {
      fullName = user?.tutor?.name;
    } else if (user?.admin?.name) {
      fullName = user?.admin1?.name;
    } else if (user?.student?.name) {
      fullName = user?.student?.name;
    }
    // const fullName = `${user.groupName}`;
    const searchTextLower = searchText?.toLowerCase();
    const fullNameLower = fullName?.toLowerCase();

    return (
      fullNameLower?.slice(0, 5)?.includes(searchTextLower) ||
      fullNameLower?.slice(-5)?.includes(searchTextLower)
    );
  });

  const handleSend = async () => {
    handleSendForwardMessage(message, selectedUsers, socket, user);

    onCancel();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.forwardModal}>
        <div className={styles.forwardModalHeader}>
          <span>Forward Message</span>
          <button onClick={onCancel}>Cancel</button>
        </div>
        <div className={styles.forwardModalBody}>
          <div className={styles.message}>
            <span>{message?.textContent}</span>
          </div>

          <div className={styles.searchBar}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by Group Name or Number"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>

          <div className={styles.users}>
            {searchText !== "" ? (
              filteredContacts?.map(
                (user, i) =>
                  user?._id !== conversation?._id && (
                    <div
                      key={i}
                      className={`${styles.user} ${
                        selectedUsers.includes(user) ? styles.selected : ""
                      }`}
                      onClick={() => handleUserClick(user)}
                    >
                      <span>
                        {user?.groupName ||
                          user?.tutor?.name ||
                          user?.student?.name ||
                          (user?.admin1?._id === userData?._id
                            ? user?.admin1?.name
                            : user?.admin2?.name) ||
                          user?.chatName}
                      </span>
                    </div>
                  )
              )
            ) : (
              <>
                {users?.map(
                  (user, i) =>
                    user?._id !== conversation?._id && (
                      <div
                        key={i}
                        className={`${styles.user} ${
                          selectedUsers.includes(user) ? styles.selected : ""
                        }`}
                        onClick={() => handleUserClick(user)}
                      >
                        <span>
                          {user?.groupName ||
                            user?.tutor?.name ||
                            user?.student?.name ||
                            (user?.admin1?._id === userData?._id
                              ? user?.admin1?.name
                              : user?.admin2?.name) ||
                            user?.chatName}
                        </span>
                      </div>
                    )
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles.forwardModalFooter}>
          <button onClick={handleSend} disabled={selectedUsers.length === 0}>
            Send ({selectedUsers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
