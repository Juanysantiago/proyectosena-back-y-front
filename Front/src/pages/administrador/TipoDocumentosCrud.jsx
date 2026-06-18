import { useEffect, useMemo, useState } from "react";
import { tipoDocumentosApi } from "../../api/tipoDocumentosApi";

const emptyForm = {
  sigla: "",
  nombre_documento: "",
};

export default function TipoDocumentosCrud() {
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [error, setError] = useState("");

  const loadList = async () => {
    try {
      setLoadingList(true);

      const res = await tipoDocumentosApi.list();

      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error al cargar datos"
      );
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSearchResult(null);
    setError("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);

    setForm({
      sigla: item.sigla || "",
      nombre_documento: item.nombre_documento || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.sigla || !form.nombre_documento) {
        setError("Todos los campos son obligatorios");
        return;
      }

      if (isEditing) {
        await tipoDocumentosApi.update(editingId, form);
      } else {
        await tipoDocumentosApi.create(form);
      }

      startCreate();
      loadList();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error guardando"
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Desea eliminar este registro?")) {
      return;
    }

    try {
      await tipoDocumentosApi.remove(id);

      loadList();

      if (editingId === id) {
        startCreate();
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error eliminando"
      );
    }
  };

  const searchById = async () => {
    try {
      setError("");

      if (!searchId.trim()) {
        setError("Ingrese un ID");
        return;
      }

      setSearchLoading(true);

      const res = await tipoDocumentosApi.getById(searchId);

      setSearchResult(res.data);
    } catch (err) {
      setSearchResult(null);
      setError("Registro no encontrado");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        Gestión de Tipos de Documento
      </h1>

      {error && (
        <div
          style={{
            background: "#ffdede",
            color: "#b30000",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* FORMULARIO */}

      <div className="card">
        <h2>
          {isEditing
            ? "Editar Tipo Documento"
            : "Nuevo Tipo Documento"}
        </h2>

        <br />

        <form
          onSubmit={submit}
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          <input
            type="text"
            name="sigla"
            placeholder="Sigla"
            value={form.sigla}
            onChange={onChange}
          />

          <input
            type="text"
            name="nombre_documento"
            placeholder="Nombre Documento"
            value={form.nombre_documento}
            onChange={onChange}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              className="btn-primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Guardando..."
                : isEditing
                ? "Actualizar"
                : "Crear"}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={startCreate}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* BUSCAR */}

      <div className="card">
        <h2>Buscar por ID</h2>

        <br />

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="number"
            placeholder="Ingrese ID"
            value={searchId}
            onChange={(e) =>
              setSearchId(e.target.value)
            }
          />

          <button
            className="btn-primary"
            onClick={searchById}
            disabled={searchLoading}
          >
            {searchLoading
              ? "Buscando..."
              : "Buscar"}
          </button>
        </div>

        {searchResult && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>ID:</strong>{" "}
              {searchResult.id}
            </p>

            <p>
              <strong>Sigla:</strong>{" "}
              {searchResult.sigla}
            </p>

            <p>
              <strong>Nombre:</strong>{" "}
              {searchResult.nombre_documento}
            </p>

            <br />

            <button
              className="btn-warning"
              onClick={() =>
                startEdit(searchResult)
              }
            >
              Editar
            </button>
          </div>
        )}
      </div>

      {/* TABLA */}

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2>Listado de Registros</h2>

          <button
            className="btn-primary"
            onClick={loadList}
          >
            {loadingList
              ? "Cargando..."
              : "Actualizar"}
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Sigla</th>
              <th>Nombre Documento</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>{item.sigla}</td>

                  <td>
                    {item.nombre_documento}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <button
                        className="btn-warning"
                        onClick={() =>
                          startEdit(item)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="btn-danger"
                        onClick={() =>
                          remove(item.id)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}