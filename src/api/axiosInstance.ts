import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "/api"
});

export default axiosInstance;