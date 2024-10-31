import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import userContext from "../../context/userContext";
import { AddUserCard } from "../Chat";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "../../styles/createGroupModal.module.scss";
import glassStyles from "../../styles/glass.module.scss";
import List from "./List";
import api from "../../services/api";

async function fetch_all_admins_by_userTypes(from) {
  console.log(from);

  let url =
    from === "admin-student-group"
      ? `/admin/get-all-admins-by-usertypes?userTypesArray=Super-Admin,Admin,Sub-Admin`
      : from === "admin-tutor-group"
      ? `/admin/get-all-admins-by-usertypes?userTypesArray=Super-Admin,Admin,Co-Admin`
      : `/admin/get-all-admins-by-usertypes?userTypesArray=Super-Admin,Admin,Sub-Admin,Co-Admin`;
  if (from == "ipa-tutor-group") {
    url = `/admin/get-all-admins-by-usertypes?userTypesArray=Super-Admin,Admin`;
  }
  const res = await api.get(url);
  return res.data;
}

const AddAdmins = ({
  alreadySelectedAdminIds = [],
  visibility = false,
  chatType = "group",
  handleCloseModal = () => {},
  onAddAdminsClick = async () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  const { data } = useQuery({
    queryKey: "allAdmins",
    queryFn: () => fetch_all_admins_by_userTypes(chatType),
    refetchOnWindowFocus: false,
  });
  const modalRef = useRef();

  const [allAdmins, setAllAdmins] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    return () => {
      //   document.body.style.overflow = "auto";
      //   document.getElementById("mainSidebar").style.zIndex = "100";
      //   document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  useEffect(() => {
    if (data) {
      let admins = data;
      let filterSelectedAdmins = [];
      for (let i = 0; i < admins.length; i++) {
        if (!alreadySelectedAdminIds?.includes(admins[i]?._id)) {
          filterSelectedAdmins.push({ ...admins[i], isSelected: false });
        }
      }
      setAllAdmins(filterSelectedAdmins);
    }
  }, [data]);

  const handleToggleSelectUser = (paramsUser) => {
    const mapped = allAdmins.map((item) =>
      paramsUser._id === item._id
        ? { ...item, isSelected: !item.isSelected }
        : item
    );
    let selectedAdmins = mapped.filter((item) => item.isSelected);
    setSelectedAdmins(selectedAdmins);
    setAllAdmins(mapped);
    // getSelectedData(selectedAdmins);
  };

  async function handleAddAdmins() {
    try {
      setIsLoading(true);
      await onAddAdminsClick(selectedAdmins);
    } catch (error) {
      console.log(
        "This error occured while addding new admins to the group: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

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
      />
    );
  };

  function keyExtractor({ item, index }) {
    return item._id;
  }
  return (
    visibility && (
      <div className={`${glassStyles.modalWrapper}`}>
        <div
          style={{
            maxWidth: "440px",
            padding: "1rem 1.2rem 1.5rem 1.25rem",
          }}
          className={glassStyles.modalBoxWrapper}
          ref={modalRef}
        >
          <div className={styles.header}>
            <h2 className={styles.modalTitle}>Add Admins</h2>
            <button
              className="btnDark btn--small"
              disabled={isLoading}
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>

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
            listStyle={{
              maxHeight: "640px",
            }}
            ListEmptyComponent={() => {
              return (
                <p
                  style={{
                    fontSize: "0.875rem",
                    textAlign: "center",
                    marginTop: "0.75rem",
                  }}
                >
                  No more Admins to Add
                </p>
              );
            }}
          />

          <div className={styles.modalActions}>
            <button
              className="btnDanger btn--medium"
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="btnPrimary btn--medium"
              onClick={handleAddAdmins}
              disabled={isLoading}
            >
              Add Admins
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default memo(AddAdmins);
