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
  <div className="container">
    <div className="card">
      <h1 className="title">⚙️ Configuración GR</h1>

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#c62828",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      <button
        className="btn-primary"
        onClick={openCreateForm}
        style={{ marginBottom: "20px" }}
      >
        ➕ Nuevo Registro
      </button>

      {loading && <p>Cargando...</p>}

      <div className="card">
        <table>
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
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="btn-warning"
                      onClick={() => openEditForm(item)}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(item)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
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
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2
              style={{
                marginBottom: "20px",
                color: "#16bb00",
                textAlign: "center",
              }}
            >
              {editingItem ? "✏️ Editar Configuración" : "➕ Crear Configuración"}
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <div>
                <label>Dirección GR</label>
                <input
                  name="art_direccion_gr"
                  placeholder="Ingrese dirección"
                  value={formData.art_direccion_gr}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Fecha de Conexión</label>
                <input
                  type="date"
                  name="fecha_conexion"
                  value={formData.fecha_conexion}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>ID Calcular</label>
                <input
                  name="id_calcular"
                  placeholder="Ingrese ID"
                  value={formData.id_calcular}
                  onChange={handleChange}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button className="btn-primary" type="submit">
                  {editingItem ? "💾 Actualizar" : "✅ Crear"}
                </button>

                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);
}