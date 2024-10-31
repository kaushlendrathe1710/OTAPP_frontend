import React, { useState, useEffect } from "react";
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
// import { format } from "date-fns";
import { handleUnapprove, handleDeletePermanently } from "./ApprovedTutors";
import { ConfirmModal } from "../../../../Modal/ConfirmModal";
import { SubjectsModal } from "../../../../Modal/SubjectsModal";
import MainChat from "../../../../projectChat/MainChat";
import StatusDropDown from "./StatusDropDown";

import { toast } from "react-hot-toast";

export const TutorPayment = ({ isCoAdminComponent, isAdminComponent }) => {
  const perPageValuesArray = [20, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(perPageValuesArray[0]);
  const [fetchAllData, setFetchAllData] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [filteredData, setFilteredData] = useState([]);

  const [currentlyMappedTutors, setCurrentlyMappedTutors] = useState([]);
  const [allTutors, setAllTutors] = useState([]);
  const [totalTutorsCount, setTotalTutorsCount] = useState(0);
  const [totalPages, setTotalPages] = useState([1]);
  const [isTableScrolled, setIsTableScrolled] = useState(false);
  // search states
  const [searchInput, setSearchInput] = useState("");
  const [isActivePerPageDropdownOpen, setIsActivePerPageDropdownOpen] = useState(false);
  // modal states
  const [chatStatus, setChatStatus] = useState(false);

  const [selectedProject, setSelectedProject] = useState();
  const [selectedProjectType, setSelectedProjectType] = useState();

  const [year, setYear] = useState(new Date().getFullYear());
  const [week, setWeek] = useState();

  const [currentWeekLabel, setCurrentWeekLabel] = useState("");

  useEffect(() => {
    const today = new Date();

    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6));

    const weekLabel = `${getFormattedDate(firstDayOfWeek)} - ${getFormattedDate(lastDayOfWeek)}`;
    setWeek(weekLabel);
    console.log(weekLabel);
    handleWeekChange(weekLabel);
  }, []);

  const { data, isLoading, isError, isRefetching, refetch } = useQuery(
    ["TutorPayment"],
    () => {
      return [];
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  async function handleStatusChange(status, id) {
    let formData = {
      status: status,
      _id: id,
    };

    try {
      const res = await api.patch("/project/update-tutor-payment-status", formData, {
        headers: { Authorization: getAccessToken() },
      });

      console.log(res.data);

      if (res.data) {
        let temp = [...currentlyMappedTutors];
        let index = temp.findIndex((e) => e._id === res.data._id);
        temp[index].tutorPaymentstatus = res.data.tutorPaymentstatus;
        setCurrentlyMappedTutors(temp);
        toast.success("Payment Status Updated Sucessfully", {
          duration: 4000,
        });

        return true;
      }
    } catch (err) {
      return false;
    }
  }

  function getFormattedDate(date) {
    return `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`;
  }

  const months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  async function filterData(week) {
    // let startDate = week.
    // const [year, weekNumber] = week.split("-W");
    // console.log(week);
    let nweekstart;
    let nweekend;
    if (week.includes("-")) {
      nweekstart = week.split("-")[0];
      nweekend = week?.split("-")[1];
    }
    const weekStart = new Date();
    // const lastDayOfYear = new Date(`${year}-12-31`);
    weekStart.setDate(nweekstart?.split(" ")[1]?.split(",")[0]);
    let month = months[nweekstart?.split(" ")[0]];
    weekStart.setMonth(month - 1);
    weekStart.setFullYear(nweekstart?.split(",")[1]);

    // console.log(
    //   "\n\n\n\n\n\n\n\n\nweek\n\n\n\n\n\n\n\n\n",
    //   nweekstart,
    //   nweekend
    // );

    // set a weekEnd variable a data type of date

    const weekEnd = new Date();
    weekEnd.setDate(weekStart?.getDate() + 7);
    console.log(nweekend?.split(" ")[1]);
    month = months[nweekend?.split(" ")[1]];
    weekEnd.setMonth(month - 1);
    weekEnd.setFullYear(nweekend?.split(",")[1]);
    // weekEnd.setDate(weekEnd.getDate() + 6);
    // weekEnd.setMonth(lastDayOfYear.getMonth());
    // weekEnd.setDate(Math.min(lastDayOfYear.getDate(), weekEnd.getDate()));

    // getCurrentWeekLabel(weekStart, weekEnd);

    // console.log(weekStart, weekEnd);

    const data = await api.get(`/project/get-data-by-week?start=${weekStart}&end=${weekEnd}`, {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return data.data;
  }

  // function getCurrentWeek() {
  //   const now = new Date();
  //   const startOfYear = new Date(now.getFullYear(), 0, 1);
  //   const weekNumber =
  //     Math.ceil(
  //       ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  //     ) - 1;
  //   console.log(weekNumber);
  //   return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
  // }

  // useEffect(() => {
  //   setCurrentlyMappedTutors(data?.tutors);
  //   // console.log("mapped tutors: ", data?.tutors);
  //   setTotalTutorsCount(data?.tutorCount);
  // }, [data]);
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
  useEffect(() => {
    function getSearchedTutors() {
      const filterDataByAssignmentId = filteredData?.filter((data) => {
        return data?.assignmentId?.toLowerCase()?.includes(searchInput.toLowerCase());
      });

      const filterDataByTutorName = filteredData?.filter((data) => {
        return data?.assignedTo?.name?.toLowerCase()?.includes(searchInput.toLowerCase());
      });

      let allConcatData = filterDataByTutorName.concat(filterDataByAssignmentId);

      // .concat(filterDataByWhatsappNumber)
      // .concat(filterDataByPhoneNumber);
      const allFilterData = Array.from(new Set(allConcatData));
      console.log(allFilterData);

      setCurrentlyMappedTutors(allFilterData);
    }
    if (searchInput !== "") {
      getSearchedTutors();
    } else {
      setCurrentlyMappedTutors(filteredData);
    }
  }, [searchInput]);

  // const handleConfirmModal = (userDetail) => {
  //   setClickedUserDetails(userDetail);
  //   setIsConfirmModalOpen(true);
  // };

  function getWeek(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  const handleWeekChange = async (event) => {
    let newWeek;

    setYear(new Date().getFullYear());

    if (event.target) {
      newWeek = event.target.value;
    } else {
      newWeek = event;
    }

    setWeek(newWeek);

    const filteredData = await filterData(newWeek);
    // console.log(filteredData);
    setFilteredData(filteredData);
    setCurrentlyMappedTutors(filteredData);
  };

  useEffect(() => {
    const ncurrentWeekLabel = `${getFormattedDate(
      new Date(
        new Date().getFullYear(),
        0, // January
        1 + (getWeek(new Date()) - 1) * 7 - new Date(new Date().getFullYear(), 0, 1).getDay()
      )
    )} - ${getFormattedDate(
      new Date(
        new Date().getFullYear(),
        0, // January
        1 + (getWeek(new Date()) - 1) * 7 - new Date(new Date().getFullYear(), 0, 1).getDay() + 7
      )
    )}`;

    console.log("current week label: ", ncurrentWeekLabel);

    setCurrentWeekLabel(ncurrentWeekLabel);
  }, []);

  const toggleModalP = (e, val) => {
    setSelectedProject(e);
    setSelectedProjectType(val);
    setChatStatus(!chatStatus);
  };

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
    <>
      {chatStatus && <MainChat user={selectedProject} onClose={toggleModalP} type={selectedProjectType} />}
      <div className="outletContainer">
        <h2 className={utilStyles.headingLg}>Tutor Payment</h2>

        <div className={glassStyles.searchSection}>
          <div className={glassStyles.dcWrapper}>
            <div className={glassStyles.inputWrapper}>
              <select value={week} defaultValue={currentWeekLabel} onChange={handleWeekChange}>
                {[...Array(52)].map((_, i) => {
                  if (i == 0) {
                    return null;
                  }

                  const today = new Date();
                  const firstDayOfWeek = new Date(
                    today.getFullYear(),
                    0, // January
                    1 + i * 7 - (new Date(today.getFullYear(), 0, 1).getDay() || 7)
                  );
                  const lastDayOfWeek = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + 6);
                  const weekLabel = `${getFormattedDate(firstDayOfWeek)} - ${getFormattedDate(lastDayOfWeek)}`;

                  return (
                    <option key={i} value={weekLabel}>
                      {weekLabel}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={glassStyles.dropdownWrapper}>
              <button className={glassStyles.dropdownButton} disabled={searchInput} onClick={() => setIsActivePerPageDropdownOpen(!isActivePerPageDropdownOpen)}>
                {limit} per page
                <IoMdArrowDropdown />
              </button>
              <AnimatePresence>
                {isActivePerPageDropdownOpen && (
                  <motion.div ref={activePerPageDropdownRef} className={glassStyles.dropdownList} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0, scale: 0.75 }} transition={{ duration: 0.8, type: "spring" }}>
                    {perPageValuesArray.map((value, i) => {
                      return (
                        <button
                          key={i}
                          style={{
                            backgroundColor: limit === value ? "rgba(0,0,0,0.05)" : "",
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
              <h3 className={glassStyles.totalCountHeading}>Total: {filteredData.length}</h3>
            </div>
          </div>
          <div className={`${glassStyles.inputWrapper} ${glassStyles.searchWrapper}`}>
            <input type="text" placeholder="Search here" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button title="Search">
              <BiSearch />
            </button>
          </div>
        </div>

        {/* // table wrapper */}
        <div
          className={glassStyles.tableWrapper}
          onScroll={(e) => {
            if (e.target.scrollTop > 0) {
              setIsTableScrolled(true);
            } else {
              setIsTableScrolled(false);
            }
          }}
        >
          <table className={glassStyles.table} id="jobTable">
            <thead className={`${isTableScrolled && glassStyles.scrolledTableHead}`}>
              <tr>
                <th>Assignment Id</th>
                {isCoAdminComponent || isAdminComponent ? null : <th>Tutor Name</th>}
                {isCoAdminComponent || isAdminComponent ? null : <th>Tutor Payment</th>}
                {isCoAdminComponent || isAdminComponent ? null : <th>Status</th>}
                <th>Accepted At</th>
                <th>Chat</th>
              </tr>
            </thead>
            <tbody>
              {isRefetching ? (
                <span className={glassStyles.insideTableLoaderWrapper}>
                  <Loader1 />
                </span>
              ) : currentlyMappedTutors?.length !== 0 ? (
                currentlyMappedTutors?.map((payment, i) => {
                  return (
                    <tr key={i}>
                      <td>{payment.assignmentId}</td>
                      <td>{payment.assignedTo?.name}</td>
                      <td>{payment.tutorPayment}</td>
                      <td>
                        <div className={`${glassStyles.inputWrapper}`}>
                          <StatusDropDown currentStatus={payment.tutorPaymentstatus} onChange={(newStatus) => handleStatusChange(newStatus, payment?._id)} />
                        </div>
                      </td>
                      <td>{new Date(payment.submittedAt).toLocaleDateString()}</td>

                      <td>
                        <button onClick={() => toggleModalP(payment, "tutor")} className="btnSecondary btn--small" style={{ marginBottom: "5px" }}>
                          Chat
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <span className={glassStyles.insideTableLoaderWrapper}>
                  <h2>No Data For {week}</h2>
                </span>
              )}
            </tbody>
          </table>
        </div>
        <div className={glassStyles.paginationWrapper}>
          {totalPages.length > 1 && currentPage !== totalPages[0] && !searchInput && (
            <button className={glassStyles.paginationButtonNext} onClick={() => setCurrentPage(currentPage - 1)} title="Previous page">
              Prev
            </button>
          )}
          {!searchInput &&
            totalPages?.map((page, i) => {
              return (
                <button
                  key={i}
                  style={{
                    backgroundColor: currentPage === page ? "white" : "",
                  }}
                  className={glassStyles.paginationButton}
                  onClick={() => {
                    // console.log(page);
                    setCurrentPage(page);
                  }}
                  data-active={currentPage === page}
                  title={`Page ${page}`}
                >
                  {page}
                </button>
              );
            })}
          {/* <button className={glassStyles.paginationButton}>1</button>
          <button className={glassStyles.paginationButton}>2</button> */}
          {totalPages.length > 1 && !searchInput && currentPage !== totalPages[totalPages.length - 1] && (
            <button className={glassStyles.paginationButtonNext} onClick={() => setCurrentPage(currentPage + 1)} title="Next page">
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};
