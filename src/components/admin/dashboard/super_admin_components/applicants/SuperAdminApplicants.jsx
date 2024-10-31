import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../../services/api";
import styles from "../../../../../styles/applicants.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import { Loader1 } from "../../../../Loaders/Loader1";
import { JobApplicantModal } from "./JobApplicantModal";

export const SuperAdminApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedApplicant, setClickedApplicant] = useState({});

  // loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isTableScrolled, setIsTableScrolled] = useState(false);

  const getApplicants = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/job-application/get-all-in-admin?page=1&job_id=${jobId}&limit=10`
      );
      setApplicants(res.data.applications);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(jobId);
    getApplicants();
  }, []);

  const handlApplicantModal = (
    name,
    email,
    phoneNumber,
    whatsappNumber,
    downloadUrl,
    isHired,
    aboutQuestion
  ) => {
    setClickedApplicant({
      name,
      email,
      phoneNumber,
      whatsappNumber,
      downloadUrl,
      isHired,
      aboutQuestion,
    });
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className={styles.loaderWrapper}>
        <Loader1 />
      </div>
    );
  if (error !== null)
    return (
      <div className={styles.loaderWrapper}>
        <h2>{error.message}</h2>
      </div>
    );

  return (
    <>
      {isModalOpen && (
        <JobApplicantModal
          applicantDetail={clickedApplicant}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <div className="outletContainer">
        <h2>All Job Applicants</h2>
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
            <thead className={`${isTableScrolled && styles.scrolledTableHead}`}>
              <tr>
                <th>Applicant name</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Hiring status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(
                (
                  {
                    name,
                    email,
                    phoneNumber,
                    whatsappNumber,
                    downloadUrl,
                    isHired,
                    aboutQuestion,
                  },
                  i
                ) => {
                  return (
                    <tr key={i}>
                      <td>{name}</td>
                      <td>{email}</td>
                      <td>{phoneNumber}</td>
                      <td
                        style={{
                          color:
                            isHired === "Pending"
                              ? "royalblue"
                              : isHired === "Yes"
                              ? "var(--success-600)"
                              : isHired === "No"
                              ? "var(--danger-600)"
                              : isHired === "Shortlisted"
                              ? "var(--primary-600)"
                              : "var(--gray-950)",
                        }}
                      >
                        {isHired}
                      </td>
                      <td aria-controls="actions">
                        <button
                          className="btnDark btn--small"
                          onClick={() =>
                            handlApplicantModal(
                              name,
                              email,
                              phoneNumber,
                              whatsappNumber,
                              downloadUrl,
                              isHired,
                              aboutQuestion
                            )
                          }
                        >
                          See all
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.paginationWrapper}>
          <button className={styles.paginationButtonNext} disabled={true}>
            Prev
          </button>
          <button className={styles.paginationButtonNext}>Next</button>
          <button className={styles.paginationButton}>1</button>
          <button className={styles.paginationButton}>2</button>
          <button className={styles.paginationButtonNext}>Last</button>
        </div>
      </div>
    </>
  );
};
