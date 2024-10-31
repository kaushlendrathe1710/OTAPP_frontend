import React, { useEffect, useState } from "react";
import { Footer } from "../components/footer/Footer";
import { Header } from "../components/header/Header";
import CareerCard from "../components/JobRelated/CareerCard";
import { CareersHero } from "../components/JobRelated/CareersHero";
import api from "../services/api";
import styles from "../styles/careers.module.scss";

const career = () => {
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    const getAllJobs = async () => {
      try {
        const res = await api.get("/job/get-all-jobs-in-career/");
        setAllJobs(res.data);
        console.log("jobs: ", res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllJobs();
  }, []);

  return (
    <div>
      <Header isCareersPage={true} />
      <CareersHero />
      <div className={styles.careerHeading}>
        <h1>Be part of our mission</h1>
        <p>
          We're looking for passionate people to join us on our mission. We
          value flat hierarchies, clear communication, and full ownership, and
          responsibilty.
        </p>
      </div>
      <section className={styles.jobsWrapper}>
        <h2>View all jobs</h2>
        {allJobs.length > 0
          ? allJobs.map((job) => {
              return (
                <CareerCard
                  key={job._id}
                  id={job._id}
                  title={job.jobName}
                  description={job.jobDescription}
                  experience={job.experience}
                  salary={job.salary}
                  role={job.role}
                  location={job.jobLocation}
                  postedOn={job.updatedAt}
                  vacancies={job.vacanciesNumber}
                />
              );
            })
          : "No jobs"}
      </section>
      <Footer />
    </div>
  );
};

export default career;
