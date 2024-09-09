import axios from "axios";

export type BaseItem = {
  id: string;
  name: string;
  createdAt: string;
};

export type BaseGroup = {
  id: string;
  name: string;
  createdAt: string;
};

export const http = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
