import React, { useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { uniqBy } from "lodash";
import userContext from "../../context/userContext";
import { useInfiniteAdminProjectsQuery } from "../../hooks/useProjects";
import api, { getAccessToken } from "../../services/api";
import { ProjectActions, ProjectChatActions } from "./common/ProjectActions";
import ColumnSortHeader from "./common/ColumnSortHeader";
import {
  ADMINS_PROJECT_TABS,
  ADMIN_PROJECT_ACTIONS,
} from "../../../constants/helpers";
import Search from "./common/Search";
import toast from "react-hot-toast";
import getErrorMessageByStatusCode from "../../lib/getErrorMessageByStatusCode";
import { getBetterDateTime } from "./common/utils";
import AssignmentIdCell from "./common/AssignmentIdCell";
import BasicTable from "../table/BasicTable";
import sliceText from "../../lib/sliceText";
import { Link } from "react-router-dom";
import { USER_TYPES } from "../../../constants/user";

const columnHelper = createColumnHelper();

const AdminProjects = ({ type }) => {
  const { socket, userData: user } = React.useContext(userContext);
  const searchTimeoutRef = React.useRef(null);
  const limit = React.useRef(15).current;
  const {
    data: projectsData,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteAdminProjectsQuery({ type, limit });

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchedProjects, setSearchedProjects] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);

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
      columnHelper.accessor("studentName", {
        id: "Student",
        cell: (info) => info.getValue(),
        header: "Student",
      }),
      columnHelper.accessor("assignedTo", {
        id: "Assigned To",
        cell: (info) =>
          info.getValue()?.name ? (
            user?.userType === USER_TYPES.admin || USER_TYPES.superAdmin ? (
              <Link
                to={`view-tutor-projects/${info.getValue()?._id}`}
                target="_blank"
              >
                {info.getValue().name}
              </Link>
            ) : (
              <span>{info.getValue().name}</span>
            )
          ) : (
            "-"
          ),
        header: ({ column }) => (
          <ColumnSortHeader column={column} title={"Assigned To"} />
        ),
      }),
      columnHelper.accessor("tutorPayment", {
        id: "T Payment",
        header: "T Payment",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("sPayment", {
        id: "S Payment",
        header: "S Payment",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        id: "Pay Satus",
        header: "Pay Satus",
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
        cell: (props) => <ProjectChatActions row={props.row} />,
      }),
      columnHelper.display({
        id: "Actions",
        header: "Actions",
        cell: (props) => (
          <ProjectActions
            row={props.row}
            onStatusActionCallback={onStatusActionCallback}
          />
        ),
      }),
    ];
  }, [onStatusActionCallback]);

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

  /**
   *
   * @param {{
   * action: "approve" | "cancel" | "broadcast" | "reBroadcast"
   * updatedProject: object
   * }} params
   */
  function onStatusActionCallback({ action, updatedProject }) {
    switch (action) {
      case ADMIN_PROJECT_ACTIONS.approve:
        setSearchedProjects((prev) =>
          prev.map((project) =>
            project._id === updatedProject._id ? updatedProject : project
          )
        );
        break;
      case ADMIN_PROJECT_ACTIONS.cancel:
        setSearchedProjects((prev) =>
          prev.map((project) =>
            project._id === updatedProject._id ? updatedProject : project
          )
        );
        break;
      case ADMIN_PROJECT_ACTIONS.broadcast:
        setSearchedProjects((prev) =>
          prev.map((project) =>
            project._id === updatedProject._id ? updatedProject : project
          )
        );
        break;
      case ADMIN_PROJECT_ACTIONS.reBroadcast:
        setSearchedProjects((prev) =>
          prev.map((project) =>
            project._id === updatedProject._id ? updatedProject : project
          )
        );
        break;
      default:
        break;
    }
  }

  const onEndReached = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage]);

  const onSearchTextChange = React.useCallback((value) => {
    let text = value;
    setSearchTerm(value);
    setIsSearching(true);

    // Clear the previous timeout to avoid calling the function with empty text
    clearTimeout(searchTimeoutRef.current);

    if (!text) {
      setIsSearching(false);
      setSearchedProjects([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const searchedData = await searchProjects(text, type);
        setSearchedProjects(searchedData);
      } catch (err) {
        toast.error(getErrorMessageByStatusCode(err.response.status));
      } finally {
        setIsSearching(false);
      }
    }, 1000);
  }, []);

  const SearchComponent = React.useCallback(() => {
    return <Search onSearchTextChange={onSearchTextChange} />;
  }, [onSearchTextChange]);

  return (
    <>
      <div>
        <BasicTable
          tableKey="project-table-column-visibility"
          columns={columns}
          data={uniqBy(searchTerm ? searchedProjects : flatData, "_id")}
          onEndReached={onEndReached}
          SearchComponent={SearchComponent}
          isSearching={isSearching}
          isLoading={isLoading}
          showColumnVisibilityToggleDropdown={true}
        />
      </div>
    </>
  );
};

export default AdminProjects;

async function searchProjects(searchTerm, currentTab) {
  const token = getAccessToken();
  const res = await api.get(`/project/get-searched-projects`, {
    params: {
      query: searchTerm,
      tab: currentTab,
    },
    headers: {
      Authorization: token,
    },
  });
  return res.data;
}
