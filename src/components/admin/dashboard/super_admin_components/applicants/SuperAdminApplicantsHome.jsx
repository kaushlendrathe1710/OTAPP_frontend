import React, { useEffect, useState } from "react";
import styles from "../../../../../styles/applicants.module.scss";
import api from "../../../../../services/api";
import { Link } from "react-router-dom";
import { Loader1 } from "../../../../Loaders/Loader1";

export const SuperAdminApplicantsHome = () => {
  const [jobTypesArr, setJobTypesArr] = useState([]);

  // loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobTypes() {
      try {
        setLoading(true);
        const res = await api.get("/job/get-type-of-jobs-in-admin");
        const data = res.data;
        setJobTypesArr(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setError(error);
      }
    }
    fetchJobTypes();
  }, []);

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
    <div className="outletContainer">
      <h2>Type of Job Applicants</h2>
      <section className={styles.jobTypesWrapper}>
        {jobTypesArr.map(
          (
            { jobName, jobRole, vacanciesNumber, isActive, jobLocation, _id },
            i
          ) => {
            return (
              <div className={styles.jobTypeCard} key={i}>
                <div className={styles.header}>
                  <div>
                    <h3>{jobName}</h3>
                  </div>
                  <div>
                    <h5>Total Vaccancies:</h5>
                    <h5>{vacanciesNumber}</h5>
                  </div>
                  <div>
                    <h5>Role:</h5>
                    <h5>{jobRole}</h5>
                  </div>
                  <div>
                    <h5>Active:</h5>
                    <h5
                      className={isActive ? styles.isActive : styles.notActive}
                    >
                      {isActive ? "Yes" : "No"}
                    </h5>
                  </div>
                  <div>
                    <h5>Location:</h5>
                    <h5>{jobLocation}</h5>
                  </div>
                </div>
                <Link to={`applicants/${_id}`} className="btnDark btn--medium">
                  See all applicants
                </Link>
              </div>
            );
          }
        )}
      </section>
    </div>
  );
};
