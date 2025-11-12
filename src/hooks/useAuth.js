// useAuth.js
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

const useAuth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    matricula: "",
    correo: "",
    password: "",
    confirmPassword: "",
    recoveryInput: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showTemporaryBlock, setShowTemporaryBlock] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Validaciones ---
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );
    return password.length >= 8 && hasUpperCase && hasNumber && hasSpecialChar;
  };

  // --- Handlers ---
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    setMessage("");
  }, []);

  const toggleMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    setFormData({
      matricula: "",
      correo: "",
      password: "",
      confirmPassword: "",
      recoveryInput: "",
    });
    setErrors({});
    setMessage("");
    setShowTemporaryBlock(false);
    setCooldownTime(0);
  }, []);

  const handleRecoverPassword = useCallback(() => {
    setShowRecovery(true);
    setErrors({});
    setMessage("");
    setRecoverySuccess(false);
  }, []);

  const handleBackToLogin = useCallback(() => {
    setShowRecovery(false);
    setRecoverySuccess(false);
    setErrors({});
    setMessage("");
  }, []);

  // --- SUBMIT: LOGIN / REGISTRO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = {};

    if (isLogin) {
      if (!formData.matricula)
        newErrors.matricula = "La matrícula es requerida";
      if (!formData.password) newErrors.password = "La contraseña es requerida";
    } else {
      if (!formData.matricula)
        newErrors.matricula = "La matrícula es requerida";
      if (!formData.correo) newErrors.correo = "El correo es requerido";
      else if (!validateEmail(formData.correo))
        newErrors.correo = "Correo no válido";
      if (!formData.password) newErrors.password = "La contraseña es requerida";
      else if (!validatePassword(formData.password))
        newErrors.password =
          "Debe tener 8+ caracteres, 1 mayúscula, 1 número y 1 símbolo";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const response = await axios.post(`${API_BASE_URL}/login`, {
          matricula: formData.matricula,
          password: formData.password,
        });

        if (response.data?.success || response.data?.token) {
          const user = response.data.user || {};
          const userData = {
            id: user.id || user.id_usuario,
            nombre: user.nombre || "",
            matricula: user.matricula || "",
            correo: user.correo || "",
            rol: user.rol || response.data.rol || "Estudiante",
            token: response.data.token,
          };

          localStorage.setItem("userData", JSON.stringify(userData));
          console.log("✅ Datos guardados en localStorage:", userData);

          setMessage("¡Inicio de sesión exitoso! Redirigiendo...");

          // 🚀 Redirección basada en rol (COINCIDE con tus rutas de App.js)
          setTimeout(() => {
            if (userData.rol === "Administrador") navigate("/admin/dashboard");
            else if (userData.rol === "Bibliotecario")
              navigate("/librarian/dashboard");
            else navigate("/bookcatalog"); // 👈 ahora coincide con tu ruta App.js
          }, 1000);
        }
      } else {
        // 📝 REGISTRO
        const response = await axios.post(`${API_BASE_URL}/register`, {
          matricula: formData.matricula,
          correo: formData.correo,
          password: formData.password,
        });

        if (response.data.success) {
          setMessage("¡Registro exitoso! Ahora puedes iniciar sesión.");
          setTimeout(() => toggleMode(), 1500);
        }
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
      const backendMsg = error.response?.data?.message;
      if (error.response?.status === 403 && backendMsg?.includes("bloqueada")) {
        setShowTemporaryBlock(true);
        const match = backendMsg.match(/(\d+) segundos/);
        setCooldownTime(match ? parseInt(match[1], 10) : 0);
        setMessage("Cuenta bloqueada temporalmente.");
      } else {
        setMessage(backendMsg || "Error en la operación, inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Recuperar contraseña ---
  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    setMessage("");

    if (!formData.recoveryInput)
      newErrors.recoveryInput = "Ingresa matrícula o correo";
    else if (
      !validateEmail(formData.recoveryInput) &&
      formData.recoveryInput.length < 5
    )
      newErrors.recoveryInput = "Formato inválido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/forgot-password`, {
        recoveryInput: formData.recoveryInput,
      });
      setRecoverySuccess(true);
      setMessage("Correo de recuperación enviado.");
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      if (error.response?.status === 404)
        setErrors({ recoveryInput: "No se encontró el usuario." });
      else setMessage(backendMsg || "Error al enviar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

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
    // Funciones
    handleChange,
    toggleMode,
    handleRecoverPassword,
    handleBackToLogin,
    handleSubmit,
    handleRecoverySubmit,
  };
};

export default useAuth;
