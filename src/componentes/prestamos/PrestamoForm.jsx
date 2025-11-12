// src/components/PrestamoForm.js (CORREGIDO - ID DE LIBRO)
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCatalogData } from "../../hooks/useCatalogData"; 
import "../../estilos/PrestamoForm.css"; 

const API_PRESTAMO_URL = 'http://localhost:5000/api/loans/create'; 

const PrestamoForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { allBooks, isLoading: booksLoading, error: booksError } = useCatalogData();
    const { preselectedBook } = location.state || {}; 
    
    // 👤 Función para obtener datos y token del usuario
    const getAuthData = () => {
        const storedData = JSON.parse(
            localStorage.getItem('userData') || 
            sessionStorage.getItem('userData') || 
            '{}'
        );
        return {
            nombre: storedData.nombre || storedData.matricula || "Usuario Desconocido", 
            matricula: storedData.matricula || null,
            token: storedData.token || null,
        };
    };

    const authData = getAuthData();

    // === Lógica de Fechas ===
    const getDefaultDates = () => {
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + 21);
        
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
        preselectedBook ? [preselectedBook] : []
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

    const maxBooksReached = selectedBooks.length >= 2;
    
    const filteredBooks = allBooks.filter((book) =>
        (book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
         book.autor.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !selectedBooks.some(sBook => sBook.id === book.id)
    ).slice(0, 5); 

    const handleBookClick = (book) => {
        if (!maxBooksReached) {
            setSelectedBooks((prev) => [...prev, book]);
            setSearchTerm("");
            setShowDropdown(false);
        }
    };
    
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
        const diff = (end - start) / (1000 * 60 * 60 * 24); 
        
        setDateAlert(diff > 21 || diff < 0); 
    };

    useEffect(() => {
        if (selectedBooks.length > 0) {
            setTimeout(() => setIsExpanded(true), 100);
        } else {
            setIsExpanded(false);
        }
    }, [selectedBooks]);


    // 📤 Función para Confirmar Préstamo (CORREGIDA)
    const handleConfirmLoan = async () => {
        
        if (selectedBooks.length === 0 || dateAlert || !authData.matricula) return;

        if (!authData.token) {
            setSubmitError("⚠️ Error: No se encontró el token de seguridad. Por favor, vuelve a iniciar sesión.");
            return;
        }

        console.log("🔍 DEBUG - Datos de autenticación:", authData);
        console.log("🔍 DEBUG - Libros seleccionados:", selectedBooks);

        setIsSubmitting(true);
        setSubmitError(null);

        const successfulLoans = [];
        const failedLoans = [];

        for (const book of selectedBooks) {
            
            // ✅ CORRECCIÓN CRÍTICA: Asegurar que enviamos el ID correcto
            const loanData = {
                matricula: authData.matricula,
                bookId: book.id, // Tu hook mapea id_libro a 'id'
                dueDate: endDate,
            };
            
            console.log("📤 Enviando préstamo:", loanData);
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            };

            try {
                const response = await axios.post(API_PRESTAMO_URL, loanData, config);
                console.log("✅ Respuesta exitosa:", response.data);
                successfulLoans.push(book.titulo);
            } catch (error) {
              console.log("📚 id enviado al backend:", book.id);
                // ✅ MEJORADO: Mostrar más detalles del error
                console.error(`❌ Error completo:`, error);
                console.error(`❌ Response:`, error.response);
                console.error(`❌ Status:`, error.response?.status);
                console.error(`❌ Data:`, error.response?.data);
                
                const errorMessage = error.response?.data?.message || 
                                   `Error ${error.response?.status || 'desconocido'}: ${error.message}`;
                
                failedLoans.push({ bookTitle: book.titulo, error: errorMessage });
            }
        }
        
        setIsSubmitting(false);

        if (failedLoans.length === 0) {
            alert(`✅ Préstamos registrados exitosamente: ${successfulLoans.join(' y ')}.`);
            handleClear(); 
            navigate('/bookcatalog');
        } else {
            let summaryMessage = `🚨 ERROR. No se pudieron registrar ${failedLoans.length} de ${selectedBooks.length} préstamos.\n\n`;
            failedLoans.forEach(f => {
                summaryMessage += `- Libro: ${f.bookTitle}\n  Razón: ${f.error}\n\n`;
            });
            
            setSubmitError(summaryMessage);
            
            if (successfulLoans.length > 0) {
                alert(`✅ Advertencia: Préstamo(s) parcial(es) exitoso(s): ${successfulLoans.join(', ')}. Revise los errores.`);
                setSelectedBooks(selectedBooks.filter(b => !successfulLoans.includes(b.titulo)));
            }
        }
    };


    if (booksLoading) {
        return <div className="loan-loading-screen">Cargando catálogo de libros disponibles...</div>;
    }

    if (booksError) {
        return <div className="loan-error-screen">Error de Carga: {booksError}</div>;
    }

    return (
        <div className="app-background">
            <div className="loan-container">
                <div className="loan-header">
                    <h2>Gestión de Préstamos</h2>
                    <p>Completa el formulario para registrar el préstamo de libros</p>
                </div>

                {submitError && (
                    <div className="alert-box error-alert slide-in">
                        <span className="alert-icon">🛑</span>
                        <pre style={{whiteSpace: 'pre-wrap', fontSize: '12px'}}>{submitError}</pre>
                    </div>
                )}

                <div className="loan-body">
                    <div className="loan-column">
                        <h3>Datos del Usuario</h3>

                        <div className="field">
                            <label>Nombre del Estudiante</label>
                            <input 
                                type="text" 
                                value={authData.nombre} 
                                readOnly 
                                disabled
                                className="read-only"
                            />
                        </div>

                        <div className="field">
                            <label>Matrícula</label>
                            <input 
                                type="text" 
                                value={authData.matricula || 'N/A'} 
                                readOnly 
                                disabled
                                className="read-only"
                            />
                            {!authData.matricula && (
                                <p className="error-text">⚠️ No se encontró la matrícula. No se puede proceder con el préstamo.</p>
                            )}
                        </div>

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
                        {dateAlert && (
                            <div className="alert-box warning-alert slide-in">
                                <span>La duración del préstamo no puede exceder 3 semanas ni ser negativa</span>
                            </div>
                        )}
                    </div>

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
                                disabled={maxBooksReached || booksLoading || authData.matricula === null}
                            />

                            {showDropdown && !maxBooksReached && (
                                <ul className="book-dropdown">
                                    {filteredBooks.length > 0 ? (
                                        filteredBooks.map((book) => (
                                            <li 
                                                key={book.id} 
                                                onMouseDown={() => handleBookClick(book)}
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
                        disabled={selectedBooks.length === 0 || dateAlert || !authData.matricula || isSubmitting}
                    >
                        {isSubmitting ? "Confirmando..." : "Confirmar Préstamo"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrestamoForm;