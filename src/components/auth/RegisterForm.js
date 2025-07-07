import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import '../../styles/RegisterPage.css'; 


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    LastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      };

      await authService.register(userData);
      alert('Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Error al registrar usuario' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ingresa tu nombre completo"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Apellido</label>
            <input
              type="text"
              id="LastName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ingresa tu nombre completo"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>


          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Ingresa tu email"
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
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Ingresa tu contraseña"
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="input-with-icon">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirma tu contraseña"
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                role="button"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button 
            type="submit" 
            className="register-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="register-footer">
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;