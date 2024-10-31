import toast from "react-hot-toast";
import api, { getAccessToken } from "../../../services/api";
import { ADMIN_PROJECT_ACTIONS } from "../../../../constants/helpers";
import { USER_TYPES } from "../../../../constants/user";

export const approveAssignment = async ({ id, admin }) => {
  try {
    let accessToken = getAccessToken();
    const data = {
      data: {
        orderStatus: "adminApproved",
      },
      id: id,
      admin: admin,
    };

    let res = await api.patch("/project/update-project-in-admin", data, {
      headers: { Authorization: accessToken },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const cancelAssignment = async ({ id }) => {
  try {
    let accessToken = getAccessToken();
    const data = {
      data: {
        orderStatus: "adminRejected",
      },
      id: id,
    };
    let res = await api.patch("/project/update-project-in-admin", data, {
      headers: { Authorization: accessToken },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const broadcastAssignment = async ({ id, toSendAllTutors }) => {
  try {
    let accessToken = getAccessToken();
    const data = {
      data: {
        orderStatus: "coAdminApproved",
        assignTo: null,
        toSendAllTutors: toSendAllTutors,
      },
      id: id,
    };
    let res = await api.patch("/project/update-project-in-admin", data, {
      headers: { Authorization: accessToken },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const reBroadcastAssignment = async ({ id }) => {
  try {
    let accessToken = getAccessToken();
    const data = {
      data: {
        orderStatus: "coAdminApproved",
        appliedTutors: [],
        assignTo: null,
      },
      id: id,
    };

    let res = await api.patch("/project/update-project-in-admin", data, {
      headers: { Authorization: accessToken },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProjectInAdminForModal = async ({
  oldProject,
  values,
  user,
}) => {
  if (!values || !user)
    throw new Error(
      "Please provide all fields for updating project in admin for modal"
    );
  try {
    // values is formik values (updated values of project)
    const formData = new FormData();
    for (let d in values) {
      if (
        user.userType === USER_TYPES.coAdmin ||
        user.userType === USER_TYPES.subAdmin
      ) {
        if (d === "assignedCoAdmin") {
          continue;
        }
      }
      if (d === "supportingDocs") {
        values[d].forEach((item) => {
          formData.append("files", item);
        });
      }
      if (d === "referencingStyle") {
        formData.append("style", values[d]);
      } else {
        formData.append(d, values[d]);
      }
    }
    formData.append("id", oldProject._id);
    formData.append("uploadedBy", user._id);

    const res = await api.patch(
      "/project/update-project-in-admin-for-modal",
      formData,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    return res.data; // return updated project
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteFileInProject = async ({ _id, fileUrl }) => {
  if (!_id || !fileUrl)
    throw new Error("Please provide all fields to delete file in project");
  try {
    const res = await api.patch(
      "/project/delete-file",
      {
        _id,
        fileUrl,
      },
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const assignProjectToTutor = async ({ project, tutor, admin }) => {
  try {
    const data = {
      data: {
        orderStatus: "assigned",
        assignTo: tutor._id,
      },
      id: project._id,
      admin: admin,
    };
    const res = await api.patch("/project/update-project-in-admin", data, {
      headers: { Authorization: getAccessToken() },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const acceptTutorProject = async ({
  project,
  submissionReview,
  supportingDocs,
  user,
}) => {
  try {
    const values = {
      orderStatus: "submissionAccepted",
      feedbackReview: submissionReview,
      supportingDocs,
    };
    const formData = new FormData();
    for (let d in values) {
      if (d === "supportingDocs") {
        values[d].forEach((item) => {
          formData.append("files", item);
        });
      } else {
        formData.append(d, values[d]);
      }
    }
    formData.append("id", project._id);
    formData.append("uploadedBy", user._id);

    const res = await api.patch(
      "/project/update-project-in-admin-for-modal-completed-resubmission/",
      formData,
      {
        headers: { Authorization: getAccessToken() },
      }
    );

    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;

    let tutorLogInTime = new Date(
      `${project?.assignedTo?.createdAt}`
    ).getTime();

    let nowTime = Date.now();

    let days = Math.floor((nowTime - tutorLogInTime) / day);
    let i = 0;
    function getWeeksFromDays(days) {
      if (days <= 7) {
        ++i;
        let weekObj = { week: i };
        return [weekObj];
      } else {
        ++i;
        let weekObj = { week: i };
        let weeks = [weekObj].concat(getWeeksFromDays(days - 7));
        return weeks;
      }
    }
    const newWeeks = getWeeksFromDays(days);
    let currentWorkingWeek = newWeeks[newWeeks.length - 1];

    let tutorWeekData = {
      week: currentWorkingWeek.week,
      paymentId: "",
      status: "Un-Paid",
      amountPaid: 0,
      fileURL: "",
      projects: [
        {
          projectId: project._id,
          completionDate: Date.now(),
        },
      ],
    };
    let data = {
      data: { ...tutorWeekData },
      id: project?.assignedTo?._id,
    };
    await api.patch("/payment/edit-tutor-payment-by-id", data, {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const rejectTutorProject = async ({ project, submissionReview }) => {
  try {
    const data = {
      data: {
        orderStatus: "submissionRejected",
        feedbackReview: submissionReview,
      },
      id: project._id,
    };

    const res = await api.patch("/project/update-project-in-admin", data, {
      headers: { Authorization: getAccessToken() },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const submitProjectFeedback = async ({ project, feedback }) => {
  try {
    const data = {
      data: {
        feedbackReview: feedback,
      },
      id: project._id,
    };
    const res = await api.patch("/project/update-project-in-admin", data, {
      headers: { Authorization: getAccessToken() },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const tutorApplyProject = async ({ project, tutor }) => {
  try {
    const data = {
      data: {
        appliedTutors: [
          ...project.appliedTutors?.map((tutor) => tutor._id),
          tutor._id,
        ],
      },
      id: project._id,
    };
    const res = await api.patch("/project/update-project-in-tutor", data, {
      headers: { Authorization: getAccessToken() },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const tutorSubmitProject = async ({ project, values }) => {
  try {
    const formData = new FormData();
    const data = {
      changes: values.changes,
      files: values.files,
      id: project._id,
      orderStatus: "assignmentSubmitted",
    };
    for (let i in data) {
      if (i === "files") {
        data[i].forEach((item) => {
          formData.append(i, item);
        });
      } else {
        formData.append(i, data[i]);
      }
    }
    const res = await api.patch("/project/update-project-in-tutor/", formData, {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const studentCreateNewProject = async ({ values }) => {
  try {
    const formData = new FormData();
    for (let d in values) {
      if (d === "files") {
        values[d].forEach((item) => {
          formData.append(d, item);
        });
      }
      if (d === "additionalNotes") {
        if (values[d] === "") {
          values[d] = ".";
        }
      }
      if (d === "documentType") {
        if (values[d].length === 1) {
          values[d].forEach((item) => {
            formData.append(d, item);
            formData.append(d, "extra");
          });
        } else {
          values[d].forEach((item) => {
            formData.append(d, item);
          });
        }
      } else {
        formData.append(d, values[d]);
      }
    }
    let res = await api.post("/project/student-upload", formData, {
      headers: { Authorization: getAccessToken() },
    });
    return res.data;
  } catch (error) {
    return new Error(error);
  }
};
export const studentUpdateProjectPaymentStatus = async ({
  paymentStatus,
  project,
}) => {
  try {
    let formData;

    if (paymentStatus) {
      formData = {
        _id: project._id,
        status: "Paid",
      };
    }
    let res = await api.post("/project/student-payment-update", formData, {
      headers: { Authorization: getAccessToken() },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

/// Query cached data updation

const updateQueryCachedDataIfQueryExists = ({
  queryClient,
  queryKey,
  onSuccess = () => {},
}) => {
  if (!queryClient || !queryKey)
    throw new Error("Please provide all fields to update cached data");
  const isQueryExists = queryClient.getQueryData(queryKey);
  if (isQueryExists === undefined) return;
  onSuccess();
};

const updateAdminQueryCachedDataOnStudentCreatedNewProject = ({
  queryClient,
  project,
  createdBy,
}) => {
  // add project in these tabs: "newAssignment", "all"
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["projects", { type: "newAssignment" }],
    onSuccess: () =>
      queryClient.setQueryData(
        ["projects", { type: "newAssignment" }],
        (data) => {
          if (!data) return;
          let newPagesArray = data?.pages.map((page, index) => {
            return index === 0
              ? { ...page, projects: [project, ...page.projects] }
              : page;
          });

          return {
            pages: newPagesArray,
            pageParams: data?.pageParams,
          };
        }
      ),
  });
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["projects", { type: "all" }],
    onSuccess: () =>
      queryClient.setQueryData(["projects", { type: "all" }], (data) => {
        if (!data) return;
        let newPagesArray = data?.pages.map((page, index) => {
          return index === 0
            ? { ...page, projects: [project, ...page.projects] }
            : page;
        });

        return {
          pages: newPagesArray,
          pageParams: data?.pageParams,
        };
      }),
  });
};

const updateStudentQueryCachedDataOnStudentCreatedNewProject = ({
  queryClient,
  project,
  createdBy,
}) => {
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["student-projects"],
    onSuccess: () =>
      queryClient.setQueryData(["student-projects"], (data) => {
        if (!data) return;
        let newPagesArray = data?.pages.map((page, index) => {
          return index === 0
            ? { ...page, projects: [project, ...page.projects] }
            : page;
        });

        return {
          pages: newPagesArray,
          pageParams: data?.pageParams,
        };
      }),
  });
};

const updateAdminQueryCachedDataOnOrderStatusUpdate = ({
  queryClient,
  updatedProject,
  updatedBy,
  action,
  oldOrderStatus,
}) => {
  // 1. remove project
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["projects", { type: oldOrderStatus }],
    onSuccess: () =>
      queryClient.setQueryData(
        ["projects", { type: oldOrderStatus }],
        (data) => {
          if (!data) return;
          return {
            pages: data?.pages.map((page) => ({
              ...page,
              projects: page.projects.filter(
                (project) => project._id !== updatedProject._id
              ),
            })),
            pageParams: data?.pageParams,
          };
        }
      ),
  });

  // 2. add project
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["projects", { type: updatedProject.orderStatus }],
    onSuccess: () =>
      queryClient.setQueryData(
        ["projects", { type: updatedProject.orderStatus }],
        (data) => {
          if (!data) return;
          let newPagesArray = data?.pages.map((page, index) => {
            return index === 0
              ? { ...page, projects: [updatedProject, ...page.projects] }
              : page;
          });

          return {
            pages: newPagesArray,
            pageParams: data?.pageParams,
          };
        }
      ),
  });

  // 3. update project in 'all' tab
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["projects", { type: "all" }],
    onSuccess: () =>
      queryClient.setQueryData(["projects", { type: "all" }], (data) => {
        if (!data) return;
        return {
          pages: data?.pages.map((page) => ({
            ...page,
            projects: page.projects.map((project) =>
              project._id === updatedProject._id ? updatedProject : project
            ),
          })),
          pageParams: data?.pageParams,
        };
      }),
  });

  // 4. update project in 'urgent' tab if orderStatus is included in filter
  const filter = [
    "coAdminApproved",
    "assigned",
    "assignmentSubmitted",
    "submissionAccepted",
    "submissionRejected",
  ];
  if (filter.includes(updatedProject.orderStatus)) {
    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["projects", { type: "urgent" }],
      onSuccess: () =>
        queryClient.setQueryData(["projects", { type: "urgent" }], (data) => {
          if (!data) return;
          let newPagesArray = data?.pages.map((page) => ({
            ...page,
            projects: page.projects.map((project) =>
              project._id === updatedProject._id ? updatedProject : project
            ),
          }));
          return {
            pages: newPagesArray,
            pageParams: data?.pageParams,
          };
        }),
    });
  }
  if (action === ADMIN_PROJECT_ACTIONS.reBroadcast) {
    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["projects", { type: "assigned" }],
      onSuccess: () =>
        queryClient.setQueryData(["projects", { type: "assigned" }], (data) => {
          if (!data) return;
          return {
            pages: data?.pages.map((page) => ({
              ...page,
              projects: page.projects.filter(
                (project) => project._id !== updatedProject._id
              ),
            })),
            pageParams: data?.pageParams,
          };
        }),
    });

    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["projects", { type: "assignmentSubmitted" }],
      onSuccess: () =>
        queryClient.setQueryData(
          ["projects", { type: "assignmentSubmitted" }],
          (data) => {
            if (!data) return;
            return {
              pages: data?.pages.map((page) => ({
                ...page,
                projects: page.projects.filter(
                  (project) => project._id !== updatedProject._id
                ),
              })),
              pageParams: data?.pageParams,
            };
          }
        ),
    });

    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["projects", { type: "submissionRejected" }],
      onSuccess: () =>
        queryClient.setQueryData(
          ["projects", { type: "submissionRejected" }],
          (data) => {
            if (!data) return;
            return {
              pages: data?.pages.map((page) => ({
                ...page,
                projects: page.projects.filter(
                  (project) => project._id !== updatedProject._id
                ),
              })),
              pageParams: data?.pageParams,
            };
          }
        ),
    });
  }
};
const updateAdminQueryCachedDataOnOrderStatusNotUpdated = ({
  queryClient,
  updatedProject,
  updatedBy,
  action,
}) => {
  // take a look at upper function for more info
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["projects", { type: updatedProject.orderStatus }],
    onSuccess: () =>
      queryClient.setQueryData(
        ["projects", { type: updatedProject.orderStatus }],
        (data) => {
          if (!data) return;
          return {
            pages: data?.pages.map((page) => ({
              ...page,
              projects: page.projects.map((project) =>
                project._id === updatedProject._id ? updatedProject : project
              ),
            })),
            pageParams: data?.pageParams,
          };
        }
      ),
  });

  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["projects", { type: "all" }],
    onSuccess: () =>
      queryClient.setQueryData(["projects", { type: "all" }], (data) => {
        if (!data) return;
        return {
          pages: data?.pages.map((page) => ({
            ...page,
            projects: page.projects.map((project) =>
              project._id === updatedProject._id ? updatedProject : project
            ),
          })),
          pageParams: data?.pageParams,
        };
      }),
  });

  const filter = [
    "coAdminApproved",
    "assigned",
    "assignmentSubmitted",
    "submissionAccepted",
    "submissionRejected",
  ];
  if (filter.includes(updatedProject.orderStatus)) {
    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["projects", { type: "urgent" }],
      onSuccess: () =>
        queryClient.setQueryData(["projects", { type: "urgent" }], (data) => {
          if (!data) return;
          let newPagesArray = data?.pages.map((page) => ({
            ...page,
            projects: page.projects.map((project) =>
              project._id === updatedProject._id ? updatedProject : project
            ),
          }));
          return {
            pages: newPagesArray,
            pageParams: data?.pageParams,
          };
        }),
    });
  }
};
const updateTutorQueryCachedDataOnOrderStatusUpdate = ({
  queryClient,
  updatedProject,
  updatedBy,
  user,
  action,
  oldOrderStatus,
}) => {
  // 1. remove project
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["tutor-projects", { type: oldOrderStatus }],
    onSuccess: () =>
      queryClient.setQueryData(
        ["tutor-projects", { type: oldOrderStatus }],
        (data) => {
          if (!data) return;
          return {
            pages: data?.pages.map((page) => ({
              ...page,
              projects: page.projects.filter(
                (project) => project._id !== updatedProject._id
              ),
            })),
            pageParams: data?.pageParams,
          };
        }
      ),
  });
  // 2. Add project
  if (
    updatedProject.orderStatus === "assigned" &&
    updatedProject.assignedTo._id === user._id
  ) {
    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["tutor-projects", { type: updatedProject.orderStatus }],
      onSuccess: () =>
        queryClient.setQueryData(
          ["tutor-projects", { type: updatedProject.orderStatus }],
          (data) => {
            if (!data) return;
            let newPagesArray = data?.pages.map((page, index) => {
              return index === 0
                ? { ...page, projects: [updatedProject, ...page.projects] }
                : page;
            });

            return {
              pages: newPagesArray,
              pageParams: data?.pageParams,
            };
          }
        ),
    });
    // add/update project in 'myProjects' tab
    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["tutor-projects", { type: "myProjects" }],
      onSuccess: () =>
        queryClient.setQueryData(
          ["tutor-projects", { type: "myProjects" }],
          (data) => {
            if (!data) return;
            const flatProjects = data?.pages
              .map((page) => page.projects)
              .flat();
            const isProjectAlreadyExist =
              flatProjects.filter(
                (project) => project._id === updatedProject._id
              ).length > 0;
            const newPagesArray = isProjectAlreadyExist
              ? data?.pages.map((page) => ({
                  ...page,
                  projects: page.projects.map((project) =>
                    project._id === updatedProject._id
                      ? updatedProject
                      : project
                  ),
                }))
              : data?.pages.map((page, index) => {
                  return index === 0
                    ? { ...page, projects: [updatedProject, ...page.projects] }
                    : page;
                });
            return {
              pages: newPagesArray,
              pageParams: data?.pageParams,
            };
          }
        ),
    });
  } else {
    if (updatedProject.assignedTo._id === user._id) {
      updateQueryCachedDataIfQueryExists({
        queryClient,
        queryKey: ["tutor-projects", { type: "myProjects" }],
        onSuccess: () =>
          queryClient.setQueryData(
            ["tutor-projects", { type: "myProjects" }],
            (data) => {
              if (!data) return;
              const newPagesArray = data?.pages.map((page) => ({
                ...page,
                projects: page.projects.map((project) =>
                  project._id === updatedProject._id ? updatedProject : project
                ),
              }));
              return {
                pages: newPagesArray,
                pageParams: data?.pageParams,
              };
            }
          ),
      });
    }
    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["tutor-projects", { type: updatedProject.orderStatus }],
      onSuccess: () =>
        queryClient.setQueryData(
          ["tutor-projects", { type: updatedProject.orderStatus }],
          (data) => {
            if (!data) return;
            let newPagesArray = data?.pages.map((page, index) => {
              return index === 0
                ? { ...page, projects: [updatedProject, ...page.projects] }
                : page;
            });

            return {
              pages: newPagesArray,
              pageParams: data?.pageParams,
            };
          }
        ),
    });
  }

  // 3. update project in 'all' tab
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["tutor-projects", { type: "all" }],
    onSuccess: () =>
      queryClient.setQueryData(["tutor-projects", { type: "all" }], (data) => {
        if (!data) return;
        return {
          pages: data?.pages.map((page) => ({
            ...page,
            projects: page.projects.map((project) =>
              project._id === updatedProject._id ? updatedProject : project
            ),
          })),
          pageParams: data?.pageParams,
        };
      }),
  });
};
const updateTutorQueryCachedDataOnOrderStatusNotUpdated = ({
  queryClient,
  updatedProject,
  updatedBy,
  action,
}) => {
  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["tutor-projects", { type: updatedProject.orderStatus }],
    onSuccess: () =>
      queryClient.setQueryData(
        ["tutor-projects", { type: updatedProject.orderStatus }],
        (data) => {
          if (!data) return;
          return {
            pages: data?.pages.map((page) => ({
              ...page,
              projects: page.projects.map((project) =>
                project._id === updatedProject._id ? updatedProject : project
              ),
            })),
            pageParams: data?.pageParams,
          };
        }
      ),
  });

  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["tutor-projects", { type: "all" }],
    onSuccess: () =>
      queryClient.setQueryData(["tutor-projects", { type: "all" }], (data) => {
        if (!data) return;
        return {
          pages: data?.pages.map((page) => ({
            ...page,
            projects: page.projects.map((project) =>
              project._id === updatedProject._id ? updatedProject : project
            ),
          })),
          pageParams: data?.pageParams,
        };
      }),
  });

  updateQueryCachedDataIfQueryExists({
    queryClient,
    queryKey: ["tutor-projects", { type: "myProjects" }],
    onSuccess: () =>
      queryClient.setQueryData(
        ["tutor-projects", { type: "myProjects" }],
        (data) => {
          if (!data) return;
          return {
            pages: data?.pages.map((page) => ({
              ...page,
              projects: page.projects.map((project) =>
                project._id === updatedProject._id ? updatedProject : project
              ),
            })),
            pageParams: data?.pageParams,
          };
        }
      ),
  });
};

export const handleEmitStudentCreateNewProjectEvent = ({
  socket,
  project,
  createdBy,
}) => {
  if (!socket) throw new Error("Socket not available");
  if (!project || !createdBy)
    throw new Error("Not provided all fields to emit project update socket");
  socket.emit("student_create_new_project", { project, createdBy });
};

export const handleEmitProjectUpdateSocketEvent = ({
  socket,
  project,
  updatedBy,
  action = null,
  oldOrderStatus,
  isOrderStatusUpdate = false,
  isAssignedTutorUpdate = false,
  oldAssignedTutor = null,
}) => {
  if (!socket) throw new Error("Socket not available");
  if (!project || !updatedBy || !oldOrderStatus)
    throw new Error("Not provided all fields to emit project update socket");
  socket.emit("project_update", {
    project,
    updatedBy,
    action,
    oldOrderStatus,
    isOrderStatusUpdate,
    isAssignedTutorUpdate,
    oldAssignedTutor,
  });
};

export const handleStudentCreatedNewProjectEventInAdminProjects = ({
  socket,
  queryClient,
  user,
  fn = () => {},
}) => {
  if (!socket) throw new Error("Socket not available");
  if (!queryClient) throw new Error("queryClient not available");
  socket.on("student_created_new_project", (data) => {
    fn(data);
    const { project, createdBy } = data;
    updateAdminQueryCachedDataOnStudentCreatedNewProject({
      queryClient,
      project,
      createdBy,
    });
    toast.success(
      `New Project: '${project.assignmentId}' posted by ${createdBy.name} (${createdBy.userType})`,
      {
        position: "top-right",
        duration: 8000,
        style: {
          border: "1px solid var(--primary-500)",
          padding: "1rem",
          maxWidth: "460px",
          width: "100%",
          fontSize: "14px",
        },
      }
    );
  });
  return () => socket.off("student_created_new_project");
};
export const handleStudentCreatedNewProjectEventInStudentProjects = ({
  socket,
  queryClient,
  user,
  fn = () => {},
}) => {
  if (!socket) throw new Error("Socket not available");
  if (!queryClient) throw new Error("queryClient not available");
  socket.on("student_created_new_project", (data) => {
    fn(data);
    const { project, createdBy } = data;
    updateStudentQueryCachedDataOnStudentCreatedNewProject({
      queryClient,
      project,
      createdBy,
    });
  });
  return () => socket.off("student_created_new_project");
};

export const handleProjectUpdatedSocketEventInAdminProjects = ({
  socket,
  queryClient,
  user,
  fn = () => {},
}) => {
  if (!socket) throw new Error("Socket not available");
  if (!queryClient) throw new Error("queryClient not available");
  socket.on("project_updated", (data) => {
    const {
      project: updatedProject,
      updatedBy,
      action,
      oldOrderStatus,
      isOrderStatusUpdate,
      isAssignedTutorUpdate,
      oldAssignedTutor,
    } = data;
    fn(data);
    if (isOrderStatusUpdate) {
      console.log(
        "Socket project updated event received, order status changed"
      );
      updateAdminQueryCachedDataOnOrderStatusUpdate({
        queryClient,
        updatedProject,
        action,
        oldOrderStatus,
        updatedBy,
      });
      handleToastNotificationOnOrderStatusUpdateInAdmin({
        updatedProject,
        updatedBy,
        user,
      });
    } else {
      console.log(
        "Socket project updated event received, order status NOT changed"
      );
      updateAdminQueryCachedDataOnOrderStatusNotUpdated({
        queryClient,
        updatedProject,
        action,
        updatedBy,
      });
      if (updatedBy._id !== user._id) {
        toast.success(
          `Project: '${updatedProject.assignmentId}' got updated by ${updatedBy.name} (${updatedBy.userType})`,
          {
            position: "top-right",
            duration: 8000,
            style: {
              border: "1px solid var(--primary-500)",
              padding: "1rem",
              maxWidth: "460px",
              width: "100%",
              fontSize: "14px",
            },
          }
        );
      }
    }
  });
  return () => socket.off("project_updated");
};
export const handleProjectUpdatedSocketEventInTutorProjects = ({
  socket,
  queryClient,
  user,
  fn = () => {},
}) => {
  if (!socket) throw new Error("Socket not available");
  if (!queryClient) throw new Error("queryClient not available");
  socket.on("project_updated", (data) => {
    const {
      project: updatedProject,
      updatedBy,
      action,
      oldOrderStatus,
      isOrderStatusUpdate,
      isAssignedTutorUpdate,
      oldAssignedTutor,
    } = data;
    fn(data);
    if (isOrderStatusUpdate) {
      console.log(
        "Socket project updated event received, order status changed in tutor at: ",
        new Date().getTime()
      );
      updateTutorQueryCachedDataOnOrderStatusUpdate({
        queryClient,
        updatedProject,
        user,
        action,
        oldOrderStatus,
        updatedBy,
      });
    } else {
      console.log(
        "Socket project updated event received, order status NOT changed"
      );
      updateTutorQueryCachedDataOnOrderStatusNotUpdated({
        queryClient,
        updatedProject,
        action,
        updatedBy,
      });
    }
    if (updatedBy._id !== user._id) {
      toast.success(
        `Project: '${updatedProject.assignmentId}' got updated by ${updatedBy.name} (${updatedBy.userType})`,
        {
          position: "top-right",
          duration: 8000,
          style: {
            border: "1px solid var(--primary-500)",
            padding: "1rem",
            maxWidth: "460px",
            width: "100%",
            fontSize: "14px",
          },
        }
      );
    }
  });
  return () => socket.off("project_updated");
};
export const handleProjectUpdatedSocketEventInStudentProjects = ({
  socket,
  queryClient,
  user,
  fn = () => {},
}) => {
  if (!socket) throw new Error("Socket not available");
  if (!queryClient) throw new Error("queryClient not available");
  socket.on("project_updated", (data) => {
    const { project: updatedProject } = data;

    updateQueryCachedDataIfQueryExists({
      queryClient,
      queryKey: ["student-projects"],
      onSuccess: () =>
        queryClient.setQueryData(["student-projects"], (data) => {
          if (!data) return;
          return {
            pages: data?.pages.map((page) => ({
              ...page,
              projects: page.projects.map((project) =>
                project._id === updatedProject._id ? updatedProject : project
              ),
            })),
            pageParams: data?.pageParams,
          };
        }),
    });
  });

  return () => socket.off("project_updated");
};

export function convertTo12Hour(time24) {
  // Split the time into hours, minutes, and seconds
  const [hours, minutes, seconds] = time24.split(":");

  // Convert the hours to a number
  const hoursNum = Number(hours);

  // Determine AM or PM
  const period = hoursNum >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const hours12 =
    hoursNum > 12 ? hoursNum - 12 : hoursNum === 0 ? 12 : hoursNum;

  // Format the converted time
  const time12 = `${hours12}:${minutes} ${period}`;

  return time12;
}

export function getBetterDateTime(_date) {
  if (!_date) {
    return "Invalid date";
  }
  const datetimeString = _date;
  const datetime = new Date(datetimeString);

  const date = datetime.toLocaleDateString().split("/").join("-");
  const time = datetime.toLocaleTimeString();

  let newTime = convertTo12Hour(time);

  const newDatetime = `${date} ${newTime}`;

  return newDatetime;
}

function handleToastNotificationOnOrderStatusUpdateInAdmin({
  updatedProject,
  updatedBy,
  user,
}) {
  if (updatedBy._id !== user._id) {
    let message = "";
    switch (updatedProject.orderStatus) {
      case "newAssignment":
        message = `Project: '${updatedProject.assignmentId}' status got updated to New Assignment by ${updatedBy.name} (${updatedBy.userType})`;
        break;
      case "adminApproved":
        message = `Project: '${updatedProject.assignmentId}' got approved by ${updatedBy.name} (${updatedBy.userType})`;
        break;
      case "coAdminApproved":
        message = `Project: '${updatedProject.assignmentId}' got broadcasted by ${updatedBy.name} (${updatedBy.userType})`;
        break;
      case "assigned":
        message = `Project: '${updatedProject.assignmentId}' got assigned to ${
          updatedProject.assignedTo?.name || "-"
        } by ${updatedBy.name}(${updatedBy.userType})`;
        break;
      case "assignmentSubmitted":
        message = `Project: '${updatedProject.assignmentId}' status got updated to Completed by ${updatedBy.name} (${updatedBy.userType})`;
        break;
      case "submissionAccepted":
        message = `Project: '${updatedProject.assignmentId}' got accepted by ${updatedBy.name} (${updatedBy.userType})`;
        break;
      case "submissionRejected":
        message = `Project: '${updatedProject.assignmentId}' got rejected by ${updatedBy.name} (${updatedBy.userType})`;
        break;
      case "adminRejected":
        message = `Project: '${updatedProject.assignmentId}' got cancelled by ${updatedBy.name} (${updatedBy.userType})`;
        break;
      default:
        message = `Project: '${updatedProject.assignmentId}' got updated by ${updatedBy.name} (${updatedBy.userType})`;
        break;
    }
    toast.success(message, {
      position: "top-right",
      duration: 8000,
      style: {
        border: "1px solid var(--primary-500)",
        padding: "1rem",
        maxWidth: "460px",
        width: "100%",
        fontSize: "14px",
      },
    });
  }
}
