import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../estilos/BookCatalog.css';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filters, setFilters] = useState({
    fechaPublicacion: '',
    categoria: '',
    autor: '',
    ejemplares: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hasFilters, setHasFilters] = useState(false);

  // ✅ Cargar libros desde el backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books'); // Ajusta el puerto si es necesario
        console.log("📚 Libros recibidos del backend:", response.data);

        // Transformamos los datos para asegurar que imagen y año existan
        const mappedBooks = response.data.map(book => ({
          ...book,
          imagen: book.link_imagen || book.imagen || null,
          ano: book.fecha_publicacion
            ? new Date(book.fecha_publicacion).getFullYear()
            : 'N/A'
        }));

        setBooks(mappedBooks);
        setFilteredBooks(mappedBooks);
      } catch (error) {
        console.error("❌ Error al cargar los libros:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    const anyFilterActive = Object.values({ ...filters, [name]: value }).some(filter => filter !== '');
    setHasFilters(anyFilterActive);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = () => {
    if (!hasFilters && !searchTerm) {
      setFilteredBooks(books);
      return;
    }

    let filtered = books;

    // 🔍 Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 📆 Filtro por año
    if (filters.fechaPublicacion) {
      filtered = filtered.filter(book =>
        book.ano && book.ano.toString().includes(filters.fechaPublicacion)
      );
    }

    // 🏷️ Filtro por categoría
    if (filters.categoria) {
      filtered = filtered.filter(book =>
        book.categoria.toLowerCase().includes(filters.categoria.toLowerCase())
      );
    }

    // ✍️ Filtro por autor
    if (filters.autor) {
      filtered = filtered.filter(book =>
        book.autor.toLowerCase().includes(filters.autor.toLowerCase())
      );
    }

    // 📦 Filtro por ejemplares
    if (filters.ejemplares) {
      if (filters.ejemplares === 'disponibles') {
        filtered = filtered.filter(book => book.ejemplares > 0);
      } else if (filters.ejemplares === 'agotados') {
        filtered = filtered.filter(book => book.ejemplares === 0);
      }
    }

    setFilteredBooks(filtered);
  };

  const clearFilters = () => {
    setFilters({
      fechaPublicacion: '',
      categoria: '',
      autor: '',
      ejemplares: ''
    });
    setSearchTerm('');
    setHasFilters(false);
    setFilteredBooks(books);
  };

  const getStatusColor = (estatus) => {
    switch (estatus?.toLowerCase()) {
      case 'disponible':
        return '#28a745';
      case 'no disponible':
        return '#dc3545';
      case 'próximamente':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (estatus, ejemplares) => {
    if (estatus?.toLowerCase() === 'próximamente') return 'Próximamente';
    return ejemplares > 0 ? 'Disponible' : 'No Disponible';
  };

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, books]);

  return (
    <div className="book-catalog">
      <div className="catalog-container">
        <header className="catalog-header">
          <h1>Catálogo de Libros</h1>
          <p>Explora nuestra colección de libros disponibles</p>
        </header>

        {/* 🔍 Búsqueda rápida */}
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por título, autor o categoría..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* 🎯 Filtros avanzados */}
        <div className="filters-section">
          <h3>Filtros Avanzados</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Año de Publicación</label>
              <input
                type="text"
                name="fechaPublicacion"
                value={filters.fechaPublicacion}
                onChange={handleFilterChange}
                placeholder="Ej: 2020, 1990, etc."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Categoría</label>
              <input
                type="text"
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                placeholder="Ej: Fantasía, Ciencia Ficción, etc."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Autor</label>
              <input
                type="text"
                name="autor"
                value={filters.autor}
                onChange={handleFilterChange}
                placeholder="Buscar por autor..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Ejemplares</label>
              <select
                name="ejemplares"
                value={filters.ejemplares}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Todos</option>
                <option value="disponibles">Disponibles</option>
                <option value="agotados">Agotados</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button
              onClick={clearFilters}
              className="clear-filters-btn"
              disabled={!hasFilters && !searchTerm}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* 📚 Resultados */}
        <div className="results-section">
          <div className="results-header">
            <h3>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
            </h3>
          </div>

          <div className="books-grid">
            {filteredBooks.map(book => (
              <div key={book.id_libro || book.id} className="book-card">
                <div className="book-image">
                  <div className="image-placeholder">
                    {book.imagen ? (
                      <img src={book.imagen} alt={book.titulo} />
                    ) : (
                      <span>📚</span>
                    )}
                  </div>
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(book.estatus) }}
                  >
                    {getStatusText(book.estatus, book.ejemplares)}
                  </div>
                </div>

                <div className="book-info">
                  <h4 className="book-title">{book.titulo}</h4>
                  <p className="book-author">por {book.autor}</p>
                  <div className="book-meta">
                    <span className="meta-item">
                      <strong>Categoría:</strong> {book.categoria}
                    </span>
                    <span className="meta-item">
                      <strong>Año:</strong> {book.ano}
                    </span>
                    <span className="meta-item">
                      <strong>Tipo:</strong> {book.tipo}
                    </span>
                    <span className="meta-item">
                      <strong>Ejemplares:</strong> {book.ejemplares}
                    </span>
                  </div>
                </div>

                <div className="book-actions">
                  <button
                    className={`action-btn ${book.estatus?.toLowerCase() === 'disponible' ? 'available' : 'unavailable'}`}
                    disabled={book.estatus?.toLowerCase() !== 'disponible'}
                  >
                    {book.estatus?.toLowerCase() === 'disponible'
                      ? 'Reservar'
                      : book.estatus?.toLowerCase() === 'próximamente'
                        ? 'Próximamente'
                        : 'No Disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="no-results">
              <p>No se encontraron libros con los criterios de búsqueda seleccionados.</p>
              <button onClick={clearFilters} className="clear-filters-btn">
                Ver todos los libros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCatalog;
