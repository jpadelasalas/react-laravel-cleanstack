import { axiosInstance } from "../utilities/axiosInstance";

export const courseService = {
  getAll: () => axiosInstance.get("/api/courses"),
  show: (id) => axiosInstance.get(`/api/courses/${id}`),
  create: (payload) => axiosInstance.post("/api/courses", payload),
  update: (id, payload) => axiosInstance.put(`/api/courses/${id}`, payload),
  remove: (id) => axiosInstance.delete(`/api/courses/${id}`),
};
