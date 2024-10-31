import { useContext } from "react";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import userContext from "../../../context/userContext";
import {
  approveAssignment,
  cancelAssignment,
  broadcastAssignment,
  reBroadcastAssignment,
  handleEmitProjectUpdateSocketEvent,
  updateProjectInAdminForModal,
  deleteFileInProject,
  assignProjectToTutor,
  acceptTutorProject,
  rejectTutorProject,
  submitProjectFeedback,
  tutorApplyProject,
  tutorSubmitProject,
  studentUpdateProjectPaymentStatus,
  studentCreateNewProject,
  handleEmitStudentCreateNewProjectEvent,
} from "./utils";
import getErrorMessageByStatusCode from "../../../lib/getErrorMessageByStatusCode";
import {
  ADMIN_PROJECT_ACTIONS,
  STUDENT_PROJECT_ACTIONS,
  TUTOR_PROJECT_ACTIONS,
} from "../../../../constants/helpers";

export const useProjectApproveMutation = ({
  project,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);

  return useMutation({
    mutationFn: ({ id, admin }) => approveAssignment({ id, admin }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.approve,
        oldOrderStatus: project.orderStatus,
        isOrderStatusUpdate: true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: null,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};

export const useProjectCancelMutation = ({ project, onSuccess = () => {} }) => {
  const { userData: user, socket } = useContext(userContext);

  return useMutation({
    mutationFn: ({ id }) => cancelAssignment({ id }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.cancel,
        oldOrderStatus: project.orderStatus,
        isOrderStatusUpdate: true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: null,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};

export const useProjectBroadcastMutation = ({
  project,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);

  return useMutation({
    mutationFn: ({ id, toSendAllTutors }) =>
      broadcastAssignment({ id, toSendAllTutors }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.broadcast,
        oldOrderStatus: project.orderStatus,
        isOrderStatusUpdate: true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: null,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};

export const useProjectReBroadcastMutation = ({
  project,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);

  return useMutation({
    mutationFn: ({ id }) => reBroadcastAssignment({ id }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.reBroadcast,
        oldOrderStatus: project.orderStatus,
        isOrderStatusUpdate: true,
        isAssignedTutorUpdate: true,
        oldAssignedTutor: project.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};

export const useUpdateProjectInAdminForModalMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ values }) =>
      updateProjectInAdminForModal({ oldProject, values, user }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.updateInAdminModal,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate:
        oldProject.orderStatus === updatedProject.orderStatus ? false : true,
        isAssignedTutorUpdate:
          oldProject.assignedTo?._id !== updatedProject.assignedTo?._id,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};

export const useProjectFileDeleteMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ project, fileUrl }) =>
      deleteFileInProject({ _id: project._id, fileUrl }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.deleteFile,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate: false,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
export const useAssignProjectToTutorMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ tutor }) =>
      assignProjectToTutor({ project: oldProject, tutor, admin: user }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.assign,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate: true,
        isAssignedTutorUpdate: true,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
export const useAcceptTutorProjectMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ submissionReview, supportingDocs }) =>
      acceptTutorProject({
        project: oldProject,
        submissionReview,
        supportingDocs,
        user,
      }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.accept,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate:
          oldProject.orderStatus === updatedProject.orderStatus ? false : true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
export const useRejectTutorProjectMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ submissionReview }) =>
      rejectTutorProject({
        project: oldProject,
        submissionReview,
      }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.reject,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate:
        oldProject.orderStatus === updatedProject.orderStatus ? false : true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
export const useSubmitProjectFeedbackMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ feedback }) =>
      submitProjectFeedback({ project: oldProject, feedback }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: ADMIN_PROJECT_ACTIONS.submitFeedback,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate:
        oldProject.orderStatus === updatedProject.orderStatus ? false : true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
export const useTutorApplyProjectMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: () => tutorApplyProject({ project: oldProject, tutor: user }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: TUTOR_PROJECT_ACTIONS.apply,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate:
        oldProject.orderStatus === updatedProject.orderStatus ? false : true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
export const useTutorSubmitProjectMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ values }) =>
      tutorSubmitProject({ project: oldProject, values }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: TUTOR_PROJECT_ACTIONS.submit,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate:
        oldProject.orderStatus === updatedProject.orderStatus ? false : true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
export const useStudentCreateNewProjectMutation = ({
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ values }) => studentCreateNewProject({ values }),
    onSuccess: (updatedProject) => {
      handleEmitStudentCreateNewProjectEvent({
        socket,
        project: updatedProject,
        createdBy: user,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
export const useStudentUpdateProjectPaymentStatusMutation = ({
  oldProject,
  onSuccess = () => {},
}) => {
  const { userData: user, socket } = useContext(userContext);
  return useMutation({
    mutationFn: ({ paymentStatus }) =>
      studentUpdateProjectPaymentStatus({ project: oldProject, paymentStatus }),
    onSuccess: (updatedProject) => {
      handleEmitProjectUpdateSocketEvent({
        socket,
        project: updatedProject,
        updatedBy: user,
        action: STUDENT_PROJECT_ACTIONS.projectPayNow,
        oldOrderStatus: oldProject.orderStatus,
        isOrderStatusUpdate:
        oldProject.orderStatus === updatedProject.orderStatus ? false : true,
        isAssignedTutorUpdate: false,
        oldAssignedTutor: oldProject.assignedTo,
      });
      onSuccess(updatedProject);
    },
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
