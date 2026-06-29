import { axiosClient } from "./axiosClient";

// Crear reporte
export const crearSoporte = async (data) => {
  const res = await axiosClient.post("/api/reportes", data);
  return res.data;
};

// Obtener mis reportes
export const obtenerMisSoportes = async () => {
  const res = await axiosClient.get("/api/reportes/mios");
  return res.data;
};

// Obtener todos
export const obtenerTodosSoportes = async () => {
  const res = await axiosClient.get("/api/reportes");
  return res.data;
};

// Actualizar reporte
export const responderSoporte = async (id, data) => {
  const res = await axiosClient.put(
    `/api/reportes/${id}`,
    data
  );

  return res.data;
};