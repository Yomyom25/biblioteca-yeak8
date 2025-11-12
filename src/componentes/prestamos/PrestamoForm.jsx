// src/components/PrestamoForm.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCatalogData } from "../../hooks/useCatalogData"; // 👈 IMPORTAR EL HOOK
import "../../estilos/PrestamoForm.css"; // 👈 IMPORTAR ESTILOS

// Asegúrate de que este sea el endpoint correcto para registrar un préstamo
const API_PRESTAMO_URL = 'http://localhost:5000/api/prestamos';

const PrestamoForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 📚 Obtener datos reales del catálogo
    const { allBooks, isLoading: booksLoading, error: booksError } = useCatalogData();

    // 📖 Obtener libro preseleccionado del catálogo si existe
    const { preselectedBook } = location.state || {}; 
    
    // 👤 Obtener datos del estudiante logeado (de localStorage o sessionStorage)
    const getStudentData = () => {
        const storedData = JSON.parse(
            localStorage.getItem('userData') || 
            sessionStorage.getItem('userData') || 
            '{}'
        );
        // Usamos la matrícula como identificador clave
        return {
            nombre: storedData.nombre || "Usuario Desconocido", 
            matricula: storedData.matricula || null, // Usar null para la validación
        };
    };

    const studentData = getStudentData();

    // === Lógica de Fechas ===
    const getDefaultDates = () => {
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + 21); // 21 días de plazo máximo
        
        // Formato YYYY-MM-DD
        const toISO = (date) => date.toISOString().split("T")[0]; 

        return {
            start: toISO(today),
            end: toISO(future),
            minDate: toISO(today),
        };
    };

    const defaultDates = getDefaultDates();
    
    // === Estados del Formulario ===
    const [selectedBooks, setSelectedBooks] = useState(
        preselectedBook ? [preselectedBook] : [] // Inicializar con el libro preseleccionado
    );
    
    const [removingBook, setRemovingBook] = useState(null);
    const [startDate, setStartDate] = useState(defaultDates.start);
    const [endDate, setEndDate] = useState(defaultDates.end);
    const [dateAlert, setDateAlert] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [isExpanded, setIsExpanded] = useState(preselectedBook ? true : false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // === Validaciones y Lógica de UI ===

    // Filtrar libros disponibles (no seleccionados y con ejemplares > 0)
    const filteredBooks = allBooks.filter((book) =>
        (book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
         book.autor.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !selectedBooks.some(sBook => sBook.id === book.id) // Excluir libros ya seleccionados
    ).slice(0, 5); // Mostrar máximo 5 resultados en el dropdown
    
    const maxBooksReached = selectedBooks.length >= 2;

    const handleBookClick = (book) => {
        if (!maxBooksReached) {
            setSelectedBooks((prev) => [...prev, book]);
            setSearchTerm("");
            setShowDropdown(false);
        }
    };
    
    // Animación de eliminación suave
    const removeBook = (bookToRemove) => {
        setRemovingBook(bookToRemove.titulo);
        setTimeout(() => {
            setSelectedBooks((prev) => prev.filter((b) => b.id !== bookToRemove.id)); 
            setRemovingBook(null);
        }, 300);
    };

    const handleClear = () => {
        const reset = getDefaultDates();
        setSelectedBooks([]);
        setStartDate(reset.start);
        setEndDate(reset.end);
        setDateAlert(false);
        setSearchTerm("");
        setSubmitError(null);
    };

    const handleCancel = () => {
        navigate('/bookcatalog');
    };

    const handleDateChange = (type, value) => {
        let newStartDate = type === "start" ? value : startDate;
        let newEndDate = type === "end" ? value : endDate;
        
        if (type === "start") setStartDate(newStartDate);
        if (type === "end") setEndDate(newEndDate);

        const start = new Date(newStartDate);
        const end = new Date(newEndDate);
        const diff = (end - start) / (1000 * 60 * 60 * 24); // Diferencia en días
        
        // Validación de plazo máximo de 21 días
        setDateAlert(diff > 21 || diff < 0); 
    };

    // Efecto para expandir/colapsar la tarjeta de libros seleccionados
    useEffect(() => {
        if (selectedBooks.length > 0) {
            setTimeout(() => setIsExpanded(true), 100);
        } else {
            setIsExpanded(false);
        }
    }, [selectedBooks]);

    // 📤 Función para Confirmar Préstamo
    const handleConfirmLoan = async () => {
        // Validaciones finales antes de enviar
        if (maxBooksReached && selectedBooks.length === 0) return;
        if (dateAlert) return;
        if (!studentData.matricula) {
            setSubmitError("No se pudo obtener la matrícula del estudiante. Por favor, vuelve a iniciar sesión.");
            return;
        }

        const loanData = {
            usuario_matricula: studentData.matricula, 
            libros_ids: selectedBooks.map(book => book.id),
            fecha_prestamo: startDate,
            fecha_limite: endDate,
        };
        
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await axios.post(API_PRESTAMO_URL, loanData);
            
            // Éxito
            console.log("✅ Préstamo confirmado:", response.data);
            alert(`Préstamo creado exitosamente: ${response.data.message || ''}`);
            handleClear(); // Limpiar el formulario después de la confirmación
            navigate('/dashboard'); // Redirigir al dashboard/perfil
        } catch (error) {
            // Manejo de errores de la API
            console.error("❌ Error al confirmar el préstamo:", error.response || error);
            const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor de préstamos.';
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };


    // 🛑 Manejo de estados de Carga y Error del Catálogo
    if (booksLoading) {
        return <div className="loan-loading-screen">Cargando catálogo de libros disponibles...</div>;
    }

    if (booksError) {
        return <div className="loan-error-screen">Error de Carga: {booksError}</div>;
    }

    // El catálogo está cargado y no hay errores
    return (
        <div className="app-background">
            <div className="loan-container">
                <div className="loan-header">
                    <h2>Gestión de Préstamos</h2>
                    <p>Completa el formulario para registrar el préstamo de libros</p>
                </div>

                {/* Mensaje de error general del envío */}
                {submitError && (
                    <div className="alert-box error-alert slide-in">
                        <span className="alert-icon">🛑</span>
                        <span>{submitError}</span>
                    </div>
                )}

                <div className="loan-body">
                    {/* === Columna Izquierda: Datos del Préstamo === */}
                    <div className="loan-column">
                        <h3>Datos del Usuario</h3>

                        <div className="field">
                            <label>Nombre del Estudiante</label>
                            <input 
                                type="text" 
                                value={studentData.nombre} 
                                readOnly 
                                disabled
                                className="read-only"
                            />
                        </div>

                        <div className="field">
                            <label>Matrícula</label>
                            <input 
                                type="text" 
                                value={studentData.matricula || 'N/A'} 
                                readOnly 
                                disabled
                                className="read-only"
                            />
                             {!studentData.matricula && (
                                <p className="error-text">⚠️ No se encontró la matrícula. No se puede proceder con el préstamo.</p>
                            )}
                        </div>

                        {/* === Fechas === */}
                        <h3>Fechas</h3>
                        <div className="date-fields">
                            <div className="field date-field">
                                <label>Fecha de Préstamo</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => handleDateChange("start", e.target.value)}
                                    min={defaultDates.minDate}
                                />
                            </div>
                            <div className="field date-field">
                                <label>Fecha Límite de Devolución</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => handleDateChange("end", e.target.value)}
                                    min={startDate}
                                />
                            </div>
                        </div>
                         {/* Alerta de validación de fechas */}
                        {dateAlert && (
                            <div className="alert-box warning-alert slide-in">
                                <span>La duración del préstamo no puede exceder 3 semanas ni ser negativa</span>
                            </div>
                        )}
                    </div>

                    {/* === Columna Derecha: Selección de Libros === */}
                    <div className="loan-column">
                        <div className="field search-field">
                            <label>
                                Buscar y Seleccionar Libro 
                                <span className="book-count">
                                    ({selectedBooks.length} de 2)
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder={maxBooksReached ? "Máximo de 2 libros alcanzado" : "Escribe el título o autor..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                disabled={maxBooksReached || booksLoading || studentData.matricula === null}
                            />

                            {/* Dropdown de Sugerencias */}
                            {showDropdown && !maxBooksReached && (
                                <ul className="book-dropdown">
                                    {filteredBooks.length > 0 ? (
                                        filteredBooks.map((book) => (
                                            <li 
                                                key={book.id} 
                                                onMouseDown={() => handleBookClick(book)} // Usar onMouseDown para evitar el onBlur
                                            >
                                                {book.titulo} (por {book.autor}) - Disp: {book.ejemplares}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="no-results">No se encontraron libros disponibles.</li>
                                    )}
                                </ul>
                            )}

                        </div>

                        {/* === Lista de Libros Seleccionados === */}
                        <div className="field">
                            <label>Libros a Prestar</label>
                            <div className={`book-card-container ${isExpanded ? "expanded" : ""}`}>
                                {selectedBooks.length === 0 && (
                                    <p className="empty-list-text">Aún no has seleccionado ningún libro.</p>
                                )}
                                {selectedBooks.map((book) => (
                                    <div
                                        key={book.id}
                                        className={`book-card fade-in ${
                                            removingBook === book.titulo ? "removing" : ""
                                        }`}
                                    >
                                        <div className="book-info">
                                            <span className="book-emoji">📘</span>
                                            <p>{book.titulo}</p>
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
                            {maxBooksReached && (
                                <p className="limit-text max-reached">Máximo de 2 libros seleccionado.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* === Botones de Acción === */}
                <div className="button-group">
                    <button className="btn cancel" onClick={handleCancel}>
                        Volver al Catálogo
                    </button>
                    <button className="btn clear" onClick={handleClear} disabled={isSubmitting}>
                        Limpiar Formulario
                    </button>
                    <button
                        className="btn confirm"
                        onClick={handleConfirmLoan}
                        // Deshabilitar si: cargando, sin libros, alerta de fecha, o sin matrícula
                        disabled={selectedBooks.length === 0 || dateAlert || !studentData.matricula || isSubmitting}
                    >
                        {isSubmitting ? "Confirmando..." : "Confirmar Préstamo"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrestamoForm;