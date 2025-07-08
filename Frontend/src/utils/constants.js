// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // Books
  BOOKS: {
    BASE: '/books',
    SEARCH: '/books/search',
    BY_ID: (id) => `/books/${id}`,
    BY_CATEGORY: (category) => `/books/category/${category}`,
    AVAILABLE: '/books/available',
    POPULAR: '/books/popular',
  },
  
  // Loans
  LOANS: {
    BASE: '/loans',
    CREATE: '/loans',
    BY_ID: (id) => `/loans/${id}`,
    BY_READER: (readerId) => `/loans/reader/${readerId}`,
    ACTIVE: '/loans/active',
    OVERDUE: '/loans/overdue',
    RETURN: (id) => `/loans/${id}/return`,
    EXTEND: (id) => `/loans/${id}/extend`,
    HISTORY: '/loans/history',
  },
  
  // Fines
  FINES: {
    BASE: '/fines',
    BY_ID: (id) => `/fines/${id}`,
    BY_READER: (readerId) => `/fines/reader/${readerId}`,
    PAY: (id) => `/fines/${id}/pay`,
    PENDING: '/fines/pending',
    OVERDUE: '/fines/overdue',
  },
  
  // Readers
  READERS: {
    BASE: '/readers',
    BY_ID: (id) => `/readers/${id}`,
    SEARCH: '/readers/search',
    ACTIVE: '/readers/active',
    INACTIVE: '/readers/inactive',
    PROFILE: '/readers/profile',
    UPDATE: (id) => `/readers/${id}`,
  },
  
  // Statistics
  STATS: {
    DASHBOARD: '/stats/dashboard',
    BOOKS: '/stats/books',
    LOANS: '/stats/loans',
    READERS: '/stats/readers',
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 1,
  READER: 2,
};

// Role Names for display
export const ROLE_NAMES = {
  1: 'Administrador',
  2: 'Lector',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
};

// Book Status
export const BOOK_STATUS = {
  AVAILABLE: 'AVAILABLE',
  BORROWED: 'BORROWED',
  RESERVED: 'RESERVED',
  MAINTENANCE: 'MAINTENANCE',
  LOST: 'LOST',
  DAMAGED: 'DAMAGED',
};

// Loan Status
export const LOAN_STATUS = {
  ACTIVE: 'ACTIVE',
  RETURNED: 'RETURNED',
  OVERDUE: 'OVERDUE',
  EXTENDED: 'EXTENDED',
  CANCELLED: 'CANCELLED',
};

// Fine Status
export const FINE_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  OVERDUE: 'OVERDUE',
};

// Book Categories
export const BOOK_CATEGORIES = {
  FICTION: 'FICTION',
  NON_FICTION: 'NON_FICTION',
  SCIENCE: 'SCIENCE',
  TECHNOLOGY: 'TECHNOLOGY',
  HISTORY: 'HISTORY',
  BIOGRAPHY: 'BIOGRAPHY',
  CHILDREN: 'CHILDREN',
  ROMANCE: 'ROMANCE',
  MYSTERY: 'MYSTERY',
  FANTASY: 'FANTASY',
  ACADEMIC: 'ACADEMIC',
  REFERENCE: 'REFERENCE',
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  EMAIL_INVALID: 'El email no es válido',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  PHONE_INVALID: 'El número de teléfono no es válido',
  DATE_INVALID: 'La fecha no es válida',
  NUMBER_INVALID: 'El valor debe ser un número',
  MIN_LENGTH: (min) => `Debe tener al menos ${min} caracteres`,
  MAX_LENGTH: (max) => `No debe exceder ${max} caracteres`,
  MIN_VALUE: (min) => `El valor mínimo es ${min}`,
  MAX_VALUE: (max) => `El valor máximo es ${max}`,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, intente nuevamente.',
  UNAUTHORIZED: 'No autorizado. Por favor, inicie sesión.',
  FORBIDDEN: 'No tiene permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  SERVER_ERROR: 'Error del servidor. Por favor, intente más tarde.',
  VALIDATION_ERROR: 'Error de validación. Verifique los datos ingresados.',
  TIMEOUT_ERROR: 'Tiempo de espera agotado. Por favor, intente nuevamente.',
  UNKNOWN_ERROR: 'Error desconocido. Por favor, contacte al administrador.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
  REGISTER_SUCCESS: 'Registro exitoso',
  BOOK_CREATED: 'Libro creado exitosamente',
  BOOK_UPDATED: 'Libro actualizado exitosamente',
  BOOK_DELETED: 'Libro eliminado exitosamente',
  LOAN_CREATED: 'Préstamo creado exitosamente',
  LOAN_RETURNED: 'Libro devuelto exitosamente',
  FINE_PAID: 'Multa pagada exitosamente',
  PROFILE_UPDATED: 'Perfil actualizado exitosamente',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 5,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  INPUT: 'YYYY-MM-DD',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  TIME_ONLY: 'HH:mm',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  REMEMBER_ME: 'remember_me',
  LAST_LOGIN: 'last_login',
  CART_ITEMS: 'cart_items',
  SEARCH_HISTORY: 'search_history',
  USER_PREFERENCES: 'user_preferences',
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#3498db',
  SECONDARY: '#2c3e50',
  SUCCESS: '#27ae60',
  DANGER: '#e74c3c',
  WARNING: '#f39c12',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40',
  MUTED: '#6c757d',
};

