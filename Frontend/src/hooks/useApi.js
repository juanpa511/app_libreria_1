// src/hooks/useApi.js

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useApi = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApiCall = async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      return result;
    } catch (error) {
      // Si el error es de autenticación, hacer logout automático
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        logout();
        window.location.href = '/login';
      }
      
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const execute = handleApiCall;

  return {
    loading,
    error,
    execute,
    handleApiCall,
    clearError
  };
};

// Hook específico para obtener datos con useEffect
export const useApiData = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunction();
        setData(result);
      } catch (error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          logout();
          window.location.href = '/login';
        }
        
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction();
      setData(result);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        logout();
        window.location.href = '/login';
      }
      
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useApi;