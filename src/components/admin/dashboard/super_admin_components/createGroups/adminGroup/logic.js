import { toast } from "react-hot-toast";
import api, { getAccessToken } from "../../../../../../services/api";


function fetchAdmins() {
    return api.get(
        `/admin/get-all-in-admin-with-name-id`, {
        headers: {
            Authorization: getAccessToken()
        }
    })
}

function handleFetchedData({ data }) {
    return data.map((item) => ({ label: item.name, value: item.name, id: item._id }))
}



function onError(error) {
    toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--success-color)" },
    });
}

function fetchAdminGroups() {
    return api.get(
        `/admin-group/get-all-groups?page=1&limit=10`, {
        headers: {
            Authorization: getAccessToken()
        }
    })
}

function handleFetchedStudentGroups(data, setAllStudentGroups) {
    setAllStudentGroups(data)
}



export {
    fetchAdmins,
    onError,
    handleFetchedData,
    fetchAdminGroups,
    handleFetchedStudentGroups
}