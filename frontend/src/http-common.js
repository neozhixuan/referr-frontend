import axios from "axios";

axios.defaults.withCredentials = true;

export default axios.create({
  baseURL: "https://api.referr.site/",
  headers: {
    "Content-type": "application/json",
  },
});
