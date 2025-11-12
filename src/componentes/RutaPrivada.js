// src/componentes/RutaPrivada.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children, allowedRoles }) => {
    // 1. Obtener los datos del usuario
    const storedData = localStorage.getItem('userData');
    const user = storedData ? JSON.parse(storedData) : null;
    
    // Asumimos que la autenticación es exitosa si existe un token o matrícula
    const isAuthenticated = !!user?.matricula; 
    const userRole = user?.rol;

    // 2. Comprobar la autenticación
    if (!isAuthenticated) {
        // Redirigir al login si no está autenticado
        return <Navigate to="/" replace />;
    }

    // 3. Comprobar la autorización (Rol)
    // Si la ruta requiere roles específicos (e.g., admin, bibliotecario)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirigir a una página de acceso denegado o al catálogo si no tiene el rol
        console.warn(`Acceso denegado. Rol requerido: ${allowedRoles.join(', ')}. Rol de usuario: ${userRole}`);
        return <Navigate to="/bookcatalog" replace />; // O puedes usar una ruta de error 403
    }

    // 4. Si está autenticado y autorizado, renderizar la ruta
    return children;
};

export default RutaPrivada;