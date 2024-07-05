import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 10000,
    timeoutErrorMessage: "Request Timeout"
});

export default axiosInstance;