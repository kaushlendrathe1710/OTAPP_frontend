import React, { useContext, useState } from "react";
import userContext from "../../../context/userContext";
import {
  useProjectApproveMutation,
  useProjectBroadcastMutation,
  useProjectCancelMutation,
  useProjectReBroadcastMutation,
} from "./Project.hooks";
import { USER_TYPES } from "../../../../constants/user";
import { ADMIN_PROJECT_ACTIONS } from "../../../../constants/helpers";
import tableStyles from "../../../styles/table.module.scss";
import TutorApplicationsModal from "./TutorApplicationsModal";
import TutorSubmissionModal from "./TutorSubmissionModal";
import ProjectFeedbackModal from "./ProjectFeedbackModal";
import MainChat from "../../projectChat/MainChat";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";

export const ProjectChatActions = ({ row }) => {
  const project = row.original;
  const [isStudentChatModalOpen, setIsStudentChatModalOpen] = useState(false);
  const [isTutorChatModalOpen, setIsTutorChatModalOpen] = useState(false);
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="btnNeutral btn--small" aria-label="Chat Actoins">
            Chat
            <IoIosArrowDown style={{ marginLeft: -5 }} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
            <DropdownMenu.Item>
              <button
                className="btnSecondary btn--small btn--full"
                onClick={() => setIsStudentChatModalOpen(true)}
              >
                Student
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              {project?.assignedTo && (
                <button
                  className="btnSecondary btn--small btn--full"
                  onClick={() => setIsTutorChatModalOpen(true)}
                  style={{ marginTop: 8 }}
                >
                  Tutor
                </button>
              )}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {isStudentChatModalOpen && (
        <MainChat
          open={isStudentChatModalOpen}
          setOpen={setIsStudentChatModalOpen}
          type={"student"}
          user={project}
        />
      )}
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
export const ProjectActions = ({
  row,
  toSendAllTutors = true,
  onStatusActionCallback = () => {},
  forModal = false,
}) => {
  const project = row.original;

  const { orderStatus } = project;
  const { userData: user } = useContext(userContext);

  const [isTutorApplicationsModalOpen, setIsTutorApplicationsModalOpen] =
    useState(false);
  const [isTutorSubmissionModalOpen, setIsTutorSubmissionModalOpen] =
    useState(false);
  const [isProvideFeedbackModalOpen, setIsProvideFeedbackModalOpen] =
    useState(false);

  const approveProjectMutation = useProjectApproveMutation({
    project,
    onSuccess: (updatedProject) =>
      onStatusActionCallback({
        action: ADMIN_PROJECT_ACTIONS.approve,
        updatedProject,
      }),
  });
  const cancelProjectMutation = useProjectCancelMutation({
    project,
    onSuccess: (updatedProject) =>
      onStatusActionCallback({
        action: ADMIN_PROJECT_ACTIONS.cancel,
        updatedProject,
      }),
  });
  const broadcastProjectMutation = useProjectBroadcastMutation({
    project,
    onSuccess: (updatedProject) =>
      onStatusActionCallback({
        action: ADMIN_PROJECT_ACTIONS.broadcast,
        updatedProject,
      }),
  });
  const reBroadcastProjectMutation = useProjectReBroadcastMutation({
    project,
    onSuccess: (updatedProject) =>
      onStatusActionCallback({
        action: ADMIN_PROJECT_ACTIONS.reBroadcast,
        updatedProject,
      }),
  });

  const handleApproveBtnPress = () => {
    approveProjectMutation.mutate({ id: project._id, admin: user });
  };
  const handleCancelBtnPress = () => {
    cancelProjectMutation.mutate({ id: project._id });
  };
  const handleBroadcastBtnPress = () => {
    broadcastProjectMutation.mutate({ id: project._id, toSendAllTutors });
  };
  const handleReBroadcastBtnPress = () => {
    reBroadcastProjectMutation.mutate({ id: project._id });
  };

  const StatusActions = ({ btnClass = "" }) => {
    let actions;
    let DefaultActions = () => <span>No actions.</span>;
    switch (orderStatus) {
      case "newAssignment":
        actions = () =>
          user?.userType === USER_TYPES.admin ||
          user?.userType === USER_TYPES.superAdmin ? (
            <>
              {/* <DropdownMenu.Item> */}
              <button
                className={`btnSuccess btn--small ${btnClass}`}
                onClick={handleApproveBtnPress}
                disabled={cancelProjectMutation.isLoading}
              >
                {approveProjectMutation.isLoading ? "Approving" : "Approve"}
              </button>
              {/* </DropdownMenu.Item> */}
              {/* <DropdownMenu.Item> */}
              <button
                className={`btnDanger btn--small ${btnClass}`}
                onClick={handleCancelBtnPress}
                disabled={approveProjectMutation.isLoading}
              >
                {cancelProjectMutation.isLoading ? "Cancelling" : "Cancel"}
              </button>
              {/* </DropdownMenu.Item> */}
            </>
          ) : (
            <DefaultActions />
          );
        break;
      case "adminRejected":
        actions = DefaultActions;
        break;
      case "adminApproved":
        actions = () => (
          <>
            {/* <DropdownMenu.Item> */}
            <button
              className={`btnInfo btn--small ${btnClass}`}
              onClick={handleBroadcastBtnPress}
              disabled={broadcastProjectMutation.isLoading}
            >
              {broadcastProjectMutation.isLoading
                ? "Broadcasting"
                : "Broadcast"}
            </button>
            {/* </DropdownMenu.Item> */}
          </>
        );
        break;
      case "assignmentSubmitted":
        actions = () => (
          <>
            {/* <DropdownMenu.Item> */}
            <button
              className={`btnNeutral btn--small ${btnClass}`}
              onClick={() => setIsTutorSubmissionModalOpen(true)}
            >
              Submission
            </button>
            {/* </DropdownMenu.Item> */}
            {/* <DropdownMenu.Item> */}
            <button
              className={`btnInfo btn--small ${btnClass}`}
              onClick={handleReBroadcastBtnPress}
              disabled={reBroadcastProjectMutation.isLoading}
            >
              {reBroadcastProjectMutation.isLoading
                ? "Re-Broadcasting"
                : "Re-Broadcast"}
            </button>
            {/* </DropdownMenu.Item> */}
          </>
        );
        break;
      case "coAdminApproved":
        actions = () => (
          <>
            {/* <DropdownMenu.Item> */}
            <button
              className={`btnNeutral btn--small ${btnClass}`}
              onClick={() => setIsTutorApplicationsModalOpen(true)}
            >
              Applications
            </button>
            {/* </DropdownMenu.Item> */}
          </>
        );
        break;
      case "assigned":
      case "submissionRejected":
        actions = () => (
          <>
            {/* <DropdownMenu.Item> */}
            <button
              className={`btnInfo btn--small ${btnClass}`}
              onClick={handleReBroadcastBtnPress}
              disabled={reBroadcastProjectMutation.isLoading}
            >
              {reBroadcastProjectMutation.isLoading
                ? "Re-Broadcasting"
                : "Re-Broadcast"}
            </button>
            {/* </DropdownMenu.Item> */}
          </>
        );
        break;
      case "submissionAccepted":
        actions = () => (
          <>
            {/* <DropdownMenu.Item> */}
            <button
              className={`btnNeutral btn--small ${btnClass}`}
              onClick={() => setIsProvideFeedbackModalOpen(true)}
            >
              Feedback
            </button>
            {/* </DropdownMenu.Item> */}
            {/* <DropdownMenu.Item> */}
            <button
              className={`btnNeutral btn--small ${btnClass}`}
              onClick={() => setIsTutorSubmissionModalOpen(true)}
            >
              Submission
            </button>
            {/* </DropdownMenu.Item> */}
          </>
        );
        break;
      default:
        break;
    }
    return actions();
  };

  return (
    <div className={tableStyles.tableActions}>
      {!forModal ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="btnIcon btnIconNeutral btnIcon--small"
              aria-label="Actoins"
            >
              {/* Actions */}
              <HiOutlineDotsVertical />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="DropdownMenuContent"
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
              sideOffset={5}
            >
              <StatusActions btnClass="btn--full" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <StatusActions />
      )}

      {/* modals which will be triggered by upper actions */}
      <TutorApplicationsModal
        open={isTutorApplicationsModalOpen}
        setOpen={setIsTutorApplicationsModalOpen}
        project={project}
      />
      <TutorSubmissionModal
        open={isTutorSubmissionModalOpen}
        setOpen={setIsTutorSubmissionModalOpen}
        project={project}
      />
      <ProjectFeedbackModal
        open={isProvideFeedbackModalOpen}
        setOpen={setIsProvideFeedbackModalOpen}
        project={project}
      />
    </div>
  );
};
