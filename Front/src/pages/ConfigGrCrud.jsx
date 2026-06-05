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
      setItems(res.data || []);
    } catch (err) {
      console.error("Error:", err);
      setError("Error cargando configuraciones: " + (err.message || "Error desconocido"));
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

    if (!formData.art_direccion_gr) {
      setError("La dirección del grupo es obligatoria");
      setLoading(false);
      return;
    }

    try {
      if (editingItem) {
        await configGrApi.update(editingItem.id, formData);
        alert("Configuración actualizada");
      } else {
        await configGrApi.create(formData);
        alert("Configuración creada");
      }
      setShowForm(false);
      setEditingItem(null);
      await loadItems();
    } catch (err) {
      console.error("Error:", err);
      setError("Error guardando: " + (err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar configuración ID ${item.id}?`)) return;
    
    setLoading(true);
    try {
      await configGrApi.remove(item.id);
      await loadItems();
      alert("Configuración eliminada");
    } catch (err) {
      setError("Error eliminando: " + (err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  };

  const modalContent = {
    background: "white",
    padding: 30,
    borderRadius: 10,
    maxWidth: 500,
    width: "90%"
  };

  const inputStyle = {
    width: "100%",
    padding: 8,
    marginTop: 5,
    border: "1px solid #ddd",
    borderRadius: 4
  };

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>📋 Configuración de Grupos (GR)</h2>
        <button onClick={openCreateForm} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
          + Nueva Configuración
        </button>
      </div>

      {error && (
        <div style={{ background: "#f8d7da", color: "#721c24", padding: 10, borderRadius: 5, marginBottom: 20 }}>
          ❌ {error}
        </div>
      )}

      {loading && <div>Cargando...</div>}

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3>{editingItem ? "Editar Configuración" : "Nueva Configuración"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 15 }}>
                <label>Dirección GR *</label>
                <input
                  type="text"
                  name="art_direccion_gr"
                  value={formData.art_direccion_gr}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Centro de Formación Norte"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 15 }}>
                <label>Fecha de Conexión</label>
                <input
                  type="date"
                  name="fecha_conexion"
                  value={formData.fecha_conexion}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 15 }}>
                <label>ID Calcular</label>
                <input
                  type="number"
                  name="id_calcular"
                  value={formData.id_calcular}
                  onChange={handleChange}
                  placeholder="ID relacionado"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>ID</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Dirección GR</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Fecha Conexión</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>ID Calcular</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td style={{ padding: 12 }}>{item.id}</td>
                <td style={{ padding: 12 }}>{item.art_direccion_gr}</td>
                <td style={{ padding: 12 }}>{item.fecha_conexion || "-"}</td>
                <td style={{ padding: 12 }}>{item.id_calcular || "-"}</td>
                <td style={{ padding: 12 }}>
                  <button onClick={() => openEditForm(item)} style={{ marginRight: 10, padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: 3, cursor: "pointer" }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(item)} style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: 3, cursor: "pointer" }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 40 }}>No hay configuraciones registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}