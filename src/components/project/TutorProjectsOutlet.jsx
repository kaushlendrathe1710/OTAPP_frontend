import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import userContext from "../../context/userContext";
import { useSingleProjectQuery } from "../../hooks/useProjects";
import TutorProjects from "./TutorProjects";
import AssignmentModal from "./common/AssignmentModal";
import { TUTOR_PROJECT_TABS } from "../../../constants/helpers";
import "../../styles/react-tabs.css";
import utilsStyles from "../../styles/utils.module.scss";

function getTabs(userType) {
  if (!userType) return [];
  return TUTOR_PROJECT_TABS.map(({ key, label }) => {
    return {
      key: key,
      title: label,
      component: () => <TutorProjects type={key} />,
    };
  });
}

const TutorProjectsOutlet = () => {
  const { userData: user } = useContext(userContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] =
    React.useState(false);

  const { data: project, isLoading } = useSingleProjectQuery({
    id,
    enabled: !!id,
  });

  React.useEffect(() => {
    if (id) {
      setIsAssignmentModalOpen(true);
    }
  }, [id]);

  return (
    <div className={"outletContainer"}>
      {isAssignmentModalOpen && project && !isLoading && (
        <AssignmentModal
          open={isAssignmentModalOpen}
          setOpen={(state) => {
            setIsAssignmentModalOpen(state);
            navigate("../", {
              relative: "path"
            });
          }}
          project={project}
          onProjectUpdateSuccess={() => {
            setIsAssignmentModalOpen(false);
            navigate("../", {
              relative: "path"
            });
          }}
        />
      )}
      <h3 className={utilsStyles.headingMd} style={{ marginBottom: "1rem" }}>
        All Projects
      </h3>
      <Tabs selectedTabClassName="react-tab-selected" defaultIndex={1}>
        <div
          style={{
            height: "52px",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          <TabList>
            {getTabs(user?.userType).map(({ key, title }) => {
              return <Tab key={key}>{title}</Tab>;
            })}
          </TabList>
        </div>

        {getTabs(user?.userType).map(({ key, component: Component }) => {
          return (
            <TabPanel key={key}>
              <Component />
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
};

export default TutorProjectsOutlet;
