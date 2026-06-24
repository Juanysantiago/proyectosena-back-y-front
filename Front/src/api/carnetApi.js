import { axiosClient } from "./axiosClient";

export const carnetApi = {

  obtenerMiCarnet: () =>
    axiosClient.get("/api/carnet/mi-carnet"),

  obtenerPendientes: () =>
    axiosClient.get("/api/carnet/pendientes"),

  generar: (id) =>
    axiosClient.post(`/api/carnet/generar/${id}`),

  escanear: (codigoQr) =>
    axiosClient.post("/api/carnet/escanear", {
      codigoQr
    })

};