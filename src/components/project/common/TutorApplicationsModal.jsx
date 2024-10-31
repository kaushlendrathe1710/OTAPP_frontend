import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { createColumnHelper } from "@tanstack/react-table";
import { uniqBy } from "lodash";
import BasicTable from "../../table/BasicTable";
import { useAssignProjectToTutorMutation } from "./Project.hooks";

const columnHelper = createColumnHelper();

const TutorApplicationsModal = ({ project, open = false, setOpen }) => {
  const data = React.useMemo(() => {
    return project?.appliedTutors || [];
  }, [project]);
  const columns = React.useMemo(() => {
    return [
      columnHelper.accessor("name", {
        id: "Tutor Name",
        cell: (info) => info.getValue(),
        header: "Tutor Name",
      }),
      columnHelper.accessor("email", {
        id: "Tutor Email",
        cell: (info) => info.getValue(),
        header: "Tutor Email",
      }),
      columnHelper.accessor("isIpaApproved", {
        id: "Approved",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
        header: "Approved",
      }),
      columnHelper.accessor("isVerified", {
        id: "Verified",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
        header: "Verified",
      }),
      columnHelper.display({
        id: "Actions",
        header: "Actions",
        cell: (props) => (
          <Actions
            row={props.row}
            project={project}
            onActionCallback={onActionCallback}
          />
        ),
      }),
    ];
  }, [onActionCallback]);

  function onActionCallback() {
    setOpen(false);
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content
          className="DialogContent"
          style={{ maxWidth: "1280px" }}
        >
          <Dialog.Title className="DialogTitle">
            Tutor Applications : {project.assignmentId}
          </Dialog.Title>
          <BasicTable
            tableKey="tutor-applications-modal-table"
            data={uniqBy(data, "_id")}
            columns={columns}
            showHeader={false}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TutorApplicationsModal;

const Actions = ({ row, project }) => {
  const tutor = row.original;

  const assignProjectToTutorMutation = useAssignProjectToTutorMutation({
    oldProject: project,
  });

  const handleOnAssignBtnClick = () => {
    assignProjectToTutorMutation.mutate({
      tutor,
    });
  };
  return (
    <button
      className="btnInfo btn--small"
      onClick={handleOnAssignBtnClick}
      disabled={assignProjectToTutorMutation.isLoading}
    >
      {assignProjectToTutorMutation.isLoading ? "Assigning" : "Assign"}
    </button>
  );
};
