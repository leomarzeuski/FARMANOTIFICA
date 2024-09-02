import axios from "axios";

const api = axios.create({
  baseURL: "https://farmanotificawebapi.azurewebsites.net/api",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Content-Type": "multipart/form-data",
    Accept: "text/plain",
  },
});

export default api;
