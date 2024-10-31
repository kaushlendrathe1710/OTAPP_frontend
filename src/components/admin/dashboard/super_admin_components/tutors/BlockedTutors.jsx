import React, { useState, useEffect, useRef } from "react";
import glassStyles from "../../../../../styles/glass.module.scss";
import styles from "../../../../../styles/student.module.scss";
import utilStyles from "../../../../../styles/utils.module.scss";
import { useQuery } from "react-query";
import api, { getAccessToken } from "../../../../../services/api";
import { Loader1 } from "../../../../Loaders/Loader1";
import { BiSearch } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  handleUnapprove,
  handleDeletePermanently,
  searchTutors,
  handleDeleteTutors,
} from "./ApprovedTutors";
import { ConfirmModal } from "../../../../Modal/ConfirmModal";
import { SubjectsModal } from "../../../../Modal/SubjectsModal";
import Pagination from "../../../../pagination/Pagination";

const BlockedTutors = ({ isCoAdminComponent, isAdminComponent }) => {
  const searchTimeoutRef = useRef(null);
  const perPageValuesArray = [20, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(perPageValuesArray[0]);
  const [isHovering, setIsHovering] = useState(false);

  const { data, isLoading, isError, isRefetching, refetch } = useQuery(
    ["BlockedTutors", currentPage],
    () => {
      return fetchTutors(currentPage, limit);
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 0,
    }
  );
  async function fetchTutors(page, limit) {
    const res = await api.get(
      `/tutor/get-all-blocked-tutorList-for-view?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    let data = res.data;
    return { tutors: data.tutors, tutorCount: data.tutorCount };
  }
  const [tutors, setTutors] = useState([]);
  const [currentlyMappedTutors, setCurrentlyMappedTutors] = useState([]);
  const [totalTutorsCount, setTotalTutorsCount] = useState(0);
  const [totalPages, setTotalPages] = useState([1]);
  const [isTableScrolled, setIsTableScrolled] = useState(false);
  // search states
  const [searchInput, setSearchInput] = useState("");
  const [isActivePerPageDropdownOpen, setIsActivePerPageDropdownOpen] =
    useState(false);
  // modal states
  const [clickedUserDetails, setClickedUserDetails] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeletingTutors, setIsDeletingTutors] = useState(false);

  useEffect(() => {
    if (data) {
      let mapped = data?.tutors.map((tutor) => ({
        ...tutor,
        isSelected: false,
      }));
      setTutors(mapped);
      setCurrentlyMappedTutors(mapped);
      setTotalTutorsCount(data?.tutorCount);
    }
  }, [data]);
  const activePerPageDropdownRef = useClickOutside(() => {
    setIsActivePerPageDropdownOpen(false);
  });

  // get total pages
  useEffect(() => {
    if (totalTutorsCount > limit) {
      let totalPagesInteger = Math.ceil(totalTutorsCount / limit);
      let pagesArr = [];
      for (let i = 0; i < totalPagesInteger; i++) {
        pagesArr.push(i + 1);
      }
      setTotalPages(pagesArr);
      // console.log("total pages: ", pagesArr);
    } else {
      setTotalPages([1]);
      setCurrentPage(1);
    }
  }, [limit, totalTutorsCount]);

  useEffect(() => {
    refetch();
  }, [currentPage, limit]);

  // const handleConfirmModal = (userDetail) => {
  //   setClickedUserDetails(userDetail);
  //   setIsConfirmModalOpen(true);
  // };
  const handleConfirmModal = (userDetail, type) => {
    console.log(userDetail, type);
    setClickedUserDetails(userDetail);

    if (type === "delete") {
      setIsConfirmModalOpen(true);
    } else {
      setIsHovering(true);
    }
  };
  const handleSearchTextChange = (e) => {
    let text = e.target.value;
    setSearchInput(text);
    setIsSearching(true);

    // Clear the previous timeout to avoid calling the function with empty text
    clearTimeout(searchTimeoutRef.current);

    if (!text) {
      setCurrentlyMappedTutors(tutors);
      setIsSearching(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const searchedData = await searchTutors(text, {
          isDeleted: true,
        });
        setCurrentlyMappedTutors(searchedData);
        setIsSearching(false);
      } catch (err) {
        setIsSearching(false);
        console.log("An error occurred while searching conversations: ", err);
      }
    }, 1000);
  };
  function handleSelectTutor(tutorId) {
    setCurrentlyMappedTutors((prev) =>
      prev.map((tutor) => {
        if (tutor._id === tutorId) {
          return {
            ...tutor,
            isSelected: !tutor.isSelected,
          };
        } else {
          return tutor;
        }
      })
    );
  }

  async function handleDeleteSelectedTutors() {
    setIsDeletingTutors(true);
    try {
      let tutor_ids = currentlyMappedTutors
        .filter((tutor) => tutor?.isSelected)
        .map((tutor) => tutor._id);
      await handleDeleteTutors(tutor_ids);
      let remainingTutors = currentlyMappedTutors.filter(
        (tutor) => !tutor_ids.includes(tutor._id)
      );
      setCurrentlyMappedTutors(remainingTutors);
    } catch (err) {
      console.log("Error deleting selected tutors: ", err);
    } finally {
      setIsDeletingTutors(false);
    }
  }

  if (isLoading)
    return (
      <div className={styles.loaderWrapper}>
        <Loader1 />
      </div>
    );
  if (isError)
    return (
      <div className={styles.loaderWrapper}>
        <div>
          <h2>{isError?.message || "Some error occured."}</h2>
          <br />
          <Link to={-1} className="btnDark btn--medium">
            Go back
          </Link>
        </div>
      </div>
    );
  return (
    <div className="outletContainer">
      {isConfirmModalOpen && (
        <ConfirmModal
          clickedUserDetail={clickedUserDetails}
          setIsConfirmModalOpen={setIsConfirmModalOpen}
          successCallback={handleDeletePermanently}
          refetch={refetch}
        />
      )}
      {isHovering && (
        <SubjectsModal
          clickedUserDetail={clickedUserDetails}
          setIsConfirmModalOpen={setIsHovering}
          setClickedUserDetails={setClickedUserDetails}
          refetch={refetch}
        />
      )}

      <h2 className={utilStyles.headingLg}>Blocked Tutors</h2>
      <div className={glassStyles.searchSection}>
        <div className={glassStyles.dcWrapper}>
          <div className={glassStyles.dropdownWrapper}>
            <button
              className={glassStyles.dropdownButton}
              disabled={searchInput}
              onClick={() =>
                setIsActivePerPageDropdownOpen(!isActivePerPageDropdownOpen)
              }
            >
              {limit} per page
              <IoMdArrowDropdown />
            </button>
            <AnimatePresence>
              {isActivePerPageDropdownOpen && (
                <motion.div
                  ref={activePerPageDropdownRef}
                  className={glassStyles.dropdownList}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  {perPageValuesArray.map((value, i) => {
                    return (
                      <button
                        key={i}
                        style={{
                          backgroundColor:
                            limit === value ? "rgba(0,0,0,0.05)" : "",
                        }}
                        disabled={searchInput}
                        onClick={() => {
                          setLimit(value);
                          setIsActivePerPageDropdownOpen(false);
                        }}
                      >
                        {value} per page
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <h3 className={glassStyles.totalCountHeading}>
              Total: {totalTutorsCount}
            </h3>
            <p>
              Selected Tutors :{" "}
              {currentlyMappedTutors.filter((tutor) => tutor.isSelected).length}
            </p>
          </div>
          {isCoAdminComponent || isAdminComponent
            ? null
            : currentlyMappedTutors.filter((tutor) => tutor?.isSelected)
                .length > 0 && (
                <button
                  className="btnDanger btn--medium"
                  disabled={isDeletingTutors}
                  onClick={handleDeleteSelectedTutors}
                >
                  Delete selected tutors
                </button>
              )}
        </div>
        <div
          className={`${glassStyles.inputWrapper} ${glassStyles.searchWrapper}`}
        >
          <input
            type="text"
            placeholder="Search here"
            value={searchInput}
            onChange={handleSearchTextChange}
          />
          <button title="Search">
            <BiSearch />
          </button>
        </div>
      </div>
      {/* // table wrapper */}
      <div
        className={glassStyles.tableWrapper}
        is-table-long="true"
        onScroll={(e) => {
          if (e.target.scrollTop > 0) {
            setIsTableScrolled(true);
          } else {
            setIsTableScrolled(false);
          }
        }}
      >
        <table className={glassStyles.table} id="jobTable">
          <thead
            className={`${isTableScrolled && glassStyles.scrolledTableHead}`}
          >
            <tr>
              <th>Name</th>
              {isCoAdminComponent || isAdminComponent ? null : <th>Email</th>}
              {isCoAdminComponent || isAdminComponent ? null : (
                <th>Phone number</th>
              )}
              {isCoAdminComponent || isAdminComponent ? null : (
                <th>Whatsapp number</th>
              )}
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isRefetching || isSearching ? (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <Loader1 />
              </span>
            ) : currentlyMappedTutors?.length !== 0 ? (
              currentlyMappedTutors?.map((userDetail, i) => {
                let {
                  name,
                  email,
                  phoneNumber,
                  whatsappNumber,
                  _id,
                  isSelected,
                } = userDetail;
                return (
                  <tr key={i}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectTutor(_id)}
                        disabled={isDeletingTutors}
                      />{" "}
                      {name}
                    </td>
                    {isCoAdminComponent || isAdminComponent ? null : (
                      <td>{email}</td>
                    )}
                    {isCoAdminComponent || isAdminComponent ? null : (
                      <td>{phoneNumber}</td>
                    )}
                    {isCoAdminComponent || isAdminComponent ? null : (
                      <td>{whatsappNumber}</td>
                    )}
                    <td onClick={() => handleConfirmModal(userDetail)}>
                      <button
                        className="btn--small"
                        style={{ background: "purple", color: "white" }}
                      >
                        Subjects
                      </button>
                    </td>
                    <td aria-controls="actions">
                      <button
                        className="btnWarning btn--small"
                        onClick={() =>
                          handleUnapprove(_id, () =>
                            setCurrentlyMappedTutors((prev) =>
                              prev.filter((tutor) => tutor._id !== _id)
                            )
                          )
                        }
                      >
                        Unapprove
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <h2>0 Blocked Tutors</h2>
              </span>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        disabled={searchInput !== "" || isDeletingTutors}
      />
    </div>
  );
};

export default BlockedTutors;
