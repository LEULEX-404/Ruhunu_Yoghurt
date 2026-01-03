import axios from "axios";

const URL = "https://ruhunu-yoghurt-1.onrender.com/api/";

export const login = (userData) => axios.post(`${URL}login`, userData, { withCredentials: true });

export const register = (userData) => axios.post(`${URL}register`, userData, { withCredentials: true });