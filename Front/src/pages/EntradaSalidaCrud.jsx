// /src/pages/EntradaSalidaCrud.jsx
import { useEffect, useState } from "react";
import { entradaSalidaApi } from "../api/entradaSalidaApi";
import { configGrApi } from "../api/configGrApi";

export default function EntradaSalidaCrud() {
  const [items, setItems] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [filtroAprendiz, setFiltroAprendiz] = useState("");
  
  const [formData, setFormData] = useState({
    hora_entrada: "",
    hora_salida: "",
    id_aprendiz: "",
    id_codigo_gr: ""
  });

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await entradaSalidaApi.list();
      console.log("Registros cargados:", res.data);
      let datos = res.data || [];
      
      if (filtroGrupo) {
        datos = datos.filter(item => item.id_codigo_gr === parseInt(filtroGrupo));
      }
      if (filtroAprendiz) {
        datos = datos.filter(item => item.id_aprendiz === parseInt(filtroAprendiz));
      }
      
      setItems(datos);
    } catch (err) {
      console.error("Error cargando:", err);
      setError("Error cargando registros: " + (err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const loadGrupos = async () => {
    try {
      const res = await configGrApi.list();
      console.log("Grupos cargados:", res.data);
      setGrupos(res.data || []);
    } catch (err) {
      console.error("Error cargando grupos:", err);
    }
  };

  useEffect(() => {
    loadItems();
    loadGrupos();
  }, [filtroGrupo, filtroAprendiz]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDateTimeLocal = (fecha) => {
    if (!fecha) return "";
    try {
      return new Date(fecha).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData({
      hora_entrada: "",
      hora_salida: "",
      id_aprendiz: "",
      id_codigo_gr: ""
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    console.log("Editando item:", item);
    setEditingItem(item);
    setFormData({
      hora_entrada: formatDateTimeLocal(item.hora_entrada),
      hora_salida: formatDateTimeLocal(item.hora_salida),
      id_aprendiz: item.id_aprendiz || "",
      id_codigo_gr: item.id_codigo_gr || ""
    });
    setShowForm(true);
  };

  const registrarSalida = async (item) => {
    console.log("Registrando salida para:", item);
    if (!window.confirm(`¿Registrar salida del aprendiz ID ${item.id_aprendiz}?`)) return;
    
    setLoading(true);
    try {
      const response = await entradaSalidaApi.registrarSalida(item.id);
      console.log("Respuesta salida:", response.data);
      alert("Salida registrada exitosamente");
      await loadItems();
    } catch (err) {
      console.error("Error registrando salida:", err);
      setError("Error registrando salida: " + (err.response?.data?.message || err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.id_aprendiz || !formData.id_codigo_gr) {
      setError("ID del aprendiz y grupo son obligatorios");
      setLoading(false);
      return;
    }

    try {
      if (editingItem) {
        console.log("Actualizando registro ID:", editingItem.id);
        
        const updateData = {};
        if (formData.hora_entrada) updateData.hora_entrada = new Date(formData.hora_entrada).toISOString();
        if (formData.hora_salida) updateData.hora_salida = new Date(formData.hora_salida).toISOString();
        if (formData.id_aprendiz) updateData.id_aprendiz = parseInt(formData.id_aprendiz);
        if (formData.id_codigo_gr) updateData.id_codigo_gr = parseInt(formData.id_codigo_gr);
        
        const response = await entradaSalidaApi.update(editingItem.id, updateData);
        console.log("Respuesta actualización:", response.data);
        alert("Registro actualizado");
      } else {
        console.log("Creando nuevo registro:", formData);
        const response = await entradaSalidaApi.registrarEntrada({
          id_aprendiz: parseInt(formData.id_aprendiz),
          id_codigo_gr: parseInt(formData.id_codigo_gr)
        });
        console.log("Respuesta creación:", response.data);
        alert("Entrada registrada");
      }
      setShowForm(false);
      setEditingItem(null);
      await loadItems();
    } catch (err) {
      console.error("Error guardando:", err);
      setError("Error guardando: " + (err.response?.data?.message || err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    console.log("Eliminando registro:", item);
    if (!window.confirm(`¿Eliminar registro ID ${item.id}?`)) return;
    
    setLoading(true);
    try {
      const response = await entradaSalidaApi.remove(item.id);
      console.log("Respuesta eliminación:", response.data);
      alert("Registro eliminado");
      await loadItems();
    } catch (err) {
      console.error("Error eliminando:", err);
      setError("Error eliminando: " + (err.response?.data?.message || err.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    try {
      return new Date(fecha).toLocaleString();
    } catch {
      return fecha;
    }
  };

  // Estilos inline
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
    width: "90%",
    maxHeight: "80vh",
    overflow: "auto"
  };

  const inputStyle = {
    width: "100%",
    padding: 8,
    marginTop: 5,
    border: "1px solid #ddd",
    borderRadius: 4
  };

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>⏱️ Control de Entrada/Salida - Aprendices</h2>
        <button onClick={openCreateForm} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
          + Registrar Entrada
        </button>
      </div>

      {error && (
        <div style={{ background: "#f8d7da", color: "#721c24", padding: 10, borderRadius: 5, marginBottom: 20 }}>
          ❌ {error}
        </div>
      )}

      {/* Filtros */}
      <div style={{ background: "#f8f9fa", padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Filtros</h3>
        <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <label>Filtrar por Grupo</label>
            <select
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
              style={{ ...inputStyle, marginTop: 5 }}
            >
              <option value="">Todos los grupos</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>
                  {g.id} - {g.art_direccion_gr}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Filtrar por Aprendiz ID</label>
            <input
              type="number"
              value={filtroAprendiz}
              onChange={(e) => setFiltroAprendiz(e.target.value)}
              placeholder="ID del aprendiz"
              style={{ ...inputStyle, marginTop: 5 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button onClick={() => { setFiltroGrupo(""); setFiltroAprendiz(""); }} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {loading && <div>Cargando...</div>}

      {/* Modal Formulario */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3>{editingItem ? `Editar Registro ID: ${editingItem.id}` : "Registrar Entrada"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 15 }}>
                <label>ID del Aprendiz *</label>
                <input
                  type="number"
                  name="id_aprendiz"
                  value={formData.id_aprendiz}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 12345"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 15 }}>
                <label>Grupo (GR) *</label>
                <select
                  name="id_codigo_gr"
                  value={formData.id_codigo_gr}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Seleccionar grupo</option>
                  {grupos.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.id} - {g.art_direccion_gr}
                    </option>
                  ))}
                </select>
              </div>

              {editingItem && (
                <>
                  <div style={{ marginBottom: 15 }}>
                    <label>Hora de Entrada</label>
                    <input
                      type="datetime-local"
                      name="hora_entrada"
                      value={formData.hora_entrada}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: 15 }}>
                    <label>Hora de Salida</label>
                    <input
                      type="datetime-local"
                      name="hora_salida"
                      value={formData.hora_salida}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  {loading ? "Guardando..." : (editingItem ? "Actualizar" : "Registrar Entrada")}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de registros */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>ID</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Aprendiz ID</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Grupo</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Hora Entrada</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Hora Salida</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Estado</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td style={{ padding: 12 }}>{item.id}</td>
                <td style={{ padding: 12 }}>{item.id_aprendiz}</td>
                <td style={{ padding: 12 }}>{item.id_codigo_gr}</td>
                <td style={{ padding: 12 }}>{formatFecha(item.hora_entrada)}</td>
                <td style={{ padding: 12 }}>{formatFecha(item.hora_salida)}</td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    background: item.hora_salida ? "#d4edda" : "#fff3cd",
                    color: item.hora_salida ? "#155724" : "#856404"
                  }}>
                    {item.hora_salida ? "✅ Completado" : "🟡 En curso"}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                  {!item.hora_salida && (
                    <button 
                      onClick={() => registrarSalida(item)} 
                      style={{ marginRight: 5, padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: 3, cursor: "pointer" }}
                    >
                      Registrar Salida
                    </button>
                  )}
                  <button 
                    onClick={() => openEditForm(item)} 
                    style={{ marginRight: 5, padding: "5px 10px", background: "#ffc107", color: "#333", border: "none", borderRadius: 3, cursor: "pointer" }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(item)} 
                    style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: 3, cursor: "pointer" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 40 }}>No hay registros de entrada/salida</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}