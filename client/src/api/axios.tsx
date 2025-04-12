import axios from "axios";

const apiurl = import.meta.env.VITE_API_URL || "";
const instance = axios.create({
  baseURL: apiurl,
  withCredentials: true,
});

export default instance;
