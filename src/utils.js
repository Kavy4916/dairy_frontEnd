import axios from "axios";

const api = axios.create({
    baseURL: "https://dairy-backend-m9m2.onrender.com/api",
    withCredentials: true,
});

const getToday = ()=>{
  const date = new Date();
  const localDate = new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().split("T")[0];
  return localDate;
}

  export default api;
  export {getToday};