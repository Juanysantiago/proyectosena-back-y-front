// /src/pages/ConfigGrCrud.jsx

import { useEffect, useState } from "react";
import { centroFormacionApi } from "../../api/centroFormacionApi";

export default function ConfigGrCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "",
    direccion: "",
    estado: "activo"
  });

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await centroFormacionApi.list();

      console.log("Centros cargados:", res.data);

      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Error cargando centros");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openCreateForm = () => {
    setEditingItem(null);

    setFormData({
      nombre: "",
      ciudad: "",
      direccion: "",
      estado: "activo"
    });

    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);

    setFormData({
      nombre: item.nombre || "",
      ciudad: item.ciudad || "",
      direccion: item.direccion || "",
      estado: item.estado || "activo"
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (editingItem) {
        await centroFormacionApi.update(
          editingItem.id,
          formData
        );

        alert("Centro actualizado correctamente");
      } else {
        await centroFormacionApi.create(formData);

        alert("Centro creado correctamente");
      }

      setShowForm(false);
      setEditingItem(null);

      await loadItems();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Error guardando centro"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("¿Eliminar centro?")) return;

    try {
      await centroFormacionApi.remove(item.id);

      await loadItems();
    } catch (err) {
      console.error(err);
      setError("Error eliminando centro");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">
          🏫 Centros de Formación
        </h1>

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#c62828",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px"
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
          ➕ Nuevo Centro
        </button>

        {loading && <p>Cargando...</p>}

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>{item.ciudad}</td>
                  <td>{item.direccion}</td>
                  <td>{item.estado}</td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center"
                      }}
                    >
                      <button
                        className="btn-warning"
                        onClick={() =>
                          openEditForm(item)
                        }
                      >
                        ✏️ Editar
                      </button>

                      <button
                        className="btn-danger"
                        onClick={() =>
                          handleDelete(item)
                        }
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 &&
                !loading && (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center"
                      }}
                    >
                      No hay centros registrados
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
                  textAlign: "center"
                }}
              >
                {editingItem
                  ? "✏️ Editar Centro"
                  : "➕ Crear Centro"}
              </h2>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px"
                }}
              >
                <div>
                  <label>Nombre</label>

                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Ciudad</label>

                  <input
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Dirección</label>

                  <input
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Estado</label>

                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="activo">
                      Activo
                    </option>

                    <option value="inactivo">
                      Inactivo
                    </option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "15px"
                  }}
                >
                  <button
                    className="btn-primary"
                    type="submit"
                  >
                    {editingItem
                      ? "💾 Actualizar"
                      : "✅ Crear"}
                  </button>

                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() =>
                      setShowForm(false)
                    }
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