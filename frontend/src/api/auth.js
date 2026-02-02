import axios from "axios";

const URL = "http://localhost:8070/api/";

export const login = (userData) => axios.post(`${URL}login`, userData, { withCredentials: true });

export const register = (userData) => axios.post(`${URL}register`, userData, { withCredentials: true });