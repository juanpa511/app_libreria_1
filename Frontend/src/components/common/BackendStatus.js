import React, { useState, useEffect } from 'react';
import { getAllFines } from '../../services/apiService';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await getAllFines();
        setStatus('connected');
      } catch (err) {
        setStatus('error');
        setError(err.message);
      }
    };

    checkBackendStatus();
  }, []);

  if (status === 'checking') {
    return <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
      Verificando conexión con el backend...
    </div>;
  }

  if (status === 'error') {
    return (
      <div style={{ padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24' }}>
        <strong>Error de conexión:</strong> {error}
        <br />
        <small>Asegúrate de que el backend esté ejecutándose en http://localhost:8087</small>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', color: '#155724' }}>
      ✓ Conexión con el backend establecida
    </div>
  );
};

export default BackendStatus; 