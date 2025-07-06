import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import '../styles/RegisterPage.css'; 

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Crear Cuenta</h1>
          <p>Regístrate para acceder a la biblioteca</p>
        </div>
        
        <RegisterForm />
        
        <div className="register-footer">
          <p>¿Ya tienes cuenta? 
            <Link to="/login" className="login-link">
              Inicia sesión aquí
            </Link>
          </p>
          <Link to="/" className="home-link">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;