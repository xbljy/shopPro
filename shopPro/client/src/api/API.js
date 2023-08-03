import axios from "axios";
export const api = axios.create({
  baseURL:
    process.env.VUE_APP_NODE_ENV == "development"
      ? process.env.VUE_APP_BASE_URL_DEV
      : window.location.origin,
  withCredentials: true,
});
