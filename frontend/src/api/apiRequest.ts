import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiRequest = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config?: any
) => {
  const res = await instance.request({
    method,
    url,
    data,
    ...config,
  });
  return res.data;
};
