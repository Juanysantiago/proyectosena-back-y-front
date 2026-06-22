import { axiosClient } from "./axiosClient";

export const generarCarnet = (id) => {
  return axiosClient.post(`/api/carnets/generar/${id}`);
};