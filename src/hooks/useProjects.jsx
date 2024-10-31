import { useContext } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import toast from "react-hot-toast";
import api, { getAccessToken } from "../services/api";
import getErrorMessageByStatusCode from "../lib/getErrorMessageByStatusCode";
import userContext from "../context/userContext";

async function fetchAdminProjects({ type, page, limit }) {
  try {
    const token = getAccessToken();
    let res;
    if (type === "all") {
      res = await api.get(`/project/get-projects?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: token,
        },
      });
    } else {
      res = await api.get(
        `/project/get-filtered-projects/${type}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
    }
    return {
      projects: res.data.projects,
      projectCount: res.data.projectCount,
      nextPage: res.data.projects.length > 0 ? page + 1 : undefined,
    };
  } catch (error) {
    return new Error(error);
  }
}

/**
 * @param {{
 * type: "all" | "newAssignment" | "adminApproved" | "urgent" | "coAdminApproved" | "assigned" | "assignmentSubmitted" | "submissionAccepted" | "submissionRejected" | "adminRejected"
 * limit: number
 * }} params - you can pass project status(e.g. approved, rejected) or all for getting all type of projects (default: all)
 */
export const useInfiniteAdminProjectsQuery = ({ type = "all", limit = 10 }) => {
  return useInfiniteQuery({
    queryKey: ["projects", { type }],
    queryFn: ({ pageParam = 1 }) =>
      fetchAdminProjects({ type, page: pageParam, limit }),
    getNextPageParam: (lastPageData) => lastPageData.nextPage,
    staleTime: 1000 * 60 * 15, // 15 mins cache time
    refetchOnWindowFocus: false,
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};

/**
 *
 * @param {{
 * type: "all" | "coAdminApproved" | "myProjects" | "assigned" | "assignmentSubmitted" | "submissionAccepted" | "submissionRejected"
 * page: number
 * limit: number
 * tutorId: string
 * }} params
 *
 */
const fetchTutorProjects = async ({ type, page, limit, tutorId: id }) => {
  try {
    let data;
    if (type === "myProjects") {
      if (id === undefined) {
        id = 0;
      }
      const res = await api.get(
        `/project/get-all-projects-for-single-tutor/${id}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
      data = res.data;
    } else if (type === "all") {
      const res = await api.get(
        `/project/get-all-applied-projects-in-tutor?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
      data = res.data;
    } else {
      let url;
      if (type === "coAdminApproved") {
        url = `/project/get-projects-for-apply-in-tutor?page=${page}&limit=${limit}`;
      } else {
        url = `/project/get-applied-projects-in-tutor?filter=${type}&page=${page}&limit=${limit}`;
      }
      const res = await api.get(url, {
        headers: {
          Authorization: getAccessToken(),
        },
      });
      data = res.data;
    }
    return {
      projects: data.projects,
      projectCount: data.projectCount,
      nextPage: data.projects.length > 0 ? page + 1 : undefined,
    };
  } catch (error) {
    return new Error(error);
  }
};

/**
 *
 * @param {{
 * type: "all" | "coAdminApproved" | "myProjects" | "assigned" | "assignmentSubmitted" | "submissionAccepted" | "submissionRejected"
 * limit: number
 * }} params - you can pass a tab value or all for getting all type of projects which are available for tutor (default: all)
 *
 */
export const useInfiniteTutorProjectsQuery = ({ type = "all", limit = 10 }) => {
  const { userData } = useContext(userContext);
  return useInfiniteQuery({
    queryKey: ["tutor-projects", { type }],
    queryFn: ({ pageParam = 1 }) =>
      fetchTutorProjects({
        type,
        page: pageParam,
        limit,
        tutorId: userData?._id,
      }),
    getNextPageParam: (lastPageData) => lastPageData.nextPage,
    staleTime: 1000 * 60 * 15, // 15 mins cache time
    refetchOnWindowFocus: false,
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};

const fetchStudentProjects = async ({ page, limit }) => {
  const res = await api.get(
    `/project/get-all-in-student?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: getAccessToken(),
      },
    }
  );
  return {
    projects: res.data.projects,
    projectCount: res.data.projectCount,
    nextPage: res.data.projects.length > 0 ? page + 1 : undefined,
  };
};
export const useInfiniteStudentProjectsQuery = ({ limit = 10 }) => {
  return useInfiniteQuery({
    queryKey: ["student-projects"],
    queryFn: ({ pageParam = 1 }) =>
      fetchStudentProjects({ page: pageParam, limit }),
    getNextPageParam: (lastPageData) => lastPageData.nextPage,
    staleTime: 1000 * 60 * 15, // 15 mins cache time
    refetchOnWindowFocus: false,
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};

async function fetchSingleProjectById({ id }) {
  try {
    const res = await api.get(`/project/get-single-project/${id}`, {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
}
export const useSingleProjectQuery = ({ id, enabled = true }) => {
  return useQuery({
    queryKey: ["single-project", { id }],
    queryFn: () => fetchSingleProjectById({ id }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled,
    onError: (error) =>
      toast.error(getErrorMessageByStatusCode(error.response.status)),
  });
};
