// src/hooks/useLibrarianManagement.js

import { useState } from 'react';
import axios from 'axios';

const API_ADMIN_URL = "http://localhost:5000/api/admin";

const getAuthToken = () => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        return userData?.token;
    } catch (e) {
        console.error("No se pudo obtener el token de localStorage", e);
        return null;
    }
};

export const useLibrarianManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // 🚀 Función para obtener la lista de bibliotecarios
    const fetchLibrariansApi = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            if (!token) throw new Error("Token de autenticación no encontrado.");

            const response = await axios.get(`${API_ADMIN_URL}/librarians`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setLoading(false);
            return { success: true, data: response.data };

        } catch (err) {
            const backendMsg = err.response?.data?.message || err.message || "Error al cargar bibliotecarios.";
            console.error("Error en fetchLibrariansApi:", backendMsg);
            setError(backendMsg);
            setLoading(false);
            return { success: false, data: [] };
        }
    };

    // 🚀 Función para agregar un nuevo bibliotecario
    const addLibrarianApi = async (librarianData) => {
        setLoading(true);
        setError(null);
        
        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error("Token de autenticación no encontrado.");
            }

            // Datos que espera el endpoint: matricula, nombre, correo, password
            const dataToSend = {
                matricula: librarianData.email, // Usar correo como matrícula/ID único
                nombre: librarianData.nombre,
                correo: librarianData.email,
                password: librarianData.password,
            };

            const response = await axios.post(`${API_ADMIN_URL}/add-librarian`, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setLoading(false);
            
            return { 
                success: true, 
                message: response.data.message, 
                newLibrarian: response.data.librarian 
            };

        } catch (err) {
            const backendMsg = err.response?.data?.message || err.message || "Error de red o desconocido.";
            console.error("Error en addLibrarianApi:", backendMsg);
            setError(backendMsg);
            setLoading(false);
            return { 
                success: false, 
                message: backendMsg,
            }; 
        }
    };

    return {
        fetchLibrariansApi, // 🔑 Nuevo: función para cargar la lista
        addLibrarianApi,
        loading,
        error,
    };
};