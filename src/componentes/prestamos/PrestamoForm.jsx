import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../../estilos/PrestamoForm.css";

const PrestamoForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 📖 Obtener datos pasados desde el catálogo
  const { preselectedBook, userData: passedUserData } = location.state || {};
  
  // 👤 Datos del estudiante (priorizar los pasados, luego localStorage/sessionStorage)
  const storedUserData = JSON.parse(
    localStorage.getItem('userData') || 
    sessionStorage.getItem('userData') || 
    '{}'
  );
  
  const studentData = passedUserData || storedUserData || {
    nombre: "YOMARA EUAN",
    matricula: "E20080935",
  };

  const getDefaultDates = () => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 21);
    return {
      start: today.toISOString().split("T")[0],
      end: future.toISOString().split("T")[0],
    };
  };

  const defaultDates = getDefaultDates();
  
  // 📚 Inicializar con el libro preseleccionado si existe
  const [selectedBooks, setSelectedBooks] = useState(
    preselectedBook ? [preselectedBook.titulo] : []
  );
  
  const [removingBook, setRemovingBook] = useState(null);
  const [bookList] = useState([
    "El Principito",
    "Cien años de soledad",
    "1984",
    "Don Quijote de la Mancha",
    "Fahrenheit 451",
    "La Odisea",
    "Crimen y Castigo",
    "Orgullo y Prejuicio",
    "Los Miserables",
    "Matar a un ruiseñor",
    "El alquimista",
    "La sombra del viento",
    "Rayuela",
    "El retrato de Dorian Gray",
    "Drácula",
  ]);

  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [dateAlert, setDateAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(preselectedBook ? true : false);

  // 🔍 Filtrar libros (excluir los ya seleccionados)
  const filteredBooks = bookList.filter((book) =>
    book.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedBooks.includes(book)
  );

  const handleBookClick = (book) => {
    if (!selectedBooks.includes(book) && selectedBooks.length < 2) {
      setSelectedBooks((prev) => [...prev, book]);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleClear = () => {
    const reset = getDefaultDates();
    setSelectedBooks([]);
    setStartDate(reset.start);
    setEndDate(reset.end);
    setDateAlert(false);
    setSearchTerm("");
  };

  const handleCancel = () => {
    // Regresar al catálogo
  navigate('/bookcatalog')
  };

  const handleDateChange = (type, value) => {
    if (type === "start") setStartDate(value);
    if (type === "end") setEndDate(value);

    const start = new Date(type === "start" ? value : startDate);
    const end = new Date(type === "end" ? value : endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    setDateAlert(diff > 21);
  };

  useEffect(() => {
    if (selectedBooks.length > 0) {
      setTimeout(() => setIsExpanded(true), 100);
    } else {
      setIsExpanded(false);
    }
  }, [selectedBooks]);

  // 🧠 Animación de eliminación suave
  const removeBook = (book) => {
    setRemovingBook(book);
    setTimeout(() => {
      setSelectedBooks((prev) => prev.filter((b) => b !== book));
      setRemovingBook(null);
    }, 300);
  };

  // 📢 Mostrar mensaje si viene de una reserva
  useEffect(() => {
    if (preselectedBook) {
      console.log(`📚 Libro preseleccionado: ${preselectedBook.titulo}`);
    }
  }, [preselectedBook]);

  return (
    <div className="app-background">
      <div className="pillar pillar-left"></div>
      <div className="pillar pillar-right"></div>

      <div className="loan-container">
        <div className="loan-header">
          <h2>Gestión de Préstamos</h2>
          <p>Administra los préstamos y reservas de libros</p>
          
          {/* 🎉 Mensaje de libro preseleccionado */}
          {preselectedBook && (
            <div style={{
              backgroundColor: '#e3f2fd',
              border: '1px solid #90caf9',
              padding: '12px 16px',
              borderRadius: '8px',
              marginTop: '12px',
              fontSize: '0.9rem',
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'slideIn 0.5s ease-out'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📖</span>
              <span>
                Has seleccionado: <strong>{preselectedBook.titulo}</strong> por {preselectedBook.autor}
              </span>
            </div>
          )}
        </div>

        <div className="loan-body">
          {/* === Columna Izquierda === */}
          <div className="loan-column">
            <h3>Datos del Préstamo</h3>

            <div className="field">
              <input type="text" placeholder="Buscar estudiante..." readOnly />
            </div>

            <div className="field">
              <label>Nombre del Estudiante</label>
              <input type="text" value={studentData.nombre} readOnly />
            </div>

            <div className="field">
              <label>Matrícula</label>
              <input type="text" value={studentData.matricula} readOnly />
            </div>

            <p className="limit-text">Máximo 2 libros por préstamo</p>

            {selectedBooks.length === 2 && (
              <div className="alert-box slide-in">
                <span className="alert-icon">⚠️</span>
                <span>Máximo de libros alcanzado.</span>
              </div>
            )}
          </div>

          {/* === Columna Derecha === */}
          <div className="loan-column">
            <div className="field">
              <label>
                Buscar y Seleccionar Libro
                {selectedBooks.length > 0 && (
                  <span style={{ color: '#0b3361', fontWeight: 'normal' }}>
                    {' '}({2 - selectedBooks.length} disponible{2 - selectedBooks.length !== 1 ? 's' : ''})
                  </span>
                )}
              </label>
              <input
                type="text"
                placeholder={
                  selectedBooks.length >= 2 
                    ? "Máximo alcanzado" 
                    : "Escribe el título del libro..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                disabled={selectedBooks.length >= 2}
                style={{
                  backgroundColor: selectedBooks.length >= 2 ? '#f5f5f5' : 'white',
                  cursor: selectedBooks.length >= 2 ? 'not-allowed' : 'text'
                }}
              />

              {showDropdown && filteredBooks.length > 0 && selectedBooks.length < 2 && (
                <ul className="book-dropdown">
                  {filteredBooks.map((book, index) => (
                    <li key={index} onClick={() => handleBookClick(book)}>
                      {book}
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && searchTerm && filteredBooks.length === 0 && selectedBooks.length < 2 && (
                <div className="no-results">No se encontró ningún libro</div>
              )}
            </div>

            {/* === Lista de Libros === */}
            <div className="field">
              <label>Libros Seleccionados ({selectedBooks.length}/2)</label>
              <div className={`book-card-container ${isExpanded ? "expanded" : ""}`}>
                {selectedBooks.map((book, index) => (
                  <div
                    key={index}
                    className={`book-card fade-in ${
                      removingBook === book ? "removing" : ""
                    }`}
                  >
                    <div className="book-info">
                      <span className="book-emoji">📘</span>
                      <p>{book}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeBook(book)}
                      title="Eliminar libro"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* === Fechas === */}
            <div className="field">
              <label>Fecha de Devolución</label>
              <div className="date-fields">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                />
              </div>

              {dateAlert && (
                <div className="alert-box slide-in">
                  <span className="alert-icon">⏱️</span>
                  <span>
                    El préstamo no puede exceder 3 semanas. Ajusta las fechas.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === Botones === */}
        <div className="button-group">
          <button className="btn cancel" onClick={handleCancel}>
            Cancelar
          </button>
          <button className="btn clear" onClick={handleClear}>
            Limpiar
          </button>
          <button className="btn reserve" onClick={() => navigate('/catalogo')}>
            Volver al Catálogo
          </button>
          <button
            className="btn confirm"
            disabled={selectedBooks.length === 0 || dateAlert}
          >
            Confirmar Préstamo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrestamoForm;