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
import { ConfirmModal } from "../../../../Modal/ConfirmModal";
import { toast } from "react-hot-toast";
import { useRef } from "react";
import Pagination from "../../../../pagination/Pagination";

async function searchStudents(query) {
  const res = await api.get(`/student/search-students?query=${query}`, {
    headers: {
      Authorization: getAccessToken(),
    },
  });
  return res.data;
}
async function handleDeleteStudents(student_ids) {
  try {
    await api.patch(
      `/student/delete-students`,
      {
        student_ids: student_ids,
      },
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Students deleted successfully", {
      duration: 4000,
    });
  } catch (e) {
    console.log(e);
    toast.error("Something went wrong\nPlease try again", {
      duration: 4000,
    });
  }
}

export const ViewAllStudents = ({ isAdminComponent, isSubAdminComponent }) => {
  const searchTimeoutRef = useRef(null);
  const perPageValuesArray = [20, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(perPageValuesArray[0]);
  const [deletedStudentId, setDeletedStudentId] = useState();

  const { data, isLoading, isError, isRefetching, refetch } = useQuery(
    ["students", currentPage],
    () => {
      return fetchStudents(currentPage, limit);
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 0,
    }
  );

  async function fetchStudents(page, limit) {
    const res = await api.get(
      `/student/get-all-in-admin-to-View?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    let data = res.data;
    return { students: data.students, studentCount: data.studentCount };
  }

  const [students, setStudents] = useState([]);
  const [currentlyMappedStudents, setCurrentlyMappedStudents] = useState([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [totalPages, setTotalPages] = useState([1]);
  const [isTableScrolled, setIsTableScrolled] = useState(false);

  // search states
  const [searchInput, setSearchInput] = useState("");
  const [isActivePerPageDropdownOpen, setIsActivePerPageDropdownOpen] =
    useState(false);
  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedUserDetails, setClickedUserDetails] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeletingStudents, setIsDeletingStudents] = useState(false);

  useEffect(() => {
    if (data) {
      let mapped = data?.students.map((student) => ({
        ...student,
        isSelected: false,
      }));
      setStudents(mapped);
      setCurrentlyMappedStudents(mapped);
      setTotalStudentsCount(data?.studentCount);
    }
  }, [data]);
  const activePerPageDropdownRef = useClickOutside(() => {
    setIsActivePerPageDropdownOpen(false);
  });
  // get total pages
  useEffect(() => {
    if (totalStudentsCount > limit) {
      let totalPagesInteger = Math.ceil(totalStudentsCount / limit);
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
  }, [limit, totalStudentsCount]);

  useEffect(() => {
    refetch();
  }, [currentPage, limit]);

  function handleDeleteStudent(_id) {
    // console.log(`student id: ${_id}`);
    api
      .delete(`/student/delete-permanently?student_id=${_id}`)
      .then(() => {
        // refetch();
        setTotalStudentsCount((prev) => prev - 1);
        setDeletedStudentId(_id);
        let filterStudentData = currentlyMappedStudents.filter(
          ({ _id: id }) => _id !== id
        );
        let filterAllStudentData = allStudents.filter(
          ({ _id: id }) => _id !== id
        );
        // let filterAllStudentData = allStudents.filter(({_id: id})=>_id!==id);
        setCurrentlyMappedStudents(filterStudentData);
        setAllStudents(filterAllStudentData);
        toast.success("Student deleted successfully", {
          duration: 4000,
        });
      })
      .catch((e) => {
        console.log(e);
        toast.error("Something went wrong\nPlease try again", {
          duration: 4000,
        });
      });
  }

  const handleSearchTextChange = (e) => {
    let text = e.target.value;
    setSearchInput(text);
    setIsSearching(true);

    // Clear the previous timeout to avoid calling the function with empty text
    clearTimeout(searchTimeoutRef.current);

    if (!text) {
      setCurrentlyMappedStudents(students);
      setIsSearching(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const searchedData = await searchStudents(text);
        setCurrentlyMappedStudents(searchedData);
        setIsSearching(false);
      } catch (err) {
        setIsSearching(false);
        console.log("An error occurred while searching conversations: ", err);
      }
    }, 1000);
  };
  function handleSelectStudent(studentId) {
    setCurrentlyMappedStudents((prev) =>
      prev.map((student) => {
        if (student._id === studentId) {
          return {
            ...student,
            isSelected: !student.isSelected,
          };
        } else {
          return student;
        }
      })
    );
  }

  async function handleDeleteSelectedStudents() {
    setIsDeletingStudents(true);
    try {
      let student_ids = currentlyMappedStudents
        .filter((student) => student?.isSelected)
        .map((student) => student._id);
      await handleDeleteStudents(student_ids);
      let remainingStudents = currentlyMappedStudents.filter(
        (student) => !student_ids.includes(student._id)
      );
      setCurrentlyMappedStudents(remainingStudents);
    } catch (err) {
      console.log("Error deleting selected students: ", err);
    } finally {
      setIsDeletingStudents(false);
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
  const handleConfirmModal = (userDetail) => {
    setClickedUserDetails(userDetail);
    setIsConfirmModalOpen(true);
  };
  return (
    <div className="outletContainer">
      {isConfirmModalOpen && (
        <ConfirmModal
          clickedUserDetail={clickedUserDetails}
          setIsConfirmModalOpen={setIsConfirmModalOpen}
          successCallback={handleDeleteStudent}
        />
      )}
      <h2 className={utilStyles.headingLg}>All Students</h2>
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
              Total: {totalStudentsCount}
            </h3>
            <p>
              Selected Students :{" "}
              {
                currentlyMappedStudents.filter((student) => student.isSelected)
                  .length
              }
            </p>
          </div>
          {isSubAdminComponent || isAdminComponent
            ? null
            : currentlyMappedStudents.filter((student) => student?.isSelected)
                .length > 0 && (
                <button
                  className="btnDanger btn--medium"
                  disabled={isDeletingStudents}
                  onClick={handleDeleteSelectedStudents}
                >
                  Delete selected students
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
              <th>Email</th>
              <th>Phone number</th>
              <th>Whatsapp number</th>
            </tr>
          </thead>
          <tbody>
            {isRefetching || isSearching ? (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <Loader1 />
              </span>
            ) : currentlyMappedStudents?.length !== 0 ? (
              currentlyMappedStudents?.map((userDetail, i) => {
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
                        onChange={() => handleSelectStudent(_id)}
                        disabled={isDeletingStudents}
                      />{" "}
                      {name}
                    </td>
                    <td>{email}</td>
                    <td>{phoneNumber}</td>
                    <td>{whatsappNumber}</td>
                  </tr>
                );
              })
            ) : (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <h2>0 Students</h2>
              </span>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        disabled={searchInput !== "" || isDeletingStudents}
      />
    </div>
  );
};
