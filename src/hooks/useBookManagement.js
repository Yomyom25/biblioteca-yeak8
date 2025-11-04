// src/hooks/useBookManagement.js

import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/books';

export const useBookManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const registerBook = async (bookFormData) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            // 🔍 LOG PARA DEBUG: Ver qué datos se están enviando
            console.log('📤 Enviando FormData al servidor...');
            
            // Verificar contenido del FormData (solo en desarrollo)
            for (let pair of bookFormData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            // 🚨 IMPORTANTE: NO enviar Content-Type manualmente
            // Axios lo configura automáticamente para FormData
            const response = await axios.post(
                `${API_BASE_URL}/register`, 
                bookFormData,
                {
                    headers: {
                        // NO incluir 'Content-Type', Axios lo maneja automáticamente
                    },
                    timeout: 30000 // 30 segundos de timeout
                }
            );

            console.log('✅ Respuesta del servidor:', response.data);

            setSuccessMessage(response.data.message || "Libro registrado exitosamente.");
            setIsLoading(false);
            
            return { success: true, data: response.data };

        } catch (err) {
            setIsLoading(false);
            
            console.error('❌ Error completo:', err);
            console.error('❌ Response data:', err.response?.data);
            console.error('❌ Response data MESSAGE:', err.response?.data?.message);
            console.error('❌ Status:', err.response?.status);
            
            // Ver el objeto completo
            console.log('🔍 DETALLES COMPLETOS:', JSON.stringify(err.response?.data, null, 2));
            
            // Manejo de errores más detallado
            let errorMessage = "Error interno del servidor.";
            
            if (err.response) {
                // El servidor respondió con un error
                errorMessage = err.response.data?.message || errorMessage;
                
                // Errores específicos por código de estado
                if (err.response.status === 400) {
                    errorMessage = err.response.data?.message || "Datos inválidos. Verifica el formulario.";
                } else if (err.response.status === 409) {
                    errorMessage = "Este libro ya existe en la base de datos.";
                } else if (err.response.status === 413) {
                    errorMessage = "Los archivos son demasiado grandes.";
                }
            } else if (err.request) {
                // La petición se hizo pero no hubo respuesta
                errorMessage = "No se pudo conectar con el servidor. Verifica que esté corriendo.";
            } else {
                // Error al configurar la petición
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return {
        registerBook,
        isLoading,
        error,
        successMessage,
        setError,
        setSuccessMessage
    };
};