import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/NavigationPage.css'; 

const NavigationPage = () => {
  const { user, logout } = useAuth();

  const readerOptions = [
    {
      title: 'Mis Préstamos',
      description: 'Ver y gestionar mis préstamos de libros',
      icon: '📚',
      path: '/my-loans',
      color: 'blue'
    },
    {
      title: 'Mis Multas',
      description: 'Consultar mis multas pendientes',
      icon: '⚠️',
      path: '/my-fines',
      color: 'orange'
    },
    {
      title: 'Buscar Libros',
      description: 'Explorar el catálogo de libros',
      icon: '🔍',
      path: '/books',
      color: 'green'
    }
  ];

  const adminOptions = [
    {
      title: 'Gestionar Libros',
      description: 'Administrar el catálogo de libros',
      icon: '📖',
      path: '/admin/books',
      color: 'purple'
    },
    {
      title: 'Gestionar Préstamos',
      description: 'Administrar préstamos de libros',
      icon: '📋',
      path: '/admin/loans',
      color: 'blue'
    },
    {
      title: 'Gestionar Multas',
      description: 'Administrar multas de lectores',
      icon: '💰',
      path: '/admin/fines',
      color: 'red'
    },
    {
      title: 'Crear Libro',
      description: 'Agregar nuevos libros al catálogo',
      icon: '➕',
      path: '/admin/create-book',
      color: 'green'
    },
    {
      title: 'Registrar Préstamo',
      description: 'Crear nuevo préstamo de libro',
      icon: '📝',
      path: '/admin/loan',
      color: 'cyan'
    },
    {
      title: 'Procesar Devolución',
      description: 'Registrar devolución de libros',
      icon: '↩️',
      path: '/admin/return',
      color: 'teal'
    },
    {
      title: 'Buscar Lector',
      description: 'Encontrar información de lectores',
      icon: '👤',
      path: '/admin/search-reader',
      color: 'indigo'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navigation-page">
      <div className="navigation-container">
        <div className="navigation-header">
          <div className="user-welcome">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h1>Bienvenido, {user?.name || user?.email}</h1>
              <p className="user-role">
                {user?.role === 'admin' ? 'Administrador' : 'Lector'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>

        <div className="navigation-content">
          <div className="options-section">
            <h2>Opciones Disponibles</h2>
            <div className="options-grid">
              {user?.role === 'admin' 
                ? adminOptions.map((option, index) => (
                    <Link 
                      key={index} 
                      to={option.path} 
                      className={`option-card ${option.color}`}
                    >
                      <div className="option-icon">{option.icon}</div>
                      <h3>{option.title}</h3>
                      <p>{option.description}</p>
                    </Link>
                  ))
                : readerOptions.map((option, index) => (
                    <Link 
                      key={index} 
                      to={option.path} 
                      className={`option-card ${option.color}`}
                    >
                      <div className="option-icon">{option.icon}</div>
                      <h3>{option.title}</h3>
                      <p>{option.description}</p>
                    </Link>
                  ))
              }
            </div>
          </div>

          <div className="quick-stats">
            <h2>Estadísticas Rápidas</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>Libros</h3>
                  <p>Total en catálogo</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Lectores</h3>
                  <p>Usuarios registrados</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>Préstamos</h3>
                  <p>Activos hoy</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <h3>Multas</h3>
                  <p>Pendientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;