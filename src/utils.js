import axios from "axios";

const api = axios.create({
    baseURL: "https://dairy-backend-m9m2.onrender.com/api",
    withCredentials: true,
});

  export default api;