// Loan Settings
export const LOAN_SETTINGS = {
  MAX_LOAN_DAYS: 14,
  MAX_EXTENSION_DAYS: 7,
  MAX_BOOKS_PER_USER: 3,
  FINE_PER_DAY: 500, // en pesos chilenos
  MAX_FINE_AMOUNT: 10000,
  GRACE_PERIOD_DAYS: 1,
};

// File Upload Settings
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+56)?[0-9]{8,9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  RUT: /^[0-9]+-[0-9Kk]{1}$/,
  ISBN: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
};

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  BOOKS: '/books',
  BOOK_DETAIL: '/books/:id',
  MY_LOANS: '/my-loans',
  MY_FINES: '/my-fines',
  PROFILE: '/profile',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_BOOKS: '/admin/books',
  ADMIN_LOANS: '/admin/loans',
  ADMIN_FINES: '/admin/fines',
  ADMIN_READERS: '/admin/readers',
  CREATE_BOOK: '/admin/books/create',
  EDIT_BOOK: '/admin/books/:id/edit',
  LOAN_MANAGEMENT: '/admin/loans',
  RETURN_BOOK: '/admin/return',
  SEARCH_READER: '/admin/search-reader',
  
  // Protected Routes
  PROTECTED: [
    '/my-loans',
    '/my-fines',
    '/profile',
    '/admin',
    '/admin/*',
  ],
};

// Menu Items
export const MENU_ITEMS = {
  READER: [
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Libros', path: '/books', icon: 'book' },
    { label: 'Mis Préstamos', path: '/my-loans', icon: 'list' },
    { label: 'Mis Multas', path: '/my-fines', icon: 'dollar-sign' },
    { label: 'Perfil', path: '/profile', icon: 'user' },
  ],
  
  ADMIN: [
    { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { label: 'Libros', path: '/admin/books', icon: 'book' },
    { label: 'Préstamos', path: '/admin/loans', icon: 'list' },
    { label: 'Multas', path: '/admin/fines', icon: 'dollar-sign' },
    { label: 'Lectores', path: '/admin/readers', icon: 'users' },
    { label: 'Devoluciones', path: '/admin/return', icon: 'arrow-left' },
    { label: 'Buscar Lector', path: '/admin/search-reader', icon: 'search' },
  ],
};

// Status Colors
export const STATUS_COLORS = {
  ACTIVE: '#27ae60',
  INACTIVE: '#e74c3c',
  PENDING: '#f39c12',
  SUSPENDED: '#e67e22',
  AVAILABLE: '#27ae60',
  BORROWED: '#f39c12',
  OVERDUE: '#e74c3c',
  RETURNED: '#27ae60',
  PAID: '#27ae60',
};

// Export all constants as default
export default {
  API_CONFIG,
  API_ENDPOINTS,
  USER_ROLES,
  USER_STATUS,
  BOOK_STATUS,
  LOAN_STATUS,
  FINE_STATUS,
  BOOK_CATEGORIES,
  VALIDATION_MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  DATE_FORMATS,
  STORAGE_KEYS,
  THEME_COLORS,
  LOAN_SETTINGS,
  FILE_UPLOAD,
  REGEX_PATTERNS,
  ROUTES,
  MENU_ITEMS,
  STATUS_COLORS,
  ROLE_NAMES,
};