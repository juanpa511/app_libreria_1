import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_NAMES } from '../../utils/constants';
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

    const userRole = user?.roleId || user?.role || 2;
    const roleName = ROLE_NAMES[userRole] || 'Usuario';

    return (
      <div className="header-user">
        <div className="user-info">
          <span className="user-name">
            Hola, {user?.name || user?.firstName || user?.email}
          </span>
          <span className="user-role">
            {roleName}
          </span>
        </div>
        <div className="user-actions">
          <Link to="/admin/books" className="btn btn-outline btn-xs" onClick={closeMenu}>
            Menú
          </Link>
          <button 
            onClick={handleLogout}
            className="btn btn-error btn-xs"
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
          <Link to="/" className="nav-link" onClick={closeMenu}>Inicio</Link>
          <Link to="/about" className="nav-link" onClick={closeMenu}>Acerca de</Link>
        </nav>
      );
    }

    // Enlaces principales para todos los autenticados
    let links = [
      <Link key="home" to="/" className="nav-link" onClick={closeMenu}>Inicio</Link>,
      <Link key="books" to="/books" className="nav-link" onClick={closeMenu}>Libros</Link>
    ];

    // Enlaces adicionales según el rol
    const userRole = user?.roleId || user?.role;
    if (userRole === 2) {
      links.push(
        <Link key="my-loans" to="/my-loans" className="nav-link" onClick={closeMenu}>Mis Préstamos</Link>,
        <Link key="my-fines" to="/my-fines" className="nav-link" onClick={closeMenu}>Mis Multas</Link>
      );
    }
    if (userRole === 1) {
      links.push(
        <Link key="books-catalog" to="/admin/books-catalog" className="nav-link" onClick={closeMenu}>Catálogo de Libros</Link>,
        <Link key="admin-books" to="/admin/books" className="nav-link" onClick={closeMenu}>Gestionar Libros</Link>,
        <Link key="admin-loans" to="/admin/loans" className="nav-link" onClick={closeMenu}>Gestionar Préstamos</Link>,
        <Link key="admin-fines" to="/admin/fines" className="nav-link" onClick={closeMenu}>Gestionar Multas</Link>,
        <Link key="admin-returns" to="/admin/return" className="nav-link" onClick={closeMenu}>Devoluciones</Link>,
        <Link key="search-reader" to="/admin/search-reader" className="nav-link" onClick={closeMenu}>Buscar Lector</Link>
      );
    }

    // Siempre muestra 'Acerca de'
    links.push(
      <Link key="about" to="/about" className="nav-link" onClick={closeMenu}>Acerca de</Link>
    );

    return (
      <nav className="main-nav">
        {links}
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
              <h1 className="logo-text">📚 JJ Library</h1>
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