import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
    baseURL: `${VITE_SERVER_URL}/api`,
    withCredentials: true,
});

export default axiosInstance;