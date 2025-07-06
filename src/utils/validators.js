// validators.js - Funciones de validación para la aplicación Library

/**
 * Valida si un email tiene formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido, false en caso contrario
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {Object} Objeto con isValid y errores
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('La contraseña es requerida');
  } else {
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida si un RUT chileno es válido
 * @param {string} rut - RUT a validar
 * @returns {boolean} true si es válido, false en caso contrario
 */
export const isValidRUT = (rut) => {
  if (!rut) return false;
  
  // Remover puntos y guiones
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Verificar formato
  if (!/^[0-9]+[0-9Kk]$/.test(cleanRut)) {
    return false;
  }
  
  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const verificador = cleanRut.slice(-1).toUpperCase();
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    suma += parseInt(rutNumber[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const digitoCalculado = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString();
  
  return verificador === digitoCalculado;
};

/**
 * Formatea un RUT chileno
 * @param {string} rut - RUT a formatear
 * @returns {string} RUT formateado
 */
export const formatRUT = (rut) => {
  if (!rut) return '';
  
  // Remover puntos y guiones
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Verificar si tiene al menos 2 caracteres
  if (cleanRut.length < 2) return cleanRut;
  
  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const verificador = cleanRut.slice(-1);
  
  // Formatear número con puntos
  const formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedNumber}-${verificador}`;
};

/**
 * Valida si un nombre es válido
 * @param {string} name - Nombre a validar
 * @returns {Object} Objeto con isValid y mensaje de error
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'El nombre es requerido' };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'El nombre no puede exceder 50 caracteres' };
  }
  
  // Solo letras, espacios y acentos
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'El nombre solo puede contener letras y espacios' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Valida si un teléfono chileno es válido
 * @param {string} phone - Teléfono a validar
 * @returns {Object} Objeto con isValid y mensaje de error
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'El teléfono es requerido' };
  }
  
  // Remover espacios y caracteres especiales
  const cleanPhone = phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
  
  // Validar formato chileno (con o sin código de país)
  const phoneRegex = /^(\+?56)?[2-9]\d{7,8}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Formato de teléfono inválido' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Valida datos de registro de usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Object} Objeto con isValid y errores
 */
export const validateUserRegistration = (userData) => {
  const errors = {};
  
  // Validar nombre
  const nameValidation = validateName(userData.firstName);
  if (!nameValidation.isValid) {
    errors.firstName = nameValidation.error;
  }
  
  // Validar apellido
  const lastNameValidation = validateName(userData.lastName);
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error;
  }
  
  // Validar email
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.email = 'Email inválido';
  }
  
  // Validar RUT
  if (!userData.rut || !isValidRUT(userData.rut)) {
    errors.rut = 'RUT inválido';
  }
  
  // Validar teléfono
  const phoneValidation = validatePhone(userData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }
  
  // Validar contraseña
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors.join(', ');
  }
  
  // Validar confirmación de contraseña
  if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida datos de libro
 * @param {Object} bookData - Datos del libro
 * @returns {Object} Objeto con isValid y errores
 */
export const validateBook = (bookData) => {
  const errors = {};
  
  // Validar título
  if (!bookData.title || bookData.title.trim() === '') {
    errors.title = 'El título es requerido';
  } else if (bookData.title.length > 200) {
    errors.title = 'El título no puede exceder 200 caracteres';
  }
  
  // Validar autor
  if (!bookData.author || bookData.author.trim() === '') {
    errors.author = 'El autor es requerido';
  } else if (bookData.author.length > 100) {
    errors.author = 'El autor no puede exceder 100 caracteres';
  }
  
  // Validar ISBN
  if (!bookData.isbn || bookData.isbn.trim() === '') {
    errors.isbn = 'El ISBN es requerido';
  } else if (!/^[0-9]{10}([0-9]{3})?$/.test(bookData.isbn.replace(/-/g, ''))) {
    errors.isbn = 'El ISBN debe tener 10 o 13 dígitos';
  }
  
  // Validar tipo
  if (!bookData.type || bookData.type.trim() === '') {
    errors.type = 'El tipo es requerido';
  }
  
  // Validar editorial
  if (!bookData.publisher || bookData.publisher.trim() === '') {
    errors.publisher = 'La editorial es requerida';
  } else if (bookData.publisher.length > 100) {
    errors.publisher = 'La editorial no puede exceder 100 caracteres';
  }
  
  // Validar año de publicación
  if (!bookData.publicationYear) {
    errors.publicationYear = 'El año de publicación es requerido';
  } else {
    const year = parseInt(bookData.publicationYear);
    const currentYear = new Date().getFullYear();
    if (year < 1000 || year > currentYear) {
      errors.publicationYear = `El año debe estar entre 1000 y ${currentYear}`;
    }
  }
  
  // Validar cantidad
  if (!bookData.quantity || bookData.quantity < 1) {
    errors.quantity = 'La cantidad debe ser al menos 1';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida datos de préstamo
 * @param {Object} loanData - Datos del préstamo
 * @returns {Object} Objeto con isValid y errores
 */
export const validateLoan = (loanData) => {
  const errors = {};
  
  // Validar lector
  if (!loanData.readerId) {
    errors.readerId = 'Debe seleccionar un lector';
  }
  
  // Validar libro
  if (!loanData.bookId) {
    errors.bookId = 'Debe seleccionar un libro';
  }
  
  // Validar fecha de préstamo
  if (!loanData.loanDate) {
    errors.loanDate = 'La fecha de préstamo es requerida';
  } else {
    const loanDate = new Date(loanData.loanDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (loanDate < today) {
      errors.loanDate = 'La fecha de préstamo no puede ser anterior a hoy';
    }
  }
  
  // Validar fecha de devolución
  if (!loanData.returnDate) {
    errors.returnDate = 'La fecha de devolución es requerida';
  } else if (loanData.loanDate) {
    const loanDate = new Date(loanData.loanDate);
    const returnDate = new Date(loanData.returnDate);
    
    if (returnDate <= loanDate) {
      errors.returnDate = 'La fecha de devolución debe ser posterior a la fecha de préstamo';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida datos de devolución
 * @param {Object} returnData - Datos de devolución
 * @returns {Object} Objeto con isValid y errores
 */
export const validateReturn = (returnData) => {
  const errors = {};
  
  // Validar fecha de devolución
  if (!returnData.returnDate) {
    errors.returnDate = 'La fecha de devolución es requerida';
  } else {
    const returnDate = new Date(returnData.returnDate);
    const today = new Date();
    
    if (returnDate > today) {
      errors.returnDate = 'La fecha de devolución no puede ser futura';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida si una fecha es válida
 * @param {string} date - Fecha a validar
 * @returns {boolean} true si es válida, false en caso contrario
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Valida si un campo es requerido
 * @param {any} value - Valor a validar
 * @returns {boolean} true si tiene valor, false en caso contrario
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Valida longitud mínima
 * @param {string} value - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} true si cumple la longitud, false en caso contrario
 */
export const hasMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Valida longitud máxima
 * @param {string} value - Valor a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} true si cumple la longitud, false en caso contrario
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Valida si un número está en un rango
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} true si está en el rango, false en caso contrario
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};