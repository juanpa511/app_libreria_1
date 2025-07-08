// src/services/apiService.js

const API_BASE_URL = 'http://localhost:8087/api';

// Función helper para hacer peticiones fetch
const makeRequest = async (url, options = {}) => {
  const defaultOptions = {
    mode: 'cors',
    credentials: 'include',
    headers: getAuthHeaders(),
    ...options
  };
  
  return await fetch(url, defaultOptions);
};

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
  console.log('=== HANDLE RESPONSE DEBUG ===');
  console.log('Response ok:', response.ok);
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error text:', errorText);
    let errorMessage = 'Error en la solicitud';
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    console.log('Final error message:', errorMessage);
    throw new Error(errorMessage);
  }
  
  const contentType = response.headers.get('content-type');
  console.log('Content-Type:', contentType);
  
  if (contentType && contentType.includes('application/json')) {
    const jsonData = await response.json();
    console.log('JSON response:', jsonData);
    return jsonData;
  }
  
  const textData = await response.text();
  console.log('Text response:', textData);
  return textData;
};

// ==================== AUTENTICACIÓN ====================

export const loginUser = async (credentials) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);
    
    // Guardar token y datos del usuario
    if (data.token) {
      const userData = {
        email: data.email || credentials.email,
        role: data.rolId || 2, // El backend envía rolId, no role
        roleId: parseInt(data.rolId) || 2
      };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/auth/register`, {
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
    return userData.role || userData.roleId || 2;
  }
  return 2; // Valor por defecto: Lector
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
    const response = await makeRequest(`${API_BASE_URL}/book/all`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBooksByType = async (type) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/book/all/${type}`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    console.log('=== API SERVICE DEBUG ===');
    console.log('URL:', `${API_BASE_URL}/book/new`);
    console.log('Headers:', getAuthHeaders());
    console.log('Data:', bookData);
    
    const response = await makeRequest(`${API_BASE_URL}/book/new`, {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    return await handleResponse(response);
  } catch (error) {
    console.error('API Service error:', error);
    throw error;
  }
};

export const findBookByTitle = async (title) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/book/find/${encodeURIComponent(title)}`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const createBookCopy = async (copyData) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/book/newcopy`, {
      method: 'POST',
      body: JSON.stringify(copyData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getAvailableCopies = async (title) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/book/copy/${encodeURIComponent(title)}`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== PRÉSTAMOS ====================

export const getAllLoans = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/booking/all`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/booking/new`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBookingsByEmail = async (email) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/booking/find/${encodeURIComponent(email)}`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const returnBook = async (userEmail, returnData) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/booking/return/${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      body: JSON.stringify(returnData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const renewBooking = async (bookingId) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/booking/renew/${bookingId}`, {
      method: 'POST',
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/booking/cancel/${bookingId}`, {
      method: 'POST',
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== LECTORES ====================

export const findReaderByEmail = async (email) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/reader/find/${encodeURIComponent(email)}`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const updateReaderState = async (email, stateData) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/reader/state/${encodeURIComponent(email)}`, {
      method: 'POST',
      body: JSON.stringify(stateData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/reader/all`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== MULTAS ====================

export const getAllFines = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/fine/all`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getFinesByEmail = async (email) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/fine/find/${encodeURIComponent(email)}`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const createFine = async (fineData) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/fine/new`, {
      method: 'POST',
      body: JSON.stringify(fineData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en createFine:', error);
    throw error;
  }
};

export const updateFine = async (id, fineData) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/fine/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fineData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const payFine = async (id) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/fine/${id}/pay`, {
      method: 'PUT',
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deleteFine = async (id) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/fine/${id}`, {
      method: 'DELETE',
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
  renewBooking,
  cancelBooking,
  
  // Readers
  findReaderByEmail,
  updateReaderState,
  getAllUsers,
  
  // Fines
  getFinesByEmail,
  createFine,
  updateFine,
  payFine,
  deleteFine,
  
  // Loans
  getAllLoans
};