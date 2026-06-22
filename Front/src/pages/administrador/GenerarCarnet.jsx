import { useState } from "react";
import axios from "axios";

export default function GenerarCarnet() {
  const [carnet, setCarnet] = useState(null);

  const generar = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      `http://localhost:3000/api/auth/carnet/${user.id}`
    );

    setCarnet(res.data);
  };

  return (
    <div className="content-box">
      <h2>Carnet</h2>

      <button onClick={generar}>
        Generar carnet
      </button>

      {carnet && (
        <div>
          <p>{carnet.nombres} {carnet.apellidos}</p>
          <p>{carnet.documento}</p>

          <img src={carnet.qrImage} alt="QR" />
        </div>
      )}
    </div>
  );
}