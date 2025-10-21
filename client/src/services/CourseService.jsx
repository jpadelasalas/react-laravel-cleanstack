import { axiosInstance } from "../utilities/axiosInstance";

export const courseService = {
  getAll: () => axiosInstance.get("/api/v1/courses"),
  show: (id) => axiosInstance.get(`/api/v1/courses/${id}`),
  create: (payload) => axiosInstance.post("/api/v1/courses", payload),
  update: (id, payload) => axiosInstance.put(`/api/v1/courses/${id}`, payload),
  remove: (id) => axiosInstance.delete(`/api/v1/courses/${id}`),
};
