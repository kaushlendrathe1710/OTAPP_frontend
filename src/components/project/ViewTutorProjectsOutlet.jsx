import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { createColumnHelper } from "@tanstack/react-table";
import api, { getAccessToken } from "../../services/api";
import BasicTable from "../table/BasicTable";
import AssignmentIdCell from "./common/AssignmentIdCell";
import ColumnSortHeader from "./common/ColumnSortHeader";
import { getBetterDateTime } from "./common/utils";
import utilsStyles from "../../styles/utils.module.scss";
import { uniqBy } from "lodash";
import sliceText from "../../lib/sliceText";

const columnHelper = createColumnHelper();

const ViewTutorProjectsOutlet = () => {
  const { tutorId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["view-tutor-assigned-project", { tutorId }],
    queryFn: () => getTutorAssignedProjects(tutorId),
    cacheTime: 0,
    staleTime: Infinity,
  });

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
    ];
  }, []);

  return (
    <div className={"outletContainer"}>
      <h3 className={utilsStyles.headingMd} style={{ marginBottom: "1rem" }}>
        Tutor Assigned Projects
      </h3>
      <div>
        <BasicTable
          tableKey="view-tutor-assigned-project-table-column-visibility"
          columns={columns}
          data={uniqBy(data?.projects, "_id")}
          // onEndReached={onEndReached}
          isLoading={isLoading}
          showColumnVisibilityToggleDropdown={true}
          SearchComponent={() =>
            isLoading ? null : (
              <h4>
                <span style={{ color: "var(--primary-500)" }}>
                  {data?.projects[0]?.assignedTo?.name}
                </span>{" "}
                assigned projects: {data?.projectCount}
              </h4>
            )
          }
        />
      </div>
    </div>
  );
};

export default ViewTutorProjectsOutlet;

async function getTutorAssignedProjects(tutorId) {
  const res = await api.get(
    `/project/get-tutor-assigned-projects-in-admin?tutorId=${tutorId}`,
    {
      headers: {
        Authorization: getAccessToken(),
      },
    }
  );

  return {
    projects: res.data?.projects || [],
    projectCount: res.data?.projectCount || 0,
  };
}
