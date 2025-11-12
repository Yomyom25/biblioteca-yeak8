import React, { useState, useEffect } from "react";
import "../../estilos/HistorialPrestamos.css";

const HistorialPrestamos = ({ userRole }) => {
  // Validamos si el usuario es bibliotecario
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (userRole === "bibliotecario") {
      setIsAuthorized(true);
    }
  }, [userRole]);

  // Datos simulados
  const [historial, setHistorial] = useState([
    {
      id: 1,
      usuario: "YOMARA EUAN",
      matricula: "E20080935",
      libro: "Cien años de soledad",
      fechaPrestamo: "2025-10-01",
      fechaDevolucion: "2025-10-15",
      estatus: "Devuelto",
    },
    {
      id: 2,
      usuario: "MIGUEL CANUL",
      matricula: "E20080940",
      libro: "El Principito",
      fechaPrestamo: "2025-10-25",
      fechaDevolucion: "2025-11-12",
      estatus: "Pendiente",
    },
    {
      id: 3,
      usuario: "KARLA PECH",
      matricula: "E20080922",
      libro: "Don Quijote de la Mancha",
      fechaPrestamo: "2025-10-10",
      fechaDevolucion: "2025-10-30",
      estatus: "Devuelto",
    },
  ]);

  if (!isAuthorized) {
    return (
      <div className="access-denied">
        <h2> Acceso Denegado</h2>
        <p>Esta sección es exclusiva para bibliotecarios.</p>
      </div>
    );
  }

  return (
    <div className="app-background">
      <div className="pillar pillar-left"></div>
      <div className="pillar pillar-right"></div>

      <div className="historial-container">
        <div className="historial-header">
          <h2> Historial de Préstamos</h2>
          <p>Consulta y gestiona los registros de préstamos realizados</p>
        </div>

        <div className="historial-table-container">
          <table className="historial-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Matrícula</th>
                <th>Libro</th>
                <th>Fecha de Préstamo</th>
                <th>Fecha de Devolución</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item) => (
                <tr key={item.id} className="fade-in-row">
                  <td>{item.usuario}</td>
                  <td>{item.matricula}</td>
                  <td>{item.libro}</td>
                  <td>{item.fechaPrestamo}</td>
                  <td>{item.fechaDevolucion}</td>
                  <td>
                    <span
                      className={`estatus ${
                        item.estatus === "Devuelto"
                          ? "devuelto"
                          : "pendiente"
                      }`}
                    >
                      {item.estatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistorialPrestamos;
