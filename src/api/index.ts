import axios from "axios";

const http = axios.create({
  baseURL: "/api",
});

export const getPosts = async (): Promise<string> => {
  try {
    const response = await http.get<string>("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
