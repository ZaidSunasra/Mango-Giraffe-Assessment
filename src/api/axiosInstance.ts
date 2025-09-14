import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://dg-sandbox.setu.co/api"
});

export default axiosInstance;