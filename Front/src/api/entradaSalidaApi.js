import { axiosClient } from "./axiosClient";

export const entradaSalidaApi = {
  list: () => axiosClient.get("/entrada_salida_aprendiz"),
  getById: (id) => axiosClient.get(`/entrada_salida_aprendiz/${id}`),
  create: (data) => axiosClient.post("/entrada_salida_aprendiz", data),
  update: (id, data) => axiosClient.patch(`/entrada_salida_aprendiz/${id}`, data),
  remove: (id) => axiosClient.delete(`/entrada_salida_aprendiz/${id}`),
  
  registrarEntrada: (data) => {
    return axiosClient.post("/entrada_salida_aprendiz", {
      id_aprendiz: parseInt(data.id_aprendiz),
      id_codigo_gr: parseInt(data.id_codigo_gr),
      hora_entrada: new Date().toISOString(),
      hora_salida: null
    });
  },
  
  registrarSalida: (id) => {
    return axiosClient.patch(`/entrada_salida_aprendiz/${id}`, {
      hora_salida: new Date().toISOString()
    });
  }
};