// /src/api/vehiculosApi.js
import { axiosClient } from "./axiosClient";

export const vehiculosApi = {
  // Obtener todos los vehículos (versión simplificada)
  list: () => axiosClient.get("/api/vehiculos"),
  
  // Obtener por ID
  getById: (id) => axiosClient.get(`/api/vehiculos/${id}`),
  
  // Crear nuevo vehículo
  create: (data) => axiosClient.post("/api/vehiculos", data),
  
  // Actualizar vehículo
  update: (id, data) => axiosClient.put(`/api/vehiculos/${id}`, data),
  
  // Eliminar vehículo
  remove: (id) => axiosClient.delete(`/api/vehiculos/${id}`)
};