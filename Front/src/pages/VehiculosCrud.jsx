import { useEffect, useState } from "react";
import { vehiculosApi } from "../api/vehiculosApi";

export default function VehiculosCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [formData, setFormData] = useState({
    tipo: "bicicleta",
    id_centro_de_formacion: "",
    marca: "",
    color: "",
    serial: "",
    placa: "",
    cilindraje: "",
    modelo: "",
    foto_principal: "",
    foto_secundaria: ""
  });

  // ✅ FIX PRINCIPAL AQUÍ
  const loadVehiculos = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await vehiculosApi.list();

      const data = res.data?.data || res.data || [];

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error cargando vehículos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData({
      tipo: "bicicleta",
      id_centro_de_formacion: "",
      marca: "",
      color: "",
      serial: "",
      placa: "",
      cilindraje: "",
      modelo: "",
      foto_principal: "",
      foto_secundaria: ""
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingItem) {
        await vehiculosApi.update(editingItem.id, formData);
      } else {
        await vehiculosApi.create(formData);
      }

      setShowForm(false);
      setEditingItem(null);
      await loadVehiculos();
    } catch (err) {
      setError("Error guardando vehículo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("¿Eliminar vehículo?")) return;

    try {
      await vehiculosApi.remove(item.id);
      await loadVehiculos();
    } catch {
      setError("Error eliminando vehículo");
    }
  };

  const searchById = async () => {
    try {
      const res = await vehiculosApi.getById(searchId);
      setSearchResult(res.data);
    } catch {
      setError("No encontrado");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: 20 }}>
      <h2>Vehículos</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={openCreateForm}>Nuevo Vehículo</button>

      {/* LISTA */}
      <table width="100%" border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {/* 🔥 FIX DEFINITIVO */}
          {Array.isArray(items) &&
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.marca}</td>
                <td>{item.tipo}</td>
                <td>
                  <button onClick={() => openEditForm(item)}>Editar</button>
                  <button onClick={() => handleDelete(item)}>Eliminar</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* FORM SIMPLE */}
      {showForm && (
        <div>
          <h3>{editingItem ? "Editar" : "Crear"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              name="marca"
              placeholder="Marca"
              value={formData.marca}
              onChange={handleChange}
            />

            <input
              name="serial"
              placeholder="Serial"
              value={formData.serial}
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