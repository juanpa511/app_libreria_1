import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole, requireAdmin }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mostrar spinner mientras se carga la información del usuario
  if (loading) {
    return (
      <div className="protected-route-loading">
        <LoadingSpinner />
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validar acceso por rol requerido explícito
  if (requiredRole && user.role !== requiredRole) {
    return (
      <AccessDenied required={requiredRole} current={user.role} />
    );
  }

  // Validar acceso si se pide admin
  if (requireAdmin && user.role !== 'admin') {
    return (
      <AccessDenied required="admin" current={user.role} />
    );
  }

  // Acceso permitido
  return children;
};

// Subcomponente para acceso denegado
const AccessDenied = ({ required, current }) => (
  <div className="access-denied">
    <div className="access-denied-content">
      <h2>Acceso Denegado</h2>
      <p>No tienes permisos para acceder a esta página.</p>
      <p>Rol requerido: {required}</p>
      <p>Tu rol actual: {current}</p>
      <button 
        onClick={() => window.history.back()}
        className="back-button"
      >
        Volver
      </button>
    </div>
  </div>
);

export default ProtectedRoute;
