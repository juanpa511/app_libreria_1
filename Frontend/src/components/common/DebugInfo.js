import React from 'react';
import { getUserRole, getUserEmail, isAuthenticated } from '../../services/apiService';

const DebugInfo = () => {
  const userRole = getUserRole();
  const userEmail = getUserEmail();
  const authenticated = isAuthenticated();
  const token = localStorage.getItem('token');

  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: '#f8f9fa', 
      border: '1px solid #dee2e6', 
      borderRadius: '4px',
      marginBottom: '10px',
      fontSize: '12px'
    }}>
      <strong>Debug Info:</strong>
      <br />
      Autenticado: {authenticated ? 'Sí' : 'No'}
      <br />
      Email: {userEmail || 'No disponible'}
      <br />
      Rol: {userRole === 1 ? 'Admin' : userRole === 2 ? 'Lector' : `Desconocido (${userRole})`}
      <br />
      Token: {token ? `${token.substring(0, 20)}...` : 'No disponible'}
    </div>
  );
};

export default DebugInfo; 