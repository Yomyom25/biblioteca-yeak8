import React, { useState } from 'react';
import '../../estilos/admin/AddLibrarianModal.css';

const AddLibrarianModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '', // Campo para la contraseña
    confirmPassword: '' // Campo para confirmar la contraseña
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, revísalas.');
        return;
    }
    
    // Si coinciden, llamar a onSave
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Agregar Bibliotecario</h2>
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
          {/* Campo 'Usuario' eliminado */}
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
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="confirm-btn">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLibrarianModal;