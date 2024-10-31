import React from "react";
import AssignmentModal from "./AssignmentModal";

const AssignmentIdCell = ({ row }) => {
  const project = React.useMemo(() => row.original, [row.original]);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div className="AssignmentModalTrigger" onClick={() => setOpen(true)}>
        {project.assignmentId}
      </div>
      <AssignmentModal
        open={open}
        setOpen={setOpen}
        project={project}
        onProjectUpdateSuccess={() => setOpen(false)}
      />
    </>
  );
};

export default AssignmentIdCell;
