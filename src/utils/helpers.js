// helpers.js - Funciones auxiliares para la aplicación Library

/**
 * Formatea fechas para mostrar en la aplicación
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Formatea fecha y hora para mostrar en la aplicación
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calcula los días de diferencia entre dos fechas
 * @param {string|Date} startDate - Fecha inicial
 * @param {string|Date} endDate - Fecha final
 * @returns {number} Número de días de diferencia
 */
export const calculateDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Determina el estado de un préstamo basado en fechas
 * @param {string|Date} loanDate - Fecha del préstamo
 * @param {string|Date} returnDate - Fecha de devolución
 * @param {string|Date} actualReturnDate - Fecha real de devolución
 * @returns {string} Estado del préstamo
 */
export const getLoanStatus = (loanDate, returnDate, actualReturnDate = null) => {
  const now = new Date();
  const returnDateObj = new Date(returnDate);
  
  if (actualReturnDate) {
    return 'Devuelto';
  }
  
  if (now > returnDateObj) {
    return 'Vencido';
  }
  
  const daysUntilReturn = Math.ceil((returnDateObj - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilReturn <= 3) {
    return 'Por vencer';
  }
  
  return 'Activo';
};

/**
 * Calcula el monto de multa basado en días de retraso
 * @param {number} daysLate - Días de retraso
 * @param {number} dailyFine - Multa diaria (por defecto 500)
 * @returns {number} Monto total de multa
 */
export const calculateFineAmount = (daysLate, dailyFine = 500) => {
  return daysLate > 0 ? daysLate * dailyFine : 0;
};

/**
 * Formatea números como moneda chilena
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Filtra libros por tipo
 * @param {Array} books - Array de libros
 * @param {string} type - Tipo de libro a filtrar
 * @returns {Array} Libros filtrados
 */
export const filterBooksByType = (books, type) => {
  if (!type || type === 'all') return books;
  return books.filter(book => book.type === type);
};

/**
 * Busca libros por título o autor
 * @param {Array} books - Array de libros
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Libros que coinciden con la búsqueda
 */
export const searchBooks = (books, searchTerm) => {
  if (!searchTerm) return books;
  const term = searchTerm.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(term) || 
    book.author.toLowerCase().includes(term)
  );
};

/**
 * Obtiene el token de autenticación del localStorage
 * @returns {string|null} Token de autenticación
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Guarda el token de autenticación en localStorage
 * @param {string} token - Token a guardar
 */
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Elimina el token de autenticación del localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Obtiene los datos del usuario del localStorage
 * @returns {Object|null} Datos del usuario
 */
export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Guarda los datos del usuario en localStorage
 * @param {Object} userData - Datos del usuario
 */
export const setUserData = (userData) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

/**
 * Elimina los datos del usuario del localStorage
 */
export const removeUserData = () => {
  localStorage.removeItem('userData');
};

/**
 * Maneja errores de la API y devuelve un mensaje apropiado
 * @param {Error} error - Error de la API
 * @returns {string} Mensaje de error
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    switch (error.response.status) {
      case 400:
        return 'Datos inválidos. Por favor, verifica la información ingresada.';
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 500:
        return 'Error interno del servidor. Por favor, intenta más tarde.';
      default:
        return error.response.data.message || 'Error en el servidor.';
    }
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Por favor, verifica tu conexión a internet.';
  } else {
    // Error en la configuración de la petición
    return 'Error inesperado. Por favor, intenta nuevamente.';
  }
};

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Trunca texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};