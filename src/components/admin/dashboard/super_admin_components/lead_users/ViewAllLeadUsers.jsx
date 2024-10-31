import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import api from "../../../../../services/api";
import { Loader1 } from "../../../../Loaders/Loader1";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import Pagination from "../../../../pagination/Pagination";
import glassStyles from "../../../../../styles/glass.module.scss";
import styles from "../../../../../styles/student.module.scss";
import utilStyles from "../../../../../styles/utils.module.scss";

async function getAllLeadUsers(page = 1, limit = 10) {
  const { data } = await api.get(
    `/lead-user/get-all-users?&page=${page}&limit=${limit}`
  );
  return data;
}

const perPageValuesArray = [20, 50, 100];

const ViewAllLeadUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [leadUsers, setLeadUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalPages, setTotalPages] = useState([1]);
  const [isTableScrolled, setIsTableScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(perPageValuesArray[0]);

  // search states
  const [searchInput, setSearchInput] = useState("");
  const [isActivePerPageDropdownOpen, setIsActivePerPageDropdownOpen] =
    useState(false);

  const activePerPageDropdownRef = useClickOutside(() => {
    setIsActivePerPageDropdownOpen(false);
  });

  useEffect(() => {
    setIsLoading(true);
    getAllLeadUsers(currentPage, limit)
      .then((data) => {
        setLeadUsers(data.users);
        setTotalUsersCount(data.totalUsers);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, limit]);

  useEffect(()=>{
    setCurrentPage(1);
  },[limit]);

  useEffect(() => {
    if (totalUsersCount > limit) {
        let totalPagesInteger = Math.ceil(totalUsersCount / limit);
        let pagesArr = [];
        for (let i = 0; i < totalPagesInteger; i++) {
            pagesArr.push(i + 1);
        }
        setTotalPages(pagesArr);
    } else {
        setTotalPages([1]);
        setCurrentPage(1);
    }
}, [limit, totalUsersCount]);

  if (isLoading)
    return (
      <div className={styles.loaderWrapper}>
        <Loader1 />
      </div>
    );
  return (
    <div className="outletContainer">
      <h2 className={utilStyles.headingLg}>Lead users</h2>
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
                  exit={{ y: 50, opacity: 0, scale: 0.875 }}
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
              Total: {totalUsersCount}
            </h3>
          </div>
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
          <thead
            className={`${isTableScrolled && glassStyles.scrolledTableHead}`}
          >
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Need help</th>
            </tr>
          </thead>
          <tbody>
            {leadUsers?.length !== 0 ? (
              leadUsers?.map((userDetail, i) => {
                let { name, email, phoneNumber, needHelp, _id } = userDetail;
                return (
                  <tr key={i}>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{phoneNumber}</td>
                    <td>{needHelp}</td>
                  </tr>
                );
              })
            ) : (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <h2>0 Lead users</h2>
              </span>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ViewAllLeadUsers;
