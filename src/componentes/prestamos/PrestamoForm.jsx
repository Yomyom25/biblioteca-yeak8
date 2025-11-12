import React, { useState, useEffect } from "react";
import "../../estilos/PrestamoForm.css";

const PrestamoForm = () => {
  const studentData = {
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
  const [selectedBooks, setSelectedBooks] = useState([]);
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
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredBooks = bookList.filter((book) =>
    book.toLowerCase().includes(searchTerm.toLowerCase())
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
    }, 300); // mismo tiempo que la animación en CSS
  };

  return (
    <div className="app-background">
      <div className="pillar pillar-left"></div>
      <div className="pillar pillar-right"></div>

      <div className="loan-container">
        <div className="loan-header">
          <h2>Gestión de Préstamos</h2>
          <p>Administra los préstamos y reservas de libros</p>
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
                <span className="alert-icon">⚠︎</span>
                <span>Máximo de libros alcanzado.</span>
              </div>
            )}
          </div>

          {/* === Columna Derecha === */}
          <div className="loan-column">
            <div className="field">
              <label>Buscar y Seleccionar Libro</label>
              <input
                type="text"
                placeholder="Escribe el título del libro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />

              {showDropdown && filteredBooks.length > 0 && (
                <ul className="book-dropdown">
                  {filteredBooks.map((book, index) => (
                    <li key={index} onClick={() => handleBookClick(book)}>
                      {book}
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && searchTerm && filteredBooks.length === 0 && (
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
                  <span className="alert-icon">⏱︎</span>
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
          <button className="btn cancel" onClick={handleClear}>
            Cancelar
          </button>
          <button className="btn clear" onClick={handleClear}>
            Limpiar
          </button>
          <button className="btn reserve">Reservar Libro</button>
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
