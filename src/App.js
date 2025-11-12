// App.js (CON RUTAS PROTEGIDAS)

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Componente de seguridad
import RutaPrivada from "./componentes/RutaPrivada"; // 👈 IMPORTAR

// Componentes
import LoginRegister from "./componentes/LoginRegister";
import AccountManagement from "./componentes/admin/AccountManagement";
import BookCatalog from "./componentes/BookCatalog";
import BookRegistration from "./componentes/BookRegistration";
import HistorialPrestamos from "./componentes/historial/HistorialPrestamos";
import PrestamoForm from "./componentes/prestamos/PrestamoForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* 🔓 RUTA PÚBLICA (LOGIN) */}
          <Route path="/" element={<LoginRegister />} />

          {/* 🔒 RUTAS PROTEGIDAS PARA ESTUDIANTES / GENERALES */}
          <Route
            path="/bookcatalog"
            element={<RutaPrivada><BookCatalog /></RutaPrivada>}
          />

          <Route
            path="/prestamo"
            element={<RutaPrivada><PrestamoForm /></RutaPrivada>}
          />

          <Route
            path="/historial-prestamos"
            element={<RutaPrivada><HistorialPrestamos userRole="bibliotecario" /></RutaPrivada>}
          />

          {/* 🔒 RUTAS PROTEGIDAS POR ROL (ADMINISTRADOR) */}
          <Route
            path="/admin/dashboard"
            element={<RutaPrivada allowedRoles={["Administrador"]}><AccountManagement /></RutaPrivada>}
          />

          {/* 🔒 RUTAS PROTEGIDAS POR ROL (BIBLIOTECARIO) */}
          <Route
            path="/librarian/dashboard"
            element={<RutaPrivada allowedRoles={["Bibliotecario", "Administrador"]}><BookRegistration /></RutaPrivada>}
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;