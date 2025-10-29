// App.js
import React from 'react';
// 💡 Importar los componentes necesarios para las rutas
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import LoginRegister from './componentes/LoginRegister';
import AccountManagement from './componentes/admin/AccountManagement'; 
import BookCatalog from './componentes/BookCatalog';
import BookRegistration from './componentes/BookRegistration'; 


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta de inicio por defecto: Login/Registro */}
          <Route path="/" element={<LoginRegister />} /> 
          
          {/* 🚀 RUTAS CRÍTICAS PARA LA REDIRECCIÓN 🚀 */}
          
          {/* Ruta para el Estudiante */}
          <Route path="/bookcatalog" element={<BookCatalog />} />
          
          {/* Ruta para el Administrador */}
          <Route path="/admin/dashboard" element={<AccountManagement />} />

          {/* Ruta para el Bibliotecario (Usando BookRegistration como ejemplo) */}
          <Route path="/librarian/dashboard" element={<BookRegistration />} />

          {/* Puedes agregar rutas para errores 404 aquí si quieres */}
          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;