import { axiosClient } from "./axiosClient";

export const generarCarnet = (id) => {
  return axiosClient.post(`/api/carnet/generar/${id}`);
};

export const obtenerMiCarnet = () => {
  return axiosClient.get("/api/carnet/mi-carnet");
};

