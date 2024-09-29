import axios from "axios";

export type BaseEntity = {
  id: string;
  name: string;
  createdAt: string;
};

export const http = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
