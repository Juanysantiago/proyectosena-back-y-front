import { axiosClient } from "./axiosClient";

export const obtenerCentros = () => {
  return axiosClient.get("/api/centros");
};