// /src/pages/ConfigGrCrud.jsx
import { useEffect, useState } from "react";
import { configGrApi } from "../api/configGrApi";

export default function ConfigGrCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    art_direccion_gr: "",
    fecha_conexion: "",
    id_calcular: ""
  });

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await configGrApi.list();

      console.log("Configuraciones cargadas:", res.data);

      // ✅ FIX IMPORTANTE
      const data = res.data?.data;

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
      setError("Error cargando configuraciones");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData({
      art_direccion_gr: "",
      fecha_conexion: "",
      id_calcular: ""
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormData({
      art_direccion_gr: item.art_direccion_gr || "",
      fecha_conexion: item.fecha_conexion || "",
      id_calcular: item.id_calcular || ""
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingItem) {
        await configGrApi.update(editingItem.id, formData);
        alert("Actualizado correctamente");
      } else {
        await configGrApi.create(formData);
        alert("Creado correctamente");
      }

      setShowForm(false);
      setEditingItem(null);
      await loadItems();
    } catch (err) {
      console.error(err);
      setError("Error guardando configuración");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("¿Eliminar registro?")) return;

    try {
      await configGrApi.remove(item.id);
      await loadItems();
    } catch (err) {
      console.error(err);
      setError("Error eliminando");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>Configuración GR</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={openCreateForm}>Nuevo</button>

      {loading && <p>Cargando...</p>}

      <table border="1" width="100%" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dirección GR</th>
            <th>Fecha</th>
            <th>Calcular</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.art_direccion_gr}</td>
              <td>{item.fecha_conexion || "-"}</td>
              <td>{item.id_calcular || "-"}</td>
              <td>
                <button onClick={() => openEditForm(item)}>Editar</button>
                <button onClick={() => handleDelete(item)}>Eliminar</button>
              </td>
            </tr>
          ))}

          {items.length === 0 && !loading && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div style={{ marginTop: 20 }}>
          <h3>{editingItem ? "Editar" : "Crear"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              name="art_direccion_gr"
              placeholder="Dirección"
              value={formData.art_direccion_gr}
              onChange={handleChange}
            />

            <input
              type="date"
              name="fecha_conexion"
              value={formData.fecha_conexion}
              onChange={handleChange}
            />

            <input
              name="id_calcular"
              placeholder="ID calcular"
              value={formData.id_calcular}
              onChange={handleChange}
            />

            <button type="submit">
              {editingItem ? "Actualizar" : "Crear"}
            </button>

            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}