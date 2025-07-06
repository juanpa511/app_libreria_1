import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import '../../styles/Header.css'; 

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin, isReader } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        logout();
        navigate('/');
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cerrar sesión',
        icon: 'error'
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const renderUserMenu = () => {
    if (!isAuthenticated) {
      return (
        <div className="header-auth">
          <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
            Iniciar Sesión
          </Link>
          <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
            Registrarse
          </Link>
        </div>
      );
    }

    return (
      <div className="header-user">
        <div className="user-info">
          <span className="user-name">
            Hola, {user?.name || user?.firstName || user?.email}
          </span>
          <span className="user-role">
            {isAdmin() ? 'Administrador' : 'Lector'}
          </span>
        </div>
        <div className="user-actions">
          <Link to="/navigation" className="btn btn-outline btn-sm" onClick={closeMenu}>
            Menú
          </Link>
          <button 
            onClick={handleLogout}
            className="btn btn-error btn-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  };

  const renderNavigation = () => {
    if (!isAuthenticated) {
      return (
        <nav className="main-nav">
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Inicio
          </Link>
          <Link to="/about" className="nav-link" onClick={closeMenu}>
            Acerca de
          </Link>
        </nav>
      );
    }

    return (
      <nav className="main-nav">
        <Link to="/" className="nav-link" onClick={closeMenu}>
          Inicio
        </Link>
        <Link to="/books" className="nav-link" onClick={closeMenu}>
          Libros
        </Link>
        {isReader() && (
          <>
            <Link to="/my-loans" className="nav-link" onClick={closeMenu}>
              Mis Préstamos
            </Link>
            <Link to="/my-fines" className="nav-link" onClick={closeMenu}>
              Mis Multas
            </Link>
          </>
        )}
        {isAdmin() && (
          <>
            <Link to="/create-book" className="nav-link" onClick={closeMenu}>
              Crear Libro
            </Link>
            <Link to="/loans" className="nav-link" onClick={closeMenu}>
              Préstamos
            </Link>
            <Link to="/returns" className="nav-link" onClick={closeMenu}>
              Devoluciones
            </Link>
            <Link to="/search-reader" className="nav-link" onClick={closeMenu}>
              Buscar Lector
            </Link>
          </>
        )}
        <Link to="/about" className="nav-link" onClick={closeMenu}>
          Acerca de
        </Link>
      </nav>
    );
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo">
            <Link to="/" className="logo-link" onClick={closeMenu}>
              <h1 className="logo-text">📚 Library</h1>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <div className="header-nav desktop-nav">
            {renderNavigation()}
          </div>

          {/* User Menu - Desktop */}
          <div className="header-user desktop-user">
            {renderUserMenu()}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-nav">
              {renderNavigation()}
            </div>
            <div className="mobile-user">
              {renderUserMenu()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;