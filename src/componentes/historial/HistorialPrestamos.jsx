import React, { useState, useEffect } from "react";
import "../../estilos/HistorialPrestamos.css";
// 🔑 Importar el hook de gestión de préstamos
import { useLoanHistoryManagement } from '../../hooks/useLoanHistoryManagement'; 
// 🔑 Importar la función para obtener el rol directamente
import { getUserRole } from '../../utils/authUtils'; // <--- Asumiendo esta ruta

// NOTA: EL COMPONENTE YA NO RECIBE { userRole } COMO PROP
const HistorialPrestamos = () => { 
  const [isAuthorized, setIsAuthorized] = useState(false);
  // 🛑 Datos simulados eliminados, inicializamos con array vacío
  const [historial, setHistorial] = useState([]); 
  const [notification, setNotification] = useState({ message: '', type: '' });

  // 🪝 Usar el custom hook
  const { 
    fetchLoanHistoryApi, 
    returnLoanApi, 
    loading, 
    error 
  } = useLoanHistoryManagement();

  // 🔑 Lógica de autorización y carga inicial
  useEffect(() => {
    const role = getUserRole(); // Obtener el rol del usuario

    // 💡 SOLUCIÓN AL ERROR: Hacemos la verificación en minúsculas para robustez
    const authorized = role && (role.toLowerCase() === "bibliotecario" || role.toLowerCase() === "administrador");
    
    setIsAuthorized(authorized);

    if (authorized) {
        const loadHistory = async () => {
            setNotification({ message: 'Cargando historial...', type: 'loading' });
            const result = await fetchLoanHistoryApi();
            if (result.success) {
                setHistorial(result.data);
                setNotification({ message: '', type: '' }); // Limpiar al cargar
            } else {
                setNotification({ message: error || 'Error al cargar el historial.', type: 'error' });
            }
        };
        loadHistory();
    }
  }, []); // El array de dependencias está vacío para ejecutarse una sola vez al montar

  // Mostrar errores de API
  useEffect(() => {
    if (error) {
        setNotification({ message: error, type: 'error' });
    }
  }, [error]);


  // 🚀 Función para manejar la devolución
  const handleReturn = async (item) => {
    const isConfirmed = window.confirm(
        `¿Está seguro de marcar el préstamo del libro "${item.libro}" (Matrícula: ${item.matricula}) como devuelto?\nEsta acción es irreversible y afectará el inventario.`
    );

    if (isConfirmed) {
        setNotification({ message: 'Procesando devolución...', type: 'loading' });
        
        const result = await returnLoanApi(item.id);

        if (result.success) {
            // Actualizar el estado local para reflejar el cambio inmediatamente en la tabla
            setHistorial(prevHistorial => 
                prevHistorial.map(loan => 
                    loan.id === item.id 
                    ? { 
                        ...loan, 
                        estatus: 'Devuelto', 
                        fechaDevolucion: result.fechaDevolucion 
                    } 
                    : loan
                )
            );
            setNotification({ message: result.message, type: 'success' });
        } else {
            setNotification({ message: result.message || error || 'Error desconocido.', type: 'error' });
        }
    }
  };


  if (!isAuthorized) {
    return (
      <div className="access-denied">
        <h2> 🔒 Acceso Denegado</h2>
        <p>Esta sección es exclusiva para bibliotecarios y administradores.</p>
      </div>
    );
  }

  // 🎨 Renderizado del componente
  return (
    <div className="app-background">
      <div className="pillar pillar-left"></div>
      <div className="pillar pillar-right"></div>

      <div className="historial-container">
        <div className="historial-header">
          <h2> 📚 Historial de Préstamos</h2>
          <p>Consulta y gestiona los registros de préstamos realizados</p>
        </div>
        
        {/* Notificaciones */}
        {notification.message && (
            <div className={`notification-bar ${notification.type === 'success' ? 'success' : notification.type === 'error' ? 'error' : 'loading'}`}>
                {notification.message}
            </div>
        )}

        <div className="historial-table-container">
          <table className="historial-table">
            <thead>
              <tr>
                <th>Usuario (Matrícula)</th>
                <th>Libro</th>
                <th>F. Préstamo</th>
                <th>F. Límite</th>
                <th>F. Devolución</th>
                <th>Estatus</th>
                <th>Acción</th> {/* Columna de acción */}
              </tr>
            </thead>
            <tbody>
              {loading && historial.length === 0 ? (
                <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                        Cargando historial de préstamos...
                    </td>
                </tr>
              ) : historial.length === 0 ? (
                <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                        No se encontraron préstamos registrados.
                    </td>
                </tr>
              ) : (
                historial.map((item) => (
                    <tr key={item.id} className="fade-in-row">
                      <td>{item.matricula}</td>
                      <td>{item.libro}</td>
                      <td>{item.fechaPrestamo}</td>
                      <td>{item.fecha_limite}</td> {/* Asumiendo que el backend envía la fecha límite */}
                      <td>{item.fechaDevolucion || '---'}</td> 
                      <td>
                        <span
                          className={`estatus ${
                            item.estatus === "Devuelto" ? "devuelto" : "pendiente"
                          }`}
                        >
                          {item.estatus}
                        </span>
                      </td>
                      <td>
                        {/* 🔑 Botón para devolver, solo si el estatus es Pendiente */}
                        {item.estatus === "Pendiente" ? (
                            <button
                                className="devolver-btn"
                                onClick={() => handleReturn(item)}
                                disabled={loading}
                            >
                                Devolver
                            </button>
                        ) : (
                            <span className="devolver-completado">Completado</span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistorialPrestamos;