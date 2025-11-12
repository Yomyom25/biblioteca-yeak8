// src/componentes/Header.js (Final)
import React from 'react';
import useAuth from '../hooks/useAuth'; // 👈 IMPORTAR EL HOOK
import '../estilos/Header.css';

const Header = () => {
    // 💡 Obtener la función de cierre de sesión del hook
    const { handleLogout } = useAuth();

    return (
        <header className="main-header">
            <div className="header-title">
                <h1>Biblioteca YEAK8</h1>
            </div>
            <button
                className="logout-button"
                // 💡 Asignar la función handleLogout al evento onClick
                onClick={handleLogout} 
            >
                Cerrar Sesión
            </button>
        </header>
    );
};

export default Header;