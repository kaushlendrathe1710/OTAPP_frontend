import React, { useEffect, useContext } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { uniqBy } from "lodash";
import userContext from "../../context/userContext";
import { useInfiniteTutorProjectsQuery } from "../../hooks/useProjects";
import ColumnSortHeader from "./common/ColumnSortHeader";
import { ADMINS_PROJECT_TABS } from "../../../constants/helpers";
import { getBetterDateTime } from "./common/utils";
import AssignmentIdCell from "./common/AssignmentIdCell";
import BasicTable from "../table/BasicTable";
import { useTutorApplyProjectMutation } from "./common/Project.hooks";
import TutorProjectSubmitModal from "./common/TutorProjectSubmitModal";
import tableStyles from "../../styles/table.module.scss";
import MainChat from "../projectChat/MainChat";
import sliceText from "../../lib/sliceText";

const columnHelper = createColumnHelper();

const TutorProjects = ({ type }) => {
  const { socket, userData: user } = React.useContext(userContext);
  const limit = React.useRef(15).current;
  const {
    data: projectsData,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteTutorProjectsQuery({ type, limit });

  const [searchedProjects, setSearchedProjects] = React.useState([]);

  const flatData = React.useMemo(() => {
    return projectsData?.pages.map((page) => page.projects).flat() || [];
  }, [projectsData]);

  const columns = React.useMemo(() => {
    return [
      columnHelper.accessor("assignmentId", {
        id: "AssignmentId",
        cell: (props) => <AssignmentIdCell row={props.row} />,
        header: ({ column }) => (
          <ColumnSortHeader column={column} title={"Assignment Id"} />
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("assignmentTitle", {
        id: "Assignment Title",
        cell: (info) => (
          <span title={info.getValue()}>{sliceText(info.getValue(), 15)}</span>
        ),
        header: "Assignment Title",
      }),
      columnHelper.accessor("subject", {
        id: "Subject",
        cell: (info) => (
          <span title={info.getValue()}>{sliceText(info.getValue(), 15)}</span>
        ),
        header: "Subject",
      }),
      columnHelper.accessor("deadline", {
        id: "Deadline",
        cell: (info) => getBetterDateTime(info.getValue()),
        header: ({ column }) => (
          <ColumnSortHeader column={column} title={"Deadline"} />
        ),
      }),
      columnHelper.accessor("tutorPayment", {
        id: "Payment",
        header: "Payment",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("orderStatus", {
        id: "Status",
        header: "Status",
        cell: (info) =>
          ADMINS_PROJECT_TABS.filter(({ key }) => key === info.getValue())[0]
            .label,
      }),
      columnHelper.display({
        id: "Chat",
        header: "Chat",
        cell: (props) => <ChatActions row={props.row} />,
      }),
      columnHelper.display({
        id: "Actions",
        header: "Actions",
        cell: (props) => <ProjectActions row={props.row} />,
      }),
    ];
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("project_updated", (data) => {
        const { project: updatedProject } = data;
        setSearchedProjects((prev) =>
          prev.map((project) =>
            project._id === updatedProject._id ? updatedProject : project
          )
        );
      });
    }
  }, [socket]);

  const onEndReached = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage]);

  return (
    <>
      <div>
        <BasicTable
          tableKey="tutor-project-table-column-visibility"
          columns={columns}
          data={uniqBy(flatData, "_id")}
          onEndReached={onEndReached}
          isLoading={isLoading}
          showColumnVisibilityToggleDropdown={true}
        />
      </div>
    </>
  );
};

const ChatActions = ({ row }) => {
  const project = React.useMemo(() => {
    return row.original;
  }, [row.original]);

  const [isTutorChatModalOpen, setIsTutorChatModalOpen] = React.useState(false);

  return (
    <>
      <div className={tableStyles.tableActions}>
        {project.orderStatus === "assigned" ? (
          <button
            className="btnSecondary btn--small"
            onClick={() => setIsTutorChatModalOpen(true)}
          >
            Chat
          </button>
        ) : (
          <span>No actions.</span>
        )}
      </div>
      {isTutorChatModalOpen && (
        <MainChat
          open={isTutorChatModalOpen}
          setOpen={setIsTutorChatModalOpen}
          type={"tutor"}
          user={project}
        />
      )}
    </>
  );
};

const ProjectActions = ({ row }) => {
  const project = React.useMemo(() => {
    return row.original;
  }, [row.original]);
  const { userData: user } = useContext(userContext);

  const isAlreadyApplied = React.useMemo(() => {
    return (
      project.appliedTutors?.filter((tutor) => tutor?._id === user?._id)
        .length > 0
    );
  }, [project, user?._id]);

  const tutorApplyProjectMutation = useTutorApplyProjectMutation({
    oldProject: project,
  });

  const [isTutorProjectSubmitModalOpen, setIsTutorProjectSubmitModalOpen] =
    React.useState(false);
  const [isResubmission, setIsResubmission] = React.useState(false);

  const handleApplyProject = () => {
    tutorApplyProjectMutation.mutate();
  };

  const handleReSubmit = () => {
    setIsResubmission(true);
    setIsTutorProjectSubmitModalOpen(true);
  };

  const setOpen = (state) => {
    setIsTutorProjectSubmitModalOpen(state);
    setIsResubmission(false);
  };

  const StatusActions = () => {
    let actions;
    let DefaultActions = () => <span>No actions.</span>;
    switch (project.orderStatus) {
      case "assigned":
        actions = () => (
          <>
            <button
              className="btnNeutral btn--small"
              onClick={() => setIsTutorProjectSubmitModalOpen(true)}
            >
              Submit
            </button>
          </>
        );
        break;
      case "coAdminApproved":
        actions = () => (
          <>
            {!user?.isIpaApproved || !user?.isVerified || user?.isDeleted ? (
              <span>Not allowed.</span>
            ) : isAlreadyApplied ? (
              <button className="btnInfo btn--small" disabled={true}>
                Applied
              </button>
            ) : (
              <button
                className="btnInfo btn--small"
                onClick={handleApplyProject}
                disabled={tutorApplyProjectMutation.isLoading}
              >
                {tutorApplyProjectMutation.isLoading ? "Applying" : "Apply"}
              </button>
            )}
          </>
        );
        break;
      case "assignmentSubmitted":
        actions = () => (
          <>
            <button className="btnNeutral btn--small">Submission</button>
          </>
        );
        break;
      case "submissionRejected":
        actions = () => (
          <>
            <button className="btnNeutral btn--small" onClick={handleReSubmit}>
              Re-Submit
            </button>
          </>
        );
        break;
      case "submissionAccepted":
        actions = () => (
          <>
            <button className="btnNeutral btn--small">Review</button>
          </>
        );
        break;

      default:
        actions = DefaultActions;
        break;
    }
    return actions();
  };
  return (
    <div className={tableStyles.tableActions}>
      <StatusActions />
      <TutorProjectSubmitModal
        open={isTutorProjectSubmitModalOpen}
        setOpen={setOpen}
        isResubmission={isResubmission}
        project={project}
      />
    </div>
  );
};

export default TutorProjects;
