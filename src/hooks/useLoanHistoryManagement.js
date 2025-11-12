// src/hooks/useLoanHistoryManagement.js

import { useState } from 'react';
import axios from 'axios';

// Asegúrate de que esta URL coincida con la de tu servidor
const API_ADMIN_URL = "http://localhost:5000/api/admin";

// Función auxiliar para obtener el token desde localStorage
const getAuthToken = () => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        return userData?.token;
    } catch (e) {
        console.error("No se pudo obtener el token de localStorage", e);
        return null;
    }
};

export const useLoanHistoryManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // 1. Función para obtener el historial de préstamos (GET)
    const fetchLoanHistoryApi = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            if (!token) throw new Error("Token de autenticación no encontrado. Por favor, vuelva a iniciar sesión.");

            const response = await axios.get(`${API_ADMIN_URL}/loan-history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setLoading(false);
            return { success: true, data: response.data };

        } catch (err) {
            const backendMsg = err.response?.data?.message || err.message || "Error al cargar el historial de préstamos.";
            console.error("Error en fetchLoanHistoryApi:", backendMsg);
            setError(backendMsg);
            setLoading(false);
            return { success: false, data: [] };
        }
    };

    // 2. Función para marcar como devuelto (PUT)
    const returnLoanApi = async (loanId) => {
        setLoading(true);
        setError(null);
        
        try {
            const token = getAuthToken();
            if (!token) throw new Error("Token de autenticación no encontrado.");
            
            const response = await axios.put(`${API_ADMIN_URL}/loan-return/${loanId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setLoading(false);
            
            return { 
                success: true, 
                message: response.data.message,
                fechaDevolucion: response.data.fechaDevolucion // La fecha de devolución devuelta por el backend
            };

        } catch (err) {
            const backendMsg = err.response?.data?.message || err.message || "Error al registrar la devolución.";
            console.error("Error en returnLoanApi:", backendMsg);
            setError(backendMsg);
            setLoading(false);
            return { 
                success: false, 
                message: backendMsg,
            }; 
        }
    };

    return {
        fetchLoanHistoryApi,
        returnLoanApi,
        loading,
        error,
    };
};