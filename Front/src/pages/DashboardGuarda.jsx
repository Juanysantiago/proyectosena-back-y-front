import NavbarGuarda from "../components/NavbarGuarda";
import "../styles/DashboardGuarda.css";

export default function DashboardGuarda() {
  return (
    <>
      <NavbarGuarda />

      <div className="guarda-container">
        <main className="guarda-content">
          <div className="content-box">
            <h2>Bienvenido Guarda</h2>
            <p>Desde aquí podrás gestionar las entradas y salidas de vehículos.</p>
          </div>
        </main>
      </div>
    </>
  );
}