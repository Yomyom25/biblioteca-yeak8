// src/hooks/useCatalogData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Endpoint base

export const useCatalogData = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/books`); // 👈 Endpoint de GET

                // Mapear los datos para asegurar una estructura uniforme, 
                // usando 'id_libro' de tu DB como 'id'
                const mappedBooks = response.data.map(book => ({
                    id: book.id_libro || book.id, // Usar id_libro o id
                    titulo: book.titulo,
                    autor: book.autor,
                    categoria: book.categoria,
                    ano: book.fecha_publicacion || book.ano || 'N/A', // Usar fecha_publicacion de la DB
                    estatus: book.estatus || (book.ejemplares > 0 ? 'disponible' : 'no disponible'),
                    ejemplares: book.ejemplares,
                    tipo: book.tipo,
                }));

                setAllBooks(mappedBooks);
                setIsLoading(false);
            } catch (err) {
                console.error("❌ Error al cargar los libros:", err);
                setError("No se pudo conectar con el servidor para cargar el catálogo.");
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Devuelve la lista completa de libros (limpia y mapeada) y el estado de carga
    return { allBooks, isLoading, error };
};