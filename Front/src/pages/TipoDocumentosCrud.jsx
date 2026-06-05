import { useEffect, useMemo, useState } from "react";
import { tipoDocumentosApi } from "../api/tipoDocumentosApi";

const emptyForm = { sigla: "", nombre_documento: "" };

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
    setError("");
    setLoadingList(true);

    try {
      const res = await tipoDocumentosApi.list();

      // 🔥 SIEMPRE asegurar array
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.statusText || err?.message || "Error listando");
      setItems([]); // 🔥 evita crash
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      sigla: item.sigla ?? "",
      nombre_documento: item.nombre_documento ?? "",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.sigla.trim() || !form.nombre_documento.trim()) {
      setError("sigla y nombre_documento son obligatorios");
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await tipoDocumentosApi.update(editingId, form);
      } else {
        await tipoDocumentosApi.create(form);
      }

      startCreate();
      await loadList();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          "Error guardando"
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const ok = window.confirm(`¿Eliminar id=${id}?`);
    if (!ok) return;

    try {
      await tipoDocumentosApi.remove(id);
      if (editingId === id) startCreate();
      await loadList();
    } catch (err) {
      setError(err?.message || "Error eliminando");
    }
  };

  const searchById = async () => {
    const id = searchId.trim();
    if (!id) return setError("Escribe un id");

    setSearchLoading(true);
    setError("");

    try {
      const res = await tipoDocumentosApi.getById(id);
      setSearchResult(res.data);
    } catch (err) {
      setError("No encontrado");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>CRUD - Tipos de Documento</h2>

      {error && (
        <div style={{ background: "#ffe7e7", padding: 10, marginBottom: 10 }}>
          {error}
        </div>
      )}

      {/* FORM */}
      <div style={{ border: "1px solid #ddd", padding: 14, marginBottom: 18 }}>
        <h3>{isEditing ? "Editar" : "Crear"}</h3>

        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input
            name="sigla"
            value={form.sigla}
            onChange={onChange}
            placeholder="Sigla"
          />

          <input
            name="nombre_documento"
            value={form.nombre_documento}
            onChange={onChange}
            placeholder="Nombre documento"
          />

          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </button>

          {isEditing && <button onClick={startCreate}>Cancelar</button>}
        </form>
      </div>

      {/* LISTA */}
      <div>
        <button onClick={loadList} disabled={loadingList}>
          {loadingList ? "Cargando..." : "Recargar"}
        </button>

        <table width="100%" border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sigla</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {(Array.isArray(items) ? items : []).map((it) => (
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>{it.sigla}</td>
                <td>{it.nombre_documento}</td>
                <td>
                  <button onClick={() => startEdit(it)}>Editar</button>
                  <button onClick={() => remove(it.id)}>Eliminar</button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="4">Sin datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}