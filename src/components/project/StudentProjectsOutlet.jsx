import React from "react";
import utilsStyles from "../../styles/utils.module.scss";
import StudentProjects from "./StudentProjects";

const StudentProjectsOutlet = () => {
  return (
    <div className={"outletContainer"}>
      <h3 className={utilsStyles.headingMd} style={{ marginBottom: "1rem" }}>
        All Projects
      </h3>
      <StudentProjects />
    </div>
  );
};

export default StudentProjectsOutlet;
