import React, { useState, useEffect } from 'react';
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

  // Datos de ejemplo (simulando respuesta de API)
  const sampleBooks = [
    {
      id: 1,
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      categoria: 'Realismo Mágico',
      año: 1967,
      tipo: 'Físico',
      estatus: 'Disponible',
      ejemplares: 5,
      imagen: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      categoria: 'Ciencia Ficción',
      año: 1949,
      tipo: 'Digital',
      estatus: 'No Disponible',
      ejemplares: 0,
      imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      titulo: 'El Principito',
      autor: 'Antoine de Saint-Exupéry',
      categoria: 'Literatura Infantil',
      año: 1943,
      tipo: 'Físico',
      estatus: 'Disponible',
      ejemplares: 3,
      imagen: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      titulo: 'Crimen y Castigo',
      autor: 'Fiódor Dostoievski',
      categoria: 'Literatura Clásica',
      año: 1866,
      tipo: 'Físico',
      estatus: 'Próximamente',
      ejemplares: 0,
      imagen: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      titulo: 'Harry Potter y la Piedra Filosofal',
      autor: 'J.K. Rowling',
      categoria: 'Fantasía',
      año: 1997,
      tipo: 'Físico',
      estatus: 'Disponible',
      ejemplares: 2,
      imagen: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=300&fit=crop'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setBooks(sampleBooks);
    setFilteredBooks(sampleBooks);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    // Verificar si hay al menos un filtro activo
    const anyFilterActive = Object.values({...filters, [name]: value}).some(filter => filter !== '');
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

    // Aplicar filtros de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros avanzados
    if (filters.fechaPublicacion) {
      filtered = filtered.filter(book => 
        book.año.toString().includes(filters.fechaPublicacion)
      );
    }
    if (filters.categoria) {
      filtered = filtered.filter(book => 
        book.categoria.toLowerCase().includes(filters.categoria.toLowerCase())
      );
    }
    if (filters.autor) {
      filtered = filtered.filter(book => 
        book.autor.toLowerCase().includes(filters.autor.toLowerCase())
      );
    }
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
    switch (estatus) {
      case 'Disponible':
        return '#28a745';
      case 'No Disponible':
        return '#dc3545';
      case 'Próximamente':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (estatus, ejemplares) => {
    if (estatus === 'Próximamente') return 'Próximamente';
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

        {/* Búsqueda Rápida */}
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

        {/* Filtros Avanzados */}
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

        {/* Resultados */}
        <div className="results-section">
          <div className="results-header">
            <h3>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
            </h3>
          </div>

          <div className="books-grid">
            {filteredBooks.map(book => (
              <div key={book.id} className="book-card">
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
                      <strong>Año:</strong> {book.año}
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
                    className={`action-btn ${book.estatus === 'Disponible' ? 'available' : 'unavailable'}`}
                    disabled={book.estatus !== 'Disponible'}
                  >
                    {book.estatus === 'Disponible' ? 'Reservar' : 
                     book.estatus === 'Próximamente' ? 'Próximamente' : 'No Disponible'}
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