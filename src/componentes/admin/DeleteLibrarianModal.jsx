import React, { useState } from 'react';
import '../../estilos/admin/DeleteLibrarianModal.css';

const DeleteLibrarianModal = ({ librarian, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (password) {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Confirmar Eliminación</h2>
        <p className="warning-text">
          ¡Advertencia! Está punto de eliminar a {librarian.nombre}.
        </p>
        <p className="instruction-text">
          Por favor, introduzca su contraseña de administrador para confirmar:
        </p>
        <input
          type="password"
          className="password-input"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
          <button 
            onClick={handleConfirm} 
            className="confirm-btn"
            disabled={!password}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLibrarianModal;