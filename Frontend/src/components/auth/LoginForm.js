// src/components/auth/LoginForm.js

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/LoginPage.css'; 

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!credentials.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(credentials.email, credentials.password);
      
      if (result.success) {
        // Redirigir según el rol del usuario
        if (result.user.isAdmin) {
          navigate('/admin/dashboard');
        } else if (result.user.isReader) {
          navigate('/reader/dashboard');
        } else {
          navigate('/books');
        }
      } else {
        setErrors({ submit: result.error || 'Error al iniciar sesión' });
      }
    } catch (error) {
      console.error('Error de login:', error);
      setErrors({ submit: error.message || 'Error al iniciar sesión. Verifica tus credenciales.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <div className="form-header">
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de la Biblioteca Municipal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Ingresa tu email"
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex={0}
              >
                {showPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
              </span>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes una cuenta? 
            <Link to="/register" className="register-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;