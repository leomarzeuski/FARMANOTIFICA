import axios from "axios";

const apiJson = axios.create({
  baseURL: "https://farmanotificawebapi.azurewebsites.net/api",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Content-Type": "application/json",
  },
});

export default apiJson;
