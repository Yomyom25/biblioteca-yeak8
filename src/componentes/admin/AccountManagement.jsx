import React, { useState } from "react";
import '../../estilos/admin/AccountManagement.css';
import LibrarianList from './LibrarianList';
import AddLibrarianModal from './AddLibrarianModal';
import EditLibrarianModal from './EditLibrarianModal';
import DeleteLibrarianModal from './DeleteLibrarianModal';

const AccountManagement = () => {
  const [librarians, setLibrarians] = useState([
    { id: 1, nombre: "Ana García", usuario: "ana.garcia", email: "ana.garcia@biblioteca.org" },
    { id: 2, nombre: "Carlos López", usuario: "carlos.lopez", email: "carlos@biblioteca.org" },
    { id: 3, nombre: "Pedro Sánchez", usuario: "pedro.sanchez", email: "pedro@biblioteca.org" },
    { id: 4, nombre: "María Rodríguez", usuario: "maria.rodriguez", email: "maria@biblioteca.org" },
    { id: 5, nombre: "Hibslier Dostowdsski", usuario: "hibslier.d", email: "hibslier@biblioteca.org" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar bibliotecarios según búsqueda
  const filteredLibrarians = librarians.filter(librarian =>
    librarian.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    librarian.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    librarian.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CRUD Operations
  const addLibrarian = (newLibrarian) => {
    const newId = Math.max(...librarians.map(l => l.id)) + 1;
    setLibrarians([...librarians, { ...newLibrarian, id: newId }]);
  };

  const updateLibrarian = (updatedLibrarian) => {
    setLibrarians(librarians.map(lib => 
      lib.id === updatedLibrarian.id ? updatedLibrarian : lib
    ));
  };

  const deleteLibrarian = (id) => {
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
  };

  return (
    <div className="account-management-container">
      <div className="main-card">
        <div className="header">
          <h1>Gestión de Cuentas</h1>
          <p>Administra los bibliotecarios del sistema:</p>
        </div>

        <div className="tabs">
          <button className="tab-button">Bibliotecarios</button>
        </div>

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
  );
};

export default AccountManagement;