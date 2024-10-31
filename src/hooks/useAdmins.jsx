import { useQuery } from "react-query";
import api, { getAccessToken } from "../services/api";

export const useCoAdmins = () => {
  return useQuery({
    queryKey: ["co-admins"],
    queryFn: async () => {
      const res = await api.get("/admin/get-all-admin/Co-Admin");
      return res.data;
    },
    staleTime: Infinity,
  });
};
