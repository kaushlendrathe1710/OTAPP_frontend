import { useQuery } from "react-query";
import api, { getAccessToken } from "../services/api";

async function fetchProjectAppliedTutors(assignmentId) {
  const res = await api.get(
    `/project/get-all-applied-tutors-in-admin?assignmenteId=${assignmentId}`,
    {
      headers: {
        Authorization: getAccessToken(),
      },
    }
  );
  let data = res.data;
  return data[0]?.appliedTutors || [];
}

export const useProjectAppliedTutors = ({ project }) => {
  return useQuery({
    queryKey: [
      "project-applied-tutors",
      { assignmentId: project.assignmentId },
    ],
    queryFn: () => fetchProjectAppliedTutors(project.assignmentId),
    staleTime: Infinity,
  });
};
