import { axiosClient } from "./axiosClient";

export const tipoDocumentosApi = {
  list: () => axiosClient.get("/api/tipo-documento"),
  getById: (id) => axiosClient.get(`/api/tipo-documento/${id}`),
  create: (data) => axiosClient.post("/api/tipo-documento", data),
  update: (id, data) => axiosClient.put(`/api/tipo-documento/${id}`, data),
  remove: (id) => axiosClient.delete(`/api/tipo-documento/${id}`),
};