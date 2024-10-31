import React, { useEffect, useContext } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { uniqBy } from "lodash";
import userContext from "../../context/userContext";
import { useInfiniteStudentProjectsQuery } from "../../hooks/useProjects";
import ColumnSortHeader from "./common/ColumnSortHeader";
import { ADMINS_PROJECT_TABS } from "../../../constants/helpers";
import { getBetterDateTime } from "./common/utils";
import AssignmentIdCell from "./common/AssignmentIdCell";
import BasicTable from "../table/BasicTable";
import tableStyles from "../../styles/table.module.scss";
import { useStudentUpdateProjectPaymentStatusMutation } from "./common/Project.hooks";
import PaymentModal from "../student/dashboard/student_components/post_projects/paymentModal";
import MainChat from "../projectChat/MainChat";
import sliceText from "../../lib/sliceText";

const columnHelper = createColumnHelper();

const StudentProjects = () => {
  const { socket, userData: user } = React.useContext(userContext);
  const limit = React.useRef(15).current;
  const {
    data: projectsData,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteStudentProjectsQuery({ limit });

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
      columnHelper.accessor("sPayment", {
        id: "Payment",
        header: "Payment",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        id: "Pay Status",
        header: "Pay Status",
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
          tableKey="student-project-table-column-visibility"
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

const ProjectActions = ({ row }) => {
  const project = React.useMemo(() => {
    return row.original;
  }, [row.original]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isStudentChatModalOpen, setIsStudentChatModalOpen] =
    React.useState(false);
  const studentUpdateProjectPaymentStatusMutation =
    useStudentUpdateProjectPaymentStatusMutation({ oldProject: project });

  const handleSubmit = (paymentStatus) => {
    studentUpdateProjectPaymentStatusMutation.mutate({ paymentStatus });
  };

  return (
    <>
      <div className={tableStyles.tableActions}>
        <button
          className="btnSecondary btn--small"
          onClick={() => setIsStudentChatModalOpen(true)}
        >
          Chat
        </button>
        {project.status === "Paid" ? null : (
          <button
            className="btnPrimary btn--small"
            onClick={() => setIsPaymentModalOpen(true)}
          >
            Pay Now
          </button>
        )}
      </div>
      {isStudentChatModalOpen && (
        <MainChat
          open={isStudentChatModalOpen}
          setOpen={setIsStudentChatModalOpen}
          type={"student"}
          user={project}
        />
      )}
      {isPaymentModalOpen && (
        <PaymentModal
          open={isPaymentModalOpen}
          setOpen={setIsPaymentModalOpen}
          assignmentTitle={project.assignmentTitle}
          currency={"INR"}
          totalAmount={project.sPayment}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default StudentProjects;
