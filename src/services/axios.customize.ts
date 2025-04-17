import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:7074"
});

export default instance;
