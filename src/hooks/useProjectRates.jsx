import { useQuery } from "react-query";
import api, { getAccessToken } from "../services/api";

async function fetchProjectRates(project) {
  try {
    const studentRes = await api.get(
      `/student/get-student-detail-by-phone?phoneNumber=${project?.studentNumber}`,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    const countryId = studentRes.data.phoneCountry;
    const res = await api.get(
      `project-rate/get-all-country-with-id?country_id=${countryId}`,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const useProjectRates = ({ project }) => {
  return useQuery({
    queryKey: ["project-rates"],
    queryFn: () => fetchProjectRates(project),
    staleTime: Infinity,
    onError: (error) => {
      console.log("Error occurred during query project rates:", error);
    },
  });
};
