import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://api.bersajak.com/api",
    timeout: 10000,
    timeoutErrorMessage: "Request Timeout"
});

export default axiosInstance;