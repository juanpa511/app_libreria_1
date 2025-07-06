import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../styles/Navigation.css'; 

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderReaderMenu = () => (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/books" className="nav-link">
            📚 Libros
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/my-loans" className="nav-link">
            📋 Mis Préstamos
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/my-fines" className="nav-link">
            💰 Mis Multas
          </Link>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link logout-btn">
            🚪 Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );

  const renderAdminMenu = () => (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/books" className="nav-link">
            📚 Libros
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/create-book" className="nav-link">
            ➕ Crear Libro
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/loan" className="nav-link">
            📋 Préstamos
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/return" className="nav-link">
            🔄 Devoluciones
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/search-reader" className="nav-link">
            🔍 Buscar Lector
          </Link>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link logout-btn">
            🚪 Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );

  const renderGuestMenu = () => (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            🏠 Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">
            ℹ️ Acerca de
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            🔐 Iniciar Sesión
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            📝 Registrarse
          </Link>
        </li>
      </ul>
    </nav>
  );

  if (!user) {
    return renderGuestMenu();
  }

  return user.role === 'ADMIN' ? renderAdminMenu() : renderReaderMenu();
};

export default Navigation;