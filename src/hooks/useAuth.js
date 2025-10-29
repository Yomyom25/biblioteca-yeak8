// useAuth.js (MODIFICADO)

import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth';

const useAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        matricula: '',
        correo: '',
        password: '',
        confirmPassword: '',
        // CAMBIO CRÍTICO 1: Campo único para Matrícula o Correo
        recoveryInput: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [showTemporaryBlock, setShowTemporaryBlock] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [showRecovery, setShowRecovery] = useState(false);
    const [recoverySuccess, setRecoverySuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- Funciones de Validación ---
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        return password.length >= 8 && hasUpperCase && hasNumber && hasSpecialChar;
    };

    // --- Handlers de Estado ---
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => (prev[name] ? { ...prev, [name]: '' } : prev));
        setMessage('');
    }, []);

    const toggleMode = useCallback(() => {
        setIsLogin(prev => !prev);
        setFormData({
            matricula: '',
            correo: '',
            password: '',
            confirmPassword: '',
            recoveryInput: '' // Limpiar el nuevo campo
        });
        setErrors({});
        setShowTemporaryBlock(false);
        setCooldownTime(0);
        setMessage('');
    }, []);

    const handleBackToLogin = useCallback(() => {
        setShowRecovery(false);
        setRecoverySuccess(false);
        setErrors({});
        setMessage('');
        setShowTemporaryBlock(false);
        setCooldownTime(0);
    }, []);

    const handleRecoverPassword = useCallback(() => {
        setShowRecovery(true);
        // Limpiar el nuevo campo
        setFormData(prev => ({ ...prev, recoveryInput: '' }));
        setErrors({});
        setRecoverySuccess(false);
        setMessage('');
        setShowTemporaryBlock(false);
        setCooldownTime(0);
    }, []);

    // --- Lógica de Auth (Conexión al Backend) ---

    const validateAndSubmit = useCallback(async (e) => {
        e.preventDefault();
        const newErrors = {};
        setMessage('');
        setShowTemporaryBlock(false);
        setCooldownTime(0);

        // 1. Validación Local (Sin cambios)
        if (isLogin) {
            if (!formData.matricula) newErrors.matricula = 'La matrícula es requerida';
            if (!formData.password) newErrors.password = 'La contraseña es requerida';
        } else {
            if (!formData.matricula) newErrors.matricula = 'La matrícula es requerida';
            else if (formData.matricula.length < 5) newErrors.matricula = 'Matrícula no válida';
            if (!formData.correo) newErrors.correo = 'El correo es requerido';
            else if (!validateEmail(formData.correo)) newErrors.correo = 'Formato de correo electrónico no válido';
            if (!formData.password) newErrors.password = 'La contraseña es requerida';
            else if (!validatePassword(formData.password)) newErrors.password = '8+ caracteres, 1 Mayúscula, 1 Número, 1 Signo';
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        // 2. Llamada al Backend (Login/Register - Sin cambios)
        try {
            const url = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
            let payload = isLogin
                ? { matricula: formData.matricula, password: formData.password }
                : { matricula: formData.matricula, correo: formData.correo, password: formData.password };

            const response = await axios.post(url, payload);

            if (isLogin) {
                localStorage.setItem('userToken', response.data.token);
                setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
            } else {
                setMessage('Registro exitoso. Puedes iniciar sesión.');
                toggleMode();
            }

        } catch (error) {
            const backendMessage = error.response?.data?.message;

            if (error.response?.status === 403 && backendMessage?.includes("bloqueada")) {

                setShowTemporaryBlock(true);
                const match = backendMessage.match(/(\d+) segundos/);

                if (match && match[1]) {
                    setCooldownTime(parseInt(match[1], 10));
                } else {
                    setCooldownTime(0);
                }

                setMessage(`Error: Su cuenta ha sido bloqueada temporalmente.`);

            } else if (backendMessage) {
                setMessage(`Error: ${backendMessage}`);
            } else {
                setMessage('Error de conexión con el servidor. Inténtalo más tarde.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLogin, formData, toggleMode]);

    // Función de recuperación (CAMBIOS CRÍTICOS)
    const submitRecovery = useCallback(async (e) => {
        e.preventDefault();
        const newErrors = {};
        setMessage('');

        // 1. Validación de presencia
        if (!formData.recoveryInput) {
            newErrors.recoveryInput = 'La matrícula o el correo son requeridos';
        }

        // 2. Validación de formato
        const isEmail = validateEmail(formData.recoveryInput);

        // Si no parece un correo y tiene menos de 5 caracteres (longitud mínima de matrícula del register)
        if (formData.recoveryInput && !isEmail && formData.recoveryInput.length < 5) {
            newErrors.recoveryInput = 'Matrícula o formato de correo no válidos';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // 3. Determinar el payload para el backend
            let payload = {};
            if (isEmail) {
                // Si es correo, lo enviamos como 'correo'
                payload = { correo: formData.recoveryInput };
            } else {
                // Si no es correo, lo enviamos como 'matricula' (asumiendo que es una matrícula)
                payload = { matricula: formData.recoveryInput };
            }

            const response = await axios.post(`${API_BASE_URL}/forgot-password`, payload);

            setRecoverySuccess(true);
        } catch (error) {
            const backendMessage = error.response?.data?.message;
            if (error.response?.status === 404) {
                // Mensaje de error ajustado
                setErrors({ recoveryInput: 'El identificador (correo o matrícula) no está registrado.' });
            } else if (backendMessage) {
                setMessage(`Error: ${backendMessage}`);
            } else {
                setMessage('Error de conexión. No se pudo enviar el correo.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    return {
        // Estados
        isLogin,
        formData,
        errors,
        message,
        showTemporaryBlock,
        cooldownTime,
        showRecovery,
        recoverySuccess,
        isLoading,
        // Handlers
        handleChange,
        toggleMode,
        handleRecoverPassword,
        handleBackToLogin,
        handleSubmit: validateAndSubmit,
        handleRecoverySubmit: submitRecovery,
    };
};

export default useAuth;