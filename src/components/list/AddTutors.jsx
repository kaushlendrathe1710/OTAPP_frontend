import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import userContext from "../../context/userContext";
import { AddUserCard } from "../Chat";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "../../styles/createGroupModal.module.scss";
import glassStyles from "../../styles/glass.module.scss";
import List from "./List";
import api from "../../services/api";

async function fetch_all_tutors() {
  let url = `/tutor/get-all-in-admin-with-name-id`;
  const res = await api.get(url);
  return res.data;
}

const AddTutors = ({
  alreadySelectedAdminIds = [],
  visibility = false,
  handleCloseModal = () => {},
  onAddTutorsClick = async () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  const { data } = useQuery({
    queryKey: "allTutors",
    queryFn: () => fetch_all_tutors(),
    refetchOnWindowFocus: false,
  });
  const modalRef = useRef();

  const [searchTerm, setSearchTerm] = useState("");

  const [allTutors, setAllTutors] = useState([]);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setsearched] = useState(allTutors);

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
      let filterSelectedTutors = [];
      for (let i = 0; i < admins.length; i++) {
        if (!alreadySelectedAdminIds?.includes(admins[i]?._id)) {
          filterSelectedTutors.push({ ...admins[i], isSelected: false });
        }
      }
      setAllTutors(filterSelectedTutors);
      setsearched(filterSelectedTutors);
    }
  }, [data]);

  const handleToggleSelectUser = (paramsUser) => {
    const mapped = allTutors.map((item) =>
      paramsUser._id === item._id
        ? { ...item, isSelected: !item.isSelected }
        : item
    );
    let selectedTutors = mapped.filter((item) => item.isSelected);
    setSelectedTutors(selectedTutors);
    setAllTutors(mapped);
    // getSelectedData(selectedTutors);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filter = allTutors.filter((tutor) =>
      tutor?.name.toLowerCase().includes(value.toLowerCase())
    );
    // setAllTutors(filter);
    setsearched(filter);
    // onSearch(value);
  };

  async function handleAddTutors() {
    try {
      console.log("selectedTutors: ", selectedTutors);
      setIsLoading(true);
      await onAddTutorsClick(selectedTutors);
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
            <h2 className={styles.modalTitle}>Add Tutors</h2>
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
            data={allTutors}
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
              onClick={handleAddTutors}
              disabled={isLoading}
            >
              Add Tutors
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default memo(AddTutors);
