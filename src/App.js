// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Componentes principales
import LoginRegister from "./componentes/LoginRegister";
import AccountManagement from "./componentes/admin/AccountManagement";
import BookCatalog from "./componentes/BookCatalog";
import BookRegistration from "./componentes/BookRegistration";
import HistorialPrestamos from "./componentes/historial/HistorialPrestamos";
import PrestamoForm from "./componentes/prestamos/PrestamoForm"; // ✅ Nuevo formulario

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<LoginRegister />} />

          {/* Catálogo de libros */}
          <Route path="/bookcatalog" element={<BookCatalog />} />

          {/* Panel del administrador */}
          <Route path="/admin/dashboard" element={<AccountManagement />} />

          {/* Panel del bibliotecario */}
          <Route path="/librarian/dashboard" element={<BookRegistration />} />

          {/* Historial de préstamos */}
          <Route
            path="/historial-prestamos"
            element={<HistorialPrestamos userRole="bibliotecario" />}
          />

          {/* 💡 Nueva ruta para el formulario de préstamo */}
          <Route path="/prestamo" element={<PrestamoForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
