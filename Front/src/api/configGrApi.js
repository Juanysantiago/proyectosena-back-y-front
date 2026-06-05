
import { axiosClient } from "./axiosClient";

export const configGrApi = {
  list: () => axiosClient.get("/config_gr"),
  getById: (id) => axiosClient.get(`/config_gr/${id}`),
  create: (data) => axiosClient.post("/config_gr", data),
  update: (id, data) => axiosClient.patch(`/config_gr/${id}`, data),
  remove: (id) => axiosClient.delete(`/config_gr/${id}`)
};