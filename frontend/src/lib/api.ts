import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
