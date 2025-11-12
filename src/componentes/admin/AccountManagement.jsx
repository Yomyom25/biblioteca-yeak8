import React, { useState, useEffect } from "react";
import '../../estilos/admin/AccountManagement.css';
import LibrarianList from './LibrarianList';
import AddLibrarianModal from './AddLibrarianModal';
import EditLibrarianModal from './EditLibrarianModal';
import DeleteLibrarianModal from './DeleteLibrarianModal';
import Header from '../Header';
import { useLibrarianManagement } from '../../hooks/useLibrarianManagement'; 

const AccountManagement = () => {
    // 🪝 Usar el hook para las operaciones de API
    const { 
        fetchLibrariansApi, // 🔑 Función para cargar la lista
        addLibrarianApi, 
        loading: apiLoading, 
        error: apiError, 
    } = useLibrarianManagement();

    // 🛑 Iniciamos con un array vacío, los datos se cargarán con useEffect
    const [librarians, setLibrarians] = useState([]);
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLibrarian, setSelectedLibrarian] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

    // 🔑 useEffect para cargar la lista inicial de bibliotecarios al montar el componente
    useEffect(() => {
        const loadLibrarians = async () => {
            const result = await fetchLibrariansApi();
            if (result.success) {
                setLibrarians(result.data);
            }
            // Los errores se gestionan mediante el estado 'apiError' del hook
        };
        loadLibrarians();
    }, []); 

    // Efecto para mostrar errores de la API que no están ligados a un modal específico
    useEffect(() => {
        if (apiError) {
            setNotification({ message: apiError, type: 'error' });
        }
    }, [apiError]);

    // Filtrar bibliotecarios según búsqueda
    const filteredLibrarians = librarians.filter(librarian =>
        (librarian.nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (librarian.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 🚀 FUNCIÓN ASÍNCRONA PARA AGREGAR BIBLIOTECARIO
    const addLibrarian = async (newLibrarian) => {
        const { nombre, email, password } = newLibrarian;
        const matricula = email; // Usamos email como matrícula para unicidad

        // Limpiamos notificaciones previas
        setNotification({ message: '', type: '' });

        const { success, message, newLibrarian: newLibrarianData } = await addLibrarianApi({
            matricula,
            nombre,
            email,
            password,
        });

        if (success) {
            // La API fue exitosa: actualizamos el estado local
            setLibrarians((prevLibrarians) => [...prevLibrarians, newLibrarianData]);
            setNotification({ message, type: 'success' });
            closeModals();
        } else {
            // La API falló: mostramos el mensaje de error del backend
            setNotification({ message, type: 'error' });
        }
    };

    // CRUD Operations (Mantienen lógica local, deben ser actualizadas para interactuar con la API)
    const updateLibrarian = (updatedLibrarian) => {
        // Lógica pendiente de integración con API
        const { usuario, ...dataToUpdate } = updatedLibrarian;
        setLibrarians(librarians.map(lib =>
            lib.id === dataToUpdate.id ? dataToUpdate : lib
        ));
    };

    const deleteLibrarian = (id) => {
        // Lógica pendiente de integración con API
        setLibrarians(librarians.filter(lib => lib.id !== id));
    };

    // Modal handlers
    const handleAdd = () => setShowAddModal(true);

    const handleEdit = (librarian) => {
        setSelectedLibrarian(librarian);
        setShowEditModal(true);
    };

    const handleDelete = (librarian) => {
        setSelectedLibrarian(librarian);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedLibrarian(null);
        // Limpiar notificación solo si el modal se cierra por una razón que no sea un error.
        if (notification.type === 'success' || !notification.message) {
             setNotification({ message: '', type: '' });
        }
    };

    return (
        <>
            <Header />
            <div className="account-management-container">
                <div className="main-card">
                    <div className="header">
                        <h1>Gestión de Cuentas</h1>
                        <p>Administra los bibliotecarios del sistema:</p>
                    </div>

                    <div className="tabs">
                        <button className="tab-button">Bibliotecarios</button>
                    </div>

                    {/* Sección de Notificación/Alerta */}
                    {apiLoading && <div className="api-status loading">🔄 Cargando datos...</div>}
                    {notification.message && (
                        <div className={`api-status ${notification.type}`}>
                            {notification.type === 'success' ? '✅ Éxito: ' : '❌ Error: '} {notification.message}
                        </div>
                    )}

                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Buscar bibliotecario..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="add-button" onClick={handleAdd}>
                            Agregar Bibliotecario
                        </button>
                    </div>
                    
                    {librarians.length === 0 && !apiLoading && !apiError && (
                        <p className="no-data-message">No hay bibliotecarios registrados o no se han cargado datos.</p>
                    )}

                    <LibrarianList
                        librarians={filteredLibrarians}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Modales */}
                {showAddModal && (
                    <AddLibrarianModal
                        onClose={closeModals}
                        onSave={addLibrarian}
                    />
                )}

                {showEditModal && selectedLibrarian && (
                    <EditLibrarianModal
                        librarian={selectedLibrarian}
                        onClose={closeModals}
                        onSave={updateLibrarian}
                    />
                )}

                {showDeleteModal && selectedLibrarian && (
                    <DeleteLibrarianModal
                        librarian={selectedLibrarian}
                        onClose={closeModals}
                        onConfirm={() => {
                            deleteLibrarian(selectedLibrarian.id);
                            closeModals();
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default AccountManagement;