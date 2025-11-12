import React from 'react';
import '../../estilos/admin/LibrarianList.css';

const LibrarianList = ({ librarians, onEdit, onDelete }) => {
  return (
    <table className="librarian-table">
      <thead>
        <tr className="table-header">
          <th>Nombre</th>
          <th>Email</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {librarians.map((librarian) => (
          <tr key={librarian.id} className="table-row">
            <td className="table-cell">{librarian.nombre}</td>
            <td className="table-cell">{librarian.email}</td>
            <td className="table-cell text-center">
              <div className="action-buttons">
                <button
                  onClick={() => onEdit(librarian)}
                  className="modify-btn"
                >
                  Modificar
                </button>
                <button
                  onClick={() => onDelete(librarian)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LibrarianList;