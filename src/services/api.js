import axios from "axios";

// const SOCKET_BASE_URL = "http://localhost:5000";
const SOCKET_BASE_URL = "https://backend.mymegaminds.com";

export const BASE_URL = "https://backend.mymegaminds.com";
// export const BASE_URL = "http://localhost:5000";

function getAccessToken() {
	const token = localStorage.getItem("access_token") || "";
	return token === "" ? null : `Bearer ${token}`;
}

const api = axios.create({
	// baseURL: "http://localhost:5000/api",
	baseURL: "https://backend.mymegaminds.com/api",
});

export default api;
export { getAccessToken, SOCKET_BASE_URL };
