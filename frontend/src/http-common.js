import axios from "axios";

export default axios.create({
  baseURL: "https://api.referr.site/",
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-type": "application/json",
  },
});
