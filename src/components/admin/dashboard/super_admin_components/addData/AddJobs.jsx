import React, { useState, useEffect } from "react";
import styles from "../../../../../styles/addData.module.scss";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiFillEdit,
  AiTwotoneDelete,
  AiFillContainer,
} from "react-icons/ai";
import api from "../../../../../services/api";
import DeleteComponent from "./DeleteComponent";
import toast from "react-hot-toast";

const AddJobs = () => {
  const [toggleForm, setToggleForm] = useState(false);
  const [searchJob, setSearchJob] = useState("");
  const [jobValues, setJobValues] = useState({
    jobName: "",
    jobDescription: "",
    jobRole: "",
    salary: "",
    experience: "",
    vacanciesNumber: "",
    action: "",
  });
  const [allJobs, setAllJobs] = useState([]);
  const [applicants, setApplicants] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantWhatsapp: "",
    applicantphone: "",
    fileCV: "",
    aboutQuestion: "",
    country: "",
  });
  const [deleteData, setDeleteData] = useState({
    header: "",
    name: "",
    id: "",
  });
  const [toggleDelete, setToggleDelete] = useState(false);

  useEffect(() => {
    async function getJobs() {
      const res = await api.get("/job/get-all-in-admin/1");
      setAllJobs(res.data);
    }
    getJobs();
  }, []);

  const handelForm = () => {
    toggleForm === true ? setToggleForm(false) : setToggleForm(true);
  };

  const handelFormData = (e) => {
    setJobValues({ ...jobValues, [e.target.name]: e.target.value });
  };

  const handelFormSubmit = async (e) => {
    e.preventDefault();
    const info = {
      jobName: jobValues.jobName,
      jobDescription: jobValues.jobDescription,
      jobRole: jobValues.jobRole,
      salary: jobValues.salary,
      experience: jobValues.experience,
      vacanciesNumber: jobValues.vacanciesNumber,
    };

    if (jobValues.action === "edit") {
      try {
        const res = await api.put(`/job/edit/`, { ...info, id: jobValues.id });
        setToggleForm(false);
        setJobValues({
          jobName: "",
          jobDescription: "",
          jobRole: "",
          salary: "",
          experience: "",
          vacanciesNumber: "",
          action: "",
        });
        const updatedData = allJobs.map((item) => {
          if (jobValues.id === item._id) {
            return {
              ...item,
              ...info,
            };
          } else {
            return item;
          }
        });
        setAllJobs(updatedData);
        toast.success(res.data.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
      } catch (err) {
        setLoading(false);
        const error = err?.response;
        let message = "";
        if (error) {
          if (error.status === 422) {
            const len = error.data.validationError.length;
            error.data.validationError.forEach(
              (item, i) =>
                (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
            );
          } else if (error.status === 403) {
            message = error.data.message;
          } else if (error.status === 409) {
            message = error.data.message;
          }
        }
        if (message) {
          toast.error(message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          });
        } else {
          toast.error(err.message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          });
        }
      }
    } else {
      try {
        const res = await api.post("/job/create", info);
        setToggleForm(false)
        setAllJobs(allJobs.concat(res.data.data));
        toast.success(res.data.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
        setJobValues({
          jobName: "",
          jobDescription: "",
          jobRole: "",
          salary: "",
          experience: "",
          vacanciesNumber: "",
          action: "",
        });
      } catch (err) {
        setLoading(false);
        const error = err?.response;
        let message = "";
        if (error) {
          if (error.status === 422) {
            const len = error.data.validationError.length;
            error.data.validationError.forEach(
              (item, i) =>
                (message += `${item.message}${i + 1 != len ? " , " : " ."}`)
            );
          } else if (error.status === 403) {
            message = error.data.message;
          } else if (error.status === 409) {
            message = error.data.message;
          }
        }
        if (message) {
          toast.error(message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          });
        } else {
          toast.error(err.message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          });
        }
      }
    }
  };

  const handelSearch = (e) => {
    setSearchJob(e.target.value);
  };

  const data = allJobs.filter((x) => {
    if (searchJob === "") {
      return x;
    } else {
      return x.jobName.toLowerCase().includes(searchJob);
    }
  });

  const editDataAction = (
    id,
    jobName,
    jobDescription,
    jobRole,
    experience,
    salary,
    vacanciesNumber
  ) => {
    setJobValues({
      jobName: jobName,
      jobDescription: jobDescription,
      jobRole: jobRole,
      experience: experience,
      salary: salary,
      vacanciesNumber: vacanciesNumber,
      id: id,
      action: "edit",
    });
    setToggleForm(true);
  };

  const handelCloseModal = () => {
    setToggleForm(false);
    setJobValues({
      jobName: "",
      jobDescription: "",
      jobRole: "",
      salary: "",
      experience: "",
      vacanciesNumber: "",
      action: "",
    });
  };

  const toggleDeleteWrapper = (id, job) => {
    setDeleteData({
      header: "job",
      name: job,
      id: id,
    });
    setToggleDelete(true);
  };

  const toggleActiveInactive = async (id) => {
    const res = await api.patch(`/job/active-inactive/${id}`);

    const updatedData = allJobs.map((item) => {
      if (id === item._id) {
        return {
          ...item,
          isActive: !item.isActive,
        };
      } else {
        return item;
      }
    });
    setAllJobs(updatedData);
    toast.success(res.data.message, {
      duration: 4000,
      position: "top-center",
      style: { border: "2px solid var(--success-color)" },
    });
  };

  return (
    <>
      <div className={styles.AllCountryRelatedWrapper}>
        <h2 style={{ textAlign: "center" }}>Jobs Info</h2>
        <div className={styles.topContainer}>
          <div className={styles.searchContainer}>
            <label htmlFor="SearchCountry">Search:</label>
            <input
              onChange={handelSearch}
              value={searchJob}
              placeholder="Search Job"
              className={styles.searchCountry}
              type="text"
            />
          </div>
          <button onClick={handelForm} className={styles.createCountryButton}>
            + Create New Job
          </button>
        </div>
        <div className={styles.mainContainer}>
          <table className={styles.countryTable}>
            <thead className={styles.tableHeader}>
              <tr>
                <th style={{ width: "10%" }}>S No.</th>
                <th style={{ width: "20%" }}>Job Name</th>
                <th style={{ width: "15%" }}>Status</th>
                <th style={{ width: "10%" }}>Vacancies</th>
                <th style={{ width: "15%" }}>Role</th>
                <th style={{ width: "10%" }}>Salary</th>
                <th style={{ width: "20%" }}>Action</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {data.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.jobName}</td>
                    <td>{item.isActive === true ? "Active" : "Inactive"}</td>
                    <td>{item.vacanciesNumber}</td>
                    <td>{item.jobRole}</td>
                    <td>₹{item.salary}</td>
                    <td>
                      {item.isActive === true ? (
                        <abbr title="Hide">
                          <AiFillEye
                            onClick={() => toggleActiveInactive(item._id)}
                            className={styles.actionIcons}
                          />
                        </abbr>
                      ) : (
                        <abbr title="Unhide">
                          <AiFillEyeInvisible
                            onClick={() => toggleActiveInactive(item._id)}
                            className={styles.actionIcons}
                          />
                        </abbr>
                      )}
                      <abbr title="Edit">
                        <AiFillEdit
                          onClick={() =>
                            editDataAction(
                              item._id,
                              item.jobName,
                              item.jobDescription,
                              item.jobRole,
                              item.experience,
                              item.salary,
                              item.vacanciesNumber
                            )
                          }
                          className={styles.actionIcons}
                        />
                      </abbr>
                      <abbr title="Delete">
                        <AiTwotoneDelete
                          onClick={() =>
                            toggleDeleteWrapper(item._id, item.jobName)
                          }
                          className={`${styles.actionIcons} ${styles.trash}`}
                        />
                      </abbr>
                      <abbr title="Details">
                        <AiFillContainer
                          onClick={() => alert("hii")}
                          className={styles.actionIcons}
                        />

                      </abbr>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className={`${styles.createFormMainContainer} ${toggleForm === true && styles.toggleClass
          }`}
      >
        <div className={styles.createdCountryWrapper}></div>
        <button
          onClick={handelCloseModal}
          className={`${styles.btnClose} ${styles.JobFormClose}`}
        >
          &times;
        </button>
        <div className={`${styles.formJobContainer} ${styles.formContainer}`}>
          <form onSubmit={handelFormSubmit} className={styles.entryForm}>
            <h2>Create A Job</h2>
            <div className={styles.inputContainer}>
              <label htmlFor="jobName">Job Name</label>
              <input
                required
                onChange={handelFormData}
                name="jobName"
                value={jobValues.jobName}
                type="text"
                placeholder="Enter Job Name"
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="jobRole">Job Role</label>
              <select
                required
                onChange={handelFormData}
                name="jobRole"
                id="jobRole"
              >
                <option value="">Select...</option>
                <option value="Developer">Developer</option>
                <option value="Tutor">Tutor</option>
              </select>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="salary">Salary</label>
              <input
                required
                onChange={handelFormData}
                value={jobValues.salary}
                name="salary"
                type="text"
                placeholder="Enter Salary"
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="vacanciesNumber">Number Of Vacancies</label>
              <input
                required
                onChange={handelFormData}
                value={jobValues.vacanciesNumber}
                name="vacanciesNumber"
                type="number"
                placeholder="Enter Number Of Vacancies"
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="experience">Experience (In years)</label>
              <input
                required
                onChange={handelFormData}
                value={jobValues.experience}
                name="experience"
                type="text"
                placeholder="Enter Experience"
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                required
                rows={5}
                onChange={handelFormData}
                value={jobValues.jobDescription}
                name="jobDescription"
                type="text"
                placeholder="Description"
              />
            </div>
            <button className={styles.btnAdd} type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>

      <DeleteComponent
        valueProp={allJobs}
        setValueProp={setAllJobs}
        setToggleDelete={setToggleDelete}
        toggleDelete={toggleDelete}
        data={deleteData}
      />
    </>
  );
};

export default AddJobs;
