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
    <div>
      <h2>Entrada y Salida</h2>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <select onChange={(e) => setFiltroGrupo(e.target.value)}>
        <option value="">Todos</option>
        {grupos.map(g => (
          <option key={g.id} value={g.id}>
            {g.art_direccion_gr}
          </option>
        ))}
      </select>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Aprendiz</th>
            <th>Grupo</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.id_aprendiz}</td>
              <td>{item.id_codigo_gr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}