// src/hooks/useCatalogData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // endpoint base

export const useCatalogData = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/books`);

        // se mapean los libros según los campos reales de tu tabla sql
        const mappedBooks = response.data.map(book => ({
          id: book.id_libro, // 👈 tu id real en sql
          titulo: book.titulo,
          autor: book.autor,
          categoria: book.categoria,
          ano: book.fecha_publicacion || 'N/A',
          estatus: book.estatus || (book.ejemplares > 0 ? 'disponible' : 'no disponible'),
          ejemplares: book.ejemplares,
          tipo: book.tipo,
        }));

        setAllBooks(mappedBooks);
        setIsLoading(false);
      } catch (err) {
        console.error("❌ error al cargar los libros:", err);
        setError("no se pudo conectar con el servidor para cargar el catálogo.");
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { allBooks, isLoading, error };
};
