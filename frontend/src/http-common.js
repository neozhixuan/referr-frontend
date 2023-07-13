import axios from "axios";

export default axios.create({
  baseURL: "https://referall-backend.vercel.app/api/v1/",
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-type": "application/json",
  },
});
