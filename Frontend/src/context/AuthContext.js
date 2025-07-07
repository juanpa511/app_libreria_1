// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logout, isAuthenticated, getUserRole, getUserEmail } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const userRole = getUserRole();
          const userEmail = getUserEmail();
          
          setUser({
            email: userEmail,
            role: userRole,
            isAdmin: userRole === 'ADMIN',
            isReader: userRole === 'LECTOR'
          });
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para login
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const credentials = { email, password };
      const response = await loginUser(credentials);
      
      const userData = {
        email: response.email || email,
        role: response.role,
        isAdmin: response.role === 'ADMIN',
        isReader: response.role === 'LECTOR'
      };
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para registro
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await registerUser(userData);
      
      return { success: true, data: response };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para logout
  const handleLogout = () => {
    logout();
    setUser(null);
    setError(null);
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout: handleLogout,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isReader: user?.isReader || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;