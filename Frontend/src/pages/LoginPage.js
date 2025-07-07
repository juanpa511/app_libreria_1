import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css'; 

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu cuenta de la biblioteca</p>
        </div>
        
        <LoginForm />
        
        <div className="login-footer">
          <p>¿No tienes cuenta? 
            <Link to="/register" className="register-link">
              Regístrate aquí
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

export default LoginPage;