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

  // 🔥 FIX: normalizador de datos
  const safeData = (res) => {
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  };

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await entradaSalidaApi.list();
      let datos = safeData(res);

      if (filtroGrupo) {
        datos = datos.filter(item => item.id_codigo_gr === parseInt(filtroGrupo));
      }

      if (filtroAprendiz) {
        datos = datos.filter(item => item.id_aprendiz === parseInt(filtroAprendiz));
      }

      setItems(datos);
    } catch (err) {
      console.error(err);
      setError("Error cargando registros");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadGrupos = async () => {
    try {
      const res = await configGrApi.list();
      setGrupos(safeData(res));
    } catch (err) {
      console.error(err);
      setGrupos([]);
    }
  };

  useEffect(() => {
    loadItems();
    loadGrupos();
  }, [filtroGrupo, filtroAprendiz]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 return (
  <div className="container">
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="title">🚪 Control de Entrada y Salida</h1>

        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Nuevo Registro
        </button>
      </div>

      {loading && (
        <div className="card">
          <p>⏳ Cargando información...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#d32f2f",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* FILTROS */}
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            📚 Filtrar por Grupo
          </label>

          <select
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
          >
            <option value="">Todos los grupos</option>

            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.art_direccion_gr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            👨‍🎓 Filtrar por Aprendiz
          </label>

          <input
            type="number"
            placeholder="Ingrese ID aprendiz"
            value={filtroAprendiz}
            onChange={(e) => setFiltroAprendiz(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Aprendiz</th>
              <th>Grupo</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.id_aprendiz}</td>
                  <td>{item.id_codigo_gr}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  📭 No hay registros disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORMULARIO */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2
              style={{
                textAlign: "center",
                color: "#16bb00",
                marginBottom: "20px",
              }}
            >
              {editingItem
                ? "✏️ Editar Registro"
                : "➕ Nuevo Registro"}
            </h2>

            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <div>
                <label>🕒 Hora Entrada</label>
                <input
                  type="time"
                  name="hora_entrada"
                  value={formData.hora_entrada}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>🕔 Hora Salida</label>
                <input
                  type="time"
                  name="hora_salida"
                  value={formData.hora_salida}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>👨‍🎓 ID Aprendiz</label>
                <input
                  type="number"
                  name="id_aprendiz"
                  value={formData.id_aprendiz}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>📚 Grupo</label>
                <select
                  name="id_codigo_gr"
                  value={formData.id_codigo_gr}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un grupo</option>

                  {grupos.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.art_direccion_gr}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="submit"
                  className="btn-primary"
                >
                  💾 Guardar
                </button>

                <button
                  type="button"
                  className="btn-secondary"
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