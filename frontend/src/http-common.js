import axios from "axios";

export default axios.create({
  baseURL: "https://api.referr.app/",
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-type": "application/json",
  },
});
