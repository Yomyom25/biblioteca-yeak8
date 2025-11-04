import React, { useState, useEffect } from 'react';
import '../../estilos/admin/EditLibrarianModal.css';

const EditLibrarianModal = ({ librarian, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    email: ''
  });

  useEffect(() => {
    if (librarian) {
      setFormData({
        nombre: librarian.nombre,
        usuario: librarian.usuario,
        email: librarian.email
      });
    }
  }, [librarian]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: librarian.id });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Modificar Bibliotecario</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Usuario:</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="confirm-btn">
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLibrarianModal;