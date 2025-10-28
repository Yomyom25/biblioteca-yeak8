// LoginRegister.js (COMPLETO Y MODIFICADO)

import React from "react";
import useAuth from "../hooks/useAuth"; 
import "../estilos/LoginRegister.css";

const LoginRegister = () => {
  
  const {
    isLogin,
    formData,
    errors,
    message,
    showTemporaryBlock,
    cooldownTime, 
    showRecovery,
    recoverySuccess,
    isLoading,
    handleChange,
    toggleMode,
    handleRecoverPassword,
    handleBackToLogin,
    handleSubmit,
    handleRecoverySubmit,
  } = useAuth(); // ⬅️ USAR EL HOOK

  // ----------------------------------------------------------------
  // PANTALLA DE RECUPERACIÓN (AJUSTADA PARA MATRÍCULA O CORREO)
  // ----------------------------------------------------------------
  if (showRecovery) {
    return (
      <div className="recovery-container">
        <div className="recovery-card">
          <div className="recovery-header">
            <div className="logo-title">
              <div className="logo">
                <svg viewBox="0 0 3000 3000" className="logo-svg">
                  <path
                    fill="currentColor"
                    d="M1119,796c472.75-7.672,1049.57,274.84,1222,561,100.63,167.01,164.64,430.35,17,604-19.25,22.64-127.65,99.72-146,23-16.11-67.35,99.07-65.79,132-91,30.6-23.42,49.78-62.51,62-104,70.34-238.79-211.35-521.38-339-601-142.35-88.79-401.72-185.77-647-157-84.63,9.93-155.27,24.21-229,42-36.16,8.73-74.28,33.94-121,25-1.67-.67-3.33-1.33-5-2-47.46-12.4-82.894-49.67-135-65-43.949-12.93-117.932-3.61-154-27-12.332-8-27.671-26.865-23-51,15.919-82.247,191.312-135.481,283-152ZM818,1143c376.16-4.78,391.63,511.25,43,553-193.821,23.21-355.876-181.69-284-371C618.782,1214.95,696.2,1151.04,818,1143Zm2,113c-54.407,6.62-84.532,23.97-112,58-81.345,100.76-10.658,282.85,134,266C1051.23,1555.63,1043.97,1252.58,820,1256Zm10,41c153.795,9.28,154.671,216.62,11,236-132.251,17.84-158.179-155.38-77-216C782.926,1302.87,800.3,1296.76,830,1297Zm734,58c97.2-8.38,142.76-.44,187,12,54.67,15.38,245.14,103.18,216,175-6.72,16.56-43.08,58.58-69,49-53.86-19.9-69.35-175.8-197-126-35.37,13.8-58.71,38.58-72,74-37,98.61,64.28,263.47,105,313q44.49,49.995,89,100c36.99,90.86-52.28,154.67-106,178-160.01,69.5-449.39,111.55-652,49-86.244-26.63-153.471-72.09-214-124-27.36-23.47-156.571-173.15-126-220,35.434-9.63,128,71.01,162,86,132.74,58.53,267.34,77.33,411,13,98.29-44.02,357.19-207.17,229-367-32.5-40.52-106.23-63.72-169-36q-27.495,15-55,30c-22.12,3.21-35.06-23.34-38-40C1243.03,1396.51,1494.21,1366.94,1564,1355Zm514,340c68.99-2.13,68.24,84.21,14,94C2029.84,1800.21,2017.12,1706.6,2078,1695Zm694,328"
                  />
                </svg>
              </div>
              <h1 className="main-title">BIBLIOTECA YEAK8</h1>
            </div>
          </div>

          {recoverySuccess ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Correo Enviado Exitosamente</h2>
              <p>
                Hemos enviado un enlace de recuperación a la dirección asociada a:
                <strong> {formData.recoveryInput}</strong>. Revisa tu bandeja de
                entrada y sigue las instrucciones.
              </p>
              <button onClick={handleBackToLogin} className="btn-back">
                Volver al Inicio de Sesión
              </button>
            </div>
          ) : (
            <>
              <div className="recovery-title">
                <h2>Recuperar Contraseña</h2>
                <p>
                  Ingresa tu Matrícula o tu Correo Electrónico
                </p>
              </div>

              <form onSubmit={handleRecoverySubmit} className="recovery-form">
                <div className="input-group recovery-input">
                  <div className="input-icon">🔑</div>
                  <input
                    type="text" // Cambiado de 'email' a 'text' para aceptar matrículas
                    name="recoveryInput" // CAMBIO CLAVE: Usamos el campo único
                    value={formData.recoveryInput} 
                    onChange={handleChange}
                    className={errors.recoveryInput ? "error" : ""} // Error para el campo único
                    placeholder="Matrícula o Correo Electrónico" // Placeholder descriptivo
                    disabled={isLoading}
                  />
                </div>
                {errors.recoveryInput && ( // Mensaje de error para el campo único
                  <div className="error-message">{errors.recoveryInput}</div>
                )}

                <button
                  type="submit"
                  className="btn-recovery"
                  disabled={isLoading}
                >
                  {isLoading ? "ENVIANDO..." : "ENVIAR ENLACE DE RECUPERACIÓN"}
                </button>

                <div className="recovery-options">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="back-btn"
                  >
                    ← Volver al Inicio de Sesión
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }
  // ----------------------------------------------------------------
  // PANTALLA PRINCIPAL (Login/Registro - Sin cambios adicionales)
  // ----------------------------------------------------------------
  return (
    <div
      className={`auth-container ${isLogin ? "login-mode" : "register-mode"}`}
    >
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="wave"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-title">
              <div className="logo">
                <svg viewBox="0 0 3000 3000" className="logo-svg">
                  <path fill="currentColor" d="M1119,796c472.75-7.672,1049.57,274.84,1222,561,100.63,167.01,164.64,430.35,17,604-19.25,22.64-127.65,99.72-146,23-16.11-67.35,99.07-65.79,132-91,30.6-23.42,49.78-62.51,62-104,70.34-238.79-211.35-521.38-339-601-142.35-88.79-401.72-185.77-647-157-84.63,9.93-155.27,24.21-229,42-36.16,8.73-74.28,33.94-121,25-1.67-.67-3.33-1.33-5-2-47.46-12.4-82.894-49.67-135-65-43.949-12.93-117.932-3.61-154-27-12.332-8-27.671-26.865-23-51,15.919-82.247,191.312-135.481,283-152ZM818,1143c376.16-4.78,391.63,511.25,43,553-193.821,23.21-355.876-181.69-284-371C618.782,1214.95,696.2,1151.04,818,1143Zm2,113c-54.407,6.62-84.532,23.97-112,58-81.345,100.76-10.658,282.85,134,266C1051.23,1555.63,1043.97,1252.58,820,1256Zm10,41c153.795,9.28,154.671,216.62,11,236-132.251,17.84-158.179-155.38-77-216C782.926,1302.87,800.3,1296.76,830,1297Zm734,58c97.2-8.38,142.76-.44,187,12,54.67,15.38,245.14,103.18,216,175-6.72,16.56-43.08,58.58-69,49-53.86-19.9-69.35-175.8-197-126-35.37,13.8-58.71,38.58-72,74-37,98.61,64.28,263.47,105,313q44.49,49.995,89,100c36.99,90.86-52.28,154.67-106,178-160.01,69.5-449.39,111.55-652,49-86.244-26.63-153.471-72.09-214-124-27.36-23.47-156.571-173.15-126-220,35.434-9.63,128,71.01,162,86,132.74,58.53,267.34,77.33,411,13,98.29-44.02,357.19-207.17,229-367-32.5-40.52-106.23-63.72-169-36q-27.495,15-55,30c-22.12,3.21-35.06-23.34-38-40C1243.03,1396.51,1494.21,1366.94,1564,1355Zm514,340c68.99-2.13,68.24,84.21,14,94C2029.84,1800.21,2017.12,1706.6,2078,1695Zm694,328"/>
                </svg>
              </div>
            <h1 className="main-title">BIBLIOTECA YEAK8</h1>
          </div>

          {isLogin ? (
            <div className="login-welcome">
              <h2>¡Bienvenido de vuelta!</h2>
              <p>Ingresa a tu cuenta para continuar</p>
            </div>
          ) : (
            <div className="register-title">
              <h2>REGISTRO EXCLUSIVO ESTUDIANTES</h2>
              <p>Crea tu cuenta de estudiante</p>
            </div>
          )}
        </div>

        {/* Mensaje de éxito/error general (no de bloqueo) */}
        {message && !showTemporaryBlock && (
          <div
            className={`alert ${
              message.includes("exitoso") ? "alert-success" : "alert-error"
            }`}
          >
            {message.includes("exitoso") ? (
              <div className="alert-icon">✅</div>
            ) : (
              <div className="alert-icon">❌</div>
            )}
            <div>
              <span>{message.replace("Error: ", "")}</span>
            </div>
          </div>
        )}

        {/* Mensaje de Bloqueo Temporal */}
        {showTemporaryBlock && (
          <div className="alert alert-warning">
            <div className="alert-icon">⚠️</div>
            <div>
              <strong>Su cuenta ha sido bloqueada temporalmente.</strong>
              <span>
                Intente de nuevo en: **{cooldownTime} segundos**.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isLogin ? (
            <>
              {/* Campos de Login */}
              <div className="input-group login-input">
                <div className="input-icon">🎓</div>
                <input
                  type="text"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  className={errors.matricula ? "error" : ""}
                  placeholder="Tu matrícula"
                  disabled={isLoading}
                />
              </div>
              {errors.matricula && (
                <div className="error-message">{errors.matricula}</div>
              )}

              <div className="input-group login-input">
                <div className="input-icon">🔒</div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  placeholder="Tu contraseña"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}

              <button type="submit" className="btn-login" disabled={isLoading}>
                <span>{isLoading ? "VERIFICANDO..." : "INICIAR SESIÓN"}</span>
                <div className="btn-arrow">→</div>
              </button>

              <div className="login-options">
                <button
                  type="button"
                  className="recover-btn"
                  onClick={handleRecoverPassword}
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Campos de Registro */}
              <div className="form-section">
                <label className="section-label">Matrícula</label>
                <input
                  type="text"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  className={errors.matricula ? "error" : ""}
                  placeholder="Ingresa tu matrícula"
                  disabled={isLoading}
                />
                {errors.matricula && (
                  <div className="error-message">{errors.matricula}</div>
                )}
              </div>

              <div className="form-section">
                <label className="section-label">Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={errors.correo ? "error" : ""}
                  placeholder="correo@ejemplo.com"
                  disabled={isLoading}
                />
                {errors.correo && (
                  <div className="error-message">{errors.correo}</div>
                )}
              </div>

              <div className="form-section">
                <label className="section-label">Contraseña
                  <span className="requirement">(8+ caracteres, 1 Mayúscula, 1 Número, 1 Signo)</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  placeholder="Crea tu contraseña"
                  disabled={isLoading}
                />
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div className="form-section">
                <label className="section-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  placeholder="Confirma tu contraseña"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn-register"
                disabled={isLoading}
              >
                {isLoading ? "REGISTRANDO..." : "REGISTRAR"}
              </button>
            </>
          )}
        </form>

        <div className="toggle-section">
          <p>
            {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            <button
              type="button"
              onClick={toggleMode}
              className="toggle-btn"
              disabled={isLoading}
            >
              {isLogin ? "Regístrate" : "Inicia Sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;