import { useEffect, useState } from "react";
import { entradaSalidaApi } from "../../api/entradaSalidaApi";

export default function EntradaSalidaCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const safeData = (res) => {
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  };

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await entradaSalidaApi.list();
      setItems(safeData(res));
    } catch (err) {
      console.error(err);
      setError("Error cargando registros");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();

    const intervalo = setInterval(() => {
      loadItems();
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🚪 Historial de Entradas y Salidas</h1>

        {loading && <p>⏳ Cargando...</p>}

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#d32f2f",
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Aprendiz</th>
                <th>Vehículo</th>
                <th>Placa / Serial</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>

                    <td>
  {item.fecha
    ? new Date(item.fecha).toLocaleDateString("es-CO")
    : "-"}
</td>

                    <td>{item.aprendiz}</td>

                    <td>{item.vehiculo}</td>

                    <td>{item.placaSerial}</td>

                    <td>
                      {item.hora_entrada
                        ? new Date(item.hora_entrada).toLocaleTimeString(
                            "es-CO"
                          )
                        : "-"}
                    </td>

                    <td>
                      {item.hora_salida
                        ? new Date(item.hora_salida).toLocaleTimeString(
                            "es-CO"
                          )
                        : "-"}
                    </td>

                    <td>
                      {item.estado === "dentro" ? "🟢 Dentro" : "🔴 Fuera"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No hay registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}