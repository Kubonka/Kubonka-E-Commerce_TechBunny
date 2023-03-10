import axios from "axios";
import store from "./store.js";
import loginUser from "../scripts/loginUser";
import logoutUser from "../scripts/logoutUser.js";
import { useSyncExternalStore } from "react";
let base = "";
if (process.env.REACT_APP_API)
  base = "https://prueba1-production-4ff1.up.railway.app/";
else base = "http://localhost:3001";

const axiosInstance = axios.create({
  //baseURL: "http://localhost:3001",
  //baseURL: "https://prueba1-production-4ff1.up.railway.app/",
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  //1 si hay un token y el usuario existe       ->  next
  //2 si hay un token  y el usuario  no exite   ->  login con el token
  //3 si no un token y el usuario existe        ->  logout
  //4 si no hay un token y el usuario no exite  ->  !!!! (guest)
  async (config) => {
    const state = store.getState();
    if (Object.keys(state.loggedUser).length === 0) {
      let token = localStorage.getItem("accessToken");
      if (token) {
        await loginUser(null); // 2
      } else {
        // 4
      }
    } else {
      let token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = "Bearer " + token; // 1
      } else {
        logoutUser(); // 3
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/enter/login" && err.response) {
      // Access Token expiro . Mirar bien si 401 o 403 en el back
      if (err.response.status === 401 && !originalConfig._retry) {
        //sino tiene que desloguear al user porque el access token esta vencido
        //todo MANDAR DESDE EL FRONT A LA RUTA LOGIN Y SI QUIERE SE RELOGUEA DE NUEVO, YA QUE LA SESSION EXPIRO
        //todo se deberia hacer un request de tipo /enter/logout
        await logoutUser();
        window.location.href = "/Login";
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
