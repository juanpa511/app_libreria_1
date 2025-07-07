// src/services/apiService.js

const API_BASE_URL = 'http://localhost:8087/api';

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Función para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Error en la solicitud';
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
};

// ==================== AUTENTICACIÓN ====================

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);
    
    // Guardar token y datos del usuario
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        email: data.email || credentials.email,
        role: data.role,
        isAdmin: data.role === 'ADMIN',
        isReader: data.role === 'LECTOR'
      }));
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const getUserRole = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.role;
  }
  return null;
};

export const getUserEmail = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.email;
  }
  return null;
};

// ==================== LIBROS ====================

export const getAllBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/book/all`, {
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBooksByType = async (type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/book/all/${type}`, {
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/book/new`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const findBookByTitle = async (title) => {
  try {
    const response = await fetch(`${API_BASE_URL}/book/find/${encodeURIComponent(title)}`, {
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const createBookCopy = async (copyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/book/newcopy`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(copyData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getAvailableCopies = async (title) => {
  try {
    const response = await fetch(`${API_BASE_URL}/book/copy/${encodeURIComponent(title)}`, {
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== PRÉSTAMOS ====================

export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/new`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBookingsByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/find/${encodeURIComponent(email)}`, {
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const returnBook = async (bookingId, returnData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/return/${bookingId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(returnData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== LECTORES ====================

export const findReaderByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reader/find/${encodeURIComponent(email)}`, {
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const updateReaderState = async (email, stateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reader/state/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(stateData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== MULTAS ====================

export const getFinesByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fine/find/${encodeURIComponent(email)}`, {
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export default {
  // Auth
  loginUser,
  registerUser,
  logout,
  isAuthenticated,
  getUserRole,
  getUserEmail,
  
  // Books
  getAllBooks,
  getBooksByType,
  createBook,
  findBookByTitle,
  createBookCopy,
  getAvailableCopies,
  
  // Bookings
  createBooking,
  getBookingsByEmail,
  returnBook,
  
  // Readers
  findReaderByEmail,
  updateReaderState,
  
  // Fines
  getFinesByEmail
};