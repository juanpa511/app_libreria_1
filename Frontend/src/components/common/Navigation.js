import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getUserRole = () => {
    return user?.role || user?.roles?.[0] || 'READER';
  };

  // Navegación para usuarios no autenticados
  if (!isAuthenticated) {
    return (
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold hover:text-blue-200">
              📚 Biblioteca Municipal Talca
            </Link>
            
            {/* Menú desktop */}
            <div className="hidden md:flex space-x-4">
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                Acerca de
              </Link>
              <Link
                to="/books"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/books') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                Ver Libros
              </Link>
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/login') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-800 transition-colors"
              >
                Registrarse
              </Link>
            </div>

            {/* Menú móvil */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none hover:text-blue-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-blue-700">
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Acerca de
              </Link>
              <Link
                to="/books"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ver Libros
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-700 hover:bg-blue-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Navegación para ADMIN
  if (getUserRole() === 'ADMIN') {
    return (
      <nav className="bg-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/admin/dashboard" className="text-2xl font-bold hover:text-red-200">
              🔧 Panel Administrador
            </Link>
            
            {/* Menú desktop */}
            <div className="hidden md:flex space-x-4 items-center">
              <Link
                to="/admin/books"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/books') ? 'bg-red-700' : 'hover:bg-red-700'
                }`}
              >
                📚 Gestionar Libros
              </Link>
              <Link
                to="/admin/bookings"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/bookings') ? 'bg-red-700' : 'hover:bg-red-700'
                }`}
              >
                📋 Préstamos
              </Link>
              <Link
                to="/admin/returns"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/returns') ? 'bg-red-700' : 'hover:bg-red-700'
                }`}
              >
                📤 Devoluciones
              </Link>
              <Link
                to="/admin/readers"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/readers') ? 'bg-red-700' : 'hover:bg-red-700'
                }`}
              >
                👥 Gestionar Lectores
              </Link>
              <div className="flex items-center space-x-2 border-l border-red-700 pl-4">
                <span className="text-sm">👨‍💼 {user?.email || user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-700 hover:bg-red-800 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Menú móvil */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none hover:text-red-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-red-700">
              <Link
                to="/admin/books"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📚 Gestionar Libros
              </Link>
              <Link
                to="/admin/bookings"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📋 Préstamos
              </Link>
              <Link
                to="/admin/returns"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📤 Devoluciones
              </Link>
              <Link
                to="/admin/readers"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                👥 Gestionar Lectores
              </Link>
              <div className="px-3 py-2 text-sm border-t border-red-700 mt-2">
                👨‍💼 {user?.email || user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-700 hover:bg-red-800 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Navegación para LECTOR
  if (getUserRole() === 'READER') {
    return (
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/reader/dashboard" className="text-2xl font-bold hover:text-green-200">
              📖 Mi Biblioteca
            </Link>
            
            {/* Menú desktop */}
            <div className="hidden md:flex space-x-4 items-center">
              <Link
                to="/reader/books"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/reader/books') ? 'bg-green-700' : 'hover:bg-green-700'
                }`}
              >
                📚 Ver Libros
              </Link>
              <Link
                to="/reader/my-bookings"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/reader/my-bookings') ? 'bg-green-700' : 'hover:bg-green-700'
                }`}
              >
                📋 Mis Préstamos
              </Link>
              <Link
                to="/reader/my-fines"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/reader/my-fines') ? 'bg-green-700' : 'hover:bg-green-700'
                }`}
              >
                💰 Mis Multas
              </Link>
              <div className="flex items-center space-x-2 border-l border-green-700 pl-4">
                <span className="text-sm">👤 {user?.email || user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-green-700 hover:bg-green-800 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Menú móvil */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none hover:text-green-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-green-700">
              <Link
                to="/reader/books"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📚 Ver Libros
              </Link>
              <Link
                to="/reader/my-bookings"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📋 Mis Préstamos
              </Link>
              <Link
                to="/reader/my-fines"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                💰 Mis Multas
              </Link>
              <div className="px-3 py-2 text-sm border-t border-green-700 mt-2">
                👤 {user?.email || user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-green-700 hover:bg-green-800 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return null;
};

export default Navigation;