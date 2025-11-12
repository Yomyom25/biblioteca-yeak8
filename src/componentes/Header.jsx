import React from 'react';
import '../estilos/Header.css';

const Header = () => {
    const handleLogout = () => {
        // Aquí iría la lógica real de cerrar sesión (ej. limpiar tokens, redirigir)
        alert('Cerrando sesión...');
    };

    return (
        <header className="main-header">
            <div className="header-title">
                <h1>Biblioteca YEAK8</h1>
            </div>
            <button
                className="logout-button"
                onClick={handleLogout}
            >
                Cerrar Sesión
            </button>
        </header>
    );
};

export default Header;