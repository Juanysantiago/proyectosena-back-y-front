import { useEffect, useState } from "react";
import { vehiculosApi } from "../api/vehiculosApi";

const initialForm = {
  tipo: "bicicleta",
  id_centro_de_formacion: "",
  marca: "",
  color: "",
  serial: "",
  placa: "",
  cilindraje: "",
  modelo: "",
  foto_principal: "",
  foto_secundaria: "",
};

export default function VehiculosCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const loadVehiculos = async () => {
    try {
      setLoading(true);

      const res = await vehiculosApi.list();

      setItems(res.data?.data || []);
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
    setFormData(initialForm);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (!formData.id_centro_de_formacion)
        return setError("Centro de formación obligatorio");

      if (!formData.marca)
        return setError("Marca obligatoria");

      if (
        formData.tipo === "bicicleta" &&
        !formData.serial
      ) {
        return setError("Serial obligatorio");
      }

      if (
        formData.tipo === "moto" &&
        !formData.placa
      ) {
        return setError("Placa obligatoria");
      }

      if (editingItem) {
        await vehiculosApi.update(
          editingItem.id,
          formData
        );
      } else {
        await vehiculosApi.create(formData);
      }

      setShowForm(false);
      setEditingItem(null);
      setFormData(initialForm);

      await loadVehiculos();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Error guardando vehículo"
      );
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
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Gestión de Vehículos</h1>

        <button
          className="btn-primary"
          onClick={openCreateForm}
        >
          + Nuevo Vehículo
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#ffd9d9",
            color: "#900",
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      <div className="card">
        {loading ? (
          <p>Cargando vehículos...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Color</th>
                <th>Placa</th>
                <th>Serial</th>
                <th>Centro</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.tipo}</td>
                    <td>{item.marca}</td>
                    <td>{item.color}</td>
                    <td>{item.placa}</td>
                    <td>{item.serial}</td>
                    <td>{item.id_centro_de_formacion}</td>

                    <td>
                      <button
                        className="btn-warning"
                        onClick={() =>
                          openEditForm(item)
                        }
                      >
                        Editar
                      </button>

                      {" "}

                      <button
                        className="btn-danger"
                        onClick={() =>
                          handleDelete(item)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    No hay vehículos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {editingItem
                ? "Editar Vehículo"
                : "Nuevo Vehículo"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label>Tipo de Vehículo</label>

              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="bicicleta">
                  Bicicleta
                </option>

                <option value="moto">
                  Moto
                </option>
              </select>

              <br />
              <br />

              <input
                name="id_centro_de_formacion"
                placeholder="Centro de Formación"
                value={formData.id_centro_de_formacion}
                onChange={handleChange}
              />

              <br />
              <br />

              <input
                name="marca"
                placeholder="Marca"
                value={formData.marca}
                onChange={handleChange}
              />

              <br />
              <br />

              <input
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={handleChange}
              />

              <br />
              <br />

              {formData.tipo === "bicicleta" && (
                <>
                  <input
                    name="serial"
                    placeholder="Serial"
                    value={formData.serial}
                    onChange={handleChange}
                  />

                  <br />
                  <br />
                </>
              )}

              {formData.tipo === "moto" && (
                <>
                  <input
                    name="placa"
                    placeholder="Placa"
                    value={formData.placa}
                    onChange={handleChange}
                  />

                  <br />
                  <br />

                  <input
                    name="cilindraje"
                    placeholder="Cilindraje"
                    value={formData.cilindraje}
                    onChange={handleChange}
                  />

                  <br />
                  <br />

                  <input
                    name="modelo"
                    placeholder="Modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                  />

                  <br />
                  <br />
                </>
              )}

              <input
                name="foto_principal"
                placeholder="URL Foto Principal"
                value={formData.foto_principal}
                onChange={handleChange}
              />

              <br />
              <br />

              <input
                name="foto_secundaria"
                placeholder="URL Foto Secundaria"
                value={formData.foto_secundaria}
                onChange={handleChange}
              />

              <br />
              <br />

              <button
                type="submit"
                className="btn-primary"
              >
                {editingItem
                  ? "Actualizar"
                  : "Guardar"}
              </button>

              <button
                type="button"
                className="btn-danger"
                style={{ marginLeft: 10 }}
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}