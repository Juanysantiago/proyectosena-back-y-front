import { useEffect, useState } from "react";
import { vehiculosApi } from "../api/vehiculosApi";

export default function VehiculosCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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

  // LISTAR
  const loadVehiculos = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await vehiculosApi.list();
      const data = res.data?.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error cargando vehículos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  // 🔥 VALIDACIÓN + LIMPIEZA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // VALIDACIÓN
      if (!formData.marca || !formData.placa) {
        setError("Marca y placa son obligatorios");
        setLoading(false);
        return;
      }

      // LIMPIAR VACÍOS
      const cleanData = {
        ...formData,
        id_centro_de_formacion: formData.id_centro_de_formacion || null,
        color: formData.color || null,
        serial: formData.serial || null,
        placa: formData.placa || null,
        cilindraje: formData.cilindraje || null,
        modelo: formData.modelo || null,
        foto_principal: formData.foto_principal || null,
        foto_secundaria: formData.foto_secundaria || null,
      };

      if (editingItem) {
        await vehiculosApi.update(editingItem.id, cleanData);
      } else {
        await vehiculosApi.create(cleanData);
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
          {items.map((item) => (
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

      {/* FORM */}
      {showForm && (
        <div style={{ marginTop: 20 }}>
          <h3>{editingItem ? "Editar" : "Crear"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              name="tipo"
              placeholder="Tipo"
              value={formData.tipo}
              onChange={handleChange}
            />

            <input
              name="marca"
              placeholder="Marca *"
              value={formData.marca}
              onChange={handleChange}
            />

            <input
              name="placa"
              placeholder="Placa *"
              value={formData.placa}
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