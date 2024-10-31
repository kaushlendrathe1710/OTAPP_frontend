import { toast } from "react-hot-toast";
import api, { getAccessToken } from "../../../../../../services/api";


function fetchStudents() {

    return api.get(
        `/tutor/get-all-in-admin-with-name-id`, {
        headers: {
            Authorization: getAccessToken()
        }
    })
}

function fetchSubAdmins() {
    return api.get(`/admin/get-all-in-admin-with-name-id?userType=Sub-Admin`, {
        headers: {
            Authorization: getAccessToken()
        }
    })
}

function fetchCoAdmins() {
    return api.get(`/admin/get-all-in-admin-with-name-id?userType=Co-Admin`, {
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

function fetchStudentGroups() {
    return api.get(
        `/tutor-group/get-all-groups?page=1&limit=10`, {
        headers: {
            Authorization: getAccessToken()
        }
    })
}

function handleFetchedStudentGroups(data, setAllStudentGroups) {
    setAllStudentGroups(data)
}



export {
    fetchStudents,
    fetchSubAdmins,
    onError,
    handleFetchedData,
    fetchStudentGroups,
    handleFetchedStudentGroups,
    fetchCoAdmins
}