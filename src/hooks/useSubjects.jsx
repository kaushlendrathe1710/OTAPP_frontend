import { useQuery } from "react-query";
import api from "../services/api";
import toast from "react-hot-toast";
import { uniqBy } from "lodash";

async function fetchSubjects() {
  const res = await api.get("/subject/get-all");
  const data = res.data;
  let subjects = data.map((item) => {
    return { label: item.subjectName, value: item.subjectName };
  });

  return uniqBy(subjects, "value");
}

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => fetchSubjects(),
    staleTime: 1000 * 60 * 25, // 25 mins
    onError: () => toast.error("Error fetching subjects"),
  });
};
